Mobil ana gezinme kabuğu: beş hedef ve ortada yükseltilmiş "Oyna" düğmesi.

Beş hedef sabittir — Ana Sayfa, Pasaport, Oyna, Liderlik, Profil — ve sırası değişmez. Ortadaki öge `oyna: true` ile yükseltilmiş dairesel düğme olarak çizilir; oyunun tek asıl eylemi odur ve her ekrandan bir dokunuş uzaktadır.

Aktif hedef hem `altin-yumusak` zemin hem `aria-current="page"` taşır. Kabuk sayfanın altına sabitlenir (`position: fixed`), bu yüzden sayfa içeriğine en az `bosluk-16` alt boşluk bırakılmalıdır; bileşen bunu kendisi ayarlamaz.

Oyun ekranında navigasyon gizlenir: soru sorulurken sayfa değiştirmek ilerlemeyi kaybettirir.

Tüketici sağlar: `ogeler` dizisi (`id`, `etiket`, `ikon`, `oyna`), `aktif` id'si ve yönlendirme (kabuk `NavLink` sarmalar).

Yapma: altıncı hedefi ekleme; "Oyna" düğmesini kenara taşıma; etiketleri kaldırıp yalnız ikon bırakma (ikonlar tek başına ayırt edilmiyor).
