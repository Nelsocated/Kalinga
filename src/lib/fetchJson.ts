/** Browser-side fetch that parses JSON and throws the API's `error` message. */
export async function fetchJson<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, init);
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.error ?? `Request failed (${res.status})`);
  }

  return json as T;
}
