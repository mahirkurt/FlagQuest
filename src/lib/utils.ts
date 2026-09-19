import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Damganın eğimi (−6…+6 derece). Ülke kodundan türetilir, rastgele değildir:
 * pasaport her açıldığında damgaların yeri kaymamalıdır.
 */
export function damgaAcisi(ulkeKodu: string): number {
  let karma = 0;
  for (let i = 0; i < ulkeKodu.length; i++) {
    karma = (karma * 31 + ulkeKodu.charCodeAt(i)) >>> 0;
  }
  return (karma % 13) - 6;
}
