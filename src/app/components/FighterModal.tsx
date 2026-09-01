import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Hash, Calendar, Clock, Award } from "lucide-react";
import { CopyButton } from "./ui/CopyButton";
import { Barcode } from "./ui/Barcode";
import { ReprimandBar } from "./modal/ReprimandBar";
import { RankBar } from "./modal/RankBar";
import { useRanks } from "../../hooks/useRanks";
import { Soldier } from "../../services/soldierService";

export const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; freeze: boolean }> = {
  active: { label: "БОЕВОЙ", color: "#2ECC71", dot: "status-dot-active", freeze: false },
  leave: { label: "ОТПУСК", color: "#F5C518", dot: "status-dot-warning", freeze: true },
  reserve: { label: "РЕЗЕРВ", color: "#F5C518", dot: "status-dot-warning", freeze: true },
  medical: { label: "МЕД. ОТВОД", color: "#E67E22", dot: "status-dot-warning", freeze: false },
  training: { label: "ОБУЧЕНИЕ", color: "#3D6FC4", dot: "", freeze: false },
  detached: { label: "ПРИКОМАНДИР.", color: "#9B59B6", dot: "", freeze: false },
  suspended: { label: "ОТСТРАНЁН", color: "#E74C3C", dot: "status-dot-critical", freeze: false },
  awol: { label: "САМОВОЛКА", color: "#E74C3C", dot: "status-dot-critical", freeze: false },
  dismissed: { label: "УВОЛЕН", color: "#555E6E", dot: "", freeze: false },
};

export function cleanCid(rawCid: string): string {
  if (!rawCid) return "";
  return rawCid.replace(/^(CT-|CID-)+/i, "").trim();
}

