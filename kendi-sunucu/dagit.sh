#!/usr/bin/env bash
#
# FlagQuest'i yerelde derleyip Raspberry Pi'ye dağıtır.
#
# Derlemeyi kasıtlı olarak Pi'de değil geliştirme makinesinde yapar: Vite
# derlemesi 1780'den fazla modül dönüştürür ve bir Pi'de hem yavaştır hem de
# 1 GB RAM'li modellerde takılır. Pi yalnız statik dosya servis eder.
#
# Dağıtım atomiktir: yeni derleme ayrı bir sürüm klasörüne kopyalanır, sonra
# `guncel` simgesel bağı tek bir rename(2) ile takas edilir. Böylece yarı
# kopyalanmış bir derleme hiçbir zaman servis edilmez ve geri alma bir
# komuttur.
#
# Kullanım:
#   PI=kullanici@raspberrypi.local ALAN=flagquest.ornek.com ./kendi-sunucu/dagit.sh
#
# Ortam değişkenleri:
#   PI     ssh hedefi (varsayılan flagquest@raspberrypi.local)
#   KOK    Pi üzerindeki kök dizin (varsayılan /srv/flagquest)
#   ALAN   verilirse dağıtım sonrası yayındaki başlıklar doğrulanır
#   TUT    kaç eski sürüm saklanacak (varsayılan 5)

set -euo pipefail

PI="${PI:-flagquest@raspberrypi.local}"
KOK="${KOK:-/srv/flagquest}"
ALAN="${ALAN:-}"
TUT="${TUT:-5}"

cd "$(dirname "$0")/.."

echo "==> Derleniyor"
npm run build

test -f dist/surum.json || { echo "HATA: dist/surum.json yok; derleme sürüm damgası üretmedi." >&2; exit 1; }

KOD=$(sed -n 's/.*"kod": *"\([^"]*\)".*/\1/p' dist/surum.json)
ZAMAN=$(sed -n 's/.*"derleme": *"\([^"]*\)".*/\1/p' dist/surum.json | tr -d ':-' | cut -c1-15)
SURUM="${ZAMAN}-${KOD}"
echo "==> Sürüm: $SURUM"

echo "==> Dizinler hazırlanıyor"
ssh "$PI" "mkdir -p '$KOK/surumler/$SURUM'"

echo "==> Dosyalar gönderiliyor"
rsync -az --delete --chmod=D755,F644 dist/ "$PI:$KOK/surumler/$SURUM/"

echo "==> Simgesel bağ takas ediliyor"
# ln + mv -T: rename(2) atomiktir, istek arası boşluk oluşmaz.
ssh "$PI" "ln -sfn 'surumler/$SURUM' '$KOK/.guncel.yeni' && mv -T '$KOK/.guncel.yeni' '$KOK/guncel'"

echo "==> Eski sürümler budanıyor (son $TUT tutuluyor)"
ssh "$PI" "cd '$KOK/surumler' && ls -1dt */ | tail -n +$((TUT + 1)) | xargs -r rm -rf"

if [ -n "$ALAN" ]; then
  echo "==> Yayın doğrulanıyor: https://$ALAN"
  echo "--- surum.json"
  curl -fsS "https://$ALAN/surum.json"
  echo "--- index.html başlıkları"
  curl -fsSI "https://$ALAN/" | grep -iE '^(HTTP|cache-control|content-type)'
  echo "--- SPA derin bağlantısı (/passport 200 dönmeli)"
  curl -fsS -o /dev/null -w 'HTTP %{http_code}\n' "https://$ALAN/passport"
  echo "--- parmak izli varlık başlığı"
  VARLIK=$(sed -n 's/.*src="\(\/assets\/index-[^"]*\.js\)".*/\1/p' dist/index.html | head -1)
  [ -n "$VARLIK" ] && curl -fsSI "https://$ALAN$VARLIK" | grep -iE '^(HTTP|cache-control)'
fi

echo "==> Bitti. Geri almak için:"
echo "    ssh $PI \"cd $KOK && ls surumler && ln -sfn surumler/<eski> .g && mv -T .g guncel\""
