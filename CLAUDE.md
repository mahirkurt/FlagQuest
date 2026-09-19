# CLAUDE.md

Bu dosya, bu depoda çalışan Claude Code örnekleri için yönlendirmedir. Kod tabanı ve
arayüzün tamamı Türkçedir; kod içi yorumlar hem Türkçe hem İngilizce bulunur — yeni
yazarken çevredeki dosyanın diline uy.

## Proje ne

FlagQuest, 195 BM üyesi ülkenin bayrak ve coğrafyasını oyunlaştıran, Türkçe arayüzlü,
mobil öncelikli bir PWA'dır. Tek sayfa uygulaması (SPA); sunucu tarafı kod yoktur,
kalıcı veri Firebase (Auth + Firestore) ve tarayıcı `localStorage` üzerinde tutulur.

Yığın: React 19 · Vite 6 · Tailwind CSS v4 (`@tailwindcss/vite`) · Zustand 5 ·
Firebase 12 · react-router-dom 7 · lucide-react · vite-plugin-pwa.

Proje Google AI Studio applet şablonundan üretilmiştir; `package.json` içindeki
`"name": "react-example"` ve `index.html`'deki HMR/service-worker hata yutucu betik
bu mirastan gelir. İkisini de gerekçesiz değiştirme.

## Komutlar

```bash
bun install          # bun.lock mevcut; npm install de çalışır (package-lock.json da var)
npm run dev          # vite, port 3000, host 0.0.0.0
npm run lint         # tsc --noEmit — depodaki TEK otomatik kontrol, temiz geçmeli
npm run build        # vite build → dist/ (+ sw.js, manifest.webmanifest)
npm run preview      # üretim çıktısını yerelde servis eder
npm run clean        # rm -rf dist server.js
node scripts/generate-icons.mjs   # PWA ikonlarını resmî logo SVG'lerinden yeniden üretir
```

Test altyapısı, ESLint ve Prettier **yoktur**. Değişiklikten sonra en azından
`npm run lint` ve `npm run build` çalıştır. Test yazman istenirse önce altyapı
kurulması gerektiğini belirt.

`npm run deploy` gerçek bir dağıtım yapmaz; AI Studio arayüzüne yönlendiren bir mesaj
basar. Gerçek dağıtım Firebase Hosting üzerinden `dist/` klasöründendir (`firebase.json`,
proje `gen-lang-client-0521782135`).

`DISABLE_HMR=true` ortam değişkeni HMR'ı ve dosya izlemeyi kapatır (ajan düzenlemeleri
sırasında titremeyi önlemek için). `vite.config.ts` içindeki bu bloğa dokunma.

## Tasarım sistemi — ÖNCE BUNU OKU

Uygulamanın görsel dili `flagquest-tasarim-sistemi/` altındaki tasarım sisteminden
gelir ve **uygulamaya tam olarak bağlanmıştır**. Marka kitabı
`flagquest-tasarim-sistemi/README.md` dosyasıdır; görsel bir değişiklik yapmadan önce
oradaki kuralları oku. Sistemin metaforu tektir: *oyuncu bir dünya pasaportu taşır,
doğru bildiği her ülke o pasaporta damga olarak mühürlenir.*

### Nasıl bağlı

| Uygulamadaki dosya | Kaynağı | Ne yapar |
| --- | --- | --- |
| `src/tokens.css` | `flagquest-tasarim-sistemi/tokens.css` | Renk, tipografi, boşluk token'ları ve tip stili sınıfları |
| `src/ds.css` | `flagquest-tasarim-sistemi/components/bundle.css` | Bileşen stil tabakası (`fq-btn`, `fq-mod`, `fq-sik` …) |
| `src/index.css` | — | İkisini içe aktarır ve `@theme inline` ile Tailwind'e bağlar |
| `src/components/ds/` | `flagquest-tasarim-sistemi/components/index.d.ts` | 10 bileşenin React karşılığı |
| `public/logo/` | `flagquest-tasarim-sistemi/assets/Logo/` | Yatay, dikey ve amblem logo dosyaları |

