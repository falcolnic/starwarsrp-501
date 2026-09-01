import { useState, useEffect } from "react";
import { ChevronDown, TrendingUp, CheckCircle2, Zap, User, BookOpen, Search } from "lucide-react";
import { Link } from "react-router";

import { calcDaysAtRank } from "../../services/botData";
import { useRanks, useRankRequirements } from "../../hooks/useRanks";
import { getNextRank, getRankIndex, evaluateRequirements, type RequirementStatus } from "../../services/promotionRules";

import { InfoBlock } from "../components/promotion/InfoBlock";
import { RankLadder } from "../components/promotion/RankLadder";
import { RequirementRow } from "../components/promotion/RequirementRow";
import { CloneHelmetEasterEgg } from "../components/ui/CloneHelmetEasterEgg";
import { HUDSettings } from "../components/ui/HUDSettings";

interface Soldier {
  cid: string;
  steamId: string | null;
  nickname: string | null;
  rank: string | null;
  rankSince: string | null;
  onlineTotalHours: number;
  onlineSessions: number;
  unitLevel: number;
  callsignOverride: string | null;
  manualCompleted: string[];
}

export function Promotion() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCid, setSelectedCid] = useState<string>("");
  const [dropOpen, setDropOpen] = useState(false);
  
  // NEW: Search query state
  const [searchQuery, setSearchQuery] = useState("");

  const { ranks, loading: ranksLoading } = useRanks();

  useEffect(() => {
    fetch("/api/soldiers", { credentials: "include" })
      .then((res) => res.json())
      .then((data: Soldier[]) => {
        setSoldiers(data);
        if (data.length > 0) setSelectedCid(data[0].cid);
        setLoading(false);
      });
  }, []);

  const soldier = soldiers.find((s) => s.cid === selectedCid);
  const callsign = soldier?.callsignOverride || soldier?.nickname || `CT-${selectedCid}`;
  const currentRankName = soldier?.rank ?? "Рядовой-рекрут";

  const nextRank = getNextRank(ranks, currentRankName);
  const currentIdx = getRankIndex(ranks, currentRankName);
  const daysAtRank = soldier?.rankSince ? calcDaysAtRank(soldier.rankSince) : 0;

  const { requirements: dbRequirements, loading: reqsLoading } = useRankRequirements(nextRank?.id ?? null);

  const requirements: RequirementStatus[] = nextRank
    ? evaluateRequirements(
        dbRequirements,
        {
          totalHours: soldier?.onlineTotalHours ?? 0,
          sessions: soldier?.onlineSessions ?? 0,
          daysAtRank,
          unitLevel: soldier?.unitLevel ?? 0,
        },
        soldier?.manualCompleted ?? []
      )
    : [];

  const completedCount = requirements.filter((r) => r.completed).length;
  const overallPct = requirements.length > 0 ? Math.round((completedCount / requirements.length) * 100) : 100;

  // NEW: Filter soldiers based on search query
  const filteredSoldiers = soldiers.filter((s) => {
    const query = searchQuery.toLowerCase();
    const cs = (s.callsignOverride || s.nickname || "").toLowerCase();
    const cidStr = s.cid.toLowerCase();
    return cidStr.includes(query) || cs.includes(query);
  });

  if (ranksLoading || loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center font-mono">
        СИНХРОНИЗАЦИЯ С СЕТЬЮ ЛЕГИОНА...
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen text-white py-10 px-6 bg-[#050910]">
      <CloneHelmetEasterEgg />
      <div className="fixed inset-0 pointer-events-none bg-[url('/promotion-bg.png')] bg-cover bg-center bg-no-repeat z-0 opacity-40" />
      <HUDSettings />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 pb-20 text-white bg-[#080d17]/95 rounded-none border border-slate-800/60 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="anim-fade-up mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-5 border-b border-slate-800/60 pb-6">
          <div>
            <div className="font-mono text-sm tracking-[0.25em] text-[var(--primary)] mb-2 uppercase">
              501-Й ЭШЛ // ТРЕКЕР ПОВЫШЕНИЙ
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="text-[var(--primary)]" />
              <h1 className="text-2xl lg:text-3xl font-[family:var(--font-display)] tracking-[0.06em] m-0 uppercase text-white">
                Система Повышений
              </h1>
            </div>
          </div>

          <Link to="/promotion/rules" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-800 hover:border-[var(--primary)] bg-slate-900/10 hover:bg-[var(--primary)]/5 text-base text-slate-300 hover:text-white transition-all uppercase tracking-wider rounded-none w-full md:w-auto shrink-0">
            <BookOpen size={21} className="text-[var(--primary)]" />
            <span>Открыть регламент званий</span>
          </Link>
        </div>

        <div className="anim-fade-up mb-6 relative max-w-sm z-20">
          <div className="font-mono text-sm tracking-widest text-[var(--muted-foreground)] mb-2 uppercase">
            Выбрать бойца
          </div>
          <button
            onClick={() => {
              setDropOpen((o) => !o);
              if (!dropOpen) setSearchQuery(""); // Reset search when opening
            }}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-[#0d1829] border border-[var(--border)] text-white cursor-pointer rounded hover:border-[var(--primary)] transition-all duration-150"
          >
            <div className="flex items-center gap-3 text-sm">
              <span className="font-mono text-[var(--primary)] font-bold">CID-{selectedCid}</span>
              <span className="font-display tracking-wider font-semibold">{callsign}</span>
            </div>
            <ChevronDown
              size={16}
              className={`text-[var(--muted-foreground)] transition-transform duration-200 shrink-0 ${
                dropOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropOpen && (
            <div className="absolute top-[105%] left-0 right-0 bg-[#0d1829] border border-[var(--border)] rounded shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col z-50">
              {/* SEARCH INPUT BAR */}
              <div className="p-2 border-b border-[var(--border)]/50 bg-[#080d17]">
                <div className="relative flex items-center">
                  <Search size={14} className="absolute left-3 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Поиск по CID или позывному..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-[var(--border)]/30 rounded py-2 pl-9 pr-3 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </div>

              {/* LIST BODY */}
              <div className="max-h-64 overflow-y-auto">
                {filteredSoldiers.length > 0 ? (
                  filteredSoldiers.map((s) => {
                    const cs = s.callsignOverride || s.nickname || `CT-${s.cid}`;
                    const isActive = s.cid === selectedCid;
                    return (
                      <button
                        key={s.cid}
                        onClick={() => {
                          setSelectedCid(s.cid);
                          setDropOpen(false);
                          setSearchQuery(""); // Clear search on select
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left border-none border-b border-[var(--border)]/20 last:border-0 cursor-pointer text-white transition-colors duration-150 ${
                          isActive ? "bg-[var(--primary)]/15" : "bg-transparent hover:bg-[#121f35]"
                        }`}
                      >
                        <span className="font-mono text-xs text-[var(--primary)]">CID-{s.cid}</span>
                        <span className="font-display text-sm font-semibold truncate">{cs}</span>
                        <span className="font-mono text-[10px] text-[var(--muted-foreground)] ml-auto truncate">
                          {s.rank ?? "—"}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center font-mono text-xs text-[var(--muted-foreground)]">
                    БОЕЦ НЕ НАЙДЕН
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {soldier && (
          <div className="space-y-4">
            <div className="z-1 bg-[#0d1829] border border-[var(--border)] rounded-md p-5 shadow-md">
              <div className="font-mono text-sm tracking-widest text-[var(--muted-foreground)] mb-3 uppercase">
                Лестница Повышений
              </div>
              <RankLadder ranks={ranks} currentRankName={currentRankName} nextRank={nextRank} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <InfoBlock label="Позывной" value={callsign} />
              <InfoBlock label="Тек. Звание" value={currentRankName} accent />
              <InfoBlock label="Сле. Звание" value={nextRank?.name ?? "МАКСИМУМ"} />
              <InfoBlock label="Уровень" value={`${currentIdx < 0 ? "?" : currentIdx + 1} / ${ranks.length}`} mono />
              <InfoBlock label="Дней в звании" value={String(daysAtRank)} mono />
              <InfoBlock label="Всего часов" value={`${soldier.onlineTotalHours}ч`} mono />
              <InfoBlock label="Сессий" value={String(soldier.onlineSessions)} mono />
            </div>

            {nextRank ? (
              <div className="bg-[#0d1829] border border-[var(--border)] rounded-md overflow-hidden shadow-lg">
                <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between gap-4 flex-wrap bg-[#080d17]/50">
                  <div>
                    <div className="font-mono text-sm tracking-widest text-[var(--muted-foreground)] mb-1 uppercase">
                      Требования для повышения
                    </div>
                    <div className="font-display text-lg tracking-wide uppercase font-bold text-white">
                      {currentRankName} → {nextRank.name}
                    </div>
                  </div>

                  {reqsLoading ? (
                    <div className="font-mono text-xs text-slate-400">Загрузка требований...</div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-sm tracking-wider text-right">
                        <span className={overallPct >= 100 ? "text-[#2ECC71] font-bold" : "text-[var(--primary)]"}>
                          {completedCount}/{requirements.length}
                        </span>{" "}
                        ВЫПОЛНЕНО
                      </div>
                      <svg width="48" height="48" viewBox="0 0 48 48" className="shrink-0 select-none">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="3" />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke={overallPct >= 100 ? "#2ECC71" : "var(--primary)"}
                          strokeWidth="3"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - overallPct / 100)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 24 24)"
                          style={{
                            filter: `drop-shadow(0 0 4px ${
                              overallPct >= 100 ? "rgba(46,204,113,0.5)" : "rgba(61,111,196,0.4)"
                            })`,
                          }}
                        />
                        <text x="24" y="28" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="white" fontWeight="700">
                          {overallPct}%
                        </text>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 bg-[#080d17]/30 border-b border-[var(--border)] flex items-center gap-5 flex-wrap">
                  <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--muted-foreground)] tracking-wider">
                    <Zap size={10} className="text-[var(--primary)]" />
                    <span>АВТО — данные бота</span>
                    <User size={10} className="text-[var(--muted-foreground)]" />
                    <span>РУЧНОЕ — утверждение старших</span>
                  </div>
                </div>

                <div className="divide-y divide-[var(--border)]/30">
                  {requirements.map((rs) => (
                    <RequirementRow key={rs.requirement.id} rs={rs} />
                  ))}
                </div>

                {overallPct >= 100 && (
                  <div className="p-4 bg-[#2ecc71]/10 border-t border-[#2ecc71]/25 flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-[#2ECC71] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-display text-sm font-bold tracking-wider text-[#2ECC71] uppercase">
                        Все требования выполнены
                      </div>
                      <div className="font-mono text-[11px] text-[var(--muted-foreground)] mt-1 leading-relaxed">
                        {callsign} готов к получению звания {nextRank.name}. Запросите зачисление у Высшего командования.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0d1829] border border-[#f5c518]/30 rounded-md p-8 text-center shadow-lg">
                <div className="text-2xl mb-2 text-[#F5C518]">★</div>
                <div className="font-display text-base md:text-lg font-bold tracking-widest text-[#F5C518] uppercase">
                  Максимальное звание достигнуто
                </div>
                <div className="font-mono text-sm text-[var(--muted-foreground)] mt-2">
                  {callsign} носит высшее звание в 501-м Элитном Штурмовом Легионе.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
