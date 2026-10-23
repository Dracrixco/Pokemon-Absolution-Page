const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const app = require("../index.js");
let server;
let url;
before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  url = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve) => server.close(resolve)));

test("game info retains its public API contract", async () => {
  const response = await fetch(`${url}/api/game-info`);
  assert.equal(response.status, 200);
  const info = await response.json();
  assert.ok(Array.isArray(info.downloadLink));
  assert.equal(typeof info.latestInfo, "string");
  assert.equal(typeof info.lastUpdated, "string");
});
test("updates support list, pagination and detail responses", async () => {
  const updates = await (await fetch(`${url}/api/updates`)).json();
  assert.ok(updates.length > 0);
  assert.equal(typeof updates[0].isNew, "boolean");
  const page = await (await fetch(`${url}/api/updates?page=1&limit=1`)).json();
  assert.equal(page.updates.length, 1);
  assert.equal(page.pagination.totalUpdates, updates.length);
  const detail = await (
    await fetch(`${url}/api/updates/${updates[0].id}`)
  ).json();
  assert.equal(detail.id, updates[0].id);
  assert.equal((await fetch(`${url}/api/updates/missing`)).status, 404);
});
test("local web origin can access the API", async () => {
  const response = await fetch(`${url}/api/game-info`, {
    headers: { Origin: "http://localhost:5173" },
  });
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "http://localhost:5173",
  );
});
