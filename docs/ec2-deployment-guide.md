# EC2 Deployment Guide 

Deploy the portfolio-blog (React frontend + Express API + PostgreSQL) to a single
AWS EC2 instance, all running natively. Postgres, the Node API, and the static
frontend live on the same box; Nginx serves the frontend and reverse-proxies
`/api` to the backend.

--

## Architecture on the instance

```
                 Internet (443/80)
                       │
                   ┌───▼────┐
                   │ Nginx  │  serves /var/www/portfolio (static build)
                   │        │  proxies /api/* ──► 127.0.0.1:3000
                   └───┬────┘
                       │
              ┌────────▼─────────┐
              │ Node API (pm2)   │  Express 5, port 3000
              └────────┬─────────┘
                       │ 127.0.0.1:5432
              ┌────────▼─────────┐
              │ PostgreSQL 16    │  native, localhost only
              └──────────────────┘
```

- **Frontend** is a static build (`frontend/dist`). It calls the API with relative
  paths (`/api/...`), so **Nginx must proxy `/api` to the backend** — the Vite dev
  proxy in `vite.config.ts` is dev-only and does not apply in production.
- **Backend** listens on `PORT` (3000) and reads all config from `backend/.env`.
- **Postgres** binds to localhost only — never expose 5432 to the internet.

---

## 0. Prerequisites

- AWS account + a domain you can point at the instance (for HTTPS).
- SSH key pair for the instance.
- Code lives in **two separate git repos** (`frontend/`, `backend/`); the repo
  root is not version-controlled. There is no single repo to clone — deploys
  push your local working tree to the server via **rsync** (see §5). Your SSH key
  is all you need; no server-side clone or GitHub deploy key required.

---

## 1. Launch the EC2 instance

| Setting | Recommendation |
|---|---|
| AMI | Ubuntu Server 24.04 LTS or newer (x86_64) — tested on 26.04 "Resolute" |
| Instance type | **`t3.small` (2 GB RAM)** — `t3.micro` (1 GB) can OOM during the frontend build; if you must use micro, add swap (§2) or build locally |
| Storage | 30 GB gp3, **encrypted** (the 8 GB AMI default is too tight for OS + Postgres + logs) |
| Key pair | Select/create your SSH key |

**Security group (inbound):**

| Type | Port | Source | Purpose |
|---|---|---|---|
| SSH | 22 | Your IP only | Admin access |
| HTTP | 80 | 0.0.0.0/0 | Web + Let's Encrypt challenge |
| HTTPS | 443 | 0.0.0.0/0 | Web |

> Do **not** open 5432 (Postgres) or 3000 (Node). Both stay internal.

Point your domain's **A record** at the instance's public IP (or allocate an
Elastic IP first so the IP survives reboots).

SSH in:

```bash
ssh -i /path/to/key.pem ubuntu@YOUR_INSTANCE_IP
```

---

## 2. Base system setup

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx ufw

# Optional but recommended on small instances: 2 GB swap (prevents build OOM)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**Firewall (ufw):**

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

---

## 3. Install Node.js (current LTS)

Use the newest **LTS** (even-numbered) line. Node 20 reached end-of-life in
April 2026; Node 24 is the current active LTS.

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v          # -> v24.x
```

---

## 4. Install & configure PostgreSQL 16

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

Create the role and database **matching `backend/.env`** (user
`portfolio_blog_admin`, db `portfolio_blog`). Use a strong password in production —
do not reuse the local dev password.

```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE portfolio_blog_admin WITH LOGIN PASSWORD 'CHANGE_ME_STRONG_PASSWORD' CREATEDB;
CREATE DATABASE portfolio_blog OWNER portfolio_blog_admin;
SQL
```

Postgres listens on localhost only by default on Ubuntu — leave it that way.
Verify:

```bash
sudo -u postgres psql -c "\l portfolio_blog"
```

---

## 5. Get the code onto the server (rsync, not git clone)

**This is not a single git repository.** `frontend/` and `backend/` are two
independent repos and the root is not version-controlled:

| Dir | Repo |
|---|---|
| `frontend/` | `github.com/jessebias/portfolio-blog-frontend.git` |
| `backend/`  | `github.com/jessebias/portfolio-blog-backend.git` |

There is no single repo to clone, so deploy by **pushing your local working tree
with `rsync` over SSH**. The frontend is built locally and only its `dist/` is
shipped (faster, avoids OOM on the instance) — the frontend source never lands on
the server. The whole flow is scripted in `deploy.sh` (repo root); see §13.

**First deploy — land the backend source:**

```bash
# On the server: create the target dir
mkdir -p /home/ubuntu/portfolio-blog/backend
```

```bash
# On your laptop, from the repo root: push backend source
# (excludes node_modules, .git, and the server's .env)
rsync -avz -e "ssh -i ~/.ssh/portfolio-blog-prod.pem" \
  --exclude '.git' --exclude 'node_modules' --exclude '.env' \
  backend/ ubuntu@YOUR_INSTANCE_IP:/home/ubuntu/portfolio-blog/backend/

