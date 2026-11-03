// Offline tests with invented pages: the parsers of the catalog, the search page and the player pages.
import { test } from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validate } from "../sdk/validate.mjs";
import { itemOf, posterOf, parseSearch } from "../src/plugin.js";
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

test("parseSearch reads the site's result blocks and skips repeats", () => {
  const html = '<div class="movie-item a"><a href="https://pelisflixhd.love/pelicula/five-nights"><img src="//img.x/p.jpg"></a><div class="item-detail"><p>Five Nights &amp; More</p></div></div>'
    + '<div class="movie-item"><a href="/pelicula/five-nights/"></a><div class="item-detail"><p>Repeat</p></div></div>'
    + '<div class="movie-item"><a href="/serie/x"></a><div class="item-detail"><p>Not a film</p></div></div>';
  const out = parseSearch(html);
  assert.equal(out.length, 1);
  assert.equal(out[0].title, "Five Nights & More");
  assert.equal(out[0].poster, "https://img.x/p.jpg");
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
