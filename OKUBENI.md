# FlagQuest Logo Kiti — tam set

Sürüm 2.0 · 19.09.2026 · Üç bitmiş amblem yönü, her biri üretime hazır

İlk amblem (tırtıllı çember içinde direkli bayrak) beş ayrı parçadan oluşuyordu ve hem fazla kalabalıktı hem de "rozet içine ikon" kalıbının bir örneğiydi. Bu sette amblem bir bayrak *resmi* çizmek yerine bayrağın kendi dilbilgisinden kuruldu: direk yok, çember yok, süsleme yok. Üç yönün her biri **en çok iki şekilden** oluşur.

## Üç yön

| | Ad | Fikir | Öneri |
| --- | --- | --- | --- |
| **A** | **Fly** | Kırlangıç kuyruklu flama: bayrağın tek yanılmaz siluet özelliği. Hoist (direk tarafı) bandı + fly kenarındaki V kesiği. | **Tavsiye edilen.** Üçü içinde 16 px'te en hızlı okunan ve "bayrak" olarak en az tartışmaya açık olan. |
| **B** | **Damga** | Pasaport damgası ile bayrak dilbilgisinin tek şekilde kaynaşması: daireye basılmış dikey bant, elle basılmış gibi 8° eğik. | En soyut ve en özgün olanı. Anlamı bir cümlelik açıklama ister; buna karşılık hiçbir stok ikona benzemiyor. |
| **C** | **Kanton** | Bayrakların en yaygın yapısal ögesi: alan + sol üstte kanton bloğu. | En zayıfı. Yuvarlatılmış dikdörtgen + köşe bloğu, bazı boyutlarda dosya/klasör ikonuna yaklaşıyor. Set bütünlüğü için dâhil edildi. |

Karşılaştırma için `onizleme/uc-yon-tam-matris.png` ve `onizleme/amblem-karsilastirma.png`.

## Ortak mürekkep kuralı

Üç yön de **iki mürekkep** kullanır ve temalar arasında birbirinin tersidir. Kırmızı (`damga`) amblemde hiç yer almaz — palette durum rengi olarak kalır.

| | Ana kütle | İç öge |
| --- | --- | --- |
| Açık zemin | `#0c1b2e` lacivert | `#e0b45a` altın |
| Koyu zemin | `#e0b45a` altın | `#0a1524` lacivert |
| Uygulama ikonu | zemin `#0a1524`, kütle `#e0b45a` | `#0a1524` |
| Tek renk | tek mürekkep (`#0c1b2e` veya `#f4ecdd`) | oyuk — zemin görünür |

İki mürekkep arasındaki kontrast oranı 8,95:1 (açık) ve 9,47:1 (koyu). Bu, amblemin gri tonda, tek renkli baskıda ve 16 px'te de ayrışmasını garanti eder — ilk denemedeki kırmızı/altın eşleşmesi bu testte 1,15:1 ile kalıyordu.

## Boyut ve koruma kuralları

- **Koruma alanı:** amblemin kısa kenarının %25'i. Bu alana metin, çizgi veya başka grafik girmez.
- **En küçük boyutlar:** amblem 24 px · yatay kilit 160 px genişlik · dikey kilit 140 px genişlik · uygulama ikonu 40 px.
- **24 px ve altında** amblem yerine `favicon` sürümü kullanılır: mark zeminli bir yuvarlatılmış kare içine alınmış ve orantısı büyütülmüştür, böylece herhangi bir sekme/arayüz zemininde ayrışır.
- Logo **döndürülmez, eğilmez, gölgelendirilmez, gradyanla doldurulmaz**, çerçeveye alınmaz, ana kütle ile iç öge arasındaki oran değiştirilmez.
- Kilitler verilen dosyalardaki oran ve aralıklarla kullanılır; amblem ile kelime markası ayrı ayrı yerleştirilip elle birleştirilmez.
- Logo bir bayrağın veya yoğun desenli bir fotoğrafın üstüne konmaz.

## Klasör yapısı

```
A-fly/ · B-damga/ · C-kanton/
  svg/   10 dosya — amblem (açık/koyu/tek renk×2), yatay kilit ×2,
         dikey kilit ×2, uygulama ikonu, favicon
  png/   27 dosya — şeffaf zeminli türevler (amblem 512→32,
         kilitler 1600/800/1000, ikon 1024/512/192/180, favicon 180→16)
  ico/   favicon.ico (16 · 32 · 48 px, tek dosya)
  README.md
ortak/
  svg/ png/  amblemsiz kelime markası (koyu ve açık mürekkep)
  README.md
onizleme/  kontrol sayfaları (PNG)
```

## Sonraki adım

Bir yön seçildiğinde o yönün varlıkları tasarım sistemine (`assets/Logo/`) taşınır, `assets/Logo/README.md` seçilen ambleme göre yeniden yazılır ve uygulamanın `public/` klasöründeki `favicon.svg`, `favicon.ico`, `pwa-192x192.png`, `pwa-512x512.png` dosyaları bu kitten değiştirilir. `scripts/generate-icons.mjs` artık gereksizdir — ikonlar elle çizilmiş SVG'den türetilir, kodla üretilmez.
