# 501st Backend

Node.js + Express + Drizzle ORM (MySQL) backend for the 501st Legion website.
Deployed as a separate project from the frontend (Vercel).

## Quick Start

```bash
npm install
cp .env.example .env        # fill in DB credentials (see hosting panel/phpMyAdmin)
npm run db:generate         # generate SQL migrations from src/db/schema.ts
npm run db:migrate          # apply migrations
npx tsx src/db/seed-admin.ts your_login your_password "Your Name"
npm run dev                 # runs on http://localhost:4000
```

## Test It Works

```bash
curl http://localhost:4000/api/health
# {"ok":true}

curl http://localhost:4000/api/ranks
# []

curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_login","password":"your_password"}' \
  -c cookies.txt

curl http://localhost:4000/api/auth/me -b cookies.txt
```

## Roles

- **user** — regular visitor (no public registration yet)
- **admin** — can edit ranks and documents
- **superadmin** — admin rights + manage other users' roles

The first superadmin is created manually via `seed-admin.ts`. Public registration is intentionally disabled so no one can self-create an admin account.
