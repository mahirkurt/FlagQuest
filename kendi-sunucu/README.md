# Kendi sunucunda barındırma (Raspberry Pi)

FlagQuest'i AI Studio / Cloud Run yerine kendi Raspberry Pi'nizde barındırmak için
gereken her şey bu klasördedir. Yapılandırmalar Pi'ye özgü değildir; herhangi bir
Linux kutusunda aynı şekilde çalışır.

## Önce beklentiyi netleştirelim: ne taşınıyor, ne taşınmıyor

Taşınan yalnızca **statik barındırmadır**. Uygulamanın sunucu tarafı kodu yoktur;
Pi yalnız `dist/` klasörünü servis eder.

| Parça | Nerede kalıyor |
| --- | --- |
| HTML / JS / CSS / ikonlar | **Pi** |
| Kimlik doğrulama (Firebase Auth, Google ile giriş) | Google bulutu — istemci SDK'sı tarayıcıdan konuşur |
| Veri (Firestore: profil, liderlik, çok oyunculu odalar) | Google bulutu — aynı şekilde |
| Bayrak görselleri | `flagcdn.com` |

Yani bu adım sizi Google'dan bağımsız hâle **getirmez**; dağıtım hattını denetiminize
alır. Veritabanını da kendinize taşımak isterseniz bu, `src/lib/firebase.ts` ve altı
mağazayı yeniden yazmayı gerektiren ayrı ve çok daha büyük bir iştir.

## Sert kısıtlar — bunlar karşılanmazsa uygulama bozulur

1. **HTTPS zorunludur.** Servis çalışanı yalnız güvenli bağlamda kaydolur (`localhost`
   istisnadır). Düz `http://raspberrypi.local` üzerinde PWA kurulumu, çevrimdışı
   çalışma ve sürüm kayması onarımı **çalışmaz**.
2. **Google ile giriş HTTPS ister.** `Login` sayfası `signInWithPopup` kullanır; düz
   HTTP üzerinde başarısız olur. (Misafir kipi çalışmaya devam eder.)
3. **Yeni alan adı Firebase'de yetkilendirilmelidir.** Firebase Console → Authentication
   → Settings → **Authorized domains** listesine alan adınızı ekleyin. Eklenmezse giriş
   `auth/unauthorized-domain` ile düşer.
4. **Alan adı gerekir.** Sertifika IP adresine alınamaz. Ücretsiz bir alt alan da olur.

## Donanım

Pi 4 veya 5 önerilir; Pi 3 ve Zero 2 W de statik servis için yeter. **Derlemeyi Pi'de
yapmayın:** Vite 1780'den fazla modül dönüştürür, 1 GB RAM'li modellerde takılır.
`dagit.sh` bu yüzden derlemeyi geliştirme makinesinde yapar, Pi'ye yalnız çıktıyı
gönderir.

64-bit Raspberry Pi OS (Bookworm) varsayılır.

## Ağ: iki yol

### A) Cloudflare Tunnel — önerilen

Port yönlendirmesi gerekmez, CGNAT arkasında çalışır (Türkiye'deki ev bağlantılarının
çoğu böyledir), TLS'i Cloudflare üstlenir, Pi'nin IP'si dışarı açılmaz.

```bash
# Pi üzerinde
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared bookworm main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update && sudo apt install -y cloudflared
cloudflared tunnel login
cloudflared tunnel create flagquest
```

`/etc/cloudflared/config.yml`:

```yaml
tunnel: <tunnel-uuid>
credentials-file: /root/.cloudflared/<tunnel-uuid>.json
ingress:
  - hostname: flagquest.ornek.com
    service: http://localhost:8080
  - service: http_status:404
```

```bash
cloudflared tunnel route dns flagquest flagquest.ornek.com
sudo cloudflared service install && sudo systemctl enable --now cloudflared
```

Bu yolda nginx'i **8080'de düz HTTP** dinletin (`listen 8080;`) ve certbot
adımlarını atlayın; sertifika Cloudflare tarafında.