# Install backend deps on the server
ssh -i ~/.ssh/portfolio-blog-prod.pem ubuntu@YOUR_INSTANCE_IP \
  'cd /home/ubuntu/portfolio-blog/backend && npm install --omit=dev'
```

Continue with §6 to create `backend/.env` on the server **before** starting the
backend. The frontend is handled in §8.

---

## 6. Configure backend environment

Create `backend/.env` on the server. **Never commit this file.** Mirror your
local `.env` but with production-grade secrets. Use `backend/example.env` as the
key list.

```bash
nano backend/.env
```

```ini
# Resend (contact form email)
RESEND_API_KEY=your_resend_key
CONTACT_EMAIL=jesse@verta.xyz      # REQUIRED by contactRouter.js — was missing from local .env

# Admin seed (creates the admin login)
ADMIN_NAME=Jesse Bias
ADMIN_EMAIL=jessebias.dev@gmail.com
ADMIN_PASSWORD=use_a_strong_unique_password

# Server
PORT=3000

# PostgreSQL — must match the role/db created in §4
DB_USER=portfolio_blog_admin
DB_HOST=localhost
DB_NAME=portfolio_blog
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
DB_PORT=5432

# JWT — generate a fresh secret, do NOT reuse the dev one
JWT_SECRET=PASTE_OUTPUT_OF_openssl_rand_base64_32
JWT_EXPIRES_IN=24h
```

Generate a fresh JWT secret:

```bash
openssl rand -base64 32
```

> **Notes**
> - `CONTACT_EMAIL` is read by `routes/contactRouter.js`; the contact form fails
>   silently to deliver without it. It is absent from the current local `.env`.
> - `config.js` falls back to insecure placeholder values if vars are unset —
>   always set `JWT_SECRET` and the DB vars explicitly.
> - Self-registration (`POST /api/auth/create-account`) is commented out by
>   design. The admin account is created **only** via the seed script (§7).

---

## 7. Initialize the database schema & seed admin

```bash
cd /home/ubuntu/portfolio-blog/backend

# Creates the `users` and `blogs` tables.
# WARNING: db:init DROPS existing tables first. Run on first deploy only,
# or you will lose all blog/user data.
npm run db:init

# Creates/updates the admin account from ADMIN_* env vars (safe to re-run)
npm run seed:db
```

---

## 8. Build the frontend (locally) and publish it

The frontend source is **not** synced to the server — build it on your laptop and
copy the static `dist/` up into the Nginx web root.

```bash
# On your laptop, from the repo root
npm run build --prefix frontend         # tsc -b && vite build -> frontend/dist

# Ship dist/ via a temp dir, then into the web root with sudo
rsync -avz --delete -e "ssh -i ~/.ssh/portfolio-blog-prod.pem" \
  frontend/dist/ ubuntu@YOUR_INSTANCE_IP:/tmp/portfolio-dist/
ssh -i ~/.ssh/portfolio-blog-prod.pem ubuntu@YOUR_INSTANCE_IP \
  'sudo mkdir -p /var/www/portfolio && sudo rsync -a --delete /tmp/portfolio-dist/ /var/www/portfolio/ && sudo chown -R www-data:www-data /var/www/portfolio'
```

> `deploy.sh` (§13) automates both this and the backend sync for every update.

---

## 9. Run the backend with pm2

`pm2` keeps the Node API alive and restarts it on crash/reboot.

```bash
sudo npm install -g pm2

