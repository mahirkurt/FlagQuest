import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Search, X, Sparkles, BookOpen, 
  MapPin, Users, Coins, ArrowLeft, CheckCircle
} from 'lucide-react';
import { countries, getFlagUrl, Country } from '../data/countries';
import { usePassportStore } from '../store/usePassportStore';
import { useAuthStore } from '../store/useAuthStore';
import { getUserTitle } from '../lib/badges';

export function Passport() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { stamps, getTotalUnlocked, getContinentStats } = usePassportStore();
  
  const [selectedRegion, setSelectedRegion] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const totalUnlocked = getTotalUnlocked();
  const totalCountries = countries.length;
  const completionPercentage = ((totalUnlocked / totalCountries) * 100).toFixed(1);
  const continentStats = getContinentStats();
  const userTitle = getUserTitle(user?.level || 1);

  const regions = ['Tümü', 'Avrupa', 'Asya', 'Afrika', 'Amerika', 'Okyanusya'];

  const filteredCountries = countries.filter(c => {
    const matchesRegion = selectedRegion === 'Tümü' || c.region === selectedRegion;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.capital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 pb-32 max-w-2xl mx-auto">
      {/* Back button & Title */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfa
        </button>
        <span className="text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          Dijital Dünya Pasaportu
        </span>
      </div>

      {/* Official Passport Booklet Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-2xl border-2 border-amber-500/40 relative overflow-hidden mb-6"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
              🛂
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wider uppercase text-amber-300">
                  Resmi Kaşif Pasaportu
                </h2>
              </div>
              <p className="text-xs text-slate-300">
                {user?.displayName || 'Dünya Seyyahı'} • <span className="text-amber-400 font-semibold">{userTitle.title}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-amber-400">{totalUnlocked}</span>
            <span className="text-xs text-slate-400 font-medium">/{totalCountries}</span>
            <p className="text-[10px] text-slate-400">Damga</p>
          </div>
        </div>

        {/* Exploration Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Dünya Keşif Tamamlanması</span>
            <span className="font-bold text-amber-400">%{completionPercentage}</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-2">
          Herhangi bir modda doğru bildiğin her bayrak pasaportuna kalıcı damga olarak mühürlenir.
        </p>
      </motion.div>

      {/* Continents Progress Pills */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {Object.entries(continentStats).map(([region, stat]) => (
          <div
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`p-2 rounded-xl text-center cursor-pointer transition-all border ${
              selectedRegion === region
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            <p className="text-[10px] font-medium truncate">{region}</p>
            <p className="text-xs font-black mt-0.5">
              {stat.unlocked}/{stat.total}
            </p>
          </div>
        ))}
      </div>

      {/* Controls: Region tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedRegion === region
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="relative shrink-0 sm:w-48">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ülke ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Stamp Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredCountries.map((country) => {
          const stamp = stamps[country.code];
          const isUnlocked = !!stamp;

          return (
            <motion.div
              key={country.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCountry(country)}
              className={`p-3.5 rounded-2xl border cursor-pointer relative overflow-hidden transition-all flex flex-col items-center text-center ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 shadow-sm hover:shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              {/* Stamp Seal Badge */}
              <div className="relative mb-2">
                <div
                  className={`w-14 h-10 rounded-lg overflow-hidden border shadow-sm flex items-center justify-center ${
                    isUnlocked
                      ? 'border-slate-300 dark:border-slate-700 bg-slate-100'
                      : 'border-dashed border-slate-300 dark:border-slate-700 grayscale contrast-50'
                  }`}
                >
                  <img
                    src={getFlagUrl(country.code)}
                    alt={country.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {isUnlocked && (
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm font-bold"
                    title={`${stamp.timesCorrect} kez doğru bilindi`}
                  >
                    ✓
                  </div>
                )}
              </div>

              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate w-full">
                {country.name}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full">
                {isUnlocked ? country.capital : 'Henüz Açılmadı'}
              </p>

              {isUnlocked && (
                <span className="text-[9px] font-semibold text-indigo-500 dark:text-indigo-400 mt-1 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/40">
                  {stamp.timesCorrect}x Mühür
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Stamp Detail Modal (Souvenir Visa Card) */}
      <AnimatePresence>
        {selectedCountry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedCountry(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Visa Stamp Banner */}
              <div className="text-center mb-4">
                <div className="w-24 h-16 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 mx-auto mb-3 shadow-md">
                  <img
                    src={getFlagUrl(selectedCountry.code)}
                    alt={selectedCountry.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedCountry.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedCountry.region} • Başkent: {selectedCountry.capital}
                </p>

                {stamps[selectedCountry.code] ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full mt-2">
                    <CheckCircle className="w-3.5 h-3.5" /> Pasaporta Mühürlendi ({stamps[selectedCountry.code].timesCorrect} kez doğru)
                  </span>
                ) : (
                  <span className="inline-block text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full mt-2">
                    🔒 Henüz Açılmadı — Oyunda Doğru Bilerek Aç!
                  </span>
                )}
              </div>

              {/* Country Metadata Details */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium">Bölge</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {selectedCountry.region}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium">Başkent</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {selectedCountry.capital}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium">Mühür Sayısı</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {stamps[selectedCountry.code]?.timesCorrect || 0}x
                  </p>
                </div>
              </div>

              {/* Encyclopedia Did You Know */}
              <div className="bg-indigo-50/80 dark:bg-indigo-950/40 p-3.5 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-slate-700 dark:text-slate-300 mb-5 leading-relaxed">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Ansiklopedi Hatıra Notu
                </span>
                {selectedCountry.funFact}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCountry(null);
                    navigate('/countries');
                  }}
                  className="flex-1 py-3 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-sky-200 dark:border-sky-800"
                >
                  <BookOpen className="w-4 h-4 text-sky-500" />
                  Ansiklopediye Git
                </button>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="px-5 py-3 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-xl text-xs"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
