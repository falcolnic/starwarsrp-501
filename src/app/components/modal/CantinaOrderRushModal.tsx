import { useCallback, useEffect, useRef, useState } from "react";
import { X, Heart, Share2, Volume2, VolumeX } from "lucide-react";

interface CantinaHackModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundSrc?: string;
  musicSrc?: string;
}

type ShapeId = "circle" | "square" | "triangle" | "diamond";
const SHAPES: ShapeId[] = ["circle", "square", "triangle", "diamond"];

type Q1Target = "shape" | "number";
const Q1_TARGETS: Q1Target[] = ["shape", "number"];

type ColorTarget = "bgColor" | "shapeColor" | "numberColor" | "topWordColor" | "bottomWordColor";
const COLOR_TARGETS: ColorTarget[] = ["bgColor", "shapeColor", "numberColor", "topWordColor", "bottomWordColor"];

const COLOR_TARGET_LABELS: Record<ColorTarget, string> = {
  bgColor: "ФОНА",
  shapeColor: "ФИГУРЫ",
  numberColor: "ЦИФРЫ",
  topWordColor: "ВЕРХНЕГО СЛОВА",
  bottomWordColor: "НИЖНЕГО СЛОВА",
};

const COLORS = [
  { word: "БЕЛЫЙ", hex: "#f2f2f2" },
  { word: "ЧЁРНЫЙ", hex: "#1a1a1a" },
  { word: "КРАСНЫЙ", hex: "#e05252" },
  { word: "ЗЕЛЁНЫЙ", hex: "#8fd93a" },
  { word: "СИНИЙ", hex: "#4fa8e0" },
  { word: "ФИОЛЕТОВЫЙ", hex: "#a86bd9" },
  { word: "ОРАНЖЕВЫЙ", hex: "#e08a2e" },
] as const;

const SHAPE_WORDS = ["КВАДРАТ", "ТРЕУГОЛЬНИК", "ПРЯМОУГОЛЬНИК", "КРУГ", "РОМБ"];

interface TileAttrs {
  identity: number; // shuffled 1-4 label, established in the identity-reveal phase
  bgColor: string;
  shape: ShapeId;
  shapeColor: string;
  topWord: string;
  topWordColor: string;
  number: number; // decorative distractor digit 0-9, unrelated to identity
  numberColor: string;
  bottomWord: string;
  bottomWordColor: string;
}

const START_LIVES = 3;
const IDENTITY_MS = 3000; 
const BASE_MEMORIZE_MS = 14000; 
const MIN_MEMORIZE_MS = 3000; 
const BASE_ANSWER_MS = 11000; 
const MIN_ANSWER_MS = 3000; 
const DIFFICULTY_STEP = 700;
const BEST_SCORE_KEY = "gar501_hack_best";

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(): TileAttrs[] {
  const identities = shuffle([1, 2, 3, 4]);
  
  return identities.map((identity) => {
    const bgColor = randomFrom(COLORS).hex;
    const availableForShape = COLORS.filter(c => c.hex !== bgColor);
    const shapeColor = randomFrom(availableForShape).hex;

    const availableForText = COLORS.filter(c => c.hex !== bgColor && c.hex !== shapeColor);

    return {
      identity,
      bgColor,
      shape: randomFrom(SHAPES),
      shapeColor,
      topWord: randomFrom(COLORS).word,
      topWordColor: randomFrom(availableForText).hex,
      number: Math.floor(Math.random() * 10),
      numberColor: randomFrom(availableForText).hex,
      bottomWord: randomFrom(SHAPE_WORDS),
      bottomWordColor: randomFrom(availableForText).hex,
    };
  });
}

function getBestScore(): number {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}
function setBestScore(v: number) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(v));
  } catch {
  }
}
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function Shape({ id, color, size = 34 }: { id: ShapeId; color: string; size?: number }) {
  switch (id) {
    case "circle":
      return <div style={{ width: size, height: size, borderRadius: "50%", background: color }} />;
    case "square":
      return <div style={{ width: size, height: size, background: color }} />;
    case "diamond":
      return <div style={{ width: size, height: size, background: color, transform: "rotate(45deg)" }} />;
    case "triangle":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon points="50,6 96,94 4,94" fill={color} />
        </svg>
      );
  }
}

