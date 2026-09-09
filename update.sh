#!/bin/bash
# کد را از گیت‌هاب می‌گیرد. پنل دست نمی‌خورد.
cd /root/portfolio || exit 1
mkdir -p /root/portfolio-backup
cp -a data/site.json /root/portfolio-backup/site.json
cp -a data/config.json /root/portfolio-backup/config.json 2>/dev/null || true
git pull origin main
python3 -m pip install -q -r requirements.txt --break-system-packages >/dev/null 2>&1 || apt-get install -y -qq python3-pil >/dev/null 2>&1 || true
cp -a /root/portfolio-backup/site.json data/site.json
cp -a /root/portfolio-backup/config.json data/config.json 2>/dev/null || true
systemctl restart portfolio
echo "OK — پنل شما سر جایش است. سایت را Ctrl+F5 کنید."
