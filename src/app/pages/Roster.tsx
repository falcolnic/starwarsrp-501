import { useState, useMemo } from "react";
import { Search, Users, X, Loader2 } from "lucide-react";
import { useSoldiers } from "../../hooks/useSoldiers";
import type { Soldier } from "../../services/soldierService";
import { FighterModal } from "../components/FighterModal";
import { SortableHeader, type SortKey, type SortDir } from "../components/roster/SortableHeader";
import { RosterRow } from "../components/roster/RosterRow";
import { RosterMobileCard } from "../components/roster/RosterMobileCard";
import { CommandPodiumSection } from "../components/roster/CommandPodiumSection";

const COLUMNS: Array<{ key?: SortKey; label: string }> = [
  { key: "cid", label: "НОМЕР" },
  { key: "callsign", label: "ПОЗЫВНОЙ" },
  { key: "rank", label: "ЗВАНИЕ" },
  { label: "ДОЛЖНОСТЬ" },
  { label: "ОТРЯД" },
  { label: "МЕДАЛИ" },
  { label: "ВЫГОВОРЫ" },
  { key: "status", label: "СТАТУС" },
  { label: "СВЯЗЬ" },
];

export function Roster() {
  const { soldiers, loading } = useSoldiers();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<Soldier | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return soldiers;
    return soldiers.filter((s) => {
      const cs = (s.callsignOverride || s.nickname || "").toLowerCase();
      return cs.includes(q) || s.cid.toLowerCase().includes(q);
    });
  }, [search, soldiers]);

  const sorted = useMemo(() => {
    if (!sortDir) return filtered;

    const rankWeights: Record<string, number> = {
      "Клон Маршал": 30,
      "Клон Коммандер": 29,
      "Командир первого класса": 28,
      "Командир": 27,
      "Подполковник": 26,
      "Майор": 25,
      "Капитан": 24,
      "Лейтенант": 23,
      "Команд сержант-майор": 22,
      "Сержант-майор": 21,
      "Сержант первого класса": 20,
      "Штаб-сержант": 19,
      "Сержант": 18,
      "Капрал": 17,
      "Специалист": 16,
      "Старший рядовой": 15,
      "Рядовой": 14,
      "Рядовой-рекрут": 13,
      "ИПК": 12,
      "Медик": 11,
      "Кадет.корпус": 10,
      "212 Э.Д.Ш.Б": 9,
      "Гвардия": 8,
    };

    return [...filtered].sort((a, b) => {
      if (sortKey === "rank") {
        const weightA = rankWeights[a.rank ?? ""] ?? 0;
        const weightB = rankWeights[b.rank ?? ""] ?? 0;
        return sortDir === "asc" ? weightB - weightA : weightA - weightB; // Highest rank first by default
      }

      let va = "";
      let vb = "";
      if (sortKey === "cid") {
        va = a.cid;
        vb = b.cid;
      } else if (sortKey === "callsign") {
        va = (a.callsignOverride || a.nickname || a.cid).toLowerCase();
        vb = (b.callsignOverride || b.nickname || b.cid).toLowerCase();
      } else if (sortKey === "status") {
        va = a.status ?? "";
        vb = b.status ?? "";
      }
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filtered, sortKey, sortDir]);

  return (
    <div className="relative flex-1 flex flex-col">
      <div
        className="absolute inset-0 z-1 pointer-events-none opacity-[0.7]"
        style={{
          backgroundImage: "url('/topography.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      />
      <div className="min-w-6xl mx-auto py-10 pb-10 z-2">
        <div className="anim-fade-up mb-7">
          <div className="font-mono text-sm tracking-[0.22em] text-[var(--primary)] mb-2">
            501-Й Э.Ш.Л // БАЗА ДАННЫХ ЛИЧНОГО СОСТАВА
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <h1>ЛИЧНЫЙ СОСТАВ</h1>
            <div className="font-mono text-sm text-[var(--muted-foreground)] px-3 py-1 border border-[var(--border)] tracking-[0.1em]">
              {sorted.length} бойц{sorted.length === 1 ? "" : sorted.length < 5 ? "а" : "ов"}
            </div>
            <div
              className="flex items-center gap-1.5 font-mono text-sm tracking-[0.1em]"
              style={{ color: loading ? "var(--muted-foreground)" : "#2ECC71" }}
            >
              {!loading && (
                <div className="status-dot-active w-[5px] h-[5px] rounded-full" style={{ background: "#2ECC71" }} />
              )}
              {loading ? "СИНХРОНИЗАЦИЯ..." : "БАЗА ДАННЫХ: АКТИВНА"}
            </div>
          </div>
        </div>

        <CommandPodiumSection
          soldiers={soldiers}
          onSelectFighter={(cid) => {
            const found = soldiers.find((s) => s.cid === cid);
            if (found) setSelected(found);
          }}
        />

        <div className="anim-fade-up mb-5 flex gap-3 items-center flex-wrap [animation-delay:80ms]">
          <div className="relative flex-1 min-w-[280px] max-w-[480px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Поиск по позывному или CID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2.5 pl-9 pr-9 bg-[var(--input-background)] border border-[var(--border)] focus:border-[var(--primary)] text-[var(--foreground)] font-mono text-base outline-none transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div className="font-mono text-sm text-[var(--muted-foreground)] tracking-[0.1em]">
            СТРОКА → ПРОФИЛЬ · ЗАГОЛОВОК → СОРТ.
          </div>
        </div>

        <div className="hidden md:block anim-fade-up border border-[var(--border)] bg-[var(--card)] [animation-delay:140ms] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-black/40 border-b-2 border-[var(--primary)]/25">
                {COLUMNS.map((col, i) => (
                  <th key={i} className="p-0 text-left font-normal">
                    <SortableHeader
                      label={col.label}
                      col={col.key}
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-3.5 py-10 border-t border-[var(--border)] text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
                      <span className="font-mono text-sm text-[var(--muted-foreground)] tracking-[0.1em]">
                        ЗАГРУЗКА ЛИЧНОГО СОСТАВА...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3.5 py-10 border-t border-[var(--border)]">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={28} className="text-[var(--muted-foreground)] opacity-30" />
                      <span className="font-mono text-base text-[var(--muted-foreground)] tracking-[0.1em]">
                        БОЙЦЫ НЕ НАЙДЕНЫ
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map((soldier, i) => (
                  <RosterRow
                    key={soldier.cid}
                    soldier={soldier}
                    index={i}
                    onClick={() => setSelected(soldier)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden flex flex-col gap-2">
          {loading ? (
            <div className="text-center py-10 font-mono text-xs text-[var(--muted-foreground)] tracking-[0.1em]">
              ЗАГРУЗКА...
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-10 font-mono text-xs text-[var(--muted-foreground)] tracking-[0.1em]">
              БОЙЦЫ НЕ НАЙДЕНЫ
            </div>
          ) : (
            sorted.map((soldier, i) => (
              <RosterMobileCard
                key={soldier.cid}
                soldier={soldier}
                index={i}
                onClick={() => setSelected(soldier)}
              />
            ))
          )}
        </div>

        <div className="mt-3.5 font-mono text-xs text-[var(--muted-foreground)]/25 tracking-[0.1em]">
          ★ ДАННЫЕ СИНХРОНИЗИРОВАНЫ С ЦЕНТРАЛЬНОЙ БАЗОЙ В.А.Р.
        </div>

        {selected && (
          <FighterModal soldier={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}