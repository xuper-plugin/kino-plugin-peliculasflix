# PeliculasFlix

Plugin de Kino: películas en español latino, castellano o subtituladas de pelisflixhd.love (antes pelisflixhd.blog).

- **Pantalla propia** (menú de Kino, como Latino y Xuper): un slider con el carrusel del sitio, pestañas Inicio, Populares y Géneros, filas por género, "Continuar viendo" y un buscador con historial.
- **Header y ajustes:** el logo de PeliculasFlix en la barra, un engranaje con la página de ajustes (idioma preferido) y los logos de título de TMDB sobre cada slide, cuando Kino puede buscarlos.
- **Catálogo:** todo sale de la API GraphQL del sitio: listas por orden y por género con paginación, carrusel y búsqueda.
- **Servidores:** cada película trae varios servidores (ok.ru, Uqload, StreamWish y familia, Filemoon/Byse, VOE, Streamtape, Doodstream y Nupload). El mejor que abre reproduce y los demás quedan como copias en el menú Servidor.
- **Navegador oculto:** Doodstream y otros servidores detrás de un desafío de Cloudflare solo abren con el navegador oculto de Kino (`"browser": true`; se aprueba al instalar).
- **Hosts:** se declaran los del sitio, su API, los reproductores y las carátulas de TMDB; el video puede salir de otros hosts (`streamHosts: any`, aviso en rojo al instalar).
- Los extractores salen del plugin Latino; Byse, Uqload, Streamtape, Doodstream, MixDrop, Mp4Upload, Hexload y SaveFiles se escribieron aquí a partir de la lógica del repo de CloudStream.

## Estado

Versión 0.3.0. Verificado con el ejecutor del kit contra el sitio real: catálogo, slider, búsqueda, paginación, la pantalla (carga de una pestaña y su dibujo) y la resolución (ok.ru, Uqload). No probado en un aparato. Muchos enlaces del catálogo están muertos (VOE, Filemoon y Streamtape devuelven 404): es el estado del sitio, no del plugin.

## Construir y probar

```bash
npm run build      # empaqueta src/plugin.js en plugin.js con esbuild
node sdk/validate.mjs .
node --test test/plugin.test.mjs
```
