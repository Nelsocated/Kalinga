/**
 * Captures the real app at phone size for the tour video.
 * Never submits the adoption form and never sends a message.
 *
 * Env: KALINGA_URL (default http://localhost:3010), TOUR_INTRO_PET and TOUR_PET (available pets
 * with videos; the test account must not have liked TOUR_PET), TOUR_THREAD_WITH (shelter name
 * on the test account's thread).
 */
import { chromium, type Page } from "playwright";
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { parseLayout } from "../src/lib/layout.ts";
import type { Box } from "../src/lib/geometry.ts";

const BASE = process.env.KALINGA_URL ?? "http://localhost:3010";
const p = (u: URL) => fileURLToPath(u);
const OUT = new URL("../public/", import.meta.url);
const SHOTS = new URL("captures/", OUT);
const CLIPS = new URL("clips/", OUT);
const AUTH_DIR = new URL("../.auth/", import.meta.url);
const AUTH = new URL("state.json", AUTH_DIR);
const LOGO = new URL("../../public/kalinga_logo(ver2).svg", import.meta.url);

// Labels end with a required asterisk, so match the start of the label
const FIELD_LABELS = [/^Full name/, /^Email/, /^Phone number/, /^Address/];
const SAMPLE = ["Maria Santos", "maria.santos@example.com", "+63 917 555 0142", "Quezon City"];

function need(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} before running capture (see the top of capture.ts).`);
  return value;
}

const introPet = need("TOUR_INTRO_PET");
const pet = need("TOUR_PET");
const threadWith = need("TOUR_THREAD_WITH");

const shot = (page: Page, file: string, fullPage = false) => page.screenshot({ path: p(new URL(file, SHOTS)), fullPage });

/** Waits for data, fonts and images, and hides the Next dev indicator. */
async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((img) => !img.complete)
        .map((img) => new Promise((resolve) => (img.onload = img.onerror = resolve))),
    );
  });
  await page.waitForTimeout(400);
}

async function open(page: Page, path: string) {
  await page.goto(`${BASE}${path}`);
  await settle(page);
  if (new URL(page.url()).pathname.startsWith("/login")) {
    throw new Error("The saved session has expired. Delete video/.auth/state.json and run capture again to sign in.");
  }
}

/** Tags the first fully on-screen element matching `selector` as data-tour=`tag`; returns its viewport box. */
async function mark(page: Page, selector: string, tag: string): Promise<Box> {
  const box = await page.evaluate(
    ([sel, name]) => {
      const el = [...document.querySelectorAll<Element>(sel)].find((node) => {
        const r = node.getBoundingClientRect();
        return r.width > 0 && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth;
      });
      if (!el) return null;
      el.setAttribute("data-tour", name);
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    },
    [selector, tag] as const,
  );
  if (!box) throw new Error(`Couldn't find ${tag} (${selector}) on ${page.url()}`);
  return box;
}

async function hide(page: Page, tag: string) {
  await page.evaluate((name) => {
    (document.querySelector(`[data-tour="${name}"]`) as HTMLElement | SVGElement).style.visibility = "hidden";
  }, tag);
}

/** Feed deep links take a video (media) id; look up the pet's first video in the feed. */
async function mediaFor(page: Page, petId: string): Promise<string> {
  const res = await page.request.get(`${BASE}/api/feed`);
  const { data } = (await res.json()) as { data: { pet_id: string; media_id: string }[] };
  const item = data.find((entry) => entry.pet_id === petId);
  if (!item) throw new Error(`Pet ${petId} has no video in the feed; pick a pet with a video.`);
  return item.media_id;
}

/** The intro pet: shown for one swipe, video paused on a real frame. */
async function captureIntro(page: Page) {
  await open(page, `/site/home/pet/${await mediaFor(page, introPet)}`);
  await mark(page, "video", "video");
  await page.evaluate(async () => {
    const v = document.querySelector<HTMLVideoElement>('[data-tour="video"]')!;
    if (v.readyState < 2) await new Promise((r) => v.addEventListener("loadeddata", r, { once: true }));
    v.pause();
  });
  await shot(page, "feed-1.png");
}

