// Bot data adapter — replace fetchBotData() body to call your real bot endpoint.
// All consumers import from this file so changing the source is a one-line change.

export interface BotOnlineData {
  totalHours: number;
  totalRaw: string;
  sessions: number;
  since: string;
  firstSeen: string;
  lastSeen: string;
}

export interface BotRecentSession {
  date: string;
  duration: string;
}

export interface BotSoldierData {
  cid: string;
  nickname: string;
  rank: string;
  steamId: string;
  rankSince: string;
  online: BotOnlineData;
  recentSessions: BotRecentSession[];
}

const MOCK_BOT_DATA: BotSoldierData[] = [
  {
    cid: "0641",
    nickname: "Loader-D4",
    rank: "Клон Маршал",
    steamId: "76561198301944951",
    rankSince: "01.09.2024",
    online: { totalHours: 892, totalRaw: "37д 4ч 12м", sessions: 312, since: "01.03.2024", firstSeen: "01.03.2024", lastSeen: "08.07.2026" },
    recentSessions: [
      { date: "08.07.2026", duration: "3ч 42м" },
      { date: "07.07.2026", duration: "2ч 15м" },
      { date: "05.07.2026", duration: "4ч 01м" },
      { date: "03.07.2026", duration: "1ч 50м" },
      { date: "01.07.2026", duration: "3ч 22м" },
    ],
  },
  {
    cid: "0312",
    nickname: "Torch-K7",
    rank: "Капитан",
    steamId: "76561198045672301",
    rankSince: "10.02.2025",
    online: { totalHours: 347, totalRaw: "14д 11ч 0м", sessions: 156, since: "15.06.2024", firstSeen: "15.06.2024", lastSeen: "09.07.2026" },
    recentSessions: [
      { date: "09.07.2026", duration: "2ч 10м" },
      { date: "06.07.2026", duration: "1ч 55м" },
      { date: "04.07.2026", duration: "3ч 30м" },
      { date: "02.07.2026", duration: "2ч 05м" },
      { date: "30.06.2026", duration: "1ч 40м" },
    ],
  },
  {
    cid: "0128",
    nickname: "Viper-A9",
    rank: "Лейтенант",
    steamId: "76561198112345678",
    rankSince: "20.11.2024",
    online: { totalHours: 148, totalRaw: "6д 4ч 0м", sessions: 72, since: "22.09.2024", firstSeen: "22.09.2024", lastSeen: "28.06.2026" },
    recentSessions: [
      { date: "28.06.2026", duration: "1ч 20м" },
      { date: "25.06.2026", duration: "2ч 05м" },
      { date: "20.06.2026", duration: "1ч 45м" },
    ],
  },
];

export async function fetchBotData(): Promise<BotSoldierData[]> {
  // Replace with: return fetch('/api/bot-soldiers').then(r => r.json());
  return Promise.resolve(MOCK_BOT_DATA);
}

export async function fetchBotSoldier(cid: string): Promise<BotSoldierData | null> {
  const data = await fetchBotData();
  return data.find(s => s.cid === cid) ?? null;
}

export function calcDaysAtRank(rankSince: string): number {
  const [day, month, year] = rankSince.split('.').map(Number);
  const date = new Date(year, month - 1, day);
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}
