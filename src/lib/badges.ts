export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const BADGES: Record<string, Badge> = {
  'first_win': {
    id: 'first_win',
    name: 'İlk Zafer',
    description: 'İlk çok oyunculu maçını kazandın!',
    icon: '🏆',
    color: 'from-amber-400 to-orange-500'
  },
  'veteran': {
    id: 'veteran',
    name: 'Arena Şampiyonu',
    description: 'Çok oyunculu modda 5 maç kazandın!',
    icon: '👑',
    color: 'from-purple-500 to-indigo-500'
  },
  'high_score': {
    id: 'high_score',
    name: 'Skor Canavarı',
    description: 'Tek maçta 300+ puan elde ettin!',
    icon: '🔥',
    color: 'from-red-500 to-rose-600'
  },
  'chaos_master': {
    id: 'chaos_master',
    name: 'Kaos Ustası',
    description: 'Toplamda 10 oyun oynadın.',
    icon: '🌀',
    color: 'from-emerald-400 to-teal-500'
  },
  'streak_master': {
    id: 'streak_master',
    name: 'Ateşli Kombo',
    description: 'Tek oyunda art arda 5 doğru cevap bildin!',
    icon: '⚡',
    color: 'from-amber-500 to-red-500'
  },
  'blitz_master': {
    id: 'blitz_master',
    name: 'Zamanın Efendisi',
    description: 'Zamana Karşı Blitz modunda 100+ puan aldın!',
    icon: '⏱️',
    color: 'from-blue-500 to-cyan-500'
  },
  'passport_explorer': {
    id: 'passport_explorer',
    name: 'Pasaport Kaşifi',
    description: 'Pasaportuna 25 farklı ülke damgası ekledin!',
    icon: '🛂',
    color: 'from-teal-500 to-emerald-600'
  },
  'vault_cleaner': {
    id: 'vault_cleaner',
    name: 'Hata Avcısı',
    description: 'Hata Kumbarası ile yanlışlarını pratik yapıp temizledin!',
    icon: '🎯',
    color: 'from-violet-500 to-purple-600'
  },
  'tour_champion': {
    id: 'tour_champion',
    name: 'Dünya Turu Fatihi',
    description: 'Dünya Turu Seferinde bir kıtayı fethettin!',
    icon: '🌍',
    color: 'from-sky-400 to-indigo-600'
  }
};

export interface UserTitle {
  title: string;
  color: string;
  bg: string;
  border: string;
}

export const getUserTitle = (level: number): UserTitle => {
  if (level >= 15) {
    return {
      title: 'Dünya Elçisi',
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800'
    };
  }
  if (level >= 10) {
    return {
      title: 'Baş Kartograf',
      color: 'text-purple-500 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-200 dark:border-purple-800'
    };
  }
  if (level >= 6) {
    return {
      title: 'Usta Kaşif',
      color: 'text-indigo-500 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-800'
    };
  }
  if (level >= 3) {
    return {
      title: 'Hevesli Gezgin',
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800'
    };
  }
  return {
    title: 'Çırak Seyyah',
    color: 'text-sky-500 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-800'
  };
};

