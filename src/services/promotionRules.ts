import { DbRank, DbRankRequirement } from "./rankService";

export interface RequirementStatus {
  requirement: DbRankRequirement;
  completed: boolean;
  current?: number;
  target?: number;
}

export function getNextRank(ranks: DbRank[], currentRankName: string): DbRank | null {
  const idx = ranks.findIndex((r) => r.name === currentRankName);
  if (idx === -1 || idx === ranks.length - 1) return null;
  return ranks[idx + 1];
}

export function getRankIndex(ranks: DbRank[], currentRankName: string): number {
  return ranks.findIndex((r) => r.name === currentRankName);
}

export function evaluateRequirements(
  requirements: DbRankRequirement[],
  botData: { totalHours: number; sessions: number; daysAtRank: number; unitLevel?: number },
  manualCompleted: string[]
): RequirementStatus[] {
  return requirements.map((req) => {
    if (req.type === "auto" && req.metric && req.threshold !== null) {
      const metricKey = req.metric as keyof typeof botData;
      const current = botData[metricKey] ?? 0;
      return {
        requirement: req,
        completed: current >= req.threshold,
        current,
        target: req.threshold,
      };
    }

    const isCompleted = manualCompleted.includes(String(req.id));
    return {
      requirement: req,
      completed: isCompleted,
    };
  });
}
