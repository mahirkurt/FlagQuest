/**
 * Türkçe sayı ve süre biçimlendirme.
 *
 * Marka kuralı: ondalık ayırıcı virgül, binlik ayırıcı nokta (1.250 XP, %62,4);
 * süre "42 sn" biçiminde yazılır.
 */

const TAM = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });

/** 1250 → "1.250" */
export function sayi(deger: number): string {
  return TAM.format(Number.isFinite(deger) ? deger : 0);
}

/** 62.4 → "%62,4" (varsayılan bir ondalık basamak). */
export function yuzde(deger: number, basamak = 1): string {
  const bicimli = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: basamak,
    maximumFractionDigits: basamak,
  }).format(Number.isFinite(deger) ? deger : 0);
  return `%${bicimli}`;
}

/** 42 → "42 sn". Tam saniye sayacı için. */
export function sure(saniye: number): string {
  return `${sayi(Math.max(0, Math.round(saniye)))} sn`;
}

/** 1834 (ms) → "1,8 sn". Tepki süresi için. */
export function sureMs(milisaniye: number, basamak = 1): string {
  const bicimli = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: basamak,
    maximumFractionDigits: basamak,
  }).format(Math.max(0, milisaniye) / 1000);
  return `${bicimli} sn`;
}

/** ISO 3166-1 alpha-2 kodu arayüzde daima BÜYÜK HARF gösterilir. */
export function ulkeKodu(kod: string): string {
  return (kod || '').toUpperCase();
}
