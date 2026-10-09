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

/** Posts one file as form field "file" to an upload route; returns the stored file's URL. */
export async function uploadFile(input: string, file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const json = await fetchJson<{ data: { url: string } }>(input, { method: "POST", body: form });
  return json.data.url;
}
