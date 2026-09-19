Oyun ekranının üst çubuğundaki küçük denetim: jokerler, süre sayacı ve seri göstergesi.

Üç tür vardır. `ipucu` jokerdir (50:50, İpucu) ve tıklanabilir; kullanıldıktan sonra `kullanildi` ile üstü çizilir ve pasifleşir — listeden kaldırılmaz, çünkü oyuncunun jokerini harcadığını görmesi gerekir. `sure` sayaçtır, `belge` yazı tipiyle çizilir ve son 10 saniyede `kritik` ile dolu kırmızıya döner. `seri` art arda doğru sayısını ve çarpanı gösterir.

`sure` çipi bir buton değildir; tıklanabilir görünmemesi için tüketici `disabled` verir veya `span` olarak sarar. Sayaç kritik hâle geçerken yalnızca renk değişmez, sayı da okunur kalır — `on-damga` metin rengi bunu garantiler.

Tüketici sağlar: `ikon` düğümü (14px), metin, `tur`, `kullanildi`, `kritik` ve `onClick`.

Yapma: kritik süreyi yanıp sönen animasyonla gösterme (`prefers-reduced-motion` altında hiçbir bilgi kalmaz); bir satırda üçten fazla joker çipi dizme; çip metnini iki kelimeden uzun yazma.
