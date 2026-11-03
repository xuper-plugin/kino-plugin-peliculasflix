// PeliculasFlix: movies of pelisflixhd.blog in Spanish (Latino, Castellano or subtitled). The catalog and each film's
// servers come from the site's GraphQL API; the search reads the site's own search page. A server is an embed page of a
// third-party player: the extractors the Latino plugin uses open it and find the stream.

import { extractorFor } from "./extractors/index.js";
import { HLS_MIME } from "./extractors/shared.js";
import { makeRequester, requestPool, UA } from "./util/http.js";

const SITE = "https://pelisflixhd.love"; // pelisflixhd.blog redirects here
const API = "https://doraflix.fluxcedene.net/api/gql";
const PLAYER_API = "https://pelisplus.esplay.io/video/";
const TMDB = "https://image.tmdb.org/t/p/w500";
const PER_PAGE = 30;
const MAX_COPIES = 8;
const TRY_AT_ONCE = 3; // servers opened in parallel when the film is played; the rest are lazy copies
const CALL_MS = 16000;

const ROWS = [
  { id: "new", title: "Últimas películas", sort: "CREATEDAT_DESC", genre: null },
  { id: "popular", title: "Más populares", sort: "POPULARITY_DESC", genre: null },
  { id: "accion", title: "Acción", sort: "CREATEDAT_DESC", genre: "accion" },
];
const LANG = { 38: "Latino", 37: "Castellano", 192: "Subtitulado" };
const LANG_ORDER = ["Latino", "Castellano", "Subtitulado"];

const LIST_QUERY = "query listMovies($page: Int, $perPage: Int, $sort: SortFindManyFilmInput, $filter: FilterFindManyFilmInput) { paginationFilm(page: $page, perPage: $perPage, sort: $sort, filter: $filter) { items { _id title name poster_path slug name_es } pageInfo { currentPage hasNextPage } } }";
const DETAIL_QUERY = "query detailFilm($slug: String!) { detailFilm(filter: {slug: $slug}) { name title name_es overview poster poster_path backdrop backdrop_path genres { name } links_online { _id server lang link } } }";

async function gql(operationName, query, variables) {
  const r = await kino.fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: { json: { operationName, variables, query } },
  });
  if (!r.ok) throw kino.error("unavailable", "the catalog answered " + r.status);
  const data = r.json();
  if (!data || !data.data) throw kino.error("unavailable", "the catalog answered without data");
  return data.data;
}

export function posterOf(m) {
  const p = (m && (m.poster_path || m.poster)) || "";
  if (/^\/[\w.-]+\.(jpg|png|webp)$/i.test(p)) return TMDB + p;
  return /^https:\/\//i.test(p) ? p : undefined;
}

export function itemOf(m) {
  const slug = String((m && m.slug) || "");
  if (!/^[\w-]{1,120}$/.test(slug)) return null;
  const title = String(m.name_es || m.name || m.title || "").trim();
  if (!title) return null;
  return { id: slug, ref: slug, title: title.slice(0, 120), kind: "movie", poster: posterOf(m) };
}

async function page(row, number) {
  const filter = row.genre ? { isPublish: true, genres: { slug: row.genre } } : { isPublish: true };
  const data = await gql("listMovies", LIST_QUERY, { perPage: PER_PAGE, sort: row.sort, filter, page: number });
  const list = (data.paginationFilm && data.paginationFilm.items) || [];
  const info = (data.paginationFilm && data.paginationFilm.pageInfo) || {};
  return { items: list.map(itemOf).filter(Boolean), next: info.hasNextPage ? String(number + 1) : undefined };
}

export async function home() {
  const rows = await Promise.all(ROWS.map(async (row) => {
    try {
      const p = await page(row, 1);
      return p.items.length ? { id: row.id, title: row.title, ref: row.id, items: p.items } : null;
    } catch (_) {
      return null;
    }
  }));
  const out = rows.filter(Boolean);
  if (!out.length) throw kino.error("unavailable", "no row answered");
  return out;
}

export async function browse(ref, cursor) {
  const row = ROWS.find((r) => r.id === ref);
  if (!row) return { items: [] };
  const n = Math.max(1, parseInt(cursor, 10) || 1);
  return page(row, n);
}

/** Films of the site's search page: each result links to /pelicula/<slug> and shows a poster and a title. */
export function parseSearch(html) {
  const out = [];
  const seen = new Set();
  for (const block of String(html || "").split(/<div[^>]*class="[^"]*movie-item/).slice(1)) {
    const href = /href="[^"]*\/pelicula\/([\w-]+)\/?"/.exec(block);
    const title = /class="item-detail"[^>]*>\s*<p[^>]*>([^<]+)</.exec(block);
    if (!href || !title || seen.has(href[1])) continue;
    seen.add(href[1]);
    const img = /<img[^>]+src="([^"]+)"/.exec(block);
    let poster = img ? img[1] : "";
    if (poster.startsWith("//")) poster = "https:" + poster;
    out.push({ id: href[1], ref: href[1], title: title[1].replace(/&amp;/g, "&").trim().slice(0, 120), kind: "movie", poster: /^https:\/\//.test(poster) ? poster : undefined });
  }
  return out;
}

