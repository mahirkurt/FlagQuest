/**
 * Sürüm damgası ve kayma denetimi.
 *
 * Servis çalışanı gezinme isteklerini ön belleğe alınmış `index.html`'den
 * karşıladığı için, yeni bir dağıtımdan sonra tarayıcı hâlâ eski kabuğu
 * çalıştırabilir: eski HTML eski varlık adlarını ister, o varlıklar da ön
 * bellekte durduğu için hiçbir hata oluşmaz ve kayma kendiliğinden fark
 * edilmez. Bu modül kaymayı görünür kılar ve bir kez zorla onarır.
 *
 * `surum.json` kasıtlı olarak ön belleğe alınmaz (`vite.config.ts` içinde
 * workbox `globIgnores`), bu yüzden `fetch` ağa çıkar ve yayındaki gerçek
 * derlemeyi bildirir.
 */

export type SurumBilgisi = { kod: string; derleme: string };

/** Bu kabuğun içine gömülü derleme kimliği. */
export const SURUM: SurumBilgisi = __FQ_SURUM__;

const SIFIRLAMA_BAYRAGI = 'fq_surum_sifirlama';

/** Profil ekranında gösterilen insan okur etiket. */
export function surumEtiketi(): string {
  const zaman = new Date(SURUM.derleme);
  if (Number.isNaN(zaman.getTime())) return SURUM.kod;
  const bicim = new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
  return `${SURUM.kod} · ${bicim.format(zaman)}`;
}

/**
 * Yayındaki derleme kimliğini okur; bu kabuktan farklıysa servis çalışanını
 * kaldırır, bütün ön bellekleri siler ve sayfayı bir kez yeniler. Oturum
 * bayrağı, onarım işe yaramadığı durumda sonsuz yenileme döngüsünü engeller.
 */
export async function surumDenetle(): Promise<void> {
  if (import.meta.env.DEV) return;

  let yayindaki: SurumBilgisi | null = null;
  try {
    const yanit = await fetch('/surum.json', { cache: 'no-store' });
    if (!yanit.ok) return;
    yayindaki = (await yanit.json()) as SurumBilgisi;
  } catch {
    // Çevrimdışı, dosya yok veya JSON değil: denetim sessizce atlanır.
    return;
  }

  if (!yayindaki?.derleme || yayindaki.derleme === SURUM.derleme) return;

  try {
    if (sessionStorage.getItem(SIFIRLAMA_BAYRAGI)) return;
    sessionStorage.setItem(SIFIRLAMA_BAYRAGI, '1');
  } catch {
    // sessionStorage kapalıysa döngü koruması yoktur; onarımı denemeyiz.
    return;
  }

  console.warn(
    `[FlagQuest] Eski kabuk çalışıyor (${SURUM.derleme}); yayındaki derleme ${yayindaki.derleme}. Ön bellek sıfırlanıyor.`
  );

  try {
    if ('serviceWorker' in navigator) {
      const kayitlar = await navigator.serviceWorker.getRegistrations();
      await Promise.all(kayitlar.map(kayit => kayit.unregister()));
    }
    if ('caches' in window) {
      const anahtarlar = await caches.keys();
      await Promise.all(anahtarlar.map(anahtar => caches.delete(anahtar)));
    }
  } catch {
    // Silme başarısız olsa da yeniden yükleme denenir.
  }

  // `location.reload()` giriş belgesini tarayıcının HTTP ön belleğinden alabilir;
  // sunucu başlıklarını yönetmediğimiz ortamlarda (Cloud Run) bu, sıfırlamayı
  // boşa çıkarır. `cache: 'reload'` ağdan çekip HTTP ön bellek girdisini
  // tazeler, böylece yeniden yükleme yeni belgeyi bulur.
  try {
    await fetch(window.location.href, { cache: 'reload' });
  } catch {
    // Ağ yoksa yine de yeniden yüklemeyi dene.
  }

  window.location.reload();
}
