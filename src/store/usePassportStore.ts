import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Country, countries } from '../data/countries';
import { KITALAR, ulkeKitasi, type Kita } from '../lib/kitalar';
import { playStampSound } from '../lib/audio';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from './useAuthStore';

export interface PassportStamp {
  code: string;
  name: string;
  capital: string;
  region: string;
  unlockedAt: string;
  timesCorrect: number;
}

interface PassportState {
  stamps: Record<string, PassportStamp>;
  unlockCountry: (country: Country) => boolean;
  isUnlocked: (code: string) => boolean;
  getTotalUnlocked: () => number;
  getContinentStats: () => Record<Kita, { unlocked: number; total: number }>;
}

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      stamps: {},

      unlockCountry: (country: Country) => {
        const { stamps } = get();
        const existing = stamps[country.code];
        const isNew = !existing;

        const updatedStamp: PassportStamp = {
          code: country.code,
          name: country.name,
          capital: country.capital,
          region: country.region,
          unlockedAt: existing ? existing.unlockedAt : new Date().toISOString(),
          timesCorrect: (existing?.timesCorrect || 0) + 1
        };

        const newStamps = {
          ...stamps,
          [country.code]: updatedStamp
        };

        set({ stamps: newStamps });

        if (isNew) {
          playStampSound();
        }

        // Background sync to user Firestore profile if logged in with Firebase Auth
        const user = useAuthStore.getState().user;
        if (user && !user.uid.startsWith('guest_')) {
          try {
            const userRef = doc(db, 'users', user.uid);
            setDoc(userRef, {
              passportCount: Object.keys(newStamps).length,
              lastStampAt: new Date().toISOString()
            }, { merge: true }).catch(() => {});
          } catch (e) {
            // Non-critical background sync
          }
        }

        return isNew;
      },

      isUnlocked: (code: string) => {
        return !!get().stamps[code];
      },

      getTotalUnlocked: () => {
        return Object.keys(get().stamps).length;
      },

      getContinentStats: () => {
        const { stamps } = get();
        const stats = Object.fromEntries(
          KITALAR.map(k => [k, { unlocked: 0, total: 0 }])
        ) as Record<Kita, { unlocked: number; total: number }>;

        countries.forEach(c => {
          const kita = ulkeKitasi(c.region);
          if (!kita) return;
          stats[kita].total += 1;
          if (stamps[c.code]) {
            stats[kita].unlocked += 1;
          }
        });

        return stats;
      }
    }),
    {
      name: 'passport-storage'
    }
  )
);
