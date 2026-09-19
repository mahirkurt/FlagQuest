import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Play, Target, Trash2 } from 'lucide-react';
import { useMistakeStore } from '../store/useMistakeStore';
import { useGameStore } from '../store/useGameStore';
import { getFlagUrl } from '../data/countries';
import { sayi, ulkeKodu } from '../lib/bicim';
import { Buton, Etiket } from '../components/ds';

export function MistakeVault() {
  const navigate = useNavigate();
  const { clearAllMistakes, removeMistake, getAllMistakes } = useMistakeStore();
  const startMistakePractice = useGameStore(state => state.startMistakePractice);
  const [onayBekliyor, setOnayBekliyor] = useState(false);

  const kayitlar = getAllMistakes();

  const pratigeBasla = () => {
    if (startMistakePractice()) {
      navigate('/game');
    }
  };

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

      <section className="rounded-xl border border-cizgi bg-zemin-yukseltilmis p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-altin-yumusak text-altin-600">
            <Target size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="gorsel-lg text-metin">Hata Kumbarası</h1>
            <p className="govde-sm text-metin-yumusak">
              Yanıldığın ülkeler burada birikir. Pratikte doğru bilince kumbaradan silinir.
            </p>
          </div>
          <span className="shrink-0 text-end">
            <span className="fq-seviye__sayi block text-altin">{sayi(kayitlar.length)}</span>
            <span className="belge-sm text-metin-silik">ÜLKE</span>
          </span>
        </div>

        {kayitlar.length > 0 ? (
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Buton
              cesit="birincil"
              boyut="lg"
              tamGenislik
              ikon={<Play size={18} />}
              onClick={pratigeBasla}
            >
              Pratiğe başla
            </Buton>

            {onayBekliyor ? (
              <div className="flex gap-2">
                <Buton
                  cesit="tehlike"
                  boyut="lg"
                  ikon={<Trash2 size={16} />}
                  onClick={() => {
                    clearAllMistakes();
                    setOnayBekliyor(false);
                  }}
                >
                  Onayla
                </Buton>
                <Buton cesit="hayalet" boyut="lg" onClick={() => setOnayBekliyor(false)}>
                  Vazgeç
                </Buton>
              </div>
            ) : (
              <Buton
                cesit="ikincil"
                boyut="lg"
                ikon={<Trash2 size={16} />}
                onClick={() => setOnayBekliyor(true)}
              >
                Kumbarayı boşalt
              </Buton>
            )}
          </div>
        ) : (
          <p className="govde-sm mt-5 flex items-center gap-2 rounded-md border border-cizgi bg-zemin-gomuk p-3 text-vize">
            <Check size={16} aria-hidden="true" />
            Kumbaran boş — son turlarında hiç yanılmadın.
          </p>
        )}

        {onayBekliyor && (
          <p className="govde-sm mt-3 text-damga">
            Kumbaradaki {sayi(kayitlar.length)} ülke kalıcı olarak silinecek. Bu işlem geri alınamaz.
          </p>
        )}
      </section>

      {kayitlar.length > 0 ? (
        <>
          <h2 className="baslik-md mb-3 mt-6 text-metin">Pratik bekleyenler</h2>
          <ul className="flex flex-col gap-3">
            {kayitlar.map((kayit) => (
              <li
                key={kayit.code}
                className="rounded-xl border border-cizgi bg-zemin-yukseltilmis p-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getFlagUrl(kayit.code)}
                    alt=""
                    loading="lazy"
                    className="h-9 w-14 shrink-0 rounded-md border border-cizgi object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="baslik-sm truncate text-metin">{kayit.name}</p>
                    <p className="belge-sm truncate text-metin-silik">
                      {ulkeKodu(kayit.code)} · {kayit.capital.toLocaleUpperCase('tr')}
                    </p>
                  </div>
                  <Etiket renk="damga">{sayi(kayit.wrongCount)} HATA</Etiket>
                  <button
                    type="button"
                    onClick={() => removeMistake(kayit.code)}
                    aria-label={`${kayit.name} ülkesini kumbaradan çıkar`}
                    title="Kumbaradan çıkar"
                    className="shrink-0 rounded-sm p-2 text-metin-silik hover:text-damga"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>

                <p className="govde-sm mt-2 rounded-md border border-cizgi bg-zemin-gomuk p-3 text-metin-yumusak">
                  {kayit.funFact}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-6 rounded-xl border border-cizgi bg-zemin-yukseltilmis p-8 text-center">
          <p className="baslik-md text-metin">Kumbara boş</p>
          <p className="govde-sm mx-auto mt-1 max-w-sm text-metin-yumusak">
            Oyun sırasında yanlış bildiğin bayraklar buraya eklenir ve özel bir pratik turunda
            karşına çıkar.
          </p>
          <div className="mx-auto mt-5 max-w-xs">
            <Buton cesit="birincil" boyut="lg" tamGenislik onClick={() => navigate('/')}>
              Bir tur oyna
            </Buton>
          </div>
        </div>
      )}
    </div>
  );
}
