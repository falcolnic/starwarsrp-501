import { useCallback, useEffect, useRef, useState } from "react";

interface WarpLoaderProps {
    progress?: number;
    minDuration?: number;
    onDone?: () => void;
}

interface Star {
    x: number;
    y: number;
    z: number;
    pz: number;
}

const CONFIG = {
    starCount: 10000,
    baseSpeed: -1,
    warpSpeed: 1.6,
    jumpSpeed: 6.6,
    jumpDuration: 3000,
    maxDPR: 2,
    trailFade: 0.35,
    parallax: 0.05,
    glowParallax: 1, // how much further the core/halo swings vs the star trails on mouse move
    starColor: "178, 204, 249",
};

export function WarpLoader({ progress, minDuration = 3000, onDone }: WarpLoaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);

    const [status, setStatus] = useState("Initializing...");
    const [hidden, setHidden] = useState(false);
    const [removed, setRemoved] = useState(false);
    const [internalProgress, setInternalProgress] = useState(0);

    const isControlled = progress !== undefined;
    const displayedProgress = isControlled ? progress! : internalProgress;
    const pct = Math.round(Math.max(0, Math.min(100, displayedProgress)));

    const state = useRef({
        W: 0,
        H: 0,
        cx: 0,
        cy: 0,
        speed: CONFIG.baseSpeed,
        target: CONFIG.baseSpeed,
        glow: 0, // smoothed 0..1 value driving the core/halo glow
        stars: [] as Star[],
        raf: 0,
        startTime: 0,
        mx: 0,
        my: 0,
        ox: 0,
        oy: 0,
        finished: false,
    });

    const spawn = useCallback((s: Star) => {
        const st = state.current;
        s.x = (Math.random() * 2 - 1) * st.W;
        s.y = (Math.random() * 2 - 1) * st.H;
        s.z = Math.random() * st.W;
        s.pz = s.z;
        return s;
    }, []);

    const resize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const DPR = Math.min(window.devicePixelRatio || 1, CONFIG.maxDPR);
        const r = canvas.getBoundingClientRect();
        const st = state.current;
        st.W = canvas.width = Math.max(1, Math.round(r.width * DPR));
        st.H = canvas.height = Math.max(1, Math.round(r.height * DPR));
        st.cx = st.W / 2;
        st.cy = st.H / 2;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const DPR = Math.min(window.devicePixelRatio || 1, CONFIG.maxDPR);
        const st = state.current;

        resize();
        st.stars = Array.from({ length: CONFIG.starCount }, () => spawn({} as Star));
        st.startTime = performance.now();
        setStatus("Engaging warp drive...");

        const onMove = (e: MouseEvent) => {
        const r = canvas.getBoundingClientRect();
        st.mx = ((e.clientX - r.left) / r.width) * 2 - 1;
        st.my = ((e.clientY - r.top) / r.height) * 2 - 1;
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMove);

        if (!reduce) {
        st.target = CONFIG.warpSpeed;

        const frame = () => {
            ctx.fillStyle = `rgba(0,0,0,${CONFIG.trailFade})`;
            ctx.fillRect(0, 0, st.W, st.H);

            st.speed += (st.target - st.speed) * 0.06;
            st.ox += (st.mx * st.W * CONFIG.parallax - st.ox) * 0.06;
            st.oy += (st.my * st.W * CONFIG.parallax - st.oy) * 0.06;
            const ccx = st.cx + st.ox;
            const ccy = st.cy + st.oy;

            for (const s of st.stars) {
            s.pz = s.z;
            s.z -= st.speed * 22;
            if (s.z < 1) {
                spawn(s);
                s.z = st.W;
                s.pz = st.W;
            }

            const sx = ccx + (s.x / s.z) * st.W;
            const sy = ccy + (s.y / s.z) * st.W;
            const px = ccx + (s.x / s.pz) * st.W;
            const py = ccy + (s.y / s.pz) * st.W;
            const depth = 1 - s.z / st.W;

            ctx.strokeStyle = `rgba(${CONFIG.starColor},${Math.min(1, depth + 0.2)})`;
            ctx.lineWidth = Math.max(0.5, depth * 2.2 + DPR);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
            }

            // --- glowing core at the vanishing point ---
            // 0 while cruising at warpSpeed, ramps toward 1 as speed approaches jumpSpeed
            const targetGlowT = Math.max(
                0,
                Math.min(1, (st.speed - CONFIG.warpSpeed) / (CONFIG.jumpSpeed - CONFIG.warpSpeed))
            );
            // smooth glow independently (slower than speed) so its size doesn't jitter/track every frame
            st.glow += (targetGlowT - st.glow) * 0.015;

            if (st.glow > 0.001) {
            const glowT = st.glow;

            // glow gets its own amplified offset so it swings a bit more than the
            // star trails with the mouse, independent of the subtler star parallax
            const gcx = st.cx + st.ox * CONFIG.glowParallax;
            const gcy = st.cy + st.oy * CONFIG.glowParallax;

            // size as a % of the smaller screen dimension, so it can never wash out
            // the whole canvas regardless of viewport size / DPR
            const minDim = Math.min(st.W, st.H);
            const R = minDim * (0.05 + glowT * 0.17);

            ctx.globalCompositeOperation = "lighter";

            // ONE continuous gradient instead of two separate circles.
            // Stops are biased toward the center (t = (i/N)^1.8) so there's fine
            // resolution near the core -> smooth hot center that melts into the
            // halo with no seam/ring, then decays fully to 0 by the edge.
            const glowGrad = ctx.createRadialGradient(gcx, gcy, 0, gcx, gcy, R);
            const stops = 24;
            for (let i = 0; i <= stops; i++) {
                const t = Math.pow(i / stops, 1.8);
                // color drifts from pure white at the core to a cool blue-white out at the edge
                const r = Math.round(255 - 65 * t);
                const g = Math.round(255 - 43 * t);
                const b = 255;
                const alpha = glowT * Math.pow(1 - t, 3.2) * 0.95;
                glowGrad.addColorStop(t, `rgba(${r},${g},${b},${alpha})`);
            }
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(gcx, gcy, R, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalCompositeOperation = "source-over";
            }
            // --- end glow ---

            st.raf = requestAnimationFrame(frame);
        };
        st.raf = requestAnimationFrame(frame);
        }

        return () => {
        cancelAnimationFrame(state.current.raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMove);
        };
    }, [resize, spawn]);

    useEffect(() => {
        if (isControlled) return;
        const t = setInterval(() => {
        setInternalProgress((p) => {
            const next = Math.min(100, p + Math.random() * 10);
            if (next >= 100) clearInterval(t);
            return next;
        });
        }, 160);
        return () => clearInterval(t);
    }, [isControlled]);

    const flashPulse = useCallback(() => {
        const flash = flashRef.current;
        if (!flash) return;
        flash.style.transition = "none";
        flash.style.opacity = "0.9";
        void flash.offsetHeight;
        flash.style.transition = "opacity 900ms ease-out";
        flash.style.opacity = "0";
    }, []);

    useEffect(() => {
        if (displayedProgress < 100 || state.current.finished) return;
        state.current.finished = true;

        const st = state.current;
        const wait = Math.max(0, minDuration - (performance.now() - st.startTime));
        setStatus(wait > 0 ? "Stabilizing warp drive..." : "Jump complete.");

        const timeouts: ReturnType<typeof setTimeout>[] = [];

        timeouts.push(
        setTimeout(() => {
            setStatus("Jump complete.");
            st.target = CONFIG.jumpSpeed;

            timeouts.push(setTimeout(flashPulse, Math.max(0, CONFIG.jumpDuration - 700)));

            timeouts.push(
            setTimeout(() => {
                setHidden(true);
                timeouts.push(
                setTimeout(() => {
                    setRemoved(true);
                    onDone?.();
                }, 750)
                );
            }, CONFIG.jumpDuration)
            );
        }, wait)
        );

        return () => timeouts.forEach(clearTimeout);
    }, [displayedProgress, minDuration, flashPulse, onDone]);

    if (removed) return null;

    return (
        <div
        role="progressbar"
        aria-label="Loading"
        aria-live="polite"
        aria-valuenow={pct}
        className={`fixed inset-0 z-99 bg-black overflow-hidden transition-opacity duration-200 ease-out ${
            hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        >
        <canvas ref={canvasRef} className="block w-full h-full" />
        <div ref={flashRef} className="absolute inset-0 bg-white opacity-0 pointer-events-none" />
        <div className="absolute left-0 right-0 bottom-0 px-[22px] py-[18px] font-mono text-[#cfe0ff] tracking-[0.08em] uppercase">
            <div className="flex justify-between mb-2">
            <span>{status}</span>
            <span>{pct}%</span>
            </div>
            <div className="h-[3px] rounded-full overflow-hidden bg-[rgba(120,150,220,0.25)]">
            <div
                className="h-full bg-[#78a0ff] transition-[width] duration-200 ease-out"
                style={{ width: `${pct}%` }}
            />
            </div>
        </div>
        </div>
    );
}