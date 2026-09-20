import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { surumDenetle } from './lib/surum';
import './index.css';

// Servis çalışanı kendini otomatik günceller (registerType: 'autoUpdate').
// Ancak tarayıcı yeni `sw.js`'i yalnızca sayfa yüklenirken yoklar; uzun süre
// açık kalan bir sekme yeni dağıtımı hiç görmez. Bu yüzden kayıt saatte bir
// elle yoklanır: yeni sürüm varsa Workbox skipWaiting + clientsClaim ile devralır
// ve index.html'deki controllerchange dinleyicisi sayfayı bir kez yeniler.
const GUNCELLEME_ARALIGI_MS = 60 * 60 * 1000;

const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return;
    setInterval(() => {
      void registration.update();
    }, GUNCELLEME_ARALIGI_MS);
  },
  onNeedRefresh() {
    // autoUpdate kipinde normalde çağrılmaz; yine de bekleyen sürümü hemen devral.
    void updateSW(true);
  },
});

// Servis çalışanı eski kabuğu servis ediyorsa bunu açılışta yakala ve bir kez onar.
void surumDenetle();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
