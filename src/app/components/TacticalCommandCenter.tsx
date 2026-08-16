import { useState } from "react";
import { X, Network, Bot, AlertOctagon } from "lucide-react";
import { CommanderStateConquest } from "./CommanderStateConquest";
import { CommanderGridTactics } from "./CommanderGridTactics";

export function TacticalCommandCenter({ onClose }: { onClose: () => void }) {
  const [simulationType, setSimulationType] = useState<"rts" | "grid" | null>(null);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-mono text-white">
      <div className="w-full max-w-4xl bg-[#080d17] border-2 border-[var(--primary)] p-6 rounded-lg flex flex-col gap-5 shadow-[0_0_50px_rgba(61,111,196,0.3)]">
        
        {/* Hub Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <AlertOctagon size={24} className="text-[var(--primary)] animate-pulse" />
            <h1 className="text-2xl font-bold uppercase tracking-widest text-white m-0">
              GAR Tactical Commander Hub // 501st
            </h1>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer p-1.5 border border-slate-800 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Game Selection or Active Game */}
        {simulationType === null ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            {/* Concept 1: RTS */}
            <button
              onClick={() => setSimulationType("rts")}
              className="flex flex-col gap-3 p-6 border-2 border-slate-800 bg-slate-900/40 rounded hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Network size={32} className="text-slate-500 group-hover:text-white" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider m-0">
                  Concept 1: Supply Line Conquest
                </h2>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Execute a high-level planetary invasion. Capture connected outpost nodes to generate Clone reinforcements. AI flanks aggressively. Special abilities include LAAT troop drops and EMP strikes.
              </p>
              <span className="text-xs text-[var(--primary)] uppercase font-bold group-hover:underline">● Launch Macro Simulation</span>
            </button>

            {/* Concept 2: Grid Tactics */}
            <button
              onClick={() => setSimulationType("grid")}
              className="flex flex-col gap-3 p-6 border-2 border-slate-800 bg-slate-900/40 rounded hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Bot size={32} className="text-slate-500 group-hover:text-white" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider m-0">
                  Concept 2: GAR Tactical Grid
                </h2>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Deterministic turn-based combat. telegraphed enemy turns show exactly where droids will attack. Use Heavy concussion grenades to knock droids into each other's firing lines. 100% Deterministic—every move counts.
              </p>
              <span className="text-xs text-[var(--primary)] uppercase font-bold group-hover:underline">● Launch deterministic Simulation</span>
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Back Button inside the active simulation */}
            <button 
              onClick={() => setSimulationType(null)}
              className="absolute top-2 left-2 z-10 px-3 py-1.5 border border-slate-800 bg-black/70 text-xs text-slate-400 hover:text-white rounded uppercase tracking-widest cursor-pointer"
            >
              ● Return to Hub
            </button>
            {simulationType === "rts" ? <CommanderStateConquest /> : <CommanderGridTactics />}
          </div>
        )}
      </div>
    </div>
  );
}