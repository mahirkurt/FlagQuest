/**
 * Mod kayıt defteri — başlık, açıklama, kategori rengi ve ikon için TEK kaynak.
 *
 * Renk eşlemesi marka kitabındaki mod → renk tablosundan gelir ve modun
 * kimliğidir: aynı mod uygulamanın her yerinde aynı rengi taşır. Altı renk sekiz
 * modu karşılar; rengi paylaşan iki çift ikonuyla ayrışır
 * (Klasik play / Günlük calendar, Blitz clock / Ansiklopedi globe).
 *
 * Kategori rengi bir DURUM bildiriminde kullanılmaz; doğru/yanlış için yalnızca
 * vize ve damga kullanılır.
 */
import {
  Calendar,
  Clock,
  Compass,
  Flag,
  Globe,
  Play,
  Search,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { MarkaRengi } from '../components/ds';
import type { GameMode } from '../store/useGameStore';

export interface ModTanimi {
  baslik: string;
  /** Tek satır: modun ne yaptığını ve puanlamanın kuralını söyler. */
  aciklama: string;
  renk: MarkaRengi;
  Ikon: LucideIcon;
  /** Kısa kategori etiketi; BÜYÜK HARF. */
  etiket?: string;
}

/** Oyun mağazasındaki modlar ile ana sayfadaki iki ek yüzey. */
export type ModAnahtari = GameMode | 'duello' | 'ansiklopedi';

export const MODLAR: Record<ModAnahtari, ModTanimi> = {
  classic: {
    baslik: 'Klasik Mod',
    aciklama: '10 bayrak. Üç doğrudan sonra çarpan açılır.',
    renk: 'altin',
    Ikon: Play,
    etiket: 'POPÜLER',
  },
  time_attack: {
    baslik: 'Zamana Karşı',
    aciklama: '60 saniye. Doğru +3 sn, yanlış −2 sn.',
    renk: 'meridyen',
    Ikon: Clock,
    etiket: 'HIZLI',
  },
  reverse: {
    baslik: 'Ters Bayrak',
    aciklama: 'Ülke verilir, dört bayraktan doğrusunu seç.',
    renk: 'vize',
    Ikon: Flag,
    etiket: 'GÖRSEL',
  },
  detective: {
    baslik: 'Gizemli Dedektif',
    aciklama: 'İpucu açtıkça puan düşer: 30, 20, 10.',
    renk: 'erguvan',
    Ikon: Search,
    etiket: 'ZEKÂ',
  },
  world_tour: {
    baslik: 'Dünya Turu',
    aciklama: 'Tek kıtadan altı bayrak. Seferi bitir.',
    renk: 'bozkir',
    Ikon: Compass,
    etiket: 'SEFER',
  },
  daily: {
    baslik: 'Günün Soruları',
    aciklama: 'Güne özel beş bayrak. Gece yarısı yenilenir.',
    renk: 'altin',
    Ikon: Calendar,
    etiket: 'GÜNLÜK',
  },
  mistake_vault: {
    baslik: 'Hata Kumbarası Pratiği',
    aciklama: 'Yanıldığın ülkeler. Doğru bilince silinir.',
    renk: 'altin',
    Ikon: Target,
  },
  duello: {
    baslik: 'Canlı Düello',
    aciklama: 'Oda kur veya kodla katıl. Doğru 15 puan.',
    renk: 'damga',
    Ikon: Users,
    etiket: 'CANLI',
  },
  ansiklopedi: {
    baslik: 'Bayrak Ansiklopedisi',
    aciklama: '195 ülkenin bayrağı, başkenti ve bilgisi.',
    renk: 'meridyen',
    Ikon: Globe,
  },
};

export function mod(anahtar: ModAnahtari): ModTanimi {
  return MODLAR[anahtar] ?? MODLAR.classic;
}
