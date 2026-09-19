import React from 'react';
import { sinif } from './tipler';

export interface RozetProps extends React.HTMLAttributes<HTMLDivElement> {
  /** lucide-react düğümü, 22px. Emoji kullanılmaz. */
  ikon: React.ReactNode;
  ad: string;
  aciklama: string;
  /** Kilitliyken gösterilen ipucu: rozetin NASIL kazanılacağını söyler. */
  kilitliAciklama?: string;
  kazanildi?: boolean;
}

/** Kilitli rozet opaklıkla değil, kesikli kenarlık ve solgun renkle anlatılır. */
export function Rozet({
  ikon,
  ad,
  aciklama,
  kilitliAciklama,
  kazanildi = false,
  className,
  ...kalan
}: RozetProps) {
  return (
    <div
      className={sinif('fq', 'fq-rozet', kazanildi ? 'fq-rozet--kazanildi' : 'fq-rozet--kilitli', className)}
      {...kalan}
    >
      <span className="fq-rozet__madalya" aria-hidden="true">
        {ikon}
      </span>
      <div>
        <p className="fq-rozet__ad">{ad}</p>
        <p className="fq-rozet__aciklama">{kazanildi ? aciklama : kilitliAciklama || aciklama}</p>
      </div>
    </div>
  );
}
