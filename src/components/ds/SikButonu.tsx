import React from 'react';
import { Check, X } from 'lucide-react';
import { sinif } from './tipler';

export interface SikButonuProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** "A"–"D". Klavye kısayolunu da temsil eder. */
  harf?: string;
  /** "elendi" 50:50 jokeriyle elenen şıktır ve tıklanamaz. Varsayılan "bos". */
  durum?: 'bos' | 'secili' | 'dogru' | 'yanlis' | 'elendi';
  children?: React.ReactNode;
}

/** Doğru/yanlış hâli renkle birlikte DAİMA ikon ve sözcük taşır. */
export function SikButonu({
  harf,
  durum = 'bos',
  className,
  children,
  disabled,
  ...kalan
}: SikButonuProps) {
  const isaret =
    durum === 'dogru' ? (
      <>
        <Check size={15} strokeWidth={3} aria-hidden="true" />
        Doğru
      </>
    ) : durum === 'yanlis' ? (
      <>
        <X size={15} strokeWidth={3} aria-hidden="true" />
        Yanlış
      </>
    ) : null;

  return (
    <button
      type="button"
      disabled={durum === 'elendi' || !!disabled}
      aria-pressed={durum === 'secili' ? true : undefined}
      className={sinif('fq', 'fq-sik', durum !== 'bos' && `fq-sik--${durum}`, className)}
      {...kalan}
    >
      {harf ? (
        <span className="fq-sik__harf" aria-hidden="true">
          {harf}
        </span>
      ) : null}
      <span className="fq-sik__metin">{children}</span>
      {isaret ? <span className="fq-sik__durum">{isaret}</span> : null}
    </button>
  );
}
