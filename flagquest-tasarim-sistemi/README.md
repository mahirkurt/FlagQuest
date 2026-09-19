FlagQuest, 195 BM üyesi ülkenin bayraklarını ve coğrafyasını oyunlaştıran bir mobil web oyunudur. Sistem tek bir metafor üzerine kuruludur: **oyuncu bir dünya pasaportu taşır, doğru bildiği her ülke o pasaporta damga olarak mühürlenir.** Yüzeyler pasaport kâğıdı ve kapağıdır; birincil renk altın varak, vurgu rengi damga mürekkebidir. Bu metaforla çelişen hiçbir görsel karar (jenerik mavi-mor gradyan, cam efekti, neon parıltı) sisteme girmez.

## Ses ve içerik ilkeleri

- Oyuncuya **sen** diye hitap et. "Bugün hangi kıtayı keşfedeceksin?", "Tek oyunda art arda 5 doğru cevap bildin."
- Cümleler kısa, fiil önde ve eylem odaklıdır: "Sefere başla", "Sonraki ipucunu aç", "Odayı kapat". Buton metni bir eylemdir, bir etiket değil — "Tamam" değil, "Damgayı bas".
- Başarı metni oyuncunun yaptığını söyler, onu övmez: "Avrupa seferini tamamladın" ✓ — "Harikasın!" ✗.
- Hata metni suçlamaz, doğruyu verir ve bir sonraki adımı gösterir: "Yanlış — doğru cevap Endonezya. Bu ülke Hata Kumbarası'na eklendi."
- Sayılar daima Türkçe biçimdedir: ondalık ayırıcı virgül, binlik ayırıcı nokta (`1.250 XP`, `%62,4`). Süre `42 sn`, mesafe ve nüfus SI birimleriyle yazılır.
- Ülke, başkent ve kıta adları Türkçe yazılır (Endonezya, Cakarta, Okyanusya). Ülke kodu her zaman ISO 3166-1 alpha-2'dir ve arayüzde BÜYÜK HARF gösterilir (`jp` → `JP`).
- Emoji arayüz ögesi olarak kullanılmaz. Rozet ve mod ikonları `lucide-react` çizimleridir; emoji yalnızca oyuncunun kendi yazdığı metinde (çok oyunculu sohbet) geçebilir.
- Büyük harf yalnızca `etiket-sm` ve `belge` stillerinde, kısa etiketlerde kullanılır ("POPÜLER", "CANLI", "TR / ANKARA"). Cümle büyük harfle yazılmaz.

## Görsel temeller

### Renk

İki tema vardır ve **`gece` (koyu) varsayılandır** — oyun çoğunlukla akşam ve mobilde oynanır. `kagit` (açık) teması eşdeğerdir, ikinci sınıf değildir; her bileşen ikisinde de çalışmak zorundadır.

Rolleri karıştırma:

- **Marka ve birincil eylem: `altin-500`.** Bir ekranda yalnızca bir birincil buton bulunur ("Oyna", "Sonraki soru"). Üzerine `on-altin`, altına `golge-baski` gelir.
- **Durum renkleri semantiktir ve yalnızca doğru/yanlış bildirir.** Doğru `vize-500`, yanlış `damga-500`. İkisi de sözcük veya ikon taşır — renk tek başına anlam taşımaz. `vize-500` camgöbeği tonundadır: kırmızı-yeşil ekseninden çıktığı için deuteranopia ve protanopia altında da `damga-500`'den ayrışır.
- **Mod renkleri kategoriktir ve yalnızca mod kimliğinde kullanılır.** Bir durum bildirimi asla mod rengiyle yapılmaz, bir mod kimliği asla durum rengi gibi okunmaz.

| Oyun modu | Renk | Kaynaktaki karşılığı |
| --- | --- | --- |
| Klasik Mod | `altin` | indigo |
| Zamana Karşı (Blitz) | `meridyen` | blue |
| Ters Bayrak | `vize` | emerald |
| Gizemli Dedektif | `erguvan` | purple |
| Dünya Turu | `bozkir` | amber |
| Günlük Meydan Okuma | `altin` | orange |
| Canlı Düello | `damga` | rose |
| Bayrak Ansiklopedisi | `meridyen` | sky |

Altı renk sekiz modu karşılar; paylaşan iki çift ikonuyla ayrışır (Klasik `play` / Günlük `calendar`, Blitz `clock` / Ansiklopedi `globe`).

Her mod rengi üç biçimde kullanılır: `X-500` ikon ve metin, `X-yumusak` ikon kutusu ve etiket zemini, hiçbiri dolgu olarak geniş alana yayılmaz. Geniş renkli dolgu yalnızca `altin-500` (birincil buton) ve `gece` (pasaport kapağı) içindir.

Metin `metin`, `metin-yumusak`, `metin-silik` sırasıyla incelir; üçü de `zemin` ve `zemin-yukseltilmis` üzerinde en az 4,5:1 kontrasttadır. Anlam taşıyan her kenarlık `cizgi-belirgin`, yalnızca yüzey ayıran her kenarlık `cizgi` kullanır.

### Odak

Klavye odağı **`2px solid var(--odak)` + `2px` boşluk halkası** (`outline-offset: 2px`) ile çizilir. Boşluk halkası zorunludur: `odak` dolgulu butonun kendi renginden ayrışmaz, zeminden ayrışır. Odak halkası hiçbir koşulda kaldırılmaz; `:focus-visible` kullanılır, `:focus` değil.