`src/tokens.css` ve `src/ds.css` **türetilmiş dosyalardır**: elle düzenlenmez. Sistem
güncellenirse `flagquest-tasarim-sistemi/` içinden yeniden kopyalanır.

`src/components/ds/` altındaki bileşenler `bundle.js`'in React'e taşınmış hâlidir; DOM
yapısı ve sınıf adları `bundle.css` ile birebir aynıdır, prop sözleşmesi `index.d.ts`
ile aynıdır. Yeni bir prop eklemeden önce bileşenin kendi
`flagquest-tasarim-sistemi/components/<Ad>/README.md` dosyasını oku — orada "yapma"
listesi vardır.

### Bozulmaması gereken kurallar

Bunlar marka kitabının "Kurallar" bölümüdür ve kod incelemesinde aranır:

- **Ham Tailwind paleti kullanılmaz.** `slate-*`, `indigo-*`, `purple-*`, `emerald-*`,
  `rose-*` ve benzerleri kaldırılmıştır. Renk yalnızca token adlarıyla gelir:
  `bg-zemin`, `bg-zemin-yukseltilmis`, `text-metin`, `text-metin-yumusak`,
  `border-cizgi`, `text-altin`, `text-damga`, `text-vize` …
- **Tema `dark:` varyantıyla değil `data-theme` ile çözülür.** `<html data-theme="gece">`
  varsayılandır, `kagit` ikinci temadır; token'lar temayı kendileri çözer, bu yüzden
  bileşen CSS'inde tema koşulu bulunmaz. Tema tercihi `user.settings.darkMode`
  alanında saklanır (Firestore şeması korunsun diye alan adı değiştirilmedi) ve
  `src/lib/tema.ts` bunu `gece`/`kagit`'e çevirir. `index.html`'deki küçük betik ilk
  boyamadan önce temayı `localStorage`'dan okur.
- **Arayüzde emoji kullanılmaz.** Rozet, mod ve görev ikonları `lucide-react`
  düğümleridir. Bu yüzden `lib/badges.ts` ikon bileşeni taşır ve `useQuestStore`
  görev nesnesinde ikon tutmaz — eşleme `DailyQuestsModal` içindedir.
