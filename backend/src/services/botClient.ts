export interface BotPlayerLookup {
    cid: string;
    nickname: string;
    rank: string;
    rankSince: string;
    onlineTotalHours: number;
    onlineSessions: number;
    unitLevel: number;
}

export async function lookupPlayerBySteamId(steamId: string): Promise<BotPlayerLookup | null> {
    // TODO: заменить на реальный вызов API бота, например:
    // const res = await fetch(`${process.env.BOT_API_URL}/players/by-steam/${steamId}`, {
    //   headers: { "x-bot-key": process.env.BOT_API_KEY! },
    // });
    // if (!res.ok) return null;
    // return res.json();

    console.warn(`[botClient] MOCK: lookupPlayerBySteamId(${steamId}) — реальный бот ещё не подключен`);
    return null;
}
