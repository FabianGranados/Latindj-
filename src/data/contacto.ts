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
  // Etiqueta de Google (gtag), tomada del HTML del sitio anterior.
  googleTag: 'GT-K58Q95RQ',
  nota: 'Cita previa',
};

export interface Linea {
  /** Número local sin espacios, 10 dígitos */
  numero: string;
  /** Nombre visible en la tarjeta (genérico: las personas cambian seguido) */
  nombre: string;
  principal?: boolean;
}

export const LINEAS: Linea[] = [
  { numero: '3108609114', nombre: 'Asesor 1', principal: true },
  { numero: '3016003031', nombre: 'Asesor 2' },
  { numero: '3003108492', nombre: 'Asesor 3' },
];

export const HORARIO = [
  { dias: 'Lunes a Viernes', horas: '8:00 a.m. a 5:00 p.m.', schema: 'Mo-Fr 08:00-17:00' },
  { dias: 'Sábados', horas: '8:00 a.m. a 1:00 p.m.', schema: 'Sa 08:00-13:00' },
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
  { nombre: 'YouTube', url: 'https://www.youtube.com/watch?v=PKhrIeYVun4', icono: 'youtube' },
  { nombre: 'Flickr', url: 'https://www.flickr.com/photos/latinaudiovisuales/', icono: 'flickr' },
  { nombre: 'LinkedIn', url: 'https://www.linkedin.com/in/latin-audiovisuales', icono: 'linkedin' },
] as const;

/** Publicaciones de Instagram que se mostraban en las páginas de servicio */
export const INSTAGRAM_POSTS = [
  'https://www.instagram.com/p/Bxx1JU7gJOB/',
  'https://www.instagram.com/p/BV5daUOlWJ7/',
];

/** Mapa de Google (misma consulta del sitio anterior) */
export const MAPA_EMBED = 'https://maps.google.com/maps?q=Calle%202b%20%23%2041%20A%2037%2C%20Bogot%C3%A1&t=m&z=15&output=embed&iwloc=near';
