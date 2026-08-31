## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Deploy to Vercel

1. Create a **separate** Vercel project pointing at the `backend/` folder.
2. Add env vars: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `SESSION_SECRET`, `FRONTEND_ORIGIN`.
3. Deploy — `vercel.json` routes all `/api/*` requests to `api/index.ts`.
4. Verify: `https://your-backend.vercel.app/api/health`.

## Connect the Frontend

Replace direct imports from `data/*.ts` with fetch calls:

```ts
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ranks`, {
  credentials: "include", // required for session cookies
});
const ranks = await res.json();
```

Frontend `.env` (Vite):
```
VITE_API_URL=https://your-backend.vercel.app
```
