import React from 'react';
import { sayi } from '../../lib/bicim';
import { sinif } from './tipler';

export interface SeviyeCubuguProps extends React.HTMLAttributes<HTMLElement> {
  seviye: number;
  /** Toplam XP. Seviye içi ilerleme `xp % hedefXp` ile hesaplanır. */
  xp: number;
  /** Seviye başına XP. Varsayılan 100. */
  hedefXp?: number;
  /** Seviye unvanı ("Usta Kâşif"). */
  unvan?: string;
  /** Dekoratif MRZ şeridi. Ekran okuyuculardan gizlidir ve ASLA kişisel veri taşımaz. */
  mrz?: string;
}

/** Pasaport kapağı olarak çizilen seviye kartı. */
export function SeviyeCubugu({
  seviye,
  xp,
  hedefXp = 100,
  unvan = 'Çırak Seyyah',
  mrz,
  className,
  ...kalan
}: SeviyeCubuguProps) {
  const toplam = Math.max(0, xp || 0);
  const icinde = toplam % hedefXp;
  const kalanXp = Math.max(0, hedefXp - icinde);
  const yuzde = (icinde / hedefXp) * 100;

  return (
    <section
      className={sinif('fq', 'fq-seviye', className)}
      aria-label={`Seviye ${seviye || 1}`}
      {...kalan}
    >
      <div className="fq-seviye__mrz" aria-hidden="true">
        {mrz || 'P<TURFLAGQUEST<<GEZGIN<<<<<<<<<<<<<<<<<<<<<<<<<'}
      </div>
      <div className="fq-seviye__ust">
        <div>
          <div className="fq-seviye__unvan">{unvan}</div>
          <div className="fq-seviye__sayi">Seviye {sayi(seviye || 1)}</div>
        </div>
        <div className="fq-seviye__xp">{sayi(toplam)} XP</div>
      </div>
      <div
        className="fq-seviye__yol"
        role="progressbar"
        aria-valuenow={Math.round(yuzde)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="fq-seviye__dolgu" style={{ width: `${yuzde}%` }} />
      </div>
      <div className="fq-seviye__alt">
        <span>
          {sayi(icinde)} / {sayi(hedefXp)} XP
        </span>
        <span>Sonraki seviyeye {sayi(kalanXp)} XP</span>
      </div>
    </section>
  );
}