export function calcDaysFromDate(dateStr: string | null): number {
  if (!dateStr) return 0;
  let date: Date;

  if (dateStr.includes(".")) {
    const parts = dateStr.split(".");
    if (parts.length !== 3) return 0;
    date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  } else {
    date = new Date(dateStr);
  }

  if (isNaN(date.getTime())) return 0;
  const diff = Date.now() - date.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

interface FighterModalProps {
  soldier: Soldier;
  onClose: () => void;
}

export function FighterModal({ soldier, onClose }: FighterModalProps) {
  const { ranks } = useRanks();
  const sc = STATUS_CONFIG[soldier.status] ?? STATUS_CONFIG.active;

  const joinDate = soldier.joinDate || (soldier as any).join_date || null;
  const daysInUnit = calcDaysFromDate(joinDate);

  const cleanNum = cleanCid(soldier.cid);
  const formattedCid = `CT-${cleanNum}`;
  const primaryName = soldier.callsignOverride || soldier.nickname || formattedCid;

  const npzValue = `${cleanNum} | ${primaryName} | ${soldier.rank ?? "—"}`;
  const steamId = soldier.steamId ?? "";
  const discordId = soldier.discordId ?? "";
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [avatarBroken, setAvatarBroken] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fighter-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] bg-[rgba(4,8,16,0.88)] flex items-center justify-center p-4 backdrop-blur-xs"
    >
      <div
        className="anim-modal relative w-full max-w-[740px] max-h-[95vh] flex flex-col bg-gradient-to-br from-[#0d1829] via-[#080f1c] to-[#0a1220] border"
        style={{ clipPath: "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 32px 100%, 0 calc(100% - 32px))" }}
      >
        <div className="shrink-0 z-[2] bg-[var(--primary)]/[0.06] border-b border-[var(--primary)]/20 px-5 py-3 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-[3px] h-4 bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
            <div className="font-mono text-base tracking-[0.22em] text-[var(--primary)] uppercase">
              Личное Дело // 501-й Легион
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Закрыть"
            className="w-7 h-7 flex items-center justify-center border border-[var(--primary)]/20 text-[var(--muted-foreground)] hover:border-red-500/50 hover:text-red-500 transition-all cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 pb-6">
          <div className="flex items-start gap-5 mb-5 pb-5 border-b border-[var(--border)]/40">
            <div
              className="w-20 h-20 bg-[var(--primary)]/[0.06] border border-[var(--primary)]/25 flex items-center justify-center shrink-0"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
            >
              {soldier.avatar && !avatarBroken ? (
                <img
                  src={soldier.avatar}
                  alt={primaryName}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarBroken(true)}
                />
              ) : (
                <div className="font-mono text-xl text-[var(--primary)]/30 font-bold">CT</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <div className="flex items-center gap-1.5 px-2 py-0.5 border" style={{ color: sc.color, background: `${sc.color}12`, borderColor: `${sc.color}35` }}>
                  {sc.dot && (
                    <div
                      className={sc.dot}
                      style={{ width: 6, height: 6, borderRadius: "50%", background: sc.color, boxShadow: `0 0 6px ${sc.color}` }}
                    />
                  )}
                  <span className="font-mono text-[10px] tracking-[0.1em] font-semibold">{sc.label}</span>
                </div>

                {soldier.leaveUntil && (
                  <span className="font-mono text-[10px] text-[#F5C518]">до {soldier.leaveUntil}</span>
                )}
                {soldier.reserveUntil && (
                  <span className="font-mono text-[10px] text-[#F5C518]">до {soldier.reserveUntil}</span>
                )}
              </div>

              <h2
                id="fighter-modal-title"
                className="font-[var(--font-display)] text-3xl font-bold tracking-[0.04em] text-[var(--foreground)] truncate leading-tight"
              >
                {primaryName}
              </h2>

              <div className="flex items-center gap-3 mt-1 font-mono text-xl text-[var(--muted-foreground)]">
                <span className="text-[var(--primary)] font-semibold">{soldier.rank ?? "—"}</span>
                <span className="text-[var(--border)]">•</span>
                <span className="flex items-center gap-0.5 opacity-70">
                  <Hash size={12} className="text-[var(--primary)]/70" />
                  {formattedCid}
                </span>
              </div>
            </div>
          </div>

          <RankBar rank={soldier.rank ?? "Рядовой-рекрут"} ranks={ranks} />

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-black/30 border border-[var(--border)]/40 rounded-xs">
              <span className="font-mono text-sm uppercase tracking-[0.15em] text-[var(--muted-foreground)]/60 block mb-1">
                Отряды
              </span>
              <span className="font-mono text-sm text-white">
                {soldier.squads.join(", ") || "Не состоит"}
              </span>
            </div>

            <div className="p-3 bg-black/30 border border-[var(--border)]/40 rounded-xs">
              <span className="font-mono text-sm uppercase tracking-[0.15em] text-[var(--muted-foreground)]/60 block mb-1">
                Должности
              </span>
              <span className="font-mono text-sm text-white">
                {soldier.positions.join(", ") || "Нету"}
              </span>
            </div>

            <div className="p-3 bg-black/30 border border-[var(--border)]/40 rounded-xs">
              <span className="font-mono text-sm uppercase tracking-[0.15em] text-[var(--muted-foreground)]/60 block mb-1">
                Дата Вступления
              </span>
              <span className="font-mono text-sm text-[var(--primary)] flex items-center gap-1">
                <Calendar size={12} className="text-[var(--muted-foreground)]" />
                {joinDate ? `${joinDate} (${daysInUnit} дн.)` : "—"}
              </span>
            </div>

            <div className="p-3 bg-black/30 border border-[var(--border)]/40 rounded-xs">
              <span className="font-mono text-sm uppercase tracking-[0.15em] text-[var(--muted-foreground)]/60 block mb-1">
                Всего Наиграно
              </span>
              <span className="font-mono text-sm text-[var(--primary)] flex items-center gap-1">
                <Clock size={12} className="text-[var(--muted-foreground)]" />
                {soldier.onlineTotalHours ? `${soldier.onlineTotalHours}ч (${soldier.onlineSessions} сес.)` : "—"}
              </span>
            </div>
          </div>

          {soldier.attached && soldier.attached.length > 0 && (
            <div className="p-3 bg-black/30 border border-[var(--border)]/40 rounded-xs mb-4">
              <span className="font-mono text-sm uppercase tracking-[0.15em] text-[var(--muted-foreground)]/60 block mb-1">
                Прикомандирован к
              </span>
              <span className="font-mono text-sm text-white">
                {soldier.attached.join(", ")}
              </span>
            </div>
          )}

          <div className="mb-4">
            <ReprimandBar count={soldier.reprimands} frozen={soldier.reprimandsFrozen} />
          </div>

          {soldier.medals && soldier.medals.length > 0 && (
            <div className="p-3 bg-black/30 border border-[var(--border)]/40 rounded-xs mb-4">
              <div className="font-mono text-sm tracking-[0.18em] text-[var(--muted-foreground)]/60 uppercase mb-2">
                Награды ({soldier.medals.length})
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {soldier.medals.map((medalName: string, i: number) => (
                  <div
                    key={i}
                    title={medalName}
                    className="flex items-center gap-1.5 px-2 py-1 bg-[var(--primary)]/[0.08] border border-[var(--primary)]/20 text-sm font-mono text-[var(--primary)] tracking-wider"
                  >
                    <Award size={12} className="text-[var(--primary)]" />
                    {medalName}
                  </div>
                ))}
              </div>
            </div>
          )}

          {soldier.recentSessions && soldier.recentSessions.length > 0 && (
            <div className="mb-5">
              <div className="font-mono text-sm tracking-[0.18em] text-[var(--muted-foreground)]/60 uppercase mb-1.5">
                Последние Сессии
              </div>
              <div className="flex gap-1.5">
                {soldier.recentSessions.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex-1 bg-black/40 border border-[var(--border)]/60 px-1.5 py-1.5 text-center">
                    <div className="font-mono text-[0.65rem] text-[var(--muted-foreground)]/60">{s.date.slice(0, 5)}</div>
                    <div className="font-mono text-sm text-[var(--primary)]">{s.duration}м</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-end mb-4 pt-2">
            <Barcode value={cleanNum} />
            <div className="font-mono text-xs tracking-[0.1em] text-[var(--muted-foreground)]/40 text-right">
              <div>Э.Ш.Л-501</div>
              <div>REG: {cleanNum}</div>
            </div>
          </div>

          <div className="border-t border-[var(--border)]/50 pt-3.5 flex gap-2 flex-wrap">
            <CopyButton value={npzValue} label="КОПИРОВАТЬ НПЗ" />
            {steamId && <CopyButton value={steamId} label="STEAM ID" />}
            {discordId && <CopyButton value={discordId} label="DISCORD ID" />}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
