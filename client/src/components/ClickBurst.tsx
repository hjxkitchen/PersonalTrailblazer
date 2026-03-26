import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Burst {
  id: number;
  x: number;
  y: number;
}

const PARTICLE_COUNT = 8;
const COLORS = [
  "rgba(59,130,246,0.9)",    // blue
  "rgba(147,51,234,0.85)",   // purple
  "rgba(99,179,237,0.85)",   // sky
  "rgba(167,139,250,0.85)",  // violet
];

function BurstEffect({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 650);
    return () => clearTimeout(t);
  }, [onDone]);

  const angles = Array.from(
    { length: PARTICLE_COUNT },
    (_, i) => (i / PARTICLE_COUNT) * 360 + (Math.random() - 0.5) * 25
  );

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      {/* Outer ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 3.5, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.15, 0, 0.6, 1] }}
        style={{
          position: "absolute",
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: "1.5px solid rgba(59,130,246,0.85)",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Inner fill flash */}
      <motion.div
        initial={{ scale: 0, opacity: 0.7 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "rgba(99,179,237,0.6)",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Particles */}
      {angles.map((angle, i) => {
        const dist = 32 + Math.random() * 28;
        const dx = Math.cos((angle * Math.PI) / 180) * dist;
        const dy = Math.sin((angle * Math.PI) / 180) * dist;
        const size = 3 + Math.random() * 3;
        const color = COLORS[i % COLORS.length];
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: dx, y: dy, scale: 0, opacity: 0 }}
            transition={{
              duration: 0.38 + Math.random() * 0.2,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
}

export default function ClickBurst() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  const removeBurst = useCallback((id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      setBursts((prev) => {
        // Cap at 6 simultaneous bursts to avoid pile-up
        const capped = prev.length >= 6 ? prev.slice(-5) : prev;
        return [...capped, { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }];
      });
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
      <AnimatePresence>
        {bursts.map((burst) => (
          <BurstEffect
            key={burst.id}
            x={burst.x}
            y={burst.y}
            onDone={() => removeBurst(burst.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
