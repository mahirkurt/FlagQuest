import React from 'react';
import { sinif } from './tipler';

export interface NavOgesi {
  id: string;
  etiket: string;
  ikon: React.ReactNode;
  /** true ise bu öge ortadaki yükseltilmiş "Oyna" düğmesi olarak çizilir. */
  oyna?: boolean;
}

export interface AltNavigasyonProps extends React.HTMLAttributes<HTMLElement> {
  ogeler: NavOgesi[];
  /** Aktif ögenin id'si. */
  aktif?: string;
  /** "Oyna" düğmesinin dizini. Varsayılan: ortadaki öge. */
  oynaIndex?: number;
  /** nav için aria-label. Varsayılan "Ana gezinme". */
  etiket?: string;
  /** Bir ögeye gidilince çağrılır; yönlendirmeyi tüketici yapar. */
  onGit?: (id: string) => void;
}

/**
 * Beş hedef sabittir ve sırası değişmez. Kabuk sayfanın altına sabitlendiği için
 * sayfa içeriğine en az bosluk-16 alt boşluk bırakılmalıdır.
 */
export function AltNavigasyon({
  ogeler,
  aktif,
  oynaIndex,
  etiket,
  onGit,
  className,
  ...kalan
}: AltNavigasyonProps) {
  const oynaSira = typeof oynaIndex === 'number' ? oynaIndex : Math.floor(ogeler.length / 2);

  return (
    <nav
      className={sinif('fq', 'fq-nav', className)}
      aria-label={etiket || 'Ana gezinme'}
      {...kalan}
    >
      {ogeler.map((o, i) => {
        if (i === oynaSira && o.oyna) {
          return (
            <button
              key={o.id}
              type="button"
              className="fq-nav__oyna"
              aria-label={o.etiket}
              onClick={() => onGit?.(o.id)}
            >
              {o.ikon}
            </button>
          );
        }

        const etkin = aktif === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-current={etkin ? 'page' : undefined}
            className={sinif('fq-nav__oge', etkin && 'fq-nav__oge--aktif')}
            onClick={() => onGit?.(o.id)}
          >
            <span aria-hidden="true">{o.ikon}</span>
            <span>{o.etiket}</span>
          </button>
        );
      })}
    </nav>
  );
}
