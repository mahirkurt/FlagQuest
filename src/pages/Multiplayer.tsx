import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Check, Copy, Eye, Loader2, LogOut, Play, Scissors, Users, X, Zap } from 'lucide-react';
import { useAuthStore, UserProfile } from '../store/useAuthStore';
import { useMultiplayerStore, MultiplayerGameData, ChaosEvent } from '../store/useMultiplayerStore';
import { useBadgeStore } from '../store/useBadgeStore';
import { getFlagUrl } from '../data/countries';
import { playMatchStartSound } from '../lib/audio';
import { sayi, ulkeKodu } from '../lib/bicim';
import { cn } from '../lib/utils';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { BayrakKarti, Buton, Etiket, IpucuCipi, SikButonu } from '../components/ds';

const HARFLER = ['A', 'B', 'C', 'D'];
const AZAMI_OYUNCU = 4;

// ==========================================
// 1. GİRİŞ — odada değilken
// ==========================================
function DuelloGirisi({
  user,
  createRoom,
  joinRoom,
  loading,
  error,
}: {
  user: UserProfile;
  createRoom: (user: any) => Promise<string>;
  joinRoom: (code: string, user: any) => Promise<void>;
  loading: boolean;
  error: string | null;
}) {
  const [kod, setKod] = useState('');

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center p-4 pb-32">
      <header className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-damga-yumusak text-damga">
          <Users size={22} aria-hidden="true" />
        </span>
        <div>
          <h1 className="gorsel-lg text-metin">Canlı Düello</h1>
          <p className="govde-sm text-metin-yumusak">
            En fazla {sayi(AZAMI_OYUNCU)} oyuncu, on soru, üç joker.
          </p>
        </div>
      </header>

      {error && (
        <p role="alert" className="govde-sm mb-4 rounded-lg border border-damga bg-damga-yumusak p-3 text-damga">
          {error}
        </p>
      )}

      <Buton
        cesit="birincil"
        boyut="lg"
        tamGenislik
        disabled={loading}
        ikon={loading ? <Loader2 size={18} className="animate-spin" /> : <Users size={18} />}
        onClick={() => createRoom(user)}
      >
        {loading ? 'Oda kuruluyor' : 'Oda kur'}
      </Buton>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-cizgi" />
        <span className="etiket-sm text-metin-silik">VEYA KODLA KATIL</span>
        <span className="h-px flex-1 bg-cizgi" />
      </div>

      <div className="flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Oda kodu</span>
          <input
            type="text"
            value={kod}
            onChange={(e) => setKod(e.target.value.toLocaleUpperCase('tr'))}
            placeholder="A1B2C3"
            maxLength={6}
            className="belge w-full rounded-lg border border-cizgi bg-zemin-yukseltilmis px-4 py-3 text-center uppercase tracking-[0.2em] text-metin"
          />
        </label>
        <Buton
          cesit="ikincil"
          boyut="lg"
          disabled={loading || kod.trim().length < 4}
          onClick={() => joinRoom(kod, user)}
        >
          Katıl
        </Buton>
      </div>

      <p className="govde-sm mt-6 text-center text-metin-silik">
        Düello bir hesap gerektirir. Misafir oturumunda oda kurulamaz.
      </p>
    </div>
  );
}

