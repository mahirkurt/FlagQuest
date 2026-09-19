/**
 * Tasarım sistemi önizleme sayfalarını (onizleme/*.png) yeniden üretir.
 *
 * Bileşen önizlemeleri (components/<Ad>/preview.html) global `React`,
 * `ReactDOM` ve `window.FlagQuest` bekler. Bu betik React'i node_modules'tan
 * esbuild ile paketleyip bu globalleri kurar, her önizlemeyi başsız Chromium'da
 * kendi çerçevesiyle açar, gerçek içerik yüksekliğinde çeker ve kartları iki
 * sütunlu sayfada birleştirip iki temada kontrol sayfası üretir.
 *
 * Üretilenler: onizleme/bilesenler-gece.png, bilesenler-kagit.png,
 *              kapak-gece.png, kapak-kagit.png
 *
 * Kullanım: node scripts/onizleme-uret.mjs
 * Tarayıcıyı CHROME_PATH ile değiştirebilirsiniz.
 */
import { execFileSync, spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const KOK = path.resolve('flagquest-tasarim-sistemi');
const BILESEN = path.join(KOK, 'components');
const HEDEF = path.join(KOK, 'onizleme');
const gecici = fs.mkdtempSync(path.join(os.tmpdir(), 'flagquest-onizleme-'));

const KART_GENISLIK = 600;
const KAPAK_ADI = 'Cover';
const KAPAK_GENISLIK = 960;
const CDP_PORT = 9333;

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
const dosyaUrl = (p) => `file://${p}`;

function chromeBul() {
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
  ].filter(Boolean);
  const bulunan = adaylar.find((p) => fs.existsSync(p));
  if (!bulunan) throw new Error('Chromium bulunamadı. CHROME_PATH ile bir tarayıcı verin.');
  return bulunan;
}

/**
 * React ve ReactDOM'u global yapan köprüyü paketler.
 *
 * Önizlemeler React'i global olarak bekler; CDN'e çıkmak yerine depodaki sürüm
 * paketlenir (kullanılan tek API createElement + createRoot, ikisi de yerinde
 * durur). Giriş dosyası node_modules altına yazılır ki esbuild bağımlılıkları
 * normal yoldan çözebilsin; NODE_ENV tanımlanmazsa React tarayıcıda
 * `process is not defined` ile düşer.
 */
function reactKoprusu() {
  const calisma = path.resolve('node_modules/.flagquest-onizleme');
  fs.mkdirSync(calisma, { recursive: true });
  const giris = path.join(calisma, 'kopru-giris.js');
  const cikti = path.join(gecici, 'kopru.js');

  fs.writeFileSync(
    giris,
    `import * as React from 'react';\n` +
      `import * as ReactDOM from 'react-dom/client';\n` +
      `window.React = React;\nwindow.ReactDOM = ReactDOM;\n`
  );
  execFileSync(
    path.resolve('node_modules/.bin/esbuild'),
    [giris, '--bundle', '--format=iife', '--define:process.env.NODE_ENV="production"', `--outfile=${cikti}`],
    { stdio: ['ignore', 'ignore', 'inherit'] }
  );
  fs.rmSync(calisma, { recursive: true, force: true });
  return cikti;
}

