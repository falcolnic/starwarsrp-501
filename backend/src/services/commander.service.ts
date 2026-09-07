import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { commandersRegistry } from "../db/schema.js";

type CommanderInsert = typeof commandersRegistry.$inferInsert;
type CommanderUpdate = Partial<CommanderInsert>;

export async function getAllCommanders() {
    return await db.select().from(commandersRegistry);
}

export async function createCommander(data: CommanderInsert) {
    const [result] = await db.insert(commandersRegistry).values(data);
    const [created] = await db
        .select()
        .from(commandersRegistry)
        .where(eq(commandersRegistry.id, result.insertId))
        .limit(1);
    return created;
}

export async function updateCommander(id: number, data: CommanderUpdate) {
    const [before] = await db
        .select()
        .from(commandersRegistry)
        .where(eq(commandersRegistry.id, id))
        .limit(1);
    
    if (!before) return null;

    await db.update(commandersRegistry).set(data).where(eq(commandersRegistry.id, id));
    
    const [after] = await db
        .select()
        .from(commandersRegistry)
        .where(eq(commandersRegistry.id, id))
        .limit(1);
        
    return { before, after };
}

export async function deleteCommander(id: number) {
    const [before] = await db
        .select()
        .from(commandersRegistry)
        .where(eq(commandersRegistry.id, id))
        .limit(1);
        
    if (!before) return null;

    await db.delete(commandersRegistry).where(eq(commandersRegistry.id, id));
    return before;
}