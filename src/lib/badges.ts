/**
 * Başarı rozetleri.
 *
 * Rozet kimlikleri Firestore'daki user.badges dizisinde saklanır; DEĞİŞTİRİLMEZ.
 * İkonlar lucide-react düğümleridir — marka kuralı gereği arayüzde emoji kullanılmaz.
 * Kilitli rozetin açıklaması rozetin ne olduğunu değil NASIL kazanılacağını söyler
 * ve kalan miktarı yazar; bu yüzden metin bir işlevdir.
 */
import {
  Crown,
  Flame,
  Gamepad2,
  Globe,
  Stamp,
  Target,
  Timer,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { sayi } from './bicim';

/** Kilitli rozet metninin kalan miktarı hesaplayabilmesi için gereken ilerleme. */
export interface RozetIlerlemesi {
  oyunlar: number;
  galibiyetler: number;
  enYuksekSkor: number;
  damgalar: number;
}

export interface RozetTanimi {
  id: string;
  ad: string;
  /** Kazanılmış rozetin açıklaması: oyuncunun ne yaptığını söyler. */
  aciklama: string;
  /** Kilitli rozetin açıklaması: nasıl kazanılacağını ve kalanı söyler. */
  kilitliAciklama: (ilerleme: RozetIlerlemesi) => string;
  Ikon: LucideIcon;
}

const kalan = (hedef: number, mevcut: number) => sayi(Math.max(0, hedef - mevcut));

export const ROZETLER: Record<string, RozetTanimi> = {
  first_win: {
    id: 'first_win',
    ad: 'İlk Zafer',
    aciklama: 'İlk çok oyunculu maçını kazandın.',
    kilitliAciklama: () => 'Bir canlı düello kazan.',
    Ikon: Trophy,
  },
  veteran: {
    id: 'veteran',
    ad: 'Arena Şampiyonu',
    aciklama: 'Canlı düelloda beş maç kazandın.',
    kilitliAciklama: (i) => `Beş düello kazan — ${kalan(5, i.galibiyetler)} kaldı.`,
    Ikon: Crown,
  },
  high_score: {
    id: 'high_score',
    ad: 'Skor Canavarı',
    aciklama: 'Tek maçta 300 puanı aştın.',
    kilitliAciklama: (i) => `Tek maçta 300 puan yap — en iyin ${sayi(i.enYuksekSkor)}.`,
    Ikon: Flame,
  },
  chaos_master: {
    id: 'chaos_master',
    ad: 'Kaos Ustası',
    aciklama: 'Toplamda on tur tamamladın.',
    kilitliAciklama: (i) => `On tur tamamla — ${kalan(10, i.oyunlar)} kaldı.`,
    Ikon: Gamepad2,
  },
  streak_master: {
    id: 'streak_master',
    ad: 'Ateşli Kombo',
    aciklama: 'Tek oyunda art arda beş doğru cevap bildin.',
    kilitliAciklama: () => 'Tek oyunda art arda beş doğru cevap bil.',
    Ikon: Zap,
  },
  blitz_master: {
    id: 'blitz_master',
    ad: 'Zamanın Efendisi',
    aciklama: 'Zamana Karşı modunda 100 puanı aştın.',
    kilitliAciklama: () => 'Zamana Karşı modunda 100 puan yap.',
    Ikon: Timer,
  },
  passport_explorer: {
    id: 'passport_explorer',
    ad: 'Pasaport Kâşifi',
    aciklama: 'Pasaportuna 25 farklı ülke damgası ekledin.',
    kilitliAciklama: (i) => `25 ülke damgası topla — ${kalan(25, i.damgalar)} kaldı.`,
    Ikon: Stamp,
  },
  vault_cleaner: {
    id: 'vault_cleaner',
    ad: 'Hata Avcısı',
    aciklama: 'Hata Kumbarası pratiğiyle yanlışlarını temizledin.',
    kilitliAciklama: () => 'Hata Kumbarası pratiğinde bir turu tamamla.',
    Ikon: Target,
  },
  tour_champion: {
    id: 'tour_champion',
    ad: 'Dünya Turu Fatihi',
    aciklama: 'Dünya Turu seferinde bir kıtayı fethettin.',
    kilitliAciklama: () => 'Bir Dünya Turu seferini tamamla.',
    Ikon: Globe,
  },
};

/** Seviye unvanları: Çırak Seyyah → Hevesli Gezgin → Usta Kâşif → Baş Kartograf → Dünya Elçisi. */
export function seviyeUnvani(seviye: number): string {
  if (seviye >= 15) return 'Dünya Elçisi';
  if (seviye >= 10) return 'Baş Kartograf';
  if (seviye >= 6) return 'Usta Kâşif';
  if (seviye >= 3) return 'Hevesli Gezgin';
  return 'Çırak Seyyah';
}