- **Bir ekranda tek `birincil` buton bulunur.** Diğer eylemler `ikincil` veya
  `hayalet`tir; `tehlike` yalnızca geri alınamayan işlemler içindir ve onaysız
  kullanılmaz (bkz. `MistakeVault`'taki iki adımlı boşaltma).
- **Durum bildirimi hiçbir zaman yalnız renkle yapılmaz.** Doğru `vize`, yanlış
  `damga`; ikisi de ikon **ve** sözcük taşır. `SikButonu` bunu kendisi yapar.
- **Mod rengi durum bildiriminde, durum rengi mod kimliğinde kullanılmaz.** Mod →
  renk/ikon eşlemesinin tek kaynağı `src/lib/modlar.ts`'tir.
- **Bayrak görseli hiçbir efektle değiştirilmez** (yalnız Dedektif modunun
  `bulanik1`/`bulanik2` kademeleri istisnadır ve her kademe ekranda sözcükle de
  belirtilir). Soru sorulurken `BayrakKarti`'nın `alt` metni **boş bırakılır**, yoksa
  cevap ekran okuyucuya sızar.
- **Odak halkası kaldırılmaz** (`:focus-visible`, `src/index.css` temel katmanında).
- **Logo yeniden çizilmez veya yeniden düzenlenmez.** `scripts/generate-icons.mjs` bu
  yüzden ikonları elle çizmek yerine resmî SVG'leri başsız Chromium ile
  rasterleştirir; Chromium yoksa `CHROME_PATH` ile verilir.
- **Sayılar Türkçe biçimdedir** (ondalık virgül, binlik nokta, `42 sn`). Biçimlendirme
  `src/lib/bicim.ts` üzerinden yapılır: `sayi`, `yuzde`, `sure`, `sureMs`, `ulkeKodu`.
  Ülke kodu arayüzde daima BÜYÜK HARF gösterilir.
- **Hareketin üç kalıbı vardır, dördüncüsü yoktur:** basılma (`:active`, bileşen
  CSS'inde), açılma (`.acilma` sınıfı, `src/index.css`), ilerleme (`width`, 500 ms).
  `prefers-reduced-motion` altında süreler sıfırlanır. Animasyon kütüphanesi
  kullanılmaz — `framer-motion` artık hiçbir yerden import edilmiyor.

## Mimari

```
src/
  main.tsx                 giriş; registerSW ile PWA kaydı
  App.tsx                  BrowserRouter, ProtectedRoute, tema ve auth köprüsü
  index.css                tailwind + tokens.css + ds.css + @theme eşlemesi
  tokens.css / ds.css      tasarım sisteminden kopyalanır, elle düzenlenmez
  components/ds/           tasarım sistemi bileşenleri (10 adet + tipler)
  components/              uygulamaya özel paylaşılan bileşenler
  data/countries.ts        195 ülke (kod, ad, başkent, bölge, funFact) + getFlagUrl()
  lib/                     firebase, audio, tema, bicim, kitalar, modlar, badges, utils
  pages/                   rota bileşenleri
  services/                countries.ts üzerine salt-okunur sorgu katmanı
  store/                   Zustand mağazaları — iş kurallarının tamamı burada
```

**Kural: oyun mantığı mağazalarda, görsel mantık sayfalarda.** Puanlama, seri/çarpan,
joker, damga ve görev ilerlemesi `src/store/` altındadır; sayfalar mağaza eylemlerini
çağırıp durumu okur. Yeni bir oyun kuralı eklerken bunu sayfaya değil mağazaya yaz.

Rotalar: `/login` (korumasız), `/` altında `Layout` içinde `index`, `game`, `passport`,
`mistakes`, `multiplayer`, `countries`, `leaderboard`, `profile`. `ProtectedRoute`
yalnızca `useAuthStore.user` varlığına bakar. Alt navigasyonun beş hedefi sabittir ve
oyun ekranında (`/game`) gizlenir.

### Mağazalar ve kalıcılık

| Mağaza | `persist` anahtarı | Ne tutar |
| --- | --- | --- |
| `useAuthStore` | `flagquest-auth-storage` | `user` profili (XP, seviye, istatistik, ayarlar, rozetler) |
| `usePassportStore` | `passport-storage` | Ülke damgaları |
| `useMistakeStore` | `mistakes-vault-storage` | Yanlış bilinen ülkeler ve sayaçları |
| `useQuestStore` | `daily-quests-storage` | Günün görevleri + tarih damgası |
| `useSettingsStore` | `settings-storage` | `soundEnabled` |
| `useGameStore` | — (kalıcı değil) | Aktif tek oyunculu tur |
| `useBadgeStore` | — (kalıcı değil) | Rozet bildirimi kuyruğu |

Kalıcı bir mağazanın şemasını değiştirirsen eski `localStorage` kayıtları migrasyonsuz
okunur; kırılgan alanlara varsayılan ver veya `persist` `version`/`migrate` ekle.

Mağazalar birbirini doğrudan `getState()` ile çağırır (`useGameStore.answerQuestion`
içinden passport, mistake, quest ve badge mağazaları). Bu kasıtlıdır; React hook'u
olmayan yerlerden çağrılabilmesi için gereklidir.

### Kıtalar

`data/countries.ts` ham bölge alanında altı değer kullanır: `Avrupa`, `Asya`, `Afrika`,
`Kuzey Amerika`, `Güney Amerika`, `Okyanusya` ve bir kez `Avrupa/Asya` (Türkiye).
Arayüz ise beş kıta konuşur. Eşleme **yalnızca** `src/lib/kitalar.ts` içindedir:
Dünya Turu havuzu, pasaport kıta istatistikleri ve ansiklopedi filtresi hepsi bunu
kullanır. Her ülke tek bir kıtaya sayılır, toplamlar 195'e tamamlanır; Türkiye
Avrupa'ya sayılır ama ülke kartında ham bölge metni (`Avrupa/Asya`) gösterilir.
Bölgeye göre filtreleme yazarken düz metin karşılaştırması yapma, `ulkeKitasi()` veya
`kitaUlkeleri()` kullan.

### Oyun modları (`useGameStore` + `src/lib/modlar.ts`)

| Mod | Renk | Soru | Taban puan | Özellik |
| --- | --- | --- | --- | --- |
| `classic` | altin | 10 | 10 | Temel akış |
| `time_attack` | meridyen | 30 havuz | 15 | 60 sn; doğru +3 sn, yanlış −2 sn, tavan 99 sn |
| `reverse` | vize | 10 | 10 | Ülke adı verilir, bayrak seçilir |
| `detective` | erguvan | 8 | 30 / 20 / 10 | Bayrak kademeli netleşir |
| `world_tour` | bozkir | 6 | 10 | Kıtaya göre filtreli |
| `mistake_vault` | altin | ≤10 | 10 | Doğru bilinen kumbaradan silinir |
| `daily` | altin | 5 | 10 | Tarihe göre tohumlanmış 20'lik havuzdan |

Ana sayfada ayrıca iki yüzey vardır: `duello` (damga) ve `ansiklopedi` (meridyen).
Seri çarpanı: 3+ → 1,5× · 5+ → 2,0× · 8+ → 3,0×. Puan `Math.round(taban × çarpan)`.

### Çok oyunculu (`useMultiplayerStore` + `pages/Multiplayer.tsx`)

Firestore `games/{6 haneli oda kodu}` dokümanı tek gerçeklik kaynağıdır; her istemci
`onSnapshot` ile dinler. Durum akışı: `waiting` → `started` → `spinning` (çarkıfelek) →
`completed`. Yazmalar `updateDoc` ve alan yolu (`players.${uid}.score`) ile atomiktir;
puanlar `increment()` kullanır.

`normalizeGameData()` her snapshot'ı savunmacı biçimde normalize eder (eski `playing`
durumunu `started`'a çevirir, eksik alanlara varsayılan verir). Doküman şemasını
değiştirirsen bu fonksiyonu da güncelle — sayfa doğrudan ham veriye güvenmez.

Doğru cevapta %25 olasılıkla "kaos olayı" (`steal` / `boost` / `tax`) tetiklenir ve
`recentEvents` dizisine yazılır. Jokerler: `fiftyFifty`, `peek`, `double`.

### Firebase

`src/lib/firebase.ts` yapılandırmayı `firebase-applet-config.json`'dan okur ve
**adlandırılmış** bir Firestore veritabanına bağlanır (`firestoreDatabaseId`).
`experimentalForceLongPolling: true` kasıtlıdır: sandbox/iframe ve ters vekil
ortamlarında WebChannel akışı asılı kaldığı için gereklidir. Kaldırma.

Koleksiyonlar: `users/{uid}`, `games/{roomId}`, `leaderboard/{uid}`, `test/connection`.
Yayındaki kurallar `firestore.rules` dosyasındadır. `firebase-blueprint.json` yalnızca
AI Studio applet tanımıdır ve `games` için daha sıkı kurallar önerir; **bunu olduğu gibi
uygulamaya alma** — `joinRoom()` odaya katılmadan önce `getDoc` yaptığı için
`playerIds` koşullu okuma kuralı katılmayı kırar.

Firestore yazmaları her yerde `try/catch` içinde ve hata `console.warn` ile yutulur;
uygulama çevrimdışı ve misafir kipinde çalışmaya devam eder. Bu bilinçli bir tercihtir;
"sessiz hata" diye kaldırma, ama yeni bir yazma eklerken aynı deseni sürdür.

### Misafir kipi

`Login` sayfasındaki "Misafir olarak gir", `uid` değeri `guest_` ile başlayan bir
yerel profil üretir. Firebase Auth oturumu **yoktur**. Kod her bulut yazmasından önce
`auth.currentUser && !user.uid.startsWith('guest_')` kontrolü yapar. Yeni bir bulut
senkronizasyonu eklerken bu iki koşulu birlikte kontrol et.

Sonuç olarak misafirler liderlik tablosuna yazamaz ve çok oyunculu odalara pratikte
katılamaz (kurallar `request.auth != null` ister). Bu artık arayüzde de yazılıdır
(Liderlik ve Düello ekranlarındaki not satırları).

## Dış bağımlılıklar ve yerel geliştirme

- Bayrak görselleri `getFlagUrl(code)` ile `flagcdn.com/w320/{kod}.png` adresinden
  gelir ve Workbox `CacheFirst` ile 30 gün önbelleklenir (`vite.config.ts`). Ağ erişimi
  kısıtlı bir ortamda (ör. ajan sandbox'ı) bayraklar yüklenmez ve `alt` metni görünür;
  bu bir kod hatası değildir.
- Yazı tipleri Google Fonts'tan gelir (`index.html`): Bricolage Grotesque (başlık),
  Figtree (gövde), IBM Plex Mono (belge). Pakette font dosyası taşınmaz.
- Ses, dosya değil Web Audio API osilatörüdür (`src/lib/audio.ts`); her çağrı
  `useSettingsStore.soundEnabled` kontrol eder.

## Bilinen tuzaklar

1. **Günün Soruları tam deterministik değildir.** `getDailyQuestions()` tarihten
   türetilmiş bir sıralamayla 20'lik havuz kurar, ama sonra `generateQuestionSet` bu
   havuzdan 5 soruyu rastgele seçer. Aynı gün tekrar oynayan oyuncu farklı sorular görür.
2. **Karıştırma `sort(() => 0.5 - Math.random())` ile yapılır** (`useGameStore`,
   `useMultiplayerStore`). İstatistiksel olarak yanlıdır; karıştırmaya dokunuyorsan
   Fisher–Yates'e geçir.
3. **Kullanılmayan bağımlılıklar:** `@google/genai`, `express`, `dotenv`, `date-fns`,
   `motion` ve artık `framer-motion` (ve `@types/express`, `tsx`, `esbuild`).
   `metadata.json` hâlâ `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` ilan eder ama kodda
   hiçbir Gemini çağrısı yoktur. Silmeden önce AI Studio dağıtımını bozup bozmadığını sor.
4. **`testFirestoreConnection()`** dışa aktarılmış ama hiçbir yerden çağrılmıyor.
5. **İki kilit dosyası birlikte tutuluyor:** `bun.lock` ve `package-lock.json`. Bağımlılık
   eklerken hangisiyle çalıştığını söyle; ikisini birden güncellemek istemiyorsan
   diğerini kirletme.
6. `useGameStore.useHint()` `hintStage >= 2` ile sınırlıdır, oysa tip yorumu 0–3 aralığı
   tanımlar; üçüncü ipucu kademesi erişilemez durumdadır.
7. **`firebase-applet-config.json` depoda açıkta durur.** Firebase web istemci
   yapılandırması gizli değildir (güvenlik kurallarla sağlanır), ama buraya yeni bir
   gerçek sır ekleme — sırlar `.env` üzerinden gelir ve `.gitignore` `.env*` dosyalarını
   hariç tutar.
8. **Damga mühürlenme darbesi uygulanmamıştır.** `Damga` bileşeninin README'si yeni
   kazanılan damga için 0,3 sn'lik bir ölçek darbesi ister; bunun için "hangi damga az
   önce kazanıldı" bilgisinin pasaport mağazasından arayüze taşınması gerekir.

## Dal ve katkı akışı

Varsayılan dal `main`. Uzak: `https://github.com/mahirkurt/FlagQuest`. Bu oturumda
geliştirme `claude/friendly-franklin-4de4mo` dalında yapılır; `main`'e doğrudan itme.
İtişten sonra taslak (draft) PR aç.
