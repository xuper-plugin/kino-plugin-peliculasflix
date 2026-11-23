// PeliculasFlix: movies of pelisflixhd.love in Spanish (Latino, Castellano or subtitled). The catalog, the slider, the search and
// each film's servers come from the site's GraphQL API. Kino gets the usual functions (home, browse, search, resolve) and its own
// browse screen with a slider, tabs and search. A server is an embed page of a third-party player: the shared kino-resolver opens it.

import { HLS_MIME } from "./extractors/shared.js";
import { makeRequester, requestPool, UA } from "./util/http.js";
import { makeStandardScreen } from "./std/index.js";
import { LOGO, LOGO_ASPECT } from "./logo.js";
import { t } from "./i18n.js";
import { resolveViaHelper, resolverInstalled } from "./resolve-door.js";

// Kino waits for every request a call left running before it delivers the call's answer; ask it to drop them once the call settles.
globalThis.__kinoDropPendingFetches = true;

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
    // Offer every real hoster link: the shared resolver covers far more hosts than this plugin's own extractors ever did,
    // and a host it does not know inline is still tried in PeliculasFlix's WebView capture. Don't limit by host up front.
    .filter((l) => /^https:\/\//i.test(l.link));
  const order = langOrder();
  const stats = readStats();
  // language first (the person's setting), then within it the server that has opened for this person (learned), then the site's order.
  const rank = (l) => { const i = order.indexOf(l.lang); return (i < 0 ? order.length : i) * 100 + (1 - scoreOf(hostName(l.link), stats)) * 20; };
  return links.map((l, n) => ({ ...l, n })).sort((a, b) => rank(a) - rank(b) || a.n - b.n).slice(0, MAX_COPIES);
}

// ---- learned server reliability (kept in storage; inside a language, the server that opens for this person is tried first next time) ----
const STATS_KEY = "srvStats";
const STATS_CAP = 24; // halve the counts past this, so a server that recovers climbs back
function readStats() { try { const o = JSON.parse(kino.storage.get(STATS_KEY) || "{}"); return o && typeof o === "object" ? o : {}; } catch (_) { return {}; } }
/** Laplace-smoothed success rate of a server host (unknown = 0.5). */
function scoreOf(id, stats) { const s = stats[id] || { ok: 0, fail: 0 }; return (s.ok + 1) / (s.ok + s.fail + 2); }
/** Record that a server opened (ok=true) or not; never throws. */
function noteServer(id, ok) {
  try {
    const stats = readStats();
    const s = stats[id] || { ok: 0, fail: 0 };
    s[ok ? "ok" : "fail"] += 1;
    if (s.ok + s.fail > STATS_CAP) { s.ok = Math.round(s.ok / 2); s.fail = Math.round(s.fail / 2); }
    stats[id] = s;
    kino.storage.set(STATS_KEY, JSON.stringify(stats));
  } catch (_) { /* the stats are a nicety */ }
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
  // Every third-party hoster embed is resolved by the shared kino-resolver (door), with a WebView capture
  // fallback for gated hosts (e.g. savefiles behind Cloudflare). The site-native players above (player.html#,
  // nupload.top's iframe) are unwrapped here first; `embed` is now the real hoster the resolver understands.
  return resolveViaHelper(embed, kino, SITE + "/");
}

export async function resolve(ref) {
  const [slug, pick] = String(ref || "").split("|");
  if (!/^[\w-]{1,120}$/.test(slug)) throw kino.error("not_found");
  if (!(await resolverInstalled(kino))) throw kino.error("unavailable", "resolver missing", { userMessage: t(kino, "needResolver") });
  const servers = serversOf(await filmOf(slug));
  if (!servers.length) throw kino.error("not_found", "no servers", { userMessage: t(kino, "noServer") });
  const pool = requestPool(54);
  const deadline = Date.now() + CALL_MS;
  const open = (s) => openServer(s.link, makeRequester(kino, { budget: 6, deadline, pools: [pool], maxMs: 8000 })).catch(() => null);

  // A copy the person asked for: resolve just that one.
  if (pick !== undefined) {
    const s = servers.find((x) => String(x.n) === pick);
    const stream = s && (await open(s));
    if (s) noteServer(hostName(s.link), !!stream);
    if (!stream) throw kino.error("not_found", "that server did not open");
    return { ...stream, label: labelOf(s) };
  }

  // The servers are opened in batches, together inside a batch; the best one that works plays and every other server is a lazy copy.
  // Each server actually attempted is recorded (opened or not), so next time the learned order in serversOf tries the reliable ones first.
  const opened = new Array(servers.length).fill(null);
  let at = -1;
  for (let from = 0; from < servers.length && at < 0 && Date.now() < deadline - 1500; from += TRY_AT_ONCE) {
    const got = await Promise.all(servers.slice(from, from + TRY_AT_ONCE).map(open));
    got.forEach((g, i) => { opened[from + i] = g; noteServer(hostName(servers[from + i].link), !!g); });
    at = opened.findIndex(Boolean);
  }
  if (at < 0) throw kino.error("not_found", "no server opened", { userMessage: t(kino, "noServer") });
  const first = servers[at];
  const alternatives = servers.filter((s) => s !== first).map((s) => {
    const i = servers.indexOf(s);
    return opened[i] ? { ...opened[i], label: labelOf(s) } : { label: labelOf(s), ref: slug + "|" + s.n };
  }).slice(0, MAX_COPIES - 1);
  const out = { ...opened[at], label: labelOf(first), alternatives };
  try { standard().notePlayed(slug); } catch (_) { /* never fails a play */ }
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

// ---- the screen: the standard xuper-plugin screen (src/std) ----

// PeliculasFlix delegates every server to kino-resolver (resolve() refuses with needResolver while it is missing), so the screen is the install gate until it is installed.
let std = null;
const standard = () => (std ??= makeStandardScreen({
  kino, name: "PeliculasFlix", logo: LOGO, logoAspect: LOGO_ASPECT, needsResolver: true, hasSettings: true,
  tabs: TABS.map(({ id, es, en }) => ({ id, label: es, labelEn: en })),
  loadTab: loadTab,
}));

export async function screen(ctx) {
  await null;
  return standard().screen(ctx && typeof ctx === "object" ? ctx : {});
}

export async function screenEvent(ev) {
  await null;
  return standard().screenEvent(ev && typeof ev === "object" ? ev : {});
}

// std 1.7.0: the catalog door -- the author's other plugins (Da-Video) find titles here through Kino, and Kino opens and
// plays what they find in this plugin, with its own resolve.
import { catalogDoor } from "./std/catalog.js";
export const proto_catalog_search = catalogDoor(search);
