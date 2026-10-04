# ltndj.com — Latin Audiovisuales / Latin DJ

Sitio estático en **Astro + Tailwind CSS**, publicado en **Cloudflare Workers** (static assets).
Diseño "Nocturno": fondo oscuro, tipografía Archivo y naranja `#FD6721` como acento.

## Correrlo en tu computador

Requisitos: Node 22 o superior.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
npx wrangler dev   # sirve dist/ igual que en Cloudflare (incluye _redirects y 404)
```

## Estructura

| Ruta | Qué es |
| --- | --- |
| `content/paginas/*.md` | Textos de cada página: `title`, `description`, H1, intro y contenido (Markdown). |
| `content/original/` | Textos, metadatos y HTML extraídos del WordPress anterior (referencia). |
| `content/imagenes-manifest.json` | Orden y `alt` originales de cada imagen. |
| `content/urls-viejas.txt` | URLs viejas que deben redirigir (301). |
| `src/data/contacto.ts` | **Números de WhatsApp, asesoras, mensajes, horario, redes, mapa y Google Tag.** |
| `src/assets/<carpeta>/` | Fotos de cada galería. |
| `src/components/` | Header, Footer, Galería (lightbox), Video YouTube, banda CTA, etc. |
| `public/_redirects` | Redirecciones 301 (generadas, no editar a mano). |
| `public/og/` | Imágenes 1200×630 para compartir en redes. |

## Cambiar números de WhatsApp

Edita `src/data/contacto.ts`:

```ts
export const LINEAS = [
  { numero: '3108609114', asesora: 'Lorena Rodríguez', principal: true },
  { numero: '3016003031', asesora: 'Vanessa Camacho' },
  { numero: '3003108492', asesora: 'Johanna Lugo' },
];
```

- `principal: true` es el número de los botones generales, del botón flotante y de la banda naranja.
- El mensaje prellenado de cada servicio está en el campo `whatsapp:` de su archivo en `content/paginas/`.

## Agregar fotos a una galería

1. Copia la foto (jpg, png o webp, idealmente de 1200 px o más de ancho) en la carpeta del servicio:

   | Página | Carpeta |
   | --- | --- |
   | Pistas de baile LED | `src/assets/pistas-led/` |
   | Pantallas y videowall | `src/assets/videowall/` |
   | Sonido e iluminación | `src/assets/sonido-e-iluminacion/` |
   | Mobiliario lounge | `src/assets/mobiliario-lounge/` |
   | Mobiliario rústico | `src/assets/mobiliario-rustico/` |
   | Sillas y mesas | `src/assets/sillas-y-mesas/` |

2. Ponle un nombre descriptivo en minúsculas con guiones, por ejemplo `pista-led-boda-salon.jpg`.
   El texto alternativo (alt) se genera a partir del nombre: "pista led boda salon".
3. Las fotos nuevas aparecen al final de la galería. Astro las convierte solo a AVIF/WebP en varios tamaños.

Para borrar una foto, elimina el archivo. La primera foto de cada carpeta es la que aparece en la cabecera de la página.

## Redirecciones de URLs viejas

1. Pega las URLs viejas en `content/urls-viejas.txt` (una por línea) **o** guarda el sitemap antiguo como `content/sitemap-viejo.xml`.
2. Ejecuta `npm run redirects`. Se regenera `public/_redirects` con 301 a la página más afín según palabras clave
   (pantallas → videowall, luces/sonido → sonido e iluminación, pistas/pisos → pistas LED, sillas/mesas → sillas y mesas,
   lounge/salas/barras → mobiliario lounge, rústico/madera → mobiliario rústico, contacto → contáctanos, el resto → inicio).
3. Haz commit y push.

## Publicar

Cada push a `main` se puede publicar automáticamente con **Workers Builds** de Cloudflare (repositorio conectado):

- Comando de build: `npm run build`
- Comando de deploy: `npx wrangler deploy`

Manual, desde tu computador (con `npx wrangler login` hecho una vez):

```bash
npm run deploy
```

La configuración del Worker está en `wrangler.jsonc` (nombre `ltndj-com`, sirve `./dist`, 404 propia, barra final automática).

## Regenerar imágenes derivadas

`npm run imagenes` vuelve a generar el logo claro, el favicon y las imágenes Open Graph de `public/og/`.
