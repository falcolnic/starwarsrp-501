import { useState } from "react";

// Пример правильной структуры данных для архива
interface CommanderEntry {
  order: number;
  idNumber: string;
  callsign: string;
  km: string;
}

interface EraData {
  period: string;
  entries: CommanderEntry[];
}

const ARCHIVE_DATA: Record<string, EraData[]> = {
    "Клон Командер": [
        {
            "period": "2017-2018",
            "entries": [
            { "order": 1, "idNumber": "1552", "callsign": "NightGlade", "km": "Raide" },
            { "order": 2, "idNumber": "-", "callsign": "-", "km": "Van9" },
            { "order": 3, "idNumber": "7583", "callsign": "Tom", "km": "Volche, TequilaBoom" },
            { "order": 4, "idNumber": "1331", "callsign": "LENIN", "km": "TyP60" },
            { "order": 5, "idNumber": "1926", "callsign": "Charlie", "km": "LENIN" },
            { "order": 6, "idNumber": "2806", "callsign": "Kupa", "km": "PiNGviN" },
            { "order": 7, "idNumber": "1302", "callsign": "KOT", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2019-2020",
            "entries": [
            { "order": 8, "idNumber": "5937", "callsign": "Sky", "km": "KOT" },
            { "order": 9, "idNumber": "05573", "callsign": "Mia", "km": "Sky" },
            { "order": 10, "idNumber": "09477", "callsign": "Heisenberg", "km": "Mia" },
            { "order": 11, "idNumber": "16051", "callsign": "Ладислав Сладенький", "km": "Pisy4" },
            { "order": 12, "idNumber": "09533", "callsign": "ProTagOn1st", "km": "Pisy4" },
            { "order": 13, "idNumber": "2806", "callsign": "Kupa", "km": "ProTagOn1st" },
            { "order": 14, "idNumber": "6084", "callsign": "Qteon", "km": "Kupa" },
            { "order": 15, "idNumber": "02712", "callsign": "Даймё Кухулин", "km": "Qteon" }
            ]
        },
        {
            "period": "2021-2022",
            "entries": [
            { "order": 17, "idNumber": "07348", "callsign": "payn", "km": "Vitia Tachka" },
            { "order": 18, "idNumber": "49394", "callsign": "Barmaley", "km": "Vitia Tachka" },
            { "order": 19, "idNumber": "60022", "callsign": "Laggy", "km": "Vitia Tachka" },
            { "order": 20, "idNumber": "39816", "callsign": "PiNGviN", "km": "Vitia Tachka" },
            { "order": 21, "idNumber": "60955", "callsign": "Alpha", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2023-2024",
            "entries": [
            { "order": 22, "idNumber": "8652", "callsign": "Crack", "km": "Alpha" },
            { "order": 23, "idNumber": "47850", "callsign": "Bibok", "km": "Crack" },
            { "order": 24, "idNumber": "-", "callsign": "-", "km": "NightGlade" }
            ]
        },
        {
            "period": "2024-2025",
            "entries": [
            { "order": 25, "idNumber": "0032", "callsign": "Takeda", "km": "Vitia Tachka" },
            { "order": 26, "idNumber": "0245", "callsign": "ProTagOn1st", "km": "Vitia Tachka" },
            { "order": 27, "idNumber": "0306", "callsign": "Sky", "km": "doctor, Takeda" },
            { "order": 29, "idNumber": "0002", "callsign": "Flogger", "km": "Flogger" },
            { "order": 30, "idNumber": "0018", "callsign": "Ving", "km": "Flogger" },
            { "order": 31, "idNumber": "0403", "callsign": "ARTORIA", "km": "Flogger" },
            { "order": 32, "idNumber": "0217", "callsign": "Admentai", "km": "Takeda" }
            ]
        },
        {
            "period": "2025-2026",
            "entries": [
            { "order": 33, "idNumber": "0268", "callsign": "Острый", "km": "Admentai" },
            { "order": 34, "idNumber": "2164", "callsign": "Undertaker", "km": "Острый" },
            { "order": 35, "idNumber": "0030", "callsign": "Fortune", "km": "Undertaker" },
            { "order": 36, "idNumber": "0018", "callsign": "Ving", "km": "Barsik" },
            { "order": 38, "idNumber": "14228", "callsign": "Перега Сират", "km": "Ving" },
            { "order": 39, "idNumber": "0641", "callsign": "Sorry", "km": "Ving" }
            ]
        },
        {
            "period": "2026-2027",
            "entries": [
            { "order": 41, "idNumber": "1656", "callsign": "Feyken", "km": "Sorry" },
            { "order": 42, "idNumber": "0896", "callsign": "Роскомнадзор", "km": "Sorry" }
            ]
        }
        ],
    "Командир первого класса": [
        {
            "period": "2017-2018",
            "entries": [
            { "order": 1, "idNumber": "1552", "callsign": "NightGlade", "km": "Raide" },
            { "order": 2, "idNumber": "9129", "callsign": "Golden", "km": "Raide" },
            { "order": 3, "idNumber": "7583", "callsign": "Tom", "km": "Van9" },
            { "order": 4, "idNumber": "7804", "callsign": "SaiRaz", "km": "Volche" },
            { "order": 5, "idNumber": "2487", "callsign": "TyP60", "km": "TequilaBoom" },
            { "order": 6, "idNumber": "1926", "callsign": "Spartacus", "km": "TyP60" },
            { "order": 7, "idNumber": "5267", "callsign": "PiNGviN", "km": "LENIN" },
            { "order": 8, "idNumber": "8774", "callsign": "Werex", "km": "PiNGviN" },
            { "order": 9, "idNumber": "3535", "callsign": "CSV", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2019-2020",
            "entries": [
            { "order": 10, "idNumber": "8652", "callsign": "Crack", "km": "KOT" },
            { "order": 11, "idNumber": "09477", "callsign": "Walter White", "km": "Sky" },
            { "order": 12, "idNumber": "9312", "callsign": "Pisy4", "km": "Mia" },
            { "order": 13, "idNumber": "09533", "callsign": "ProTagOn1st", "km": "Pisy4" },
            { "order": 14, "idNumber": "2806", "callsign": "KupchakoV", "km": "Pisy4" },
            { "order": 15, "idNumber": "07745", "callsign": "Caines Ceno", "km": "ProTagOn1st" },
            { "order": 16, "idNumber": "6084", "callsign": "Qteon", "km": "ProTagOn1st" },
            { "order": 17, "idNumber": "02712", "callsign": "Граф Кухулин", "km": "Kupa" },
            { "order": 18, "idNumber": "29685", "callsign": "Vitia Tachka", "km": "Qteon" },
            { "order": 19, "idNumber": "07348", "callsign": "payn", "km": "Mia" }
            ]
        },
        {
            "period": "2021-2022",
            "entries": [
            { "order": 20, "idNumber": "49394", "callsign": "Barmaley", "km": "Vitia Tachka" },
            { "order": 21, "idNumber": "60022", "callsign": "Laggy", "km": "Vitia Tachka" },
            { "order": 22, "idNumber": "5937", "callsign": "Sky", "km": "Vitia Tachka" },
            { "order": 23, "idNumber": "39816", "callsign": "PiNGviN", "km": "Vitia Tachka" },
            { "order": 24, "idNumber": "60955", "callsign": "Alpha", "km": "Vitia Tachka" },
            { "order": 25, "idNumber": "8652", "callsign": "Crack", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2023-2024",
            "entries": [
            { "order": 26, "idNumber": "87207", "callsign": "Mrak", "km": "Alpha" },
            { "order": 27, "idNumber": "6677", "callsign": "Takeda", "km": "Crack" },
            { "order": 28, "idNumber": "10717", "callsign": "luvti", "km": "Crack" },
            { "order": 29, "idNumber": "6677", "callsign": "Takeda", "km": "NightGlade" }
            ]
        },
        {
            "period": "2024-2025",
            "entries": [
            { "order": 30, "idNumber": "0326", "callsign": "Mia", "km": "Vitia Tachka" },
            { "order": 31, "idNumber": "0045", "callsign": "doctor", "km": "Vitia Tachka" },
            { "order": 32, "idNumber": "0038", "callsign": "Adam Jey", "km": "doctor" },
            { "order": 33, "idNumber": "0078", "callsign": "TyP60", "km": "Takeda" },
            { "order": 34, "idNumber": "0263", "callsign": "Noisy", "km": "Flogger" },
            { "order": 35, "idNumber": "0217", "callsign": "Admentai", "km": "Flogger" },
            { "order": 36, "idNumber": "0002", "callsign": "Flogger", "km": "Takeda" }
            ]
        },
        {
            "period": "2025-2026",
            "entries": [
            { "order": 37, "idNumber": "0268", "callsign": "Острый", "km": "Admentai" },
            { "order": 38, "idNumber": "2164", "callsign": "Undertaker", "km": "Admentai" },
            { "order": 39, "idNumber": "4305", "callsign": "Margon", "km": "Admentai" },
            { "order": 40, "idNumber": "0127", "callsign": "MeGa", "km": "Острый" },
            { "order": 41, "idNumber": "0030", "callsign": "Fortune", "km": "Острый" },
            { "order": 42, "idNumber": "0018", "callsign": "Ving", "km": "Undertaker" },
            { "order": 43, "idNumber": "14228", "callsign": "Перега Сират", "km": "Barsik" },
            { "order": 44, "idNumber": "0641", "callsign": "Sorry", "km": "Ving" },
            { "order": 45, "idNumber": "11699", "callsign": "Wilory", "km": "Ving" }
            ]
        },
        {
            "period": "2026-2027",
            "entries": [
            { "order": 46, "idNumber": "0896", "callsign": "Роскомнадзор", "km": "Sorry" },
            { "order": 47, "idNumber": "15322", "callsign": "Nimitz", "km": "Sorry" }
            ]
        }
        ],
    "Командир": [
        {
            "period": "2017-2018",
            "entries": [
            { "order": 1, "idNumber": "1552", "callsign": "NightGlade", "km": "Raide" },
            { "order": 2, "idNumber": "9129", "callsign": "Golden", "km": "Raide" },
            { "order": 3, "idNumber": "7804", "callsign": "SaiRaz", "km": "Van9" },
            { "order": 4, "idNumber": "6769", "callsign": "Gyl", "km": "Volche" },
            { "order": 5, "idNumber": "1332", "callsign": "LENIN", "km": "TequilaBoom" },
            { "order": 6, "idNumber": "5267", "callsign": "PiNGviN", "km": "TyP60" },
            { "order": 7, "idNumber": "8774", "callsign": "Werex", "km": "LENIN" },
            { "order": 8, "idNumber": "2806", "callsign": "Kupa", "km": "LENIN" },
            { "order": 9, "idNumber": "4268", "callsign": "Sergey", "km": "LENIN" },
            { "order": 10, "idNumber": "1302", "callsign": "KOT", "km": "PiNGviN" },
            { "order": 11, "idNumber": "5937", "callsign": "Sky", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2019-2020",
            "entries": [
            { "order": 12, "idNumber": "4931", "callsign": "ZloDiaN", "km": "KOT" },
            { "order": 13, "idNumber": "05573", "callsign": "Mia", "km": "Sky" },
            { "order": 14, "idNumber": "9312", "callsign": "Pisy4", "km": "Sky" },
            { "order": 15, "idNumber": "16051", "callsign": "Ладислав Сладенький", "km": "Mia" },
            { "order": 16, "idNumber": "2806", "callsign": "KupchakoV", "km": "Pisy4" },
            { "order": 17, "idNumber": "07745", "callsign": "Caines Ceno", "km": "Pisy4" },
            { "order": 18, "idNumber": "6084", "callsign": "Qteon", "km": "ProTagOn1st" },
            { "order": 19, "idNumber": "02712", "callsign": "Кун Агеро Агнис", "km": "ProTagOn1st" },
            { "order": 20, "idNumber": "29685", "callsign": "Vitia Tachka", "km": "Kupa" },
            { "order": 21, "idNumber": "07348", "callsign": "payn", "km": "Qteon" },
            { "order": 22, "idNumber": "49394", "callsign": "Barmaley", "km": "Mia" }
            ]
        },
        {
            "period": "2021-2022",
            "entries": [
            { "order": 23, "idNumber": "60022", "callsign": "Laggy", "km": "Vitia Tachka" },
            { "order": 24, "idNumber": "5937", "callsign": "Sky", "km": "Vitia Tachka" },
            { "order": 25, "idNumber": "39816", "callsign": "PiNGviN", "km": "Vitia Tachka" },
            { "order": 26, "idNumber": "60955", "callsign": "Alpha", "km": "Vitia Tachka" },
            { "order": 27, "idNumber": "8652", "callsign": "Crack", "km": "Vitia Tachka" },
            { "order": 28, "idNumber": "87207", "callsign": "Mrak", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2023-2024",
            "entries": [
            { "order": 29, "idNumber": "51552", "callsign": "ByxouBarash", "km": "Alpha" },
            { "order": 30, "idNumber": "47850", "callsign": "Bibok", "km": "Alpha" },
            { "order": 31, "idNumber": "6677", "callsign": "Takeda", "km": "Crack" },
            { "order": 32, "idNumber": "10717", "callsign": "luvti", "km": "Crack" },
            { "order": 33, "idNumber": "48327", "callsign": "Skyline", "km": "Crack" },
            { "order": 34, "idNumber": "51552", "callsign": "ByxouBarash", "km": "NightGlade" },
            { "order": 35, "idNumber": "60811", "callsign": "laLala Лоля", "km": "NightGlade" }
            ]
        },
        {
            "period": "2024-2025",
            "entries": [
            { "order": 36, "idNumber": "0245", "callsign": "ProTagOn1st", "km": "Vitia Tachka" },
            { "order": 37, "idNumber": "0038", "callsign": "Adam Jey", "km": "Vitia Tachka" },
            { "order": 38, "idNumber": "0306", "callsign": "Sky", "km": "Vitia Tachka" },
            { "order": 39, "idNumber": "0078", "callsign": "TyP60", "km": "doctor" },
            { "order": 40, "idNumber": "0038", "callsign": "Adam Jey", "km": "Takeda" },
            { "order": 41, "idNumber": "0403", "callsign": "ARTORIA", "km": "Flogger" },
            { "order": 42, "idNumber": "0217", "callsign": "Admentai", "km": "Flogger" },
            { "order": 43, "idNumber": "0268", "callsign": "Острый", "km": "Takeda" }
            ]
        },
        {
            "period": "2025-2026",
            "entries": [
            { "order": 44, "idNumber": "0038", "callsign": "Adam Jey", "km": "Admentai" },
            { "order": 45, "idNumber": "0262", "callsign": "Mamba out", "km": "Admentai" },
            { "order": 46, "idNumber": "7014", "callsign": "Авангардист", "km": "Admentai" },
            { "order": 47, "idNumber": "0030", "callsign": "Fortune", "km": "Острый" },
            { "order": 48, "idNumber": "0273", "callsign": "Чувашский Король", "km": "Острый" },
            { "order": 49, "idNumber": "0173", "callsign": "Barsik", "km": "Undertaker" },
            { "order": 50, "idNumber": "0641", "callsign": "Sorry", "km": "Barsik" },
            { "order": 51, "idNumber": "11699", "callsign": "Wilory", "km": "Ving" },
            { "order": 52, "idNumber": "1656", "callsign": "Feyken", "km": "Ving" }
            ]
        },
        {
            "period": "2026-2027",
            "entries": [
            { "order": 53, "idNumber": "0045", "callsign": "doctor", "km": "Sorry" },
            { "order": 54, "idNumber": "15322", "callsign": "Nimitz", "km": "Sorry" },
            { "order": 55, "idNumber": "7884", "callsign": "Roberto", "km": "Sorry" },
            { "order": 56, "idNumber": "8903", "callsign": "Boggi", "km": "Sorry" },
            { "order": 57, "idNumber": "0326", "callsign": "Mia", "km": "Sorry" },
            { "order": 58, "idNumber": "0018", "callsign": "Ving", "km": "Sorry" }
            ]
        }
        ],
};

export function CommandersRegistry() {
    const [activeRank, setActiveRank] = useState("Клон Командер");
    const [selectedCommander, setSelectedCommander] = useState<CommanderEntry | null>(null);

    const currentEras = ARCHIVE_DATA[activeRank] || [];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 font-mono">
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-8">
            {Object.keys(ARCHIVE_DATA).map((rank) => (
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
                    <th className="pb-2 font-normal w-12">Поряд.</th>
                    <th className="pb-2 font-normal w-16">Номер</th>
                    <th className="pb-2 font-normal">Позывной</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {era.entries.map((entry) => (
                    <tr
                        key={entry.idNumber}
                        onClick={() => setSelectedCommander(entry)}
                        className="group border-b border-slate-900/60 hover:bg-[#3D6FC4]/5 cursor-pointer transition-colors"
                    >
                        <td className="py-2.5 text-slate-600 font-bold group-hover:text-slate-400">
                        {String(entry.order).padStart(2, "0")}
                        </td>
                        <td className="py-2.5 text-slate-400 font-medium group-hover:text-white">
                        #{entry.idNumber}
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

        {/* 3. МОДАЛЬНОЕ ОКНО ДЕТАЛИЗАЦИИ (ЗДЕСЬ ПОКАЗЫВАЕМ КМ) */}
        {selectedCommander && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="w-full max-w-md bg-[#0d1829] border border-slate-700 p-6 relative shadow-2xl">
                {/* Кнопка закрытия */}
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
                    <span className="text-slate-300 font-bold">{selectedCommander.order}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">Текущий статус:</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">В архиве легиона</span>
                </div>
                
                {/* Показываем секретное поле КМ только тут */}
                <div className="flex justify-between bg-[#3D6FC4]/5 p-2 border-l-2 border-[#3D6FC4] mt-4">
                    <span className="text-slate-400 uppercase font-bold">Управляющий (КМ):</span>
                    <span className="text-white font-bold tracking-wide">{selectedCommander.km}</span>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}