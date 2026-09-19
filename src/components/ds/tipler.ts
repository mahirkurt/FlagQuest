/**
 * FlagQuest tasarım sistemi — ortak tipler.
 *
 * Sözleşmenin kaynağı flagquest-tasarim-sistemi/components/index.d.ts'tir;
 * sınıf adları flagquest-tasarim-sistemi/components/bundle.css ile birebir aynıdır
 * (o dosya src/ds.css olarak uygulamaya bağlanmıştır). Bileşenler kendi ikonlarını
 * çizmez, `ikon` prop'uyla dışarıdan alır.
 */

/** Mod ve kategori renkleri. Durum bildirimi için KULLANILMAZ. */
export type MarkaRengi = 'altin' | 'damga' | 'vize' | 'meridyen' | 'erguvan' | 'bozkir';

const RENKLER: MarkaRengi[] = ['altin', 'damga', 'vize', 'meridyen', 'erguvan', 'bozkir'];

export function renkSinifi(onek: string, renk?: MarkaRengi): string {
  return `${onek}--${renk && RENKLER.includes(renk) ? renk : 'altin'}`;
}

/** Sınıf adlarını boşlukla birleştirir; yanlış/boş değerleri atar. */
export function sinif(...parcalar: Array<string | false | null | undefined>): string {
  return parcalar.filter(Boolean).join(' ');
}
