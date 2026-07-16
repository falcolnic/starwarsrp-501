import { useState } from "react";
import { Link } from "react-router";
import { 
    ChevronRight, 
    ArrowLeft, 
    Shield, 
    Award, 
    Clock, 
    Users, 
    BookOpen, 
    Lock,
    ChevronDown,
    Eye
} from "lucide-react";
import { Rank, RANK_REQUIREMENTS } from "../../services/promotionRules";


const RANK_SKINS: Record<string, string> = {
    "Рядовой": "/images/ranks/ct-trooper.png",
    "Старший рядовой": "/images/ranks/ct-senior.png",
    "Специалист": "/images/ranks/ct-specialist.png",
    "Капрал": "/images/ranks/ct-corporal.png",
    "Сержант": "/images/ranks/ct-sergeant.png",
};
const RANK_GROUPS = [
    {
        title: "Рядовой и мл. сержантский состав",
        ranks: ["Рядовой", "Старший рядовой", "Специалист", "Капрал"] as Rank[],
    },
    {
        title: "Сержантский состав",
        ranks: [
        "Сержант", 
        "Штаб-сержант", 
        "Сержант первого класса", 
        "Первый сержант", 
        "Сержант-майор", 
        "Команд сержант-майор", 
        "Сержант-майор сухопутных войск"
        ] as Rank[],
    },
    {
        title: "Офицерский состав",
        ranks: ["Младший лейтенант", "Лейтенант", "Капитан", "Майор"] as Rank[],
    }
];

