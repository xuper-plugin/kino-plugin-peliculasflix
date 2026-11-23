// Every text the person reads, in Spanish and English: Kino does not translate a plugin's texts.
const T = {
  noServer: ["Esta película no tiene ahora un servidor que abra. Intenta de nuevo más tarde.", "This movie has no server that opens right now. Try again later."],
  siteDown: ["El catálogo no responde ahora. Intenta de nuevo en un rato.", "The catalog is not answering right now. Try again in a moment."],
  needResolver: ["Para reproducir, abre PeliculasFlix desde el menú e instala el motor de reproducción que te pedirá.", "To play, open PeliculasFlix from the menu and install the playback engine it asks for."],
};

/** `key` in both languages: `{ es, en }`, with `{name}` placeholders filled from [vars]. */
export function both(key, vars = {}) {
  const pair = T[key] || [key, key];
  const fill = (s) => s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : ""));
  return { es: fill(pair[0]), en: fill(pair[1]) };
}

/** `key` in the person's language (anything that is not Spanish reads English). */
export function t(kino, key, vars) {
  const w = both(key, vars);
  return String((kino && kino.lang) || "").toLowerCase().startsWith("es") ? w.es : w.en;
}
