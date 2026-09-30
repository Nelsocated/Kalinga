import "server-only";
import { unstable_rethrow } from "next/navigation";
import { toErrorInfo } from "@/src/lib/api";
import type { ActionResult } from "@/src/lib/actionResult";

/**
 * Runs a Server Action body and turns thrown errors into { ok: false, error }.
 * redirect()/notFound() are rethrown so Next can handle them.
 */
export async function runAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    unstable_rethrow(error);
    return { ok: false, error: toErrorInfo(error).message };
  }
}
