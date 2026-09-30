export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

/** Client helper: returns the data or throws the action's error message. */
export function unwrap<T>(result: ActionResult<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.data;
}
