import React from 'react';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Moon, Bell, Shield, HelpCircle, User as UserIcon, Lock, Compass, Target } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { usePassportStore } from '../store/usePassportStore';
import { useMistakeStore } from '../store/useMistakeStore';
import { cn } from '../lib/utils';
import { BADGES, getUserTitle } from '../lib/badges';

export function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const updateSettings = useAuthStore(state => state.updateSettings);
  const passportCount = usePassportStore(state => state.getTotalUnlocked());
  const mistakeCount = useMistakeStore(state => state.getMistakesCount());
  
  if (!user) return null;

  const userTitle = getUserTitle(user.level || 1);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !user.settings.darkMode });
  };

  const toggleNotifications = () => {
    updateSettings({ notifications: !user.settings.notifications });
  };

  const stats = [
    { label: 'Oyun', value: user.stats.gamesPlayed },
    { label: 'Doğru', value: user.stats.correctAnswers },
    { label: 'Başarı', value: user.stats.gamesPlayed > 0 ? `${Math.round((user.stats.correctAnswers / (user.stats.gamesPlayed * 10)) * 100)}%` : '0%' }
  ];

  return (
    <div className="p-6 pb-32 max-w-md mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl mb-3 relative">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.displayName.charAt(0)}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user.displayName}</h2>
        <span className={`mt-1 text-xs font-extrabold px-3 py-1 rounded-full border ${userTitle.bg} ${userTitle.color} ${userTitle.border}`}>
          {userTitle.title} (Seviye {user.level || 1})
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
      </div>

      {/* Explorer Shortcuts (Passport & Mistake Vault) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div 
          onClick={() => navigate('/passport')}
          className="p-3 bg-amber-500/10 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-amber-500/15 transition-all"
        >
          <div className="text-2xl">🛂</div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Pasaport Damgaları</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{passportCount} / 195</span>
          </div>
        </div>

        <div 
          onClick={() => navigate('/mistakes')}
          className="p-3 bg-rose-500/10 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-rose-500/15 transition-all"
        >
          <div className="text-2xl">🎯</div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Hata Kumbarası</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{mistakeCount} Hata</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center"
          >
            <p className="text-xl font-black text-indigo-500 mb-0.5">{stat.value}</p>
            <p className="text-[11px] text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Badges Section */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex justify-between">
          <span>Başarı Rozetleri</span>
          <span className="text-indigo-500">{user.badges?.length || 0}/{Object.keys(BADGES).length}</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(BADGES).map((badge, i) => {
            const isEarned = (user.badges || []).includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-4 rounded-2xl border flex flex-col items-center text-center relative overflow-hidden",
                  isEarned ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" : "bg-slate-50 dark:bg-slate-900/50 border-dashed border-slate-200 dark:border-slate-800 opacity-70 grayscale"
                )}
              >
                {!isEarned && <Lock className="absolute top-2 right-2 w-3 h-3 text-slate-400" />}
                
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2",
                  isEarned ? `bg-gradient-to-br ${badge.color} text-white shadow-lg` : "bg-slate-200 dark:bg-slate-800 text-transparent"
                )}>
                  {isEarned ? badge.icon : '❓'}
                </div>
                <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">{badge.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Tercihler</h3>
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <SettingItem 
              icon={<Moon className="w-5 h-5 text-indigo-500" />}
              label="Karanlık Mod"
              action={
                <Toggle active={user.settings.darkMode} onClick={toggleDarkMode} />
              }
            />
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
            <SettingItem 
              icon={<Bell className="w-5 h-5 text-orange-500" />}
              label="Bildirimler"
              action={
                <Toggle active={user.settings.notifications} onClick={toggleNotifications} />
              }
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Hesap</h3>
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <SettingItem icon={<UserIcon className="w-5 h-5 text-slate-500" />} label="Profili Düzenle" />
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
            <SettingItem icon={<Shield className="w-5 h-5 text-slate-500" />} label="Gizlilik ve Güvenlik" />
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
            <SettingItem icon={<HelpCircle className="w-5 h-5 text-slate-500" />} label="Yardım ve Destek" />
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-2xl font-bold transition-colors active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

function SettingItem({ icon, label, action }: { icon: React.ReactNode, label: string, action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {action || <div className="text-slate-300 dark:text-slate-600">→</div>}
    </div>
  );
}

function Toggle({ active, onClick }: { active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-12 h-7 rounded-full transition-colors relative",
        active ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"
      )}
    >
      <motion.div 
        className="w-5 h-5 bg-white rounded-full absolute top-1"
        animate={{ left: active ? '24px' : '4px' }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
