Kullanıcının bir eylemi başlattığı temel düğme; birincil hâli altın mühür baskısıdır.

Bir ekranda yalnızca bir `birincil` buton bulunur — ekranın bir sonraki adımı odur ("Oyna", "Sonraki soru", "Sefere başla"). Diğer her eylem `ikincil` veya `hayalet`tir. `tehlike` yalnızca geri alınamayan işlemler içindir (odayı kapat, ilerlemeyi sıfırla) ve onay diyaloğu olmadan kullanılmaz.

Tüketici sağlar: metin (`children`), isterse `ikon`/`ikonSon` düğümü (lucide-react), `onClick`. Bileşen ikon çizmez.

Mobilde ana eylem `boyut="lg"` ve `tamGenislik` ile verilir — 48px'lik dokunma hedefini yalnızca bu boyut karşılar. `sm` yalnızca yoğun araç çubuklarında kullanılır.

Buton metni bir eylem cümlesidir: "Damgayı bas" ✓, "Tamam" ✗. Metin iki kelimeyi geçmez ve asla sarmalanmaz.

Yapma: iki birincil butonu yan yana koyma; `tehlike`yi vazgeçme/iptal için kullanma; ikonu metinsiz bırakma (ikon-only eylem için dairesel `AltNavigasyon` "Oyna" düğmesi vardır).