export function PromotionRulesPage() {
    const [selectedRank, setSelectedRank] = useState<Rank>("Рядовой");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const requirements = RANK_REQUIREMENTS[selectedRank] || [];
    const skinUrl = RANK_SKINS[selectedRank];

    const getRequirementIcon = (label: string) => {
        const text = label.toLowerCase();
        if (text.includes("уровень")) return <Shield size={16} className="text-[var(--primary)]" />;
        if (text.includes("срок") || text.includes("выслуга")) return <Clock size={16} className="text-amber-500" />;
        if (text.includes("обучить") || text.includes("кадет") || text.includes("отряд")) return <Users size={16} className="text-emerald-500" />;
        if (text.includes("школ") || text.includes("лекци") || text.includes("практик")) return <BookOpen size={16} className="text-blue-400" />;
        return <Award size={16} className="text-slate-400" />;
    };

    return (
        <div className="min-h-screen bg-[#080d17] text-slate-300 font-mono py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-4">
                <Link  to="/promotion" className="p-2 border border-slate-800 hover:border-slate-700 bg-slate-900/20 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </Link>

                <div className="flex items-center gap-3">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="lucide lucide-trending-up text-[var(--primary)]"
                >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-[family:var(--font-display)] tracking-[0.06em] m-0 uppercase text-white">
                    Система Повышений
                </h1>
                </div>
            </div>
            <div className="text-right text-xs text-slate-500 uppercase tracking-widest hidden md:block">
                GAR-501-EAL // ТАКТИЧЕСКИЙ РЕГЛАМЕНТ
            </div>
            </div>

            <div className="md:hidden relative">
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-slate-800 bg-slate-900/40 text-base font-bold text-white uppercase tracking-wider"
            >
                <span>Звание: {selectedRank}</span>
                <ChevronDown size={16} />
            </button>

            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 border border-slate-800 bg-[#080d17] max-h-80 overflow-y-auto divide-y divide-slate-900">
                {RANK_GROUPS.map((group) => (
                    <div key={group.title} className="p-2">
                    <div className="text-sm font-bold text-[var(--primary)] uppercase px-2 py-1 tracking-widest">
                        {group.title}
                    </div>
                    {group.ranks.map((rank) => (
                        <button
                        key={rank}
                        onClick={() => {
                            setSelectedRank(rank);
                            setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider ${
                            selectedRank === rank 
                            ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold" 
                            : "text-slate-400"
                        }`}
                        >
                        {rank}
                        </button>
                    ))}
                    </div>
                ))}
                </div>
            )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <aside className="hidden md:block md:col-span-4 lg:col-span-3 space-y-4 border border-slate-900 bg-slate-950/20 p-4">
                <div className="text-base font-bold tracking-widest text-slate-500 uppercase pb-2 border-b border-slate-900">
                Иерархия званий
                </div>
                <div className="space-y-5">
                {RANK_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-1.5">
                    <h3 className="text-sm font-bold text-[var(--primary)] uppercase tracking-wider mb-2">
                        {group.title}
                    </h3>
                    <div className="flex flex-col gap-1 border-l border-slate-900 pl-2 ml-1">
                        {group.ranks.map((rank) => (
                        <button
                            key={rank}
                            onClick={() => setSelectedRank(rank)}
                            className={`group flex items-center justify-between w-full text-left py-1.5 px-2 text-sm transition-all uppercase tracking-wider ${
                            selectedRank === rank
                                ? "bg-[var(--primary)]/10 text-white font-bold border-l-2 border-[var(--primary)]"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                            }`}
                        >
                            <span>{rank}</span>
                            <ChevronRight size={12} className={selectedRank === rank ? "text-[var(--primary)]" : "opacity-0 group-hover:opacity-100"} />
                        </button>
                        ))}
                    </div>
                    </div>
                ))}
                </div>
            </aside>

            <main className="md:col-span-8 lg:col-span-9 border border-slate-800 bg-slate-950/10 p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
                <div>
                    <span className="text-sm uppercase tracking-widest text-slate-500">ТРЕБОВАНИЯ ДЛЯ ПОВЫШЕНИЯ НА:</span>
                    <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-wide mt-1">
                    {selectedRank}
                    </h2>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-[var(--primary)] border border-[var(--primary)]/30 bg-[var(--primary)]/5 px-3 py-1">
                    РЕГЛАМЕНТ В.А.Р.
                </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-3">
                    {requirements.length > 0 ? (
                    requirements.map((req, idx) => {
                        const isFrozen = req.label.toLowerCase().includes("заморожен");
                        return (
                        <div 
                            key={req.id} 
                            className={`flex items-start gap-4 p-3.5 border transition-colors ${
                            isFrozen 
                                ? "border-red-950/30 bg-red-950/5 text-red-400/80" 
                                : "border-slate-900 bg-slate-950/20 hover:border-slate-800"
                            }`}
                        >
                            <div className="shrink-0 p-2 border border-slate-800 bg-[#080d17] mt-0.5">
                            {isFrozen ? <Lock size={16} className="text-red-500" /> : getRequirementIcon(req.label)}
                            </div>
                            <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs uppercase font-bold tracking-widest text-slate-500">КРИТЕРИЙ {idx + 1}</span>
                                <span className={`text-xs uppercase font-bold px-1.5 py-0.5 border ${
                                isFrozen 
                                    ? "border-red-500/20 text-red-500 bg-red-500/5" 
                                    : req.type === "auto" 
                                    ? "border-[var(--primary)]/20 text-[var(--primary)] bg-[var(--primary)]/5" 
                                    : "border-slate-800 text-slate-400 bg-slate-900/30"
                                }`}>
                                {isFrozen ? "ЗАМОРОЖЕНО" : req.type === "auto" ? "АВТО" : "РУЧНОЙ"}
                                </span>
                            </div>
                            <p className={`text-sm sm:text-base leading-relaxed ${isFrozen ? "line-through text-red-500/50" : "text-slate-300"}`}>
                                {req.label}
                            </p>
                            </div>
                        </div>
                        );
                    })
                    ) : (
                    <div className="border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
                        Назначение производится по решению командования.
                    </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500 pb-1 border-b border-slate-900">
                    Визуальный ID // Экипировка
                    </div>

                    <div className="border border-slate-800 bg-slate-950/30 aspect-[3/4] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10 pointer-events-none" />

                    {skinUrl ? (
                        <img 
                        src={skinUrl} 
                        loading="lazy"
                        alt={`Броня ${selectedRank}`} 
                        className="max-h-full object-contain z-10 transition-transform duration-300 hover:scale-105"
                        />
                    ) : (
                        <div className="text-center z-10 space-y-2 p-4">
                        <Eye size={24} className="mx-auto text-slate-700 animate-pulse" />
                        <p className="text-sm text-slate-500 uppercase tracking-widest">Силуэт засекречен</p>
                        <p className="text-xs text-slate-600 uppercase">Нет доступных данных в архиве</p>
                        </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 border border-slate-800/80 px-2 py-1 text-[9px] text-center uppercase tracking-widest text-slate-400 z-10">
                        ARMOR MODEL: 501-PHASE-II
                    </div>
                    </div>
                </div>

                </div>

                <div className="mt-8 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 uppercase tracking-widest">
                <span>Данные верифицированы</span>
                <span className="text-[var(--primary)] font-bold">501-й Элитный Штурмовой Легион</span>
                </div>
            </main>
            </div>
        </div>
        </div>
    );
}