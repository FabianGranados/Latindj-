// Genera recursos derivados de las imágenes originales:
//  - src/assets/logo/logo-latin-claro.png  (texto "LATIN" en claro para fondo oscuro)
//  - public/favicon.png, public/apple-touch-icon.png
//  - public/og/<pagina>.jpg (1200×630 para Open Graph / Twitter)
// Uso: npm run imagenes
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const LOGO = 'src/assets/logo/logo-latin-dj.png';
const ICONO = 'src/assets/logo/icono.png';

// 1) Logo claro: los píxeles oscuros (texto "LATIN") pasan a #F4F1EC; se elimina la sombra gris.
{
  const { data, info } = await sharp(LOGO).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a === 0) continue;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max < 90) {
      // texto oscuro → claro
      data[i] = 0xf4; data[i + 1] = 0xf1; data[i + 2] = 0xec;
    } else if (max - min < 25) {
      // sombra gris / blanco → transparente
      data[i + 3] = 0;
    }
  }
  await sharp(data, { raw: info })
    .trim()
    .resize({ width: 640 })
    .png({ compressionLevel: 9, palette: true })
    .toFile('src/assets/logo/logo-latin-claro.png');
}

// 2) Favicon
await sharp(ICONO).resize(64, 64).png().toFile('public/favicon.png');
await sharp(ICONO).resize(180, 180).flatten({ background: '#ffffff' }).png().toFile('public/apple-touch-icon.png');

// 3) Imágenes Open Graph 1200×630
const og = {
  inicio: 'src/assets/pistas-led/pistas-de-baile-en-bogota.webp',
  'mobiliario-lounge': 'src/assets/mobiliario-lounge/alquiler-de-sala-lounge-para-eventos-en-bogota.jpg',
  'mobiliario-rustico': 'src/assets/mobiliario-rustico/alquiler-de-salas-en-madera.jpg',
  'sillas-y-mesas': 'src/assets/sillas-y-mesas/mesas-y-sillas-para-eventos-en-bogota.jpg',
  videowall: 'src/assets/videowall/alquiler-de-pantallas-led.jpg',
  'sonido-e-iluminacion': 'src/assets/sonido-e-iluminacion/alquiler-de-luces-para-eventos-en-bogota.jpg',
  'pistas-led': 'src/assets/pistas-led/pistas-de-baile-en-bogota.webp',
  contactanos: 'src/assets/inicio/sonido-e-iluminacion-para-eventos.jpg',
};
await mkdir('public/og', { recursive: true });
for (const [nombre, src] of Object.entries(og)) {
  await sharp(src)
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`public/og/${nombre}.jpg`);
}
console.log('Imágenes derivadas generadas.');