/** The main pet: video and like icon hidden so the video draws the real clip and the like morph. */
async function captureMain(page: Page) {
  await open(page, `/site/home/pet/${await mediaFor(page, pet)}`);
  const video = await mark(page, "video", "video");
  await mark(page, 'button[aria-label="Like"], button[aria-label="Unlike"]', "like");
  if ((await page.getAttribute('[data-tour="like"]', "aria-pressed")) === "true") {
    throw new Error(`The test account already likes pet ${pet}. Unlike it in the app, then run capture again.`);
  }
  const likeIcon = await mark(page, '[data-tour="like"] svg', "like-icon");
  const name = await mark(page, `a[href="/site/profiles/pets/${pet}"]`, "name");
  const src = await page.evaluate(() => document.querySelector<HTMLVideoElement>('[data-tour="video"]')!.currentSrc);
  await hide(page, "video");
  await hide(page, "like-icon");
  // The video sits under the name, caption, rail and tab bar: clear every background behind it
  // so the screenshot is transparent there and the tour draws the real clip underneath
  await page.evaluate(() => {
    let el: HTMLElement | null = document.querySelector<HTMLElement>('[data-tour="video"]');
    while (el) {
      el.style.background = "transparent";
      el = el.parentElement;
    }
  });
  await page.screenshot({ path: p(new URL("feed-2.png", SHOTS)), omitBackground: true });
  return { feed: { video, likeIcon, name }, src };
}

async function captureProfile(page: Page) {
  await open(page, `/site/profiles/pets/${pet}`);
  const measured = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Apply to adopt");
    const a = btn?.getBoundingClientRect();
    const bar = [...document.querySelectorAll<HTMLElement>("body *")].find((el) => {
      const r = el.getBoundingClientRect();
      return getComputedStyle(el).position === "fixed" && Math.round(r.bottom) === innerHeight && Math.round(r.width) === innerWidth;
    });
    const b = bar?.getBoundingClientRect();
    // The like button beside Apply: hidden in the shots so the video can draw it already liked
    const likeSvg = document.querySelector('main button[aria-label="Like"] svg, main button[aria-label="Unlike"] svg') as SVGElement | null;
    const l = likeSvg?.getBoundingClientRect();
    if (likeSvg) likeSvg.style.visibility = "hidden";
    return {
      likeIcon: l ? { x: l.x, y: l.y + scrollY, width: l.width, height: l.height } : null,
      apply: a ? { x: a.x, y: a.y + scrollY, width: a.width, height: a.height } : null,
      tabBar: b ? { x: b.x, y: b.y, width: b.width, height: b.height } : null,
    };
  });
  if (!measured.apply) throw new Error(`No Apply to adopt button on pet ${pet}. Is the pet still available?`);
  if (!measured.likeIcon) throw new Error(`No like button beside Apply to adopt on pet ${pet}.`);
  // The viewport shot (for the tab bar) is taken after the like icon is hidden
  await shot(page, "profile-top.png");
  // Fixed and sticky bars would repeat down a full-page shot; the video draws the tab bar from profile-top.png
  await page.evaluate(() => {
    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      const pos = getComputedStyle(el).position;
      if (pos === "fixed" || pos === "sticky") el.style.visibility = "hidden";
    }
  });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await shot(page, "profile.png", true);
  return { height, apply: measured.apply, likeIcon: measured.likeIcon, tabBar: measured.tabBar };
}

async function captureApply(page: Page) {
  await open(page, `/site/profiles/pets/${pet}`);
  await page.getByRole("button", { name: "Apply to adopt" }).click();
  await page.getByRole("dialog").waitFor();
  await page.waitForFunction(() => !document.body.textContent?.includes("Checking whether this pet is still available"));
  if (await page.getByText("Already adopted").count()) {
    throw new Error(`Pet ${pet} is adopted; pick an available pet for TOUR_PET.`);
  }
  await page.getByRole("button", { name: "Send application" }).waitFor();
  await page.waitForTimeout(600); // the sheet finishes rising

  const fields: Box[] = [];
  for (const label of FIELD_LABELS) {
    const r = await page.getByLabel(label).boundingBox();
    if (!r) throw new Error(`Couldn't find the ${label} field`);
    fields.push({ x: r.x, y: r.y, width: r.width, height: r.height });
  }
  await shot(page, "apply-0.png");
  for (const [i, label] of FIELD_LABELS.entries()) {
    await page.getByLabel(label).fill(SAMPLE[i]);
    await page.locator(":focus").blur();
    await page.waitForTimeout(150);
    await shot(page, `apply-${i + 1}.png`);
  }
  // Leave without sending: Cancel closes the sheet and nothing is submitted
  await page.getByRole("button", { name: "Cancel" }).click();
  return { fields };
}

