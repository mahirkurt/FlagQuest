import { useMemo, useState } from 'react';
import { Globe, Search, X } from 'lucide-react';
import { countries, Country, getFlagUrl } from '../data/countries';
import { KITALAR, ulkeKitasi, type Kita } from '../lib/kitalar';
import { sayi, ulkeKodu } from '../lib/bicim';
import { cn } from '../lib/utils';
import { BayrakKarti, Buton } from '../components/ds';

type Filtre = 'Tümü' | Kita;

const FILTRELER: Filtre[] = ['Tümü', ...KITALAR];

export function Countries() {
  const [arama, setArama] = useState('');
  const [filtre, setFiltre] = useState<Filtre>('Tümü');
  const [secili, setSecili] = useState<Country | null>(null);

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
    <div className="mx-auto max-w-5xl p-4 pb-32">
      <header className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-meridyen-yumusak text-meridyen">
          <Globe size={22} aria-hidden="true" />
        </span>
        <div>
          <h1 className="gorsel-lg text-metin">Bayrak Ansiklopedisi</h1>
          <p className="govde-sm text-metin-yumusak">
            {sayi(sonuclar.length)} / {sayi(countries.length)} BM üyesi ülke
          </p>
        </div>
      </header>

      <div className="mb-4">
        <label className="relative block">
          <span className="sr-only">Ülke veya başkent ara</span>
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-metin-silik"
          />
          <input
            type="search"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Ülke veya başkent ara"
            className="govde w-full rounded-lg border border-cizgi bg-zemin-yukseltilmis py-3 pl-11 pr-10 text-metin"
          />
          {arama && (
            <button
              type="button"
              onClick={() => setArama('')}
              aria-label="Aramayı temizle"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-2 text-metin-silik hover:text-metin"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </label>
      </div>

      <div className="seritsiz mb-6 flex gap-2 overflow-x-auto pb-1">
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

      {sonuclar.length === 0 ? (
        <div className="rounded-xl border border-cizgi bg-zemin-yukseltilmis p-10 text-center">
          <p className="baslik-md text-metin">Eşleşen ülke yok</p>
          <p className="govde-sm mt-1 text-metin-yumusak">
            Aramayı sadeleştir veya başka bir kıta seç.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sonuclar.map((ulke) => (
            <li key={ulke.code}>
              <button
                type="button"
                onClick={() => setSecili(ulke)}
                className="block w-full rounded-xl border border-cizgi bg-zemin-yukseltilmis p-3 text-start transition-colors hover:border-cizgi-belirgin"
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
                <p className="baslik-md mt-3 truncate text-metin">{ulke.name}</p>
                <p className="govde-sm truncate text-metin-yumusak">Başkent: {ulke.capital}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {secili && <UlkeKarti ulke={secili} onKapat={() => setSecili(null)} />}
    </div>
  );
}

export function UlkeKarti({ ulke, onKapat }: { ulke: Country; onKapat: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${ulke.name} ayrıntıları`}
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

        <h2 className="gorsel-lg mt-4 text-metin">{ulke.name}</h2>

        <dl className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-md border border-cizgi bg-zemin-gomuk p-3">
            <dt className="belge-sm text-metin-silik">BAŞKENT</dt>
            <dd className="baslik-sm mt-0.5 text-metin">{ulke.capital}</dd>
          </div>
          <div className="rounded-md border border-cizgi bg-zemin-gomuk p-3">
            <dt className="belge-sm text-metin-silik">BÖLGE</dt>
            <dd className="baslik-sm mt-0.5 text-metin">{ulke.region}</dd>
          </div>
        </dl>

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
