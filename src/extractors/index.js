import * as goodstream from "./goodstream.js";
import * as vimeos from "./vimeos.js";
import * as streamwish from "./streamwish.js";
import * as vidhide from "./vidhide.js";
import * as fastream from "./fastream.js";
import * as voe from "./voe.js";
import * as okru from "./okru.js";
import * as nupload from "./nupload.js";
import * as byse from "./byse.js";
import * as uqload from "./uqload.js";
import * as streamtape from "./streamtape.js";
import * as dood from "./dood.js";
import * as mixdrop from "./mixdrop.js";
import * as mp4upload from "./mp4upload.js";
import * as hexload from "./hexload.js";
import * as savefiles from "./savefiles.js";
const TABLE = { goodstream, vimeos, streamwish, vidhide, fastream, voe, okru, nupload, byse, uqload, streamtape, dood, mixdrop, mp4upload, hexload, savefiles };

/** Callers pass `(embedUrl, req, kino)`; kino is optional and used by voe. */
export function extractorFor(embedUrl) {
  let host;
  try { host = new URL(embedUrl).hostname.replace(/^www\./, ""); } catch (_) { return null; }
  for (const [name, mod] of Object.entries(TABLE)) {
    if (mod.HOSTS.some((h) => host === h || host.endsWith("." + h))) return { name, extract: mod.extract };
  }
  return null;
}
export const HOSTS = Object.values(TABLE).flatMap((m) => m.HOSTS);
export const register = (name, mod) => { TABLE[name] = mod; };
