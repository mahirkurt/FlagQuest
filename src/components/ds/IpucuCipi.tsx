import React from 'react';
import { sinif } from './tipler';

export interface IpucuCipiProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Varsayılan "ipucu". "sure" belge yazı tipiyle sayaç gösterir. */
  tur?: 'ipucu' | 'sure' | 'seri';
  ikon?: React.ReactNode;
  /** Kullanılmış joker: üstü çizili ve tıklanamaz. Listeden KALDIRILMAZ. */
  kullanildi?: boolean;
  /** Yalnız tur="sure": son 10 saniyede kırmızı dolgu. Yanıp sönme kullanılmaz. */
  kritik?: boolean;
  children?: React.ReactNode;
}

export function IpucuCipi({
  tur = 'ipucu',
  ikon,
  kullanildi,
  kritik,
  className,
  children,
  disabled,
  ...kalan
}: IpucuCipiProps) {
  const kritikMi = tur === 'sure' && !!kritik;

  return (
    <button
      type="button"
      disabled={!!kullanildi || !!disabled}
      className={sinif(
        'fq',
        'fq-cip',
        `fq-cip--${tur}`,
        kritikMi && 'fq-cip--sure-kritik',
        kullanildi && 'fq-cip--kullanildi',
        className
      )}
      {...kalan}
    >
      {ikon ? (
        <span aria-hidden="true" style={{ display: 'inline-flex' }}>
          {ikon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
