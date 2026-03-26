import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

export function useMousePosition() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);

  useEffect(() => {
    const update = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", update);
    return () => window.removeEventListener("mousemove", update);
  }, [x, y]);

  return { x, y };
}
