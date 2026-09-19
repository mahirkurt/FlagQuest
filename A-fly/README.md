# Fly — A yönü

Amblem bir **kırlangıç kuyruklu flama**dır: 3:2 alan, fly (serbest) kenarında ortaya kadar inen V kesik, hoist (direk) tarafında dikey bir bant. Direk çizilmez — bayrağı bayrak yapan şey direk değil, kesilmiş fly kenarıdır ve bu siluet başka hiçbir nesneye benzemez.

Hoist bandı sadece süs değildir: gerçek bayrakların yaklaşık beşte biri (Portekiz, BAE, Kuveyt, Benin, Madagaskar…) bu yapıya sahiptir. İki şekil, iki mürekkep, başka hiçbir şey.

Üç yön içinde **tavsiye edilen** budur: 16 px'te en hızlı okunur, gri tonda bozulmaz ve "bu bir bayrak" okuması için açıklama gerektirmez.

## Dosya tablosu

| Dosya | Kullanım |
| --- | --- |
| `flagquest-fly-yatay-acik.svg` | **Varsayılan kilit.** Açık zeminde üst bar, belge başlığı, sunum. En küçük 160 px genişlik. |
| `flagquest-fly-yatay-koyu.svg` | Aynı kilit, koyu zeminde. |
| `flagquest-fly-dikey-acik.svg` · `-koyu.svg` | Dar ve ortalanmış kullanımlar: giriş ekranı, yükleme, paylaşım kartı. En küçük 140 px. |
| `flagquest-fly-amblem-acik.svg` · `-koyu.svg` | Yalnız amblem. En küçük 24 px. |
| `flagquest-fly-amblem-tek-renk-koyu.svg` | Tek mürekkep (`#0c1b2e`), iç öge oyuk. Gravür, tek renkli baskı, filigran, faks. |
| `flagquest-fly-amblem-tek-renk-acik.svg` | Tek mürekkep (`#f4ecdd`), koyu zemin için. |
| `flagquest-fly-app-ikon.svg` | Uygulama ikonu. Gece zeminli yuvarlatılmış kare. PNG türevleri 1024 / 512 / 192 / 180. |
| `flagquest-fly-favicon.svg` | 24 px ve altı için: aynı mark, daha büyük oranda, daha az yuvarlatılmış zeminle. 16 px'te okunur. |
| `ico/favicon.ico` | 16 · 32 · 48 px'i tek dosyada taşıyan klasik favicon. |
| `png/` | Şeffaf zeminli PNG türevleri. Uygulama ikonu ve favicon kendi zeminini taşır. |

Kelime markası bu klasörde değildir; üç yön de aynı kelime markasını paylaşır → `../ortak/`.

## Mürekkepler

Dosyalar `<img>` ile gösterildiğinde rengi devralamaz; her sürümün mürekkebi dosyaya gömülüdür.

- Açık zemin: ana kütle `#0c1b2e`, hoist bandı `#e0b45a`.
- Koyu zemin: ana kütle `#e0b45a`, hoist bandı `#0a1524`.
- Uygulama ikonu ve favicon: zemin `#0a1524`, kütle `#e0b45a`, hoist bandı `#0a1524`.
- Tek renk sürümlerin mürekkebi koyu `#0c1b2e`, açık `#f4ecdd`; hoist bandı oyuktur, altındaki zemin görünür. Başka bir renge boyanmaz.

## Yapılmayacaklar

- Flamayı dikey (portre) oranda kullanma — dik duran ve altı V kesilmiş bir dikdörtgen yer imi (bookmark) ikonuna döner. Oran daima yatay kalır.
- Amblemi döndürme, eğme, gölgelendirme, gradyanla doldurma.
- Ana kütle ile hoist bandı arasındaki oranı değiştirme.
- Kilitleri bozup amblem ile kelime markasını elle yeniden yerleştirme.
- 24 px altında tam amblemi kullanma — `favicon` sürümü vardır.