cd /home/ubuntu/portfolio-blog/backend
pm2 start npm --name portfolio-api -- start    # runs `node index.js`
pm2 save                                       # persist process list
pm2 startup systemd                            # run the printed sudo command to enable on boot
```

Useful commands:

```bash
pm2 status
pm2 logs portfolio-api
pm2 restart portfolio-api
```

Verify the API is up locally:

```bash
curl http://localhost:3000/            # -> "Server is running!"
curl http://localhost:3000/api/blogs   # -> JSON array
```

---

## 10. Configure Nginx (static frontend + API proxy)

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/portfolio;
    index index.html;

    # SPA fallback — React Router handles client-side routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to the Node backend
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable it and reload:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t          # test config
sudo systemctl reload nginx
```

Your site should now load over HTTP at your domain.

---

## 11. Enable HTTPS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot edits the Nginx config to add the 443 server block and HTTP→HTTPS
redirect, and installs a renewal timer. Verify auto-renew:

```bash
sudo certbot renew --dry-run
```

---

## 12. Database backups (do not skip)

This matters far more than Docker vs. bare metal. Nightly `pg_dump`, kept 7 days.

```bash
mkdir -p /home/ubuntu/backups
nano /home/ubuntu/backup-db.sh
```

```bash
#!/usr/bin/env bash
set -euo pipefail
STAMP=$(date +%F)
DEST=/home/ubuntu/backups
sudo -u postgres pg_dump portfolio_blog | gzip > "$DEST/portfolio_blog_$STAMP.sql.gz"
# keep last 7 days
find "$DEST" -name 'portfolio_blog_*.sql.gz' -mtime +7 -delete
```

```bash
chmod +x /home/ubuntu/backup-db.sh
crontab -e
# add:
0 3 * * * /home/ubuntu/backup-db.sh
```

> For real durability, also push the dumps to **S3** (`aws s3 cp`) so a lost
> instance doesn't take the backups with it.

**Restore** (when needed):

```bash
gunzip -c /home/ubuntu/backups/portfolio_blog_YYYY-MM-DD.sql.gz \
  | sudo -u postgres psql portfolio_blog
```

---

## 13. Redeploying after code changes

All updates run from your laptop via `deploy.sh` (repo root). It syncs the backend
source (protecting the server's `.env`), reinstalls deps, restarts pm2, builds the
frontend locally, and publishes `dist/`.

```bash
# One-time: cp deploy.env.example deploy.env, fill in HOST + KEY, chmod +x deploy.sh
./deploy.sh
```

What it does each run:

- **Backend** — `rsync --delete` source (excludes `.git`, `node_modules`, `.env`),
  `npm install --omit=dev`, then `pm2 restart portfolio-api` (starts it on the
  first run if not already running), `pm2 save`.
- **Frontend** — `npm run build` locally, rsync `dist/` into `/var/www/portfolio`.

> The `--exclude '.env'` flag is **critical** — it protects the production secrets
> on the server from being deleted or overwritten by your laptop's tree (which has
> no prod `.env`). Never remove it.
>
> **Never run `npm run db:init` on redeploys** — it drops all tables. Only
> `seed:db` is safe to re-run (it upserts the admin account).

---

## 14. Smoke test checklist

- [ ] `https://yourdomain.com` loads the site over HTTPS (valid cert).
- [ ] Home page blog preview loads posts (`GET /api/blogs` via Nginx proxy).
- [ ] Admin login works at `/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- [ ] Admin dashboard can create / edit / delete a post.
- [ ] Contact form sends (requires `RESEND_API_KEY` + `CONTACT_EMAIL`).
- [ ] `pm2 status` shows `portfolio-api` online; reboot the instance and confirm
      Nginx, Postgres, and the API all come back up.
- [ ] Backup cron produces a `.sql.gz` in `/home/ubuntu/backups`.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Site loads but API 502 | Backend not running / wrong port | `pm2 logs portfolio-api`; confirm it listens on 3000 |
| API up locally, 404 through Nginx | `/api` proxy missing/typo | Recheck §10 `location /api/`, `nginx -t`, reload |
| `Database connection error` on boot | DB creds mismatch or Postgres down | Verify `.env` DB vars vs §4; `systemctl status postgresql` |
| Frontend build killed | Out of memory (micro instance) | Add swap (§2) or build locally and copy `dist/` up |
| Contact form succeeds but no email | `CONTACT_EMAIL` / `RESEND_API_KEY` unset | Set both in `backend/.env`, `pm2 restart` |
| Routes 404 on refresh | SPA fallback missing | Confirm `try_files ... /index.html` in §10 |
```
