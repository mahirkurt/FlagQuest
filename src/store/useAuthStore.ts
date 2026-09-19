import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface UserStats {
  gamesPlayed: number;
  totalScore: number;
  correctAnswers: number;
  multiplayerWins?: number;
  highestScore?: number;
}

export interface UserSettings {
  darkMode: boolean;
  notifications: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  xp: number;
  level: number;
  stats: UserStats;
  settings: UserSettings;
  badges: string[];
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  updateUserStats: (score: number, correctAnswers: number, isMultiplayerWin?: boolean) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  checkAndAwardBadges: () => Promise<string[]>;
}

const INITIAL_STATS: UserStats = {
  gamesPlayed: 0,
  totalScore: 0,
  correctAnswers: 0,
};

const INITIAL_SETTINGS: UserSettings = {
  darkMode: true,
  notifications: true,
};

const calculateLevel = (xp: number) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      initialized: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setInitialized: (initialized) => set({ initialized }),
      
      updateUserStats: async (score, correctAnswers, isMultiplayerWin = false) => {
        const { user } = get();
        if (!user) return;
        
        const newXp = user.xp + score;
        const newLevel = calculateLevel(newXp);
        
        const currentHighest = user.stats.highestScore || 0;
        const currentWins = user.stats.multiplayerWins || 0;

        const newStats: UserStats = {
          gamesPlayed: user.stats.gamesPlayed + 1,
          totalScore: user.stats.totalScore + score,
          correctAnswers: user.stats.correctAnswers + correctAnswers,
          highestScore: Math.max(currentHighest, score),
          multiplayerWins: currentWins + (isMultiplayerWin ? 1 : 0),
        };
        
        const updatedUser = {
          ...user,
          xp: newXp,
          level: newLevel,
          stats: newStats,
        };
        
        set({ user: updatedUser });
        
        // Sync to cloud only if logged in with Firebase Auth (not guest)
        if (auth.currentUser && !user.uid.startsWith('guest_')) {
          try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
              xp: newXp,
              level: newLevel,
              stats: newStats,
              lastActive: new Date()
            });
            
            // Update leaderboard
            const lbRef = doc(db, 'leaderboard', user.uid);
            await setDoc(lbRef, {
              userId: user.uid,
              displayName: user.displayName,
              xp: newXp,
              level: newLevel,
              updatedAt: new Date()
            }, { merge: true });
          } catch (error) {
            console.warn("Failed to sync stats to cloud (running in offline/local mode):", error);
          }
        }
      },
      
      checkAndAwardBadges: async () => {
        const { user } = get();
        if (!user) return [];

        const earnedIds = user.badges || [];
        const newBadges: string[] = [];

        const stats = user.stats;
        const wins = stats.multiplayerWins || 0;
        const games = stats.gamesPlayed || 0;
        const highestScore = stats.highestScore || 0;

        if (wins >= 1 && !earnedIds.includes('first_win')) newBadges.push('first_win');
        if (wins >= 5 && !earnedIds.includes('veteran')) newBadges.push('veteran');
        if (highestScore >= 300 && !earnedIds.includes('high_score')) newBadges.push('high_score');
        if (games >= 10 && !earnedIds.includes('chaos_master')) newBadges.push('chaos_master');

        if (newBadges.length > 0) {
          const updatedBadges = [...earnedIds, ...newBadges];
          set({ user: { ...user, badges: updatedBadges } });
          
          if (auth.currentUser && !user.uid.startsWith('guest_')) {
            try {
              const userRef = doc(db, 'users', user.uid);
              await updateDoc(userRef, { badges: updatedBadges });
            } catch (error) {
              console.warn("Failed to sync badges to cloud:", error);
            }
          }
        }
        
        return newBadges;
      },
      
      updateSettings: async (settings) => {
        const { user } = get();
        if (!user) return;
        
        const newSettings = { ...user.settings, ...settings };
        const updatedUser = { ...user, settings: newSettings };
        
        set({ user: updatedUser });
        
        if (auth.currentUser && !user.uid.startsWith('guest_')) {
          try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { settings: newSettings });
          } catch (error) {
            console.warn("Failed to sync settings to cloud:", error);
          }
        }
      }
    }),
    {
      name: 'flagquest-auth-storage',
      partialize: (state) => ({ user: state.user }) // Keep local user state for offline access
    }
  )
);

export const syncUserFromFirestore = async (uid: string) => {
  if (!uid || uid.startsWith('guest_')) return;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      useAuthStore.getState().setUser(snap.data() as UserProfile);
      return;
    }
  } catch (error: any) {
    console.warn("Notice: Firestore sync deferred or offline (using local profile):", error?.message || error);
  }

  // Fallback: If document does not exist yet or offline, preserve or initialize local user
  const currentUser = auth.currentUser;
  const existingUser = useAuthStore.getState().user;
  if (currentUser && (!existingUser || existingUser.uid !== uid)) {
    const fallbackProfile: UserProfile = {
      uid: currentUser.uid,
      email: currentUser.email || '',
      displayName: currentUser.displayName || 'Oyuncu',
      photoURL: currentUser.photoURL,
      xp: existingUser?.xp || 0,
      level: existingUser?.level || 1,
      stats: existingUser?.stats || { gamesPlayed: 0, totalScore: 0, correctAnswers: 0 },
      settings: existingUser?.settings || { darkMode: true, notifications: true },
      badges: existingUser?.badges || []
    };
    useAuthStore.getState().setUser(fallbackProfile);
  }
};
