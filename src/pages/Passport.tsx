import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Lock, Search } from 'lucide-react';
import { countries, Country, getFlagUrl } from '../data/countries';
import { usePassportStore } from '../store/usePassportStore';
import { useAuthStore } from '../store/useAuthStore';
import { KITALAR, KITA_IKONLARI, ulkeKitasi, type Kita } from '../lib/kitalar';
import { seviyeUnvani } from '../lib/badges';
import { sayi, ulkeKodu, yuzde } from '../lib/bicim';
import { cn, damgaAcisi } from '../lib/utils';
import { BayrakKarti, Buton, Damga, Etiket } from '../components/ds';

type Filtre = 'Tümü' | Kita;

const FILTRELER: Filtre[] = ['Tümü', ...KITALAR];

export function Passport() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const stamps = usePassportStore(state => state.stamps);
  const getTotalUnlocked = usePassportStore(state => state.getTotalUnlocked);
  const getContinentStats = usePassportStore(state => state.getContinentStats);

  const [arama, setArama] = useState('');
  const [filtre, setFiltre] = useState<Filtre>('Tümü');
  const [secili, setSecili] = useState<Country | null>(null);

  const toplamDamga = getTotalUnlocked();
  const kitaIstatistikleri = getContinentStats();
  const tamamlanma = (toplamDamga / countries.length) * 100;
  const unvan = seviyeUnvani(user?.level || 1);

  const sonuclar = useMemo(() => {
    const sorgu = arama.trim().toLocaleLowerCase('tr');
    return countries.filter((ulke) => {
      const kitaUyar = filtre === 'Tümü' || ulkeKitasi(ulke.region) === filtre;
      if (!kitaUyar) return false;
      if (!sorgu) return true;
      return (
        ulke.name.toLocaleLowerCase('tr').includes(sorgu) ||
        ulke.capital.toLocaleLowerCase('tr').includes(sorgu)
      );
    });
  }, [arama, filtre]);

  return (
    <div className="mx-auto max-w-2xl p-4 pb-32">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="etiket mb-4 inline-flex items-center gap-1.5 rounded-sm text-metin-silik hover:text-metin"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Ana sayfa
      </button>

      {/* Pasaport kapağı: gece dolgusu ve dekoratif MRZ şeridi. */}
      <section className="relative overflow-hidden rounded-2xl bg-gece p-5 text-on-gece">
        <div className="mrz pointer-events-none absolute inset-x-5 top-0 h-[18px] select-none overflow-hidden whitespace-nowrap opacity-[0.18]" aria-hidden="true">
          P&lt;TURFLAGQUEST&lt;&lt;GEZGIN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </div>

        <div className="mt-2 flex items-baseline justify-between gap-3">
          <div>
            <p className="belge-sm opacity-80">DÜNYA PASAPORTU · {unvan.toLocaleUpperCase('tr')}</p>
            <h1 className="gorsel-xl mt-1 text-altin">{sayi(toplamDamga)} damga</h1>
          </div>
          <p className="belge text-altin">{yuzde(tamamlanma)}</p>
        </div>

        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"
          role="progressbar"
          aria-valuenow={Math.round(tamamlanma)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Dünya keşif ilerlemesi"
        >
          <div
            className="h-full rounded-full bg-altin transition-[width] duration-500"
            style={{ width: `${tamamlanma}%` }}
          />
        </div>

        <p className="govde-sm mt-2 opacity-80">
          {sayi(countries.length - toplamDamga)} ülke kaldı. Doğru bildiğin her bayrak buraya
          kalıcı damga olarak mühürlenir.
        </p>
      </section>

      {/* Kıta ilerlemesi */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {KITALAR.map((kita) => {
          const istatistik = kitaIstatistikleri[kita];
          const Ikon = KITA_IKONLARI[kita];
          const etkin = filtre === kita;
          return (
            <button
              key={kita}
              type="button"
              onClick={() => setFiltre(etkin ? 'Tümü' : kita)}
              aria-pressed={etkin}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md border p-2 transition-colors',
                etkin
                  ? 'border-altin bg-altin-yumusak text-altin-600'
                  : 'border-cizgi bg-zemin-yukseltilmis text-metin-yumusak hover:border-cizgi-belirgin'
              )}
            >
              <Ikon size={16} aria-hidden="true" />
              <span className="etiket-sm truncate">{kita.toLocaleUpperCase('tr')}</span>
              <span className="belge-sm">
                {sayi(istatistik.unlocked)}/{sayi(istatistik.total)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Arama ve filtre */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="seritsiz flex flex-1 gap-2 overflow-x-auto pb-1">
          {FILTRELER.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltre(f)}
              aria-pressed={filtre === f}
              className={cn(
                'etiket shrink-0 rounded-sm border px-3 py-1.5 transition-colors',
                filtre === f
                  ? 'border-altin bg-altin-yumusak text-altin-600'
                  : 'border-cizgi bg-zemin-yukseltilmis text-metin-yumusak hover:border-cizgi-belirgin'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <label className="relative shrink-0 sm:w-52">
          <span className="sr-only">Pasaportta ülke ara</span>
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-metin-silik"
          />
          <input
            type="search"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Ülke ara"
            className="govde-sm w-full rounded-lg border border-cizgi bg-zemin-yukseltilmis py-2 pl-9 pr-3 text-metin"
          />
        </label>
      </div>

      {/* Damga tablosu */}
      {sonuclar.length === 0 ? (
        <p className="mt-6 rounded-xl border border-cizgi bg-zemin-yukseltilmis p-8 text-center govde-sm text-metin-yumusak">
          Eşleşen ülke yok. Aramayı sadeleştir veya başka bir kıta seç.
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-4 justify-items-center gap-4 sm:grid-cols-6">
          {sonuclar.map((ulke) => {
            const damga = stamps[ulke.code];
            return (
              <li key={ulke.code}>
                <button
                  type="button"
                  onClick={() => setSecili(ulke)}
                  aria-label={`${ulke.name} — ${damga ? 'mühürlendi' : 'henüz açılmadı'}`}
                  className="rounded-md"
                >
                  <Damga
                    ulkeKodu={ulke.code}
                    ulkeAdi={ulke.name}
                    bayrakSrc={getFlagUrl(ulke.code)}
                    kazanildi={!!damga}
                    aci={damgaAcisi(ulke.code)}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {secili && (
        <DamgaKarti
          ulke={secili}
          muhurSayisi={stamps[secili.code]?.timesCorrect ?? 0}
          onKapat={() => setSecili(null)}
        />
      )}
    </div>
  );
}

function DamgaKarti({
  ulke,
  muhurSayisi,
  onKapat,
}: {
  ulke: Country;
  muhurSayisi: number;
  onKapat: () => void;
}) {
  const kazanildi = muhurSayisi > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${ulke.name} damgası`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--perde)] p-4"
      onClick={onKapat}
    >
      <div
        className="acilma max-h-full w-full max-w-md overflow-y-auto rounded-xl border border-cizgi bg-zemin-yukseltilmis p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <BayrakKarti
          src={getFlagUrl(ulke.code)}
          alt={`${ulke.name} bayrağı`}
          altBilgi={
            <>
              <span>{ulke.region}</span>
              <span>{ulkeKodu(ulke.code)}</span>
            </>
          }
        />

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="gorsel-lg truncate text-metin">{ulke.name}</h2>
            <p className="govde-sm text-metin-yumusak">Başkent: {ulke.capital}</p>
          </div>
          {kazanildi ? (
            <Etiket renk="vize">MÜHÜRLENDİ</Etiket>
          ) : (
            <Etiket renk="altin">AÇILMADI</Etiket>
          )}
        </div>

        <p className="govde-sm mt-3 flex items-center gap-2 rounded-md border border-cizgi bg-zemin-gomuk p-3 text-metin-yumusak">
          {kazanildi ? (
            <>
              <Check size={16} className="shrink-0 text-vize" aria-hidden="true" />
              Bu ülkeyi {sayi(muhurSayisi)} kez doğru bildin.
            </>
          ) : (
            <>
              <Lock size={16} className="shrink-0 text-metin-silik" aria-hidden="true" />
              Bu bayrağı bir turda doğru bilince damga pasaportuna mühürlenir.
            </>
          )}
        </p>

        <div className="mt-3 rounded-md border border-cizgi bg-zemin-gomuk p-3">
          <p className="belge-sm text-metin-silik">ANSİKLOPEDİ NOTU</p>
          <p className="govde-sm mt-1 text-metin-yumusak">{ulke.funFact}</p>
        </div>

        <div className="mt-5">
          <Buton cesit="birincil" boyut="lg" tamGenislik onClick={onKapat}>
            Kapat
          </Buton>
        </div>
      </div>
    </div>
  );
}