> Cloudflare'ın kendi önbelleği devreye girer. Cloudflare panelinde `index.html`,
> `sw.js` ve `surum.json` için "Cache Level: Bypass" kuralı tanımlayın veya
> "Respect existing headers" seçin — yoksa aynı eski kabuk sorunu bir kat yukarıda
> tekrarlar.

### B) Doğrudan port yönlendirme + Let's Encrypt

Modemde 80 ve 443'ü Pi'ye yönlendirin, alan adının A kaydını genel IP'nize verin
(dinamik IP için DDNS), sonra:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d flagquest.ornek.com
```

Certbot 443 dinleyicisini ve yenilemeyi kendisi kurar.

## Kurulum (nginx)

`nginx.conf` bu ortamda uçtan uca sınandı (bkz. **Doğrulama**). Caddy alternatifi
aşağıda.

```bash
# Pi üzerinde
sudo apt update && sudo apt install -y nginx rsync
sudo useradd -r -m -d /srv/flagquest -s /usr/sbin/nologin flagquest || true
sudo mkdir -p /srv/flagquest/surumler
sudo chown -R flagquest:flagquest /srv/flagquest
sudo chmod 755 /srv/flagquest

# dagit.sh'ın ssh ile bağlanacağı kullanıcıyı kendiniz seçin; flagquest kullanıcısı
# nologin olduğu için ya kendi kullanıcınıza /srv/flagquest yazma yetkisi verin
# ya da flagquest'e ssh kabuğu tanımlayın.
sudo usermod -aG flagquest "$USER"
sudo chmod 775 /srv/flagquest /srv/flagquest/surumler
```

Yapılandırmayı yerleştirin:

```bash
sudo cp kendi-sunucu/nginx.conf /etc/nginx/sites-available/flagquest
sudo sed -i 's/flagquest\.ornek\.com/GERCEK-ALAN-ADINIZ/' /etc/nginx/sites-available/flagquest
sudo ln -sf /etc/nginx/sites-available/flagquest /etc/nginx/sites-enabled/flagquest
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

`root` olarak `/srv/flagquest/guncel` simgesel bağını gösterir; bu bağ henüz yoktur,
ilk dağıtımda oluşur.

## Dağıtım

Geliştirme makinesinden:

```bash
PI=kullanici@raspberrypi.local ALAN=flagquest.ornek.com ./kendi-sunucu/dagit.sh
# veya
npm run deploy:pi          # aynı betik, varsayılan değişkenlerle
```

Betik sırayla: `npm run build` → sürüm damgasını `dist/surum.json`'dan okur →
`/srv/flagquest/surumler/<damga>/` altına `rsync` eder → `guncel` bağını **tek bir
rename(2) ile** takas eder → son 5 sürümü tutup kalanı budar → `ALAN` verildiyse
yayındaki başlıkları doğrular.

Takasın atomik olması önemlidir: yarı kopyalanmış bir derleme hiçbir zaman servis
edilmez ve geri alma tek komuttur.

```bash
# Geri alma
ssh kullanici@raspberrypi.local
cd /srv/flagquest && ls surumler
ln -sfn surumler/<eski-damga> .g && mv -T .g guncel
```

## Önbellek kuralları — buraya dokunmadan önce okuyun

Bu projenin en pahalı hatası "dağıtım başarılı ama tarayıcı eski sayfayı gösteriyor"
idi. Nedeni, servis çalışanının gezinme isteklerini ön belleğe alınmış `index.html`'den
karşılaması ve giriş belgesinin HTTP düzeyinde de önbelleklenmesiydi. `nginx.conf` ve
`Caddyfile`, `firebase.json` ile **aynı** kuralları uygular:

| Yol | Cache-Control | Neden |
| --- | --- | --- |
| `/assets/*`, `/workbox-*.js` | `max-age=31536000, immutable` | Ad içerikle değişir |
| `/favicon.*`, `/pwa-*.png`, `/apple-touch-icon.png` | `max-age=3600` | Servis çalışanı tazeliyor |
| **geri kalan her şey** (`/`, `/login`, `/index.html`, `/sw.js`, `/surum.json`, `/manifest.webmanifest`) | `no-cache, no-store, must-revalidate` | Giriş belgesi önbelleğe girerse yeni dağıtım eski kabuğun arkasında görünmez kalır |

