import { getCollection, type CollectionEntry } from 'astro:content';
import { imagen } from './imagenes';

export type Pagina = CollectionEntry<'paginas'>;

export async function servicios() {
  const todas = await getCollection('paginas', (p) => p.data.tipo === 'servicio');
  return todas
    .sort((a, b) => a.data.orden - b.data.orden)
    .map((p) => ({
      ...p.data,
      id: p.id,
      foto: imagen('inicio', p.data.portada!),
    }));
}

export type Servicio = Awaited<ReturnType<typeof servicios>>[number];

export async function pagina(id: string) {
  const todas = await getCollection('paginas');
  const p = todas.find((x) => x.id === id);
  if (!p) throw new Error(`Página no encontrada: ${id}`);
  return p;
}
