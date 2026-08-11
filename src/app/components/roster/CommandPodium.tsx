import type { Soldier } from "../../../services/soldierService";

interface CommandPodiumProps {
    soldier: Soldier;
    isFlagship: boolean;
    stoneImage: string;
    offsetClass: string;
    onSelect?: (cid: string) => void;
}

export function CommandPodium({ soldier, isFlagship, stoneImage, offsetClass, onSelect }: CommandPodiumProps) {
    const callsign = soldier.callsignOverride || soldier.nickname || `CT-${soldier.cid}`;
    const rank = soldier.rank ?? "—";
    const role = soldier.commandRole || rank;

    return (
        <div 
            onClick={() => onSelect?.(soldier.cid)}
            className={`
                group relative flex flex-col items-center justify-end cursor-pointer
                transition-all duration-300 ease-out hover:-translate-y-4 ${offsetClass}
            `}
        >
            <div className="relative z-10 flex flex-col items-center mb-[-6px] text-center transition-all duration-300">
                <span className="font-mono text-sm tracking-widest text-[var(--primary)] uppercase font-semibold transition-colors">
                    {role}
                </span>
                <div className={`
                    font-bold text-white transition-all duration-300 leading-tight
                    group-hover:text-[#d8a441] group-hover:drop-shadow-[0_0_12px_rgba(216,164,65,0.7)]
                    ${isFlagship ? "text-2xl" : "text-xl"}
                `}>
                    {callsign}
                </div>
                <span className="font-mono text-sm text-slate-500/80 tracking-widest mt-0.5 group-hover:text-slate-400 transition-colors">
                    CID-{soldier.cid}
                </span>
            </div>

            <div className="relative w-full max-w-[200px]">
                <div className="absolute inset-x-2 bottom-3 h-12 bg-gradient-to-t from-[#d8a441]/30 via-[var(--primary)]/20 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <img 
                    src={stoneImage} 
                    alt="Podium Stone" 
                    className="
                        w-full h-auto object-contain transition-all duration-300
                        filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]
                        group-hover:drop-shadow-[0_15px_25px_rgba(216,164,65,0.4)]
                        group-hover:brightness-110
                    "
                />
            </div>
        </div>
    );
}