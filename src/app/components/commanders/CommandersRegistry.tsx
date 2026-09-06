import { useState, useEffect, useMemo } from "react";

export interface CommanderEntry {
    id: number;
    rank: string;
    period: string;
    orderNum: number;
    idNumber: string;
    callsign: string;
}

const RANKS = ["Маршал", "Коммандер", "Командир первого класса", "Командир"];

export function CommandersRegistry() {
    const [activeRank, setActiveRank] = useState(RANKS[0]);
    const [selectedCommander, setSelectedCommander] = useState<CommanderEntry | null>(null);
    const [entries, setEntries] = useState<CommanderEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/commanders")
            .then((res) => res.json())
            .then((data) => {
                setEntries(data);
                setLoading(false);
            });
    }, []);

    const currentEras = useMemo(() => {
        const rankEntries = entries.filter((e) => e.rank === activeRank);
        
        const grouped = rankEntries.reduce((acc, curr) => {
            if (!acc[curr.period]) acc[curr.period] = [];
            acc[curr.period].push(curr);
            return acc;
        }, {} as Record<string, CommanderEntry[]>);

        return Object.entries(grouped)
            .map(([period, items]) => ({
                period,
                entries: items.sort((a, b) => a.orderNum - b.orderNum),
            }))
            .sort((a, b) => a.period.localeCompare(b.period));
    }, [entries, activeRank]);

    if (loading) {
        return <div className="text-center font-mono text-slate-500 py-10">ОТКРЫТИЕ АРХИВОВ...</div>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 font-mono">
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-8">
                {RANKS.map((rank) => (
                    <button
                        key={rank}
                        onClick={() => {
                            setActiveRank(rank);
                            setSelectedCommander(null);
                        }}
                        className={`px-4 py-2 text-sm font-bold uppercase tracking-widest border transition-all duration-150 rounded-none cursor-pointer
                        ${activeRank === rank 
                            ? "bg-[#3D6FC4]/10 border-[#3D6FC4] text-white [text-shadow:0_0_8px_rgba(61,111,196,0.4)]" 
                            : "bg-transparent border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"}`}
                    >
                        // {rank}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                {currentEras.map((era) => (
                    <div key={era.period} className="border border-slate-800/80 bg-[#0b1322]/40 backdrop-blur-sm p-4 relative">
                        <div className="absolute -top-3 left-3 bg-[#080d17] px-2 text-sm font-bold text-[#3D6FC4] tracking-widest border border-slate-800">
                            {era.period}
                        </div>

                        <table className="w-full text-left border-collapse mt-2">
                            <thead>
                                <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="pb-2 font-normal w-12">#</th>
                                    <th className="pb-2 font-normal w-16">Номер</th>
                                    <th className="pb-2 font-normal">Позывной</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {era.entries.map((entry) => (
                                    <tr
                                        key={entry.id}
                                        onClick={() => setSelectedCommander(entry)}
                                        className="group border-b border-slate-900/60 hover:bg-[#3D6FC4]/5 cursor-pointer transition-colors"
                                    >
                                        <td className="py-2.5 text-slate-600 font-bold group-hover:text-slate-400">
                                            {String(entry.orderNum).padStart(2, "0")}
                                        </td>
                                        <td className="py-2.5 text-slate-400 font-medium group-hover:text-white">
                                            {entry.idNumber}
                                        </td>
                                        <td className="py-2.5 text-slate-200 font-bold tracking-wide italic group-hover:text-[#3D6FC4]">
                                            {entry.callsign}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {selectedCommander && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <div className="w-full max-w-md bg-[#0d1829] border border-slate-700 p-6 relative shadow-2xl">
                        <button 
                            onClick={() => setSelectedCommander(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white bg-transparent border-none cursor-pointer text-sm"
                        >
                            [ ESC // CLOSE ]
                        </button>

                        <div className="text-2xl font-bold text-white mb-1 uppercase tracking-wider italic">
                            {selectedCommander.callsign}
                        </div>
                        <div className="text-xs text-[#3D6FC4] tracking-widest mb-6">
                            РЕГИСТРАЦИОННЫЙ ТОКЕН: #{selectedCommander.idNumber}
                        </div>

                        <div className="space-y-3 border-t border-slate-800 pt-4 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-500 uppercase">Порядок в истории:</span>
                                <span className="text-slate-300 font-bold">{selectedCommander.orderNum}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 uppercase">Текущий статус:</span>
                                <span className="text-emerald-400 font-bold uppercase tracking-wider">В архиве легиона</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
