# Damga — B yönü

Amblem **daireye basılmış bir bayrak bandıdır**: pasaport giriş damgasının yuvarlak formu ile bayrakların dikey bant dilbilgisi tek şekilde birleşir. Daire elle basılmış izlenimi için 8° eğiktir.

Bu, ilk denemedeki "çember + içine ikon" kalıbının tersidir: orada çember bir çerçeveydi ve bayrak onun içine yerleştirilmişti; burada daire ile bant aynı şekli oluşturur, ayrılmazlar.

Üçü içinde **en soyut ve en özgün** olanı. Karşılığında anlamı bir cümlelik açıklama ister; hiçbir stok ikon kütüphanesine benzemez.

## Dosya tablosu

| Dosya | Kullanım |
| --- | --- |
| `flagquest-damga-yatay-acik.svg` | **Varsayılan kilit.** Açık zeminde üst bar, belge başlığı, sunum. En küçük 160 px genişlik. |
| `flagquest-damga-yatay-koyu.svg` | Aynı kilit, koyu zeminde. |
| `flagquest-damga-dikey-acik.svg` · `-koyu.svg` | Dar ve ortalanmış kullanımlar: giriş ekranı, yükleme, paylaşım kartı. En küçük 140 px. |
| `flagquest-damga-amblem-acik.svg` · `-koyu.svg` | Yalnız amblem. En küçük 24 px. |
| `flagquest-damga-amblem-tek-renk-koyu.svg` | Tek mürekkep (`#0c1b2e`), iç öge oyuk. Gravür, tek renkli baskı, filigran, faks. |
| `flagquest-damga-amblem-tek-renk-acik.svg` | Tek mürekkep (`#f4ecdd`), koyu zemin için. |
| `flagquest-damga-app-ikon.svg` | Uygulama ikonu. Gece zeminli yuvarlatılmış kare. PNG türevleri 1024 / 512 / 192 / 180. |
| `flagquest-damga-favicon.svg` | 24 px ve altı için: aynı mark, daha büyük oranda, daha az yuvarlatılmış zeminle. 16 px'te okunur. |
| `ico/favicon.ico` | 16 · 32 · 48 px'i tek dosyada taşıyan klasik favicon. |
| `png/` | Şeffaf zeminli PNG türevleri. Uygulama ikonu ve favicon kendi zeminini taşır. |

Kelime markası bu klasörde değildir; üç yön de aynı kelime markasını paylaşır → `../ortak/`.

## Mürekkepler

Dosyalar `<img>` ile gösterildiğinde rengi devralamaz; her sürümün mürekkebi dosyaya gömülüdür.

- Açık zemin: ana kütle `#0c1b2e`, dikey bant `#e0b45a`.
- Koyu zemin: ana kütle `#e0b45a`, dikey bant `#0a1524`.
- Uygulama ikonu ve favicon: zemin `#0a1524`, kütle `#e0b45a`, dikey bant `#0a1524`.
- Tek renk sürümlerin mürekkebi koyu `#0c1b2e`, açık `#f4ecdd`; dikey bant oyuktur, altındaki zemin görünür. Başka bir renge boyanmaz.

## Yapılmayacaklar

- Eğimi düzeltme veya artırma — 8° sabittir; 0° amblemi bir para/düğmeye, 15°+ bir hataya benzetir.
- Bandı ortalama — bant merkezden kaçıktır ve öyle kalır.
- Amblemi döndürme, eğme, gölgelendirme, gradyanla doldurma.
- Ana kütle ile bant arasındaki oranı değiştirme.
- Kilitleri bozup amblem ile kelime markasını elle yeniden yerleştirme.
- 24 px altında tam amblemi kullanma — `favicon` sürümü vardır.
