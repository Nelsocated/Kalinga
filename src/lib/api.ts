import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Maps any thrown value to a status and a message that is safe to show. */
export function toErrorInfo(error: unknown): { status: number; message: string } {
  if (error instanceof ApiError) return { status: error.status, message: error.message };
  if (error instanceof ZodError) {
    return { status: 400, message: error.issues[0]?.message ?? "Invalid input" };
  }
  // req.json() throws a SyntaxError on a malformed body
  if (error instanceof SyntaxError) return { status: 400, message: "Invalid JSON body" };

  console.error(error);
  return { status: 500, message: "Something went wrong. Please try again." };
}

export function errorResponse(error: unknown) {
  const { status, message } = toErrorInfo(error);
  return NextResponse.json({ error: message }, { status });
}

/** The one success shape every route returns. */
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

/** Wraps a route handler so any thrown error becomes errorResponse(). */
export function handle<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (error) {
      return errorResponse(error);
    }
  };
}
