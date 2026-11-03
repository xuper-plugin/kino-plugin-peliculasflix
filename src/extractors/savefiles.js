// SaveFiles: its pages sit behind a Cloudflare challenge that only a browser passes, so the hidden browser plays the embed
// and Kino hands back the media request it made.

import { captureMedia } from "./shared.js";

export const HOSTS = ["savefiles.com", "streamhls.to"];

export async function extract(embedUrl, req, kino) {
  return captureMedia(embedUrl, req, kino, "savefiles");
}
