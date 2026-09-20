import { execFileSync } from 'node:child_process';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Yayındaki kabuğun hangi derlemeden geldiğini anlamanın tek yolu, derlemenin
// kendi kimliğini taşımasıdır. `derleme` her derlemede benzersizdir ve sürüm
// kayması denetiminin karşılaştırdığı alan odur; `kod` yalnız insan okuması için.
function surumBilgisi() {
  let kod = 'yerel';
  try {
    kod = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    // Git yoksa (AI Studio derlemesi, arşivden çıkarılmış kopya) kod 'yerel' kalır.
  }
  return { kod, derleme: new Date().toISOString() };
}

const SURUM = surumBilgisi();

// `surum.json` sabit URL'den, önbelleğe alınmadan servis edilir; uygulama açılışta
// bunu okuyup kendi gömülü sürümüyle karşılaştırır. Servis çalışanının ön belleğine
// GİRMEMESİ şarttır (workbox globIgnores), yoksa denetim eski değeri okur.
function surumDosyasi(): Plugin {
  return {
    name: 'fq-surum-dosyasi',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'surum.json',
        source: `${JSON.stringify(SURUM, null, 2)}\n`,
      });
    },
  };
}

export default defineConfig(() => {
  return {
    define: {
      __FQ_SURUM__: JSON.stringify(SURUM),
    },
    plugins: [
      react(), 
      tailwindcss(),
      surumDosyasi(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: false
        },
        manifest: {
          name: 'FlagQuest - Bayrak Bilgi Yarışması',
          short_name: 'FlagQuest',
          description: 'Eğlenceli, öğretici ve rekabetçi bir bayrak bilgi yarışması.',
          theme_color: '#0a1524',
          background_color: '#0a1524',
          display: 'standalone',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
          // Sürüm damgası önbelleğe alınırsa kayma denetimi kör kalır.
          globIgnores: ['surum.json'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/flagcdn\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'flag-images',
                expiration: {
                  maxEntries: 300,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
