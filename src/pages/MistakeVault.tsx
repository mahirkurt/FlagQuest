import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trash2, Play, Sparkles, CheckCircle2, 
  HelpCircle, AlertTriangle, BookOpen 
} from 'lucide-react';
import { useMistakeStore } from '../store/useMistakeStore';
import { useGameStore } from '../store/useGameStore';
import { getFlagUrl } from '../data/countries';

export function MistakeVault() {
  const navigate = useNavigate();
  const { mistakes, clearAllMistakes, removeMistake, getAllMistakes } = useMistakeStore();
  const startMistakePractice = useGameStore(state => state.startMistakePractice);

  const mistakeList = getAllMistakes();

  const handleStartPractice = () => {
    const started = startMistakePractice();
    if (started) {
      navigate('/game');
    }
  };

  return (
    <div className="p-4 md:p-6 pb-32 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfa
        </button>
        <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800">
          Akıllı Tekrar Sistemi
        </span>
      </div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 text-white shadow-2xl border-2 border-rose-500/30 relative overflow-hidden mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-2xl shadow-inner">
              🎯
            </div>
            <div>
              <h2 className="text-xl font-black text-rose-300">
                Hata Kumbarası
              </h2>
              <p className="text-xs text-slate-300">
                Oyunlarda yanıldığın ülkeleri burada tekrar ederek öğren
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-rose-400">{mistakeList.length}</span>
            <p className="text-[10px] text-slate-400">Kayıtlı Ülke</p>
          </div>
        </div>

        {mistakeList.length > 0 ? (
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleStartPractice}
              className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Kumbarayı Temizle (Pratik Yap)
            </button>
            <button
              onClick={clearAllMistakes}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              title="Tümünü Sıfırla"
            >
              <Trash2 className="w-4 h-4 text-slate-300" />
              <span>Sıfırla</span>
            </button>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-xs text-emerald-300 font-medium flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Tebrikler! Kumbaran boş, son oyunlarında hiç hata yapmadın.
            </p>
          </div>
        )}
      </motion.div>

      {/* List of Mistaken Countries */}
      {mistakeList.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Pratik Bekleyen Ülkeler ({mistakeList.length})
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Pratikte doğru bilindiğinde kumbaradan silinir
            </span>
          </div>

          {mistakeList.map((item, idx) => (
            <motion.div
              key={item.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 shadow-sm flex items-center justify-center">
                    <img
                      src={getFlagUrl(item.code)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Başkent: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.capital}</span> • {item.region}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
                    {item.wrongCount}x Hata
                  </span>
                  <button
                    onClick={() => removeMistake(item.code)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Kumbaradan Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Clue fact box */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mb-1 text-[11px] uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Öğretici Hatırlatıcı Not
                </span>
                {item.funFact}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center text-3xl mx-auto mb-4">
            🌟
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
            Harika Gidiyorsun!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Oyun oynarken yanlış yaptığın bayraklar otomatik olarak buraya eklenir ve özel pratikle pekiştirilir.
          </p>
          <button
            onClick={() => navigate('/game')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-colors"
          >
            Hemen Bir Oyun Oyna
          </button>
        </div>
      )}
    </div>
  );
}
