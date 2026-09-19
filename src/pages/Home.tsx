import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Calendar, Users, Trophy, ChevronRight, Globe, 
  Zap, Compass, Search, Sparkles, Target, Award,
  Flame, X, BookOpen, Clock
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useGameStore } from '../store/useGameStore';
import { usePassportStore } from '../store/usePassportStore';
import { useMistakeStore } from '../store/useMistakeStore';
import { useQuestStore } from '../store/useQuestStore';
import { getUserTitle } from '../lib/badges';
import { DailyQuestsModal } from '../components/DailyQuestsModal';

export function Home() {
  const user = useAuthStore(state => state.user);
  const { 
    startClassic, startTimeAttack, startReverse, 
    startDetective, startWorldTour, startDailyChallenge 
  } = useGameStore();
  
  const getTotalUnlocked = usePassportStore(state => state.getTotalUnlocked);
  const getMistakesCount = useMistakeStore(state => state.getMistakesCount);
  const quests = useQuestStore(state => state.quests);

  const navigate = useNavigate();

  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isWorldTourModalOpen, setIsWorldTourModalOpen] = useState(false);

  const passportCount = getTotalUnlocked();
  const mistakeCount = getMistakesCount();
  const completedQuestsCount = quests.filter(q => q.completed).length;
  const userTitle = getUserTitle(user?.level || 1);

  const handleStartClassic = () => {
    startClassic();
    navigate('/game');
  };

  const handleStartTimeAttack = () => {
    startTimeAttack();
    navigate('/game');
  };

  const handleStartReverse = () => {
    startReverse();
    navigate('/game');
  };

  const handleStartDetective = () => {
    startDetective();
    navigate('/game');
  };

  const handleStartDaily = () => {
    startDailyChallenge();
    navigate('/game');
  };

  const handleSelectContinent = (continent: string) => {
    setIsWorldTourModalOpen(false);
    startWorldTour(continent);
    navigate('/game');
  };

  const continents = [
    { name: 'Avrupa', icon: '🏰', color: 'from-blue-500 to-indigo-600' },
    { name: 'Asya', icon: '🏯', color: 'from-rose-500 to-amber-600' },
    { name: 'Afrika', icon: '🦁', color: 'from-amber-500 to-emerald-600' },
    { name: 'Amerika', icon: '🗽', color: 'from-purple-500 to-indigo-600' },
    { name: 'Okyanusya', icon: '🏝️', color: 'from-teal-400 to-cyan-600' },
  ];

  return (
    <div className="p-4 md:p-6 pb-32 max-w-xl mx-auto">
      {/* User Greeting & Title */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Merhaba, {user?.displayName?.split(' ')[0] || 'Gezgin'} 👋
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${userTitle.bg} ${userTitle.color} ${userTitle.border}`}>
              {userTitle.title}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Bugün hangi kıtayı keşfedeceksin?
            </span>
          </div>
        </div>

        <div 
          onClick={() => navigate('/profile')}
          className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-indigo-500 p-0.5 cursor-pointer shadow-sm active:scale-95 transition-transform"
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center text-indigo-500 font-black">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
          )}
        </div>
      </motion.div>

      {/* Hero Stats Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-5 text-white mb-5 shadow-xl shadow-indigo-500/20 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-300" />
            <span className="font-extrabold text-white text-base">Seviye {user?.level || 1}</span>
          </div>
          <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
            {user?.xp || 0} XP
          </span>
        </div>
        
        <div className="w-full bg-black/25 rounded-full h-2 mb-1.5 overflow-hidden">
          <div 
            className="bg-amber-300 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${((user?.xp || 0) % 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-indigo-100">
          <span>{((user?.xp || 0) % 100)} / 100 XP</span>
          <span>Sonraki seviyeye {100 - ((user?.xp || 0) % 100)} XP</span>
        </div>
      </motion.div>

      {/* Gamification Fast Track Cards (Passport, Mistake Vault, Daily Quests) */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {/* Passport Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/passport')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center cursor-pointer shadow-sm hover:border-indigo-300 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center text-lg mb-1.5">
            🛂
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">Pasaport</span>
          <span className="text-xs font-black text-slate-800 dark:text-slate-100">
            {passportCount}/195
          </span>
        </motion.div>

        {/* Mistake Vault Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/mistakes')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center cursor-pointer shadow-sm hover:border-rose-300 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center text-lg mb-1.5">
            🎯
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">Hata Kumbarası</span>
          <span className="text-xs font-black text-slate-800 dark:text-slate-100">
            {mistakeCount} Hata
          </span>
        </motion.div>

        {/* Daily Quests Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsQuestsOpen(true)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center cursor-pointer shadow-sm hover:border-emerald-300 transition-all relative"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center text-lg mb-1.5">
            🎁
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">Görevler</span>
          <span className="text-xs font-black text-slate-800 dark:text-slate-100">
            {completedQuestsCount}/3
          </span>
          {completedQuestsCount > 0 && quests.some(q => q.completed && !q.claimed) && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </motion.div>
      </div>

      {/* GAME MODES LIST */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base font-black text-slate-900 dark:text-white">Oyun Modları</h3>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Yeni & Çeşitli</span>
      </div>
      
      <div className="grid gap-3">
        {/* 1. Klasik Mod */}
        <ModeCard 
          icon={<Play className="w-5 h-5 text-indigo-500" />}
          title="Klasik Mod"
          description="Rastgele 10 bayrak. Seri çarpanı ile yüksek skor yap!"
          onClick={handleStartClassic}
          badge="Popüler"
          badgeColor="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
          color="bg-indigo-50 dark:bg-indigo-500/10"
        />

        {/* 2. Zamana Karşı (Blitz) */}
        <ModeCard 
          icon={<Clock className="w-5 h-5 text-blue-500" />}
          title="Zamana Karşı (Blitz)"
          description="60 saniyede ne kadar bayrak bilebilirsin? Doğru cevap +3s!"
          onClick={handleStartTimeAttack}
          badge="Hızlı"
          badgeColor="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
          color="bg-blue-50 dark:bg-blue-500/10"
        />

        {/* 3. Ters Bayrak Modu */}
        <ModeCard 
          icon={<Zap className="w-5 h-5 text-emerald-500" />}
          title="Ters Bayrak (Bayrağı Seç)"
          description="Ülke ve başkent verilir, 4 bayraktan doğru olanı seçersin."
          onClick={handleStartReverse}
          badge="Görsel"
          badgeColor="bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
          color="bg-emerald-50 dark:bg-emerald-500/10"
        />

        {/* 4. Gizemli Dedektif */}
        <ModeCard 
          icon={<Search className="w-5 h-5 text-purple-500" />}
          title="Gizemli Dedektif Modu"
          description="Kademeli ipuçları ve flu bayrakla gizli ülkeyi çöz!"
          onClick={handleStartDetective}
          badge="Zeka"
          badgeColor="bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400"
          color="bg-purple-50 dark:bg-purple-500/10"
        />

        {/* 5. Dünya Turu (Kıta Seferleri) */}
        <ModeCard 
          icon={<Compass className="w-5 h-5 text-amber-500" />}
          title="Dünya Turu (Kıta Seferleri)"
          description="Avrupa, Asya, Afrika ve diğer kıtalarda özel keşif turları."
          onClick={() => setIsWorldTourModalOpen(true)}
          badge="Sefer"
          badgeColor="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
          color="bg-amber-50 dark:bg-amber-500/10"
        />

        {/* 6. Günlük Meydan Okuma */}
        <ModeCard 
          icon={<Calendar className="w-5 h-5 text-orange-500" />}
          title="Günün Meydan Okuması"
          description="Her gün tüm oyuncular için aynı 5 özel bayrak sorusu."
          onClick={handleStartDaily}
          badge="Günlük"
          badgeColor="bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400"
          color="bg-orange-50 dark:bg-orange-500/10"
        />

        {/* 7. Çok Oyunculu Arena */}
        <ModeCard 
          icon={<Users className="w-5 h-5 text-rose-500" />}
          title="Çok Oyunculu Canlı Düello"
          description="Arkadaşlarınla oda kur veya rastgele rakiplerle yarış."
          onClick={() => navigate('/multiplayer')}
          badge="Canlı"
          badgeColor="bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400"
          color="bg-rose-50 dark:bg-rose-500/10"
        />

        {/* 8. Bayraklar Ansiklopedisi */}
        <ModeCard 
          icon={<Globe className="w-5 h-5 text-sky-500" />}
          title="Bayrak Ansiklopedisi (195 BM Ülkesi)"
          description="Tüm ülkelerin bayrak anlamları ve enteresan Did You Know bilgileri."
          onClick={() => navigate('/countries')}
          color="bg-sky-50 dark:bg-sky-500/10"
        />
      </div>

      {/* Daily Quests Modal */}
      <DailyQuestsModal 
        isOpen={isQuestsOpen} 
        onClose={() => setIsQuestsOpen(false)} 
      />

      {/* World Tour Continent Selection Modal */}
      <AnimatePresence>
        {isWorldTourModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-lg">
                    🌍
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Dünya Turu Seferi
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Keşfetmek istediğin kıtayı seç
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWorldTourModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 mb-4">
                {continents.map(continent => (
                  <button
                    key={continent.name}
                    onClick={() => handleSelectContinent(continent.name)}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 flex items-center justify-between transition-all group active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{continent.icon}</span>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">
                        {continent.name} Seferi
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsWorldTourModalOpen(false)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
              >
                Vazgeç
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModeCard({ 
  icon, title, description, onClick, color, badge, badgeColor, disabled 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
  badge?: string;
  badgeColor?: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left transition-all shadow-sm hover:shadow-md ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <div className={`p-2.5 rounded-xl ${color} mr-3.5 shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
            {title}
          </h4>
          {badge && (
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${badgeColor || 'bg-slate-100 text-slate-600'}`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
    </motion.button>
  );
}
