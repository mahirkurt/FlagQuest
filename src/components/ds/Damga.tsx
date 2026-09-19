import React from 'react';
import { sinif } from './tipler';

export interface DamgaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ISO 3166-1 alpha-2, küçük harf ("tr"). */
  ulkeKodu: string;
  ulkeAdi: string;
  /** Kazanılmış damgada gösterilen bayrak görseli. */
  bayrakSrc?: string;
  kazanildi?: boolean;
  /** −6…+6 derece. Elle basılmış izlenimi verir; her ülke için sabit tutulur. */
  aci?: number;
}

/** Kazanılmamış damgada bayrak GÖSTERİLMEZ — ipucu sızdırır. */
export function Damga({
  ulkeKodu,
  ulkeAdi,
  bayrakSrc,
  kazanildi = false,
  aci = 0,
  className,
  ...kalan
}: DamgaProps) {
  const kod = ulkeKodu.toUpperCase();

  return (
    <div
      className={sinif('fq', 'fq-damga', kazanildi ? 'fq-damga--kazanildi' : 'fq-damga--kilitli', className)}
      title={ulkeAdi}
      {...kalan}
    >
      <div className="fq-damga__halka" style={{ transform: `rotate(${aci}deg)` }}>
        {kazanildi && bayrakSrc ? (
          <img className="fq-damga__gorsel" src={bayrakSrc} alt="" />
        ) : (
          <span className="fq-damga__kod-orta" aria-hidden="true">
            {kod}
          </span>
        )}
        {kazanildi ? <span className="fq-damga__kod">{kod}</span> : null}
      </div>
      <span className="fq-damga__ad">{ulkeAdi}</span>
    </div>
  );
}
