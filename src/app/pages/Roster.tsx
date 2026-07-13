import { useState, useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Users, X } from "lucide-react";
import { fetchBotData, type BotSoldierData } from "../../services/botData";
import { FighterModal, STATUS_CONFIG, type RosterManual } from "../components/FighterModal";
import rosterRaw from "../../data/roster.json";

const rosterManual = rosterRaw as RosterManual[];
type SortKey = "cid" | "callsign" | "rank" | "status";
type SortDir = "asc" | "desc" | null;

/* ── Status chip with 9 Russian statuses ── */
function StatusChip({ status }: { status: string }) {
  const sc = STATUS_CONFIG[status] ?? { label: status.toUpperCase(), color: "var(--muted-foreground)", dot: "", freeze: false };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", background: `${sc.color}15`, border: `1px solid ${sc.color}45`, color: sc.color, fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>
      {sc.dot ? (
        <div className={sc.dot} style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, boxShadow: `0 0 6px ${sc.color}` }} />
      ) : (
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, opacity: 0.6 }} />
      )}
      {sc.label}
    </div>
  );
}

/* ── Medal slots ── */
function MedalSlots({ medals }: { medals: Array<{ name: string; icon: string; image: string }> }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: 3 }).map((_, i) => {
        const m = medals[i];
        return (
          <div key={i} title={m?.name} style={{ width: 22, height: 22, background: m ? "rgba(61,111,196,0.15)" : "rgba(13,24,41,0.5)", border: `1px solid ${m ? "rgba(61,111,196,0.4)" : "rgba(61,111,196,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>
            {m ? (m.image ? <img src={m.image} alt={m.name} style={{ width: 14, height: 14, objectFit: "contain" }} /> : m.icon) : <span style={{ color: "rgba(143,163,192,0.15)", fontSize: "0.45rem" }}>—</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ── Reprimand display as X/3 ── */
function ReprimandCell({ count, frozen }: { count: number; frozen: boolean }) {
  const color = count >= 3 ? "#E74C3C" : count > 0 ? "#F5C518" : "rgba(143,163,192,0.25)";
  return (
    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color, display: "flex", alignItems: "center", gap: 5 }}>
      {count}/3
      {frozen && <span style={{ fontSize: "0.5rem", color: "#F5C518", border: "1px solid rgba(245,197,24,0.3)", padding: "1px 3px" }}>❄</span>}
    </span>
  );
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={11} style={{ opacity: 0.3, marginLeft: 4 }} />;
  return sortDir === "asc" ? <ChevronUp size={11} style={{ color: "var(--primary)", marginLeft: 4 }} /> : <ChevronDown size={11} style={{ color: "var(--primary)", marginLeft: 4 }} />;
}

/* ── Row with staggered entrance ── */
function AnimRow({ children, index, onClick }: { children: ReactNode; index: number; onClick: () => void }) {
  const ref = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateX(-12px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)";
      el.style.opacity = "1";
      el.style.transform = "translateX(0)";
    }, 40 + index * 45);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <tr ref={ref} onClick={onClick} style={{ cursor: "pointer" }}
      onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgba(61,111,196,0.07)"; }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.background = "transparent"; }}
    >
      {children}
    </tr>
  );
}

function MobileCard({ manual, bot, onClick, index }: { manual: RosterManual; bot: BotSoldierData | null; onClick: () => void; index: number }) {
  const callsign = manual.callsignOverride || bot?.nickname || `CT-${manual.cid}`;
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 50 + index * 55);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <button ref={ref} onClick={onClick}
      style={{ display: "block", width: "100%", background: "var(--card)", border: "1px solid var(--border)", padding: "14px 16px", textAlign: "left", cursor: "pointer", transition: "border-color 0.15s", clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--primary)", letterSpacing: "0.12em", marginBottom: 2 }}>CID-{manual.cid}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "0.06em" }}>{callsign}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--muted-foreground)", letterSpacing: "0.04em", marginTop: 2 }}>{bot?.rank ?? "—"}</div>
        </div>
        <StatusChip status={manual.status} />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <MedalSlots medals={manual.medals} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted-foreground)" }}>{manual.positions[0] ?? "—"}</span>
        <ReprimandCell count={manual.reprimands} frozen={manual.reprimandsFrozen} />
      </div>
    </button>
  );
}

export function Roster() {
  const [botMap, setBotMap] = useState<Map<string, BotSoldierData>>(new Map());
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("cid");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<RosterManual | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchBotData().then(data => {
      setBotMap(new Map(data.map(s => [s.cid, s])));
      setLoaded(true);
    });
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : d === "desc" ? null : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? rosterManual.filter(m => {
      const cs = (m.callsignOverride || botMap.get(m.cid)?.nickname || "").toLowerCase();
      return cs.includes(q) || m.cid.includes(q);
    }) : rosterManual;
  }, [search, botMap]);

  const sorted = useMemo(() => {
    if (!sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      let va = "", vb = "";
      if (sortKey === "cid") { va = a.cid; vb = b.cid; }
      else if (sortKey === "callsign") { va = (a.callsignOverride || botMap.get(a.cid)?.nickname || a.cid).toLowerCase(); vb = (b.callsignOverride || botMap.get(b.cid)?.nickname || b.cid).toLowerCase(); }
      else if (sortKey === "rank") { va = botMap.get(a.cid)?.rank ?? ""; vb = botMap.get(b.cid)?.rank ?? ""; }
      else if (sortKey === "status") { va = a.status; vb = b.status; }
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filtered, sortKey, sortDir, botMap]);

  const thBtn = (col: SortKey): CSSProperties => ({
    padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em",
    color: sortKey === col && sortDir ? "var(--primary)" : "var(--muted-foreground)",
    textAlign: "left", background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", whiteSpace: "nowrap", width: "100%",
  });
  const td: CSSProperties = { padding: "10px 14px", borderTop: "1px solid var(--border)", verticalAlign: "middle" };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.22em", color: "var(--primary)", marginBottom: 8 }}>501-Й ЭШЛ // БАЗА ДАННЫХ ЛИЧНОГО СОСТАВА</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>ЛИЧНЫЙ СОСТАВ</h1>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted-foreground)", padding: "3px 10px", border: "1px solid var(--border)", letterSpacing: "0.1em" }}>
            {sorted.length} бойц{sorted.length === 1 ? "" : sorted.length < 5 ? "а" : "ов"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.1em", color: loaded ? "#2ECC71" : "var(--muted-foreground)" }}>
            {loaded ? <div className="status-dot-active" style={{ width: 5, height: 5, borderRadius: "50%", background: "#2ECC71" }} /> : null}
            {loaded ? "БОТ: ОНЛАЙН" : "БОТ: ЗАГРУЗКА..."}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="anim-fade-up" style={{ marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", animationDelay: "80ms" }}>
        <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 480 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)", pointerEvents: "none" }} />
          <input type="text" placeholder="Поиск по позывному или CID..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "9px 36px", background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", fontFamily: "var(--font-mono)", fontSize: "0.78rem", outline: "none", boxSizing: "border-box" }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--primary)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")} />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer", padding: 2, display: "flex" }}><X size={13} /></button>
          )}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>СТРОКА → ПРОФИЛЬ · ЗАГОЛОВОК → СОРТ.</div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block anim-fade-up" style={{ border: "1px solid var(--border)", background: "var(--card)", animationDelay: "140ms" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(8,13,23,0.8)", borderBottom: "2px solid rgba(61,111,196,0.25)" }}>
              {([
                { key: "cid" as SortKey, label: "CID" },
                { key: "callsign" as SortKey, label: "ПОЗЫВНОЙ" },
                { key: "rank" as SortKey, label: "ЗВАНИЕ" },
                { label: "ДОЛЖНОСТЬ" },
                { label: "ОТРЯД" },
                { label: "НАГР." },
                { label: "ВЗЫСК." },
                { key: "status" as SortKey, label: "СТАТУС" },
              ]).map((col, i) => (
                <th key={i} style={{ padding: 0, textAlign: "left", fontWeight: "normal" }}>
                  {col.key ? (
                    <button onClick={() => handleSort(col.key!)} style={thBtn(col.key!)}>
                      {col.label}<SortIcon col={col.key!} sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  ) : (
                    <div style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", color: "var(--muted-foreground)" }}>{col.label}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={8} style={{ ...td, textAlign: "center", padding: "40px 14px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <Users size={28} style={{ color: "var(--muted-foreground)", opacity: 0.3 }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>БОЙЦЫ НЕ НАЙДЕНЫ</span>
                </div>
              </td></tr>
            ) : sorted.map((manual, i) => {
              const bot = botMap.get(manual.cid) ?? null;
              const callsign = manual.callsignOverride || bot?.nickname || `CT-${manual.cid}`;
              return (
                <AnimRow key={manual.cid} index={i} onClick={() => setSelected(manual)}>
                  <td style={td}><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--primary)", letterSpacing: "0.08em" }}>{manual.cid}</span></td>
                  <td style={td}><span style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", letterSpacing: "0.04em" }}>{callsign}</span></td>
                  <td style={td}><span style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{bot?.rank ?? "—"}</span></td>
                  <td style={td}><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted-foreground)" }}>{manual.positions.slice(0, 2).join(", ") || "—"}</span></td>
                  <td style={td}><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted-foreground)" }}>{manual.squads.slice(0, 1).join(", ") || "—"}</span></td>
                  <td style={td}><MedalSlots medals={manual.medals} /></td>
                  <td style={td}><ReprimandCell count={manual.reprimands} frozen={manual.reprimandsFrozen} /></td>
                  <td style={td}><StatusChip status={manual.status} /></td>
                </AnimRow>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.length === 0
          ? <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>БОЙЦЫ НЕ НАЙДЕНЫ</div>
          : sorted.map((manual, i) => <MobileCard key={manual.cid} manual={manual} bot={botMap.get(manual.cid) ?? null} onClick={() => setSelected(manual)} index={i} />)
        }
      </div>

      <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "rgba(143,163,192,0.25)", letterSpacing: "0.1em" }}>
        ★ ДАННЫЕ БОТА: ДЕМО-РЕЖИМ · РЕДАКТИРУЙТЕ <code>src/data/roster.json</code> ДЛЯ ДОБАВЛЕНИЯ ЗАПИСЕЙ
      </div>

      {selected && (
        <FighterModal
          manual={selected}
          bot={botMap.get(selected.cid) ?? null}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
