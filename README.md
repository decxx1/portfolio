# Portfolio Astro

Fichas públicas del equipo de ManejoWeb (`/equipo/[slug]`). En `npm run dev` y `npm run build` el sitio lee el CMS headless: miembros, trabajos y servicios. El formulario de contacto no está en el CMS y sigue en el código.

## CMS local

El CMS está en el otro checkout, carpeta `cms` de ManejoWeb. Escucha en el puerto de `PORT`; el README del CMS deja **3000** por defecto. Este proyecto apunta ahí salvo que definas otra base.

| Variable | Default | Uso |
| --- | --- | --- |
| `PUBLIC_CMS_URL` | `http://localhost:3000` | Origen del CMS, sin barra final. |

`.env` no se versiona. Sin ese archivo el default ya es `http://localhost:3000`. Para pisarlo, copiá `.env.example` a `.env` (`copy .env.example .env` en Windows, `cp .env.example .env` en macOS o Linux).

Levantá el CMS y después este sitio. Si cambiás `PUBLIC_CMS_URL`, o si el CMS arranca después de este sitio, reiniciá `npm run dev` o volvé a correr el build. Astro embebe la variable al compilar y la lectura queda en memoria durante ese proceso.

```sh
# checkout de ManejoWeb
cd cms
npm run dev

# este repo
npm install
npm run dev
```

`npm run dev` abre `http://localhost:4321`. `npm run build` genera el sitio estático en `dist/`.

Si la API no responde (CMS apagado, puerto distinto o error HTTP), el build **no se corta**. No se generan fichas y la portada avisa que no pudo leer `PUBLIC_CMS_URL`. Con el CMS en marcha y miembros activos, `/` lista los perfiles y `/equipo/[slug]` arma la ficha.

## Qué sale del CMS

| Página | Colección |
| --- | --- |
| `/` | `equipo` (activos) |
| `/equipo/[slug]` | `equipo`, `trabajos` del miembro, `servicios` del miembro |

Las fotos usan `foto.url` / `imagen.url` y la miniatura `sizes.mini`. Si la URL es relativa, se le antepone `PUBLIC_CMS_URL`. Si apunta a `/api/media/` en otro host, se reescribe a ese mismo origen: el CMS local a veces firma los archivos con `NEXT_PUBLIC_SERVER_URL` de producción aunque el archivo lo sirva el proceso de `localhost:3000`. Los tonos oscuros del perfil se calculan acá: el CMS guarda un solo hex.

## Qué sigue en el código

- El formulario de contacto hace POST a `https://manejoweb.com.ar/api.php` (el CMS no tiene ese envío).
- Metas, canonical, Open Graph, reCAPTCHA, el pie, el fondo de inicio y el favicon.
- No se leen `planes`, `paginas` ni el global `sitio`: este repo no tiene páginas de marketing ni grilla de precios.
- No hay sección de clientes ni de presupuestos.

## Comandos

| Comando | Acción |
| --- | --- |
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor local en `localhost:4321` |
| `npm run build` | Sitio estático en `./dist/` |
| `npm run preview` | Previsualiza el build |
| `npm run astro ...` | CLI de Astro |
