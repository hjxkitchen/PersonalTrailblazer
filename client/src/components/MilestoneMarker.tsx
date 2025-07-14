import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolio } from "../lib/stores/usePortfolio";
import type { Milestone } from "../data/journeyData";

interface MilestoneMarkerProps {
  milestone: Milestone;
  position: [number, number, number];
  isCompleted: boolean;
}

export default function MilestoneMarker({ milestone, position, isCompleted }: MilestoneMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setCurrentMilestone } = usePortfolio();

  // Animate the marker
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;
      
      // Rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }

    if (glowRef.current) {
      // Pulsing glow effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      glowRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = () => {
    setCurrentMilestone(milestone);
  };

  const markerColor = isCompleted ? "#4ade80" : "#fbbf24";
  const emissiveColor = isCompleted ? "#22c55e" : "#f59e0b";

  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh
        ref={glowRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial
          color={markerColor}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Main marker */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        castShadow
      >
        <octahedronGeometry args={[0.8, 0]} />
        <meshPhongMaterial
          color={markerColor}
          emissive={emissiveColor}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          shininess={100}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        material-toneMapped={false}
      >
        {milestone.title}
      </Text>

      {/* Hover indicator */}
      {hovered && (
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.5}
          color="#87ceeb"
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
        >
          Click to explore
        </Text>
      )}
    </group>
  );
}
