  import "dotenv/config";
  import { drizzle } from "drizzle-orm/mysql2";
  import { migrate } from "drizzle-orm/mysql2/migrator";
  import mysql from "mysql2/promise";

  async function run() {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const db = drizzle(connection);

    console.log("Применяю миграции...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Готово.");

    await connection.end();
    process.exit(0);
  }

  run().catch((err) => {
    console.error("Ошибка миграции:", err);
    process.exit(1);
  });