// ==========================================
// 2. LOBİ
// ==========================================
function DuelloLobisi({
  roomId,
  roomData,
  user,
  leaveRoom,
  startGame,
}: {
  roomId: string;
  roomData: MultiplayerGameData;
  user: UserProfile;
  leaveRoom: (uid: string) => Promise<void>;
  startGame: () => Promise<void>;
}) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const kurucuMu = roomData.createdBy === user.uid;
  const oyuncuIdleri = roomData.playerIds || [];
  const herkesHazir =
    oyuncuIdleri.length > 0 && oyuncuIdleri.every(pid => roomData.players?.[pid]?.isReady);
  const ben = roomData.players?.[user.uid];

  const kodPaylas = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'FlagQuest Canlı Düello',
          text: `Düelloya katıl. Oda kodu: ${roomId}`,
        });
        return;
      }
    } catch {
      // Paylaşım iptal edildi; panoya kopyalamaya düşülür.
    }
    await navigator.clipboard.writeText(roomId);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col p-4 pb-32">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="gorsel-lg text-metin">Oda lobisi</h1>
        <button
          type="button"
          onClick={() => leaveRoom(user.uid)}
          aria-label="Odadan ayrıl"
          title="Odadan ayrıl"
          className="rounded-sm p-2 text-metin-silik hover:text-damga"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <section className="rounded-2xl bg-gece p-5 text-center text-on-gece">
        <p className="belge-sm opacity-80">DAVET KODU</p>
        <p className="gorsel-2xl mt-1 text-altin" style={{ letterSpacing: '0.2em' }}>
          {roomId}
        </p>
        <div className="mx-auto mt-4 max-w-[220px]">
          <Buton
            cesit="ikincil"
            boyut="md"
            tamGenislik
            ikon={kopyalandi ? <Check size={16} /> : <Copy size={16} />}
            onClick={kodPaylas}
          >
            {kopyalandi ? 'Kopyalandı' : 'Kodu paylaş'}
          </Buton>
        </div>
      </section>

      <div className="mb-3 mt-5 flex items-baseline justify-between">
        <h2 className="baslik-md text-metin">
          Oyuncular {sayi(oyuncuIdleri.length)}/{sayi(AZAMI_OYUNCU)}
        </h2>
        <span className="belge-sm text-metin-silik">
          {herkesHazir ? 'HERKES HAZIR' : 'BEKLENİYOR'}
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-3">
        {oyuncuIdleri.map((pid) => {
          const o = roomData.players?.[pid];
          if (!o) return null;
          return (
            <li
              key={pid}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 text-center',
                o.isReady
                  ? 'border-vize bg-vize-yumusak'
                  : 'border-cizgi bg-zemin-yukseltilmis'
              )}
            >
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-zemin-gomuk baslik-md text-metin-yumusak">
                {o.photoURL ? (
                  <img src={o.photoURL} alt="" className="h-full w-full object-cover" />
                ) : (
                  o.displayName.charAt(0)
                )}
              </span>
              <span className="baslik-sm w-full truncate text-metin">{o.displayName}</span>
              <span className="belge-sm text-metin-silik">
                {o.isHost ? 'KURUCU · ' : ''}
                {o.isReady ? 'HAZIR' : 'BEKLİYOR'}
              </span>
            </li>
          );
        })}

        {Array.from({ length: Math.max(0, AZAMI_OYUNCU - oyuncuIdleri.length) }).map((_, i) => (
          <li
            key={`bos-${i}`}
            className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-cizgi p-4 text-center"
          >
            <span className="belge-sm text-metin-silik">BOŞ YER</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-2">
        <Buton
          cesit={ben?.isReady ? 'ikincil' : 'birincil'}
          boyut="lg"
          tamGenislik
          ikon={<Check size={18} />}
          onClick={() => useMultiplayerStore.getState().toggleReady(user.uid)}
        >
          {ben?.isReady ? 'Hazır değilim' : 'Hazırım'}
        </Buton>

        {kurucuMu ? (
          <Buton
            cesit="ikincil"
            boyut="lg"
            tamGenislik
            disabled={!herkesHazir}
            ikon={<Play size={18} />}
            onClick={() => startGame()}
          >
            Düelloyu başlat
          </Buton>
        ) : (
          <p className="govde-sm rounded-lg border border-cizgi bg-zemin-yukseltilmis p-3 text-center text-metin-yumusak">
            {herkesHazir ? 'Kurucunun başlatması bekleniyor.' : 'Diğer oyuncular bekleniyor.'}
          </p>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. MAÇ
// ==========================================
function DuelloMaci({
  roomData,
  user,
  answerQuestion,
}: {
  roomData: MultiplayerGameData;
  user: UserProfile;
  answerQuestion: (uid: string, code: string) => Promise<void>;
}) {
  const kurucuMu = roomData.createdBy === user.uid;
  const sorular = roomData.questions || [];
  const sira = Math.min(roomData.currentQuestionIndex || 0, Math.max(0, sorular.length - 1));
  const soru = sorular[sira];
  const oyuncuIdleri = roomData.playerIds || [];
  const ben = roomData.players?.[user.uid];

  const herkesCevapladi =
    oyuncuIdleri.length > 0 && oyuncuIdleri.every(pid => roomData.players?.[pid]?.hasAnswered);

  if (!soru || !ben) {
    return <Yukleniyor metin="Sıradaki soru yükleniyor" />;
  }

  // 50:50 jokeri iki yanlış şıkkı eler.
  const elenenler =
    ben.activeJoker === 'fiftyFifty'
      ? soru.options
          .filter(o => o.code !== soru.correctOption.code)
          .slice(0, 2)
          .map(o => o.code)
      : [];

  const kopyaGorulebilir = ben.activeJoker === 'peek' || herkesCevapladi;

  const sikDurumu = (kod: string) => {
    if (elenenler.includes(kod)) return 'elendi' as const;
    if (!ben.hasAnswered) return 'bos' as const;
    if (kod === soru.correctOption.code) return 'dogru' as const;
    if (kod === ben.selectedOption) return 'yanlis' as const;
    return 'bos' as const;
  };

  return (
    <div className="mx-auto flex max-w-md flex-col p-4 pb-32">
      {/* Kaos olayları */}
      {(roomData.recentEvents || []).slice(-2).length > 0 && (
        <div role="status" aria-live="polite" className="mb-3 flex flex-col gap-2">
          {(roomData.recentEvents || []).slice(-2).map((olay: ChaosEvent) => (
            <p
              key={olay.id}
              className="govde-sm rounded-lg border border-cizgi-belirgin bg-zemin-yukseltilmis p-3 text-metin"
            >
              {olay.text}
            </p>
          ))}
        </div>
      )}

      {/* Canlı skor tablosu */}
      <div className="seritsiz mb-3 flex gap-2 overflow-x-auto pb-1">
        {oyuncuIdleri.map((pid) => {
          const o = roomData.players?.[pid];
          if (!o) return null;
          return (
            <span
              key={pid}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5',
                o.hasAnswered ? 'border-vize bg-vize-yumusak' : 'border-cizgi bg-zemin-yukseltilmis'
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-zemin-gomuk belge-sm text-metin-yumusak">
                {o.photoURL ? (
                  <img src={o.photoURL} alt="" className="h-full w-full object-cover" />
                ) : (
                  o.displayName.charAt(0)
                )}
              </span>
              <span className="belge-sm text-metin">{sayi(o.score)}</span>
              {o.hasAnswered && <Check size={12} className="text-vize" aria-hidden="true" />}
            </span>
          );
        })}
      </div>

      {/* İlerleme */}
      <div className="belge-sm mb-1.5 flex items-center justify-between text-metin-silik">
        <span>
          SORU {sayi(sira + 1)} / {sayi(sorular.length)}
        </span>
        <span className="text-altin">{sayi(ben.score)} PUAN</span>
      </div>
      <div
        className="mb-4 h-2 overflow-hidden rounded-full bg-zemin-gomuk"
        role="progressbar"
        aria-valuenow={sira + 1}
        aria-valuemin={0}
        aria-valuemax={sorular.length}
        aria-label="Maç ilerlemesi"
      >
        <div
          className="h-full rounded-full bg-altin transition-[width] duration-500"
          style={{ width: `${((sira + 1) / sorular.length) * 100}%` }}
        />
      </div>

      {/* Jokerler */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <IpucuCipi
          tur="ipucu"
          ikon={<Scissors size={14} />}
          kullanildi={!ben.jokers?.fiftyFifty}
          disabled={ben.hasAnswered || !!ben.activeJoker}
          onClick={() => useMultiplayerStore.getState().useJoker(user.uid, 'fiftyFifty')}
        >
          50:50
        </IpucuCipi>
        <IpucuCipi
          tur="ipucu"
          ikon={<Eye size={14} />}
          kullanildi={!ben.jokers?.peek}
          disabled={ben.hasAnswered || !!ben.activeJoker}
          onClick={() => useMultiplayerStore.getState().useJoker(user.uid, 'peek')}
        >
          Kopya
        </IpucuCipi>
        <IpucuCipi
          tur="ipucu"
          ikon={<Zap size={14} />}
          kullanildi={!ben.jokers?.double}
          disabled={ben.hasAnswered || !!ben.activeJoker}
          onClick={() => useMultiplayerStore.getState().useJoker(user.uid, 'double')}
        >
          Çifte puan
        </IpucuCipi>
      </div>

      {ben.activeJoker === 'double' && (
        <p className="govde-sm mb-3 rounded-lg border border-altin bg-altin-yumusak p-3 text-altin-600">
          Çifte puan açık: bu soruda doğru cevap 30 puan.
        </p>
      )}

      <div className="mb-4">
        <BayrakKarti
          src={getFlagUrl(soru.correctOption.code)}
          alt={ben.hasAnswered ? `${soru.correctOption.name} bayrağı` : ''}
        />
      </div>

      {/* Şıklar */}
      <div className="flex flex-col gap-2.5">
        {soru.options.map((sik, i) => {
          const kopyalayanlar = oyuncuIdleri.filter(
            pid =>
              pid !== user.uid &&
              roomData.players?.[pid]?.hasAnswered &&
              roomData.players?.[pid]?.selectedOption === sik.code
          );

          return (
            <div key={sik.code} className="relative">
              <SikButonu
                harf={HARFLER[i]}
                durum={sikDurumu(sik.code)}
                disabled={ben.hasAnswered}
                onClick={() => answerQuestion(user.uid, sik.code)}
              >
                {sik.name}
              </SikButonu>

              {kopyaGorulebilir && kopyalayanlar.length > 0 && (
                <span className="pointer-events-none absolute inset-y-0 right-24 flex items-center gap-1">
                  {kopyalayanlar.map((pid) => (
                    <span
                      key={pid}
                      title={roomData.players?.[pid]?.displayName}
                      className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-cizgi bg-zemin-gomuk belge-sm text-metin-yumusak"
                    >
                      {roomData.players?.[pid]?.photoURL ? (
                        <img
                          src={roomData.players[pid].photoURL!}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        roomData.players?.[pid]?.displayName?.charAt(0) || '?'
                      )}
                    </span>
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Cevap sonrası */}
      <div className="mt-4">
        {ben.hasAnswered && (
          <div className="mb-3 rounded-lg border border-cizgi bg-zemin-yukseltilmis p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="baslik-sm truncate text-metin">{soru.correctOption.name}</p>
              <p className="belge-sm shrink-0 text-metin-silik">
                {ulkeKodu(soru.correctOption.code)} ·{' '}
                {soru.correctOption.region.toLocaleUpperCase('tr')}
              </p>
            </div>
            <p className="govde-sm mt-1 text-metin-yumusak">{soru.correctOption.funFact}</p>
          </div>
        )}

        {ben.hasAnswered && !herkesCevapladi && (
          <p className="govde-sm rounded-lg border border-cizgi bg-zemin-yukseltilmis p-3 text-center text-metin-yumusak">
            Diğer oyuncular bekleniyor.
          </p>
        )}

        {herkesCevapladi &&
          (kurucuMu ? (
            <Buton
              cesit="birincil"
              boyut="lg"
              tamGenislik
              onClick={() => {
                if (sira < sorular.length - 1) {
                  useMultiplayerStore.getState().nextQuestion();
                } else {
                  useMultiplayerStore.getState().finishGame();
                }
              }}
            >
              {sira < sorular.length - 1 ? 'Sonraki soru' : 'Kader çarkına geç'}
            </Buton>
          ) : (
            <p className="govde-sm rounded-lg border border-cizgi bg-zemin-yukseltilmis p-3 text-center text-metin-yumusak">
              Kurucunun devam etmesi bekleniyor.
            </p>
          ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. KADER ÇARKI
// ==========================================
const CARK_DILIMLERI = [
  { etiket: '+100', puan: 100, renk: 'var(--vize-500)' },
  { etiket: '−50', puan: -50, renk: 'var(--damga-500)' },
  { etiket: '+50', puan: 50, renk: 'var(--bozkir-500)' },
  { etiket: '0', puan: 0, renk: 'var(--metin-silik)' },
  { etiket: '+25', puan: 25, renk: 'var(--altin-500)' },
  { etiket: '−20', puan: -20, renk: 'var(--erguvan-500)' },
];

function DuelloCarki({
  roomData,
  user,
}: {
  roomData: MultiplayerGameData;
  user: UserProfile;
}) {
  const ben = roomData.players?.[user.uid];
  const oyuncuIdleri = roomData.playerIds || [];

  return (
    <div className="mx-auto flex max-w-md flex-col p-4 pb-32">
      <header className="mb-6 text-center">
        <h1 className="gorsel-lg text-metin">Kader çarkı</h1>
        <p className="govde-sm text-metin-yumusak">
          Son bir tur: çark ek puan verir veya alır.
        </p>
      </header>

      {ben?.hasSpunWheel ? (
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-vize-yumusak text-vize">
            <Check size={30} aria-hidden="true" />
          </span>
          <p className="baslik-md text-metin">Çarkı çevirdin</p>
          <p className="govde-sm text-metin-yumusak">Diğer oyuncular bekleniyor.</p>

          <ul className="flex gap-3">
            {oyuncuIdleri.map((pid) => {
              const o = roomData.players?.[pid];
              if (!o) return null;
              return (
                <li
                  key={pid}
                  title={`${o.displayName} — ${o.hasSpunWheel ? 'çevirdi' : 'bekliyor'}`}
                  className={cn(
                    'flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 baslik-sm',
                    o.hasSpunWheel
                      ? 'border-vize bg-vize-yumusak text-vize'
                      : 'border-cizgi bg-zemin-gomuk text-metin-silik'
                  )}
                >
                  {o.photoURL ? (
                    <img src={o.photoURL} alt="" className="h-full w-full object-cover" />
                  ) : (
                    o.displayName.charAt(0)
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <Cark onBitti={(puan) => useMultiplayerStore.getState().spinWheel(user.uid, puan)} />
      )}
    </div>
  );
}

function Cark({ onBitti }: { onBitti: (puan: number) => void }) {
  const [donuyor, setDonuyor] = useState(false);
  const [aci, setAci] = useState(0);

  const cevir = () => {
    if (donuyor) return;
    setDonuyor(true);
    const dilim = Math.floor(Math.random() * CARK_DILIMLERI.length);
    const hedef = 1800 - dilim * 60 + (Math.floor(Math.random() * 40) - 20);
    setAci(hedef);
    setTimeout(() => onBitti(CARK_DILIMLERI[dilim].puan), 4500);
  };

  const konik = `conic-gradient(from -30deg, ${CARK_DILIMLERI.map(
    (d, i) => `${d.renk} ${i * 60}deg ${(i + 1) * 60}deg`
  ).join(', ')})`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8">
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[24px] border-x-transparent"
          style={{ borderTopColor: 'var(--metin)' }}
        />
        <div className="h-64 w-64 overflow-hidden rounded-full border-4 border-cizgi-belirgin">
          <div
            className="h-full w-full transition-transform duration-[4000ms] ease-out"
            style={{ transform: `rotate(${aci}deg)`, background: konik }}
          >
            {CARK_DILIMLERI.map((d, i) => (
              <span
                key={d.etiket}
                className="absolute inset-0 flex items-start justify-center pt-6"
                style={{ transform: `rotate(${i * 60}deg)` }}
              >
                <span className="belge text-on-gece" style={{ color: 'var(--gece)' }}>
                  {d.etiket} XP
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[220px]">
        <Buton cesit="birincil" boyut="lg" tamGenislik disabled={donuyor} onClick={cevir}>
          {donuyor ? 'Dönüyor' : 'Çarkı çevir'}
        </Buton>
      </div>
    </div>
  );
}

// ==========================================
// 5. SONUÇ
// ==========================================
function DuelloSonucu({
  roomData,
  user,
  leaveRoom,
}: {
  roomData: MultiplayerGameData;
  user: UserProfile;
  leaveRoom: (uid: string) => Promise<void>;
}) {
  const navigate = useNavigate();
  const siralama = Object.entries(roomData.players || {})
    .map(([id, o]) => ({ id, ...o }))
    .sort((a, b) => b.score - a.score);

  const cik = (hedef: string) => {
    leaveRoom(user.uid);
    navigate(hedef);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col p-4 pb-32">
      <h1 className="gorsel-lg mb-5 text-metin">Maç sonucu</h1>

      <ol className="mb-6 flex flex-col gap-3">
        {siralama.map((o, i) => (
          <li
            key={o.id}
            className={cn(
              'flex items-center gap-3 rounded-xl border bg-zemin-yukseltilmis p-3',
              o.id === user.uid ? 'border-cizgi-belirgin bg-zemin-gomuk' : 'border-cizgi'
            )}
          >
            <span className="belge w-6 shrink-0 text-center text-metin-silik">{sayi(i + 1)}</span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zemin-gomuk baslik-sm text-metin-yumusak">
              {o.photoURL ? (
                <img src={o.photoURL} alt="" className="h-full w-full object-cover" />
              ) : (
                o.displayName.charAt(0)
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="baslik-sm block truncate text-metin">{o.displayName}</span>
              {o.id === user.uid && <Etiket renk="altin">SEN</Etiket>}
            </span>
            <span className="belge shrink-0 text-altin">{sayi(o.score)} XP</span>
          </li>
        ))}
      </ol>

      <h2 className="baslik-md mb-3 text-metin">Maçtaki ülkeler</h2>
      <ul className="mb-6 flex flex-col gap-2">
        {(roomData.questions || []).map((soru, i) => {
          const ulke = soru.correctOption;
          if (!ulke) return null;
          return (
            <li
              key={soru.id || i}
              className="flex items-center gap-3 rounded-xl border border-cizgi bg-zemin-yukseltilmis p-3"
            >
              <img
                src={getFlagUrl(ulke.code)}
                alt=""
                loading="lazy"
                className="h-9 w-14 shrink-0 rounded-md border border-cizgi object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="baslik-sm block truncate text-metin">{ulke.name}</span>
                <span className="belge-sm block truncate text-metin-silik">
                  {ulkeKodu(ulke.code)} · {ulke.capital.toLocaleUpperCase('tr')}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-2">
        <Buton
          cesit="birincil"
          boyut="lg"
          tamGenislik
          ikon={<LogOut size={18} />}
          onClick={() => cik('/')}
        >
          Ana sayfaya dön
        </Buton>
        <Buton cesit="hayalet" boyut="md" tamGenislik onClick={() => cik('/countries')}>
          Ansiklopediye git
        </Buton>
      </div>
    </div>
  );
}

function Yukleniyor({ metin }: { metin: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <Loader2 size={28} className="animate-spin text-altin" aria-hidden="true" />
      <p className="govde-sm mt-3 text-metin-yumusak">{metin}</p>
    </div>
  );
}

// ==========================================
// ANA BİLEŞEN
// ==========================================
export function Multiplayer() {
  const user = useAuthStore(state => state.user);
  const {
    roomId, roomData, createRoom, joinRoom, leaveRoom,
    startGame, answerQuestion, loading, error,
  } = useMultiplayerStore();

  const kazancIslendi = useRef(false);
  const baslangicSesi = useRef(false);
  const otoBaslatiliyor = useRef(false);

  useEffect(() => {
    return () => {
      if (user?.uid) leaveRoom(user.uid);
    };
  }, [user?.uid, leaveRoom]);

  useEffect(() => {
    if (roomData?.status === 'started' && !baslangicSesi.current) {
      playMatchStartSound();
      baslangicSesi.current = true;
    } else if (roomData?.status === 'waiting') {
      baslangicSesi.current = false;
    }
  }, [roomData?.status]);

  // Herkes hazır olduğunda kurucu maçı kendiliğinden başlatır.
  useEffect(() => {
    if (roomData?.status === 'waiting') {
      const kurucuMu = roomData.createdBy === user?.uid;
      const oyuncuIdleri = roomData.playerIds || [];
      const herkesHazir =
        oyuncuIdleri.length > 0 && oyuncuIdleri.every(pid => roomData.players?.[pid]?.isReady);

      if (kurucuMu && herkesHazir && !otoBaslatiliyor.current) {
        otoBaslatiliyor.current = true;
        startGame().catch(err => {
          console.error('Auto start error:', err);
          otoBaslatiliyor.current = false;
        });
      }
    } else {
      otoBaslatiliyor.current = false;
    }
  }, [roomData?.status, roomData?.playerIds, roomData?.players, roomData?.createdBy, user?.uid, startGame]);

  useEffect(() => {
    if (roomData?.status === 'completed' && !kazancIslendi.current && user) {
      kazancIslendi.current = true;
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      const ben = roomData.players?.[user.uid];
      if (ben) {
        const siralama = Object.entries(roomData.players || {}).sort(
          ([, a], [, b]) => b.score - a.score
        );
        const kazandiMi = siralama.length > 0 && siralama[0][0] === user.uid;

        useAuthStore.getState()
          .updateUserStats(ben.score, 0, kazandiMi)
          .then(() => useAuthStore.getState().checkAndAwardBadges())
          .then((yeniRozetler) => {
            yeniRozetler.forEach(id => useBadgeStore.getState().showBadge(id));
          });
      }
    }
  }, [roomData?.status, user, roomData]);

  if (!user) return <Yukleniyor metin="Oturum kontrol ediliyor" />;

  return (
    <ErrorBoundary
      fallbackTitle="Düello ekranı yüklenemedi"
      onReset={() => {
        if (user?.uid) leaveRoom(user.uid);
      }}
    >
      {!roomId || !roomData ? (
        <DuelloGirisi
          user={user}
          createRoom={createRoom}
          joinRoom={joinRoom}
          loading={loading}
          error={error}
        />
      ) : roomData.status === 'waiting' ? (
        <DuelloLobisi
          roomId={roomId}
          roomData={roomData}
          user={user}
          leaveRoom={leaveRoom}
          startGame={startGame}
        />
      ) : roomData.status === 'started' ? (
        <DuelloMaci roomData={roomData} user={user} answerQuestion={answerQuestion} />
      ) : roomData.status === 'spinning' ? (
        <DuelloCarki roomData={roomData} user={user} />
      ) : roomData.status === 'completed' ? (
        <DuelloSonucu roomData={roomData} user={user} leaveRoom={leaveRoom} />
      ) : (
        <Yukleniyor metin="Oyun durumu eşitleniyor" />
      )}
    </ErrorBoundary>
  );
}
