// Offline tests with invented pages: the parsers of the catalog, the search page and the player pages.
import { test } from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validate } from "../sdk/validate.mjs";
import { itemOf, posterOf, backdropOf, serversOf, TABS } from "../src/plugin.js";
import { tabOf, slidesOf } from "../src/browse/model.js";
import { browseView } from "../src/browse/view.js";
import { addressOf } from "../src/extractors/streamtape.js";
import { sourceOf } from "../src/extractors/uqload.js";
import { passPath } from "../src/extractors/dood.js";
import { b64urlToHex } from "../src/extractors/byse.js";
import { extractorFor } from "../src/extractors/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("Kino accepts the manifest and the exports", async () => {
  const r = await validate(root);
  assert.deepEqual(r.problems, []);
});

test("itemOf builds a movie item with a TMDB poster and drops what has no slug or title", () => {
  const it = itemOf({ slug: "el-juez-dredd", name: "Judge Dredd", name_es: "El juez Dredd", poster_path: "/abc.jpg" });
  assert.deepEqual(it, { id: "el-juez-dredd", ref: "el-juez-dredd", title: "El juez Dredd", kind: "movie", poster: "https://image.tmdb.org/t/p/w500/abc.jpg" });
  assert.equal(itemOf({ slug: "bad slug!", name: "x" }), null);
  assert.equal(itemOf({ slug: "ok", name: "  " }), null);
  assert.equal(posterOf({ poster: "http://insecure/x.jpg" }), undefined);
});

test("backdropOf and posterOf turn a TMDB path into a picture, and only https", () => {
  assert.equal(backdropOf({ backdrop_path: "/b.jpg" }), "https://image.tmdb.org/t/p/w1280/b.jpg");
  assert.equal(backdropOf({ backdrop: "http://x.example/b.jpg" }), undefined);
});

test("serversOf keeps the servers a player is known for, Latino first", () => {
  const film = { links_online: [
    { lang: "192", link: "https://uqload.com/embed-a.html" },
    { lang: "38", link: "https://unknown.example/e/zz" },
    { lang: "38", link: "https://ok.ru/videoembed/1" },
    { lang: "37", link: "https://mixdrop.top/e/c" },
  ] };
  const out = serversOf(film);
  assert.deepEqual(out.map((s) => s.lang), ["Latino", "Castellano", "Subtitulado"]);
  assert.equal(out[0].link, "https://ok.ru/videoembed/1");
});

test("the carousel row feeds the slider and draws no rail; the screen has a tab for each of TABS", () => {
  const card = (n, extra = {}) => ({ id: "f" + n, ref: "f" + n, title: "Film " + n, kind: "movie", poster: "https://x.example/p" + n + ".jpg", ...extra });
  const rows = [{ id: "carousel", title: "", hidden: true, items: [card(1, { overview: "Sinopsis", backdrop: "https://x.example/b1.jpg" })] }, { id: "new", title: "Últimas", titleEn: "Latest", items: [card(2)] }];
  const tab = tabOf({ rows });
  assert.equal(tab.slides.length, 1);
  assert.deepEqual(tab.rails.map((r) => r.id), ["new"]);
  const tabs = TABS.map(({ id, es, en }) => ({ id, es, en }));
  const view = JSON.stringify(browseView({ brand: "PeliculasFlix", tabs, tab: "inicio", data: tab, recent: [], pending: false, failed: false }));
  assert.ok(view.includes("heroCard") && view.includes("titleRail") && view.includes("Latest"));
  for (const t of tabs) assert.ok(view.includes(t.es), t.es);
});

test("streamtape: the address a script line spells", () => {
  const page = "document.getElementById('robotlink').innerHTML = '//streamtape.com/get_video?id=AB&expires=1&token=' + ('xyzTOKEN123').substring(3);";
  assert.equal(addressOf(page), "https://streamtape.com/get_video?id=AB&expires=1&token=TOKEN123");
  assert.equal(addressOf("document.getElementById('robotlink').innerHTML = '//streamtape.com/get_video?id=A' + ('qq').substring(1) + ('wwTT').substring(1).substring(1);"), "https://streamtape.com/get_video?id=AqTT");
  assert.equal(addressOf("nothing"), null);
  assert.equal(addressOf("x.getElementById('robotlink').innerHTML = '//evil.example/x'"), null);
});

test("uqload: the first source of the player list, https only", () => {
  assert.equal(sourceOf('player.setup({sources: ["https://cdn.example/v.mp4"], x: 1})'), "https://cdn.example/v.mp4");
  assert.equal(sourceOf('jwplayer("v").setup({sources:[{file:"https://cdn.example/master.m3u8?t=1"}],image:"x"})'), "https://cdn.example/master.m3u8?t=1");
  assert.equal(sourceOf('sources: ["http://cdn.example/v.mp4"]'), null);
});

test("dood: the pass_md5 path of an embed page", () => {
  assert.equal(passPath("$.get('/pass_md5/abc-12/tok_9', function(d){})"), "/pass_md5/abc-12/tok_9");
  assert.equal(passPath("<title>Just a moment...</title>"), null);
});

test("byse: base64url becomes hex", () => {
  assert.equal(b64urlToHex("AQID"), "010203");
  assert.equal(b64urlToHex("-_8"), "fbff");
  assert.equal(b64urlToHex("a$b"), null);
});

test("extractorFor knows the player families the catalog uses", () => {
  for (const u of ["https://uqload.vc/embed-x.html", "https://streamtape.com/e/x", "https://playmogo.com/e/x", "https://filemoon.sx/e/x", "https://voe.sx/e/x", "https://ok.ru/videoembed/1", "https://streamwish.to/e/x"]) {
    assert.ok(extractorFor(u), u);
  }
  assert.equal(extractorFor("https://unknown.example/e/x"), null);
});

test("the slider's key carries its slide count, so a pager is never reused for a different number of slides", () => {
  const slide = (n) => ({ id: "a" + n, ref: "a" + n, kind: "series", title: "T" + n, image: "https://x.example/b" + n + ".jpg", text: "Sinopsis" });
  const tabs = [{ id: "inicio", es: "Inicio", en: "Home" }];
  const keyOf = (n) => {
    const v = browseView({ brand: "X", tabs, tab: "inicio", data: { slides: Array.from({ length: n }, (_, i) => slide(i + 1)), rails: [] }, recent: [], pending: false, failed: false });
    return /"key":"(hero\d*)"/.exec(JSON.stringify(v))[1];
  };
  assert.equal(keyOf(4), "hero4");
  assert.equal(keyOf(6), "hero6");
  assert.notEqual(keyOf(4), keyOf(6));
});
