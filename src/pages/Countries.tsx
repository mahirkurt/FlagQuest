import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, ChevronLeft, MapPin, Sparkles, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { countries, Country, getFlagUrl } from '../data/countries';

const REGIONS = ['Tümü', 'Avrupa', 'Asya', 'Afrika', 'Kuzey Amerika', 'Güney Amerika', 'Okyanusya'];

export function Countries() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tümü');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      const matchesSearch = 
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.capital.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = 
        selectedRegion === 'Tümü' ||
        (selectedRegion === 'Avrupa' && country.region.includes('Avrupa')) ||
        (selectedRegion === 'Asya' && country.region.includes('Asya')) ||
        (selectedRegion === 'Afrika' && country.region.includes('Afrika')) ||
        (selectedRegion === 'Kuzey Amerika' && country.region === 'Kuzey Amerika') ||
        (selectedRegion === 'Güney Amerika' && country.region === 'Güney Amerika') ||
        (selectedRegion === 'Okyanusya' && country.region === 'Okyanusya');

      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className="p-4 md:p-6 pb-32 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title="Ana Sayfaya Dön"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-500" />
            Ülkeler & Bayraklar Ansiklopedisi
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Birleşmiş Milletler üyesi tüm ülkeler ve ilgi çekici gerçekler ({filteredCountries.length} / {countries.length})
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ülke veya başkent ara (ör. Japonya, Ankara, Berlin)..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {REGIONS.map((region) => {
            const isActive = selectedRegion === region;
            return (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>

      {/* Countries Grid */}
      {filteredCountries.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Globe className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-lg">Sonuç Bulunamadı</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            "{searchQuery}" araması için eşleşen ülke bulunamadı.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCountries.map((country) => (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedCountry(country)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 shadow-sm flex items-center justify-center">
                    <img
                      src={getFlagUrl(country.code)}
                      alt={`${country.name} Bayrağı`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {country.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="truncate">{country.capital}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="truncate">{country.region}</span>
                    </div>
                  </div>
                </div>

                {/* Fun Fact Pill */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1 block">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    İlginç Bilgi
                  </span>
                  {country.funFact}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Country Detail Modal */}
      <AnimatePresence>
        {selectedCountry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedCountry(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md mb-4 bg-slate-100">
                <img
                  src={getFlagUrl(selectedCountry.code)}
                  alt={`${selectedCountry.name} Bayrağı`}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                {selectedCountry.name}
              </h2>

              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl">
                  <span className="text-slate-400 block font-medium">Başkent</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {selectedCountry.capital}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl">
                  <span className="text-slate-400 block font-medium">Kıta / Bölge</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {selectedCountry.region}
                  </span>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1.5 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Biliyor muydunuz?
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {selectedCountry.funFact}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
