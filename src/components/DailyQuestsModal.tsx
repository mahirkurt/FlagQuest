import { useEffect } from 'react';
import { Check, Flag, Gift, Gamepad2, X, Zap, type LucideIcon } from 'lucide-react';
import { useQuestStore } from '../store/useQuestStore';
import { playCorrectSound } from '../lib/audio';
import { sayi } from '../lib/bicim';
import { Buton, Etiket } from './ds';

interface DailyQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Görev ikonları burada eşlenir; kalıcı görev durumu görsel veri taşımaz
 * (bkz. store/useQuestStore.ts).
 */
const GOREV_IKONLARI: Record<string, LucideIcon> = {
  play_game: Gamepad2,
  streak_3: Zap,
  answer_5: Flag,
};

export function DailyQuestsModal({ isOpen, onClose }: DailyQuestsModalProps) {
  const { quests, claimReward, checkAndResetQuests } = useQuestStore();

  useEffect(() => {
    if (isOpen) checkAndResetQuests();
  }, [isOpen, checkAndResetQuests]);

  if (!isOpen) return null;

  const tamamlanan = quests.filter(q => q.completed).length;

  const oduluAl = async (id: string) => {
    const xp = await claimReward(id);
    if (xp > 0) playCorrectSound();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Günlük görevler"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--perde)] p-4"
      onClick={onClose}
    >
      <div
        className="acilma max-h-full w-full max-w-md overflow-y-auto rounded-xl border border-cizgi bg-zemin-yukseltilmis p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="baslik-lg text-metin">Günlük görevler</h2>
            <p className="govde-sm text-metin-yumusak">
              {sayi(tamamlanan)} / {sayi(quests.length)} tamamlandı · gece yarısı yenilenir
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="rounded-sm p-1.5 text-metin-silik hover:text-metin"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <ul className="flex flex-col gap-3">
          {quests.map((gorev) => {
            const Ikon = GOREV_IKONLARI[gorev.id] ?? Gamepad2;
            const oran = Math.min(100, (gorev.current / gorev.target) * 100);

            return (
              <li
                key={gorev.id}
                className="rounded-xl border border-cizgi bg-zemin-gomuk p-3"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-altin-yumusak text-altin-600">
                    <Ikon size={18} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="baslik-sm text-metin">{gorev.title}</p>
                    <p className="govde-sm text-metin-yumusak">{gorev.description}</p>
                  </div>
                  <Etiket renk="altin">+{sayi(gorev.xpReward)} XP</Etiket>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div
                    className="h-2 flex-1 overflow-hidden rounded-full bg-zemin"
                    role="progressbar"
                    aria-valuenow={gorev.current}
                    aria-valuemin={0}
                    aria-valuemax={gorev.target}
                    aria-label={`${gorev.title} ilerlemesi`}
                  >
                    <div
                      className="h-full rounded-full bg-altin transition-[width] duration-500"
                      style={{ width: `${oran}%` }}
                    />
                  </div>
                  <span className="belge-sm shrink-0 text-metin-silik">
                    {sayi(gorev.current)}/{sayi(gorev.target)}
                  </span>

                  {gorev.claimed ? (
                    <span className="fq-sik__durum shrink-0 text-vize">
                      <Check size={14} strokeWidth={3} aria-hidden="true" /> Alındı
                    </span>
                  ) : gorev.completed ? (
                    <Buton
                      cesit="birincil"
                      boyut="sm"
                      ikon={<Gift size={14} />}
                      onClick={() => oduluAl(gorev.id)}
                    >
                      Ödülü al
                    </Buton>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5">
          <Buton cesit="ikincil" boyut="lg" tamGenislik onClick={onClose}>
            Kapat
          </Buton>
        </div>
      </div>
    </div>
  );
}
