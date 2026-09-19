# CLAUDE.md

Bu dosya, bu depoda çalışan Claude Code örnekleri için yönlendirmedir. Kod tabanı ve
arayüzün tamamı Türkçedir; kod içi yorumlar İngilizce yazılmıştır. Bu ayrımı koru.

## Proje ne

FlagQuest, 195 BM üyesi ülkenin bayrak ve coğrafyasını oyunlaştıran, Türkçe arayüzlü,
mobil öncelikli bir PWA'dır. Tek sayfa uygulaması (SPA); sunucu tarafı kod yoktur,
kalıcı veri Firebase (Auth + Firestore) ve tarayıcı `localStorage` üzerinde tutulur.

Yığın: React 19 · Vite 6 · Tailwind CSS v4 (`@tailwindcss/vite`) · Zustand 5 ·
Firebase 12 · react-router-dom 7 · framer-motion · lucide-react · vite-plugin-pwa.

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
node scripts/generate-icons.mjs   # public/ altındaki PWA ikonlarını ve favicon'u yeniden üretir
```

Doğrulanmış durum (19.09.2026): `npm run lint` hatasız geçer, `npm run build` başarılı
(ana paket ~1,3 MB, tek yığın — 500 kB uyarısı beklenen davranıştır, kod bölme yapılmamıştır).

Test altyapısı, ESLint ve Prettier **yoktur**. Değişiklikten sonra en azından
`npm run lint` ve `npm run build` çalıştır. Test yazman istenirse önce altyapı kurulması
gerektiğini belirt.

`npm run deploy` gerçek bir dağıtım yapmaz; AI Studio arayüzüne yönlendiren bir mesaj
basar. Gerçek dağıtım Firebase Hosting üzerinden `dist/` klasöründendir (`firebase.json`,
proje `gen-lang-client-0521782135`).

`DISABLE_HMR=true` ortam değişkeni HMR'ı ve dosya izlemeyi kapatır (ajan düzenlemeleri
sırasında titremeyi önlemek için). `vite.config.ts` içindeki bu bloğa dokunma.

## Mimari

```
src/
  main.tsx                 giriş; registerSW ile PWA kaydı
  App.tsx                  BrowserRouter, ProtectedRoute, onAuthStateChanged köprüsü
  index.css                yalnızca @import "tailwindcss"
  data/countries.ts        195 ülke (kod, ad, başkent, kıta, funFact) + getFlagUrl()
  services/                countries.ts üzerine salt-okunur sorgu katmanı
  store/                   Zustand mağazaları — iş kurallarının tamamı burada
  pages/                   rota bileşenleri
  components/              paylaşılan bileşenler
  lib/                     firebase, audio, badges, utils (cn), firestoreError
