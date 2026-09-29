# Services & API Cleanup Spec

Kalinga works, but the service and route layer was written early on and has grown a lot of
ceremony (classes wrapped by interfaces wrapped by function exports) plus a few real bugs.
This spec covers what changes, what stays the same, and the order the work lands in.

## Goals

- Fix the bugs listed below, starting with the auth/session leak.
- Replace the class-based services with plain functions.
- Keep API routes thin and consistent: check auth, validate input, call a service, respond.
- Don't change what the UI sees unless a bug requires it.

## Non-goals

- UI redesigns or new features.
- Database schema changes beyond `src/migrations/001` and `002`.
- Adding a test suite (see [Verification](#verification)).

## Decisions already made

| Topic | Decision |
|---|---|
| OOP classes | Remove. It was a school requirement, and it's no longer needed. |
| Row-level security | Enabled on all tables. API ownership checks are added anyway as a second layer. |
| Shelter application documents | Make them private (see [Private shelter documents](#private-shelter-documents)). |
| Authorship | Nelson is the sole author, one commit per area, AI model files are never committed. |

## Bugs to fix

| # | Severity | Bug | Where |
|---|---|---|---|
| 1 | Critical | Service classes and `auth.ts` are module-level singletons that cache the Supabase client from the **first request**. That client is tied to one request's cookies, so later requests can run as the wrong user (e.g. shelter profile updates, adoption requests, role checks). | `utils/auth.ts`, `shelterService`, `adoptionService`, `petMediaService`, `likeService`, `videoViewService` |
| 2 | High | Admin API routes never check that the caller is an admin, and `reviewedBy` is taken from the request body, so anyone can fill it in. | `api/admin/applications/**` |
| 3 | High | Shelter application documents (owner ID, lease, registration cert) are stored under public URLs. | `authService.uploadShelterApplicationFile` |
| 4 | High | User avatar upload uses the **browser** Supabase client on the server, so there's no session and it always fails with "Not signed in." | `usersService.uploadMyAvatar` |
| 5 | Medium | Liked videos never appear: video (media) IDs are passed to `getVideosByPetIds`. | `likeService.getLikedStuffByUser` |
| 6 | Medium | Donation POST spreads the raw request body into the insert, and never checks that the caller owns the shelter. | `api/shelters/[id]/donation` |
| 7 | Medium | Writes that don't check ownership in the API, so they rely on RLS alone: foster create/update/delete, pet photo upload, video upload. | `api/foster/**`, `api/pets/photos`, `api/videos` |
| 8 | Medium | Reads that take someone else's ID with no check: user/shelter adoption lists, adoption answers, message thread details. | `api/users/[id]/adoption*`, `api/shelters/[id]/adoptions`, `api/messages/threads/[threadId]` |
| 9 | Low | `/api/messages/reply` duplicates `POST /api/messages/threads/[threadId]`, skips its checks, and always sends as a user (shelters replying through it produce wrong rows). | `api/messages/reply` |
| 10 | Low | `getSheltersByIds` loads **every** shelter plus every pet to return a few rows. | `shelterService` |
| 11 | Low | Debug `console.log`s left in request handlers (one prints the full shelter profile body). | `api/shelters/me`, `petMediaService.createVideo` |

To verify while working (these may be intended behavior):

- `getPetStatus(petId)` queries `adoption_requests` **by id = petId**. Check what `/api/pets/[id]/status` is meant to return.
- `year_inShelter` is stored as a year and shown as `currentYear - year`, but `createPet` saves the form's `years_inShelter` value directly. Check the add-pet form.

## Conventions after the cleanup

### Services — `src/lib/services/<area>.ts`

- Plain exported `async` functions. No classes, interfaces, or wrapper re-exports.
- Create the Supabase client **inside each function** (`createServerSupabase()`); never keep it at module level.
- Return data directly. For expected failures, throw `ApiError(status, message)`.
- Only use the admin (service-role) client where it's really needed: signup and account deletion, password change, signed document URLs.

### Shared helpers — `src/lib/api.ts`

```ts
export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function errorResponse(error: unknown) {
  // ApiError -> its status; anything else -> 500 and gets logged
}
```

### Auth — `src/lib/utils/auth.ts`

- Plain functions: `getAuthUser`, `requireAuth`, `requireRole`, `requireUser`, `requireShelter`, `requireAdmin`, and `requireOwnedShelterId` (returns the caller's shelter id).
- They throw `ApiError(401)` / `ApiError(403)`, so layouts that already use `try { … } catch { redirect() }` keep working.
- `getUserId.ts` merges into this file.

### Routes

```ts
export async function POST(req: Request) {
  try {
    const user = await requireShelter();
    const input = Schema.parse(await req.json());
    const data = await createThing(user.id, input);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
```

- Errors are always `{ error: string }` (the UI already reads `json.error`).
- Success payloads keep their **current shape** per route, to avoid churn in the UI.
- Identity (user id, shelter id, reviewer) always comes from the session, never from the request body or query string.

### Client fetch helpers — `src/lib/services/<area>Client.ts`

- Plain functions that share one `fetchJson()` helper, which throws on `!res.ok` with `json.error`.

## Route changes

| Route | Change |
|---|---|
| `GET/POST/DELETE /api/likes` | Stays the single likes endpoint (status / like / unlike). |
| `/api/likes/status` | **Removed**. `LikeButton` uses `GET /api/likes`. |
| `POST/DELETE /api/likes/me` | **Removed** (duplicates). `GET /api/likes/me` stays. |
| `/api/messages/reply` | **Removed**. `ComposeView` uses `POST /api/messages/threads/[threadId]`; the sender side comes from the caller's role. |
| `GET /api/messages/threads` | Works out user vs shelter from the session; the `userId`/`shelterId` query params go away. |
| `GET /api/messages/threads/[threadId]` | Returns 404 unless the caller is part of the thread. |
| `/api/admin/applications/**` | `requireAdmin()`; `reviewedBy` = the caller. |
| `POST /api/shelters/[id]/donation` | `requireShelter()`, the caller must own `[id]`, and only allowed fields are inserted. |
| `/api/foster/**`, `/api/pets/photos`, `/api/videos` | The caller must own the pet's shelter. |
| `/api/users/[id]/adoption` | The caller must be `[id]`. |
| `/api/shelters/[id]/adoptions` | The caller must own `[id]`. |
| `/api/users/[id]/adoption/answer` | The caller must be the applicant or the owning shelter. |

Routes with no caller found during the scan are removed only after a grep confirms nothing uses them.

## Private shelter documents

Shelter avatars and application documents currently share the public `shelter_photos` bucket,
so making that bucket private would break avatars. Instead:

1. Create a **private** bucket `shelter_documents` in the Supabase dashboard (manual step for Nelson).
2. New applications upload the registration cert, owner ID and lease there, and save the **storage path** in `cert_url` / `id_url` / `lease_url`.
3. The admin review page gets 10-minute signed links (`createSignedUrl`) through the admin client, only after `requireAdmin()`.
4. Existing rows still hold full public URLs. The signing code accepts both forms: a full URL is shown as-is until it's moved.
5. Optional follow-up: a one-off script that copies the old files into the private bucket, rewrites the paths, and deletes the public copies.

The shelter photo from the application stays public, since it's shown on the profile.

## Work order (one commit each)

1. **Auth foundation**: `api.ts`, plain-function `auth.ts`, merge `getUserId`, delete the unused `lib/env.ts`. Fixes bug 1 for role checks.
2. **Pets & media**: `petService`, `petMediaService`, pet/photo/video routes, `petClient`. Fixes 1 and 7, removes debug logs.
3. **Shelters & donations**: `shelterService`, shelter routes, `shelterClient`, `donationService`. Fixes 1, 6, 10 and 11.
4. **Likes**: `likeService`, merges the likes routes, updates `LikeButton`/`UserTab`. Fixes 1 and 5.
5. **Adoption**: `adoptionService`, adoption routes, `adoptionClient`. Fixes 1 and 8, resolves `getPetStatus`.
6. **Messages**: removes `/reply`, session-based inbox, participant checks. Fixes 8 and 9.
7. **Admin & auth service**: `requireAdmin` on routes, flattened `authService`, private documents. Fixes 2 and 3.
8. **Foster, views, users**: `fosterService`, `videoViewService`, `usersService`. Fixes 4 and 7.
9. **Types tidy-up**: remove the `I*Service` interfaces and unused types.

## Verification

After each commit:

- `npx tsc --noEmit`: nothing beyond the 3 existing SVG-import errors (they come from the generated `next-env.d.ts`).
- `npx eslint src`: clean.
- The dev server runs against Supabase. Claude checks the logged-out pages (feed, explore, shelters, pet/shelter profiles) and that protected routes return 401/403 without a session.
- Claude does not sign in to the real Supabase project. Nelson clicks through the logged-in flows touched by that commit (a checklist is given per commit).

## Open questions

- Should the old documents in the public bucket be moved now (step 5 above), or only new uploads go private?
- `/api/pets/[id]/status`: what should it return (see "To verify" above)?
