import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Trophy, User, Play, Flag, Volume2, VolumeX, Compass } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function Layout() {
  const { soundEnabled, toggleSound } = useSettingsStore();

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      <header className="px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500 rounded-xl text-white">
            <Flag className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            FlagQuest
          </h1>
        </div>
        <button 
          onClick={toggleSound}
          className="p-2 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 relative z-0">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 p-3 pb-safe z-20 pointer-events-none">
        <div className="mx-auto max-w-md bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl flex items-center justify-around px-2 py-1.5 pointer-events-auto">
          <NavItem to="/" icon={<Home className="w-5 h-5" />} label="Ana Sayfa" />
          <NavItem to="/passport" icon={<Compass className="w-5 h-5" />} label="Pasaport" />
          <div className="-mt-7">
            <NavLink
              to="/game"
              className={({ isActive }) => cn(
                "flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transform transition-transform active:scale-95",
                isActive ? "scale-110 ring-4 ring-indigo-500/20" : "hover:scale-105"
              )}
            >
              <Play className="w-5 h-5 ml-0.5" />
            </NavLink>
          </div>
          <NavItem to="/leaderboard" icon={<Trophy className="w-5 h-5" />} label="Liderlik" />
          <NavItem to="/profile" icon={<User className="w-5 h-5" />} label="Profil" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex flex-col items-center justify-center w-14 p-1.5 rounded-xl transition-all duration-200 relative",
        isActive 
          ? "text-indigo-600 dark:text-indigo-400 font-medium" 
          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      )}
    >
      {({ isActive }) => (
        <>
          {icon}
          <span className="text-[10px] mt-0.5">{label}</span>
          {isActive && (
            <motion.div 
              layoutId="nav-pill"
              className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
