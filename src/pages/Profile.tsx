import type { ReactNode } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Moon, Stamp, Target } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { usePassportStore } from '../store/usePassportStore';
import { useMistakeStore } from '../store/useMistakeStore';
import { ROZETLER, seviyeUnvani, type RozetIlerlemesi } from '../lib/badges';
import { sayi, yuzde } from '../lib/bicim';
import { surumEtiketi } from '../lib/surum';
import { countries } from '../data/countries';
import { cn } from '../lib/utils';
import { Buton, Rozet, SeviyeCubugu } from '../components/ds';

export function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const updateSettings = useAuthStore(state => state.updateSettings);
  const damgaSayisi = usePassportStore(state => state.getTotalUnlocked());
  const hataSayisi = useMistakeStore(state => state.getMistakesCount());

  if (!user) return null;

  const unvan = seviyeUnvani(user.level || 1);
  const kazanilan = user.badges || [];

  const ilerleme: RozetIlerlemesi = {
    oyunlar: user.stats.gamesPlayed || 0,
    galibiyetler: user.stats.multiplayerWins || 0,
    enYuksekSkor: user.stats.highestScore || 0,
    damgalar: damgaSayisi,
  };

  const isabet =
    user.stats.gamesPlayed > 0
      ? (user.stats.correctAnswers / (user.stats.gamesPlayed * 10)) * 100
      : 0;

  const cikisYap = async () => {
    await signOut(auth);
    useAuthStore.getState().setUser(null);
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-md p-4 pb-32">
      <header className="mb-5 flex flex-col items-center text-center">
        <span className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-altin bg-zemin-gomuk">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="gorsel-lg text-altin">{user.displayName.charAt(0)}</span>
          )}
        </span>
        <h1 className="gorsel-lg text-metin">{user.displayName}</h1>
        <p className="belge-sm mt-1 text-metin-silik">
          {unvan.toLocaleUpperCase('tr')}
          {user.email ? ` · ${user.email}` : ' · MİSAFİR OTURUMU'}
        </p>
      </header>

      <SeviyeCubugu
        seviye={user.level || 1}
        xp={user.xp || 0}
        unvan={unvan.toLocaleUpperCase('tr')}
        className="mb-5"
      />

      <div className="mb-5 grid grid-cols-2 gap-3">
        <KisayolKarti
          ikon={<Stamp size={20} />}
          etiket="Pasaport"
          deger={`${sayi(damgaSayisi)} / ${sayi(countries.length)}`}
          onClick={() => navigate('/passport')}
        />
        <KisayolKarti
          ikon={<Target size={20} />}
          etiket="Hata Kumbarası"
          deger={`${sayi(hataSayisi)} ülke`}
          onClick={() => navigate('/mistakes')}
        />
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Sayac etiket="TUR" deger={sayi(user.stats.gamesPlayed)} />
        <Sayac etiket="DOĞRU" deger={sayi(user.stats.correctAnswers)} />
        <Sayac etiket="İSABET" deger={yuzde(isabet)} />
      </div>

      <section className="mb-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="baslik-md text-metin">Rozetler</h2>
          <span className="belge-sm text-metin-silik">
            {sayi(kazanilan.length)} / {sayi(Object.keys(ROZETLER).length)}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {Object.values(ROZETLER).map((rozet) => {
            const kazanildi = kazanilan.includes(rozet.id);
            return (
              <Rozet
                key={rozet.id}
                ikon={<rozet.Ikon size={22} />}
                ad={rozet.ad}
                aciklama={rozet.aciklama}
                kilitliAciklama={rozet.kilitliAciklama(ilerleme)}
                kazanildi={kazanildi}
              />
            );
          })}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="baslik-md mb-3 text-metin">Tercihler</h2>
        <div className="overflow-hidden rounded-xl border border-cizgi bg-zemin-yukseltilmis">
          <AyarSatiri
            ikon={<Moon size={18} />}
            etiket="Gece teması"
            aciklama="Kapalıyken kâğıt teması kullanılır"
            acik={user.settings.darkMode}
            onDegistir={() => updateSettings({ darkMode: !user.settings.darkMode })}
          />
          <div className="h-px bg-cizgi" />
          <AyarSatiri
            ikon={<Bell size={18} />}
            etiket="Bildirimler"
            aciklama="Günlük görev hatırlatmaları"
            acik={user.settings.notifications}
            onDegistir={() => updateSettings({ notifications: !user.settings.notifications })}
          />
        </div>
      </section>

      <Buton cesit="ikincil" boyut="lg" tamGenislik ikon={<LogOut size={18} />} onClick={cikisYap}>
        Çıkış yap
      </Buton>

      {/* Yayındaki kabuğun hangi derlemeden geldiğini buradan okunur; eski sürüm
          şikâyetlerinde ilk bakılacak yer burasıdır. */}
      <p className="belge-sm mt-6 text-center text-metin-silik">Derleme {surumEtiketi()}</p>
    </div>
  );
}

function KisayolKarti({
  ikon,
  etiket,
  deger,
  onClick,
}: {
  ikon: ReactNode;
  etiket: string;
  deger: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-cizgi bg-zemin-yukseltilmis p-3 text-start transition-colors hover:border-cizgi-belirgin"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-altin-yumusak text-altin-600">
        {ikon}
      </span>
      <span className="min-w-0">
        <span className="belge-sm block truncate text-metin-silik">
          {etiket.toLocaleUpperCase('tr')}
        </span>
        <span className="baslik-sm block truncate text-metin">{deger}</span>
      </span>
    </button>
  );
}

function Sayac({ etiket, deger }: { etiket: string; deger: string }) {
  return (
    <div className="rounded-xl border border-cizgi bg-zemin-yukseltilmis p-3 text-center">
      <p className="baslik-lg text-altin">{deger}</p>
      <p className="belge-sm mt-0.5 text-metin-silik">{etiket}</p>
    </div>
  );
}

function AyarSatiri({
  ikon,
  etiket,
  aciklama,
  acik,
  onDegistir,
}: {
  ikon: ReactNode;
  etiket: string;
  aciklama: string;
  acik: boolean;
  onDegistir: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className="text-metin-yumusak" aria-hidden="true">
        {ikon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="baslik-sm block text-metin">{etiket}</span>
        <span className="govde-sm block text-metin-yumusak">{aciklama}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={acik}
        aria-label={etiket}
        onClick={onDegistir}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full border transition-colors',
          acik ? 'border-altin bg-altin' : 'border-cizgi-belirgin bg-zemin-gomuk'
        )}
      >
        <span
          className={cn(
            'absolute top-1 h-5 w-5 rounded-full transition-[left] duration-150',
            acik ? 'left-6 bg-on-altin' : 'left-1 bg-metin-silik'
          )}
        />
      </button>
    </div>
  );
}
