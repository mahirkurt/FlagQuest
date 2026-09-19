Soru ekranındaki bayrak görseli; 3:2 oranında, kırpılmadan kadrajlanır.

Bayrak hiçbir efektle değiştirilmez — renk katmanı, gradyan, gölge ve doygunluk ayarı yasaktır. Tek istisna Gizemli Dedektif modunun `bulanik1` ve `bulanik2` kademeleridir; bu kademelerde görselin üstünde hangi ipucu aşamasında olunduğunu söyleyen bir sözcük örtüsü zorunludur, bulanıklık tek başına bilgi taşımaz.

Soru sorulurken `alt` **boş bırakılır**: ülke adını alt metne yazmak cevabı ekran okuyucuya sızdırır. Cevap açıklandıktan sonra `alt` ülke adıyla doldurulabilir. Ansiklopedi ve pasaport ekranlarında `alt` her zaman doludur.

`altBilgi` belge satırıdır: bölge ve ISO kodu gibi kısa alanlar, `belge` yazı tipiyle. Cevabı ele veren hiçbir bilgi buraya yazılmaz.

Tüketici sağlar: `src` (uygulamada flagcdn), `alt`, `durum` ve isterse `altBilgi` düğümleri.

Yapma: bayrağı `object-fit: contain` ile gösterme (oran bozulur, kenarda boşluk kalır); bayrağı daire içine alma; ikon olarak emoji bayrak kullanma.
