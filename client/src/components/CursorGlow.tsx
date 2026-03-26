import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useMousePosition } from "../hooks/useMousePosition";

export default function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const { x: mouseX, y: mouseY } = useMousePosition();

  // Fast tight blue glow — snaps close to cursor
  const fastX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const fastY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  // Slow large purple glow — trails behind
  const slowX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const slowY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  // Centre each glow on the cursor
  const fastLeft = useTransform(fastX, (v) => v - 150);
  const fastTop  = useTransform(fastY, (v) => v - 150);
  const slowLeft = useTransform(slowX, (v) => v - 320);
  const slowTop  = useTransform(slowY, (v) => v - 320);

  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener("mousemove", show, { once: true });
    return () => window.removeEventListener("mousemove", show);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Slow large trailing purple blob */}
      <motion.div
        className="pointer-events-none fixed z-[2]"
        style={{
          left: slowLeft,
          top: slowTop,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.055) 0%, transparent 70%)",
        }}
      />
      {/* Fast small leading blue glow */}
      <motion.div
        className="pointer-events-none fixed z-[2]"
        style={{
          left: fastLeft,
          top: fastTop,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
        }}
      />
    </>
  );
}
