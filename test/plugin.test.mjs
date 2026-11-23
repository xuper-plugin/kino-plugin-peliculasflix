// Offline tests with invented pages: the parsers of the catalog, the search page and the player pages.
import { test } from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validate } from "../sdk/validate.mjs";
import { itemOf, posterOf, backdropOf, serversOf } from "../src/plugin.js";
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

test("serversOf offers every hoster link, including an unknown host (nothing dropped up front), language first", () => {
  const film = { links_online: [
    { lang: "192", link: "https://uqload.com/embed-a.html" },
    { lang: "38", link: "https://unknown.example/e/zz" },
    { lang: "38", link: "https://ok.ru/videoembed/1" },
    { lang: "37", link: "https://mixdrop.top/e/c" },
  ] };
  const out = serversOf(film);
  // The shared resolver covers far more hosts than this plugin's own extractors, and an unknown host still gets a
  // WebView-capture shot, so nothing the site lists is filtered out up front.
  assert.equal(out.length, 4, "the unknown host is offered too, not filtered out");
  assert.ok(out.some((s) => s.link === "https://unknown.example/e/zz"), "the unknown host is kept");
  assert.deepEqual(out.slice(0, 2).map((s) => s.lang), ["Latino", "Latino"], "the two Latino copies come first");
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
