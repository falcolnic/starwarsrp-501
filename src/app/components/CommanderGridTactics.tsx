import { useEffect, useState } from "react";
import { User, ShieldAlert, TargetIcon, ZapIcon, Medal, AlertOctagon } from "lucide-react";

type UnitType = "heavy" | "arc" | "specialist" | "sniper" | "b1" | "b2" | "magnaguard";

interface Unit {
  id: number;
  type: UnitType;
  owner: "player" | "cis";
  hp: number;
  maxHp: number;
  x: number; // grid coordinates 0-7
  y: number;
  ap: number; // Action Points
  telegraphedAttack: { targetId: number | null, x: number, y: number, damage: number } | null; // CIS telegraphed turn
}

// deterministic damage mapping
const DAMAGE_MAP: Record<UnitType, number> = {
  heavy: 5, arc: 8, specialist: 6, sniper: 12, // Player
  b1: 4, b2: 7, magnaguard: 9 // CIS
};

export function CommanderGridTactics() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [turn, setTurn] = useState<"player" | "cis">("player");
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState<"player" | "cis" | null>(null);
  const [log, setLog] = useState<string[]>(["Симуляция запущена. ХОД_ИГРОКА."]);

  // consolidated initial units placing based on the topographic features
  const initialUnits: Unit[] = [
    { id: 1, type: "heavy", owner: "player", hp: 12, maxHp: 12, x: 2, y: 1, ap: 2, telegraphedAttack: null },
    { id: 2, type: "arc", owner: "player", hp: 10, maxHp: 10, x: 3, y: 2, ap: 2, telegraphedAttack: null },
    { id: 3, type: "specialist", owner: "player", hp: 8, maxHp: 8, x: 1, y: 2, ap: 2, telegraphedAttack: null },
    // Droids (top right of image_0.png)
    { id: 4, type: "b2", owner: "cis", hp: 15, maxHp: 15, x: 6, y: 1, ap: 1, telegraphedAttack: null },
    { id: 5, type: "b1", owner: "cis", hp: 8, maxHp: 8, x: 5, y: 0, ap: 1, telegraphedAttack: null },
    { id: 6, type: "magnaguard", owner: "cis", hp: 18, maxHp: 18, x: 7, y: 2, ap: 1, telegraphedAttack: null },
  ];

  useEffect(() => {
    setUnits(initialUnits);
  }, []);

  // AIService: telegraphedAttack CIS logic whenever turn changes or units move
  useEffect(() => {
    if (turn === "cis" && !gameOver) {
      telegraphedAttackCISTurn();
    }
  }, [turn, gameOver]);

  const telegraphedAttackCISTurn = () => {
    setLog(prev => [...prev, "--- ХОД_CIS (Прогнозирование) ---"]);
    
    setUnits(prev => {
        const droids = prev.filter(u => u.owner === "cis");
        const clones = prev.filter(u => u.owner === "player");
        const nextUnits = [...prev];

        droids.forEach(droid => {
            if (clones.length === 0) return;

            // Attack deterministic logic: Find a direct line of sight clone or move closer.
            const droidIdx = nextUnits.findIndex(u => u.id === droid.id);
            const targetsInLine = clones.filter(clone => clone.x === droid.x || clone.y === droid.y);
            
            if (targetsInLine.length > 0) {
                // telegraphedAttack attack
                const target = targetsInLine[0]; // prioritized target logic can be added
                const damage = DAMAGE_MAP[droid.type];
                nextUnits[droidIdx] = { 
                    ...droid, 
                    telegraphedAttack: { targetId: target.id, x: target.x, y: target.y, damage }
                };
                setLog(prevLog => [...prevLog, `Юнит_${droid.id} (${droid.type}) прицелился в Клон_${target.id}. Урон: ${damage}`]);
            } else {
                // Move logic: deterministic step closer to the nearest clone
                const targetClone = clones[0]; 
                const dx = targetClone.x > droid.x ? 1 : targetClone.x < droid.x ? -1 : 0;
                const dy = targetClone.y > droid.y ? 1 : targetClone.y < droid.y ? -1 : 0;
                
                const nextX = droid.x + dx;
                const nextY = droid.y + dy;
                
                const isOccupied = prev.some(u => u.x === nextX && u.y === nextY);
                if (!isOccupied) {
                    nextUnits[droidIdx] = { ...droid, x: nextX, y: nextY, telegraphedAttack: null };
                    setLog(prevLog => [...prevLog, `Юнит_${droid.id} (${droid.type}) переместился в [${nextX},${nextY}]`]);
                }
            }
        });
        return nextUnits;
    });

    // Resolve attacks after showing telegraphedAttack
    setTimeout(() => {
        setUnits(prev => {
            const nextUnits = prev.map(u => {
                if (u.owner === "player" && u.telegraphedAttack) {
                    // This can't happen based on CIS turn but good for future player telegraphedAttack
                }
                if (u.owner === "cis" && u.telegraphedAttack) {
                    const target = prev.find(clone => clone.id === u.telegraphedAttack!.targetId);
                    if (target) {
                        target.hp -= u.telegraphedAttack!.damage;
                    }
                }
                return u;
            }).map(u => u.owner === "cis" ? { ...u, telegraphedAttack: null } : u); // clear telegraphedAttack

            return nextUnits.filter(u => u.hp > 0);
        });

        checkGameOver();
        endTurn();
    }, 2500); // 2.5s for player to observe telegraphedAttack
  };

  const executeAction = (uId: number, targetX: number, targetY: number) => {
    if (turn === "cis" || gameOver) return;

    setUnits(prev => {
        const unit = prev.find(u => u.id === uId)!;
        const droid = prev.find(u => u.owner === "cis" && u.x === targetX && u.y === targetY);
        
        const nextUnits = [...prev];
        const unitIdx = nextUnits.findIndex(u => u.id === unit.id);

        if (droid) {
            // attack deterministic (Player attacks don't telegraphedAttack yet for concept simplicity)
            const damage = DAMAGE_MAP[unit.type];
            droid.hp -= damage;
            unit.ap -= 1;
            nextUnits[unitIdx] = { ...unit };
            setLog(prevLog => [...prevLog, `Клон_${unit.id} нанес ${damage} урона Дроиду_${droid.id}. (AP: ${unit.ap})`]);
            
            if (droid.hp <= 0) {
              setLog(prevLog => [...prevLog, `Дроид_${droid.id} уничтожен.`]);
            }

        } else {
            // Move
            unit.x = targetX;
            unit.y = targetY;
            unit.ap -= 1;
            nextUnits[unitIdx] = { ...unit };
            setLog(prevLog => [...prevLog, `Клон_${unit.id} переместился в [${targetX},${targetY}]. (AP: ${unit.ap})`]);
        }

        const filtered = nextUnits.filter(u => u.hp > 0);
        checkGameOver(filtered);
        return filtered;
    });

    setSelectedUnitId(null);
  };

  const endTurn = () => {
    setSelectedUnitId(null);
    setUnits(prev => prev.map(u => u.owner === turn ? { ...u, ap: u.type === "cis" ? 1 : 2 } : u));
    setTurn(prev => prev === "player" ? "cis" : "player");
    setLog(prev => [...prev, `--- ХОД_ЗАВЕРШЕН. СЛЕДУЮЩИЙ: ${turn === "player" ? "CIS" : "ИГРОК"} ---`]);
  };

  const checkGameOver = (currentUnits?: Unit[]) => {
    const list = currentUnits || units;
    const clones = list.filter(u => u.owner === "player");
    const droids = list.filter(u => u.owner === "cis");
    if (clones.length === 0) setGameOver("cis");
    if (droids.length === 0) setGameOver("player");
  };

  return (
    <div className="bg-[#080d17] p-4 text-white font-mono rounded-lg border-2 border-[var(--primary)] shadow-[0_0_40px_rgba(61,111,196,0.2)] max-w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* deterministic Tactical Grid */}
        <div className="md:col-span-8 border-2 border-[var(--primary)]/40 rounded overflow-hidden p-1 bg-slate-950">
          <div className="grid grid-cols-8 grid-rows-8 gap-0.5 aspect-square">
            {[...Array(64)].map((_, i) => {
              const x = i % 8;
              const y = Math.floor(i / 8);
              const unit = units.find(u => u.x === x && u.y === y);
              
              // Move ranges and attacks can be visualized here based on deterministic logic
              let canMoveHere = false;
              if (selectedUnitId !== null && turn === "player") {
                  const sel = units.find(u => u.id === selectedUnitId)!;
                  const isNeighbor = Math.abs(sel.x - x) <= 1 && Math.abs(sel.y - y) <= 1;
                  const isSelf = sel.x === x && sel.y === y;
                  canMoveHere = isNeighbor && !isSelf && !unit && sel.ap > 0;
              }

              return (
                <div 
                  key={i} 
                  onClick={() => selectedUnitId && executeAction(selectedUnitId, x, y)}
                  className={`relative flex items-center justify-center border border-slate-900 group ${canMoveHere ? "cursor-alias bg-[var(--primary)]/15 hover:bg-[var(--primary)]/25" : ""}`}
                >
                  {/* Topographic contours from image_0.png can be faint background here */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:6px_6px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-5" />
                  
                  {unit && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); if(turn === "player" && unit.owner === "player") setSelectedUnitId(unit.id); }}
                        className={`absolute rounded w-full h-full p-1 transition-transform ${unit.id === selectedUnitId ? "scale-105 border-2 border-[var(--primary)]" : ""} ${unit.owner === "player" ? "cursor-pointer" : "cursor-default"}`}
                    >
                        {unit.type === "heavy" && <ZapIcon className="text-white mx-auto" size={16} />}
                        {unit.type === "arc" && <TargetIcon className="text-[var(--primary)] mx-auto" size={16} />}
                        {unit.type === "magnaguard" && <ShieldAlert className="text-red-500 mx-auto" size={16} />}
                        {unit.owner === "cis" && <TargetIcon className="text-amber-500 absolute -top-1 -right-1" size={10} />}
                        
                        {/* telegraphedAttack Target Visualizer */}
                        {turn === "cis" && unit.owner === "player" && unit.ap === 0 && ( // Fake AP check to show attack is locked
                            <div className="absolute inset-0 border-2 border-dashed border-amber-500 animate-pulse" />
                        )}

                        {/* HP Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/70">
                            <div className={`${unit.owner === "player" ? "bg-[var(--primary)]" : "bg-red-500"}`} style={{ width: `${(unit.hp/unit.maxHp)*100}%` }}></div>
                        </div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Console & deterministic Controls */}
        <div className="md:col-span-4 flex flex-col gap-4">
          
          {/* telegraphedTurn Phase Banner */}
          {turn === "cis" && (
            <div className="flex items-center gap-2 p-3 border-2 border-amber-500 bg-amber-500/10 text-amber-300 rounded">
                <AlertOctagon size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">CIS_turn:deterministic_attacks_pending</span>
            </div>
          )}

          {/* Console Log */}
          <div className="w-full bg-slate-900/60 border border-slate-800 p-3 h-64 overflow-y-auto text-xs text-slate-400 leading-normal">
             {log.map((entry, idx) => <div key={idx}>{entry}</div>)}
          </div>

          <button
            onClick={endTurn}
            disabled={turn === "cis"}
            className="w-full py-2.5 bg-[var(--primary)]/15 border-2 border-[var(--primary)] hover:bg-[var(--primary)]/25 text-white font-mono text-sm uppercase tracking-[0.1em] disabled:opacity-50 cursor-pointer"
          >
            ● Завершить Ход
          </button>
        </div>
      </div>

      {gameOver && (
          <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center gap-6 text-center z-50">
            {gameOver === "player" ? (
                <Medal size={64} className="text-[var(--primary)] animate-pulse" />
            ) : (
                <ShieldAlert size={64} className="text-red-500 animate-pulse" />
            )}
            <h2 className={`text-2xl font-bold uppercase tracking-widest ${gameOver === "player" ? "text-white" : "text-red-500"}`}>
              {gameOver === "player" ? "deterministic ПРИКАЗ ВЫПОЛНЕН" : " deterministic ОТРЯД УНИЧТОЖЕН"}
            </h2>
            <button
              onClick={() => { setUnits(initialUnits); setTurn("player"); setGameOver(null); setSelectedUnitId(null); setLog(["Симуляция перезапущена."]); }}
              className="px-5 py-2.5 bg-[var(--primary)]/15 border-2 border-[var(--primary)] text-white text-sm uppercase tracking-wider cursor-pointer rounded"
            >
              Перезапуститьdeterministic_test
            </button>
          </div>
      )}
    </div>
  );
}