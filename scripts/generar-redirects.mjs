// Genera public/_redirects (formato Cloudflare) a partir de las URLs viejas.
// Fuentes:
//   - content/urls-viejas.txt  (una URL o ruta por línea; # = comentario)
//   - content/sitemap-viejo.xml (opcional: el sitemap antiguo tal cual, se leen los <loc>)
// Uso: npm run redirects
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const VIGENTES = [
  '/',
  '/alquiler-de-mobiliario-para-eventos/',
  '/mobiliario-rustico-para-eventos/',
  '/sillas-y-mesas-para-eventos/',
  '/alquiler-de-videowall-bogota/',
  '/sonido-e-iluminacion/',
  '/alquiler-de-pistas-de-baile-led-bogota/',
  '/contactanos/',
];

// Orden = prioridad. Cada palabra se compara con el INICIO de cada palabra de la ruta
// (la ruta se parte por "-", "/" y "_", sin tildes), así "dj" no coincide con "latindj".
const REGLAS = [
  ['/alquiler-de-videowall-bogota/', ['pantalla', 'videowall', 'televisor', 'plasma', 'tv']],
  ['/sonido-e-iluminacion/', ['sonido', 'luces', 'luz', 'iluminacion', 'efecto', 'humo', 'lanzallamas', 'cabeza', 'dj', 'audio', 'ventur', 'truss', 'laser', 'cortina', 'cabina', 'bajo', 'consola', 'microfono', 'bose', 'estructura', 'dmx', 'controlador', 'miniteca', 'viejoteca']],
  ['/alquiler-de-pistas-de-baile-led-bogota/', ['pista', 'piso', 'tarima']],
  ['/sillas-y-mesas-para-eventos/', ['silla', 'mesa', 'mantel', 'tiffany', 'tyffanny', 'tablon']],
  ['/alquiler-de-mobiliario-para-eventos/', ['lounge', 'sala', 'puff', 'barra', 'sofa', 'poltrona', 'mobiliario', 'mueble', 'separador', 'ordenadores', 'cheilon']],
  ['/mobiliario-rustico-para-eventos/', ['rustic', 'madera', 'estiba']],
  ['/contactanos/', ['contact']],
];
// "video wall" escrito separado
const FRASES = [['/alquiler-de-videowall-bogota/', ['video-wall']]];

const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function ruta(linea) {
  let r = linea.trim();
  if (!r || r.startsWith('#')) return null;
  try {
    r = new URL(r, 'https://ltndj.com').pathname;
  } catch {
    return null;
  }
  r = decodeURIComponent(r);
  if (!r.endsWith('/') && !/\.[a-z0-9]{2,4}$/i.test(r)) r += '/';
  return r;
}

function destino(r) {
  // Hijos de una página vigente (adjuntos de WordPress, etc.) → la página madre
  const madre = VIGENTES.find((v) => v !== '/' && r.startsWith(v));
  if (madre) return madre;
  const n = sinTildes(r);
  for (const [dest, frases] of FRASES) if (frases.some((f) => n.includes(f))) return dest;
  const tokens = n.split(/[-/_.]+/).filter(Boolean);
  for (const [dest, palabras] of REGLAS) {
    if (palabras.some((p) => tokens.some((t) => t.startsWith(p)))) return dest;
  }
  return '/';
}

const rutas = new Set();
if (existsSync('content/urls-viejas.txt')) {
  for (const l of (await readFile('content/urls-viejas.txt', 'utf8')).split(/\r?\n/)) {
    const r = ruta(l);
    if (r) rutas.add(r);
  }
}
if (existsSync('content/sitemap-viejo.xml')) {
  const xml = await readFile('content/sitemap-viejo.xml', 'utf8');
  for (const m of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
    const r = ruta(m[1]);
    if (r) rutas.add(r);
  }
}

const lineas = [];
let total = 0;
for (const r of [...rutas].sort()) {
  if (VIGENTES.includes(r)) continue;
  const d = destino(r);
  if (d === r) continue;
  total++;
  // Cloudflare compara la ruta codificada (ñ → %C3%B1): se emite esa forma, con y sin slash final.
  // La ñ puede venir compuesta (%C3%B1) o descompuesta (n + %CC%83): se emiten ambas.
  const formas = new Set([encodeURI(r.normalize('NFC')), encodeURI(r.normalize('NFD'))]);
  for (const enc of formas) {
    lineas.push(`${enc} ${d} 301`);
    if (enc.endsWith('/') && enc !== '/') lineas.push(`${enc.slice(0, -1)} ${d} 301`);
  }
}

// Adjuntos de WordPress bajo cada página vigente (p. ej. /alquiler-de-videowall-bogota/pantalla-para-eventos/)
const dinamicas = [];
for (const v of VIGENTES.filter((v) => v !== '/')) {
  dinamicas.push(`${v}:adjunto/ ${v} 301`, `${v}:adjunto ${v} 301`);
}

const salida = [
  '# Generado por scripts/generar-redirects.mjs — no editar a mano.',
  `# ${total} URLs viejas → páginas nuevas (301).`,
  '',
  ...lineas,
  '',
  '# Adjuntos/subpáginas de WordPress bajo las páginas vigentes',
  ...dinamicas,
  '',
  '# Rutas de WordPress',
  '/feed/ / 301',
  '/comments/feed/ / 301',
  '/wp-login.php / 301',
  '/wp-admin/ / 301',
  '',
].join('\n');

await writeFile('public/_redirects', salida);
console.log(`public/_redirects: ${total} URLs viejas (${lineas.length} reglas estáticas) + ${dinamicas.length} reglas de adjuntos.`);
