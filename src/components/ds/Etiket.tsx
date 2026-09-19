import React from 'react';
import { MarkaRengi, renkSinifi, sinif } from './tipler';

export interface EtiketProps extends React.HTMLAttributes<HTMLSpanElement> {
  renk?: MarkaRengi;
  children?: React.ReactNode;
}

/** Kısa kategori etiketi: POPÜLER, HIZLI, CANLI. Durum göstergesi DEĞİLDİR. */
export function Etiket({ renk, className, children, ...kalan }: EtiketProps) {
  return (
    <span className={sinif('fq', 'fq-etiket', renkSinifi('fq-etiket', renk), className)} {...kalan}>
      {children}
    </span>
  );
}
