import { useEffect, useRef, type CSSProperties, type RefObject } from "react";

interface Props {
  text: string;
  className?: string;
  style?: CSSProperties;
  tag?: "h1" | "h2" | "h3" | "div" | "span";
  glitchInterval?: number;
}

export function GlitchText({ text, className, style, tag: Tag = "div", glitchInterval = 5000 }: Props) {
  const mainRef = useRef<HTMLElement>(null);
  const cyanRef = useRef<HTMLElement>(null);
  const redRef  = useRef<HTMLElement>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runGlitch = () => {
      if (!mainRef.current || !cyanRef.current || !redRef.current) return;
      const main = mainRef.current;
      const cyan = cyanRef.current;
      const red  = redRef.current;

      // Glitch sequence
      const steps = [
        () => {
          main.style.transform = "skewX(-2deg) translateX(-5px)";
          cyan.style.opacity = "0.55";
          cyan.style.transform = "translateX(-8px)";
          cyan.style.clipPath = "polygon(0 8%, 100% 8%, 100% 30%, 0 30%)";
          red.style.opacity  = "0.4";
          red.style.transform = "translateX(7px)";
          red.style.clipPath = "polygon(0 55%, 100% 55%, 100% 78%, 0 78%)";
        },
        () => {
          main.style.transform = "skewX(1deg) translateX(5px)";
          cyan.style.clipPath = "polygon(0 60%, 100% 60%, 100% 75%, 0 75%)";
          cyan.style.transform = "translateX(9px)";
          red.style.clipPath  = "polygon(0 15%, 100% 15%, 100% 35%, 0 35%)";
          red.style.transform = "translateX(-8px)";
        },
        () => {
          main.style.transform = "translateX(-2px)";
          cyan.style.opacity = "0.3";
          cyan.style.clipPath = "polygon(0 40%, 100% 40%, 100% 52%, 0 52%)";
          red.style.opacity  = "0.2";
        },
        () => {
          main.style.transform = "";
          cyan.style.opacity = "0";
          red.style.opacity  = "0";
        },
      ];

      let i = 0;
      const tick = () => {
        if (i < steps.length) {
          steps[i]();
          i++;
          timeout = setTimeout(tick, 55);
        } else {
          // Schedule next burst
          timeout = setTimeout(runGlitch, glitchInterval + Math.random() * 2000);
        }
      };
      tick();
    };

    const initial = setTimeout(runGlitch, 1000 + Math.random() * 2000);
    return () => { clearTimeout(initial); clearTimeout(timeout); };
  }, [glitchInterval]);

  const shared: CSSProperties = { position: "absolute", top: 0, left: 0, right: 0, pointerEvents: "none", opacity: 0, transition: "none" };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Cyan channel */}
      <Tag ref={cyanRef as RefObject<any>} aria-hidden className={className} style={{ ...style, ...shared, color: "rgba(0,220,255,0.7)", userSelect: "none" }}>
        {text}
      </Tag>
      {/* Red channel */}
      <Tag ref={redRef as RefObject<any>} aria-hidden className={className} style={{ ...style, ...shared, color: "rgba(255,40,40,0.6)", userSelect: "none" }}>
        {text}
      </Tag>
      {/* Main layer */}
      <Tag ref={mainRef as RefObject<any>} className={className} style={{ ...style, display: "block", transition: "transform 0.04s linear" }}>
        {text}
      </Tag>
    </div>
  );
}
