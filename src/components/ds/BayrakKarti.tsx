import React from 'react';
import { sinif } from './tipler';

export interface BayrakKartiProps extends React.HTMLAttributes<HTMLElement> {
  /** Bayrak görselinin URL'si; tüketici sağlar (uygulamada flagcdn). */
  src: string;
  /** Soru ekranında boş bırakılır — cevabı sızdırmasın. */
  alt?: string;
  /** Dedektif modunun ipucu kademeleri. Varsayılan "net". */
  durum?: 'net' | 'bulanik1' | 'bulanik2';
  /** Bulanık kademelerde örtünün üstündeki metin. Bulanıklık tek başına bilgi taşımaz. */
  ortuMetni?: string;
  /** Görselin altındaki belge satırı (bölge, kod). Cevabı ele veren bilgi yazılmaz. */
  altBilgi?: React.ReactNode;
}

export function BayrakKarti({
  src,
  alt = '',
  durum = 'net',
  ortuMetni,
  altBilgi,
  className,
  ...kalan
}: BayrakKartiProps) {
  const ortu =
    durum === 'bulanik1'
      ? ortuMetni || '1. İpucu'
      : durum === 'bulanik2'
        ? ortuMetni || '2. İpucu'
        : null;

  return (
    <figure className={sinif('fq', 'fq-bayrak', `fq-bayrak--${durum}`, className)} {...kalan}>
      <div className="fq-bayrak__cerceve">
        <img className="fq-bayrak__gorsel" src={src} alt={alt} />
        {ortu ? (
          <div className="fq-bayrak__ortu">
            <span className="fq-bayrak__etiket">{ortu}</span>
          </div>
        ) : null}
      </div>
      {altBilgi ? <figcaption className="fq-bayrak__alt">{altBilgi}</figcaption> : null}
    </figure>
  );
}
