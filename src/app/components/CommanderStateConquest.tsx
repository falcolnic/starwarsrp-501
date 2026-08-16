import { useEffect, useRef, useState } from "react";
import { Network, Zap, Target, TargetIcon, AlertCircle } from "lucide-react";

// Use your tactical-overlay.png as the background map graphic
// import mapBg from "../../assets/tactical-overlay.png";

const NODE_RADIUS = 28;
const CONNECTION_DISTANCE = 160;

interface Node {
  id: number;
  x: number;
  y: number;
  owner: "player" | "cis" | "neutral";
  troopCount: number;
  connections: number[]; // IDs of connected nodes
  elevation: number; // Defensive bonus
}

const INITIAL_NODES: Node[] = [
  // Topographic nodes from image_0.png
  { id: 1, x: 100, y: 150, owner: "neutral", troopCount: 15, connections: [2, 3], elevation: 3 },
  { id: 2, x: 260, y: 110, owner: "neutral", troopCount: 15, connections: [1, 4, 10], elevation: 3 },
  { id: 3, x: 120, y: 340, owner: "neutral", troopCount: 20, connections: [1, 5, 6], elevation: 2 },
  { id: 4, x: 380, y: 190, owner: "cis", troopCount: 45, connections: [2, 7, 8, 10], elevation: 1 },
  { id: 5, x: 150, y: 490, owner: "neutral", troopCount: 25, connections: [3, 6, 9], elevation: 2 },
  { id: 6, x: 280, y: 390, owner: "neutral", troopCount: 25, connections: [3, 5, 7, 9], elevation: 1 },
  { id: 7, x: 490, y: 330, owner: "neutral", troopCount: 20, connections: [4, 6, 8, 11], elevation: 1 },
  { id: 8, x: 520, y: 180, owner: "cis", troopCount: 40, connections: [4, 7, 10], elevation: 2 },
  { id: 9, x: 290, y: 550, owner: "player", troopCount: 55, connections: [5, 6, 12], elevation: 3 }, // Main Base
  { id: 10, x: 420, y: 90, owner: "neutral", troopCount: 20, connections: [2, 4, 8], elevation: 3 },
  { id: 11, x: 570, y: 460, owner: "neutral", troopCount: 15, connections: [7, 12], elevation: 2 },
  { id: 12, x: 440, y: 560, owner: "player", troopCount: 30, connections: [9, 11], elevation: 3 },
];

