import { useEffect, useRef } from "react";

export function useEntrance(delay = 0) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            el.style.animationDelay = `${delay}ms`;
            el.classList.add("anim-fade-up");
            obs.disconnect();
        }
        }, { threshold: 0.15 });

        obs.observe(el);
        return () => obs.disconnect();
    }, [delay]);

    return ref;
}