import { FileText, Sword, Code2, Map, Archive, BookOpen, ChevronRight, Bot, ShieldHalf, Users2 } from "lucide-react";
import { Link } from "react-router";
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
        label: "ПРИСЯГА БОЙЦА", 
        icon: <Sword size={16} />,
        content: (
        <div className="flex flex-col gap-2">
            <div className="border-l-2 border-[var(--primary)] pl-4 font-sans text-base text-[var(--muted-foreground)] leading-relaxed italic">
            «Я, <span className="text-[var(--chart-3)]">НПЗ</span>, принимаю присягу 501 Элитного Штурмового легиона и торжественно клянусь: быть честным, храбрым, дисциплинированным, бдительным бойцом, беспрекословно выполнять воинские уставы, приказы командиров и начальников. Я клянусь добросовестно изучать военное дело, и до последнего вздоха защищать Республику. Я всегда готов встать на защиту Республики и Канцлера, я клянусь защищать мужественно, умело, с достоинством и честью, не щадя своей крови и самой жизни для достижения полной победы над врагами. Если я нарушу мою торжественную клятву то меня ждёт суровая кара Республики , а так-же всеобщая ненависть и презрение.»
            </div>
        </div>
        ),
    },
    {
        id: "coding", 
        label: "КОДИРОВКА ПОДРАЗДЕЛЕНИЯ", 
        icon: <Code2 size={16} />,
        content: (
        <div className="flex flex-col gap-2">
            <span className="font-sans text-sm text-[var(--muted-foreground)] leading-relaxed">
                Коды — самый быстрый способ отдать приказ. Используются для сбора подразделения на определенных точках, переклички состава и обозначения местоположения. 
            </span>
            <p className="font-sans text-sm text-[var(--accent-foreground)]">Коды можно отправлять в чат подразделения со звания <span className="text-[var(--chart-3)] text-base underline">Капрал+</span>.</p>
            <div className="bg-slate-900/80 border border-[var(--border)] p-4 font-mono text-sm text-[var(--muted-foreground)] leading-relaxed">
                <div className="text-[var(--foreground)]">Код-0<span className="text-[var(--muted-foreground)]"> — общая перекличка в чате легиона.</span></div>
                <p>При виде данного кода вам необходимо отписать в чат легиона "+".</p>
                <p>Если боец находится на каком-либо мероприятии, то дополнительно указывается деятельность, которой занят. Пример: + (тренировка)</p>
                <br />
                <div className="text-[var(--foreground)]">C-99<span className="text-[var(--muted-foreground)]"> — местоположение определенного бойца/круга лиц.</span></div>
                <p>При виде данного кода вам необходимо отписать в чат легиона ваше местоположение.</p>
                <p>Можно использовать в ограниченных кругах бойцов.</p>
                <p>Пример: C-99, Офицерский состав.</p>
                <div className="mt-3 text-[var(--primary)]">Коды мест сбора</div>
                <div className="text-[var(--foreground)]">C-1<span className="text-[var(--muted-foreground)]"> — сбор у Главных ворот.</span></div>
                <div className="text-[var(--foreground)]">C-2<span className="text-[var(--muted-foreground)]"> — сбор в 2 Ангаре.</span></div>
                <div className="text-[var(--foreground)]">C-3<span className="text-[var(--muted-foreground)]"> — сбор на плацу.</span></div>
                <div className="text-[var(--foreground)]">C-4<span className="text-[var(--muted-foreground)]"> — сбор возле Казармы 501.</span></div>
                <div className="text-[var(--foreground)]">C-5<span className="text-[var(--muted-foreground)]"> — взятие/сдача основного вооружения и сбор возле Оружейной комнаты.</span></div>
            </div>
        </div>
        ),
    },
    {
        id: "documents",
        label: "ДОКУМЕНТЫ",
        icon: <Archive size={16} />,
        content: (
            <div className="flex flex-col gap-2">
                {[
                    {
                        title: "Устав ВАР",
                        description: "В данном документе описаны основные нормы и правила действующие на базе.",
                        href: "https://docs.google.com/document/d/1RJt-qGdLTiYQWfm26qIc4nSon--kfLAQ0r5IMVbfYeY",
                    },
                    {
                        title: "Правила SWRP",
                        description: "В данном документе описаны основные нормы и правила действующие на сервере.",
                        href: "https://docs.google.com/document/d/1_rg2zg6sd3XHHawp5mcjzBH151VUHBk0PIgFi8tn4N0",
                    },
                    {
                        title: "Звания подразделений",
                        description: "В данном документе описаны наименования и иерархия званий для каждого подразделения, а также их приравнивание.",
                        href: "https://docs.google.com/spreadsheets/d/1Hp8jKji9ukWFPrjqNLTTvOmmSO09Hcpm9rWRijQd5oU",
                    },
                ].map((doc) => (
                    <a
                        key={doc.href}
                        href={doc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 bg-slate-900/40 border border-[var(--border)] transition-all hover:border-[var(--primary)] hover:bg-slate-900/60"
                    >
                        <FileText
                            size={16}
                            className="text-[var(--primary)] shrink-0 mt-0.5"
                        />
                        <div className="flex-1">
                            <h4 className="font-mono text-sm text-white group-hover:text-[var(--primary)] transition-colors">
                                {doc.title}
                            </h4>
                            <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
                                {doc.description}
                            </p>
                        </div>
                        <ChevronRight
                            size={16}
                            className="text-gray-500 group-hover:text-[var(--primary)] transition-all group-hover:translate-x-1 shrink-0"
                        />
                    </a>
                ))}
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
                    { title: "Зерги", description: "инопланетная раса, представляют собой насекомых-мутантов. Являются второстепенными противниками сил В.А.Р.", to: "/zergs", icon: <Users2 size={16} /> },
                    { title: "Дроиды", description: "Боевые дроиды КНС. Вооружение, тактика противодействия.", to: "/droids", icon: <Bot size={16} /> },
                    { title: "Снаряжение бойца", description: "Снаряжение бойца 501 Э.Ш.Л. это неотъемлемый элемент, который будет сопровождать бойцов до конца.", to: "/equipment", icon: <ShieldHalf size={16} /> },
                ].map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="group flex items-center gap-3 p-3 bg-slate-900/40 border border-[var(--border)] transition-all hover:border-[var(--primary)] hover:bg-slate-900/60"
                    >
                        <span className="text-[var(--primary)] shrink-0 mt-0.5">{item.icon}</span>
                        <div className="flex-1">
                            <h4 className="font-mono text-sm text-white group-hover:text-[var(--primary)] transition-colors">
                                {item.title}
                            </h4>
                            <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                        <ChevronRight size={16} className="text-gray-500 group-hover:text-[var(--primary)] transition-all group-hover:translate-x-1 shrink-0" />
                    </Link>
                ))}
            </div>
        ),
    },
];