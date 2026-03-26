import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Disable tilt (e.g. in edit/drag mode) */
  disabled?: boolean;
  /** Max tilt degrees, default 10 */
  maxTilt?: number;
}

export default function TiltCard({
  children,
  className = "",
  disabled = false,
  maxTilt = 10,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, { stiffness: 250, damping: 30 });
  const rotateY = useSpring(rawRotateY, { stiffness: 250, damping: 30 });

  // Shine highlight position (moves across card surface with tilt)
  const shineX = useTransform(rotateY, [-maxTilt, maxTilt], ["15%", "85%"]);
  const shineY = useTransform(rotateX, [maxTilt, -maxTilt], ["15%", "85%"]);
  const shineOpacity = useTransform(
    rotateX,
    [-maxTilt, 0, maxTilt],
    [0.08, 0, 0.08]
  );
  const shineBackground = useMotionTemplate`radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.13) 0%, transparent 65%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 → 0.5
    const py = (e.clientY - rect.top)  / rect.height - 0.5;  // -0.5 → 0.5
    rawRotateX.set(-py * maxTilt * 2);
    rawRotateY.set( px * maxTilt * 2);
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {/* Shine overlay */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{
            background: shineBackground,
            opacity: shineOpacity,
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
