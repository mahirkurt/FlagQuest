import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Trophy, Medal, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  xp: number;
  level: number;
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore(state => state.user);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'leaderboard'), orderBy('xp', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        const data: LeaderboardEntry[] = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data() as LeaderboardEntry);
        });
        setEntries(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full pt-32">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-6 pb-32 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-2xl">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Liderlik Tablosu</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">En iyilerle yarış</p>
        </div>
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => {
          const isCurrentUser = entry.userId === currentUser?.uid;
          
          let rankIcon = null;
          if (index === 0) rankIcon = <Medal className="w-6 h-6 text-yellow-500" />;
          else if (index === 1) rankIcon = <Medal className="w-6 h-6 text-slate-400" />;
          else if (index === 2) rankIcon = <Medal className="w-6 h-6 text-amber-600" />;
          else rankIcon = <span className="font-bold text-slate-400 w-6 text-center">{index + 1}</span>;

          return (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center p-4 rounded-2xl border transition-colors",
                isCurrentUser 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30" 
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
              )}
            >
              <div className="mr-4 flex justify-center items-center w-8">
                {rankIcon}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 mr-4">
                {entry.displayName.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-bold truncate",
                  isCurrentUser ? "text-indigo-700 dark:text-indigo-300" : "text-slate-900 dark:text-white"
                )}>
                  {entry.displayName}
                </p>
                <p className="text-xs text-slate-500">Seviye {entry.level}</p>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-indigo-500">{entry.xp}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">XP</p>
              </div>
            </motion.div>
          );
        })}
        
        {entries.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            Henüz kimse oynamadı. İlk sen ol!
          </div>
        )}
      </div>
    </div>
  );
}
