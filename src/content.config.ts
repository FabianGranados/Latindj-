import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const paginas = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/paginas' }),
  schema: z.object({
    ruta: z.string(),
    tipo: z.enum(['inicio', 'servicio', 'contacto']),
    orden: z.number().default(0),
    /** <title> y meta description (conservados del sitio original) */
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    etiqueta: z.string(),
    intro: z.string(),
    /** Nombre y descripción corta para las tarjetas de servicio */
    nombre: z.string().optional(),
    resumen: z.string().optional(),
    /** Imagen de la tarjeta (src/assets/inicio/…) */
    portada: z.string().optional(),
    /** Carpeta de la galería en src/assets/ */
    carpeta: z.string().optional(),
    /** Imagen Open Graph en public/og/ */
    og: z.string(),
    whatsapp: z.string().optional(),
    /** IDs de videos de YouTube */
    videos: z.array(z.object({ id: z.string(), titulo: z.string() })).default([]),
  }),
});

export const collections = { paginas };
