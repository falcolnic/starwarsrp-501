import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Zap, User, ChevronDown, TrendingUp } from "lucide-react";
import { fetchBotData, calcDaysAtRank, type BotSoldierData } from "../../services/botData";
import { RANK_LADDER, getNextRank, getRankIndex, evaluateRequirements, type RequirementStatus, type Rank } from "../../services/promotionRules";
import rosterRaw from "../../data/roster.json";
import type { RosterManual } from "../components/FighterModal";

const rosterManual = rosterRaw as RosterManual[];

/* ── Compact rank node dots for 24-rank ladder (horizontal scroll) ── */
function RankLadder({ currentRank, nextRank }: { currentRank: string; nextRank: Rank | null }) {
  const currentIdx = getRankIndex(currentRank);
  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "flex-start", minWidth: 900 }}>
        {RANK_LADDER.map((rank, i) => {
          const isPast = i < currentIdx, isCurrent = i === currentIdx, isNext = nextRank === rank;
          const nodeSize = isCurrent ? 16 : 11;
          return (
            <div key={rank} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1, minWidth: 0 }}>
                {/* Number badge */}
                {isCurrent && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", color: "#F5C518", letterSpacing: "0.06em", marginBottom: 2 }}>
                    ТЫ
                  </div>
                )}
                {/* Diamond node */}
                <div title={rank} style={{
                  width: nodeSize, height: nodeSize, flexShrink: 0,
                  background: isPast ? "var(--primary)" : isCurrent ? "#F5C518" : isNext ? "rgba(61,111,196,0.35)" : "rgba(13,24,41,0.7)",
                  border: `${isCurrent ? 2 : 1.5}px solid ${isPast ? "var(--primary)" : isCurrent ? "#F5C518" : isNext ? "var(--primary)" : "rgba(61,111,196,0.2)"}`,
                  transform: "rotate(45deg)",
                  boxShadow: isCurrent ? "0 0 14px #F5C518, 0 0 4px #F5C518" : isPast ? "0 0 5px rgba(61,111,196,0.35)" : "none",
                  animation: isCurrent ? "border-glow 2s ease-in-out infinite" : "none",
                }} />
                {/* Rank label */}
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.44rem", letterSpacing: "0.02em", textAlign: "center", lineHeight: 1.25,
                  color: isCurrent ? "#F5C518" : isPast ? "var(--primary)" : isNext ? "var(--foreground)" : "rgba(143,163,192,0.3)",
                  overflow: "hidden", maxWidth: "100%", padding: "0 1px",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>
                  {rank}
                </div>
              </div>
              {i < RANK_LADDER.length - 1 && (
                <div style={{ height: 1.5, width: 8, flexShrink: 0, marginBottom: 22, background: i < currentIdx ? "linear-gradient(90deg, var(--primary), rgba(61,111,196,0.4))" : "rgba(61,111,196,0.12)" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: "rgba(13,24,41,0.8)", border: "1px solid var(--border)", overflow: "hidden", position: "relative" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? "#2ECC71" : "var(--primary)", boxShadow: pct >= 100 ? "0 0 8px rgba(46,204,113,0.5)" : "0 0 6px rgba(61,111,196,0.4)", animation: "progress-fill 0.9s ease both" }} />
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: pct >= 100 ? "#2ECC71" : "var(--muted-foreground)", minWidth: 30, textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

function RequirementRow({ rs }: { rs: RequirementStatus }) {
  const isAuto = rs.requirement.type === "auto";
  return (
    <div className={rs.completed ? "anim-fade-up" : ""} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 16px", background: rs.completed ? "rgba(46,204,113,0.04)" : "transparent", borderBottom: "1px solid var(--border)", transition: "background 0.2s" }}>
      <div style={{ flexShrink: 0, marginTop: 1 }}>
        {rs.completed
          ? <CheckCircle2 size={16} style={{ color: "#2ECC71" }} />
          : <Circle size={16} style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.84rem", color: rs.completed ? "var(--foreground)" : "var(--muted-foreground)", lineHeight: 1.4 }}>
          {rs.requirement.label}
        </div>
        {isAuto && rs.current !== undefined && rs.target !== undefined && (
          <div style={{ marginTop: 6 }}>
            <ProgressBar value={rs.current} max={rs.target} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--muted-foreground)", marginTop: 3, letterSpacing: "0.06em" }}>{rs.current} / {rs.target}</div>
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4, padding: "2px 7px", border: `1px solid ${isAuto ? "rgba(61,111,196,0.3)" : "rgba(143,163,192,0.2)"}`, fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.1em", color: isAuto ? "var(--primary)" : "rgba(143,163,192,0.5)", whiteSpace: "nowrap" }}>
        {isAuto ? <Zap size={9} /> : <User size={9} />}
        {isAuto ? "АВТО" : "РУЧНОЕ"}
      </div>
    </div>
  );
}

function InfoBlock({ label, value, accent, mono }: { label: string; value: string; accent?: boolean; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.16em", color: "var(--muted-foreground)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-display)", fontSize: "0.88rem", letterSpacing: mono ? "0.05em" : "0.04em", color: accent ? "var(--primary)" : "var(--foreground)", lineHeight: 1.2 }}>{value}</div>
    </div>
  );
}

export function Promotion() {
  const [botMap, setBotMap] = useState<Map<string, BotSoldierData>>(new Map());
  const [selectedCid, setSelectedCid] = useState<string>(rosterManual[0]?.cid ?? "");
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    fetchBotData().then(data => setBotMap(new Map(data.map(s => [s.cid, s]))));
  }, []);

  const manual = rosterManual.find(m => m.cid === selectedCid);
  const bot = botMap.get(selectedCid) ?? null;
  const callsign = manual?.callsignOverride || bot?.nickname || `CT-${selectedCid}`;
  const currentRank = bot?.rank ?? "Рядовой-рекрут";
  const nextRank = getNextRank(currentRank);
  const currentIdx = getRankIndex(currentRank);
  const daysAtRank = bot?.rankSince ? calcDaysAtRank(bot.rankSince) : 0;

  const requirements: RequirementStatus[] = nextRank
    ? evaluateRequirements(nextRank, { totalHours: bot?.online.totalHours ?? 0, sessions: bot?.online.sessions ?? 0, daysAtRank }, manual?.promotion.manualCompleted ?? [])
    : [];

  const completedCount = requirements.filter(r => r.completed).length;
  const overallPct = requirements.length > 0 ? Math.round((completedCount / requirements.length) * 100) : 100;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.22em", color: "var(--primary)", marginBottom: 8 }}>501-Й ЭШЛ // ТРЕКЕР ПОВЫШЕНИЙ</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <TrendingUp size={24} style={{ color: "var(--primary)" }} />
          <h1 style={{ margin: 0 }}>СИСТЕМА ПОВЫШЕНИЙ</h1>
        </div>
      </div>

      {/* Fighter selector */}
      <div className="anim-fade-up" style={{ marginBottom: 24, position: "relative", maxWidth: 400, animationDelay: "70ms" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.15em", color: "var(--muted-foreground)", marginBottom: 6 }}>ВЫБРАТЬ БОЙЦА</div>
        <button onClick={() => setDropOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 14px", background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", cursor: "pointer", textAlign: "left" }}>
          <div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--primary)", marginRight: 10 }}>CID-{selectedCid}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", letterSpacing: "0.04em" }}>{callsign}</span>
          </div>
          <ChevronDown size={15} style={{ color: "var(--muted-foreground)", transform: dropOpen ? "rotate(180deg)" : "none", transition: "transform 0.18s", flexShrink: 0 }} />
        </button>
        {dropOpen && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--card)", border: "1px solid var(--border)", zIndex: 50, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
            {rosterManual.map(m => {
              const b = botMap.get(m.cid);
              const cs = m.callsignOverride || b?.nickname || `CT-${m.cid}`;
              const isActive = m.cid === selectedCid;
              return (
                <button key={m.cid} onClick={() => { setSelectedCid(m.cid); setDropOpen(false); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: isActive ? "rgba(61,111,196,0.1)" : "transparent", border: "none", borderBottom: "1px solid var(--border)", color: "var(--foreground)", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={e => !isActive && ((e.currentTarget as HTMLElement).style.background = "rgba(61,111,196,0.05)")}
                  onMouseLeave={e => !isActive && ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--primary)" }}>CID-{m.cid}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.88rem" }}>{cs}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", color: "var(--muted-foreground)", marginLeft: "auto" }}>{b?.rank ?? "—"}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {manual && (
        <>
          {/* Rank ladder */}
          <div className="anim-fade-up scan-overlay" style={{ background: "var(--card)", border: "1px solid var(--border)", padding: "18px 20px", marginBottom: 12, animationDelay: "120ms" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.16em", color: "var(--muted-foreground)", marginBottom: 14 }}>ЛЕСТНИЦА ПОВЫШЕНИЙ — {RANK_LADDER.length} ЗВАНИЯ</div>
            <RankLadder currentRank={currentRank} nextRank={nextRank} />
          </div>

          {/* Info grid */}
          <div className="anim-fade-up" style={{ background: "var(--card)", border: "1px solid var(--border)", padding: "18px 20px", marginBottom: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 16, animationDelay: "180ms" }}>
            <InfoBlock label="ПОЗЫВНОЙ" value={callsign} />
            <InfoBlock label="ТЕК. ЗВАНИЕ" value={currentRank} accent />
            <InfoBlock label="СЛЕ. ЗВАНИЕ" value={nextRank ?? "МАКСИМУМ"} />
            <InfoBlock label="УРОВЕНЬ" value={`${currentIdx < 0 ? "?" : currentIdx + 1} / ${RANK_LADDER.length}`} mono />
            <InfoBlock label="ДНЕЙ В ЗВАНИИ" value={String(daysAtRank)} mono />
            <InfoBlock label="ВСЕГО ЧАСОВ" value={`${bot?.online.totalHours ?? 0}ч`} mono />
            <InfoBlock label="СЕССИЙ" value={String(bot?.online.sessions ?? 0)} mono />
          </div>

          {/* Requirements */}
          {nextRank ? (
            <div className="anim-fade-up" style={{ background: "var(--card)", border: "1px solid var(--border)", animationDelay: "240ms" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", background: "rgba(8,13,23,0.5)" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.14em", color: "var(--muted-foreground)", marginBottom: 5 }}>ТРЕБОВАНИЯ ДЛЯ ПОВЫШЕНИЯ</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.88rem", letterSpacing: "0.06em" }}>
                    {currentRank} → {nextRank}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: overallPct >= 100 ? "#2ECC71" : "var(--primary)", letterSpacing: "0.1em" }}>
                    {completedCount}/{requirements.length} ВЫПОЛНЕНО
                  </div>
                  {/* Circular gauge */}
                  <svg width="48" height="48" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                    <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="3" />
                    <circle cx="24" cy="24" r="20" fill="none"
                      stroke={overallPct >= 100 ? "#2ECC71" : "var(--primary)"}
                      strokeWidth="3"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - overallPct / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 24 24)"
                      style={{ filter: `drop-shadow(0 0 4px ${overallPct >= 100 ? "rgba(46,204,113,0.5)" : "rgba(61,111,196,0.4)"})` }}
                    />
                    <text x="24" y="28" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--foreground)" fontWeight="700">{overallPct}%</text>
                  </svg>
                </div>
              </div>

              {/* Legend */}
              <div style={{ padding: "7px 16px", background: "rgba(8,13,23,0.3)", borderBottom: "1px solid var(--border)", display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "var(--muted-foreground)", letterSpacing: "0.08em" }}>
                  <Zap size={10} style={{ color: "var(--primary)" }} /> АВТО — из данных бота
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "var(--muted-foreground)", letterSpacing: "0.08em" }}>
                  <User size={10} /> РУЧНОЕ — подтверждение старшего · <code style={{ opacity: 0.55 }}>promotion.manualCompleted</code>
                </div>
              </div>

              <div>{requirements.map(rs => <RequirementRow key={rs.requirement.id} rs={rs} />)}</div>

              {overallPct >= 100 && (
                <div className="anim-fade-up" style={{ padding: "16px 20px", background: "rgba(46,204,113,0.06)", borderTop: "1px solid rgba(46,204,113,0.25)", display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckCircle2 size={20} style={{ color: "#2ECC71", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.92rem", letterSpacing: "0.06em", color: "#2ECC71" }}>ВСЕ ТРЕБОВАНИЯ ВЫПОЛНЕНЫ</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", color: "var(--muted-foreground)", marginTop: 3 }}>{callsign} готов к повышению до {nextRank}. Обратитесь к Высшему командованию.</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="anim-fade-up anim-border-glow" style={{ background: "var(--card)", border: "1px solid rgba(245,197,24,0.3)", padding: 28, textAlign: "center", animationDelay: "240ms" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10, color: "#F5C518" }}>★</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: "0.1em", color: "#F5C518" }}>МАКСИМАЛЬНОЕ ЗВАНИЕ ДОСТИГНУТО</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted-foreground)", marginTop: 10 }}>{callsign} носит высшее звание в 501-м Элитном Штурмовом Легионе.</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
