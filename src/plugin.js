// PeliculasFlix: movies of pelisflixhd.love in Spanish (Latino, Castellano or subtitled). The catalog, the slider, the search and
// each film's servers come from the site's GraphQL API. Kino gets the usual functions (home, browse, search, resolve) and its own
// browse screen with a slider, tabs and search. A server is an embed page of a third-party player: the extractors open it.

import { extractorFor } from "./extractors/index.js";
import { HLS_MIME } from "./extractors/shared.js";
import { makeRequester, requestPool, UA } from "./util/http.js";
import { makeBrowse } from "./browse/index.js";
import { t } from "./i18n.js";

// Kino waits for every request a call left running before it delivers the call's answer; ask it to drop them once the call settles.
globalThis.__kinoDropPendingFetches = true;

const BRAND = "PeliculasFlix";
const API = "https://doraflix.fluxcedene.net/api/gql";
const PLAYER_API = "https://pelisplus.esplay.io/video/";
const TMDB = "https://image.tmdb.org/t/p/w500";
const TMDB_BACK = "https://image.tmdb.org/t/p/w1280";
const SITE = "https://pelisflixhd.love";
const PER_PAGE = 30;
const SLIDES = 6;
const MAX_COPIES = 8;
const TRY_AT_ONCE = 3; // servers opened together when the film is played; the rest are lazy copies
const CALL_MS = 16000;

// Every list the plugin shows is one of these refs: the films of the API sorted one way, optionally of one genre.
const GENRES = [
  ["accion", "Acción", "Action"], ["aventura", "Aventura", "Adventure"], ["comedia", "Comedia", "Comedy"], ["drama", "Drama", "Drama"],
  ["terror", "Terror", "Horror"], ["ciencia-ficcion", "Ciencia ficción", "Sci-fi"], ["animacion", "Animación", "Animation"],
  ["romance", "Romance", "Romance"], ["thriller", "Suspenso", "Thriller"], ["fantasia", "Fantasía", "Fantasy"], ["familia", "Familia", "Family"],
  ["crimen", "Crimen", "Crime"],
];
const LISTS = {
  new: { sort: "CREATEDAT_DESC", es: "Últimas películas", en: "Latest movies" },
  popular: { sort: "POPULARITY_DESC", es: "Más populares", en: "Most popular" },
  ...Object.fromEntries(GENRES.map(([slug, es, en]) => ["g:" + slug, { sort: "CREATEDAT_DESC", genre: slug, es, en }])),
};

export const TABS = [
  { id: "inicio", es: "Inicio", en: "Home", lists: ["new", "popular", "g:accion", "g:comedia", "g:terror", "g:animacion"] },
  { id: "populares", es: "Populares", en: "Popular", lists: ["popular", "g:aventura", "g:ciencia-ficcion", "g:thriller"] },
  { id: "generos", es: "Géneros", en: "Genres", lists: ["g:accion", "g:aventura", "g:comedia", "g:drama", "g:terror", "g:ciencia-ficcion", "g:romance", "g:fantasia"] },
];

const LIST_QUERY = "query listFilms($filter: FilterFindManyFilmInput, $limit: Int, $skip: Int, $sort: SortFindManyFilmInput) { listFilms(filter: $filter, limit: $limit, skip: $skip, sort: $sort) { name title name_es slug poster_path poster } }";
const SEARCH_QUERY = "query searchFilm($q: String!, $limit: Int) { searchFilm(input: $q, limit: $limit) { name title name_es slug poster_path poster } }";
const CAROUSEL_QUERY = "query carrouselFilms($limit: Float) { carrouselFilms(limit: $limit) { name title name_es slug overview poster_path poster backdrop_path backdrop } }";
const DETAIL_QUERY = "query detailFilm($slug: String!) { detailFilm(filter: {slug: $slug}) { name title name_es overview poster poster_path backdrop backdrop_path genres { name } links_online { _id server lang link } } }";

const LANG = { 38: "Latino", 37: "Castellano", 192: "Subtitulado" };
const LANG_ORDER = ["Latino", "Castellano", "Subtitulado"];

