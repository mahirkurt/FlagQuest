import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Gift, Sparkles, Trophy } from 'lucide-react';
import { useQuestStore, DailyQuest } from '../store/useQuestStore';
import { playCorrectSound } from '../lib/audio';

interface DailyQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyQuestsModal({ isOpen, onClose }: DailyQuestsModalProps) {
  const { quests, claimReward, checkAndResetQuests } = useQuestStore();

  React.useEffect(() => {
    if (isOpen) {
      checkAndResetQuests();
    }
  }, [isOpen, checkAndResetQuests]);

  const handleClaim = async (questId: string) => {
    const xp = await claimReward(questId);
    if (xp > 0) {
      playCorrectSound();
    }
  };

  const completedCount = quests.filter(q => q.completed).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center text-xl">
                  🎯
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    Günlük Görevler
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Her gün gece yarısı yenilenir
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overall Progress Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white mb-5 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  Bugünün Tamamlanma Durumu
                </span>
                <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                  {completedCount} / {quests.length}
                </span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div
                  className="bg-amber-300 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / quests.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Quests List */}
            <div className="space-y-3 mb-5">
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    quest.completed
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{quest.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {quest.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {quest.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full shrink-0 border border-indigo-100 dark:border-indigo-900/40">
                      +{quest.xpReward} XP
                    </span>
                  </div>

                  {/* Progress & Action */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 flex-1 mr-3">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                        {quest.current}/{quest.target}
                      </span>
                    </div>

                    {quest.claimed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Alındı
                      </span>
                    ) : quest.completed ? (
                      <button
                        onClick={() => handleClaim(quest.id)}
                        className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        Ödülü Al
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">
                        Devam Ediyor
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm transition-colors"
            >
              Kapat
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
