import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Etiket } from './Etiket';
import { MarkaRengi, renkSinifi, sinif } from './tipler';

export interface ModKartiProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  /** 20–24px ikon düğümü; tüketici sağlar. */
  ikon: React.ReactNode;
  baslik: string;
  /** Tek satır; taşan kısım kırpılır. */
  aciklama: string;
  /** Kısa üst etiket: "POPÜLER", "CANLI". */
  etiket?: string;
  /** Modun kategori rengi. Bkz. marka kitabındaki mod → renk eşlemesi. */
  renk?: MarkaRengi;
}

export function ModKarti({ ikon, baslik, aciklama, etiket, renk, className, ...kalan }: ModKartiProps) {
  return (
    <button
      type="button"
      className={sinif('fq', 'fq-mod', renkSinifi('fq-mod', renk), className)}
      {...kalan}
    >
      <span className="fq-mod__kutu" aria-hidden="true">
        {ikon}
      </span>
      <span className="fq-mod__govde">
        <span className="fq-mod__ust">
          <span className="fq-mod__baslik">{baslik}</span>
          {etiket ? <Etiket renk={renk}>{etiket}</Etiket> : null}
        </span>
        <span className="fq-mod__aciklama">{aciklama}</span>
      </span>
      <span className="fq-mod__ok" aria-hidden="true">
        <ChevronRight size={18} />
      </span>
    </button>
  );
}
