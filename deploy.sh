#!/usr/bin/env bash
# Deploy portfolio-blog to the production server via rsync.
#
# Server host + SSH key live in deploy.env (gitignored) so this script can be
# public with no hardcoded infra. First time:
#   cp deploy.env.example deploy.env   # then fill in HOST and KEY
#
# rsync pushes the local working tree (git-independent); the frontend is built
# locally and only dist/ is shipped. Run from the repo root: ./deploy.sh
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"

# --- load gitignored deploy config ---
if [ -f "$SRC/deploy.env" ]; then
  set -a; . "$SRC/deploy.env"; set +a
fi
: "${HOST:?Missing HOST — copy deploy.env.example to deploy.env and set it}"
: "${KEY:?Missing KEY — copy deploy.env.example to deploy.env and set it}"
KEY="${KEY/#\~/$HOME}"   # expand a leading ~ to an absolute path
REMOTE_APP=/home/ubuntu/portfolio-blog

echo "==> Backend: sync source (protecting .env), install deps, (re)start pm2"
rsync -avz --delete -e "ssh -i $KEY" \
  --exclude '.git' --exclude 'node_modules' --exclude '.env' \
  "$SRC/backend/" "$HOST:$REMOTE_APP/backend/"
ssh -i "$KEY" "$HOST" \
  "cd $REMOTE_APP/backend && npm install --omit=dev && (pm2 restart portfolio-api || pm2 start npm --name portfolio-api -- start) && pm2 save"

echo "==> Frontend: build locally, publish dist/"
( cd "$SRC/frontend" && npm run build )
rsync -avz --delete -e "ssh -i $KEY" "$SRC/frontend/dist/" "$HOST:/tmp/portfolio-dist/"
ssh -i "$KEY" "$HOST" \
  "sudo mkdir -p /var/www/portfolio && sudo rsync -a --delete /tmp/portfolio-dist/ /var/www/portfolio/ && sudo chown -R www-data:www-data /var/www/portfolio"

echo "==> Done."