export function CantinaHackModal({
  isOpen,
  onClose,
  backgroundSrc = "/cantina-bg.png",
  musicSrc = "/audio/cantina-band.mp3",
}: CantinaHackModalProps) {
  const [phase, setPhase] = useState<
  "idle" | "identity" | "memorize" | "answer" | "feedback" | "result"
  >("idle");
  const [tiles, setTiles] = useState<TileAttrs[]>([]);
  const [round, setRound] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [best, setBest] = useState(getBestScore);
  const [isMuted, setIsMuted] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const phaseStartRef = useRef(0);
  const phaseDurationRef = useRef(BASE_MEMORIZE_MS);
  const roundRef = useRef(0);
  const livesRef = useRef(START_LIVES);
  const tilesRef = useRef<TileAttrs[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [selectedShape, setSelectedShape] = useState<ShapeId | null>(null);
  const [q1Identity, setQ1Identity] = useState(1);
  const [colorQIdentity, setColorQIdentity] = useState(2);
  const [q1Target, setQ1Target] = useState<Q1Target>("shape");
  const [colorQTarget, setColorQTarget] = useState<ColorTarget>("numberColor");

  const [selectedQ1, setSelectedQ1] = useState<ShapeId | number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const clearTimers = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current && isMuted && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
    setIsMuted(!isMuted);
  };

  const endGame = useCallback(() => {
    clearTimers();
    setPhase("result");
    if (audioRef.current) audioRef.current.pause();
    if (roundRef.current > getBestScore()) {
      setBestScore(roundRef.current);
      setBest(roundRef.current);
    }
  }, [clearTimers]);

  const goToMemorize = useCallback(() => {
    phaseStartRef.current = performance.now();
    phaseDurationRef.current = Math.max(
      MIN_MEMORIZE_MS,
      BASE_MEMORIZE_MS - roundRef.current * DIFFICULTY_STEP
    );
    setPhase("memorize");
  }, []);

  const goToAnswer = useCallback(() => {
    phaseStartRef.current = performance.now();
    phaseDurationRef.current = Math.max(
      MIN_ANSWER_MS,
      BASE_ANSWER_MS - roundRef.current * DIFFICULTY_STEP
    );
    setSelectedShape(null);
    setSelectedColor(null);
    setPhase("answer");
  }, []);

  const startRound = useCallback(() => {
    const round1 = buildRound();
    tilesRef.current = round1;
    setTiles(round1);

    const posA = Math.floor(Math.random() * 4);
    let posB = Math.floor(Math.random() * 4);
    while (posB === posA) posB = Math.floor(Math.random() * 4);

    setQ1Identity(round1[posA].identity);
    setColorQIdentity(round1[posB].identity);
    setQ1Target(randomFrom(Q1_TARGETS));
    setColorQTarget(randomFrom(COLOR_TARGETS));
    
    setSelectedQ1(null);
    setSelectedColor(null);
    setWasCorrect(null);

    phaseStartRef.current = performance.now();
    phaseDurationRef.current = IDENTITY_MS;
    setPhase("identity");
  }, []);

  const submitAnswer = useCallback(
    (timedOut: boolean, q1Answer?: ShapeId | number | null, colorAnswer?: string | null) => {
      clearTimers();
      const finalQ1 = q1Answer !== undefined ? q1Answer : selectedQ1;
      const finalColor = colorAnswer !== undefined ? colorAnswer : selectedColor;

      const q1Tile = tilesRef.current.find((t) => t.identity === q1Identity);
      const colorTile = tilesRef.current.find((t) => t.identity === colorQIdentity);

      const expectedQ1 = q1Target === "shape" ? q1Tile?.shape : q1Tile?.number;
      const expectedColor = colorTile ? colorTile[colorQTarget] : null;

      const correct =
        !timedOut &&
        finalQ1 === expectedQ1 &&
        finalColor === expectedColor;

      setWasCorrect(correct);
      setPhase("feedback");

      if (correct) {
        roundRef.current += 1;
        setRound(roundRef.current);
        setTimeout(() => startRound(), 900);
      } else {
        livesRef.current -= 1;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          setTimeout(() => endGame(), 900);
        } else {
          setTimeout(() => startRound(), 1000);
        }
      }
    },
    [selectedQ1, selectedColor, q1Identity, colorQIdentity, q1Target, colorQTarget, endGame, startRound, clearTimers]
  );

  const pickQ1 = (val: ShapeId | number) => {
    if (phase !== "answer") return;
    setSelectedQ1(val);
    if (selectedColor !== null) submitAnswer(false, val, selectedColor);
  };

  const pickColor = (c: string) => {
    if (phase !== "answer") return;
    setSelectedColor(c);
    if (selectedQ1 !== null) submitAnswer(false, selectedQ1, c);
  };

  const start = useCallback(() => {
    roundRef.current = 0;
    livesRef.current = START_LIVES;
    setRound(0);
    setLives(START_LIVES);
    startRound();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [startRound]);

  useEffect(() => {
    if (isOpen && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => console.warn("Autoplay blocked until user interaction"));
    }
  }, [isOpen]);


  const generateAndShareImage = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 450;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(217, 164, 65, 0.4)"; // The gold color
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
      ctx.fillStyle = "#e8c67a";
      ctx.font = "bold 32px monospace";
      ctx.textAlign = "center";
      ctx.fillText("ОТЧЁТ ВЗЛОМА ТЕРМИНАЛА", canvas.width / 2, 70);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 100px monospace";
      ctx.fillText(round.toString(), canvas.width / 2, 220);
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "24px monospace";
      ctx.fillText("ПРОЙДЕНО РАУНДОВ", canvas.width / 2, 270);
      if (round > 0) {
        ctx.fillStyle = "#4fa8e0"; // Blue
        ctx.font = "bold 28px monospace";
        ctx.fillText("СТАТУС: ДАННЫЕ ИЗВЛЕЧЕНЫ", canvas.width / 2, 350);
      } else {
        ctx.fillStyle = "#e05252"; // Red
        ctx.font = "bold 28px monospace";
        ctx.fillText("СТАТУС: ДОСТУП ОТКЛОНЁН", canvas.width / 2, 350);
      }

      // 7. Draw some fake "Hacker" hex logs in the corners for flavor
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.font = "14px monospace";
      ctx.textAlign = "left";
      for (let i = 0; i < 5; i++) {
        const fakeHex = Math.random().toString(16).substr(2, 8).toUpperCase();
        ctx.fillText(`0x${fakeHex} ... OK`, 30, 340 + i * 20);
        ctx.fillText(`SYS.REQ.${Math.floor(Math.random() * 999)}`, canvas.width - 150, 340 + i * 20);
      }

      // 8. Convert to Image and Share/Download
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `cantina-hack-${round}.png`, { type: "image/png" });
        const shareData = {
          title: "Взлом терминала",
          text: `Я продержался ${round} раундов! Сможешь лучше?`,
          files: [file],
        };

        // If browser supports sharing files (Mobile Safari, Chrome for Android)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            // If user cancels or it fails, fallback to download
            if ((err as Error).name !== "AbortError") {
              downloadBlob(blob, `cantina-hack-${round}.png`);
            }
          }
        } else {
          // Desktop fallback: Just download the image file
          downloadBlob(blob, `cantina-hack-${round}.png`);
        }
      }, "image/png");

    } catch (err) {
      console.error("Error generating image", err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (phase !== "identity" && phase !== "memorize" && phase !== "answer") return;
    
    const duration = phaseDurationRef.current;
    const startPhase = phaseStartRef.current;

    const timeRemaining = Math.max(0, duration - (performance.now() - startPhase));
    timeoutRef.current = setTimeout(() => {
      if (phase === "identity") goToMemorize();
      else if (phase === "memorize") goToAnswer();
      else submitAnswer(true);
    }, timeRemaining);

    const loop = () => {
      const elapsed = performance.now() - phaseStartRef.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return clearTimers;
  }, [phase, goToMemorize, goToAnswer, submitAnswer, clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);


  useEffect(() => {
    if (!isOpen) {
      clearTimers();
      setPhase("idle");
      if (audioRef.current) audioRef.current.pause();
    }
  }, [isOpen, clearTimers]);

  if (!isOpen) return null;

  const isBlank = phase === "answer" || phase === "feedback";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-[95vw] max-w-[1400px] aspect-[16/10] max-h-[92vh] overflow-hidden border-2 border-[rgba(217,164,65,0.4)] shadow-[0_0_90px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundImage: `url(${backgroundSrc})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <audio ref={audioRef} src={musicSrc} loop muted={isMuted} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/70 pointer-events-none" />

        <div className="absolute top-6 right-6 z-30 flex items-center gap-5">
          <button
            onClick={toggleMusic}
            className="text-white/70 hover:text-white transition-colors"
            aria-label={isMuted ? "Включить музыку" : "Выключить музыку"}
          >
            {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
          </button>
          
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <X size={32} />
          </button>
        </div>

        {phase !== "idle" && phase !== "result" && (
          <div className="absolute top-6 left-8 z-30 flex items-center gap-6">
            <div className="font-mono text-xl tracking-wider text-white">
              РАУНД: <span className="text-[#e8c67a]">{round}</span>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: START_LIVES }).map((_, i) => (
                <Heart key={i} size={28} fill={i < lives ? "#e05252" : "none"} className={i < lives ? "text-[#e05252]" : "text-white/25"} />
              ))}
            </div>
          </div>
        )}

        <div className="relative z-20 h-full w-full flex flex-col items-center justify-center px-8 py-10">
          {phase === "idle" && (
            <div className="text-center max-w-2xl">
              <div className="font-mono text-base tracking-widest text-[#e8c67a] mb-4">ПАНЕЛЬ УПРАВЛЕНИЯ БРАЖНЫМ АППАРАТОМ</div>
              <h3 className="text-5xl text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
                ВЗЛОМ ТЕРМИНАЛА
              </h3>
              <p className="text-xl text-white/70 mb-10 leading-relaxed">
                Сначала запомни, какой плитке присвоен какой номер. Затем
                запомни фигуру и цвет цифры на каждой плитке. Когда всё
                скроется — ответь на два вопроса по номеру плитки, вслепую.
              </p>
              <button onClick={start} className="font-mono text-xl tracking-wider px-10 py-4 border-2 border-[#e8c67a] text-[#e8c67a] hover:bg-[#e8c67a]/10 transition-colors">
                НАЧАТЬ ВЗЛОМ
              </button>
              {best > 0 && <div className="mt-6 font-mono text-base text-white/50">Лучший результат: {best} раунд(ов)</div>}
            </div>
          )}

          {phase !== "idle" && phase !== "result" && (
            <>
              <div className="w-full max-w-xl h-3 bg-white/15 rounded overflow-hidden mb-10">
                <div
                  ref={progressBarRef}
                  className="h-full"
                  style={{
                    width: "100%",
                    background: phase === "identity" ? "#e8c67a" : phase === "memorize" ? "#4fa8e0" : "#e8c67a",
                  }}
                />
              </div>

              {!isBlank && (
                <div className="grid grid-cols-4 gap-6 mb-10">
                  {tiles.map((tile, i) => (
                    <div
                      key={i}
                      className="w-56 h-56 md:w-64 md:h-64 rounded-xl overflow-hidden border-2 border-white/20 flex items-center justify-center transition-all"
                      style={{ background: phase === "identity" ? "#1e2a3d" : tile.bgColor }}
                    >
                      {phase === "identity" && (
                        <span className="font-mono text-8xl font-bold text-white">{tile.identity}</span>
                      )}

                      {phase === "memorize" && (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Shape id={tile.shape} color={tile.shapeColor} size={160} />
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center px-1 text-center">
                            <span className="font-mono text-xl font-extrabold leading-tight" style={{ color: tile.topWordColor }}>
                              {tile.topWord}
                            </span>
                            
                            <span className="font-mono text-5xl font-extrabold leading-tight" style={{ color: tile.numberColor, textShadow: "0 0 6px rgba(0,0,0,0.9)" }}>
                              {tile.number}
                            </span>
                            
                            <span className="font-mono text-lg font-extrabold leading-tight" style={{ color: tile.bottomWordColor }}>
                              {tile.bottomWord}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {phase === "identity" && (
                <p className="font-mono text-lg text-white/60 tracking-wider">ЗАПОМНИ НОМЕРА ПЛИТОК…</p>
              )}
              {phase === "memorize" && (
                <p className="font-mono text-lg text-white/60 tracking-wider">ЗАПОМИНАЙ ДАННЫЕ…</p>
              )}

{phase === "answer" && (
                <div className="flex flex-col items-center gap-10">
                  <div className="text-center">
                    <p className="font-mono text-lg tracking-wider text-white/70 mb-4">
                      {q1Target === "shape" 
                        ? `КАКАЯ ФИГУРА БЫЛА НА ПЛИТКЕ №${q1Identity}?`
                        : `КАКАЯ ЦИФРА БЫЛА НА ПЛИТКЕ №${q1Identity}?`}
                    </p>
                    
                    {q1Target === "shape" ? (
                      <div className="flex gap-4 justify-center">
                        {SHAPES.map((s) => (
                          <button
                            key={s}
                            onClick={() => pickQ1(s)}
                            className={`w-24 h-24 flex items-center justify-center border-2 rounded-lg transition-colors ${
                              selectedQ1 === s ? "border-[#e8c67a] bg-[#e8c67a]/10" : "border-white/25 hover:border-white/50"
                            }`}
                          >
                            <Shape id={s} color="#ffffff" size={44} />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-3 justify-center flex-wrap max-w-sm mx-auto">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                          <button
                            key={n}
                            onClick={() => pickQ1(n)}
                            className={`w-14 h-14 flex items-center justify-center font-mono text-3xl font-bold border-2 rounded-lg transition-colors ${
                              selectedQ1 === n ? "border-[#e8c67a] bg-[#e8c67a]/10 text-[#e8c67a]" : "border-white/25 text-white/70 hover:border-white/50 hover:text-white"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <p className="font-mono text-lg tracking-wider text-white/70 mb-4 uppercase">
                      КАКОЙ ЦВЕТ БЫЛ У {COLOR_TARGET_LABELS[colorQTarget]} НА ПЛИТКЕ №{colorQIdentity}?
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap max-w-xl">
                      {COLORS.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => pickColor(c.hex)}
                          className={`w-16 h-16 rounded-full border-4 transition-transform ${
                            selectedColor === c.hex ? "scale-110 border-white" : "border-white/30 hover:scale-105"
                          }`}
                          style={{ background: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {phase === "feedback" && (
                <div className={`font-mono text-4xl tracking-wider ${wasCorrect ? "text-emerald-400" : "text-red-400"}`}>
                  {wasCorrect ? "ВЗЛОМАНО" : "ОШИБКА"}
                </div>
              )}
            </>
          )}

          {phase === "result" && (
            <div className="text-center">
              <div className="font-mono text-base tracking-widest text-white/60 mb-4">ТЕРМИНАЛ ЗАБЛОКИРОВАН</div>
              <div className="text-8xl font-mono text-[#e8c67a] mb-3">{round}</div>
              <div className="text-lg text-white/50 mb-10">
                {round >= best ? "новый личный рекорд!" : `лучший результат: ${best}`}
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={start} 
                  className="w-full sm:w-auto font-mono text-xl tracking-wider px-10 py-4 border-2 border-[#e8c67a] text-[#e8c67a] hover:bg-[#e8c67a]/10 transition-colors"
                >
                  ЕЩЁ ПОПЫТКА
                </button>
                
                <button 
                  onClick={generateAndShareImage}
                  disabled={isGenerating}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 font-mono text-xl tracking-wider px-10 py-4 border-2 border-[#4fa8e0] text-[#4fa8e0] hover:bg-[#4fa8e0]/10 transition-colors disabled:opacity-50"
                >
                  <Share2 size={24} className={isGenerating ? "animate-pulse" : ""} />
                  {isGenerating ? "ГЕНЕРАЦИЯ..." : "ПОДЕЛИТЬСЯ ЛОГОМ"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
