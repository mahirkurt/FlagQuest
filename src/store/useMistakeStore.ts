import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Country } from '../data/countries';

export interface MistakeEntry {
  code: string;
  name: string;
  capital: string;
  region: string;
  funFact: string;
  wrongCount: number;
  lastFailedAt: string;
}

interface MistakeState {
  mistakes: Record<string, MistakeEntry>;
  recordMistake: (country: Country) => void;
  removeMistake: (countryCode: string) => void;
  clearAllMistakes: () => void;
  getMistakesCount: () => number;
  getAllMistakes: () => MistakeEntry[];
}

export const useMistakeStore = create<MistakeState>()(
  persist(
    (set, get) => ({
      mistakes: {},

      recordMistake: (country: Country) => {
        const { mistakes } = get();
        const existing = mistakes[country.code];

        const updatedEntry: MistakeEntry = {
          code: country.code,
          name: country.name,
          capital: country.capital,
          region: country.region,
          funFact: country.funFact,
          wrongCount: (existing?.wrongCount || 0) + 1,
          lastFailedAt: new Date().toISOString()
        };

        set({
          mistakes: {
            ...mistakes,
            [country.code]: updatedEntry
          }
        });
      },

      removeMistake: (countryCode: string) => {
        const { mistakes } = get();
        const newMistakes = { ...mistakes };
        delete newMistakes[countryCode];
        set({ mistakes: newMistakes });
      },

      clearAllMistakes: () => {
        set({ mistakes: {} });
      },

      getMistakesCount: () => {
        return Object.keys(get().mistakes).length;
      },

      getAllMistakes: () => {
        return Object.values(get().mistakes).sort(
          (a, b) => new Date(b.lastFailedAt).getTime() - new Date(a.lastFailedAt).getTime()
        );
      }
    }),
    {
      name: 'mistakes-vault-storage'
    }
  )
);
