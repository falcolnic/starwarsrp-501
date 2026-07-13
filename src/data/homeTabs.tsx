import { FileText, Sword, Code2, Map, Archive, BookOpen } from "lucide-react";
import { MapViewer } from "../app/components/MapViewer";
import { PlaceholderText } from "../app/components/ui/HomeComponents";

export const homeTabs = [
    { 
        id: "charter", 
        label: "УСТАВ ПОДРАЗДЕЛЕНИЯ", 
        icon: <FileText size={16} />, 
        content: <PlaceholderText lines={5} /> 
    },
    {
        id: "oath", 
        label: "КЛЯТВА БОЙЦА", 
        icon: <Sword size={16} />,
        content: (
        <div className="flex flex-col gap-2">
            <div className="border-l-2 border-[var(--primary)] pl-4 font-sans text-sm text-[var(--muted-foreground)] leading-relaxed italic">
            «Я, солдат Великой Армии Республики, торжественно клянусь отстаивать ценности 501-го Элитного Штурмового Легиона — стоять рядом с братьями на поле боя, следовать законным приказам с дисциплиной и целеустремлённостью, и чтить Республику каждым своим поступком на поле боя и за его пределами. Моя верность непоколебима. Моя решимость абсолютна.»
            </div>
            <p className="font-mono text-xs text-gray-500">[ЗАГЛУШКА — КЛИЕНТ ПРЕДОСТАВИТ ФИНАЛЬНЫЙ ТЕКСТ КЛЯТВЫ]</p>
        </div>
        ),
    },
    {
        id: "coding", 
        label: "КОДИРОВКА ПОДРАЗДЕЛЕНИЯ", 
        icon: <Code2 size={16} />,
        content: (
        <div className="flex flex-col gap-2">
            <div className="bg-slate-900/80 border border-[var(--border)] p-4 font-mono text-sm text-[var(--muted-foreground)] leading-relaxed">
            <div className="text-[var(--primary)] mb-2"># СТРУКТУРА ПОЗЫВНОГО</div>
            <div>ФОРМАТ: <span className="text-[var(--foreground)]">[ПОЗЫВНОЙ]-[БУКВА][ЦИФРА]</span></div>
            <div>ПРИМЕР: <span className="text-yellow-500">Loader-D4</span> | <span className="text-yellow-500">Torch-K7</span> | <span className="text-yellow-500">Viper-A9</span></div>
            <div className="mt-3 text-[var(--primary)]"># ТЕГИ ОТРЯДОВ</div>
            <div>ARC-C / ARC-1..3 — Штурмовые разведчики</div>
            <div>HFN / ZHFN / FN — Полевой отдел</div>
            <div>CA — Прочее</div>
            </div>
            <p className="font-mono text-xs text-gray-500">[ЗАГЛУШКА — ПРЕДОСТАВЬТЕ ПОЛНУЮ ДОКУМЕНТАЦИЮ ПО КОДИРОВКЕ]</p>
        </div>
        ),
    },
    { 
        id: "map", 
        label: "ИНТЕРАКТИВНАЯ КАРТА", 
        icon: <Map size={16} />, 
        content: <MapViewer /> 
    },
    {
        id: "documents", 
        label: "ДОКУМЕНТЫ", 
        icon: <Archive size={16} />,
        content: (
        <div className="flex flex-col gap-1.5">
            {["Постоянные приказы — Вып. 12", "Правила боевого взаимодействия — Ред. 4", "Протокол подготовки — Цикл Альфа", "Отчёты по итогам операций — Архив"].map((doc, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-slate-900/40 border border-[var(--border)] transition-colors hover:border-[var(--primary)]">
                <FileText size={14} className="text-[var(--primary)] shrink-0" />
                <span className="font-mono text-sm text-[var(--muted-foreground)] flex-1">{doc}</span>
                <span className="font-mono text-xs text-gray-500">ЗАГЛУШКА</span>
            </div>
            ))}
        </div>
        ),
    },
    { 
        id: "useful", 
        label: "ПОЛЕЗНЫЕ ДАННЫЕ", 
        icon: <BookOpen size={16} />, 
        content: <PlaceholderText lines={4} /> 
    },
];