# Gideon en GitHub Pages

Modo estático del Companion para crear y usar fichas sin servidor. Reutiliza la
interfaz y el motor de reglas actual; SQLite funciona en el navegador mediante
sql.js. No modifica la base local del narrador ni las reglas del proyecto.

## Preparar el sitio

Con Node.js 24 o posterior:

```powershell
cd GideonCompanion/pages
npm install
npm test
npm run build
```

El resultado está en `dist/`. Publicar **solo esa carpeta**, nunca la carpeta
`GideonCompanion/sql` ni una base real de personajes. La generación inicia una
base en memoria, elimina los datos de ejemplo y recompone el archivo. Las
tablas personales deben estar vacías. No se publican accesos del narrador,
vínculos de compañeros ni fichas de aventuras privadas.

El workflow `.github/workflows/gideon-pages.yml` instala la dependencia fijada,
verifica el catálogo, genera los archivos y publica el artefacto en Pages.
En GitHub: **Settings → Pages → Source → GitHub Actions**. El sitio de este
repositorio corresponde a `https://kachan3.github.io/Gideon/` una vez que la
publicación termine correctamente. Este archivo no implica que ya se haya
publicado.

Si se ejecuta el generador local sin instalar sql.js, el sitio tiene un fallback
a jsDelivr, fijado a sql.js 1.16.0. Las publicaciones desde Actions incluyen el
JavaScript y WebAssembly en el propio sitio y no necesitan ese CDN.
Se usan las funciones matemáticas nativas de SQLite para conservar las columnas
calculadas del catálogo (incluido `pow` en los precios).

## Uso y guardado

- Crear un personaje abre el mismo creador y conserva sus validaciones.
- Los datos se guardan en IndexedDB, en este navegador y dispositivo.
- El visitante puede abrir sus fichas desde **Mis personajes**.
- **Descargar copia** exporta toda la colección, incluidos sus accesos, como JSON.
- **Importar copia** valida el archivo y abre una colección nueva. No borra ni
  sustituye las anteriores; el selector permite volver a ellas.
- No hay cuenta, sincronización entre dispositivos ni partida compartida en vivo.
- No se debe confiar en el guardado de una ventana privada para conservar una
  ficha: descargar una copia antes de cerrar o borrar los datos del navegador.
- Las colecciones existentes conservan su catálogo. Si el sitio cambia el
  catálogo se avisa; la primera versión no migra ni reescribe fichas anteriores.
- Las escrituras comprueban una revisión en una transacción de IndexedDB. Si
  otra pestaña guardó cambios, se detiene esa sesión para evitar sobrescribirlos.

Los tokens internos del Companion se conservan como compatibilidad con el motor;
la web estática no pide copiarlos ni pegarlos. El acceso a otra computadora se
hace con el archivo de copia, no con el token solo.

## Verificación

`node --test pages.test.mjs` comprueba el catálogo público, la ausencia de datos
personales, los archivos de navegador y las comprobaciones de copias.

`node browser.test.mjs` comprueba el flujo real en Chromium, incluido el prefijo
`/Gideon/` de Pages, persistencia al recargar y exportación/importación. Requiere
Playwright y sql.js instalados. `PLAYWRIGHT_PATH` y `CHROME_PATH` permiten utilizar
una instalación existente. No usa ni modifica la base de jugadores local.
