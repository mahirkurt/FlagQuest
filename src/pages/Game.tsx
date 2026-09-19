import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Eye, Flame, Lightbulb, Scissors } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { useAuthStore } from '../store/useAuthStore';
import { getFlagUrl } from '../data/countries';
import { encyclopediaService } from '../services/encyclopediaService';
import { GameSummary } from '../components/GameSummary';
import { MODLAR } from '../lib/modlar';
import { sayi, sure, ulkeKodu } from '../lib/bicim';
import { cn } from '../lib/utils';
import { BayrakKarti, Buton, Etiket, IpucuCipi, SikButonu } from '../components/ds';

const HARFLER = ['A', 'B', 'C', 'D'];

export function Game() {
  const navigate = useNavigate();
  const {
    mode, selectedContinent, questions, currentQuestionIndex, status,
    answerQuestion, nextQuestion, resetGame, startSinglePlayer,
    startWorldTour, selectedOption, score, correctAnswers, userAnswers,
    streak, maxStreak, multiplier, timeLeft, timerActive, decrementTime,
    clueStage, advanceDetectiveClue, fiftyFiftyUsed, hintStage,
    hiddenOptionCodes, responseTimes, useFiftyFifty, useHint,
  } = useGameStore();
  const updateUserStats = useAuthStore(state => state.updateUserStats);

  const [bitiriliyor, setBitiriliyor] = useState(false);

  const soru = questions[currentQuestionIndex];
  const cevaplandi = selectedOption !== null;

  // Zamana Karşı sayacı
  useEffect(() => {
    if (!timerActive || status !== 'playing' || mode !== 'time_attack') return;
    const sayac = setInterval(() => decrementTime(1), 1000);
    return () => clearInterval(sayac);
  }, [timerActive, status, mode, decrementTime]);

  useEffect(() => {
    if (status === 'idle') navigate('/');
  }, [status, navigate]);

  // Şık harfleri aynı zamanda klavye kısayoludur (A–D).
  const gorunurSiklar = useMemo(
    () => (soru ? soru.options.filter(o => !hiddenOptionCodes.includes(o.code)) : []),
    [soru, hiddenOptionCodes]
  );

  useEffect(() => {
    if (status !== 'playing' || cevaplandi || !soru) return;
    const dinle = (olay: KeyboardEvent) => {
      const sira = HARFLER.indexOf(olay.key.toLocaleUpperCase('tr'));
      const secim = gorunurSiklar[sira];
      if (sira >= 0 && secim) {
        olay.preventDefault();
        answerQuestion(secim.code);
      }
    };
    window.addEventListener('keydown', dinle);
    return () => window.removeEventListener('keydown', dinle);
  }, [status, cevaplandi, soru, gorunurSiklar, answerQuestion]);

  const bitir = async (hedef: string = '/') => {
    setBitiriliyor(true);
    await updateUserStats(score, correctAnswers);
    resetGame();
    navigate(hedef);
  };

  const yenidenOyna = async () => {
    setBitiriliyor(true);
    await updateUserStats(score, correctAnswers);
    if (mode === 'world_tour' && selectedContinent) {
      startWorldTour(selectedContinent);
    } else {
      startSinglePlayer();
    }
    setBitiriliyor(false);
  };

  if (status === 'completed') {
    return (
      <GameSummary
        score={score}
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
        maxStreak={maxStreak}
        responseTimes={responseTimes}
        mode={mode}
        selectedContinent={selectedContinent}
        questions={questions}
        userAnswers={userAnswers}
        isFinishing={bitiriliyor}
        onFinish={bitir}
        onPlayAgain={yenidenOyna}
      />
    );
  }

  if (!soru) return null;

  const tanim = MODLAR[mode];
  const dogruUlke = soru.correctOption;
  const bilgi = cevaplandi ? encyclopediaService.getSnippetByCountryCode(dogruUlke.code) : null;
  const sonSoru = currentQuestionIndex >= questions.length - 1;
  const bulanikKademe = clueStage === 1 ? 'bulanik1' : clueStage === 2 ? 'bulanik2' : 'net';

  const sikDurumu = (kod: string) => {
    if (hiddenOptionCodes.includes(kod)) return 'elendi' as const;
    if (!cevaplandi) return 'bos' as const;
    if (kod === dogruUlke.code) return 'dogru' as const;
    if (kod === selectedOption) return 'yanlis' as const;
    return 'bos' as const;
  };

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col p-4 pb-8">
      {/* Üst çubuk: mod kimliği, seri ve sayaç */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <Etiket renk={tanim.renk}>
          {mode === 'world_tour' && selectedContinent
            ? `${tanim.baslik} · ${selectedContinent}`.toLocaleUpperCase('tr')
            : tanim.baslik.toLocaleUpperCase('tr')}
        </Etiket>

        <div className="flex shrink-0 items-center gap-2">
          {streak >= 2 && (
            <IpucuCipi tur="seri" ikon={<Flame size={14} />} disabled>
              {sayi(streak)} seri · {multiplier.toLocaleString('tr-TR')}x
            </IpucuCipi>
          )}
          {mode === 'time_attack' && (
            <IpucuCipi tur="sure" ikon={<Clock size={14} />} kritik={timeLeft <= 10} disabled>
              {sure(timeLeft)}
            </IpucuCipi>
          )}
        </div>
      </div>

      {/* İlerleme */}
      <div className="belge-sm mb-1.5 flex items-center justify-between text-metin-silik">
        <span>
          SORU {sayi(currentQuestionIndex + 1)} / {sayi(questions.length)}
        </span>
        <span className="text-altin">{sayi(score)} PUAN</span>
      </div>
      <div
        className="mb-4 h-2 overflow-hidden rounded-full bg-zemin-gomuk"
        role="progressbar"
        aria-valuenow={currentQuestionIndex + 1}
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-label="Tur ilerlemesi"
      >
        <div
          className="h-full rounded-full bg-altin transition-[width] duration-500"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Jokerler */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <IpucuCipi
          tur="ipucu"
          ikon={<Scissors size={14} />}
          kullanildi={fiftyFiftyUsed}
          disabled={cevaplandi}
          onClick={useFiftyFifty}
        >
          50:50
        </IpucuCipi>

        <IpucuCipi
          tur="ipucu"
          ikon={<Lightbulb size={14} />}
          kullanildi={hintStage >= 2}
          disabled={cevaplandi}
          onClick={useHint}
        >
          {hintStage === 0 ? 'İpucu al' : `İpucu ${sayi(hintStage)}/2`}
        </IpucuCipi>
      </div>

      {hintStage > 0 && (
        <div className="mb-4 rounded-lg border border-cizgi bg-zemin-yukseltilmis p-3">
          <p className="belge-sm text-metin-silik">AÇILAN İPUÇLARI</p>
          <p className="govde-sm mt-1 text-metin">
            Bölge: <strong className="text-altin">{dogruUlke.region}</strong>
            {hintStage >= 2 && (
              <>
                {' · '}Başkent: <strong className="text-altin">{dogruUlke.capital}</strong>
              </>
            )}
          </p>
        </div>
      )}

      {/* Soru görseli */}
      {mode === 'reverse' ? (
        <div className="mb-4 rounded-xl border border-cizgi bg-zemin-yukseltilmis p-5 text-center">
          <p className="belge-sm text-metin-silik">HANGİ BAYRAK BU ÜLKENİN?</p>
          <p className="gorsel-lg mt-1 text-metin">{dogruUlke.name}</p>
          <p className="govde-sm text-metin-yumusak">
            {dogruUlke.region} · Başkent: {dogruUlke.capital}
          </p>
        </div>
      ) : mode === 'detective' ? (
        <div className="mb-4 rounded-xl border border-cizgi bg-zemin-yukseltilmis p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="belge-sm text-metin-silik">
              İPUCU {sayi(clueStage)} / 3
            </p>
            <p className="belge-sm text-erguvan">
              {clueStage === 1 ? '30' : clueStage === 2 ? '20' : '10'} PUAN
            </p>
          </div>

          <div className="mb-3 flex flex-col gap-2">
            <p className="govde-sm rounded-md border border-cizgi bg-zemin-gomuk p-3 text-metin-yumusak">
              <strong className="text-metin">1. ipucu</strong> — {dogruUlke.region} bölgesi,
              başkenti {dogruUlke.capital}.
            </p>
            {clueStage >= 2 && (
              <p className="govde-sm rounded-md border border-cizgi bg-zemin-gomuk p-3 text-metin-yumusak">
                <strong className="text-metin">2. ipucu</strong> — {dogruUlke.funFact}
              </p>
            )}
          </div>

          <BayrakKarti
            src={getFlagUrl(dogruUlke.code)}
            alt={cevaplandi ? `${dogruUlke.name} bayrağı` : ''}
            durum={cevaplandi ? 'net' : bulanikKademe}
            ortuMetni={clueStage === 1 ? '1. İPUCU · BAYRAK KAPALI' : '2. İPUCU · BAYRAK YARI AÇIK'}
          />

          {clueStage < 3 && !cevaplandi && (
            <div className="mt-3">
              <Buton
                cesit="ikincil"
                boyut="md"
                tamGenislik
                ikon={<Eye size={16} />}
                onClick={advanceDetectiveClue}
              >
                Sonraki ipucunu aç
              </Buton>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <BayrakKarti
            src={getFlagUrl(dogruUlke.code)}
            alt={cevaplandi ? `${dogruUlke.name} bayrağı` : ''}
          />
        </div>
      )}

      {/* Şıklar */}
      {mode === 'reverse' ? (
        <div className="grid grid-cols-2 gap-3">
          {soru.options.map((sik, sira) => {
            const durum = sikDurumu(sik.code);
            if (durum === 'elendi') {
              return (
                <div
                  key={sik.code}
                  aria-hidden="true"
                  className="aspect-[3/2] rounded-lg border border-dashed border-cizgi opacity-[var(--opaklik-pasif)]"
                />
              );
            }
            return (
              <button
                key={sik.code}
                type="button"
                disabled={cevaplandi}
                onClick={() => answerQuestion(sik.code)}
                aria-label={`${HARFLER[sira]} şıkkı`}
                className={cn(
                  'rounded-lg border-2 p-1 text-start transition-colors',
                  durum === 'dogru'
                    ? 'border-vize bg-vize-yumusak'
                    : durum === 'yanlis'
                      ? 'border-damga bg-damga-yumusak'
                      : 'border-cizgi bg-zemin-yukseltilmis hover:border-cizgi-belirgin'
                )}
              >
                <BayrakKarti src={getFlagUrl(sik.code)} alt="" />
                <span className="belge-sm mt-1 flex items-center justify-between px-1 text-metin-silik">
                  <span>{HARFLER[sira]}</span>
                  {durum === 'dogru' && <span className="text-vize">DOĞRU</span>}
                  {durum === 'yanlis' && <span className="text-damga">YANLIŞ</span>}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {soru.options.map((sik, sira) => (
            <SikButonu
              key={sik.code}
              harf={HARFLER[sira]}
              durum={sikDurumu(sik.code)}
              disabled={cevaplandi}
              onClick={() => answerQuestion(sik.code)}
            >
              {sik.name}
            </SikButonu>
          ))}
        </div>
      )}

      {/* Cevap sonrası */}
      {cevaplandi && (
        <div className="acilma mt-4">
          {bilgi && (
            <div className="mb-3 rounded-lg border border-cizgi bg-zemin-yukseltilmis p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="baslik-sm truncate text-metin">{bilgi.name}</p>
                <p className="belge-sm shrink-0 text-metin-silik">
                  {ulkeKodu(dogruUlke.code)} · {bilgi.region.toLocaleUpperCase('tr')}
                </p>
              </div>
              <p className="govde-sm mt-1 text-metin-yumusak">{bilgi.didYouKnow}</p>
            </div>
          )}

          <Buton
            cesit="birincil"
            boyut="lg"
            tamGenislik
            ikonSon={<ArrowRight size={18} />}
            onClick={nextQuestion}
          >
            {sonSoru ? 'Turu bitir' : 'Sonraki soru'}
          </Buton>
        </div>
      )}
    </div>
  );
}
