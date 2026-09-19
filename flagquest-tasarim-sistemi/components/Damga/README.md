Pasaporta mühürlenen ülke damgası; oyunun temel ödül birimidir.

Kazanılmış damga düz `damga-500` halka, bayrak görseli ve `belge` yazı tipiyle ülke kodunu taşır. Kazanılmamış damga kesikli `cizgi` halkadır, içinde yalnızca ülke kodu solgun durur — boş bir yer, kilitli bir kapı değil.

`aci` damgaya −6° ile +6° arasında bir eğim verir ve elle basılmış izlenimini yaratır. **Bir ülkenin açısı sabittir**: ülke kodundan türetilir, her açılışta yeniden rastgele hesaplanmaz — pasaport her açıldığında damgaların yeri kaymamalıdır.

Bir damga yalnızca doğru cevapla kazanılır ve geri alınmaz. Damga kazanıldığı anda 0,3 sn'lik bir ölçek darbesiyle mühürlenir; `prefers-reduced-motion` altında bu darbe yapılmaz.

Tüketici sağlar: `ulkeKodu` (ISO 3166-1 alpha-2, küçük harf), `ulkeAdi`, kazanılmışsa `bayrakSrc`, `kazanildi` ve `aci`.

Yapma: kazanılmamış damgada bayrağı gösterme (ipucu sızdırır); açıyı 6°'nin ötesine taşıma; damgayı bir buton gibi kullanma — ayrıntı için ülke kartı açılır.
