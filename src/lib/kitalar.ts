/**
 * Kıta gruplaması — uygulamadaki TEK kaynak.
 *
 * data/countries.ts ham bölge alanında altı ayrı değer kullanır ("Kuzey Amerika",
 * "Güney Amerika", "Avrupa/Asya" dâhil). Arayüz ise beş kıta konuşur. Bu dosya
 * ikisi arasındaki eşlemeyi tek yerde tutar; Dünya Turu, pasaport kıta
 * istatistikleri ve ansiklopedi filtresi aynı gruplamayı kullanır.
 *
 * Her ülke tam bir kıtaya aittir; toplamlar 195'e tamamlanır. Türkiye ham veride
 * "Avrupa/Asya" olarak geçer ve burada Avrupa'ya sayılır — ülke kartında ham
 * bölge metni olduğu gibi gösterilmeye devam eder.
 */
import { Building2, Landmark, Mountain, Sun, Waves, type LucideIcon } from 'lucide-react';
import { countries, type Country } from '../data/countries';

export type Kita = 'Avrupa' | 'Asya' | 'Afrika' | 'Amerika' | 'Okyanusya';

export const KITALAR: Kita[] = ['Avrupa', 'Asya', 'Afrika', 'Amerika', 'Okyanusya'];

const BOLGE_KITA: Record<string, Kita> = {
  Avrupa: 'Avrupa',
  'Avrupa/Asya': 'Avrupa',
  Asya: 'Asya',
  Afrika: 'Afrika',
  'Kuzey Amerika': 'Amerika',
  'Güney Amerika': 'Amerika',
  Okyanusya: 'Okyanusya',
};

export const KITA_IKONLARI: Record<Kita, LucideIcon> = {
  Avrupa: Landmark,
  Asya: Mountain,
  Afrika: Sun,
  Amerika: Building2,
  Okyanusya: Waves,
};

/** Ham bölge metnini kıtaya çevirir; eşleşmeyen bölge için null döner. */
export function ulkeKitasi(bolge: string): Kita | null {
  return BOLGE_KITA[bolge] ?? null;
}

/** Verilen kıtaya ait ülkeler. Dünya Turu havuzu buradan gelir. */
export function kitaUlkeleri(kita: Kita): Country[] {
  return countries.filter((c) => ulkeKitasi(c.region) === kita);
}

/** Kıta başına toplam ülke sayısı. */
export function kitaToplamlari(): Record<Kita, number> {
  const toplam = Object.fromEntries(KITALAR.map((k) => [k, 0])) as Record<Kita, number>;
  countries.forEach((c) => {
    const kita = ulkeKitasi(c.region);
    if (kita) toplam[kita] += 1;
  });
  return toplam;
}
