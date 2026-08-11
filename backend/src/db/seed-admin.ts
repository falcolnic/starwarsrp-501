import "dotenv/config";
import { db } from "./client.js";
import { users } from "./schema.js";
import { hashPassword } from "../services/auth.service.js";

async function run() {
  const [username, password, displayName] = process.argv.slice(2);

  if (!username || !password || !displayName) {
    console.error("Использование: npx tsx src/db/seed-admin.ts <username> <password> <displayName>");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  await db.insert(users).values({
    username,
    passwordHash,
    displayName,
    role: "superadmin",
  });

  console.log(`Суперадмин "${username}" создан.`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Ошибка создания администратора:", err);
  process.exit(1);
});
