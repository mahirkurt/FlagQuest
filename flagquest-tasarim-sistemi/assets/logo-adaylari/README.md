# Logo Kiti 2.0 — amblem yönü karar kaydı

Sürüm 2.0 · 19.09.2026 · Üç bitmiş amblem yönü üretildi, biri seçildi

> **Karar: A — Fly seçildi.** Yürürlükteki aile `../Logo/` altındadır. Bu klasör
> seçilmeyen iki yönü ve karşılaştırma gerekçesini kayıt olarak saklar; uygulama
> veya tasarım sistemi bu dosyalardan hiçbirini kullanmaz.

İlk amblem (tırtıllı çember içinde direkli bayrak) beş ayrı parçadan oluşuyordu ve hem
fazla kalabalıktı hem de "rozet içine ikon" kalıbının bir örneğiydi. Bu sette amblem
bir bayrak *resmi* çizmek yerine bayrağın kendi dilbilgisinden kuruldu: direk yok,
çember yok, süsleme yok. Üç yönün her biri **en çok iki şekilden** oluşur.

## Üç yön

| | Ad | Fikir | Değerlendirme |
| --- | --- | --- | --- |
| **A** | **Fly** | Kırlangıç kuyruklu flama: bayrağın tek yanılmaz siluet özelliği. Hoist (direk tarafı) bandı + fly kenarındaki V kesiği. | **Seçilen.** Üçü içinde 16 px'te en hızlı okunan ve "bayrak" olarak en az tartışmaya açık olan. |
| **B** | **Damga** | Pasaport damgası ile bayrak dilbilgisinin tek şekilde kaynaşması: daireye basılmış dikey bant, elle basılmış gibi 8° eğik. | En soyut ve en özgün olanı. Anlamı bir cümlelik açıklama ister; buna karşılık hiçbir stok ikona benzemiyor. |
| **C** | **Kanton** | Bayrakların en yaygın yapısal ögesi: alan + sol üstte kanton bloğu. | En zayıfı. Yuvarlatılmış dikdörtgen + köşe bloğu, bazı boyutlarda dosya/klasör ikonuna yaklaşıyor. Set bütünlüğü için üretildi. |

Üçünün yan yana render'ı: `../../onizleme/amblem-yonleri.png`.

## Ortak mürekkep kuralı

Üç yön de **iki mürekkep** kullanır ve temalar arasında birbirinin tersidir. Kırmızı
(`damga`) amblemde hiç yer almaz — palette durum rengi olarak kalır.

| | Ana kütle | İç öge |
| --- | --- | --- |
| Açık zemin | `#0c1b2e` lacivert | `#e0b45a` altın |
| Koyu zemin | `#e0b45a` altın | `#0a1524` lacivert |
| Uygulama ikonu | zemin `#0a1524`, kütle `#e0b45a` | `#0a1524` |
| Tek renk | tek mürekkep (`#0c1b2e` veya `#f4ecdd`) | oyuk — zemin görünür |

İki mürekkep arasındaki kontrast oranı 8,95:1 (açık) ve 9,47:1 (koyu). Bu, amblemin
gri tonda, tek renkli baskıda ve 16 px'te de ayrışmasını garanti eder — ilk
denemedeki kırmızı/altın eşleşmesi bu testte 1,15:1 ile kalıyordu.

## Boyut ve koruma kuralları

Üç yön için de geçerlidir; yürürlükteki aileye ait sürümü `../Logo/README.md`
dosyasındadır.

- **Koruma alanı:** amblemin kısa kenarının %25'i.
- **En küçük boyutlar:** amblem 24 px · yatay kilit 160 px genişlik · dikey kilit
  140 px genişlik · uygulama ikonu 40 px.
- **24 px ve altında** amblem yerine `favicon` sürümü kullanılır.
- Logo döndürülmez, eğilmez, gölgelendirilmez, gradyanla doldurulmaz, çerçeveye
  alınmaz; ana kütle ile iç öge arasındaki oran değiştirilmez.

## Bu klasörde ne var

```
B-damga/ · C-kanton/
  svg/   10 dosya — amblem (açık/koyu/tek renk ×2), yatay kilit ×2,
         dikey kilit ×2, uygulama ikonu, favicon
  png/   şeffaf zeminli türevler
  ico/   favicon.ico
  README.md
```

Kelime markası yöne bağlı değildir; üç yön de aynısını paylaşır ve yürürlükteki
aileyle birlikte `../Logo/svg/` altında durur.

## Yön değiştirmek gerekirse

1. `B-damga/` veya `C-kanton/` içeriğini `../Logo/` altına taşı (`svg/`, `png/`,
   `ico/` düzeni korunur), eskisini kaldır.
2. `../Logo/README.md` dosyasını yeni ambleme göre yeniden yaz.
3. `src/lib/logo.ts` içindeki altı import'un dosya adını değiştir (`fly` → `damga`
   veya `kanton`).
4. `scripts/marka-senkron.mjs` içindeki `ESLEME` tablosundaki dosya adlarını
   güncelle ve betiği çalıştır.
5. `onizleme/logo-ailesi.png` ve `logo-boyut-testi.png` dosyalarını yeniden üret.
