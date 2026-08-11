# 501st Backend

Node.js + Express + Drizzle ORM (MySQL) бекенд для сайту 501-го легіону.
Окремий сервіс від фронтенду — деплоїться як окремий проєкт на Vercel.

## Локальний запуск

1. Встановіть залежності:
   ```bash
   npm install
   ```

2. Скопіюйте `.env.example` в `.env` і заповніть значення (дані з вашої
   хостинг-панелі — host/user/password/database вже є в phpMyAdmin):
   ```bash
   cp .env.example .env
   ```

3. Згенеруйте SQL-міграції зі схеми (`src/db/schema.ts`):
   ```bash
   npm run db:generate
   ```
   Це створить файли в папці `drizzle/` — подивіться на них, це просто
   `CREATE TABLE ...` під вашу схему.

4. Застосуйте міграції до бази даних:
   ```bash
   npm run db:migrate
   ```

5. Створіть першого супер-адміна (без цього нікуди не залогінитесь):
   ```bash
   npx tsx src/db/seed-admin.ts your_login your_password "Ваше имя"
   ```

6. Запустіть сервер локально:
   ```bash
   npm run dev
   ```
   Бекенд підніметься на `http://localhost:4000`.

## Перевірка, що все працює

```bash
curl http://localhost:4000/api/health
# {"ok":true}

curl http://localhost:4000/api/ranks
# [] (порожньо, поки немає жодного звання)

curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_login","password":"your_password"}' \
  -c cookies.txt

curl http://localhost:4000/api/auth/me -b cookies.txt
```

## Деплой на Vercel

1. Створіть **окремий** проєкт на Vercel саме для цієї папки `backend/`
   (не той самий проєкт, що фронтенд).
2. У Environment Variables проєкту додайте всі змінні з `.env` —
   `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`,
   `SESSION_SECRET`, `FRONTEND_ORIGIN` (справжній домен фронтенду).
3. Деплойте — Vercel сам підхопить `vercel.json` і направить усі
   запити `/api/*` в `api/index.ts`.
4. Перевірте: `https://ваш-бекенд.vercel.app/api/health`.

## Підключення фронтенду

У React-коді фронтенду замініть прямі імпорти з `data/*.ts` на fetch-запити,
наприклад:

```ts
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ranks`, {
  credentials: "include", // обов'язково — інакше cookie сесії не піде
});
const ranks = await res.json();
```

У `.env` фронтенду (Vite):
```
VITE_API_URL=https://ваш-бекенд.vercel.app
```

## Структура проєкту

```
src/
  db/           — схема таблиць, підключення, міграції
  services/     — бізнес-логіка (ranks, documents, users, auth, audit)
  middleware/   — attachUser, requireAuth, requireRole (RBAC)
  routes/       — HTTP-шар: public (без авторизації), auth, admin (захищені)
  app.ts        — збірка Express-застосунку
  server.ts     — точка входу для локального запуску
api/
  index.ts      — точка входу для Vercel Functions
```

## Ролі

- **user** — звичайний відвідувач (поки без публічної реєстрації)
- **admin** — може редагувати звання й документи
- **superadmin** — усе, що admin, + керування ролями інших користувачів

Перший супер-адмін створюється вручну через `seed-admin.ts` — публічної
реєстрації немає навмисно, щоб адмінку не міг створити собі хтось сторонній.

## Що ще не реалізовано (наступні кроки)

- Steam OAuth (згадувалось як майбутнє — зараз просто логін/пароль)
- Rate limiting на `/api/auth/login` (захист від перебору паролів)
- Ендпоінти для `promotion.manualCompleted` (галочки старшого офіцера
  по ручних вимогах до підвищення) — структура під це вже є в
  `rank_requirements`, залишилось додати таблицю зв'язку з конкретним бійцем
