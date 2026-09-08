#!/bin/bash
# کد را از گیت‌هاب می‌گیرد. پنل (متن، کارها، رمز، آپلود) دست نمی‌خورد.
set -e
cd /root/portfolio
mkdir -p /root/portfolio-backup
cp -a data/site.json /root/portfolio-backup/site.json
cp -a data/config.json /root/portfolio-backup/config.json 2>/dev/null || true
git pull origin main
cp -a /root/portfolio-backup/site.json data/site.json
cp -a /root/portfolio-backup/config.json data/config.json 2>/dev/null || true
systemctl restart portfolio
echo "OK — پنل شما سر جایش است. سایت را Ctrl+F5 کنید."
