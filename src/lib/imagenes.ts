import type { ImageMetadata } from 'astro';
import manifiesto from '../../content/imagenes-manifest.json';

// Todas las imágenes de src/assets/<carpeta>/<archivo>
const archivos = import.meta.glob<{ default: ImageMetadata }>('/src/assets/*/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

export interface Foto {
  src: ImageMetadata;
  alt: string;
  archivo: string;
}

type Item = { orden: number; archivo: string; alt: string };
const paginas = (manifiesto as { paginas: Record<string, Item[]> }).paginas;

/** Alt del manifiesto original; si la foto es nueva, se deriva del nombre del archivo. */
function altDe(carpeta: string, archivo: string): string {
  const item = paginas[carpeta]?.find((i) => i.archivo === archivo);
  if (item?.alt) return item.alt;
  return archivo.replace(/\.[a-z]+$/, '').replace(/[-_]+/g, ' ').trim();
}

function ordenDe(carpeta: string, archivo: string): number {
  return paginas[carpeta]?.find((i) => i.archivo === archivo)?.orden ?? 9999;
}

export function imagen(carpeta: string, archivo: string): Foto {
  const mod = archivos[`/src/assets/${carpeta}/${archivo}`];
  if (!mod) throw new Error(`Imagen no encontrada: src/assets/${carpeta}/${archivo}`);
  return { src: mod.default, alt: altDe(carpeta, archivo), archivo };
}

/** Fotos de una carpeta, en el orden del sitio original (las nuevas van al final, por nombre). */
export function galeria(carpeta: string): Foto[] {
  const prefijo = `/src/assets/${carpeta}/`;
  return Object.keys(archivos)
    .filter((k) => k.startsWith(prefijo))
    .map((k) => k.slice(prefijo.length))
    .sort((a, b) => ordenDe(carpeta, a) - ordenDe(carpeta, b) || a.localeCompare(b))
    .map((archivo) => imagen(carpeta, archivo));
}