/** Bir bileşen önizlemesini kendi çerçevesiyle geçici bir sayfaya yazar. */
function onizlemeSayfasi(ad, tema, kopru) {
  const kaynak = fs.readFileSync(path.join(BILESEN, ad, 'preview.html'), 'utf8');
  // Önizlemeler tasarım sistemi köküne göreli yol kullanır; geçici klasörden
  // çalışabilmesi için mutlak dosya URL'sine çevrilir.
  const govde = kaynak.replace(/\.\.\/\.\.\/assets\//g, dosyaUrl(path.join(KOK, 'assets')) + '/');

  const sayfa = path.join(gecici, `${ad}-${tema}.html`);
  fs.writeFileSync(
    sayfa,
    `<!doctype html><html data-theme="${tema}"><head><meta charset="utf-8">` +
      `<link rel="stylesheet" href="${dosyaUrl(path.join(KOK, 'tokens.css'))}">` +
      `<link rel="stylesheet" href="${dosyaUrl(path.join(BILESEN, 'bundle.css'))}">` +
      `<script src="${dosyaUrl(kopru)}"></script>` +
      `<script src="${dosyaUrl(path.join(BILESEN, 'bundle.js'))}"></script>` +
      `</head><body>${govde}</body></html>`
  );
  return sayfa;
}

/** preview.html'in ilk satırındaki @dsCard alt başlığını okur. */
function altBaslik(ad) {
  const ilkSatir = fs.readFileSync(path.join(BILESEN, ad, 'preview.html'), 'utf8').split('\n')[0];
  return (ilkSatir.match(/subtitle="([^"]*)"/) || [])[1] || '';
}

// ---- CDP sürücüsü ----------------------------------------------------------

async function tarayiciAc(chrome) {
  const kabuk = path.basename(chrome) === 'headless_shell';
  const surec = spawn(
    chrome,
    [
      ...(kabuk ? [] : ['--headless']),
      `--remote-debugging-port=${CDP_PORT}`,
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      '--window-size=1200,900',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  for (let i = 0; i < 60; i++) {
    try {
      const liste = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
      const sayfa = liste.find((t) => t.type === 'page');
      if (sayfa?.webSocketDebuggerUrl) {
        const ws = new WebSocket(sayfa.webSocketDebuggerUrl);
        await new Promise((r) => (ws.onopen = r));
        return { surec, ws };
      }
    } catch {
      /* tarayıcı henüz hazır değil */
    }
    await bekle(250);
  }
  surec.kill();
  throw new Error('CDP hedefi bulunamadı.');
}

function komutcu(ws) {
  let sayac = 0;
  const bekleyen = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && bekleyen.has(m.id)) {
      bekleyen.get(m.id)(m.result);
      bekleyen.delete(m.id);
    }
  };
  return (method, params = {}) =>
    new Promise((res) => {
      const id = ++sayac;
      bekleyen.set(id, res);
      ws.send(JSON.stringify({ id, method, params }));
    });
}

/** Sayfayı açar, yazı tiplerini bekler ve tam içerik yüksekliğinde çeker. */
async function sayfaCek(gonder, url, genislik, cikti) {
  await gonder('Emulation.setDeviceMetricsOverride', {
    width: genislik,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await gonder('Page.navigate', { url });
  await bekle(600);
  await gonder('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
  await bekle(250);

  // scrollHeight görünüm yüksekliğine takılır (html/body esner), bu yüzden
  // gerçek içerik sınırı gövde çocuklarının en alt kenarından okunur.
  const { result } = await gonder('Runtime.evaluate', {
    expression: `(() => {
      const alt = [...document.body.children]
        .map((el) => el.getBoundingClientRect().bottom)
        .filter((n) => Number.isFinite(n));
      const dolgu = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
      return Math.ceil(Math.max(0, ...alt) + dolgu);
    })()`,
    returnByValue: true,
  });
  const yukseklik = Math.max(40, result.value || 300);

  const { data } = await gonder('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: genislik, height: yukseklik, scale: 1 },
  });
  fs.writeFileSync(cikti, Buffer.from(data, 'base64'));
  return yukseklik;
}

// ---- Ana akış --------------------------------------------------------------

const chrome = chromeBul();
const kopru = reactKoprusu();
const { surec, ws } = await tarayiciAc(chrome);
const gonder = komutcu(ws);

await gonder('Page.enable');
await gonder('Runtime.enable');

const bilesenler = fs
  .readdirSync(BILESEN, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(BILESEN, d.name, 'preview.html')))
  .map((d) => d.name)
  .sort();

fs.mkdirSync(HEDEF, { recursive: true });

for (const tema of ['gece', 'kagit']) {
  const kartlar = [];

  for (const ad of bilesenler) {
    const kapakMi = ad === KAPAK_ADI;
    const genislik = kapakMi ? KAPAK_GENISLIK : KART_GENISLIK;
    const png = path.join(gecici, `${ad}-${tema}.png`);

    const yukseklik = await sayfaCek(gonder, dosyaUrl(onizlemeSayfasi(ad, tema, kopru)), genislik, png);
    kartlar.push({ ad, altBaslik: altBaslik(ad), png, genislik, yukseklik });

    // Kapak ayrıca kendi kontrol sayfası olarak saklanır.
    if (kapakMi) fs.copyFileSync(png, path.join(HEDEF, `kapak-${tema}.png`));
  }

  const sayfaYolu = path.join(gecici, `sayfa-${tema}.html`);
  fs.writeFileSync(
    sayfaYolu,
    `<!doctype html><html data-theme="${tema}"><head><meta charset="utf-8">` +
      `<link rel="stylesheet" href="${dosyaUrl(path.join(KOK, 'tokens.css'))}">` +
      `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400..700&display=swap">` +
      `<style>` +
      `html,body{margin:0;background:var(--zemin-gomuk);font-family:var(--font-govde)}` +
      `.izgara{display:grid;grid-template-columns:repeat(2,${KART_GENISLIK}px);gap:28px;padding:28px;align-items:start}` +
      `.kart{display:flex;flex-direction:column;gap:6px}` +
      `.ad{font-size:12.5px;font-weight:700;color:var(--metin)}` +
      `.alt{font-size:11px;color:var(--metin-silik);margin-top:-3px}` +
      `img{display:block;width:${KART_GENISLIK}px;height:auto;border:1px solid var(--cizgi);border-radius:var(--yaricap-lg)}` +
      `</style></head><body><div class="izgara">` +
      kartlar
        .map(
          (k) =>
            `<div class="kart"><span class="ad">${k.ad}</span>` +
            (k.altBaslik ? `<span class="alt">${k.altBaslik}</span>` : '') +
            `<img src="${dosyaUrl(k.png)}"></div>`
        )
        .join('') +
      `</div></body></html>`
  );

  await sayfaCek(gonder, dosyaUrl(sayfaYolu), KART_GENISLIK * 2 + 84, path.join(HEDEF, `bilesenler-${tema}.png`));
  console.log(`bilesenler-${tema}.png · kapak-${tema}.png`);
}

ws.close();
surec.kill();
fs.rmSync(gecici, { recursive: true, force: true });
