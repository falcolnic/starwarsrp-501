import { useEffect, useState } from "react";
import { X, Loader2, Search } from "lucide-react";
import { InkStamp } from "./modal/InkStamp";

export interface BlacklistEntry {
  id: number;
  number: string;
  callsign: string;
  steamId: string;
  reason: string;
  addedBy: string;
  addedDate: string;
  workoff: string;
  status?: string;
}

interface BlacklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BlacklistModal({ isOpen, onClose }: BlacklistModalProps) {
  const [coverOpen, setCoverOpen] = useState(false);
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(false);
      fetch("/api/blacklist")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load");
          return res.json();
        })
        .then((data) => setEntries(data))
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    } else {
      const t = setTimeout(() => {
        setCoverOpen(false);
        setSearchQuery("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleClose() {
    setCoverOpen(false);
    onClose();
  }

  // Real-time filtering by Callsign, SteamID, or CID/Number
  const filteredEntries = entries.filter((entry) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      entry.callsign.toLowerCase().includes(q) ||
      entry.steamId.toLowerCase().includes(q) ||
      entry.number.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        aria-label="Закрыть"
      >
        <X size={32} />
      </button>

      <div
        className="relative w-full max-w-3xl [perspective:2200px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col overflow-hidden bg-gradient-to-br from-[#e8dfc6] to-[#b9ae8e] rounded shadow-2xl">
          <div className="px-6 pt-5 pb-4 flex items-start justify-between border-b border-[#3c321e]/25">
            <div>
              <div className="font-[family:var(--font-display)] font-bold uppercase text-xl tracking-[0.08em] text-[#2b2418]">
                Реестр предателей
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.12em] mt-1 text-[#6b5f47]">
                501st security division · допуск: level 3
              </div>
            </div>
            <div className="font-mono font-bold text-base uppercase tracking-[0.2em] text-[#8b1a1a] border border-[#8b1a1a] px-2 py-1 rotate-3 opacity-80 select-none">
              Secret
            </div>
          </div>

          <div className="px-6 pt-3 pb-1">
            <p className="font-mono text-xs italic leading-relaxed text-[#5a4d38]">
              Несанкционированный доступ к данному досье запрещён военным кодексом ВАР 44-А. Каждое обращение фиксируется автоматически.
            </p>
          </div>

          <div className="px-6 py-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-[#72644a] pointer-events-none" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ПОИСК ПО ПОЗЫВНОМУ, CID ИЛИ STEAMID..."
                className="w-full pl-9 pr-8 py-2 font-mono text-xs tracking-wider bg-[#e6dcbf]/70 border border-[#3c321e]/30 rounded text-[#2b2418] placeholder-[#72644a]/60 focus:outline-none focus:border-[#8b1a1a] focus:ring-1 focus:ring-[#8b1a1a] transition-all uppercase"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-[#72644a] hover:text-[#2b2418] transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-4 max-h-[420px] min-h-[220px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center my-auto text-[#6b5f47] font-mono gap-2">
                <Loader2 size={28} className="animate-spin text-[#8b1a1a]" />
                <span className="text-sm uppercase tracking-widest">Загрузка архива...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center my-auto text-[#8b1a1a] font-mono text-sm uppercase tracking-wider">
                Ошибка получения данных из базы В.А.Р.
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-auto text-[#6b5f47] font-mono text-xs uppercase tracking-wider gap-1">
                <span>{searchQuery ? "Совпадений в архиве не найдено" : "Записи в реестре отсутствуют"}</span>
                {searchQuery && <span className="text-[#8b1a1a] text-[11px]">Запрос: "{searchQuery}"</span>}
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id || entry.number}
                  className="flex flex-col gap-2.5 p-4 border border-[#3c321e]/20 bg-[#f4ebd4]/50 rounded"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-[#3c321e]/20 pb-2">
                    <div>
                      <div className="font-mono font-bold text-lg tracking-[0.03em] text-[#2b2418]">
                        №{entry.number} — {entry.callsign}
                      </div>
                      <div className="font-mono text-xs text-[#6b5f47] mt-0.5 select-all">
                        SteamID: <span className="font-semibold text-[#2b2418]">{entry.steamId}</span>
                      </div>
                    </div>

                    <InkStamp status={entry.status || "BANNED"} />
                  </div>

                  <div>
                    <span className="font-mono text-xs uppercase font-bold text-[#72644a] block mb-0.5">Причина:</span>
                    <p className="font-mono text-sm leading-relaxed text-[#3d3324] bg-[#e6dcbf]/60 p-2 rounded border border-[#3c321e]/10">
                      {entry.reason}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs text-[#5a4d38] border-t border-dashed border-[#3c321e]/20">
                    <div>
                      <span className="text-[#8a7c5f] uppercase">Кто занёс:</span>{" "}
                      <span className="font-bold text-[#2b2418]">{entry.addedBy}</span>
                    </div>
                    <div>
                      <span className="text-[#8a7c5f] uppercase">Дата внесения:</span>{" "}
                      <span className="font-bold text-[#2b2418]">{entry.addedDate}</span>
                    </div>
                    <div>
                      <span className="text-[#8a7c5f] uppercase">Отработка:</span>{" "}
                      <span className="font-bold text-[#8b1a1a]">{entry.workoff}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-6 py-3 flex justify-between font-mono text-xs uppercase tracking-[0.1em] border-t border-[#3c321e]/25 text-[#8a7c5f]">
            <span>
              {searchQuery ? `Найдено: ${filteredEntries.length} из ${entries.length}` : `Записей в реестре: ${entries.length}`}
            </span>
            <span>Статус базы: активна</span>
          </div>
        </div>

        <div
          className="absolute inset-0 origin-left transition-transform duration-[750ms] pointer-events-none [transform-style:preserve-3d] [transition-timing-function:cubic-bezier(0.34,0.15,0.2,1)]"
          style={{
            transform: coverOpen ? "rotateY(-150deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="group absolute inset-0 flex flex-col items-center justify-center pointer-events-auto cursor-pointer bg-[radial-gradient(circle_at_30%_20%,#2a2520,#17140f)] shadow-[rgba(0,0,0,0.6),0_20px_60px_rgba(0,0,0,0.6)] [backface-visibility:hidden]"
            onClick={() => setCoverOpen(true)}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 px-2 py-7 font-mono font-bold text-xs uppercase tracking-[0.2em] bg-[#3a352c] text-[#c9c2b0] border border-[#55503f] [writing-mode:vertical-rl]">
              Confidential
            </div>
            <svg width="104" height="104" viewBox="0 0 88 88" className="mb-4 opacity-70">
              <circle cx="44" cy="44" r="38" fill="none" stroke="#8a8270" strokeWidth="1.5" />
              <circle cx="44" cy="44" r="10" fill="none" stroke="#8a8270" strokeWidth="1.5" />
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i * 45 * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={44 + 14 * Math.cos(a)}
                    y1={44 + 14 * Math.sin(a)}
                    x2={44 + 30 * Math.cos(a)}
                    y2={44 + 30 * Math.sin(a)}
                    stroke="#8a8270"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>

            <div className="font-[family:var(--font-display)] font-bold uppercase text-3xl tracking-[0.1em] text-center px-8 text-[#b8b09a]">
              Конфиденциально
            </div>
            <div className="font-mono text-base uppercase tracking-[0.15em] mt-1 text-[#7a7462]">
              Уровень доступа 3
            </div>
            <span className="font-mono mt-20 text-sm uppercase tracking-[0.15em] text-[#7a7462]">
              Нажмите, чтобы открыть
            </span>
          </div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto cursor-pointer bg-[radial-gradient(circle_at_70%_20%,#201c18,#120f0c)] shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] border-r border-[#3a352c]/20 [backface-visibility:hidden] [transform:rotateY(180deg)]"
            onClick={() => setCoverOpen(false)}
          >
            <div className="absolute inset-6 border border-[#3a352c]/10 flex flex-col items-center justify-center pointer-events-none">
              <div className="font-mono text-base text-[#757462] uppercase tracking-[0.3em] text-center space-y-1">
                <p>В.А.Р. // АРХИВЫ</p>
                <p className="text-xs mt-5 text-orange-900">ДИСЦИПЛИНА ПРЕВЫШЕ ВСЕГО</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}