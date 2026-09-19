import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, ListChecks, Stamp, Target, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useGameStore } from '../store/useGameStore';
import { usePassportStore } from '../store/usePassportStore';
import { useMistakeStore } from '../store/useMistakeStore';
import { useQuestStore } from '../store/useQuestStore';
import { seviyeUnvani } from '../lib/badges';
import { MODLAR, type ModAnahtari } from '../lib/modlar';
import { KITALAR, KITA_IKONLARI, kitaUlkeleri, type Kita } from '../lib/kitalar';
import { sayi } from '../lib/bicim';
import { countries } from '../data/countries';
import { DailyQuestsModal } from '../components/DailyQuestsModal';
import { Buton, Etiket, ModKarti, SeviyeCubugu } from '../components/ds';

export function Home() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const {
    startClassic, startTimeAttack, startReverse,
    startDetective, startWorldTour, startDailyChallenge,
  } = useGameStore();

  const damgaSayisi = usePassportStore(state => state.getTotalUnlocked());
  const hataSayisi = useMistakeStore(state => state.getMistakesCount());
  const gorevler = useQuestStore(state => state.quests);

  const [gorevlerAcik, setGorevlerAcik] = useState(false);
  const [seferAcik, setSeferAcik] = useState(false);

  const tamamlananGorev = gorevler.filter(g => g.completed).length;
  const alinabilirOdul = gorevler.some(g => g.completed && !g.claimed);
  const unvan = seviyeUnvani(user?.level || 1);
  const ad = user?.displayName?.split(' ')[0] || 'Gezgin';

  const basla = (baslat: () => void) => {
    baslat();
    navigate('/game');
  };

  const seferSec = (kita: Kita) => {
    setSeferAcik(false);
    startWorldTour(kita);
    navigate('/game');
  };

  return (
    <div className="mx-auto max-w-xl p-4 pb-32">
      <header className="mb-5">
        <h1 className="gorsel-lg text-metin">Merhaba {ad}</h1>
        <p className="govde-sm text-metin-yumusak">Bugün hangi kıtayı keşfedeceksin?</p>
      </header>

      <SeviyeCubugu
        seviye={user?.level || 1}
        xp={user?.xp || 0}
        unvan={unvan.toLocaleUpperCase('tr')}
        className="mb-5"
      />

      <div className="mb-6 grid grid-cols-3 gap-3">
        <HizliKart
          ikon={<Stamp size={18} />}
          etiket="Pasaport"
          deger={`${sayi(damgaSayisi)}/${sayi(countries.length)}`}
          onClick={() => navigate('/passport')}
        />
        <HizliKart
          ikon={<Target size={18} />}
          etiket="Kumbara"
          deger={`${sayi(hataSayisi)} ülke`}
          onClick={() => navigate('/mistakes')}
        />
        <HizliKart
          ikon={alinabilirOdul ? <Gift size={18} /> : <ListChecks size={18} />}
          etiket="Görevler"
          deger={`${sayi(tamamlananGorev)}/${sayi(gorevler.length)}`}
          vurgu={alinabilirOdul}
          onClick={() => setGorevlerAcik(true)}
        />
      </div>

      <h2 className="baslik-md mb-3 text-metin">Oyun modları</h2>

      <div className="flex flex-col gap-3">
        <Mod anahtar="classic" onClick={() => basla(startClassic)} />
        <Mod anahtar="time_attack" onClick={() => basla(startTimeAttack)} />
        <Mod anahtar="reverse" onClick={() => basla(startReverse)} />
        <Mod anahtar="detective" onClick={() => basla(startDetective)} />
        <Mod anahtar="world_tour" onClick={() => setSeferAcik(true)} />
        <Mod anahtar="daily" onClick={() => basla(startDailyChallenge)} />
        <Mod anahtar="duello" onClick={() => navigate('/multiplayer')} />
        <Mod anahtar="ansiklopedi" onClick={() => navigate('/countries')} />
      </div>

      <DailyQuestsModal isOpen={gorevlerAcik} onClose={() => setGorevlerAcik(false)} />

      {seferAcik && <SeferSecici onSec={seferSec} onKapat={() => setSeferAcik(false)} />}
    </div>
  );
}

function Mod({ anahtar, onClick }: { anahtar: ModAnahtari; onClick: () => void }) {
  const tanim = MODLAR[anahtar];
  return (
    <ModKarti
      ikon={<tanim.Ikon size={22} />}
      baslik={tanim.baslik}
      aciklama={tanim.aciklama}
      etiket={tanim.etiket}
      renk={tanim.renk}
      onClick={onClick}
    />
  );
}

function HizliKart({
  ikon,
  etiket,
  deger,
  vurgu,
  onClick,
}: {
  ikon: ReactNode;
  etiket: string;
  deger: string;
  vurgu?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-col items-center gap-1 rounded-xl border border-cizgi bg-zemin-yukseltilmis p-3 text-center transition-colors hover:border-cizgi-belirgin"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-altin-yumusak text-altin-600">
        {ikon}
      </span>
      <span className="etiket-sm w-full truncate text-metin-silik">
        {etiket.toLocaleUpperCase('tr')}
      </span>
      <span className="belge text-metin">{deger}</span>
      {vurgu && (
        <span className="absolute right-2 top-2">
          <Etiket renk="damga">YENİ</Etiket>
        </span>
      )}
    </button>
  );
}

function SeferSecici({
  onSec,
  onKapat,
}: {
  onSec: (kita: Kita) => void;
  onKapat: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Dünya Turu seferi seç"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--perde)] p-4"
      onClick={onKapat}
    >
      <div
        className="acilma w-full max-w-sm rounded-xl border border-cizgi bg-zemin-yukseltilmis p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="baslik-lg text-metin">Dünya Turu seferi</h2>
            <p className="govde-sm text-metin-yumusak">Keşfetmek istediğin kıtayı seç.</p>
          </div>
          <button
            type="button"
            onClick={onKapat}
            aria-label="Kapat"
            className="rounded-sm p-1.5 text-metin-silik hover:text-metin"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {KITALAR.map((kita) => {
            const Ikon = KITA_IKONLARI[kita];
            return (
              <ModKarti
                key={kita}
                ikon={<Ikon size={20} />}
                baslik={kita}
                aciklama={`${sayi(kitaUlkeleri(kita).length)} ülke arasından altı bayrak.`}
                renk="bozkir"
                onClick={() => onSec(kita)}
              />
            );
          })}
        </div>

        <div className="mt-4">
          <Buton
            cesit="hayalet"
            boyut="md"
            tamGenislik
            ikon={<ArrowLeft size={16} />}
            onClick={onKapat}
          >
            Vazgeç
          </Buton>
        </div>
      </div>
    </div>
  );
}
