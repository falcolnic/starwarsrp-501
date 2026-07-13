import { useRef } from "react";
import { Link } from "react-router";
import { ChevronDown, Users, TrendingUp } from "lucide-react";

import { useEntrance } from "../../hooks/useEntrance";
import { useTypewriter } from "../../hooks/useTypewriter";

import { SectionDecor, CornerDecoration, HeroEmblem } from "../components/ui/HomeDecorations";
import { HudButton, AccordionTab, PlaceholderText } from "../components/ui/HomeComponents";
import { homeTabs } from "../../data/homeTabs";
import { GlitchText } from "../components/GlitchText";
import { InfoTicker } from "../components/ui/InfoTicker";

export function Home() {
  const subtitleText = "БЫСТРЫЙ ШТУРМ · ОГНЕВОЕ ПРЕВОСХОДСТВО · АБСОЛЮТНАЯ ДИСЦИПЛИНА";
  const { displayed, done } = useTypewriter(subtitleText, 26, 900);

  const welcomeRef = useEntrance(0);
  const tabsLabelRef = useEntrance(0);

  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    heroRef.current.style.setProperty("--mouse-x", `${x}px`);
    heroRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div>
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="group min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 bg-[#080d17]"
      >
        <div className="hidden md:block absolute inset-0 pointer-events-none bg-[url('/hero-bg.png')] bg-cover bg-center opacity-90 brightness-110 contrast-105" />

        {/* Hidden on mobile, runs on desktop hover */}
        <div className="hidden md:block absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen bg-[radial-gradient(120px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(61,111,196,0.35)_0%,rgba(61,111,196,0.08)_50%,transparent_100%)]" />

        {/* Hidden on mobile */}
        <div className="hidden md:block absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_25%,#080d17_95%)] opacity-60" />
        <div className="hidden md:block absolute inset-0 bg-[#080d17]/20 pointer-events-none" />

        {/* 3. VERTICAL SCAN LINES - Hidden on mobile to keep small screens clean */}
        <div className="hidden md:block absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[rgba(61,111,196,0.2)] via-[rgba(61,111,196,0.5)_50%] via-[rgba(61,111,196,0.2)_70%] to-transparent left-[30%] animate-[scan-down_8s_linear_infinite] pointer-events-none opacity-30" />
        <div className="hidden md:block absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[rgba(61,111,196,0.15)] via-[rgba(61,111,196,0.35)_50%] via-[rgba(61,111,196,0.15)_70%] to-transparent right-[25%] animate-[scan-down_11s_linear_3s_infinite] pointer-events-none opacity-25" />

        <div className="relative z-10 flex flex-col items-center">
          <CornerDecoration position="top-left" />
          <CornerDecoration position="top-right" />
          <CornerDecoration position="bottom-left" />
          <CornerDecoration position="bottom-right" />

          <div className="anim-fade-up mb-8 [animation-delay:0ms]">
            <HeroEmblem />
          </div>

          <div className="anim-fade-up text-center max-w-4xl [animation-delay:150ms]">
            <div className="anim-flicker font-mono text-base tracking-widest text-[var(--primary)] mb-3">
              ГАЛАКТИЧЕСКАЯ РЕСПУБЛИКА · ВЕЛИКАЯ АРМИЯ · СПЕЦИАЛЬНЫЕ ОПЕРАЦИИ
            </div>

            <GlitchText
              tag="h1"
              text="501-Й ЭЛИТНЫЙ ШТУРМОВОЙ ЛЕГИОН"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.7rem, 5.5vw, 4.2rem)",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "var(--foreground)",
                lineHeight: 1.05,
                margin: "0 0 6px",
                textShadow: "0 0 50px rgba(61,111,196,0.25)",
              }}
              glitchInterval={4000}
            />

            <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] via-[rgba(61,111,196,0.4)] via-[var(--primary)] to-transparent my-4 mx-auto max-w-xl shadow-[0_0_12px_rgba(61,111,196,0.4)]" />

            <div className="font-[var(--font-display)] text-base tracking-wider text-[var(--muted-foreground)] min-h-[1.5em]">
              {displayed}
              {!done && <span className="anim-blink border-r-2 border-[var(--primary)] ml-0.5">&nbsp;</span>}
            </div>

            <div className="anim-flicker font-mono text-sm tracking-wider text-gray-500 mt-5">
              ОБОЗНАЧЕНИЕ: GAR-501-EAL · ГРИФ: СЕКРЕТНО · ДОПУСК: TROOPER+
            </div>
          </div>

          <div className="anim-fade-up flex gap-9 mt-12 flex-wrap justify-center [animation-delay:400ms]">
            <Link to="/roster" className="no-underline">
              <HudButton icon={<Users size={24} />} label="БАЗА ДАННЫХ ЛИЧНОГО СОСТАВА" primary />
            </Link>
            <Link to="/promotion" className="no-underline">
              <HudButton icon={<TrendingUp size={24} />} label="ТРЕКЕР ПОВЫШЕНИЙ" />
            </Link>
          </div>
        </div>

        <div className="pt-16 flex flex-col items-center gap-1 opacity-40 z-10">
          <p className="font-mono text-lg tracking-wider text-[var(--muted-foreground)]">ПРОКРУТИТЬ</p>
          <ChevronDown size={21} className="anim-blink text-[var(--muted-foreground)]" />
        </div>
      </section>

      <InfoTicker />

      <div className="max-w-6xl mx-auto pt-0 px-6 pb-24">
        <SectionDecor />
        <div ref={welcomeRef} className="mb-12 opacity-0">
          <div className="font-mono text-base tracking-widest text-[var(--primary)] mb-3">БРИФИНГ ПОДРАЗДЕЛЕНИЯ // ПРИВЕТСТВЕННОЕ СЛОВО</div>
          <h2 className="m-0 mb-5">ДОБРО ПОЖАЛОВАТЬ В 501-Й</h2>
          <PlaceholderText lines={4} />
        </div>

        <SectionDecor />
        <div ref={tabsLabelRef} className="mb-4 opacity-0">
          <div className="font-mono text-base tracking-widest text-[var(--primary)] mb-3">ДОКУМЕНТАЦИЯ ПОДРАЗДЕЛЕНИЯ // НАЖМИТЕ ДЛЯ РАСКРЫТИЯ</div>
          <h2 className="m-0 mb-5">СПРАВОЧНЫЕ МАТЕРИАЛЫ</h2>
        </div>

        <div className="flex flex-col gap-1">
          {homeTabs.map((tab, i) => <AccordionTab key={tab.id} tab={tab} index={i} />)}
        </div>

        <SectionDecor />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main feature cards down here stay exactly the same */}
        </div>
      </div>
    </div>
  );
}