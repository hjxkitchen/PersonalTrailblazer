import { useMemo } from "react";
import * as THREE from "three";
import MilestoneMarker from "./MilestoneMarker";
import { journeyMilestones, futurePaths } from "../data/journeyData";

export default function JourneyPath() {
  // Create the main journey path
  const pathGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-25, 0.5, -25), // Start in Tanzania
      new THREE.Vector3(-15, 1.2, -10), // Texas challenge
      new THREE.Vector3(-5, 2.5, 5),    // North Carolina recovery
      new THREE.Vector3(5, 4.8, 15),    // Back to Tanzania
      new THREE.Vector3(15, 7.5, 25),   // Current position in SF
    ]);

    return new THREE.TubeGeometry(curve, 50, 0.3, 8, false);
  }, []);

  // Create future path branches
  const futurePaths1 = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(15, 7.5, 25),   // Current position
      new THREE.Vector3(20, 9, 35),     // Hardware/Manufacturing path
      new THREE.Vector3(25, 11, 45),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.2, 6, false);
  }, []);

  const futurePaths2 = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(15, 7.5, 25),   // Current position
      new THREE.Vector3(25, 10, 30),    // AI/Data Science path
      new THREE.Vector3(35, 13, 35),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.2, 6, false);
  }, []);

  return (
    <group>
      {/* Main completed journey path */}
      <mesh>
        <primitive object={pathGeometry} />
        <meshPhongMaterial 
          color="#4ade80" 
          emissive="#22c55e" 
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Future path 1 - Hardware/Manufacturing */}
      <mesh>
        <primitive object={futurePaths1} />
        <meshPhongMaterial 
          color="#f59e0b" 
          emissive="#d97706" 
          emissiveIntensity={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Future path 2 - AI/Data Science */}
      <mesh>
        <primitive object={futurePaths2} />
        <meshPhongMaterial 
          color="#3b82f6" 
          emissive="#2563eb" 
          emissiveIntensity={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Milestone markers */}
      {journeyMilestones.map((milestone, index) => (
        <MilestoneMarker
          key={milestone.id}
          milestone={milestone}
          position={milestone.position}
          isCompleted={true}
        />
      ))}

      {/* Future milestone markers */}
      {futurePaths.map((path, index) => (
        <MilestoneMarker
          key={`future-${index}`}
          milestone={path}
          position={path.position}
          isCompleted={false}
        />
      ))}
    </group>
  );
}
