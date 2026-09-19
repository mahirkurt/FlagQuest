/**
 * Tema — gece (koyu, varsayılan) ve kagit (açık).
 *
 * Token'lar temayı kendileri çözdüğü için bileşen CSS'inde tema koşulu bulunmaz;
 * tek yapılan <html data-theme="..."> özniteliğini ayarlamaktır. Tercih, kullanıcı
 * profilindeki settings.darkMode alanında saklanır (alan adı Firestore ile uyumlu
 * kalsın diye korunmuştur).
 */
import { useAuthStore } from '../store/useAuthStore';

export type Tema = 'gece' | 'kagit';

export function temaUygula(tema: Tema) {
  document.documentElement.setAttribute('data-theme', tema);
}

export function useTema(): Tema {
  return useAuthStore((state) => ((state.user?.settings.darkMode ?? true) ? 'gece' : 'kagit'));
}

/**
 * Logo dosyaları renklerini devralmaz; her temanın kendi mürekkebi vardır.
 * "-acik" sürümleri koyu zemin içindir.
 */
export function logoYolu(tema: Tema, cesit: 'yatay' | 'dikey' | 'amblem'): string {
  return `/logo/flagquest-${cesit}${tema === 'gece' ? '-acik' : ''}.svg`;
}
