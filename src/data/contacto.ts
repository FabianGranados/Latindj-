// Datos de contacto centralizados. Cambia aquí números, mensajes y redes.

export const NEGOCIO = {
  nombre: 'Latin Audiovisuales',
  marca: 'Latin DJ',
  url: 'https://ltndj.com',
  direccion: 'Calle 2b # 41 a 37',
  barrio: 'Barrio El Jazmín',
  ciudad: 'Bogotá',
  region: 'Bogotá D.C.',
  pais: 'CO',
  email: 'servicioslatindj@hotmail.com',
  // Etiqueta de Google (gtag). Verificar contra el HTML del sitio anterior.
  googleTag: 'GT-K58Q95RQ',
};

export interface Linea {
  /** Número local sin espacios, 10 dígitos */
  numero: string;
  /** Nombre de la asesora. Déjalo vacío si no se conoce. */
  asesora: string;
  principal?: boolean;
}

// TODO: asignar el nombre de cada asesora (LORENA / VANESSA) a su número.
export const LINEAS: Linea[] = [
  { numero: '3108609114', asesora: '', principal: true },
  { numero: '3016003031', asesora: '' },
  { numero: '3003108492', asesora: '' },
];

export const PRINCIPAL = LINEAS.find((l) => l.principal) ?? LINEAS[0];

/** 3108609114 → "310 860 9114" */
export function formatear(numero: string): string {
  return numero.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}

/** Enlace wa.me con mensaje prellenado */
export function whatsapp(mensaje = MENSAJES.general, numero = PRINCIPAL.numero): string {
  return `https://wa.me/57${numero}?text=${encodeURIComponent(mensaje)}`;
}

export const MENSAJES = {
  general: 'Hola, quiero cotizar alquiler para mi evento en Bogotá.',
  contacto: 'Hola, me comunico desde la página web y quiero información para mi evento.',
};

export const REDES = [
  { nombre: 'Instagram', url: 'https://www.instagram.com/latinaudiovisuales/', icono: 'instagram' },
  { nombre: 'Facebook', url: 'https://www.facebook.com/ltndj/', icono: 'facebook' },
  // Agregar aquí YouTube, Flickr y LinkedIn con la URL exacta del footer anterior:
  // { nombre: 'YouTube', url: 'https://www.youtube.com/…', icono: 'youtube' },
  // { nombre: 'Flickr', url: 'https://www.flickr.com/…', icono: 'flickr' },
  // { nombre: 'LinkedIn', url: 'https://www.linkedin.com/…', icono: 'linkedin' },
] as const;
