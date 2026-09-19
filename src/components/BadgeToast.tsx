import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBadgeStore } from '../store/useBadgeStore';
import { BADGES } from '../lib/badges';
import { Award } from 'lucide-react';

export function BadgeToast() {
  const { queue, dismissBadge } = useBadgeStore();
  
  const currentBadgeId = queue[0];
  const badge = currentBadgeId ? BADGES[currentBadgeId] : null;

  useEffect(() => {
    if (badge) {
      const timer = setTimeout(() => {
        dismissBadge();
      }, 4000); // show for 4 seconds
      return () => clearTimeout(timer);
    }
  }, [badge, dismissBadge]);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {badge && (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className={`bg-gradient-to-r ${badge.color} p-1 rounded-2xl shadow-2xl overflow-hidden min-w-[300px]`}
          >
            <div className="bg-white/10 backdrop-blur-md px-5 py-4 flex items-center gap-4 rounded-xl relative overflow-hidden">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              
              <div className="w-12 h-12 flex items-center justify-center text-3xl bg-white/20 rounded-full shadow-inner shrink-0 relative z-10">
                {badge.icon}
              </div>
              
              <div className="relative z-10 text-white">
                <div className="flex items-center gap-1.5 text-white/80 text-[10px] font-black uppercase tracking-widest mb-1">
                  <Award className="w-3 h-3" />
                  Yeni Rozet Açıldı!
                </div>
                <h4 className="font-black text-lg leading-tight mb-1">{badge.name}</h4>
                <p className="text-white/90 text-xs font-medium">{badge.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
