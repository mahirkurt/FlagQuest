import { create } from 'zustand';
import { countries, Country } from '../data/countries';
import { playCorrectSound, playWrongSound, playComboSound, playLifelineSound } from '../lib/audio';
import { usePassportStore } from './usePassportStore';
import { useMistakeStore } from './useMistakeStore';
import { useQuestStore } from './useQuestStore';
import { useBadgeStore } from './useBadgeStore';
import { kitaUlkeleri, type Kita } from '../lib/kitalar';

export type GameMode = 
  | 'classic'        // 10 random flag questions
  | 'time_attack'    // 60-second Blitz, correct adds time, wrong cuts time
  | 'reverse'        // 4 Flags shown, pick correct flag for country name & capital
  | 'detective'      // Clues revealed sequentially (region/capital -> fun fact -> flag unblur)
  | 'world_tour'     // Continent expedition
  | 'mistake_vault'  // Practice specifically with mistaked countries
  | 'daily';         // Daily seeded challenge

export interface Question {
  id: string;
  countryCode: string;
  options: Country[];
  correctOption: Country;
}

interface GameState {
  mode: GameMode;
  selectedContinent?: Kita;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  correctAnswers: number;
  status: 'idle' | 'playing' | 'completed';
  selectedOption: string | null;
  userAnswers: Record<number, string>;
  
  // Streak & Multipliers
  streak: number;
  maxStreak: number;
  multiplier: number;
  
  // Time Attack
  timeLeft: number;
  timerActive: boolean;
  
  // Detective Clue Stage (1: Capital/Region, 2: Fun Fact, 3: Full Flag)
  clueStage: number;
  
  // Lifelines
  fiftyFiftyUsed: boolean;
  hintUsed: boolean;
  hintStage: number; // 0: None, 1: Continent/Region, 2: Capital, 3: Fun Fact / Extra
  hiddenOptionCodes: string[];

  // Performance & Reaction Timing
  questionStartTime: number;
  responseTimes: number[]; // response time per question in ms
  
  // Actions
  startClassic: () => void;
  startTimeAttack: () => void;
  startReverse: () => void;
  startDetective: () => void;
  startWorldTour: (kita: Kita) => void;
  startMistakePractice: () => boolean;
  startDailyChallenge: () => void;
  startSinglePlayer: () => void; // alias for classic
  
  answerQuestion: (countryCode: string) => void;
  nextQuestion: () => void;
  useFiftyFifty: () => void;
  useHint: () => void;
  advanceDetectiveClue: () => void;
  decrementTime: (deltaSeconds?: number) => void;
  finishGame: () => void;
  resetGame: () => void;
}

const generateQuestionSet = (pool: Country[], count: number = 10): Question[] => {
  const effectivePool = pool.length > 0 ? pool : countries;
  const shuffled = [...effectivePool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, effectivePool.length));

  return selected.map(country => {
    const others = countries.filter(c => c.code !== country.code);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [country, ...shuffledOthers].sort(() => 0.5 - Math.random());

    return {
      id: Math.random().toString(36).substring(2, 11),
      countryCode: country.code,
      options,
      correctOption: country
    };
  });
};

const getDailyQuestions = (): Question[] => {
  // Deterministic daily seed based on date string YYYYMMDD
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const numSeed = parseInt(dateStr, 10);
  
  const shuffled = [...countries].sort((a, b) => {
    const hashA = (a.code.charCodeAt(0) * 31 + a.code.charCodeAt(1) * 7 + numSeed) % 1000;
    const hashB = (b.code.charCodeAt(0) * 31 + b.code.charCodeAt(1) * 7 + numSeed) % 1000;
    return hashA - hashB;
  });

  return generateQuestionSet(shuffled.slice(0, 20), 5);
};

