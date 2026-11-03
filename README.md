# PeliculasFlix

Plugin de Kino: películas en español latino, castellano o subtituladas de pelisflixhd.love (antes pelisflixhd.blog).

- **Catálogo:** filas de Inicio (últimas, más populares, acción) y paginación, desde la API GraphQL del sitio; búsqueda por la página de búsqueda del sitio.
- **Servidores:** cada película trae varios servidores (ok.ru, Uqload, StreamWish y familia, Filemoon/Byse, VOE, Streamtape, Doodstream y Nupload). El mejor que abre reproduce y los demás quedan como copias en el menú Servidor.
- **Navegador oculto:** Doodstream y otros servidores detrás de un desafío de Cloudflare solo abren con el navegador oculto de Kino (`"browser": true`; se aprueba al instalar).
- **Hosts:** se declaran los del sitio, su API, los reproductores y las carátulas de TMDB; el video puede salir de otros hosts (`streamHosts: any`, aviso en rojo al instalar).
- Los extractores salen del plugin Latino; Byse, Uqload, Streamtape y Doodstream se escribieron aquí a partir de la lógica del repo de CloudStream.

## Estado

Verificado con el ejecutor del kit contra el sitio real: catálogo, búsqueda, paginación y resolución (ok.ru, Uqload). No probado en un aparato. Muchos enlaces del catálogo están muertos (VOE, Filemoon y Streamtape devuelven 404): es el estado del sitio, no del plugin.

## Construir y probar

```bash
npm run build      # empaqueta src/plugin.js en plugin.js con esbuild
node sdk/validate.mjs .
node --test test/plugin.test.mjs
```
