import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, CheckCircle2, XCircle, Zap, Timer, Flame, 
  RotateCcw, Compass, ArrowRight, Sparkles, BookOpen, 
  Award, TrendingUp, Target, BarChart3
} from 'lucide-react';
import { Question } from '../store/useGameStore';
import { encyclopediaService } from '../services/encyclopediaService';

interface GameSummaryProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  maxStreak: number;
  responseTimes: number[];
  mode: string;
  selectedContinent?: string;
  questions: Question[];
  userAnswers: Record<number, string>;
  isFinishing: boolean;
  onFinish: (path?: string) => void;
  onPlayAgain: () => void;
}

export const GameSummary: React.FC<GameSummaryProps> = ({
  score,
  correctAnswers,
  totalQuestions,
  maxStreak,
  responseTimes,
  mode,
  selectedContinent,
  questions,
  userAnswers,
  isFinishing,
  onFinish,
  onPlayAgain
}) => {
  const wrongAnswers = Math.max(0, totalQuestions - correctAnswers);
  const accuracyPercent = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Reaction time calculations
  const avgResponseTimeSec = responseTimes.length > 0
    ? (responseTimes.reduce((acc, curr) => acc + curr, 0) / responseTimes.length / 1000).toFixed(2)
    : '1.80';

  const fastestResponseSec = responseTimes.length > 0
    ? (Math.min(...responseTimes) / 1000).toFixed(2)
    : '1.20';

  // Performance Evaluation Level
  const getPerformanceBadge = () => {
    if (accuracyPercent >= 90) return { label: 'Coğrafya Dehası', color: 'from-amber-400 to-yellow-500', icon: '👑', message: 'Kusursuz bir bayrak bilgisi! Neredeyse hiç yanılmadın.' };
    if (accuracyPercent >= 70) return { label: 'Uzman Kaşif', color: 'from-indigo-500 to-purple-600', icon: '🧭', message: 'Çok başarılı bir tur! Detayları harika yakalıyorsun.' };
    if (accuracyPercent >= 50) return { label: 'Gezgin Adayı', color: 'from-emerald-400 to-teal-500', icon: '🗺️', message: 'Güzel bir başlangıç, pratik yaptıkça hafızan güçleniyor.' };
    return { label: 'Öğrenme Yolcusu', color: 'from-blue-400 to-cyan-500', icon: '🌱', message: 'Hatalar en iyi öğretmendir. Ansiklopedi kartlarına göz at!' };
  };

  const performance = getPerformanceBadge();

  const getFlagUrl = (code: string) => `https://flagcdn.com/w160/${code.toLowerCase()}.png`;

  return (
    <div id="game-summary-view" className="flex flex-col min-h-screen p-4 md:p-6 pb-32 max-w-lg mx-auto">
      {/* Main Hero Summary Card */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 text-center mb-6 relative overflow-hidden"
      >
        {/* Subtle decorative background gradient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Level Emblem */}
        <div className={`w-20 h-20 bg-gradient-to-br ${performance.color} rounded-3xl mx-auto flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20 text-3xl border border-white/20 transform rotate-3`}>
          <span>{performance.icon}</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold mb-2">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>{performance.label}</span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {mode === 'time_attack' ? 'Zaman Doldu!' : 'Tur Tamamlandı!'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 mb-5 max-w-xs mx-auto">
          {mode === 'world_tour' && selectedContinent
            ? `${selectedContinent} Kıta Seferini başarıyla bitirdin!`
            : performance.message}
        </p>

        {/* Primary Metrics Grid (4-up bento) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-left">
          {/* Earned Points */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 p-3 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-indigo-500" /> Toplam Skor
            </span>
            <div className="text-xl font-black text-indigo-700 dark:text-indigo-300 mt-1">
              +{score} <span className="text-[10px] font-medium text-indigo-500">XP</span>
            </div>
          </div>

          {/* Correct Count */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 p-3 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Doğru
            </span>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
              {correctAnswers} <span className="text-[11px] font-normal text-emerald-600/70">/ {totalQuestions}</span>
            </div>
          </div>

          {/* Wrong Count */}
          <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 p-3 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> Yanlış
            </span>
            <div className="text-xl font-black text-rose-700 dark:text-rose-300 mt-1">
              {wrongAnswers} <span className="text-[10px] font-normal text-rose-500/70">hata</span>
            </div>
          </div>

          {/* Max Streak */}
          <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 p-3 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Flame className="w-3 h-3 fill-amber-500" /> Max Seri
            </span>
            <div className="text-xl font-black text-amber-700 dark:text-amber-300 mt-1">
              {maxStreak} <span className="text-[10px] font-normal text-amber-600/70">combo</span>
            </div>
          </div>
        </div>

        {/* Reaction Time & Accuracy Insight Strip */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 mb-5 flex items-center justify-between text-xs">
          {/* Reaction Timing */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
              <Timer className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Ort. Tepki Süresi
              </p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">
                {avgResponseTimeSec} sn <span className="text-[10px] text-slate-400 font-normal">(En hızlı: {fastestResponseSec}s)</span>
              </p>
            </div>
          </div>

          {/* Accuracy Progress Meter */}
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end font-extrabold text-slate-800 dark:text-slate-200">
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              <span>%{accuracyPercent} İsabet</span>
            </div>
            <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1 ml-auto">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${accuracyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="summary-main-menu-btn"
            onClick={() => onFinish('/')}
            disabled={isFinishing}
            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 text-xs cursor-pointer"
          >
            <span>Ana Menü</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            id="summary-play-again-btn"
            onClick={onPlayAgain}
            disabled={isFinishing}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-colors flex items-center gap-1.5 text-xs cursor-pointer active:scale-95"
            title="Yeniden Oyna"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
            <span>Tekrar</span>
          </button>

          <button
            id="summary-passport-btn"
            onClick={() => onFinish('/passport')}
            disabled={isFinishing}
            className="px-4 py-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-xl font-bold transition-colors flex items-center gap-1.5 border border-amber-200/60 dark:border-amber-800/60 text-xs cursor-pointer active:scale-95"
            title="Pasaport Damgaları"
          >
            <span>🛂 Pasaport</span>
          </button>
        </div>
      </motion.div>

      {/* Encyclopedia & Question Review List */}
      <div id="game-summary-review" className="w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Tur Analizi & Ülke Ansiklopedisi
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {questions.length} Soru
          </span>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const country = q.correctOption;
            const isCorrect = userAnswers[idx] === country.code;
            const userChosen = q.options.find(o => o.code === userAnswers[idx]);
            const responseTime = responseTimes[idx] ? (responseTimes[idx] / 1000).toFixed(1) : null;

            return (
              <motion.div
                key={q.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.035 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 shadow-xs flex items-center justify-center">
                      <img
                        src={getFlagUrl(country.code)}
                        alt={`${country.name} Bayrağı`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {country.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Başkent: <span className="font-medium text-slate-700 dark:text-slate-300">{country.capital}</span> • {country.region}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Doğru
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Yanlış
                      </span>
                    )}

                    {responseTime && (
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                        <Timer className="w-2.5 h-2.5" /> {responseTime}s
                      </span>
                    )}
                  </div>
                </div>

                {/* If incorrect, show what was selected */}
                {!isCorrect && userChosen && (
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 px-2.5 py-1 rounded-lg border border-rose-100 dark:border-rose-900/30 mb-2">
                    Senin seçimin: <span className="font-semibold">{userChosen.name}</span>
                  </div>
                )}

                {/* Did You Know snippet from encyclopedia service */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800/70 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mb-1 text-[11px] uppercase tracking-wide">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Ansiklopedi Bilgisi
                  </span>
                  {encyclopediaService.getDidYouKnow(country.code)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
