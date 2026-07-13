import { useEffect, useState, useCallback, type CSSProperties } from "react";
import { X, Clipboard, Check } from "lucide-react";
import { calcDaysAtRank } from "../../services/botData";
import type { BotSoldierData } from "../../services/botData";
import { getRankIndex, RANK_LADDER } from "../../services/promotionRules";

/* ── Data interface ── */
export interface RosterManual {
  cid: string;
  callsignOverride: string;
  positions: string[];
  squads: string[];
  attached: string[];
  medals: { name: string; icon: string; image: string }[];
  reprimands: number;
  reprimandsFrozen: boolean;
  status: string;
  leaveUntil: string;
  reserveUntil: string;
  joinDate: string;
  discordId: string;
  avatar: string;
  promotion: { manualCompleted: string[] };
}

/* ── 9-status configuration ── */
export const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; freeze: boolean }> = {
  active:    { label: "БОЕВОЙ",        color: "#2ECC71", dot: "status-dot-active",   freeze: false },
  leave:     { label: "ОТПУСК",        color: "#F5C518", dot: "status-dot-warning",  freeze: true  },
  reserve:   { label: "РЕЗЕРВ",        color: "#F5C518", dot: "status-dot-warning",  freeze: true  },
  medical:   { label: "МЕД. ОТВОД",    color: "#E67E22", dot: "status-dot-warning",  freeze: false },
  training:  { label: "ОБУЧЕНИЕ",      color: "#3D6FC4", dot: "",                    freeze: false },
  detached:  { label: "ПРИКОМАНДИР.",  color: "#9B59B6", dot: "",                    freeze: false },
  suspended: { label: "ОТСТРАНЁН",     color: "#E74C3C", dot: "status-dot-critical", freeze: false },
  awol:      { label: "САМОВОЛКА",     color: "#E74C3C", dot: "status-dot-critical", freeze: false },
  dismissed: { label: "УВОЛЕН",        color: "#555E6E", dot: "",                    freeze: false },
};

/* ── Deterministic barcode ── */
function getBarcodeWidths(value: string): number[] {
  return Array.from({ length: 52 }, (_, i) => {
    const code = value.charCodeAt(i % value.length) ^ (i * 7);
    return ((code % 3) + 1) * 1.5;
  });
}

function Barcode({ value }: { value: string }) {
  const widths = getBarcodeWidths(value);
  return (
    <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end", height: 32, opacity: 0.5 }}>
      {widths.map((w, i) => (
        <div key={i} style={{ width: w, background: "var(--primary)", height: i % 5 === 0 ? "100%" : `${55 + (i % 4) * 12}%` }} />
      ))}
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [value]);
  return (
    <button onClick={handleCopy} style={{
      display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
      background: copied ? "rgba(46,204,113,0.12)" : "rgba(61,111,196,0.1)",
      border: `1px solid ${copied ? "rgba(46,204,113,0.35)" : "rgba(61,111,196,0.3)"}`,
      color: copied ? "#2ECC71" : "var(--primary)", cursor: "pointer",
      fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em",
      transition: "all 0.2s",
    }}>
      {copied ? <Check size={11} /> : <Clipboard size={11} />}
      {copied ? "СКОПИРОВАНО ✓" : label}
    </button>
  );
}

function Field({ label, value, mono = false, highlight = false }: { label: string; value?: string; mono?: boolean; highlight?: boolean }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.18em", color: "rgba(143,163,192,0.45)", marginBottom: 3 }}>{label}</div>
      <div className={highlight ? "anim-flicker" : ""} style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-display)", fontSize: mono ? "0.78rem" : "0.88rem", color: highlight ? "var(--primary)" : "var(--foreground)", letterSpacing: "0.05em" }}>
        {value}
      </div>
    </div>
  );
}