### Tipografi

- **Bricolage Grotesque** (`--font-baslik`), 700–800: kelime markası, ekran başlıkları, kart başlıkları, şık metni, skor. Karakterli ve geniş; oyunun sesi budur.
- **Figtree** (`--font-govde`), 400–700: gövde metni, açıklama, buton, etiket.
- **IBM Plex Mono** (`--font-belge`), 400–600: pasaport diline ait her şey — ülke kodu, damga alt yazısı, sayaç, MRZ şeridi, XP değeri. Belge yazı tipi bir "resmî kayıt" işaretidir; süsleme olarak kullanılmaz.

Üçü de Google Fonts'tan barındırılır, sistemde font dosyası taşınmaz:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Figtree:wght@400..800&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
```

### Boşluk, yarıçap, yükselti

Izgara saf 4px'tir (`bosluk-1` … `bosluk-16`). Kart içi dolgu `bosluk-3`–`bosluk-5`, kartlar arası `bosluk-3`, bölümler arası `bosluk-6`. 2px ve 6px gibi ızgara altı mikro ayarlar yalnızca bileşen CSS'inde düz değer olarak yazılır, token üretilmez.

Yarıçap ölçeği yüzeyin ölçeğiyle büyür: cip `yaricap-sm`, ikon kutusu `yaricap-md`, buton ve şık `yaricap-lg`, kart ve modal `yaricap-xl`, alt navigasyon kabuğu `yaricap-2xl`, damga ve avatar `yaricap-tam`.

Yükselti önce kenarlıkla anlatılır. Gölge yalnızca gerçekten yüzen ögelerde kullanılır: alt navigasyon (`golge-md`), modal (`golge-lg`), birincil buton gövdesi (`golge-baski`). `golge-baski` bir gölge değil, mührün kâğıda basılmış kalınlığıdır; buton `:active` olduğunda 2px aşağı iner ve gölge kaldırılır.

### Hareket

Geçişler 120–200 ms, `ease`. Üç kalıp vardır ve dördüncüsü yoktur: basılma (`translateY(1–2px)`), açılma (opaklık + 8–15px yukarı kayma), ilerleme (`width`, 500 ms). Damga mühürlenirken 0,3 sn'lik bir ölçek darbesi kullanılır. `prefers-reduced-motion: reduce` altında tüm süreler 0'a iner, yalnızca opaklık değişimi kalır.

### Görsel ve bayraklar

Bayrak görselleri 3:2 oranında, `object-fit: cover` ile, `yaricap-lg` köşeyle ve `cizgi` kenarlıkla gösterilir. Bayrak asla gradyanla, gölgeyle veya renk katmanıyla değiştirilmez — yanlış bayrak öğretmek oyunun tek affedilmez hatasıdır. Dedektif modundaki bulanıklık kademeleri (`blur(18px)` → `blur(7px)` → net) bunun tek istisnasıdır ve her kademe ekranda sözcükle de belirtilir.

### İkonografi

İkon sistemi **lucide-react**'tir: 24px kutu, 1,8–2px kontur, yuvarlak uç ve birleşim. Bileşenler ikonu çizmez, `ikon` prop'uyla dışarıdan alır — böylece uygulama kendi lucide sürümünü kullanır. Önizlemelerdeki ikonlar yalnızca gösterim amaçlı basit çizimlerdir, sisteme dâhil değildir. Bir ikon tek başına anlam taşıyorsa (durum, joker) yanında sözcük bulunur.

## Uygulamaya bağlama (Tailwind v4)

Oyun Tailwind v4 kullanıyor. `tokens.css`'i içe aktar ve token'ları `@theme` ile Tailwind yardımcı sınıflarına bağla; ham `slate-*`, `indigo-*`, `purple-*` sınıfları kullanımdan kaldırılır.

```css
@import "tailwindcss";
@import "./tokens.css";

@theme inline {
  --color-zemin: var(--zemin);
  --color-zemin-yukseltilmis: var(--zemin-yukseltilmis);
  --color-metin: var(--metin);
  --color-altin: var(--altin-500);
  --color-damga: var(--damga-500);
  --color-vize: var(--vize-500);
  --font-baslik: var(--font-baslik);
  --radius-lg: var(--yaricap-lg);
}
```

Tema `<html data-theme="gece">` ile seçilir. Oyun şu anda `<html class="dark">` kullanıyor; geçişte `data-theme` özniteliğine taşınmalı, `dark:` varyantları token'lara bırakılmalıdır — token'lar temayı kendileri çözdüğü için bileşen CSS'inde tema koşulu kalmaz.

## Kurallar

- Bir ekranda tek `birincil` buton bulunur.
- Durum bildirimi hiçbir zaman yalnız renkle yapılmaz; ikon ve sözcük zorunludur.
- Mod rengi durum bildiriminde, durum rengi mod kimliğinde kullanılmaz.
- `belge` yazı tipi yalnızca kod, sayaç, tarih ve damga metninde kullanılır.
- Bayrak görseli hiçbir efektle değiştirilmez (dedektif bulanıklığı hariç).
- Odak halkası kaldırılmaz.
- Emoji arayüzde kullanılmaz.
