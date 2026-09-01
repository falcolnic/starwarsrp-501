import { useEffect, useState } from "react";
import { FileText, Sword, Code2, Map, Archive, BookOpen, ChevronRight, Bot, ShieldHalf, Users2, Shield, Briefcase } from "lucide-react";
import { Link } from "react-router";

function OathTabContent({ text }: { text: string }) {
    const [npz, setNpz] = useState("");
    const parts = text.split("{{npz}}");

    return (
        <div className="flex flex-col gap-2">
            <div className="border-l-2 border-[var(--primary)] pl-4 font-sans text-base text-[var(--muted-foreground)] leading-relaxed italic">
                {parts[0]}
                {parts.length > 1 && (
                    <input
                        type="text"
                        value={npz}
                        onChange={(e) => setNpz(e.target.value)}
                        placeholder="Введите НПЗ"
                        className="mx-1.5 px-4 py-0.5 bg-[#080d17] border-b-2 border-[var(--primary)] focus:border-[#2ECC71] text-[var(--chart-3)] placeholder:text-slate-600 font-bold focus:outline-none transition-colors rounded-none w-70 text-center inline-block not-italic"
                    />
                )}
                {parts.length > 1 && parts[1]}
            </div>
        </div>
    );
}

export function useHomeTabs() {
    const [content, setContent] = useState({
        charter: "",
        oath: "",
        coding: "",
        documents: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTabs() {
            try {
                const [charterRes, oathRes, codingRes, docsRes] = await Promise.all([
                    fetch("/api/content/tab_charter").then(r => r.json()),
                    fetch("/api/content/oath_text").then(r => r.json()),
                    fetch("/api/content/tab_coding").then(r => r.json()),
                    fetch("/api/content/tab_documents").then(r => r.json())
                ]);

                let parsedDocs = [];
                try {
                    if (docsRes.content) parsedDocs = JSON.parse(docsRes.content);
                } catch (e) {
                    console.error("Ошибка парсинга документов (ожидался JSON)", e);
                }

                setContent({
                    charter: charterRes.content || "<p>Устав не заполнен</p>",
                    oath: oathRes.content || "Текст присяги не найден.",
                    coding: codingRes.content || "<p>Кодировка не заполнена</p>",
                    documents: parsedDocs
                });
            } catch (error) {
                console.error("Ошибка загрузки вкладок", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTabs();
    }, []);

    const tabs = [
        { 
            id: "charter", 
            label: "УСТАВ ПОДРАЗДЕЛЕНИЯ", 
            icon: <FileText size={16} />, 
            content: loading ? <div className="text-[var(--muted-foreground)]">Загрузка...</div> : (
                <div 
                    className="font-sans text-sm text-[var(--muted-foreground)] leading-relaxed space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar"
                    dangerouslySetInnerHTML={{ __html: content.charter }} // Вставляет HTML из БД
                />
            )
        },
        {
            id: "oath", 
            label: "ПРИСЯГА БОЙЦА", 
            icon: <Sword size={16} />,
            content: loading ? <div className="text-[var(--muted-foreground)]">Загрузка...</div> : <OathTabContent text={content.oath} />,
        },
        {
            id: "coding", 
            label: "КОДИРОВКА ПОДРАЗДЕЛЕНИЯ", 
            icon: <Code2 size={16} />,
            content: loading ? <div className="text-[var(--muted-foreground)]">Загрузка...</div> : (
                <div 
                    className="flex flex-col gap-2"
                    dangerouslySetInnerHTML={{ __html: content.coding }} // Вставляет HTML из БД
                />
            ),
        },
        {
            id: "documents",
            label: "ДОКУМЕНТЫ",
            icon: <Archive size={16} />,
            content: loading ? <div className="text-[var(--muted-foreground)]">Загрузка...</div> : (
                <div className="flex flex-col gap-2">
                    {content.documents.map((doc, i) => {
                        const isExternal = doc.href.startsWith("http");
                        const DocIcon = doc.icon === "Briefcase" ? Briefcase : FileText;

                        const innerContent = (
                            <>
                                <DocIcon size={16} className="text-[var(--primary)] shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-mono text-sm text-white group-hover:text-[var(--primary)] transition-colors">
                                        {doc.title}
                                    </h4>
                                    <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
                                        {doc.description}
                                    </p>
                                </div>
                                <ChevronRight size={16} className="text-gray-500 group-hover:text-[var(--primary)] transition-all group-hover:translate-x-1 shrink-0" />
                            </>
                        );

                        const wrapperClass = "group flex items-start gap-3 p-3 bg-slate-900/40 border border-[var(--border)] transition-all hover:border-[var(--primary)] hover:bg-slate-900/60";

                        return isExternal ? (
                            <a key={i} href={doc.href} target="_blank" rel="noopener noreferrer" className={wrapperClass}>
                                {innerContent}
                            </a>
                        ) : (
                            <Link key={i} to={doc.href} className={wrapperClass}>
                                {innerContent}
                            </Link>
                        );
                    })}
                </div>
            ),
        },
        {
            id: "database",
            label: "БАЗА ДАННЫХ",
            icon: <BookOpen size={16} />,
            content: (
                <div className="flex flex-col gap-2">
                    {[
                        { title: "Реестр КМД", description: "Исторический архив офицерского и командного состава легиона, разделенный по эпохам.", to: "/commanders", icon: <Shield size={24} /> },
                        { title: "Зерги", description: "инопланетная раса, представляют собой насекомых-мутантов. Являются второстепенными противниками сил В.А.Р.", to: "/zergs", icon: <Users2 size={24} /> },
                        { title: "Дроиды", description: "Боевые дроиды КНС. Вооружение, тактика противодействия.", to: "/droids", icon: <Bot size={24} /> },
                        { title: "Снаряжение бойца", description: "Снаряжение бойца 501 Э.Ш.Л. это неотъемлемый элемент, который будет сопровождать бойцов до конца.", to: "/equipment", icon: <ShieldHalf size={24} /> },
                    ].map((item) => (
                        <Link key={item.to} to={item.to} className="group flex items-center gap-3 p-3 bg-slate-900/40 border border-[var(--border)] transition-all hover:border-[var(--primary)] hover:bg-slate-900/60">
                            <span className="text-[var(--primary)] shrink-0 mt-0.5">{item.icon}</span>
                            <div className="flex-1">
                                <h4 className="font-mono text-sm text-white group-hover:text-[var(--primary)] transition-colors">{item.title}</h4>
                                <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">{item.description}</p>
                            </div>
                            <ChevronRight size={16} className="text-gray-500 group-hover:text-[var(--primary)] transition-all group-hover:translate-x-1 shrink-0" />
                        </Link>
                    ))}
                </div>
            ),
        },
    ];

    return { tabs, loading };
}
