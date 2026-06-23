# S3 backup push — TODO

**Status:** open — deferred 2026-06-22. Nightly **local** DB backups are already
live (`/home/ubuntu/backup-db.sh`, cron `0 3 * * *`, 7-day rolling, verified
producing valid `pg_dump` gzips). This adds an **off-box copy to S3** so a lost
instance doesn't take its backups with it. Uses an **IAM role on the instance**
(no access keys on disk).

Live infra ref: instance `i-00d8af39946af8513`, region `ap-northeast-1`,
EIP `54.178.67.202`.

## Part A — Create the S3 bucket (AWS console)
1. **S3 → Create bucket**
2. **Name** (globally unique): `jessebias-portfolio-db-backups`
3. **Region:** `ap-northeast-1` (same as the instance)
4. Leave **Block all public access ON** (private backups)
5. (Optional) enable **Bucket Versioning**
6. Create.

## Part B — IAM role so the instance can write to it

**B1 — Create the policy:** IAM → Policies → Create policy → JSON, paste (adjust
bucket name if changed):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BackupWrite",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::jessebias-portfolio-db-backups",
        "arn:aws:s3:::jessebias-portfolio-db-backups/*"
      ]
    }
  ]
}
```
Name: `portfolio-backup-s3-write` → Create. (Least privilege — this one bucket only.)

**B2 — Create the role:** IAM → Roles → Create role → Trusted entity **AWS service
→ EC2** → Next → attach `portfolio-backup-s3-write` → name
`portfolio-blog-prod-backup-role` → Create.

**B3 — Attach to the instance:** EC2 → Instances → select `i-00d8af39946af8513`
→ Actions → Security → Modify IAM role → choose `portfolio-blog-prod-backup-role`
→ Update.

## Part C — Install the AWS CLI (on the box)
```bash
sudo apt install -y awscli
which aws && aws --version   # note the path, usually /usr/bin/aws
```

## Part D — Verify the role works (on the box)
```bash
aws sts get-caller-identity        # shows the assumed role, no creds needed
echo "test $(date)" > /tmp/s3test.txt
aws s3 cp /tmp/s3test.txt s3://jessebias-portfolio-db-backups/test.txt
aws s3 ls s3://jessebias-portfolio-db-backups/
# cleanup:
aws s3 rm s3://jessebias-portfolio-db-backups/test.txt
```
If upload + list succeed, the role is wired correctly.

## Part E — Add the S3 push to the backup script
```bash
nano /home/ubuntu/backup-db.sh
```
Replace contents with:
```bash
#!/usr/bin/env bash
set -euo pipefail
STAMP=$(date +%F)
DEST=/home/ubuntu/backups
BUCKET=jessebias-portfolio-db-backups
FILE="portfolio_blog_$STAMP.sql.gz"

# 1. local dump
sudo -u postgres pg_dump portfolio_blog | gzip > "$DEST/$FILE"

# 2. off-box copy to S3
/usr/bin/aws s3 cp "$DEST/$FILE" "s3://$BUCKET/db-backups/$FILE"

# 3. prune local copies older than 7 days (S3 retention via lifecycle rule)
find "$DEST" -name 'portfolio_blog_*.sql.gz' -mtime +7 -delete
```
> Full path `/usr/bin/aws` is used because cron has a minimal PATH. If `which aws`
> showed a different path, use that instead.

Test end to end:
```bash
/home/ubuntu/backup-db.sh
aws s3 ls s3://jessebias-portfolio-db-backups/db-backups/   # expect today's dump
```

## Part F (optional) — Auto-expire old S3 backups
S3 → bucket → Management → Create lifecycle rule → prefix `db-backups/` →
Expire current versions after ~90 days.

## When resuming
Verify Part D (`get-caller-identity` + `s3 ls`) before trusting the nightly run —
the IAM role is the most likely thing to need a tweak.