export async function search(query) {
  const q = String((query && query.q) || "").trim();
  if (!q) return [];
  const r = await kino.fetch(SITE + "/busqueda/" + encodeURIComponent(q), { headers: { "User-Agent": UA, Accept: "text/html" } });
  if (!r.ok) throw kino.error("unavailable", "the site answered " + r.status);
  return parseSearch(r.text()).slice(0, 40);
}

// ---- servers ----

/** The film's servers, best language first, as [{ link, lang, n }]; `n` is the position a lazy copy's ref names. */
export function serversOf(film) {
  const links = ((film && film.links_online) || [])
    .map((l) => ({ link: String((l && l.link) || "").trim(), lang: LANG[l && l.lang] || String((l && l.lang) || "Servidor") }))
    .filter((l) => /^https:\/\//i.test(l.link) && understood(l.link));
  const rank = (l) => { const i = LANG_ORDER.indexOf(l.lang); return i < 0 ? LANG_ORDER.length : i; };
  return links.map((l, n) => ({ ...l, n })).sort((a, b) => rank(a) - rank(b) || a.n - b.n).slice(0, MAX_COPIES);
}

/** Whether some player this plugin knows opens [link]; the others are left out instead of offered as dead copies. */
function understood(link) {
  return link.includes("player.html#") || hostName(link).endsWith("nupload.top") || extractorFor(link) !== null;
}

function hostName(link) {
  try { return new URL(link).hostname.replace(/^www\./, ""); } catch (_) { return "servidor"; }
}

const labelOf = (s) => (s.lang + " · " + hostName(s.link)).slice(0, 48);

async function filmOf(slug) {
  const data = await gql("detailFilm", DETAIL_QUERY, { slug });
  if (!data.detailFilm) throw kino.error("not_found", "film not found");
  return data.detailFilm;
}

/** One server's embed link as a playable stream, or null when its player is not understood or has nothing. */
async function openServer(link, req) {
  if (link.includes("player.html#")) {
    const id = link.slice(link.indexOf("player.html#") + "player.html#".length);
    if (!/^[\w-]{1,200}$/.test(id)) return null;
    const r = await req(PLAYER_API + id, { headers: { Accept: "application/json" } });
    const file = r.ok && r.json() && r.json().file;
    if (typeof file !== "string" || !/^https:\/\//.test(file)) return null;
    return { url: file, mime: /\.m3u8(\?|$)/i.test(file) ? HLS_MIME : undefined, headers: { "User-Agent": UA } };
  }
  let embed = link;
  if (hostName(link).endsWith("nupload.top")) {
    const r = await req(link, { headers: { Referer: SITE + "/" } });
    const m = r.ok && /<iframe[^>]+src=["']([^"']+)["']/i.exec(r.text());
    if (!m) return null;
    embed = m[1].startsWith("//") ? "https:" + m[1] : m[1];
  }
  const ex = extractorFor(embed);
  return ex ? ex.extract(embed, req, kino) : null;
}

export async function resolve(ref) {
  const [slug, pick] = String(ref || "").split("|");
  if (!/^[\w-]{1,120}$/.test(slug)) throw kino.error("not_found");
  const film = await filmOf(slug);
  const servers = serversOf(film);
  if (!servers.length) throw kino.error("not_found", "no servers");
  const pool = requestPool(54);
  const deadline = Date.now() + CALL_MS;
  const open = (s) => openServer(s.link, makeRequester(kino, { budget: 6, deadline, pools: [pool], maxMs: 8000 })).catch(() => null);

  // A copy the person asked for: resolve just that one.
  if (pick !== undefined) {
    const s = servers.find((x) => String(x.n) === pick);
    const stream = s && (await open(s));
    if (!stream) throw kino.error("not_found", "that server did not open");
    return { ...stream, label: labelOf(s) };
  }

  // The servers are opened in batches, together inside a batch; the best one that works plays and every other server
  // is a lazy copy.
  const opened = new Array(servers.length).fill(null);
  let at = -1;
  for (let from = 0; from < servers.length && at < 0 && Date.now() < deadline - 1500; from += TRY_AT_ONCE) {
    const got = await Promise.all(servers.slice(from, from + TRY_AT_ONCE).map(open));
    got.forEach((g, i) => { opened[from + i] = g; });
    at = opened.findIndex(Boolean);
  }
  if (at < 0) throw kino.error("not_found", "no server opened", { userMessage: "Esta película no tiene ahora un servidor que abra. Intenta de nuevo más tarde." });
  const first = servers[at];
  const alternatives = servers.filter((s) => s !== first).map((s) => {
    const i = servers.indexOf(s);
    return opened[i] ? { ...opened[i], label: labelOf(s) } : { label: labelOf(s), ref: slug + "|" + s.n };
  }).slice(0, MAX_COPIES - 1);
  return { ...opened[at], label: labelOf(first), alternatives };
}
