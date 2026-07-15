import { X } from "lucide-react";

interface BlacklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BANNED_LIST = [
  { cid: "CT-6666", nickname: "Slick", date: "12.04.2026", reason: "Предательство Республики, саботаж на Кристофсисе", status: "TRIALS" },
  { cid: "CT-0404", nickname: "Glitch", date: "28.05.2026", reason: "Неподчинение приказам, дезертирство с поля боя", status: "EXILED" },
  { cid: "CT-9912", nickname: "Rogue", date: "30.06.2026", reason: "Использование несанкционированных модификаций брони (читы)", status: "BANNED" },
];

export function BlacklistModal({ isOpen, onClose }: BlacklistModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      {/* Корпус терминала - полностью прямоугольный, без скруглений и теней */}
      <div 
        className="w-full max-w-2xl border border-red-900 bg-[#070b12] text-slate-300 flex flex-col rounded-none"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        {/* Шапка */}
        <div className="border-b border-red-900/60 bg-red-950/10 px-5 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 animate-pulse" />
            <span className="font-bold uppercase tracking-widest text-xs text-red-500">
              SECURE LOG // BLACKLIST_DATABASE
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-red-500 transition-colors cursor-pointer text-xs uppercase tracking-wider flex items-center gap-1"
          >
            [close] <X size={14} />
          </button>
        </div>

        {/* Тело */}
        <div className="p-6 space-y-6">
          {/* Дисклеймер в рамке */}
          <div className="border border-red-900/30 bg-red-950/5 p-4 text-[11px] text-red-400/80 leading-relaxed uppercase tracking-wider">
            WARNING: Unclassified access to this terminal is strictly prohibited under GAR military code 44-A. Action will be logged automatically.
          </div>

          {/* Плоская таблица базы данных */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest text-[10px]">
                  <th className="pb-2 font-normal">ID / Callsign</th>
                  <th className="pb-2 font-normal">Offense Description</th>
                  <th className="pb-2 font-normal text-right">Registry Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {BANNED_LIST.map((clone) => (
                  <tr key={clone.cid} className="hover:bg-red-950/10 transition-colors">
                    <td className="py-3 pr-4 align-top">
                      <div className="text-red-500 font-bold tracking-wider">{clone.cid}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{clone.nickname}</div>
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <p className="text-slate-300 leading-relaxed text-[11px]">{clone.reason}</p>
                      <span className="text-[9px] text-slate-600 block mt-1 uppercase">LOGGED: {clone.date}</span>
                    </td>
                    <td className="py-3 align-top text-right font-bold text-red-600 text-[10px] tracking-widest">
                      [{clone.status}]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Футер */}
        <div className="px-5 py-3 border-t border-slate-900 bg-black/40 flex justify-between items-center text-[9px] text-slate-600 uppercase tracking-widest">
          <span>Database status: Operational</span>
          <span>501st security division</span>
        </div>
      </div>
    </div>
  );
}