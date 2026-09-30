// scripts/smoke-api.mjs
// Calls every API route without a session and checks status + body shape.
// Usage: node scripts/smoke-api.mjs [http://localhost:3010]
const BASE = process.argv[2] ?? "http://localhost:3010";
const Z = "00000000-0000-0000-0000-000000000000";

/** @type {{method:string,path:string,body?:unknown,status:number,shape?:"data"|"error"}[]} */
const CHECKS = [
  // Public reads
  { method: "GET", path: "/api/feed", status: 200 },
  { method: "GET", path: `/api/likes?targetType=pet&targetId=${Z}`, status: 200 },
  { method: "POST", path: "/api/pets/search", body: {}, status: 200, shape: "data" },
  { method: "GET", path: `/api/pets/photos?petId=${Z}`, status: 200 },
  { method: "GET", path: `/api/shelters/${Z}/donation`, status: 200, shape: "data" },
  // Signed-out access to private reads and uploads
  { method: "GET", path: "/api/likes/me", status: 401, shape: "error" },
  { method: "GET", path: "/api/messages/threads", status: 401, shape: "error" },
  { method: "GET", path: `/api/messages/threads/${Z}`, status: 401, shape: "error" },
  { method: "GET", path: "/api/messages/sent", status: 401, shape: "error" },
  { method: "GET", path: "/api/shelters/me", status: 401, shape: "error" },
  { method: "GET", path: "/api/users", status: 401, shape: "error" },
  { method: "GET", path: `/api/users/${Z}/adoption/answer`, status: 401, shape: "error" },
  { method: "POST", path: "/api/videos", status: 401, shape: "error" },
  { method: "POST", path: "/api/pets/photos", status: 401, shape: "error" },
  { method: "POST", path: "/api/users/avatar", status: 401, shape: "error" },
  { method: "POST", path: "/api/shelters/me/avatar", status: 401, shape: "error" },
  // Bad input
  { method: "POST", path: "/api/auth/login", body: {}, status: 404 },
  { method: "POST", path: "/api/auth/logout", status: 404 },
  // Removed in Task 3
  { method: "GET", path: "/api/auth/me", status: 404 },
  { method: "GET", path: "/api/shelters", status: 404 },
  { method: "GET", path: `/api/shelters/${Z}`, status: 404 },
  { method: "GET", path: `/api/pets/${Z}`, status: 404 },
  { method: "GET", path: "/api/pets", status: 405 },
  { method: "GET", path: `/api/users/${Z}`, status: 404 },
  { method: "GET", path: "/api/foster", status: 405 },
  { method: "POST", path: `/api/shelters/${Z}/donation`, body: {}, status: 405 },
];

let failed = 0;

for (const c of CHECKS) {
  const init = { method: c.method, headers: {} };
  if (c.body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = typeof c.body === "string" ? c.body : JSON.stringify(c.body);
  }

  let status = 0;
  let json = null;
  try {
    const res = await fetch(BASE + c.path, init);
    status = res.status;
    json = await res.json().catch(() => null);
  } catch (e) {
    json = { fetchError: String(e) };
  }

  const shapeOk =
    !c.shape ||
    (c.shape === "data" && json && "data" in json) ||
    (c.shape === "error" && json && typeof json.error === "string");
  const pass = status === c.status && shapeOk;
  if (!pass) failed++;

  console.log(
    `${pass ? "PASS" : "FAIL"} ${c.method.padEnd(6)} ${c.path} -> ${status}` +
      (pass ? "" : ` (want ${c.status}${c.shape ? ` + ${c.shape}` : ""}) ${JSON.stringify(json)?.slice(0, 120)}`),
  );
}

console.log(`\n${CHECKS.length - failed}/${CHECKS.length} passed`);
process.exit(failed ? 1 : 0);
