import { Check, RotateCcw, Stamp, Timer, X } from 'lucide-react';
import { Question } from '../store/useGameStore';
import { encyclopediaService } from '../services/encyclopediaService';
import { getFlagUrl } from '../data/countries';
import { MODLAR } from '../lib/modlar';
import type { ModAnahtari } from '../lib/modlar';
import type { Kita } from '../lib/kitalar';
import { sayi, sureMs, ulkeKodu, yuzde } from '../lib/bicim';
import { BayrakKarti, Buton, Etiket } from './ds';

interface GameSummaryProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  maxStreak: number;
  responseTimes: number[];
  mode: string;
  selectedContinent?: Kita;
  questions: Question[];
  userAnswers: Record<number, string>;
  isFinishing: boolean;
  onFinish: (path?: string) => void;
  onPlayAgain: () => void;
}

export function GameSummary({
  score,
  correctAnswers,
  totalQuestions,
  maxStreak,
  responseTimes,
  mode,
  selectedContinent,
  questions,
  userAnswers,
  isFinishing,
  onFinish,
  onPlayAgain,
}: GameSummaryProps) {
  const yanlis = Math.max(0, totalQuestions - correctAnswers);
  const isabet = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const ortalamaMs =
    responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
  const enHizliMs = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;

  const tanim = MODLAR[mode as ModAnahtari] ?? MODLAR.classic;

  const baslik =
    mode === 'time_attack'
      ? 'Süre doldu'
      : mode === 'world_tour' && selectedContinent
        ? `${selectedContinent} seferini tamamladın`
        : 'Turu tamamladın';

  return (
    <div className="mx-auto flex max-w-lg flex-col p-4 pb-32">
      <section className="rounded-xl border border-cizgi bg-zemin-yukseltilmis p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Etiket renk={tanim.renk}>{tanim.baslik.toLocaleUpperCase('tr')}</Etiket>
          <span className="belge-sm text-metin-silik">
            {sayi(totalQuestions)} SORU
          </span>
        </div>

        <h1 className="gorsel-xl text-metin">{baslik}</h1>
        <p className="govde-sm mt-1 text-metin-yumusak">
          {sayi(correctAnswers)} doğru, {sayi(yanlis)} yanlış. En uzun serin {sayi(maxStreak)}.
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Olcum etiket="PUAN" deger={sayi(score)} vurgulu />
          <Olcum etiket="DOĞRU" deger={`${sayi(correctAnswers)}/${sayi(totalQuestions)}`} />
          <Olcum etiket="YANLIŞ" deger={sayi(yanlis)} />
          <Olcum etiket="EN UZUN SERİ" deger={sayi(maxStreak)} />
        </dl>

        <div className="mt-3 rounded-md border border-cizgi bg-zemin-gomuk p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="govde-sm flex items-center gap-2 text-metin-yumusak">
              <Timer size={16} className="shrink-0 text-meridyen" aria-hidden="true" />
              Ortalama tepki{' '}
              <strong className="belge text-metin">{sureMs(ortalamaMs)}</strong>
            </p>
            <p className="belge-sm text-metin-silik">EN HIZLI {sureMs(enHizliMs)}</p>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <div
              className="h-2 flex-1 overflow-hidden rounded-full bg-zemin"
              role="progressbar"
              aria-valuenow={Math.round(isabet)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="İsabet oranı"
            >
              <div
                className="h-full rounded-full bg-altin transition-[width] duration-500"
                style={{ width: `${isabet}%` }}
              />
            </div>
            <span className="belge shrink-0 text-altin">{yuzde(isabet)} isabet</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Buton
            cesit="birincil"
            boyut="lg"
            tamGenislik
            disabled={isFinishing}
            ikon={<RotateCcw size={18} />}
            onClick={onPlayAgain}
          >
            Yeniden oyna
          </Buton>

          <div className="flex gap-2">
            <Buton
              cesit="ikincil"
              boyut="md"
              tamGenislik
              disabled={isFinishing}
              ikon={<Stamp size={16} />}
              onClick={() => onFinish('/passport')}
            >
              Pasaport
            </Buton>
            <Buton
              cesit="hayalet"
              boyut="md"
              tamGenislik
              disabled={isFinishing}
              onClick={() => onFinish('/')}
            >
              Ana sayfa
            </Buton>
          </div>
        </div>
      </section>

      <h2 className="baslik-md mb-3 mt-6 text-metin">Tur analizi</h2>

      <ul className="flex flex-col gap-3">
        {questions.map((soru, sira) => {
          const ulke = soru.correctOption;
          const dogruMu = userAnswers[sira] === ulke.code;
          const secilen = soru.options.find(o => o.code === userAnswers[sira]);
          const sureDegeri = responseTimes[sira];

          return (
            <li
              key={soru.id || sira}
              className="rounded-xl border border-cizgi bg-zemin-yukseltilmis p-3"
            >
              <div className="flex items-start gap-3">
                <span className="w-24 shrink-0">
                  <BayrakKarti src={getFlagUrl(ulke.code)} alt={`${ulke.name} bayrağı`} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="baslik-sm truncate text-metin">{ulke.name}</p>
                      <p className="belge-sm truncate text-metin-silik">
                        {ulkeKodu(ulke.code)} · {ulke.capital.toLocaleUpperCase('tr')}
                      </p>
                    </div>

                    <span
                      className={`fq-sik__durum shrink-0 ${dogruMu ? 'text-vize' : 'text-damga'}`}
                    >
                      {dogruMu ? (
                        <>
                          <Check size={14} strokeWidth={3} aria-hidden="true" /> Doğru
                        </>
                      ) : (
                        <>
                          <X size={14} strokeWidth={3} aria-hidden="true" /> Yanlış
                        </>
                      )}
                    </span>
                  </div>

                  {!dogruMu && secilen && (
                    <p className="govde-sm mt-1 text-damga">Senin cevabın: {secilen.name}</p>
                  )}

                  {sureDegeri && (
                    <p className="belge-sm mt-1 text-metin-silik">
                      TEPKİ {sureMs(sureDegeri)}
                    </p>
                  )}
                </div>
              </div>

              <p className="govde-sm mt-2 rounded-md border border-cizgi bg-zemin-gomuk p-3 text-metin-yumusak">
                {encyclopediaService.getDidYouKnow(ulke.code)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Olcum({ etiket, deger, vurgulu }: { etiket: string; deger: string; vurgulu?: boolean }) {
  return (
    <div className="rounded-md border border-cizgi bg-zemin-gomuk p-3">
      <dt className="belge-sm text-metin-silik">{etiket}</dt>
      <dd className={`baslik-lg mt-0.5 ${vurgulu ? 'text-altin' : 'text-metin'}`}>{deger}</dd>
    </div>
  );
}
