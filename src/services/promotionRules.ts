export const RANK_LADDER = [
  "Рядовой-рекрут",
  "Рядовой",
  "Старший рядовой",
  "Специалист",
  "Капрал",
  "Сержант",
  "Штаб-сержант",
  "Сержант первого класса",
  "Мастер сержант",
  "Первый сержант",
  "Сержант-майор",
  "Команд сержант-майор",
  "Сержант-майор сухопутных войск",
  "Младший лейтенант",
  "Лейтенант",
  "Капитан",
  "Майор",
  "Подполковник",
  "Полковник",
  "Командир",
  "Командир первого класса",
  "Клон Коммандер",
  "Клон Маршал",
  "Советник",
] as const;

export type Rank = typeof RANK_LADDER[number];

export interface AutoRequirement {
  id: string;
  label: string;
  type: "auto";
  metric: "totalHours" | "sessions" | "daysAtRank";
  threshold: number;
}
export interface ManualRequirement {
  id: string;
  label: string;
  type: "manual";
}
export type Requirement = AutoRequirement | ManualRequirement;

export const RANK_REQUIREMENTS: Record<string, Requirement[]> = {
  "Рядовой": [
    { id: "hours_5",    label: "5+ часов на сервере", type: "auto", metric: "totalHours", threshold: 5 },
    { id: "sessions_3", label: "3+ активные сессии", type: "auto", metric: "sessions",   threshold: 3 },
    { id: "days_3",     label: "3+ дней в звании",   type: "auto", metric: "daysAtRank", threshold: 3 },
    { id: "charter_read", label: "Ознакомление с уставом", type: "manual" },
  ],
  "Старший рядовой": [
    { id: "hours_15",   label: "15+ часов на сервере", type: "auto", metric: "totalHours", threshold: 15 },
    { id: "sessions_8", label: "8+ активных сессий",   type: "auto", metric: "sessions",   threshold: 8 },
    { id: "days_7",     label: "7+ дней в звании",     type: "auto", metric: "daysAtRank", threshold: 7 },
    { id: "basic_drill", label: "Базовая строевая подготовка", type: "manual" },
  ],
  "Специалист": [
    { id: "hours_30",    label: "30+ часов на сервере", type: "auto", metric: "totalHours", threshold: 30 },
    { id: "sessions_15", label: "15+ активных сессий",  type: "auto", metric: "sessions",   threshold: 15 },
    { id: "days_14",     label: "14+ дней в звании",    type: "auto", metric: "daysAtRank", threshold: 14 },
    { id: "basic_drill", label: "Базовая строевая подготовка", type: "manual" },
    { id: "weapons_cert", label: "Зачёт по вооружению", type: "manual" },
  ],
  "Капрал": [
    { id: "hours_50",    label: "50+ часов на сервере", type: "auto", metric: "totalHours", threshold: 50 },
    { id: "sessions_25", label: "25+ активных сессий",  type: "auto", metric: "sessions",   threshold: 25 },
    { id: "days_21",     label: "21+ день в звании",    type: "auto", metric: "daysAtRank", threshold: 21 },
    { id: "weapons_cert", label: "Зачёт по вооружению", type: "manual" },
    { id: "tactical_basics", label: "Тактические основы", type: "manual" },
  ],
  "Сержант": [
    { id: "hours_80",    label: "80+ часов на сервере", type: "auto", metric: "totalHours", threshold: 80 },
    { id: "sessions_40", label: "40+ активных сессий",  type: "auto", metric: "sessions",   threshold: 40 },
    { id: "days_30",     label: "30+ дней в звании",    type: "auto", metric: "daysAtRank", threshold: 30 },
    { id: "tactical_basics", label: "Тактические основы", type: "manual" },
    { id: "squad_rec",   label: "Рекомендация ком. отделения", type: "manual" },
  ],
  "Штаб-сержант": [
    { id: "hours_120",   label: "120+ часов на сервере", type: "auto", metric: "totalHours", threshold: 120 },
    { id: "sessions_60", label: "60+ активных сессий",   type: "auto", metric: "sessions",   threshold: 60 },
    { id: "days_30",     label: "30+ дней в звании",     type: "auto", metric: "daysAtRank", threshold: 30 },
    { id: "leadership_fundamentals", label: "Основы командования", type: "manual" },
    { id: "squad_rec",   label: "Рекомендация ком. взвода", type: "manual" },
  ],
  "Сержант первого класса": [
    { id: "hours_180",   label: "180+ часов на сервере", type: "auto", metric: "totalHours", threshold: 180 },
    { id: "sessions_90", label: "90+ активных сессий",   type: "auto", metric: "sessions",   threshold: 90 },
    { id: "days_45",     label: "45+ дней в звании",     type: "auto", metric: "daysAtRank", threshold: 45 },
    { id: "leadership_fundamentals", label: "Основы командования", type: "manual" },
    { id: "tactical_cert", label: "Тактическая аттестация", type: "manual" },
  ],
  "Мастер сержант": [
    { id: "hours_250",    label: "250+ часов на сервере", type: "auto", metric: "totalHours", threshold: 250 },
    { id: "sessions_120", label: "120+ активных сессий",  type: "auto", metric: "sessions",   threshold: 120 },
    { id: "days_60",      label: "60+ дней в звании",     type: "auto", metric: "daysAtRank", threshold: 60 },
    { id: "tactical_cert", label: "Тактическая аттестация", type: "manual" },
    { id: "officer_rec",  label: "Рекомендация офицера",  type: "manual" },
  ],
  "Первый сержант": [
    { id: "hours_320",    label: "320+ часов на сервере", type: "auto", metric: "totalHours", threshold: 320 },
    { id: "sessions_150", label: "150+ активных сессий",  type: "auto", metric: "sessions",   threshold: 150 },
    { id: "days_60",      label: "60+ дней в звании",     type: "auto", metric: "daysAtRank", threshold: 60 },
    { id: "officer_rec",  label: "Рекомендация офицера",  type: "manual" },
    { id: "advanced_tactics", label: "Продвинутая тактика", type: "manual" },
  ],
  "Сержант-майор": [
    { id: "hours_400",    label: "400+ часов на сервере", type: "auto", metric: "totalHours", threshold: 400 },
    { id: "sessions_180", label: "180+ активных сессий",  type: "auto", metric: "sessions",   threshold: 180 },
    { id: "days_75",      label: "75+ дней в звании",     type: "auto", metric: "daysAtRank", threshold: 75 },
    { id: "advanced_tactics", label: "Продвинутая тактика", type: "manual" },
    { id: "hc_endorsement", label: "Одобрение Высшего командования", type: "manual" },
  ],
  "Команд сержант-майор": [
    { id: "hours_500",    label: "500+ часов на сервере", type: "auto", metric: "totalHours", threshold: 500 },
    { id: "sessions_220", label: "220+ активных сессий",  type: "auto", metric: "sessions",   threshold: 220 },
    { id: "days_90",      label: "90+ дней в звании",     type: "auto", metric: "daysAtRank", threshold: 90 },
    { id: "hc_endorsement", label: "Одобрение Высшего командования", type: "manual" },
  ],
  "Сержант-майор сухопутных войск": [
    { id: "hours_600",    label: "600+ часов на сервере", type: "auto", metric: "totalHours", threshold: 600 },
    { id: "sessions_280", label: "280+ активных сессий",  type: "auto", metric: "sessions",   threshold: 280 },
    { id: "days_120",     label: "120+ дней в звании",    type: "auto", metric: "daysAtRank", threshold: 120 },
    { id: "officer_exam", label: "Офицерский экзамен",    type: "manual" },
    { id: "hc_endorsement", label: "Одобрение Высшего командования", type: "manual" },
  ],
  "Младший лейтенант": [
    { id: "hours_700",    label: "700+ часов на сервере", type: "auto", metric: "totalHours", threshold: 700 },
    { id: "sessions_320", label: "320+ активных сессий",  type: "auto", metric: "sessions",   threshold: 320 },
    { id: "days_120",     label: "120+ дней в звании",    type: "auto", metric: "daysAtRank", threshold: 120 },
    { id: "officer_exam", label: "Офицерский экзамен",    type: "manual" },
    { id: "command_trial", label: "Испытание командованием", type: "manual" },
    { id: "hc_endorsement", label: "Одобрение ВК",        type: "manual" },
  ],
  "Лейтенант": [
    { id: "hours_800",    label: "800+ часов на сервере", type: "auto", metric: "totalHours", threshold: 800 },
    { id: "sessions_370", label: "370+ активных сессий",  type: "auto", metric: "sessions",   threshold: 370 },
    { id: "days_150",     label: "150+ дней в звании",    type: "auto", metric: "daysAtRank", threshold: 150 },
    { id: "officer_exam", label: "Офицерский экзамен",    type: "manual" },
    { id: "strategic_cert", label: "Стратегическая сертификация", type: "manual" },
    { id: "hc_endorsement", label: "Одобрение ВК",        type: "manual" },
  ],
};

export function getNextRank(currentRank: string): Rank | null {
  const idx = RANK_LADDER.indexOf(currentRank as Rank);
  if (idx === -1 || idx === RANK_LADDER.length - 1) return null;
  return RANK_LADDER[idx + 1];
}
export function getRankIndex(rank: string): number {
  return RANK_LADDER.indexOf(rank as Rank);
}

export interface RequirementStatus {
  requirement: Requirement;
  completed: boolean;
  current?: number;
  target?: number;
}

export function evaluateRequirements(
  nextRank: Rank,
  botData: { totalHours: number; sessions: number; daysAtRank: number },
  manualCompleted: string[]
): RequirementStatus[] {
  const reqs = RANK_REQUIREMENTS[nextRank] ?? [];
  return reqs.map(req => {
    if (req.type === "auto") {
      const current = botData[req.metric];
      return { requirement: req, completed: current >= req.threshold, current, target: req.threshold };
    }
    return { requirement: req, completed: manualCompleted.includes(req.id) };
  });
}
