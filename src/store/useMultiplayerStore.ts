import { create } from 'zustand';
import { db } from '../lib/firebase';
import { doc, setDoc, updateDoc, onSnapshot, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { countries, Country } from '../data/countries';
import { Question } from './useGameStore';
import { v4 as uuidv4 } from 'uuid';

import { playCorrectSound, playWrongSound, playMatchStartSound } from '../lib/audio';

export interface ChaosEvent {
  id: string;
  text: string;
  type: 'steal' | 'boost' | 'tax' | 'swap';
  timestamp: number;
}

export interface MultiplayerPlayer {
  displayName: string;
  photoURL: string | null;
  score: number;
  hasAnswered: boolean;
  isHost: boolean;
  isReady: boolean;
  selectedOption: string | null;
  jokers: {
    fiftyFifty: boolean;
    peek: boolean;
    double: boolean;
  };
  activeJoker: string | null;
  hasSpunWheel: boolean;
}

export interface MultiplayerGameData {
  status: 'waiting' | 'started' | 'spinning' | 'completed';
  createdBy: string;
  playerIds: string[];
  players: Record<string, MultiplayerPlayer>;
  questions: Question[];
  currentQuestionIndex: number;
  recentEvents: ChaosEvent[];
}

interface MultiplayerState {
  roomId: string | null;
  roomData: MultiplayerGameData | null;
  loading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  
  createRoom: (user: any) => Promise<string>;
  joinRoom: (roomId: string, user: any) => Promise<void>;
  leaveRoom: (uid: string) => Promise<void>;
  toggleReady: (uid: string) => Promise<void>;
  startGame: () => Promise<void>;
  answerQuestion: (uid: string, countryCode: string) => Promise<void>;
  nextQuestion: () => Promise<void>;
  finishGame: () => Promise<void>;
  useJoker: (uid: string, jokerType: 'fiftyFifty' | 'peek' | 'double') => Promise<void>;
  spinWheel: (uid: string, points: number) => Promise<void>;
}

const generateQuestions = (count: number = 10): Question[] => {
  const shuffled = [...countries].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(country => {
    const others = countries.filter(c => c.code !== country.code);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [country, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return {
      id: uuidv4(),
      countryCode: country.code,
      options,
      correctOption: country
    };
  });
};

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const normalizeGameData = (rawData: any): MultiplayerGameData | null => {
  if (!rawData) return null;
  let status: MultiplayerGameData['status'] = rawData.status;
  if (status === ('playing' as any)) status = 'started';
  if (!['waiting', 'started', 'spinning', 'completed'].includes(status)) {
    status = 'waiting';
  }

  const players: Record<string, MultiplayerPlayer> = {};
  if (rawData.players && typeof rawData.players === 'object') {
    Object.entries(rawData.players).forEach(([pid, pData]: [string, any]) => {
      players[pid] = {
        displayName: pData?.displayName || 'Oyuncu',
        photoURL: pData?.photoURL ?? null,
        score: typeof pData?.score === 'number' ? pData.score : 0,
        hasAnswered: !!pData?.hasAnswered,
        isHost: !!pData?.isHost,
        isReady: !!pData?.isReady,
        selectedOption: pData?.selectedOption ?? null,
        jokers: {
          fiftyFifty: pData?.jokers?.fiftyFifty ?? true,
          peek: pData?.jokers?.peek ?? true,
          double: pData?.jokers?.double ?? true,
        },
        activeJoker: pData?.activeJoker ?? null,
        hasSpunWheel: !!pData?.hasSpunWheel,
      };
    });
  }

  return {
    status,
    createdBy: rawData.createdBy || '',
    playerIds: Array.isArray(rawData.playerIds) ? rawData.playerIds : Object.keys(players),
    players,
    questions: Array.isArray(rawData.questions) ? rawData.questions : [],
    currentQuestionIndex: typeof rawData.currentQuestionIndex === 'number' ? rawData.currentQuestionIndex : 0,
    recentEvents: Array.isArray(rawData.recentEvents) ? rawData.recentEvents : [],
  };
};

export const useMultiplayerStore = create<MultiplayerState>((set, get) => ({
  roomId: null,
  roomData: null,
  loading: false,
  error: null,
  unsubscribe: null,

  createRoom: async (user) => {
    set({ loading: true, error: null });
    const roomId = generateRoomCode();
    const questions = generateQuestions(10);
    
    const initialData: MultiplayerGameData = {
      status: 'waiting',
      createdBy: user.uid,
      playerIds: [user.uid],
      players: {
        [user.uid]: {
          displayName: user.displayName || 'Oyuncu',
          photoURL: user.photoURL,
          score: 0,
          hasAnswered: false,
          isHost: true,
          isReady: true,
          selectedOption: null,
          jokers: { fiftyFifty: true, peek: true, double: true },
          activeJoker: null,
          hasSpunWheel: false
        }
      },
      questions,
      currentQuestionIndex: 0,
      recentEvents: []
    };

    try {
      await setDoc(doc(db, 'games', roomId), initialData);
      
      const unsubscribe = onSnapshot(doc(db, 'games', roomId), (docSnap) => {
        if (docSnap.exists()) {
          const normalized = normalizeGameData(docSnap.data());
          set({ roomData: normalized, roomId });
        } else {
          set({ error: 'Oda bulunamadı veya kapatıldı.', roomId: null, roomData: null });
        }
      }, (err) => {
        console.error("Firestore onSnapshot error:", err);
        set({ error: err.message, loading: false });
      });

      set({ unsubscribe, loading: false });
      return roomId;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  joinRoom: async (roomId: string, user: any) => {
    set({ loading: true, error: null });
    const cleanRoomId = roomId.trim().toUpperCase();
    const roomRef = doc(db, 'games', cleanRoomId);
    
    try {
      const snap = await getDoc(roomRef);
      if (!snap.exists()) {
        throw new Error('Geçersiz oda kodu.');
      }
      
      const data = snap.data() as MultiplayerGameData;
      if (data.status !== 'waiting') {
        throw new Error('Oyun zaten başlamış.');
      }

      await updateDoc(roomRef, {
        playerIds: arrayUnion(user.uid),
        [`players.${user.uid}`]: {
          displayName: user.displayName || 'Oyuncu',
          photoURL: user.photoURL,
          score: 0,
          hasAnswered: false,
          isHost: false,
          isReady: false,
          selectedOption: null,
          jokers: { fiftyFifty: true, peek: true, double: true },
          activeJoker: null,
          hasSpunWheel: false
        }
      });

      const unsubscribe = onSnapshot(roomRef, (docSnap) => {
        if (docSnap.exists()) {
          const normalized = normalizeGameData(docSnap.data());
          set({ roomData: normalized, roomId: cleanRoomId });
        } else {
          set({ error: 'Oda kapatıldı.', roomId: null, roomData: null });
        }
      }, (err) => {
        console.error("Firestore onSnapshot error:", err);
        set({ error: err.message, loading: false });
      });

      set({ unsubscribe, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  leaveRoom: async (uid: string) => {
    const { roomId, unsubscribe } = get();
    if (unsubscribe) unsubscribe();
    
    if (roomId) {
      // Cleanup locally, and potentially in DB if we want, 
      // but for simplicity we just stop listening.
      set({ roomId: null, roomData: null, unsubscribe: null });
    }
  },

  toggleReady: async (uid: string) => {
    const { roomId, roomData } = get();
    if (!roomId || !roomData) return;
    
    const currentState = roomData.players?.[uid]?.isReady ?? false;
    await updateDoc(doc(db, 'games', roomId), {
      [`players.${uid}.isReady`]: !currentState
    });
  },

  useJoker: async (uid: string, jokerType: 'fiftyFifty' | 'peek' | 'double') => {
    const { roomId, roomData } = get();
    if (!roomId || !roomData) return;
    
    const player = roomData.players?.[uid];
    if (!player || player.hasAnswered || !player.jokers?.[jokerType] || player.activeJoker) return;

    await updateDoc(doc(db, 'games', roomId), {
      [`players.${uid}.jokers.${jokerType}`]: false,
      [`players.${uid}.activeJoker`]: jokerType
    });
  },

  startGame: async () => {
    const { roomId, roomData } = get();
    if (!roomId) return;
    const updates: any = { status: 'started' };
    if (!roomData?.questions || roomData.questions.length === 0) {
      updates.questions = generateQuestions(10);
      updates.currentQuestionIndex = 0;
    }
    await updateDoc(doc(db, 'games', roomId), updates);
  },

  answerQuestion: async (uid: string, countryCode: string) => {
    const { roomId, roomData } = get();
    if (!roomId || !roomData) return;

    const currentQ = roomData.questions?.[roomData.currentQuestionIndex];
    if (!currentQ) return;
    
    const player = roomData.players?.[uid];
    if (!player || player.hasAnswered) return;

    const isCorrect = currentQ.correctOption.code === countryCode;
    
    if (isCorrect) {
      playCorrectSound();
    } else {
      playWrongSound();
    }
    
    const updates: any = {
      [`players.${uid}.hasAnswered`]: true,
      [`players.${uid}.selectedOption`]: countryCode,
    };

    if (isCorrect) {
      const isDouble = player.activeJoker === 'double';
      const basePoints = isDouble ? 30 : 15;
      updates[`players.${uid}.score`] = increment(basePoints);

      // 25% Chance for Chaos Event!
      if (Math.random() > 0.75) {
        const otherPlayerIds = (roomData.playerIds || []).filter(id => id !== uid && roomData.players?.[id]);
        if (otherPlayerIds.length > 0) {
          const types = ['steal', 'boost', 'tax'] as const;
          const type = types[Math.floor(Math.random() * types.length)];
          const myName = player.displayName || 'Oyuncu';
          const targetId = otherPlayerIds[Math.floor(Math.random() * otherPlayerIds.length)];
          const targetName = roomData.players[targetId]?.displayName || 'Rakip';

          let eventText = '';
          switch (type) {
            case 'steal':
              updates[`players.${uid}.score`] = increment(20); // 15 base + 20 stolen
              updates[`players.${targetId}.score`] = increment(-20);
              eventText = `🥷 KAOOS! ${myName}, ${targetName}'den 20 puan çaldı!`;
              break;
            case 'boost':
              updates[`players.${uid}.score`] = increment(35); // 15 base + 35 boost
              eventText = `🚀 ŞANS! ${myName} gizli hazineyi buldu! (+35 Puan)`;
              break;
            case 'tax':
              updates[`players.${uid}.score`] = increment(5); // 15 base - 10 tax
              eventText = `📉 GÜMRÜK! ${myName} yanlış vize ile yakalandı! (-10 Puan)`;
              break;
          }

          updates.recentEvents = arrayUnion({
            id: uuidv4(),
            text: eventText,
            type,
            timestamp: Date.now()
          });
        }
      }
    }

    await updateDoc(doc(db, 'games', roomId), updates);
  },

  nextQuestion: async () => {
    const { roomId, roomData } = get();
    if (!roomId || !roomData) return;

    const updates: any = {
      currentQuestionIndex: increment(1)
    };

    // Reset answered status for all players
    roomData.playerIds.forEach(pid => {
      updates[`players.${pid}.hasAnswered`] = false;
      updates[`players.${pid}.selectedOption`] = null;
      updates[`players.${pid}.activeJoker`] = null;
    });

    await updateDoc(doc(db, 'games', roomId), updates);
  },

  finishGame: async () => {
    const { roomId } = get();
    if (!roomId) return;
    await updateDoc(doc(db, 'games', roomId), { status: 'spinning' });
  },

  spinWheel: async (uid: string, points: number) => {
    const { roomId, roomData } = get();
    if (!roomId || !roomData) return;

    const updates: any = {
      [`players.${uid}.hasSpunWheel`]: true,
      [`players.${uid}.score`]: increment(points)
    };

    // Check if everyone else has spun (excluding the current user since their state is not in roomData yet)
    const others = (roomData.playerIds || []).filter(pid => pid !== uid);
    const allOthersSpun = others.every(pid => roomData.players?.[pid]?.hasSpunWheel);

    if (allOthersSpun) {
      updates.status = 'completed';
    }

    await updateDoc(doc(db, 'games', roomId), updates);
  }
}));
