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

// Logo varlıkları için bkz. lib/logo.ts — dosyalar tasarım sisteminden içe aktarılır.