export function CommanderStateConquest() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [tp, setTp] = useState(100); // Tactical Points
  const [gameOver, setGameOver] = useState<"player" | "cis" | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<number | null>(null);

  const gameState = useRef({
    tp: 100,
    nodes: INITIAL_NODES,
    abilities: { laatDrop: 0, empStrike: 0 },
  });

  useEffect(() => {
    const loop = setInterval(() => {
      // 1. Generation Phase: Nodes generate troops based on owner
      setNodes((prev) =>
        prev.map((node) => {
          if (node.owner === "neutral") return node;
          const rate = node.id === 9 || node.id === 4 ? 0.35 : 0.15; // Bases generate faster
          return { ...node, troopCount: node.troopCount + rate };
        })
      );

      // 2. Supply Line Phase: Instantly capture connected neutral nodes
      setNodes((prev) => {
        let changed = false;
        const nextNodes = prev.map((node) => {
          if (node.owner !== "neutral") return node;
          // Check connections
          const connectedOwners = node.connections.map(
            (id) => prev.find((n) => n.id === id)?.owner
          );
          if (connectedOwners.includes("player")) {
            changed = true;
            return { ...node, owner: "player", troopCount: 5 }; // Minor penalty for automated capture
          }
          if (connectedOwners.includes("cis")) {
            changed = true;
            return { ...node, owner: "cis", troopCount: 5 };
          }
          return node;
        });
        return changed ? nextNodes : prev;
      });

      // 3. AIService: CIS attacks player or neutral nodes
      setNodes((prev) => {
        const cisNodes = prev.filter((n) => n.owner === "cis");
        const nextNodes = [...prev];

        cisNodes.forEach((src) => {
          if (src.troopCount > 25 && Math.random() < 0.1) {
            // Find target node (not cis owned, connected)
            const targets = src.connections
              .map((id) => prev.find((n) => n.id === id))
              .filter((n) => n && n.owner !== "cis") as Node[];

            if (targets.length > 0) {
              const target = targets[0]; // Simple logic, attack the first available
              const attackForce = src.troopCount * 0.7;
              
              // update source
              const srcIdx = nextNodes.findIndex((n) => n.id === src.id);
              nextNodes[srcIdx] = { ...src, troopCount: src.troopCount - attackForce };

              // update target
              const targetIdx = nextNodes.findIndex((n) => n.id === target.id);
              const targetDefense = target.troopCount + target.elevation * 4;
              if (attackForce > targetDefense) {
                // Node Captured
                nextNodes[targetIdx] = { ...target, owner: "cis", troopCount: attackForce - targetDefense };
              } else {
                // attack repelled
                nextNodes[targetIdx] = { ...target, troopCount: targetDefense - attackForce };
              }
            }
          }
        });
        return nextNodes;
      });

      // 4. Check Game Over
      const playerControlled = nodes.filter((n) => n.owner === "player").length;
      const cisControlled = nodes.filter((n) => n.owner === "cis").length;
      if (playerControlled === 0) setGameOver("cis");
      if (cisControlled === 0) setGameOver("player");

    }, 1000);

    return () => clearInterval(loop);
  }, [nodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Grid Lines from image_0.png aesthetic
    ctx.strokeStyle = "rgba(61, 111, 196, 0.15)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Supply Lines
    nodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const target = nodes.find((n) => n.id === targetId);
        if (target && target.id > node.id) { // draw each connection once
          ctx.strokeStyle = "rgba(100, 100, 100, 0.6)";
          if (node.owner === "player" && target.owner === "player") ctx.strokeStyle = "rgba(61, 111, 196, 0.8)";
          if (node.owner === "cis" && target.owner === "cis") ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
          
          ctx.lineWidth = node.owner !== "neutral" && target.owner !== "neutral" ? 3 : 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });
    });

    // Nodes
    nodes.forEach((node) => {
      // Core Circle
      ctx.fillStyle = "#080d17"; // dark bg
      if (node.owner === "player") ctx.fillStyle = "rgba(61, 111, 196, 0.3)";
      if (node.owner === "cis") ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Border (Topographic Wireframe glow)
      ctx.strokeStyle = "#475569"; // slate-600 neutral
      if (node.owner === "player") ctx.strokeStyle = "rgba(61, 111, 196, 0.9)"; // bright blue
      if (node.owner === "cis") ctx.strokeStyle = "rgba(239, 68, 68, 0.9)"; // bright red
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // Troops Count Text
      ctx.fillStyle = "white";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(Math.floor(node.troopCount).toString(), node.x, node.y + 5);

      // Node Name / ID
      ctx.fillStyle = "#94a3b8"; // slate-400
      ctx.font = "9px monospace";
      ctx.fillText(`OUTPOST_0${node.id}`, node.x, node.y - 12);
    });

  }, [nodes]);

  const handleNodeClick = (nodeId: number) => {
    const target = nodes.find((n) => n.id === nodeId);
    if (!target) return;

    if (target.owner === "player") {
      setDraggingFrom(nodeId);
    } else if (draggingFrom !== null) {
      // Execute Player attack
      const src = nodes.find((n) => n.id === draggingFrom)!;
      if (!src.connections.includes(nodeId)) {
        setDraggingFrom(null); // Invalid connection
        return;
      }
      
      const attackForce = src.troopCount * 0.7;
      if (attackForce <= 2) {
        setDraggingFrom(null); return; // Too weak
      }

      setNodes((prev) => {
        const next = [...prev];
        const srcIdx = next.findIndex((n) => n.id === src.id);
        const targetIdx = next.findIndex((n) => n.id === target.id);
        
        // update source
        next[srcIdx] = { ...src, troopCount: src.troopCount - attackForce };

        const targetDefense = target.troopCount + target.elevation * 4;

        if (attackForce > targetDefense) {
          // Captured
          next[targetIdx] = { ...target, owner: "player", troopCount: attackForce - targetDefense };
        } else {
          // repel
          next[targetIdx] = { ...target, troopCount: targetDefense - attackForce };
        }
        return next;
      });

      setDraggingFrom(null); // Complete Attack
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#080d17] p-4 text-white font-mono rounded-lg border-2 border-[var(--primary)] shadow-[0_0_30px_rgba(61,111,196,0.15)] max-w-full">
      {/* Map Graphic background (using overlay provided by user or simple canvas style) */}
      <div className="relative border-2 border-[var(--primary)]/40 rounded overflow-hidden">
        {/* Simple Topographic representation - replace with image_0.png eventually */}
        <canvas
          ref={canvasRef}
          width={640}
          height={600}
          className="bg-[#040810] block max-w-full h-auto cursor-default"
        />
        
        {/* Node interaction overlay */}
        {nodes.map(node => (
          <div 
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            className={`absolute rounded-full cursor-pointer transition-colors duration-150 ${
                node.id === draggingFrom ? "animate-pulse bg-white/20" : ""
            }`}
            style={{
                width: NODE_RADIUS * 2,
                height: NODE_RADIUS * 2,
                left: node.x - NODE_RADIUS,
                top: node.y - NODE_RADIUS,
                zIndex: 10
            }}
          />
        ))}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-5 text-center p-6 z-50">
            {gameOver === "player" ? (
                <TargetIcon size={64} className="text-[var(--primary)] animate-pulse" />
            ) : (
                <AlertCircle size={64} className="text-red-500 animate-pulse" />
            )}
            <h2 className={`text-2xl font-bold uppercase tracking-widest ${gameOver === "player" ? "text-white" : "text-red-500"}`}>
              {gameOver === "player" ? "ЗВЕЗДНАЯ ПОБЕДА" : "ПЛАНЕТА ЗАХВАЧЕНА"}
            </h2>
            <button
              onClick={() => { setNodes(INITIAL_NODES); setGameOver(null); setTp(100); }}
              className="px-5 py-2.5 bg-[var(--primary)]/15 border-2 border-[var(--primary)] text-white text-sm uppercase tracking-wider cursor-pointer rounded"
            >
              Перезапустить Симуляцию
            </button>
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between gap-4 mt-3 bg-black/40 border border-slate-800 p-3 text-[10px] uppercase tracking-widest text-slate-500">
        <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-white" />
            Кликните по своему узлу ($25$) для выбора, затем по вражескому или нейтральному соединенному узлу для атаки.
        </div>
        <div className="text-[var(--primary)] font-bold">501ST_LEGIO // BATTLE_sim</div>
      </div>
    </div>
  );
}