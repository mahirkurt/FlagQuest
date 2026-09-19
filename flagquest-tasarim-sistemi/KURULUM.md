# FlagQuest Tasarım Sistemi — paket içeriği ve kurulum

Sürüm 1.0 · 19.09.2026 · Kaynak: FlagQuest React 19 + Tailwind v4 kod tabanı

Marka kitabı `README.md` dosyasındadır; kullanım kurallarının tamamı oradadır. Bu dosya yalnızca paketin nasıl açılıp projeye bağlanacağını anlatır.

## Dosya haritası

| Yol | Nedir |
| --- | --- |
| `README.md` | **Marka kitabı.** Ses ve içerik ilkeleri, renk/tipografi/boşluk temelleri, mod → renk eşlemesi, ikonografi, kurallar. Önce bu okunur. |
| `tokens.json` | Token'ların kaynağı. 30 renk × 2 tema, 14 tip stili, boşluk/yarıçap/gölge/opaklık/kenar ölçekleri. Her token'da `usage` notu vardır. |
| `tokens.css` | `tokens.json`'dan derlenmiş CSS özel değişkenleri ve tip stili sınıfları. Uygulamaya doğrudan bu dosya bağlanır. |
| `components/bundle.js` | 10 bileşenin React uygulaması. Klasik betik; `window.FlagQuest` nesnesini tanımlar. |
| `components/bundle.css` | Bileşen stil tabakası. `tokens.css`'ten **sonra** yüklenir. |
| `components/index.d.ts` | TypeScript prop tipleri ve satır içi kullanım notları. |
| `components/<Ad>/README.md` | Bileşenin kullanım kılavuzu: ne zaman kullanılır, tüketicinin ne sağladığı, yapılmayacaklar. |
| `components/<Ad>/preview.html` | Bileşenin canlı önizlemesi (bağımsız belge). |
| `components/Cover/preview.html` | Sistemin kapağı. |
| `assets/Logo/` | 12 SVG logo varlığı + mürekkep ve kullanım kuralları. |
| `onizleme/` | Render edilmiş PNG kontrol sayfaları — iki temada bileşenler, kapak, logo ailesi ve boyut testi. |
| `design-system.json` | Sistem dizini (başlık, kütüphaneler, varlık grupları). Yalnızca tasarım sistemi artifact'ine geri yüklerken gerekir. |

## Yazı tipleri

Üç aile Google Fonts'tan barındırılır; pakette font dosyası yoktur. `index.html`'in `<head>` bölümüne eklenir:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Figtree:wght@400..800&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
```

## Tailwind v4'e bağlama

`tokens.css`'i `src/` altına kopyalayın ve `src/index.css`'i şöyle yazın:

```css
@import "tailwindcss";
@import "./tokens.css";

@theme inline {
  --color-zemin: var(--zemin);
  --color-zemin-yukseltilmis: var(--zemin-yukseltilmis);
  --color-zemin-gomuk: var(--zemin-gomuk);
  --color-metin: var(--metin);
  --color-metin-yumusak: var(--metin-yumusak);
  --color-metin-silik: var(--metin-silik);
  --color-cizgi: var(--cizgi);
  --color-altin: var(--altin-500);
  --color-damga: var(--damga-500);
  --color-vize: var(--vize-500);
  --color-meridyen: var(--meridyen-500);
  --color-erguvan: var(--erguvan-500);
  --color-bozkir: var(--bozkir-500);
  --font-baslik: var(--font-baslik);
  --font-govde: var(--font-govde);
  --font-belge: var(--font-belge);
  --radius-lg: var(--yaricap-lg);
  --radius-xl: var(--yaricap-xl);
}
```

## Tema anahtarı

Sistem temayı `data-theme` özniteliğinden okur. Oyun şu anda `<html class="dark">` kullanıyor; geçiş şudur:

```diff
- <html lang="tr" class="dark">
+ <html lang="tr" data-theme="gece">
```

`gece` (koyu) varsayılan, `kagit` (açık) ikinci temadır. Token'lar temayı kendileri çözdüğü için geçişten sonra bileşen CSS'inde `dark:` varyantı kalmaz — mevcut `dark:bg-slate-900` gibi çiftler tek bir `bg-zemin-yukseltilmis` ile değiştirilir.

## Bileşenleri kullanma

Bundle klasik bir betiktir; `window.React` ve `window.ReactDOM` bekler ve `window.FlagQuest` nesnesini tanımlar. Vite/ESM projesinde en pratik yol, `bundle.js`'i bir modüle sarmak veya `components/index.d.ts`'i sözleşme kabul edip bileşenleri projenin kendi JSX'iyle yeniden yazmaktır — `bundle.css` sınıf adları (`fq-btn`, `fq-mod`, `fq-sik` …) her iki durumda da aynıdır ve stil tabakası değişmeden kalır.

İkonlar bileşenlerin içinde çizilmez; `lucide-react` düğümü `ikon` prop'uyla dışarıdan verilir:

```jsx
import { Play } from "lucide-react";
<Buton cesit="birincil" boyut="lg" tamGenislik ikon={<Play size={20} />}>Oyna</Buton>
```

## Önizlemeleri yerelde açma

`components/<Ad>/preview.html` dosyaları, kendilerinden önce `tokens.css`, `bundle.css`, React 18 ve `bundle.js` yüklenmiş bir çerçevede çalışacak şekilde yazılmıştır; tek başlarına çift tıklanarak açıldıklarında boş görünürler. Render edilmiş hâlleri `onizleme/bilesenler-gece.png` ve `onizleme/bilesenler-kagit.png` dosyalarındadır.

## Erişilebilirlik taahhüdü

76 renk çifti iki temada da programatik olarak sınanmıştır: metin/zemin çiftleri en az 4,5:1; anlam taşıyan kenarlık, odak halkası ve ikonlar en az 3:1. Palette yapılan her değişiklikten sonra bu eşikler yeniden ölçülmelidir. "Doğru" rengi camgöbeğidir — kırmızı-yeşil ekseninden çıktığı için renk körlüğünde de "yanlış"tan ayrışır; buna ek olarak her durum ikon **ve** sözcük taşır.
