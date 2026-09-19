import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
}

interface QuestState {
  date: string;
  quests: DailyQuest[];
  checkAndResetQuests: () => void;
  incrementQuestProgress: (id: string, amount?: number) => void;
  claimReward: (id: string) => Promise<number>;
}

const getTodayString = () => new Date().toISOString().slice(0, 10);

// Görev ikonu burada tutulmaz: arayüz ikonu görev kimliğinden lucide-react
// düğümüne eşler (bkz. components/DailyQuestsModal.tsx). Marka kuralı gereği
// arayüzde emoji kullanılmaz ve kalıcı durum görsel veri taşımaz.
const generateDailyQuests = (): DailyQuest[] => [
  {
    id: 'play_game',
    title: 'Günün Kâşifi',
    description: 'Herhangi bir oyun modunda bir tur tamamla.',
    target: 1,
    current: 0,
    xpReward: 30,
    completed: false,
    claimed: false
  },
  {
    id: 'streak_3',
    title: 'Ateşli Seri',
    description: 'Art arda üç doğru cevaplık bir seri yakala.',
    target: 3,
    current: 0,
    xpReward: 40,
    completed: false,
    claimed: false
  },
  {
    id: 'answer_5',
    title: 'Bayrak Ustası',
    description: 'Bugün toplam beş bayrağı doğru bil.',
    target: 5,
    current: 0,
    xpReward: 50,
    completed: false,
    claimed: false
  }
];

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      date: getTodayString(),
      quests: generateDailyQuests(),

      checkAndResetQuests: () => {
        const today = getTodayString();
        if (get().date !== today) {
          set({
            date: today,
            quests: generateDailyQuests()
          });
        }
      },

      incrementQuestProgress: (id: string, amount = 1) => {
        get().checkAndResetQuests();
        const quests = get().quests.map(q => {
          if (q.id !== id || q.completed) return q;
          const newCurrent = Math.min(q.target, q.current + amount);
          return {
            ...q,
            current: newCurrent,
            completed: newCurrent >= q.target
          };
        });
        set({ quests });
      },

      claimReward: async (id: string) => {
        const quests = get().quests;
        const targetQuest = quests.find(q => q.id === id);
        if (!targetQuest || !targetQuest.completed || targetQuest.claimed) {
          return 0;
        }

        const updated = quests.map(q => q.id === id ? { ...q, claimed: true } : q);
        set({ quests: updated });

        // Award XP
        await useAuthStore.getState().updateUserStats(targetQuest.xpReward, 0);
        return targetQuest.xpReward;
      }
    }),
    {
      name: 'daily-quests-storage'
    }
  )
);
