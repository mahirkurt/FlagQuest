import type { ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Moon, Play, Stamp, Sun, Trophy, User, Volume2, VolumeX } from 'lucide-react';
import { AltNavigasyon, type NavOgesi } from './ds';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAuthStore } from '../store/useAuthStore';
import { logoYolu, useTema } from '../lib/tema';

/** Beş hedef sabittir ve sırası değişmez; orta öge yükseltilmiş "Oyna" düğmesidir. */
const OGELER: NavOgesi[] = [
  { id: '/', etiket: 'Ana Sayfa', ikon: <Home size={20} /> },
  { id: '/passport', etiket: 'Pasaport', ikon: <Stamp size={20} /> },
  { id: '/game', etiket: 'Oyna', ikon: <Play size={22} />, oyna: true },
  { id: '/leaderboard', etiket: 'Liderlik', ikon: <Trophy size={20} /> },
  { id: '/profile', etiket: 'Profil', ikon: <User size={20} /> },
];

export function Layout() {
  const { soundEnabled, toggleSound } = useSettingsStore();
  const updateSettings = useAuthStore(state => state.updateSettings);
  const koyu = useAuthStore(state => state.user?.settings.darkMode ?? true);
  const tema = useTema();
  const konum = useLocation();
  const git = useNavigate();

  // Soru sorulurken sayfa değiştirmek ilerlemeyi kaybettirir: oyun ekranında
  // navigasyon gizlenir.
  const oyunEkrani = konum.pathname === '/game';

  return (
    <div className="flex h-screen flex-col bg-zemin">
      <header className="flex items-center justify-between px-4 py-3">
        <img
          src={logoYolu(tema, 'yatay')}
          alt="FlagQuest"
          width={180}
          height={43}
          className="h-[38px] w-auto"
        />

        <div className="flex items-center gap-1">
          <KabukDugmesi
            etiket={soundEnabled ? 'Sesi kapat' : 'Sesi aç'}
            onClick={toggleSound}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </KabukDugmesi>

          <KabukDugmesi
            etiket={koyu ? 'Kâğıt temasına geç' : 'Gece temasına geç'}
            onClick={() => updateSettings({ darkMode: !koyu })}
          >
            {koyu ? <Sun size={18} /> : <Moon size={18} />}
          </KabukDugmesi>
        </div>
      </header>

      <main className="relative z-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {!oyunEkrani && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center p-3">
          <AltNavigasyon
            className="pointer-events-auto w-full"
            ogeler={OGELER}
            aktif={konum.pathname}
            onGit={git}
          />
        </div>
      )}
    </div>
  );
}

function KabukDugmesi({
  etiket,
  onClick,
  children,
}: {
  etiket: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={etiket}
      aria-label={etiket}
      className="rounded-md p-2 text-metin-silik transition-colors hover:bg-zemin-gomuk hover:text-metin"
    >
      {children}
    </button>
  );
}
