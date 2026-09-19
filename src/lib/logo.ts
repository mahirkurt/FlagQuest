/**
 * Marka varlıkları — tek kaynak.
 *
 * Dosyalar tasarım sisteminden doğrudan içe aktarılır; public/ altında kopyası
 * tutulmaz (favicon ve PWA ikonları hariç — onlar sabit URL'den servis edilmek
 * zorunda olduğu için scripts/marka-senkron.mjs ile kopyalanır). Vite bu
 * import'ları varlık olarak işler, parmak izli URL üretir.
 *
 * SON EK KURALI — Logo Kiti 2.0'da son ek MÜREKKEBİ değil ZEMİNİ belirtir:
 *   -koyu  → koyu zeminde kullanılır (altın kütle)   → gece teması
 *   -acik  → açık zeminde kullanılır (lacivert kütle) → kâğıt teması
 * Bu, 1.0 kitindeki kuralın tersidir; eski dosya adlarına göre eşleme yapma.
 */
import amblemAcik from '../../flagquest-tasarim-sistemi/assets/Logo/svg/flagquest-fly-amblem-acik.svg';
import amblemKoyu from '../../flagquest-tasarim-sistemi/assets/Logo/svg/flagquest-fly-amblem-koyu.svg';
import dikeyAcik from '../../flagquest-tasarim-sistemi/assets/Logo/svg/flagquest-fly-dikey-acik.svg';
import dikeyKoyu from '../../flagquest-tasarim-sistemi/assets/Logo/svg/flagquest-fly-dikey-koyu.svg';
import yatayAcik from '../../flagquest-tasarim-sistemi/assets/Logo/svg/flagquest-fly-yatay-acik.svg';
import yatayKoyu from '../../flagquest-tasarim-sistemi/assets/Logo/svg/flagquest-fly-yatay-koyu.svg';
import type { Tema } from './tema';

export type LogoCesidi = 'yatay' | 'dikey' | 'amblem';

const VARLIKLAR: Record<Tema, Record<LogoCesidi, string>> = {
  gece: { yatay: yatayKoyu, dikey: dikeyKoyu, amblem: amblemKoyu },
  kagit: { yatay: yatayAcik, dikey: dikeyAcik, amblem: amblemAcik },
};

/**
 * En küçük kullanım genişlikleri: yatay kilit 160 px, dikey kilit 140 px,
 * amblem 24 px. Bunun altına inilmez; 24 px altında favicon sürümü kullanılır.
 */

export function logoYolu(tema: Tema, cesit: LogoCesidi): string {
  return VARLIKLAR[tema][cesit];
}