async function captureThread(page: Page) {
  await open(page, "/site/messages");
  await page.getByText(threadWith, { exact: false }).first().click();
  await page.waitForTimeout(1200);
  const bubble = await page.evaluate(() => {
    const last = [...document.querySelectorAll<HTMLElement>("li.flex.items-end")].at(-1);
    if (!last) return null;
    last.setAttribute("data-tour", "bubble");
    const r = last.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  if (!bubble) throw new Error(`The thread with ${threadWith} has no messages to show.`);
  await shot(page, "thread-after.png");
  await hide(page, "bubble");
  await shot(page, "thread-before.png");
  return { bubble };
}

/** Remotion's own ffmpeg (no shell, no npx: `npx remotion ffmpeg` hung on Windows). */
function ffmpegPath(): string {
  const dir = new URL("../node_modules/@remotion/", import.meta.url);
  const pkg = readdirSync(dir).find((name) => name.startsWith("compositor-"));
  const bin = pkg && readdirSync(new URL(`${pkg}/`, dir)).find((name) => /^ffmpeg(\.exe)?$/.test(name));
  if (!pkg || !bin) throw new Error("Couldn't find Remotion's ffmpeg; run npm install in video/.");
  return p(new URL(`${pkg}/${bin}`, dir));
}

/** Downloads the main pet's video and trims it to 12s (it plays through the slide to the profile), 960px tall, no audio. */
async function downloadClip(src: string) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Couldn't download the pet video (${res.status})`);
  const raw = p(new URL("pet-raw", CLIPS));
  writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
  const out = p(new URL("pet.mp4", CLIPS));
  const run = spawnSync(
    ffmpegPath(),
    ["-y", "-i", raw, "-t", "12", "-vf", "scale=-2:960", "-an", "-c:v", "libx264", "-crf", "24", "-pix_fmt", "yuv420p", out],
    { stdio: "inherit" },
  );
  if (run.status !== 0) throw new Error("ffmpeg couldn't trim the pet video");
}

let current: Page | null = null;

async function main() {
  for (const dir of [SHOTS, CLIPS, AUTH_DIR]) mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    storageState: existsSync(AUTH) ? p(AUTH) : undefined,
  });
  // The dev server compiles each route on first visit, which can take well over 30s
  context.setDefaultNavigationTimeout(120_000);
  context.setDefaultTimeout(60_000);
  const page = await context.newPage();
  current = page;

  // Messages streams a loading screen first and redirects to /login only after that, so settle before checking
  await page.goto(`${BASE}/site/messages`);
  await settle(page);
  if (new URL(page.url()).pathname.startsWith("/login")) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    await rl.question("Sign in to the test adopter account in the browser window, then press Enter here. ");
    rl.close();
  }
  await open(page, "/site/messages"); // throws if still signed out
  // Save the session so later runs skip signing in
  await context.storageState({ path: p(AUTH) });

  await captureIntro(page);
  const { feed, src } = await captureMain(page);
  const profile = await captureProfile(page);
  const apply = await captureApply(page);
  const thread = await captureThread(page);
  await browser.close();

  const layout = parseLayout({ viewport: { width: 390, height: 844 }, feed, profile, apply, thread });
  writeFileSync(new URL("layout.json", SHOTS), JSON.stringify(layout, null, 2));
  copyFileSync(p(LOGO), p(new URL("logo.svg", OUT)));
  await downloadClip(src);
  console.log("Captured. Next: npm run studio to preview, or npm run render.");
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  // Show what the page looked like when it failed
  await current?.screenshot({ path: p(new URL("failed.png", SHOTS)) }).catch(() => {});
  if (current) console.error("Screenshot of the failure: video/public/captures/failed.png");
  process.exit(1);
});