/** The person's preferred language first, the others in their usual order (setting `lang`: latino, castellano or subtitulado). */
function langOrder() {
  let want = "";
  try { want = String(kino.config.get("lang") || "").toLowerCase(); } catch (_) { /* the default order */ }
  const first = LANG_ORDER.find((l) => l.toLowerCase() === want);
  return first ? [first, ...LANG_ORDER.filter((l) => l !== first)] : LANG_ORDER;
}

async function gql(operationName, query, variables) {
  const r = await kino.fetch(API, {
    method: "POST",
    timeoutMs: 10000,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: { json: { operationName, variables, query } },
  });
  if (!r.ok) throw kino.error("unavailable", "the catalog answered " + r.status, { userMessage: t(kino, "siteDown") });
  const data = r.json();
  if (!data || !data.data) throw kino.error("unavailable", "the catalog answered without data", { userMessage: t(kino, "siteDown") });
  return data.data;
}

const image = (base, p) => (/^\/[\w.-]+\.(jpg|png|webp)$/i.test(p || "") ? base + p : /^https:\/\//i.test(p || "") ? p : undefined);
export const posterOf = (m) => image(TMDB, m && (m.poster_path || m.poster));
export const backdropOf = (m) => image(TMDB_BACK, m && (m.backdrop_path || m.backdrop));

export function itemOf(m) {
  const slug = String((m && m.slug) || "");
  if (!/^[\w-]{1,120}$/.test(slug)) return null;
  const title = String(m.name_es || m.name || m.title || "").trim();
  if (!title) return null;
  return { id: slug, ref: slug, title: title.slice(0, 120), kind: "movie", poster: posterOf(m) };
}

async function listing(ref, page = 1) {
  const l = LISTS[ref];
  if (!l) return { items: [], next: undefined };
  const filter = l.genre ? { isPublish: true, genres: { slug: l.genre } } : { isPublish: true };
  const data = await gql("listFilms", LIST_QUERY, { filter, limit: PER_PAGE, skip: (page - 1) * PER_PAGE, sort: l.sort });
  const films = Array.isArray(data.listFilms) ? data.listFilms : [];
  return { items: films.map(itemOf).filter(Boolean), next: films.length >= PER_PAGE ? String(page + 1) : undefined };
}

// A row id is letters, digits, "-" and "_": "g:accion" (the list's ref, kept as the row's `ref`) was dropped by Kino, leaving the Home with two rows.
const rowOf = (ref, items) => ({ id: ref.replace(/[^\w-]/g, "-"), title: LISTS[ref].es, titleEn: LISTS[ref].en, ref, items });

/** Kino cuts a call at 20 s: the lists still loading by this time are left off and the ones that loaded are shown. */
const ROWS_BUDGET_MS = 12000;

/** The rows of these lists, asked together; each one that fails or is slow is left out. */
async function rowsOfLists(refs) {
  const out = refs.map(() => null);
  let done = false;
  const all = Promise.all(refs.map(async (ref, i) => {
    try { const p = await listing(ref, 1); out[i] = p.items.length ? rowOf(ref, p.items) : null; } catch (_) { /* left out */ }
  })).then(() => { done = true; });
  const end = Date.now() + ROWS_BUDGET_MS;
  while (!done && Date.now() < end) await Promise.race([all, kino.sleep(Math.min(250, Math.max(1, end - Date.now())))]);
  return out.filter(Boolean);
}

export async function home() {
  const out = await rowsOfLists(["new", "popular", "g:accion", "g:comedia", "g:terror"]);
  if (!out.length) throw kino.error("unavailable", "no list answered", { userMessage: t(kino, "siteDown") });
  return out.map(({ titleEn, ...row }) => row);
}

export async function browse(ref, cursor) {
  return listing(ref, Math.max(1, parseInt(cursor, 10) || 1));
}

export async function search(query) {
  const q = String((query && query.q) || "").trim();
  if (!q) return [];
  const data = await gql("searchFilm", SEARCH_QUERY, { q, limit: 40 });
  return (Array.isArray(data.searchFilm) ? data.searchFilm : []).map(itemOf).filter(Boolean);
}

// ---- servers ----

/** The film's servers, best language first, as [{ link, lang, n }]; `n` is the position a lazy copy's ref names. */
export function serversOf(film) {
  const links = ((film && film.links_online) || [])
    .map((l) => ({ link: String((l && l.link) || "").trim(), lang: LANG[l && l.lang] || String((l && l.lang) || "Servidor") }))
    .filter((l) => /^https:\/\//i.test(l.link) && understood(l.link));
  const order = langOrder();
  const rank = (l) => { const i = order.indexOf(l.lang); return i < 0 ? order.length : i; };
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
  const servers = serversOf(await filmOf(slug));
  if (!servers.length) throw kino.error("not_found", "no servers", { userMessage: t(kino, "noServer") });
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

  // The servers are opened in batches, together inside a batch; the best one that works plays and every other server is a lazy copy.
  const opened = new Array(servers.length).fill(null);
  let at = -1;
  for (let from = 0; from < servers.length && at < 0 && Date.now() < deadline - 1500; from += TRY_AT_ONCE) {
    const got = await Promise.all(servers.slice(from, from + TRY_AT_ONCE).map(open));
    got.forEach((g, i) => { opened[from + i] = g; });
    at = opened.findIndex(Boolean);
  }
  if (at < 0) throw kino.error("not_found", "no server opened", { userMessage: t(kino, "noServer") });
  const first = servers[at];
  const alternatives = servers.filter((s) => s !== first).map((s) => {
    const i = servers.indexOf(s);
    return opened[i] ? { ...opened[i], label: labelOf(s) } : { label: labelOf(s), ref: slug + "|" + s.n };
  }).slice(0, MAX_COPIES - 1);
  const out = { ...opened[at], label: labelOf(first), alternatives };
  try { browseScreen().notePlayed(slug); } catch (_) { /* never fails a play */ }
  return out;
}

// ---------- the browse screen ----------

/** A tab's page: its lists, fetched together; the home tab's slider comes from the site's carousel. */
async function loadTab(tabId) {
  const tab = TABS.find((x) => x.id === tabId);
  if (!tab) return { rows: [] };
  const [rows, slides] = await Promise.all([
    rowsOfLists(tab.lists),
    tab.id === "inicio" ? carousel() : Promise.resolve([]),
  ]);
  const out = rows;
  // The carousel's films are the slider's first row: a row of their own would repeat titles, so it carries no rail.
  return { rows: slides.length ? [{ id: "carousel", title: "", items: slides, hidden: true }, ...out] : out };
}

/** The site's carousel as cards with a synopsis and a wide picture (the slider's slides). */
async function carousel() {
  try {
    const data = await gql("carrouselFilms", CAROUSEL_QUERY, { limit: SLIDES });
    return (Array.isArray(data.carrouselFilms) ? data.carrouselFilms : [])
      .map((m) => { const it = itemOf(m); return it ? { ...it, overview: String(m.overview || "").trim(), backdrop: backdropOf(m) } : null; })
      .filter(Boolean);
  } catch (_) {
    return [];
  }
}

let browseInstance = null;
const browseScreen = () => (browseInstance ??= makeBrowse({
  kino,
  brand: BRAND,
  tabs: TABS.map(({ id, es, en }) => ({ id, es, en })),
  loadTab,
  searchTitles: (q) => search({ q }),
  canPlay: true, // a film plays straight from the slider
}));

/** `screen(ctx)`: the plugin's own browse screen (a pure view: it draws what it holds and never waits for the catalog). */
export async function screen(ctx) {
  await null;
  return browseScreen().view(ctx && typeof ctx === "object" ? ctx : {});
}

/** `screenEvent(ev)`: the screen's events (its timers load a tab or a search, one per call). */
export async function screenEvent(ev) {
  await null;
  return browseScreen().event(ev && typeof ev === "object" ? ev : {});
}
