import { db } from "../db/client.js";
import { auditLogs } from "../db/schema.js";

interface LogParams {
  userId: number;
  action: "create" | "update" | "delete";
  entityType: string;
  entityId: string | number;
  before?: unknown;
  after?: unknown;
}

// Викликається з кожного admin-роута після успішної зміни даних.
// Не кидає помилку назовні при збої запису логу — сама дія в БД
// вже виконана, втрата запису аудиту не повинна ламати відповідь користувачу,
// але варто залогувати проблему на сервері для розслідування пізніше.
export async function logAudit(params: LogParams) {
  try {
    await db.insert(auditLogs).values({
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: String(params.entityId),
      beforeData: params.before ?? null,
      afterData: params.after ?? null,
    });
  } catch (err) {
    console.error("Не удалось записать audit log:", err);
  }
}
