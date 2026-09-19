import { useEffect } from 'react';
import { useBadgeStore } from '../store/useBadgeStore';
import { ROZETLER } from '../lib/badges';
import { Rozet } from './ds';

/** Yeni kazanılan rozeti dört saniye gösterir; kuyruk sırayla boşalır. */
export function BadgeToast() {
  const { queue, dismissBadge } = useBadgeStore();

  const siradaki = queue[0];
  const rozet = siradaki ? ROZETLER[siradaki] : null;

  useEffect(() => {
    if (!rozet) return;
    const zamanlayici = setTimeout(dismissBadge, 4000);
    return () => clearTimeout(zamanlayici);
  }, [rozet, dismissBadge]);

  if (!rozet) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-center"
    >
      <div className="acilma w-full max-w-sm rounded-xl border border-altin bg-zemin-yukseltilmis p-1 shadow-lg">
        <p className="belge-sm px-3 pb-1 pt-2 text-altin">YENİ ROZET</p>
        <Rozet
          ikon={<rozet.Ikon size={22} />}
          ad={rozet.ad}
          aciklama={rozet.aciklama}
          kazanildi
          className="border-0 bg-transparent"
        />
      </div>
    </div>
  );
}