export const useGameStore = create<GameState>((set, get) => ({
  mode: 'classic',
  selectedContinent: undefined,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  correctAnswers: 0,
  status: 'idle',
  selectedOption: null,
  userAnswers: {},
  streak: 0,
  maxStreak: 0,
  multiplier: 1.0,
  timeLeft: 60,
  timerActive: false,
  clueStage: 1,
  fiftyFiftyUsed: false,
  hintUsed: false,
  hintStage: 0,
  hiddenOptionCodes: [],
  questionStartTime: Date.now(),
  responseTimes: [],

  startClassic: () => {
    const now = Date.now();
    set({
      mode: 'classic',
      questions: generateQuestionSet(countries, 10),
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      status: 'playing',
      selectedOption: null,
      userAnswers: {},
      streak: 0,
      maxStreak: 0,
      multiplier: 1.0,
      fiftyFiftyUsed: false,
      hintUsed: false,
      hiddenOptionCodes: [],
      timerActive: false,
      timeLeft: 60,
      clueStage: 1,
      questionStartTime: now,
      responseTimes: []
    });
  },

  startSinglePlayer: () => {
    get().startClassic();
  },

  startTimeAttack: () => {
    // 30 rapid questions pool
    const now = Date.now();
    set({
      mode: 'time_attack',
      questions: generateQuestionSet(countries, 30),
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      status: 'playing',
      selectedOption: null,
      userAnswers: {},
      streak: 0,
      maxStreak: 0,
      multiplier: 1.0,
      fiftyFiftyUsed: false,
      hintUsed: false,
      hiddenOptionCodes: [],
      timerActive: true,
      timeLeft: 60,
      clueStage: 1,
      questionStartTime: now,
      responseTimes: []
    });
  },

  startReverse: () => {
    const now = Date.now();
    set({
      mode: 'reverse',
      questions: generateQuestionSet(countries, 10),
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      status: 'playing',
      selectedOption: null,
      userAnswers: {},
      streak: 0,
      maxStreak: 0,
      multiplier: 1.0,
      fiftyFiftyUsed: false,
      hintUsed: false,
      hiddenOptionCodes: [],
      timerActive: false,
      timeLeft: 60,
      clueStage: 1,
      questionStartTime: now,
      responseTimes: []
    });
  },

  startDetective: () => {
    const now = Date.now();
    set({
      mode: 'detective',
      questions: generateQuestionSet(countries, 8),
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      status: 'playing',
      selectedOption: null,
      userAnswers: {},
      streak: 0,
      maxStreak: 0,
      multiplier: 1.0,
      fiftyFiftyUsed: false,
      hintUsed: false,
      hiddenOptionCodes: [],
      timerActive: false,
      timeLeft: 60,
      clueStage: 1,
      questionStartTime: now,
      responseTimes: []
    });
  },

  startWorldTour: (kita: Kita) => {
    // Kıta havuzu lib/kitalar.ts üzerinden gelir: ham bölge alanı "Kuzey Amerika",
    // "Güney Amerika" ve "Avrupa/Asya" değerlerini de kullandığı için düz metin
    // karşılaştırması bazı kıtalarda boş havuz üretirdi.
    const continentCountries = kitaUlkeleri(kita);
    const now = Date.now();
    set({
      mode: 'world_tour',
      selectedContinent: kita,
      questions: generateQuestionSet(continentCountries, 6),
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      status: 'playing',
      selectedOption: null,
      userAnswers: {},
      streak: 0,
      maxStreak: 0,
      multiplier: 1.0,
      fiftyFiftyUsed: false,
      hintUsed: false,
      hiddenOptionCodes: [],
      timerActive: false,
      timeLeft: 60,
      clueStage: 1,
      questionStartTime: now,
      responseTimes: []
    });
  },

  startMistakePractice: () => {
    const mistakes = useMistakeStore.getState().getAllMistakes();
    if (mistakes.length === 0) return false;

    const mistakeCountryCodes = new Set(mistakes.map(m => m.code));
    const targetCountries = countries.filter(c => mistakeCountryCodes.has(c.code));
    const now = Date.now();

    set({
      mode: 'mistake_vault',
      questions: generateQuestionSet(targetCountries, Math.min(10, targetCountries.length)),
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      status: 'playing',
      selectedOption: null,
      userAnswers: {},
      streak: 0,
      maxStreak: 0,
      multiplier: 1.0,
      fiftyFiftyUsed: false,
      hintUsed: false,
      hiddenOptionCodes: [],
      timerActive: false,
      timeLeft: 60,
      clueStage: 1,
      questionStartTime: now,
      responseTimes: []
    });
    return true;
  },

  startDailyChallenge: () => {
    const now = Date.now();
    set({
      mode: 'daily',
      questions: getDailyQuestions(),
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      status: 'playing',
      selectedOption: null,
      userAnswers: {},
      streak: 0,
      maxStreak: 0,
      multiplier: 1.0,
      fiftyFiftyUsed: false,
      hintUsed: false,
      hiddenOptionCodes: [],
      timerActive: false,
      timeLeft: 60,
      clueStage: 1,
      questionStartTime: now,
      responseTimes: []
    });
  },

  decrementTime: (deltaSeconds = 1) => {
    const { timeLeft, timerActive, status } = get();
    if (!timerActive || status !== 'playing') return;

    const newTime = Math.max(0, timeLeft - deltaSeconds);
    if (newTime === 0) {
      get().finishGame();
    } else {
      set({ timeLeft: newTime });
    }
  },

  advanceDetectiveClue: () => {
    const { clueStage } = get();
    if (clueStage < 3) {
      set({ clueStage: clueStage + 1 });
    }
  },

  useFiftyFifty: () => {
    const { questions, currentQuestionIndex, fiftyFiftyUsed, hiddenOptionCodes } = get();
    if (fiftyFiftyUsed) return;
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    const wrongOptions = currentQ.options.filter(o => o.code !== currentQ.correctOption.code);
    const shuffledWrongs = [...wrongOptions].sort(() => 0.5 - Math.random());
    const toHide = shuffledWrongs.slice(0, 2).map(o => o.code);

    playLifelineSound();
    set({
      fiftyFiftyUsed: true,
      hiddenOptionCodes: [...hiddenOptionCodes, ...toHide]
    });
  },

  useHint: () => {
    const { hintStage } = get();
    if (hintStage >= 2) return; // 1: Continent, 2: Capital
    playLifelineSound();
    set({ 
      hintUsed: true,
      hintStage: hintStage + 1 
    });
  },

  answerQuestion: (countryCode: string) => {
    const { 
      questions, currentQuestionIndex, selectedOption, score, 
      correctAnswers, userAnswers, streak, maxStreak, mode, 
      timeLeft, clueStage, questionStartTime, responseTimes 
    } = get();
    if (selectedOption !== null) return; // Already answered
    
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    const isCorrect = currentQ.correctOption.code === countryCode;
    const responseMs = Math.max(100, Date.now() - (questionStartTime || Date.now()));
    const updatedResponseTimes = [...responseTimes, responseMs];
    
    // Streak and multiplier logic
    const nextStreak = isCorrect ? streak + 1 : 0;
    const nextMaxStreak = Math.max(maxStreak, nextStreak);
    
    let nextMultiplier = 1.0;
    if (nextStreak >= 8) nextMultiplier = 3.0;
    else if (nextStreak >= 5) nextMultiplier = 2.0;
    else if (nextStreak >= 3) nextMultiplier = 1.5;

    // Mode-specific score calculation
    let basePoints = 10;
    if (mode === 'detective') {
      // Stage 1 = 30pts, Stage 2 = 20pts, Stage 3 = 10pts
      basePoints = clueStage === 1 ? 30 : (clueStage === 2 ? 20 : 10);
    } else if (mode === 'time_attack') {
      basePoints = 15;
    }

    const earnedScore = isCorrect ? Math.round(basePoints * nextMultiplier) : 0;

    if (isCorrect) {
      if (nextStreak >= 3) {
        playComboSound(nextStreak);
      } else {
        playCorrectSound();
      }

      // Passport unlock
      usePassportStore.getState().unlockCountry(currentQ.correctOption);

      // Quests progress
      useQuestStore.getState().incrementQuestProgress('answer_5');
      if (nextStreak >= 3) {
        useQuestStore.getState().incrementQuestProgress('streak_3', nextStreak);
      }

      // If practicing mistakes and answered correctly, remove from vault
      if (mode === 'mistake_vault') {
        useMistakeStore.getState().removeMistake(currentQ.correctOption.code);
      }

      // Check badge triggers
      if (nextStreak >= 5) {
        useBadgeStore.getState().showBadge('streak_master');
      }
    } else {
      playWrongSound();
      // Record into Mistake Vault
      useMistakeStore.getState().recordMistake(currentQ.correctOption);
    }

    // Time attack adjustments (+3s on correct, -2s on wrong)
    let updatedTimeLeft = timeLeft;
    if (mode === 'time_attack') {
      if (isCorrect) {
        updatedTimeLeft = Math.min(99, timeLeft + 3);
      } else {
        updatedTimeLeft = Math.max(0, timeLeft - 2);
      }
    }

    set({
      selectedOption: countryCode,
      score: score + earnedScore,
      correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
      streak: nextStreak,
      maxStreak: nextMaxStreak,
      multiplier: nextMultiplier,
      timeLeft: updatedTimeLeft,
      responseTimes: updatedResponseTimes,
      userAnswers: { ...userAnswers, [currentQuestionIndex]: countryCode }
    });

    // If time attack runs out due to penalty
    if (mode === 'time_attack' && updatedTimeLeft === 0) {
      get().finishGame();
    }
  },
  
  nextQuestion: () => {
    const { questions, currentQuestionIndex, mode } = get();
    
    if (currentQuestionIndex < questions.length - 1) {
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedOption: null,
        hiddenOptionCodes: [],
        hintUsed: false,
        hintStage: 0,
        clueStage: 1,
        questionStartTime: Date.now()
      });
    } else {
      get().finishGame();
    }
  },

  finishGame: () => {
    const { mode, score } = get();
    // Daily quest play_game completed
    useQuestStore.getState().incrementQuestProgress('play_game');

    if (mode === 'time_attack' && score >= 100) {
      useBadgeStore.getState().showBadge('blitz_master');
    }

    if (mode === 'world_tour') {
      useBadgeStore.getState().showBadge('tour_champion');
    }

    set({
      status: 'completed',
      timerActive: false
    });
  },
  
  resetGame: () => {
    set({
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      status: 'idle',
      selectedOption: null,
      userAnswers: {},
      streak: 0,
      maxStreak: 0,
      multiplier: 1.0,
      timeLeft: 60,
      timerActive: false,
      clueStage: 1,
      fiftyFiftyUsed: false,
      hintUsed: false,
      hintStage: 0,
      hiddenOptionCodes: [],
      questionStartTime: Date.now(),
      responseTimes: []
    });
  }
}));
