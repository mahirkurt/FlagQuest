/**
 * Generates the PWA icon set from the official design-system logo files.
 *
 * The brand book forbids redrawing the mark ("Amblem ve kelime markası yeniden
 * düzenlenmez"), so the icons are rasterized from the SVG sources in
 * flagquest-tasarim-sistemi/assets/Logo rather than hand-drawn. Rasterization
 * uses a headless Chromium binary, which keeps this out of package.json.
 *
 * Usage: node scripts/generate-icons.mjs
 * Override the browser with CHROME_PATH=/path/to/chrome.
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const KAYNAK = path.resolve('flagquest-tasarim-sistemi/assets/Logo');
const HEDEF = path.resolve('public');

const ISLER = [
  { svg: 'flagquest-app-ikon.svg', cikti: 'pwa-192x192.png', boyut: 192 },
  { svg: 'flagquest-app-ikon.svg', cikti: 'pwa-512x512.png', boyut: 512 },
  { svg: 'flagquest-favicon.svg', cikti: 'favicon.ico', boyut: 32 },
];

function chromeBul() {
  // headless_shell has no window chrome, so --window-size maps 1:1 onto the
  // captured viewport. Full Chromium reserves ~57px for the window frame and
  // would crop the icon, so it is only a fallback.
  const kokler = process.env.PLAYWRIGHT_BROWSERS_PATH
    ? fs.readdirSync(process.env.PLAYWRIGHT_BROWSERS_PATH).map((d) =>
        path.join(process.env.PLAYWRIGHT_BROWSERS_PATH, d, 'chrome-linux')
      )
    : [];

  const adaylar = [
    process.env.CHROME_PATH,
    ...kokler.map((k) => path.join(k, 'headless_shell')),
    ...kokler.map((k) => path.join(k, 'chrome')),
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);

  const bulunan = adaylar.find((p) => fs.existsSync(p));
  if (!bulunan) {
    throw new Error(
      'Chromium bulunamadı. CHROME_PATH ile bir tarayıcı ikili dosyası verin ' +
        've scripts/generate-icons.mjs dosyasını yeniden çalıştırın.'
    );
  }
  return bulunan;
}

function rasterle(chrome, svgYolu, boyut, ciktiYolu) {
  const gecici = fs.mkdtempSync(path.join(os.tmpdir(), 'flagquest-ikon-'));
  const sayfa = path.join(gecici, 'ikon.html');
  fs.writeFileSync(
    sayfa,
    `<!doctype html><meta charset="utf-8">` +
      `<style>html,body{margin:0;padding:0;background:transparent}img{display:block}</style>` +
      `<img src="${svgYolu}" width="${boyut}" height="${boyut}">`
  );

  const kabuk = path.basename(chrome) === 'headless_shell';

  execFileSync(
    chrome,
    [
      ...(kabuk ? [] : ['--headless']),
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--default-background-color=00000000',
      `--screenshot=${ciktiYolu}`,
      `--window-size=${boyut},${boyut}`,
      sayfa,
    ],
    { stdio: 'ignore' }
  );

  fs.rmSync(gecici, { recursive: true, force: true });
}

const chrome = chromeBul();
fs.mkdirSync(HEDEF, { recursive: true });

for (const is of ISLER) {
  const svgYolu = path.join(KAYNAK, is.svg);
  if (!fs.existsSync(svgYolu)) {
    throw new Error(`Kaynak logo bulunamadı: ${svgYolu}`);
  }
  const ciktiYolu = path.join(HEDEF, is.cikti);
  rasterle(chrome, svgYolu, is.boyut, ciktiYolu);
  console.log(`${is.cikti} (${is.boyut}px) ← ${is.svg}`);
}

// favicon.svg doğrudan kopyalanır: vektör sürüm her boyutta okunur.
fs.copyFileSync(path.join(KAYNAK, 'flagquest-favicon.svg'), path.join(HEDEF, 'favicon.svg'));
console.log('favicon.svg ← flagquest-favicon.svg');
