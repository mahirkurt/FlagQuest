Ana sayfadaki oyun modu listesinin tek satırlık girişi; ikon kutusu, başlık, tek satır açıklama ve isteğe bağlı etiketten oluşur.

`renk`, README'deki mod → renk eşlemesinden gelir ve modun kimliğidir; aynı mod uygulamanın her yerinde aynı rengi taşır. Renk yalnızca ikon kutusunu ve etiketi boyar, kartın kendisi her zaman `zemin-yukseltilmis` üzerindedir — sekiz renkli kart bir liste değil, bir palet tablosu olurdu.

`aciklama` tek satırdır ve taşan kısmı kırpılır; modun ne yaptığını ve puanlamanın kuralını söyler ("60 saniyede kaç bayrak bilebilirsin? Doğru cevap +3 sn."). İki cümleyi geçmez.

Tüketici sağlar: `ikon` düğümü (lucide-react, 20–22px), `baslik`, `aciklama`, isteğe bağlı `etiket`, `renk` ve `onClick`.

Yapma: kartı gradyanla doldurma; açıklamayı iki satıra çıkarma; başlığı üç kelimeden uzun yazma; aynı listede aynı rengi ikon farkı olmadan iki kez kullanma.
