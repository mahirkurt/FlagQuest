import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Loader2, Medal, Trophy } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { seviyeUnvani } from '../lib/badges';
import { sayi } from '../lib/bicim';
import { cn } from '../lib/utils';
import { Etiket } from '../components/ds';

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
      <div className="flex items-center justify-center pt-32">
        <Loader2 className="animate-spin text-altin" size={28} aria-hidden="true" />
        <span className="sr-only">Liderlik tablosu yükleniyor</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-4 pb-32">
      <header className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-altin-yumusak text-altin-600">
          <Trophy size={22} aria-hidden="true" />
        </span>
        <div>
          <h1 className="gorsel-lg text-metin">Liderlik Tablosu</h1>
          <p className="govde-sm text-metin-yumusak">En çok XP toplayan ilk 50 gezgin</p>
        </div>
      </header>

      {entries.length === 0 ? (
        <p className="rounded-xl border border-cizgi bg-zemin-yukseltilmis p-6 text-center govde-sm text-metin-yumusak">
          Tablo henüz boş. İlk turu oyna ve listeyi sen aç.
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {entries.map((entry, index) => {
            const benMiyim = entry.userId === currentUser?.uid;

            return (
              <li
                key={entry.userId}
                className={cn(
                  'flex items-center gap-3 rounded-xl border bg-zemin-yukseltilmis p-3',
                  benMiyim ? 'border-cizgi-belirgin bg-zemin-gomuk' : 'border-cizgi'
                )}
              >
                <span className="flex w-8 shrink-0 justify-center">
                  {index < 3 ? (
                    <Medal
                      size={22}
                      aria-hidden="true"
                      className={index === 0 ? 'text-altin' : index === 1 ? 'text-metin-yumusak' : 'text-bozkir'}
                    />
                  ) : (
                    <span className="belge text-metin-silik">{sayi(index + 1)}</span>
                  )}
                </span>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zemin-gomuk baslik-sm text-metin-yumusak">
                  {entry.displayName.charAt(0).toUpperCase()}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="baslik-sm truncate text-metin">{entry.displayName}</span>
                    {benMiyim && <Etiket renk="altin">SEN</Etiket>}
                  </span>
                  <span className="belge-sm block text-metin-silik">
                    SEVİYE {sayi(entry.level)} · {seviyeUnvani(entry.level).toUpperCase()}
                  </span>
                </span>

                <span className="belge shrink-0 text-altin">{sayi(entry.xp)} XP</span>
              </li>
            );
          })}
        </ol>
      )}

      <p className="govde-sm mt-6 text-center text-metin-silik">
        Misafir oyuncular tabloya yazılmaz. Sıralamaya girmek için Google ile gir.
      </p>
    </div>
  );
}