```

**Kural: oyun mantığı mağazalarda, görsel mantık sayfalarda.** Puanlama, seri/çarpan,
joker, damga ve görev ilerlemesi `src/store/` altındadır; sayfalar mağaza eylemlerini
çağırıp durumu okur. Yeni bir oyun kuralı eklerken bunu sayfaya değil mağazaya yaz.

Rotalar: `/login` (korumasız), `/` altında `Layout` içinde `index`, `game`, `passport`,
`mistakes`, `multiplayer`, `countries`, `leaderboard`, `profile`. `ProtectedRoute`
yalnızca `useAuthStore.user` varlığına bakar.

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

### Oyun modları (`useGameStore`)

| Mod | Soru | Taban puan | Özellik |
| --- | --- | --- | --- |
| `classic` | 10 | 10 | Temel akış |
| `time_attack` | 30 havuz | 15 | 60 sn; doğru +3 sn, yanlış −2 sn, tavan 99 sn |
| `reverse` | 10 | 10 | Ülke adı verilir, bayrak seçilir |
| `detective` | 8 | ipucu kademesine göre 30 / 20 / 10 | Bayrak kademeli netleşir |
| `world_tour` | 6 | 10 | Kıtaya göre filtreli |
| `mistake_vault` | ≤10 | 10 | Hata Kumbarası pratiği; doğru bilinen kumbaradan silinir |
| `daily` | 5 | 10 | Tarihe göre tohumlanmış 20'lik havuzdan |

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

`Login` sayfasındaki "Misafir Olarak Giriş Yap", `uid` değeri `guest_` ile başlayan bir
yerel profil üretir. Firebase Auth oturumu **yoktur**. Kod her bulut yazmasından önce
`auth.currentUser && !user.uid.startsWith('guest_')` kontrolü yapar. Yeni bulut
senkronizasyonu eklerken bu iki koşulu birlikte kontrol et.

Sonuç olarak misafirler liderlik tablosuna yazamaz ve çok oyunculu odalara pratikte
katılamaz (kurallar `request.auth != null` ister). Bu davranış bilinçlidir ama kullanıcıya
bildirilmez — bu alana dokunuyorsan davranışı doğrula.

## Yazım ve biçim kuralları

- **Arayüz metni Türkçedir, i18n katmanı yoktur.** Dizgeleri JSX içine doğrudan yaz;
  yeni bir çeviri altyapısı kurma. Oyuncuya "sen" diye hitap edilir.
- Tailwind sınıfları satır içi yazılır. Koşullu sınıf birleştirme için daima
  `cn()` (`src/lib/utils.ts`) kullan.
- İkonlar `lucide-react`'tendir. Animasyon `framer-motion`'dandır — `motion` paketi
  `package.json`'da olsa da hiçbir yerden import edilmez, ondan import etme.
- Bayrak görselleri `getFlagUrl(code)` ile `flagcdn.com/w320/{kod}.png` adresinden
  gelir ve Workbox `CacheFirst` ile 30 gün önbelleklenir (`vite.config.ts`).
- Ses, dosya değil Web Audio API osilatörüdür (`src/lib/audio.ts`); her çağrı
  `useSettingsStore.soundEnabled` kontrol eder.
- Karanlık tema varsayılandır: `index.html` kök öğesine `class="dark"` verir, `App.tsx`
  bunu `user.settings.darkMode` ile eşler. Her bileşen `dark:` varyantı taşımalıdır.
- `@/*` yol takma adı depo köküne çözümlenir (`tsconfig.json`, `vite.config.ts`), ancak
  mevcut kod göreli import kullanır. Yeni dosyada çevredeki desene uy.

## Bilinen tuzaklar

Bunlar mevcut koddaki gerçek tutarsızlıklardır. İlgili alana dokunmadan düzeltme
yapma, ama dokunuyorsan farkında ol.

1. **Kıta adları üç farklı sözlükte tutarsızdır.** `data/countries.ts` `Kuzey Amerika`,
   `Güney Amerika` ve bir kez `Avrupa/Asya` kullanır; buna karşılık `Home.tsx` (Dünya
   Turu), `Passport.tsx` (filtre) ve `usePassportStore.getContinentStats()` tek bir
   `Amerika` bekler. Sonuçları: Dünya Turu'nda "Amerika" seçilince
   `startWorldTour('Amerika')` boş havuz üretir, `generateQuestionSet` sessizce tüm 195
   ülkeye düşer; pasaport kıta istatistiklerinde Amerika daima 0/0 görünür.
   `Countries.tsx` doğru adları kullanan tek yerdir.
2. **Tasarım sistemi uygulamaya bağlı değildir.** `flagquest-tasarim-sistemi/` altında
   tam bir marka kitabı, token seti (`tokens.css`, `tokens.json`) ve 10 bileşenlik bir
   paket vardır; "pasaport" metaforu, altın/damga renk rolleri ve **arayüzde emoji
   kullanılmaması** kuralını getirir. Uygulama ise `src/index.css` içinde yalnızca
   `@import "tailwindcss"` yapar, indigo/mor gradyanlar ve emoji kullanır (rozet ve
   görev ikonları). Görsel iş isteniyorsa önce hangi sistemin geçerli olduğunu netleştir;
   bağlama yönergesi `flagquest-tasarim-sistemi/KURULUM.md` dosyasındadır.
3. **Günün Meydan Okuması tam deterministik değildir.** `getDailyQuestions()` tarihten
   türetilmiş bir sıralamayla 20'lik havuz kurar, ama sonra `generateQuestionSet` bu
   havuzdan 5 soruyu rastgele seçer. Aynı gün tekrar oynayan oyuncu farklı sorular görür.
4. **Karıştırma `sort(() => 0.5 - Math.random())` ile yapılır** (`useGameStore`,
   `useMultiplayerStore`). İstatistiksel olarak yanlıdır; karıştırmaya dokunuyorsan
   Fisher–Yates'e geçir.
5. **Kullanılmayan bağımlılıklar:** `@google/genai`, `express`, `dotenv`, `date-fns`,
   `motion` (ve `@types/express`, `tsx`, `esbuild`). `metadata.json` hâlâ
   `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` ilan eder ama kodda hiçbir Gemini çağrısı
   yoktur. Silmeden önce AI Studio dağıtımını bozup bozmadığını sor.
6. **`testFirestoreConnection()`** dışa aktarılmış ama hiçbir yerden çağrılmıyor.
7. **İki kilit dosyası birlikte tutuluyor:** `bun.lock` ve `package-lock.json`. Bağımlılık
   eklerken hangisiyle çalıştığını söyle; ikisini birden güncellemek istemiyorsan
   diğerini kirletme.
8. `useGameStore.useHint()` `hintStage >= 2` ile sınırlıdır, oysa tip yorumu 0–3 aralığı
   tanımlar; üçüncü ipucu kademesi erişilemez durumdadır.
9. **`firebase-applet-config.json` depoda açıkta durur.** Firebase web istemci
   yapılandırması gizli değildir (güvenlik kurallarla sağlanır), ama buraya yeni bir
   gerçek sır ekleme — sırlar `.env` üzerinden gelir ve `.gitignore` `.env*` dosyalarını
   hariç tutar.

## Dal ve katkı akışı

Varsayılan dal `main`. Uzak: `https://github.com/mahirkurt/FlagQuest`. Bu oturumda
geliştirme `claude/friendly-franklin-4de4mo` dalında yapılır; `main`'e doğrudan itme.
İtişten sonra taslak (draft) PR aç.
