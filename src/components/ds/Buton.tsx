import React from 'react';
import { sinif } from './tipler';

export interface ButonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** birincil: sayfada tek bir tane. tehlike: yalnız yıkıcı işlem. Varsayılan "birincil". */
  cesit?: 'birincil' | 'ikincil' | 'hayalet' | 'tehlike';
  /** Varsayılan "md". Dokunmatik hedef için mobilde "lg". */
  boyut?: 'sm' | 'md' | 'lg';
  tamGenislik?: boolean;
  /** Metinden önce gelen ikon düğümü (tüketici sağlar; lucide-react). */
  ikon?: React.ReactNode;
  /** Metinden sonra gelen ikon düğümü. */
  ikonSon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Buton({
  cesit = 'birincil',
  boyut = 'md',
  tamGenislik,
  ikon,
  ikonSon,
  className,
  children,
  type = 'button',
  ...kalan
}: ButonProps) {
  return (
    <button
      type={type}
      className={sinif(
        'fq',
        'fq-btn',
        `fq-btn--${cesit}`,
        `fq-btn--${boyut}`,
        tamGenislik && 'fq-btn--tam',
        className
      )}
      {...kalan}
    >
      {ikon ? (
        <span className="fq-btn__ikon" aria-hidden="true">
          {ikon}
        </span>
      ) : null}
      {children}
      {ikonSon ? (
        <span className="fq-btn__ikon" aria-hidden="true">
          {ikonSon}
        </span>
      ) : null}
    </button>
  );
}