function ReprimandBar({ count, frozen }: { count: number; frozen: boolean }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.18em", color: "rgba(143,163,192,0.45)", marginBottom: 6 }}>ВЗЫСКАНИЯ</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 28, height: 8,
              background: i < count ? (count >= 3 ? "#E74C3C" : "#F5C518") : "rgba(61,111,196,0.1)",
              border: `1px solid ${i < count ? (count >= 3 ? "rgba(231,76,60,0.5)" : "rgba(245,197,24,0.5)") : "rgba(61,111,196,0.2)"}`,
              boxShadow: i < count && count >= 3 ? "0 0 6px rgba(231,76,60,0.4)" : "none",
            }} />
          ))}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: count >= 3 ? "#E74C3C" : count > 0 ? "#F5C518" : "var(--muted-foreground)" }}>
          {count}/3
        </div>
        {frozen && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.1em", color: "#F5C518", background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.25)", padding: "2px 6px" }}>
            ЗАМОРОЖЕНО
          </div>
        )}
      </div>
    </div>
  );
}

function RankBar({ rank }: { rank: string }) {
  const idx = getRankIndex(rank);
  const pct = Math.round(((idx < 0 ? 0 : idx) / (RANK_LADDER.length - 1)) * 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.18em", color: "rgba(143,163,192,0.45)", marginBottom: 5, display: "flex", justifyContent: "space-between" }}>
        <span>ПРОГРЕСС ЗВАНИЯ</span>
        <span style={{ color: "var(--primary)" }}>{idx < 0 ? "?" : idx + 1} / {RANK_LADDER.length}</span>
      </div>
      <div style={{ height: 3, background: "rgba(61,111,196,0.12)", border: "1px solid rgba(61,111,196,0.12)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${pct}%`, background: "var(--primary)", boxShadow: "0 0 8px rgba(61,111,196,0.5)", animation: "progress-fill 1.2s ease both" }} />
      </div>
    </div>
  );
}

interface Props {
  manual: RosterManual;
  bot: BotSoldierData | null;
  onClose: () => void;
}

export function FighterModal({ manual, bot, onClose }: Props) {
  const sc = STATUS_CONFIG[manual.status] ?? STATUS_CONFIG.active;
  const daysAtRank = bot ? calcDaysAtRank(bot.rankSince) : 0;
  const npzValue = `${manual.cid} | ${bot?.nickname ?? `CT-${manual.cid}`} | ${bot?.rank ?? "—"}`;
  const steamId = bot?.steamId ?? "";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const cardStyle: CSSProperties = {
    background: "linear-gradient(160deg, #0d1829 0%, #080f1c 60%, #0a1220 100%)",
    border: "1px solid rgba(61,111,196,0.35)",
    boxShadow: "0 0 60px rgba(0,0,0,0.85), 0 0 30px rgba(61,111,196,0.1)",
    clipPath: "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 32px 100%, 0 calc(100% - 32px))",
    width: "100%",
    maxWidth: 640,
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,8,16,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div className="anim-modal scan-overlay" style={cardStyle}>

        {/* Header strip */}
        <div style={{ background: "rgba(61,111,196,0.06)", borderBottom: "1px solid rgba(61,111,196,0.2)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 2, backdropFilter: "blur(4px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 18, background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.22em", color: "var(--primary)" }}>ЛИЧНОЕ ДЕЛО БОЙЦА // ДОПУСК: ВНУТРЕННИЙ</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "1px solid rgba(61,111,196,0.2)", color: "var(--muted-foreground)", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "rgba(231,76,60,0.5)"; el.style.color = "#E74C3C"; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "rgba(61,111,196,0.2)"; el.style.color = "var(--muted-foreground)"; }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* Top: identity + avatar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, marginBottom: 16, alignItems: "start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 3 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.2em", color: "rgba(143,163,192,0.4)" }}>CID-{manual.cid}</div>
                {manual.callsignOverride && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.12em", color: "rgba(61,111,196,0.7)" }}>{manual.callsignOverride}</div>
                )}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.65rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--foreground)", lineHeight: 1.1, marginBottom: 4 }}>
                {bot?.nickname ?? `CT-${manual.cid}`}
              </div>
              <div className="anim-flicker" style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: 12 }}>
                {bot?.rank ?? "—"}
              </div>

              {/* Status */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {sc.dot && <div className={sc.dot} style={{ width: 7, height: 7, borderRadius: "50%", background: sc.color, boxShadow: `0 0 8px ${sc.color}` }} />}
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", color: sc.color, background: `${sc.color}15`, border: `1px solid ${sc.color}40`, padding: "2px 8px" }}>
                  {sc.label}
                </div>
                {manual.leaveUntil && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "#F5C518", letterSpacing: "0.08em" }}>до {manual.leaveUntil}</div>
                )}
                {manual.reserveUntil && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "#F5C518", letterSpacing: "0.08em" }}>до {manual.reserveUntil}</div>
                )}
              </div>
            </div>

            {/* Avatar */}
            <div style={{ width: 88, height: 88, background: "rgba(61,111,196,0.06)", border: "1px solid rgba(61,111,196,0.2)", display: "flex", alignItems: "center", justifyContent: "center", clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)", flexShrink: 0 }}>
              {manual.avatar ? (
                <img src={manual.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.3rem", color: "rgba(61,111,196,0.25)" }}>CT</div>
              )}
            </div>
          </div>

          {/* Rank bar */}
          <RankBar rank={bot?.rank ?? "Рядовой-рекрут"} />

          {/* Service data grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", margin: "12px 0" }}>
            <Field label="ЗВАНИЕ С" value={bot?.rankSince} mono />
            <Field label="ДНЕЙ В ЗВАНИИ" value={daysAtRank > 0 ? `${daysAtRank} дн.` : "—"} mono highlight />
            <Field label="ДАТА ВСТУПЛЕНИЯ" value={manual.joinDate} mono />
            <Field label="ВСЕГО ЧАСОВ" value={bot ? `${bot.online.totalHours}ч (${bot.online.sessions} сес.)` : "—"} mono highlight />
            <Field label="ДОЛЖНОСТИ" value={manual.positions.join(", ")} />
            <Field label="ОТРЯДЫ" value={manual.squads.join(", ")} />
            {manual.attached.length > 0 && <Field label="ПРИКОМАНДИРОВАН" value={manual.attached.join(", ")} />}
          </div>

          {/* Reprimands */}
          <ReprimandBar count={manual.reprimands} frozen={manual.reprimandsFrozen} />

          {/* Medals */}
          {manual.medals.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.18em", color: "rgba(143,163,192,0.45)", marginBottom: 8 }}>НАГРАДЫ</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {manual.medals.map((medal, i) => (
                  <div
                    key={i} title={medal.name}
                    style={{ width: 42, height: 42, background: "rgba(61,111,196,0.08)", border: "1px solid rgba(61,111,196,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)", transition: "border-color 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(61,111,196,0.5)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(61,111,196,0.2)"; }}
                  >
                    {medal.image ? (
                      <img src={medal.image} alt={medal.name} style={{ width: 28, height: 28, objectFit: "contain" }} />
                    ) : (
                      <span style={{ color: "#F5C518" }}>{medal.icon}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent sessions */}
          {bot && bot.recentSessions.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.18em", color: "rgba(143,163,192,0.45)", marginBottom: 6 }}>ПОСЛЕДНИЕ СЕССИИ</div>
              <div style={{ display: "flex", gap: 5 }}>
                {bot.recentSessions.slice(0, 5).map((s, i) => (
                  <div key={i} style={{ flex: 1, background: "rgba(8,13,23,0.8)", border: "1px solid var(--border)", padding: "5px 6px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "rgba(143,163,192,0.4)" }}>{s.date.slice(0, 5)}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--primary)" }}>{s.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barcode row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
            <Barcode value={manual.cid} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.1em", color: "rgba(143,163,192,0.2)", textAlign: "right" }}>
              <div>GAR-501-EAL</div>
              <div>REG: {manual.cid}</div>
            </div>
          </div>

          {/* Copy buttons */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <CopyButton value={npzValue} label="КОПИРОВАТЬ НПЗ" />
            {steamId && <CopyButton value={steamId} label="КОПИРОВАТЬ STEAMID" />}
          </div>
        </div>
      </div>
    </div>
  );
}
