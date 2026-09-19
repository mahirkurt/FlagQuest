import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, ArrowRight, Loader2, Sparkles, BookOpen, 
  RotateCcw, Flame, Clock, HelpCircle, Eye, Zap, 
  Search, ShieldAlert, Award, Globe, MapPin, Lightbulb
} from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { useAuthStore } from '../store/useAuthStore';
import { getFlagUrl } from '../data/countries';
import { encyclopediaService } from '../services/encyclopediaService';
import { GameSummary } from '../components/GameSummary';
import { cn } from '../lib/utils';

export function Game() {
  const navigate = useNavigate();
  const { 
    mode, selectedContinent, questions, currentQuestionIndex, status, 
    answerQuestion, nextQuestion, resetGame, startSinglePlayer, 
    startWorldTour, selectedOption, score, correctAnswers, userAnswers,
    streak, maxStreak, multiplier, timeLeft, timerActive, decrementTime,
    clueStage, advanceDetectiveClue, fiftyFiftyUsed, hintUsed, hintStage,
    hiddenOptionCodes, responseTimes, useFiftyFifty, useHint
  } = useGameStore();
  const updateUserStats = useAuthStore(state => state.updateUserStats);
  
  const [isFinishing, setIsFinishing] = useState(false);

  // Timer countdown effect for Time Attack mode
  useEffect(() => {
    if (!timerActive || status !== 'playing' || mode !== 'time_attack') return;

    const interval = setInterval(() => {
      decrementTime(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, status, mode, decrementTime]);

  useEffect(() => {
    if (status === 'idle') {
      navigate('/');
    }
  }, [status, navigate]);

  const handleFinish = async (redirectTo: string = '/') => {
    setIsFinishing(true);
    await updateUserStats(score, correctAnswers);
    resetGame();
    navigate(redirectTo);
  };

  const handlePlayAgain = async () => {
    setIsFinishing(true);
    await updateUserStats(score, correctAnswers);
    if (mode === 'world_tour' && selectedContinent) {
      startWorldTour(selectedContinent);
    } else {
      startSinglePlayer();
    }
    setIsFinishing(false);
  };

  if (status === 'completed') {
    return (
      <GameSummary
        score={score}
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
        maxStreak={maxStreak}
        responseTimes={responseTimes}
        mode={mode}
        selectedContinent={selectedContinent}
        questions={questions}
        userAnswers={userAnswers}
        isFinishing={isFinishing}
        onFinish={handleFinish}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (questions.length === 0) return null;

  const currentQ = questions[currentQuestionIndex];
  const hasAnswered = selectedOption !== null;
  const currentSnippet = hasAnswered && currentQ?.correctOption
    ? encyclopediaService.getSnippetByCountryCode(currentQ.correctOption.code)
    : null;

  // Mode badge title & color
  const getModeInfo = () => {
    switch (mode) {
      case 'time_attack':
        return { title: 'Zamana Karşı Blitz', badge: 'bg-blue-500 text-white' };
      case 'reverse':
        return { title: 'Ters Bayrak Modu', badge: 'bg-emerald-500 text-white' };
      case 'detective':
        return { title: 'Gizemli Dedektif Modu', badge: 'bg-purple-600 text-white' };
      case 'world_tour':
        return { title: `Dünya Turu (${selectedContinent})`, badge: 'bg-amber-500 text-white' };
      case 'mistake_vault':
        return { title: 'Hata Kumbarası Pratiği', badge: 'bg-rose-500 text-white' };
      case 'daily':
        return { title: 'Günün Meydan Okuması', badge: 'bg-orange-500 text-white' };
      default:
        return { title: 'Klasik Mod', badge: 'bg-indigo-600 text-white' };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] p-4 md:p-6 max-w-md mx-auto">
      {/* Top Header: Mode & Streak Multiplier & Timer */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${modeInfo.badge}`}>
            {modeInfo.title}
          </span>
          {streak >= 2 && (
            <motion.span 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 text-[11px] font-black bg-gradient-to-r from-amber-500 to-red-500 text-white px-2.5 py-1 rounded-full shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
              {streak}x Seri ({multiplier}x)
            </motion.span>
          )}
        </div>

        {/* Time Attack Clock */}
        {mode === 'time_attack' ? (
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-colors shadow-sm",
            timeLeft <= 10 
              ? "bg-red-500 text-white animate-bounce" 
              : "bg-slate-900 text-white dark:bg-slate-800"
          )}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        ) : (
          <span className="text-xs font-bold text-indigo-500">Skor: {score}</span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-2">
        <span>Soru {currentQuestionIndex + 1}/{questions.length}</span>
        {mode === 'time_attack' && <span className="text-indigo-500 font-bold">Skor: {score}</span>}
      </div>
      
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mb-4 overflow-hidden">
        <motion.div 
          className="h-full bg-indigo-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Lifelines Bar (50:50 and Progressive Hint) */}
      <div className="flex flex-col gap-2.5 mb-4 px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={useFiftyFifty}
              disabled={fiftyFiftyUsed || hasAnswered}
              className={cn(
                "px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all shadow-sm",
                fiftyFiftyUsed
                  ? "opacity-40 line-through bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                  : "bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 active:scale-95 cursor-pointer"
              )}
              title="İki Yanlış Şıkkı Ele"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>50:50</span>
            </button>
            
            <button
              onClick={useHint}
              disabled={hintStage >= 2 || hasAnswered}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all shadow-sm",
                hintStage >= 2
                  ? "opacity-40 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                  : hintStage === 1
                  ? "bg-amber-500 hover:bg-amber-600 border-amber-600 text-white active:scale-95 cursor-pointer animate-pulse"
                  : "bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 active:scale-95 cursor-pointer"
              )}
              title={
                hintStage === 0 
                  ? "1. İpucu: Kıtayı Öğren" 
                  : hintStage === 1 
                  ? "2. İpucu: Başkenti Öğren" 
                  : "Tüm ipuçları kullanıldı"
              }
            >
              <Lightbulb className="w-3.5 h-3.5 fill-amber-500/20" />
              <span>{hintStage === 0 ? "İpucu Al" : hintStage === 1 ? "Ek İpucu (+Başkent)" : "İpucu Açık"}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-extrabold ml-0.5">
                {hintStage}/2
              </span>
            </button>
          </div>

          {/* Quick status pill */}
          {hintStage > 0 && (
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {hintStage === 1 ? "1/2 İpucu Aktif" : "Tam İpucu Aktif"}
            </span>
          )}
        </div>

        {/* Revealed Hint Banner / Card */}
        <AnimatePresence>
          {hintStage > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Stage 1: Continent / Region */}
                <div className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 border border-amber-200/80 dark:border-amber-800/80 px-2.5 py-1 rounded-xl text-slate-800 dark:text-slate-200 font-semibold shadow-2xs">
                  <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400 font-normal">Kıta / Bölge:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">{currentQ.correctOption.region}</span>
                </div>

                {/* Stage 2: Capital City */}
                {hintStage >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 border border-amber-200/80 dark:border-amber-800/80 px-2.5 py-1 rounded-xl text-slate-800 dark:text-slate-200 font-semibold shadow-2xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400 font-normal">Başkent:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{currentQ.correctOption.capital}</span>
                  </motion.div>
                )}
              </div>

              {hintStage === 1 && !hasAnswered && (
                <p className="text-[11px] text-amber-800 dark:text-amber-300/80 mt-1.5 flex items-center gap-1">
                  💡 <span>Hala zorlanıyor musun? Başkenti görmek için <strong>Ek İpucu</strong> butonuna tıkla.</span>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QUESTION VISUAL / CLUE CONTAINER */}
      {mode === 'reverse' ? (
        /* Reverse mode: Target Country Name & Capital is shown prominently */
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white text-center shadow-lg mb-4"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200 bg-white/10 px-2.5 py-0.5 rounded-full">
            Bu Bayrak Hangi Ülkenin?
          </span>
          <h2 className="text-2xl font-black mt-2 mb-1 tracking-tight">
            {currentQ.correctOption.name}
          </h2>
          <p className="text-xs text-indigo-100">
            Başkent: <span className="font-semibold text-white">{currentQ.correctOption.capital}</span> • {currentQ.correctOption.region}
          </p>
        </motion.div>
      ) : mode === 'detective' ? (
        /* Detective Mode: Stepped Clues & Blurred/Revealed Flag */
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800 mb-4"
        >
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <Search className="w-3.5 h-3.5" />
              Dedektif İpucu Seviyesi: {clueStage}/3
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {clueStage === 1 ? '30 XP' : clueStage === 2 ? '20 XP' : '10 XP'}
            </span>
          </div>

          {/* Stepped Clues */}
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 mb-3">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="font-bold text-slate-900 dark:text-white">1. İpucu:</span> Bölge: <span className="font-semibold">{currentQ.correctOption.region}</span> • Başkent: <span className="font-semibold">{currentQ.correctOption.capital}</span>
            </div>

            {clueStage >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900"
              >
                <span className="font-bold text-indigo-600 dark:text-indigo-400">2. İpucu (Bilgi):</span> {currentQ.correctOption.funFact}
              </motion.div>
            )}
          </div>

          {/* Flag Preview with Progressive Blur */}
          <div className="w-full aspect-[3/2] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
            <img 
              src={getFlagUrl(currentQ.correctOption.code)} 
              alt="Detective Flag" 
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                clueStage === 1 ? "blur-xl scale-110" : clueStage === 2 ? "blur-md scale-105" : "blur-0 scale-100"
              )}
            />
            {clueStage < 3 && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  {clueStage === 1 ? '🔍 1. İpucu' : '🔍 2. İpucu'}
                </span>
              </div>
            )}
          </div>

          {clueStage < 3 && !hasAnswered && (
            <button
              onClick={advanceDetectiveClue}
              className="mt-3 w-full py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Sonraki İpucunu Aç (-10 Puan)
            </button>
          )}
        </motion.div>
      ) : (
        /* Standard Flag Display for Classic, Time Attack, World Tour, Mistakes, Daily */
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full aspect-[3/2] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 mb-4 relative flex items-center justify-center"
        >
          <img 
            src={getFlagUrl(currentQ.correctOption.code)} 
            alt="Country Flag" 
            className="w-full h-full object-cover"
            loading="eager"
          />
        </motion.div>
      )}

      {/* OPTIONS CONTAINER */}
      {mode === 'reverse' ? (
        /* 4 Flag Cards in 2x2 Grid for Reverse Mode */
        <div className="grid grid-cols-2 gap-3 flex-1 content-start">
          <AnimatePresence mode="popLayout">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === option.code;
              const isActuallyCorrect = option.code === currentQ.correctOption.code;
              const isHiddenByFiftyFifty = hiddenOptionCodes.includes(option.code);

              if (isHiddenByFiftyFifty) {
                return (
                  <div key={option.code} className="aspect-[3/2] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 opacity-20" />
                );
              }

              let borderClass = "border-slate-200 dark:border-slate-800";
              if (hasAnswered) {
                if (isActuallyCorrect) {
                  borderClass = "border-emerald-500 ring-4 ring-emerald-500/20";
                } else if (isSelected) {
                  borderClass = "border-red-500 ring-4 ring-red-500/20";
                } else {
                  borderClass = "opacity-40 border-slate-200 dark:border-slate-800";
                }
              }

              return (
                <motion.button
                  key={option.code}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => answerQuestion(option.code)}
                  disabled={hasAnswered}
                  className={cn(
                    "aspect-[3/2] rounded-2xl border-2 overflow-hidden relative shadow-sm transition-all active:scale-95",
                    borderClass
                  )}
                >
                  <img
                    src={getFlagUrl(option.code)}
                    alt={option.name}
                    className="w-full h-full object-cover"
                  />
                  {hasAnswered && isActuallyCorrect && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  {hasAnswered && isSelected && !isActuallyCorrect && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow">
                      <X className="w-4 h-4" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Text Options List for Classic, Detective, Time Attack, Tour, Mistakes */
        <div className="grid gap-2.5 flex-1 content-start">
          <AnimatePresence mode="popLayout">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === option.code;
              const isActuallyCorrect = option.code === currentQ.correctOption.code;
              const isHiddenByFiftyFifty = hiddenOptionCodes.includes(option.code);

              if (isHiddenByFiftyFifty) {
                return (
                  <div key={option.code} className="p-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 opacity-20" />
                );
              }
              
              let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300";
              
              if (hasAnswered) {
                if (isActuallyCorrect) {
                  btnClass = "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold";
                } else if (isSelected) {
                  btnClass = "bg-red-50 border-red-500 text-red-700 dark:bg-red-500/10 dark:text-red-400 font-bold";
                } else {
                  btnClass = "opacity-50 border-slate-200 dark:border-slate-800";
                }
              } else {
                btnClass += " hover:border-indigo-300 dark:hover:border-indigo-700 active:scale-[0.98]";
              }

              return (
                <motion.button
                  key={option.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => answerQuestion(option.code)}
                  disabled={hasAnswered}
                  className={cn(
                    "p-3.5 rounded-2xl border-2 font-medium text-left flex items-center justify-between transition-all",
                    btnClass
                  )}
                >
                  <span>{option.name}</span>
                  {hasAnswered && isActuallyCorrect && <Check className="w-5 h-5 text-emerald-500" />}
                  {hasAnswered && isSelected && !isActuallyCorrect && <X className="w-5 h-5 text-red-500" />}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Next Button & Question-level Encyclopedia Highlight */}
      <AnimatePresence>
        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="pt-4 mt-auto"
          >
            {/* 'Did You Know?' snippet from Encyclopedia Service */}
            {currentSnippet && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/70 p-4 rounded-2xl mb-3 text-left shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    Did You Know?
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                    {currentSnippet.region}
                  </span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm mb-1 flex items-center justify-between">
                  <span>{currentSnippet.name}</span>
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    Başkent: {currentSnippet.capital}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {currentSnippet.didYouKnow}
                </p>
              </motion.div>
            )}
            
            <button
              onClick={nextQuestion}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-indigo-500/20"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Sonraki Soru' : 'Sonuçları & Ansiklopediyi Gör'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