Son satır kasıtlı olarak **olumsuzlama** ile yazıldı (`@taze not path …`,
`location /`): SPA geri dönüşü isteği `/index.html`'e yeniden yazdığı için, yol
listesine dayanan bir eşleme yeniden yazma sırasına bağlı kalır ve `/login` gibi
rotalar başlıksız kalabilir.

## Doğrulama

Dağıtımdan sonra beklenen çıktı:

```bash
curl -sI https://ALAN/                      # 200, text/html, no-cache
curl -sI https://ALAN/surum.json            # 200, application/json, no-cache
curl -sI https://ALAN/sw.js                 # 200, no-cache
curl -sI https://ALAN/manifest.webmanifest  # 200, application/manifest+json, no-cache
curl -sI https://ALAN/assets/index-XXX.js   # 200, immutable
curl -so /dev/null -w '%{http_code}\n' https://ALAN/passport   # 200, 404 DEĞİL
curl -s https://ALAN/surum.json             # yayındaki derleme damgası
```

Son satırı uygulamanın profil ekranının altındaki damgayla karşılaştırın: farklıysa
tarayıcı eski kabuğu çalıştırıyor, aynıysa dağıtım güncel.

`nginx.conf` bu depoda gerçek nginx 1.24 ile ayağa kaldırılıp yukarıdaki yedi kontrolün
tamamı doğrulandı; ayrıca iki gerçek derleme arasında başsız Chromium'la sınandı:
tarayıcıda A derlemesi kuruluyken sunucuya B dağıtıldığında tek yenilemede B'ye geçti.

## Caddy alternatifi

`Caddyfile` aynı kuralları taşır ve Let's Encrypt sertifikasını kendisi alıp yeniler —
port 80/443 yolunda nginx + certbot ikilisinden belirgin biçimde daha az bakım ister.
**Uyarı:** Caddy ikilisi bu geliştirme ortamına indirilemediği için `Caddyfile`
çalıştırılarak doğrulanmadı; kurduktan sonra `caddy validate --config Caddyfile` ve
yukarıdaki yedi `curl` kontrolünü kendiniz koşturun.

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
sudo cp kendi-sunucu/Caddyfile /etc/caddy/Caddyfile
sudo sed -i 's/flagquest\.ornek\.com/GERCEK-ALAN-ADINIZ/' /etc/caddy/Caddyfile
sudo mkdir -p /var/log/caddy && sudo chown caddy:caddy /var/log/caddy
sudo systemctl reload caddy
```

## Bakım

- **Güvenlik yamaları:** `sudo apt install -y unattended-upgrades`.
- **SD kart ömrü:** erişim kayıtları yazma üretir. Kritik değilse `access_log off;`
  ekleyin veya kayıtları USB SSD'ye alın. Uzun vadede Pi'yi SSD'den çalıştırmak en
  sağlıklısıdır.
- **Sürüm budama:** `dagit.sh` son 5 sürümü tutar (`TUT` ile değiştirilir).
- **Yedek:** Pi'de tutulan tek şey statik çıktıdır; kaybı önemsizdir, yeniden
  dağıtılır. Değerli veri Firestore'dadır.

## Bilinen sınırlar

- Uzantısı olan ama diskte bulunmayan bir yol (ör. `/olmayan.png`) SPA geri dönüşü
  yüzünden 404 değil `index.html` döner. `firebase.json`'daki `"source": "**"`
  kuralı da aynı davranışı üretir; tutarlıdır.
- HTTP/2 nginx'te certbot sonrası `listen 443 ssl http2;` ile açılır; HTTP/3 için
  Caddy gerekir.
- Çok oyunculu oyun Firestore'a bağlı olduğundan internet kesildiğinde Pi ayakta
  olsa bile düello ve liderlik çalışmaz.
