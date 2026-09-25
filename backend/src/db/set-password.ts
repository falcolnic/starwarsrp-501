import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./client.js";
import { users } from "./schema.js";
import { hashPassword } from "../services/auth.service.js";

async function run() {
    const [username, newPassword] = process.argv.slice(2);

    if (!username || !newPassword) {
        console.error("Использование: npx tsx src/db/set-password.ts <username> <new-password>");
        process.exit(1);
    }

    const passwordHash = await hashPassword(newPassword);

    const result = await db
        .update(users)
        .set({ passwordHash })
        .where(eq(users.username, username));

    console.log(`Пароль для пользователя "${username}" успешно обновлен.`);
    process.exit(0);
}

run().catch((err) => {
    console.error("Ошибка при обновлении пароля:", err);
    process.exit(1);
});
