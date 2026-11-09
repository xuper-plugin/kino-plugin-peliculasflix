// A slow list is left off the Home and the others are shown at the budget.
import test from "node:test";
import assert from "node:assert/strict";

let clock = 0;
globalThis.kino = {
  lang: "es",
  config: { get: () => undefined },
  storage: { get: () => null, set() {}, keys: () => [], remove() {} },
  fetch: (url, opts) => {
    const v = opts.body && opts.body.json && opts.body.json.variables;
    if (v && v.filter && v.filter.genres) return new Promise(() => {}); // the genre lists never answer
    return Promise.resolve({ ok: true, status: 200, json: () => ({ data: { listFilms: [{ slug: "a", name: "A", poster_path: "/p.jpg" }] } }) });
  },
  sleep: async () => { clock += 1; await new Promise((r) => setImmediate(r)); }, // a tick per wait
  log() {},
  error: (code, message, opts = {}) => Object.assign(new Error(message), { code, ...opts }),
};
const realNow = Date.now;
const plugin = await import("../src/plugin.js");

test("the plugin asks Kino to drop the requests a call leaves running", () => {
  assert.equal(globalThis.__kinoDropPendingFetches, true);
});

test("the lists that answer are shown and the ones that never do are left off", async () => {
  clock = 0;
  Date.now = () => 1e12 + clock;
  try {
    const rows = await plugin.home();
    assert.deepEqual(rows.map((r) => r.id), ["new", "popular"]);
    assert.ok(clock <= 13000, "gave up at the budget, clock " + clock);
  } finally { Date.now = realNow; }
});

test("a genre row has an id Kino accepts, and still opens its list through its ref", async () => {
  kino.fetch = () => Promise.resolve({ ok: true, status: 200, json: () => ({ data: { listFilms: [{ slug: "a", name: "A", poster_path: "/p.jpg" }] } }) });
  const rows = await plugin.home();
  assert.equal(rows.length, 5);
  for (const r of rows) assert.match(r.id, /^[\w-]+$/);
  assert.ok(rows.some((r) => r.ref === "g:accion" && r.id === "g-accion"));
});
