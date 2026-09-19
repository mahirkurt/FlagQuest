# FlagQuest logo ailesi

Logo Kiti 2.0 · **Fly** yönü · yürürlükte

Amblem bir **kırlangıç kuyruklu flama**dır: 3:2 alan, fly (serbest) kenarında ortaya
kadar inen V kesik, hoist (direk) tarafında dikey bir bant. Direk çizilmez — bayrağı
bayrak yapan şey direk değil, kesilmiş fly kenarıdır ve bu siluet başka hiçbir nesneye
benzemez. Hoist bandı süs değildir: gerçek bayrakların yaklaşık beşte biri (Portekiz,
BAE, Kuveyt, Benin, Madagaskar…) bu yapıya sahiptir. İki şekil, iki mürekkep, başka
hiçbir şey.

Kelime markası **Bricolage Grotesque ExtraBold**'un hat (path) dönüşümüdür: harfler
HarfBuzz ile kerning ve ligatür uygulanarak dizilmiş, −%1,5 harf aralığı verilmiş ve
dış hatlara çevrilmiştir. Hiçbir yazı tipine bağımlı değildir.

## Klasör yapısı

```
Logo/
  svg/   12 dosya — amblem (açık/koyu + tek renk ×2), yatay kilit ×2,
         dikey kilit ×2, uygulama ikonu, favicon, kelime markası ×2
  png/   31 dosya — şeffaf zeminli türevler
  ico/   favicon.ico (16 · 32 · 48 px, tek dosya)
```

## Dosya tablosu

| Dosya | Kullanım |
| --- | --- |
| `svg/flagquest-fly-yatay-acik.svg` | **Varsayılan kilit.** Açık zeminde üst bar, belge başlığı, sunum. En küçük 160 px genişlik. |
| `svg/flagquest-fly-yatay-koyu.svg` | Aynı kilit, koyu zeminde. |
| `svg/flagquest-fly-dikey-acik.svg` · `-koyu.svg` | Dar ve ortalanmış kullanımlar: giriş ekranı, yükleme, paylaşım kartı. En küçük 140 px. |
| `svg/flagquest-fly-amblem-acik.svg` · `-koyu.svg` | Yalnız amblem. En küçük 24 px. |
| `svg/flagquest-fly-amblem-tek-renk-koyu.svg` | Tek mürekkep (`#0c1b2e`), hoist bandı oyuk. Gravür, tek renkli baskı, filigran, faks. |
| `svg/flagquest-fly-amblem-tek-renk-acik.svg` | Tek mürekkep (`#f4ecdd`), koyu zemin için. |
| `svg/flagquest-fly-app-ikon.svg` | Uygulama ikonu. Gece zeminli yuvarlatılmış kare. PNG türevleri 1024 / 512 / 192 / 180. |
| `svg/flagquest-fly-favicon.svg` | 24 px ve altı için: aynı mark, daha büyük oranda, daha az yuvarlatılmış zeminle. 16 px'te okunur. |
| `svg/flagquest-kelime-markasi-koyu.svg` | Amblemsiz kelime markası, `#0c1b2e` — açık zeminler. |
| `svg/flagquest-kelime-markasi-acik.svg` | Amblemsiz kelime markası, `#f4ecdd` — koyu zeminler. |
| `ico/favicon.ico` | 16 · 32 · 48 px'i tek dosyada taşıyan klasik favicon. |
| `png/` | Şeffaf zeminli PNG türevleri. Uygulama ikonu ve favicon kendi zeminini taşır. |

### Son ek kuralı

Son ek **mürekkebi değil zemini** belirtir:

- `-koyu` → **koyu zeminde** kullanılır (altın kütle, lacivert hoist bandı) → `gece` teması
- `-acik` → **açık zeminde** kullanılır (lacivert kütle, altın hoist bandı) → `kagit` teması

Bu, Logo Kiti 1.0'daki kuralın tersidir. Eski dosya adlarına bakarak eşleme yapma.

## Mürekkepler

Dosyalar `<img>` ile gösterildiğinde rengi devralamaz; her sürümün mürekkebi dosyaya
gömülüdür. Kırmızı (`damga`) amblemde hiç yer almaz — palette durum rengi olarak kalır.

| | Ana kütle | Hoist bandı |
| --- | --- | --- |
| Açık zemin | `#0c1b2e` lacivert | `#e0b45a` altın |
| Koyu zemin | `#e0b45a` altın | `#0a1524` lacivert |
| Uygulama ikonu / favicon | zemin `#0a1524`, kütle `#e0b45a` | `#0a1524` |
| Tek renk | tek mürekkep (`#0c1b2e` veya `#f4ecdd`) | oyuk — zemin görünür |

İki mürekkep arasındaki kontrast oranı 8,95:1 (açık) ve 9,47:1 (koyu); amblem gri
tonda, tek renkli baskıda ve 16 px'te de ayrışır.

## Boyut ve koruma kuralları

- **Koruma alanı:** amblemin kısa kenarının %25'i. Bu alana metin, çizgi veya başka
  grafik girmez.
- **En küçük boyutlar:** amblem 24 px · yatay kilit 160 px genişlik · dikey kilit
  140 px genişlik · uygulama ikonu 40 px · kelime markası 90 px genişlik.
- **24 px ve altında** amblem yerine `favicon` sürümü kullanılır.
- Yazım sabittir: **FlagQuest** — tek kelime, ikinci Q büyük. "Flag Quest",
  "FLAGQUEST", "Flagquest" kullanılmaz.

## Yapılmayacaklar

- Flamayı dikey (portre) oranda kullanma — dik duran ve altı V kesilmiş bir dikdörtgen
  yer imi (bookmark) ikonuna döner. Oran daima yatay kalır.
- Amblemi döndürme, eğme, gölgelendirme, gradyanla doldurma, çerçeveye alma.
- Ana kütle ile hoist bandı arasındaki oranı değiştirme.
- Kilitleri bozup amblem ile kelime markasını elle yeniden yerleştirme.
- Kelime markasını yeniden dizme veya başka bir yazı tipiyle yazma. Metin içinde geçen
  "FlagQuest" normal gövde yazı tipiyle yazılır; bu dosyalar yalnızca marka kullanımı
  içindir.
- Logoyu bir bayrağın veya yoğun desenli bir fotoğrafın üstüne koyma.

## Uygulamaya bağlanışı

- **Uygulama içi kullanım:** `src/lib/logo.ts` bu klasördeki SVG'leri doğrudan içe
  aktarır; `public/` altında kopyası tutulmaz. Tema → dosya eşlemesi orada yapılır.
- **Favicon ve PWA ikonları** sabit URL'den servis edilmek zorunda olduğu için
  `public/` altında kopya tutar. Kopyaları `node scripts/marka-senkron.mjs` üretir:
  `favicon.svg`, `favicon.ico`, `pwa-192x192.png`, `pwa-512x512.png`,
  `apple-touch-icon.png`. Bu dosyalar elle düzenlenmez; marka güncellenince betik
  yeniden çalıştırılır.

## Köken

Bu aile, Logo Kiti 2.0'ın üç amblem yönünden (`A-fly`, `B-damga`, `C-kanton`) **Fly**
yönüdür; kitin kendi tavsiyesi de budur. Seçilmeyen iki yön ve kitin karşılaştırma
metni `../logo-adaylari/` altında karar kaydı olarak durur.

Kit 2.0, ilk amblemin (tırtıllı çember içinde direkli bayrak) yerine geçer. Eski aile
beş parçadan oluşuyordu ve "rozet içine ikon" kalıbının bir örneğiydi; geçmişi git
tarihçesindedir.
