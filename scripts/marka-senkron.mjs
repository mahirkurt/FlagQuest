/**
 * Tasarım sistemindeki logo ailesinden public/ girişlerini tazeler.
 *
 * public/ altındaki favicon ve PWA ikonları sabit URL'lerden servis edildiği için
 * kopya olmak zorundadır (index.html ve PWA manifest'i bu yollara bakar). Bu betik
 * o kopyaların tek kaynaktan — flagquest-tasarim-sistemi/assets/Logo — türetilmesini
 * sağlar; marka güncellendiğinde çalıştırılır ve public/ sapmaz.
 *
 * İkonlar burada ÇİZİLMEZ, yalnızca kopyalanır: marka kuralı gereği amblem yeniden
 * çizilmez, kitteki elle hazırlanmış dosyalar olduğu gibi kullanılır.
 *
 * Kullanım: node scripts/marka-senkron.mjs
 */
import fs from 'fs';
import path from 'path';

const KAYNAK = path.resolve('flagquest-tasarim-sistemi/assets/Logo');
const HEDEF = path.resolve('public');

/** [kaynak (Logo klasörüne göre), public altındaki ad] */
const ESLEME = [
  ['svg/flagquest-fly-favicon.svg', 'favicon.svg'],
  ['ico/favicon.ico', 'favicon.ico'],
  ['png/flagquest-fly-app-ikon-192.png', 'pwa-192x192.png'],
  ['png/flagquest-fly-app-ikon-512.png', 'pwa-512x512.png'],
  ['png/flagquest-fly-app-ikon-180.png', 'apple-touch-icon.png'],
];

fs.mkdirSync(HEDEF, { recursive: true });

for (const [kaynakYolu, hedefAdi] of ESLEME) {
  const kaynak = path.join(KAYNAK, kaynakYolu);
  if (!fs.existsSync(kaynak)) {
    throw new Error(`Kaynak varlık bulunamadı: ${kaynak}`);
  }
  fs.copyFileSync(kaynak, path.join(HEDEF, hedefAdi));
  console.log(`public/${hedefAdi} ← ${kaynakYolu}`);
}
