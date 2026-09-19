Ana sayfanın tepesindeki seviye kartı; pasaport kapağı olarak çizilir.

`gece` dolgusu, üstteki soluk MRZ şeridi ve `belge` yazı tipiyle yazılmış XP değeri kartı bir kimlik belgesine benzetir. MRZ şeridi tamamen dekoratiftir, `aria-hidden` ile gizlenir ve **hiçbir zaman gerçek kişisel veri taşımaz** — oyuncu adı bile yazılmaz, yalnızca unvan ve sabit dolgu karakterleri kullanılır.

İlerleme `xp % hedefXp` ile hesaplanır; çubuk `role="progressbar"` taşır ve yüzdesi `aria-valuenow` ile bildirilir. Sağ alttaki "Sonraki seviyeye N XP" satırı zorunludur: çubuk tek başına ne kadar kaldığını söylemez.

`unvan` oyuncunun seviye unvanıdır (Çırak Seyyah → Hevesli Gezgin → Usta Kâşif → Baş Kartograf → Dünya Elçisi) ve `belge` yazı tipiyle, büyük harfle yazılır.

Tüketici sağlar: `seviye`, toplam `xp`, `hedefXp` (varsayılan 100), `unvan` ve isterse `mrz` metni.

Yapma: MRZ şeridine gerçek ad, e-posta veya kimlik verisi yazma; XP'yi gövde yazı tipiyle gösterme; kartı iki sütuna bölme (mobilde tek kolon kalır).
