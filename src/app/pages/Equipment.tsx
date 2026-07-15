import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { 
  Shield, 
  Eye, 
  Compass, 
  FolderGit2, 
  Luggage, 
  Layers, 
  Sun, 
  HelpCircle, 
  Radio, 
  AlertTriangle 
} from "lucide-react";

const sections = [
    { id: "armor", label: "Броня бойца В.А.Р." },
    { id: "helmet", label: "Шлем и его возможности" },
    { id: "additional", label: "Дополнительное оснащение" },
];

export function Equipment() {
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState(sections[0].id);
    const refs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const hash = location.hash.replace("#", "");
        if (hash && refs.current[hash]) {
            refs.current[hash]?.scrollIntoView({ behavior: "smooth", block: "start" });
            setActive(hash);
        }
    }, [location.hash]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: "-40% 0px -50% 0px" }
        );
        Object.values(refs.current).forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    function goTo(id: string) {
        navigate(`#${id}`, { replace: false });
        refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(id);
    }

    return (
        <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col gap-12 text-white">
            
            {/* Header */}
            <div className="border-b border-[var(--border)]/30 pb-4">
                <h1
                    className="text-2xl lg:text-3xl font-bold tracking-[0.12em] uppercase m-0"
                    style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
                >
                    Снаряжение бойца
                </h1>
                <p className="font-mono text-xs text-[var(--muted-foreground)] tracking-wider mt-1 uppercase">
                    СПЕЦИФИКАЦИЯ ЭКИПИРОВКИ ВЕЛИКОЙ АРМИИ РЕСПУБЛИКИ // КЛАССЫ ФАЗА II
                </p>
            </div>

            {/* Sticky Navigation Tabs */}
            <div
                className="sticky top-[70px] z-20 flex gap-1 border-b py-2"
                style={{ background: "var(--background)", borderColor: "var(--border)" }}
            >
                {sections.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => goTo(s.id)}
                        className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.08em] px-3 sm:px-5 py-2 border-b-2 transition-all duration-150 cursor-pointer"
                        style={{
                            color: active === s.id ? "var(--primary)" : "var(--muted-foreground)",
                            borderColor: active === s.id ? "var(--primary)" : "transparent",
                        }}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* ================= SECTION 1: ARMOR ================= */}
            <section id="armor" ref={(el) => { refs.current.armor = el; }} className="scroll-mt-[140px] space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-[var(--primary)] pl-3">
                    <Shield className="text-[var(--primary)] shrink-0" size={20} />
                    <h2 className="text-xl font-bold tracking-[0.05em] uppercase font-display">
                        Броня бойца В.А.Р.
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Text Specs */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* ЧНК */}
                        <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded p-5 space-y-3">
                            <h3 className="font-display text-sm font-bold tracking-wider text-[var(--primary)] uppercase">
                                ЧНК (ЧЕРНЫЙ НАТЕЛЬНЫЙ КОСТЮМ)
                            </h3>
                            <ul className="list-none space-y-2.5 pl-0 text-sm text-slate-300 font-mono">
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[var(--primary)] mt-1 shrink-0">•</span>
                                    <span>Надевается под бронепластины.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[var(--primary)] mt-1 shrink-0">•</span>
                                    <span>Защищает от ядовитых испарений.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[var(--primary)] mt-1 shrink-0">•</span>
                                    <span>Защищает от экстремальных условий вакуума.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[var(--primary)] mt-1 shrink-0">•</span>
                                    <span>Оснащен встроенным устройством климат-контроля.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Броня */}
                        <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded p-5 space-y-3">
                            <h3 className="font-display text-sm font-bold tracking-wider text-[var(--primary)] uppercase">
                                Бронепластины фаза II
                            </h3>
                            <ul className="list-none space-y-2.5 pl-0 text-sm text-slate-300 font-mono">
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[var(--primary)] mt-1 shrink-0">•</span>
                                    <span>Состоит из <strong className="text-white">20-ти</strong> композитных бронепластин.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[var(--primary)] mt-1 shrink-0">•</span>
                                    <span>Фиксируется высоконадежными магнитными защелками на ЧНК.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[var(--primary)] mt-1 shrink-0">•</span>
                                    <span>Полный боевой вес комплекта: <strong className="text-white">40 кг</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-[var(--primary)] mt-1 shrink-0">•</span>
                                    <span>Эргономически одинакова для всех подразделений клонов.</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-red-400/90 bg-red-950/10 p-2 rounded border border-red-900/20">
                                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                    <span>Неэффективна против шрапнели тяжелых орудий и сосредоточенного бластерного огня.</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-amber-400/80">
                                    <span className="text-amber-500 shrink-0">•</span>
                                    <span>Физически неудобна, снижает маневренность и частично сковывает движения бойца.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Пояс */}
                        <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded p-5 space-y-3">
                            <h3 className="font-display text-sm font-bold tracking-wider text-[var(--primary)] uppercase">
                                Тактический Разгрузочный Пояс
                            </h3>
                            <p className="text-xs text-slate-400 font-mono leading-relaxed">
                                Изготавливается из закаленных легких металлов для обеспечения дополнительной бронезащиты паховой зоны. Базовая укомплектованность:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
                                <div className="p-2 bg-[#080d17]/60 border border-slate-800/50 rounded flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                                    <span>Сухой паёк (Ration pack)</span>
                                </div>
                                <div className="p-2 bg-[#080d17]/60 border border-slate-800/50 rounded flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                                    <span>Бластерные картриджи x4</span>
                                </div>
                                <div className="p-2 bg-[#080d17]/60 border border-slate-800/50 rounded flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                                    <span>Магнитные тросы-кошки</span>
                                </div>
                                <div className="p-2 bg-[#080d17]/60 border border-slate-800/50 rounded flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                                    <span>Профильное оборудование</span>
                                </div>
                            </div>
                            <div className="text-[11px] font-mono border border-red-500/30 bg-red-950/20 p-2 rounded text-red-300/90 flex items-center gap-2">
                                <span className="font-bold text-red-400 shrink-0">РЕЗЕРВНЫЙ ПРОТОКОЛ:</span>
                                <span>Конструкция пояса позволяет детонировать его батареи в качестве мощного теплового детонатора.</span>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Single Image Frame for Armor */}
                    <div className="lg:col-span-5 h-full min-h-[400px]">
                        <div className="sticky top-[150px] w-full h-[550px] border border-[var(--border)]/30 rounded bg-[#0c1424]/40 flex flex-col overflow-hidden">
                            <div className="px-4 py-2 border-b border-[var(--border)]/20 bg-[#080d17]/80 flex justify-between items-center text-[10px] font-mono tracking-wider text-slate-400">
                                <span>ID // DETECT_ARMOR_PLATE_LAYOUT</span>
                                <span className="text-[var(--primary)] animate-pulse">● LIVE</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center p-4">
                                {/* Замените src на путь к картинке брони: src="/images/armor-bg.png" */}
                                <img 
                                    src="/images/armor-bg.png" 
                                    alt="В.А.Р. Броня чертеж" 
                                    className="max-h-full max-w-full object-contain filter brightness-90 contrast-105"
                                    onError={(e) => {
                                        // Запасной стильный плейсхолдер
                                        e.currentTarget.style.display = "none";
                                        const p = e.currentTarget.parentElement;
                                        if (p) p.innerHTML = '<div class="text-xs text-slate-600 font-mono">[ Броня: Изображение не найдено ]</div>';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SECTION 2: HELMET ================= */}
            <section id="helmet" ref={(el) => { refs.current.helmet = el; }} className="scroll-mt-[140px] space-y-6 pt-6 border-t border-[var(--border)]/20">
                <div className="flex items-center gap-3 border-l-4 border-[var(--primary)] pl-3">
                    <Radio className="text-[var(--primary)] shrink-0" size={20} />
                    <h2 className="text-xl font-bold tracking-[0.05em] uppercase font-display">
                        Шлем и его возможности
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Text Specs */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded p-6 space-y-4">
                            <h3 className="font-display text-sm font-bold tracking-wider text-[var(--primary)] uppercase border-b border-[var(--border)]/20 pb-2">
                                Сводная сводка характеристик шлема
                            </h3>
                            
                            <div className="grid grid-cols-1 gap-4 text-sm font-mono text-slate-300">
                                
                                <div className="border-l-2 border-[var(--primary)]/60 pl-3 py-1 space-y-1">
                                    <div className="text-white font-semibold">T-визор и Спектральные фильтры:</div>
                                    <div className="text-xs text-slate-400">Позволяет владельцу вести наблюдение в дыму, пламени, тумане, пылевой буре и абсолютной темноте. Имеет макробинокль с малым цифровым увеличением.</div>
                                </div>

                                <div className="border-l-2 border-[var(--primary)]/60 pl-3 py-1 space-y-1">
                                    <div className="text-white font-semibold">Интегрированная рация и Вокодер:</div>
                                    <div className="text-xs text-slate-400">Шифрованная многоканальная радиосвязь внутри взвода. Вокодер маскирует аутентичную речь и при необходимости позволяет изменять параметры тональности голоса.</div>
                                </div>

                                <div className="border-l-2 border-[var(--primary)]/60 pl-3 py-1 space-y-1">
                                    <div className="text-white font-semibold">Защита от вспышек (Auto-Polarization):</div>
                                    <div className="text-xs text-slate-400">Защищает глаза от резких световых вспышек, лазерных засветов и перепадов яркости на поле боя.</div>
                                </div>

                                <div className="border-l-2 border-[var(--primary)]/60 pl-3 py-1 space-y-1">
                                    <div className="text-white font-semibold">Система Замкнутого Дыхания (СЗД):</div>
                                    <div className="text-xs text-slate-400">Оснащен автономным воздушным дыхательным фильтром, задерживающим биологические токсины, пыльцу и отравляющие газы.</div>
                                </div>

                                <div className="border-l-2 border-[var(--primary)]/60 pl-3 py-1 space-y-1">
                                    <div className="text-white font-semibold">HUD Целеуказатель (Sights Sync):</div>
                                    <div className="text-xs text-slate-400">Напрямую связывается с дальномером оружия и проецирует прицельную сетку, остаток патронов и статус перегрева прямо на визор.</div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Right Column: Single Image Frame for Helmet */}
                    <div className="lg:col-span-5 h-full min-h-[400px]">
                        <div className="sticky top-[150px] w-full h-[450px] border border-[var(--border)]/30 rounded bg-[#0c1424]/40 flex flex-col overflow-hidden">
                            <div className="px-4 py-2 border-b border-[var(--border)]/20 bg-[#080d17]/80 flex justify-between items-center text-[10px] font-mono tracking-wider text-slate-400">
                                <span>ID // HELMET_HUD_OVERLAY_SPECS</span>
                                <span className="text-[var(--primary)]">READY</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center p-4">
                                {/* Замените src на путь к картинке шлема: src="/images/helmet-bg.png" */}
                                <img 
                                    src="/images/helmet-bg.png" 
                                    alt="В.А.Р. Шлем чертеж" 
                                    className="max-h-full max-w-full object-contain filter brightness-90 contrast-105"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        const p = e.currentTarget.parentElement;
                                        if (p) p.innerHTML = '<div class="text-xs text-slate-600 font-mono">[ Шлем: Изображение не найдено ]</div>';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SECTION 3: ADDITIONAL EQUIPMENT ================= */}
            <section id="additional" ref={(el) => { refs.current.additional = el; }} className="scroll-mt-[140px] space-y-6 pt-6 border-t border-[var(--border)]/20">
                <div className="flex items-center gap-3 border-l-4 border-[var(--primary)] pl-3">
                    <Layers className="text-[var(--primary)] shrink-0" size={20} />
                    <h2 className="text-xl font-bold tracking-[0.05em] uppercase font-display">
                        Дополнительное оснащение
                    </h2>
                </div>

                {/* Grid of separate tactical items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* 1. Наплечник */}
                    <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded overflow-hidden flex flex-col">
                        <div className="px-4 py-2.5 bg-[#080d17]/80 border-b border-slate-800 flex items-center gap-2">
                            <Layers size={14} className="text-[var(--primary)]" />
                            <span className="font-display font-bold text-xs uppercase tracking-wider">Наплечник</span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-2 text-xs font-mono text-slate-400 leading-relaxed">
                                <p>Служит преимущественно в качестве <strong className="text-white">средства тактического обозначения звания</strong> и принадлежности к подразделению, нежели сугубо для защиты плеча.</p>
                                <p>Обычно изготавливается из той же броневой пластины, однако может обладать иными модифицирующими материалами в зависимости от климатических задач.</p>
                            </div>
                            <div className="w-full md:w-32 h-32 border border-slate-800 rounded bg-slate-950/60 shrink-0 flex items-center justify-center p-2">
                                <img src="/images/pauldron.png" alt="Наплечник" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            </div>
                        </div>
                    </div>

                    {/* 2. Галлера */}
                    <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded overflow-hidden flex flex-col md:col-span-2">
                        <div className="px-4 py-2.5 bg-[#080d17]/80 border-b border-slate-800 flex items-center gap-2">
                            <Layers size={14} className="text-[var(--primary)]" />
                            <span className="font-display font-bold text-xs uppercase tracking-wider">Шейная бронепластина (Галлера)</span>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="text-xs font-mono text-slate-400 leading-relaxed space-y-2">
                                <p>Галера представляет собой композитный барьерный элемент — промежуточное тактическое решение между базовой броней и нательным костюмом (ЧНК).</p>
                                <p>Уровень прочности уступает стандартным броневым пластинам, однако надежно превосходит ЧНК. Прочная укладка нитей снижает вероятность пробития осколками, страхуя уязвимые кровеносные артерии шеи от осколочного ранения.</p>
                                <p className="text-amber-400/90 font-semibold">Важно: Плотность прессовки ухудшает вентиляцию и теплообмен, из-за чего теплоотдача тела клона в окружающую среду замедляется.</p>
                            </div>

                            {/* Double Image States */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="border border-slate-800/80 rounded bg-[#080d17]/40 p-3 flex flex-col items-center gap-2">
                                    <span className="font-mono text-[10px] text-slate-400 uppercase">Положение: Спущенный</span>
                                    <div className="w-full h-32 border border-slate-900 rounded bg-slate-950 flex items-center justify-center p-2">
                                        <img src="/images/gorget-down.png" alt="Галлера Спущенный" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                                    </div>
                                </div>
                                <div className="border border-slate-800/80 rounded bg-[#080d17]/40 p-3 flex flex-col items-center gap-2">
                                    <span className="font-mono text-[10px] text-[var(--primary)] uppercase">Положение: Приподнятый</span>
                                    <div className="w-full h-32 border border-slate-900 rounded bg-slate-950 flex items-center justify-center p-2">
                                        <img src="/images/gorget-up.png" alt="Галлера Приподнятый" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Визор */}
                    <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded overflow-hidden flex flex-col">
                        <div className="px-4 py-2.5 bg-[#080d17]/80 border-b border-slate-800 flex items-center gap-2">
                            <Eye size={14} className="text-[var(--primary)]" />
                            <span className="font-display font-bold text-xs uppercase tracking-wider">Визор (Дополнительный щиток)</span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-2 text-xs font-mono text-slate-400 leading-relaxed">
                                <p>Защитный прозрачный барьер для глаз. Фильтрует внешнее ультрафиолетовое и лазерное излучение, страхует оптический блок шлема от шрапнельной пыли и мелкокалиберных осколков.</p>
                                <p>Интегрируется с портативными ПК для дублирования графических карт на сетчатке и обеспечивает тактическую анонимность бойца.</p>
                            </div>
                            <div className="w-full md:w-32 h-32 border border-slate-800 rounded bg-slate-950/60 shrink-0 flex items-center justify-center p-2">
                                <img src="/images/visor.png" alt="Дополнительный визор" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            </div>
                        </div>
                    </div>

                    {/* 4. Солнцезащитный козырек */}
                    <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded overflow-hidden flex flex-col">
                        <div className="px-4 py-2.5 bg-[#080d17]/80 border-b border-slate-800 flex items-center gap-2">
                            <Sun size={14} className="text-[var(--primary)]" />
                            <span className="font-display font-bold text-xs uppercase tracking-wider">Солнцезащитный козырек</span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-2 text-xs font-mono text-slate-400 leading-relaxed">
                                <p>Физический козырек, монтируемый прямо над надбровной дугой шлема. Предохраняет оптический Т-визор от прямых слепящих лучей солнца во время операций на открытых планетах.</p>
                                <p>В некоторых батальонах и взводах используется как элемент визуального отличия званий.</p>
                            </div>
                            <div className="w-full md:w-32 h-32 border border-slate-800 rounded bg-slate-950/60 shrink-0 flex items-center justify-center p-2">
                                <img src="/images/sun-shield.png" alt="Козырек" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            </div>
                        </div>
                    </div>

                    {/* 5. Рюкзак */}
                    <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded overflow-hidden flex flex-col md:col-span-2">
                        <div className="px-4 py-2.5 bg-[#080d17]/80 border-b border-slate-800 flex items-center gap-2">
                            <Luggage size={14} className="text-[var(--primary)]" />
                            <span className="font-display font-bold text-xs uppercase tracking-wider">Тактический рюкзак поддержки</span>
                        </div>
                        <div className="p-4 flex flex-col lg:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <p className="text-xs font-mono text-slate-400">Увеличивает автономность солдат на враждебных территориях в разы. Внутренние модули вмещают:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
                                    <div className="p-2 border border-slate-800/80 rounded bg-[#080d17]/30">
                                        <strong className="text-white block mb-0.5">Боекомплект:</strong>
                                        Дополнительные ячейки питания и обоймы для винтовок DC-15S.
                                    </div>
                                    <div className="p-2 border border-slate-800/80 rounded bg-[#080d17]/30">
                                        <strong className="text-white block mb-0.5">Полевые комплекты:</strong>
                                        Медицинские стимуляторы (бакта), взрывпакеты, ремонтный инструмент.
                                    </div>
                                    <div className="p-2 border border-slate-800/80 rounded bg-[#080d17]/30">
                                        <strong className="text-white block mb-0.5">Сухпайки:</strong>
                                        Критический резервный запас пищи и очиститель фильтрации воды.
                                    </div>
                                    <div className="p-2 border border-slate-800/80 rounded bg-[#080d17]/30">
                                        <strong className="text-white block mb-0.5">Коммуникационный шифратор:</strong>
                                        Дальние передатчики для стабильной связи со штабом на орбите.
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-48 h-48 border border-slate-800 rounded bg-slate-950/60 shrink-0 flex items-center justify-center p-3 align-self-center">
                                <img src="/images/backpack.png" alt="Тактический рюкзак" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            </div>
                        </div>
                    </div>

                    {/* 6. Кама */}
                    <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded overflow-hidden flex flex-col">
                        <div className="px-4 py-2.5 bg-[#080d17]/80 border-b border-slate-800 flex items-center gap-2">
                            <Layers size={14} className="text-[var(--primary)]" />
                            <span className="font-display font-bold text-xs uppercase tracking-wider">Кама (Тактическая юбка)</span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-2 text-xs font-mono text-slate-400 leading-relaxed">
                                <p>Гибкая кожаная броня, крепящаяся на талии. Изготавливается из прочной, обработанной салластанской или кореллианской кожи.</p>
                                <p>Предохраняет ноги бойца от случайной шрапнели, осколков и обратных реактивных потоков при прыжках на джетпаках или вождении реактивной техники.</p>
                                <p>Является известным визуальным маркером ранга и принадлежности к элите (ARC).</p>
                            </div>
                            <div className="w-full md:w-32 h-32 border border-slate-800 rounded bg-slate-950/60 shrink-0 flex items-center justify-center p-2">
                                <img src="/images/kama.png" alt="Кама" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            </div>
                        </div>
                    </div>

                    {/* 7. Дальномер */}
                    <div className="bg-[#0c1424]/40 border border-[var(--border)]/30 rounded overflow-hidden flex flex-col">
                        <div className="px-4 py-2.5 bg-[#080d17]/80 border-b border-slate-800 flex items-center gap-2">
                            <Compass size={14} className="text-[var(--primary)]" />
                            <span className="font-display font-bold text-xs uppercase tracking-wider">Дальномер (Антенна)</span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-2 text-xs font-mono text-slate-400 leading-relaxed">
                                <p>Устройство оптического приближения удаленных целей с одновременным выводом физических телеметрических данных (дистанция, скорость движения цели, габариты).</p>
                                <p>При сопряжении с внешним командирским биноклем дает глубокий функционал, позволяющий захватывать и отслеживать цели через тонкие препятствия (стены, возвышения рельефа).</p>
                            </div>
                            <div className="w-full md:w-32 h-32 border border-slate-800 rounded bg-slate-950/60 shrink-0 flex items-center justify-center p-2">
                                <img src="/images/rangefinder.png" alt="Дальномер" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}