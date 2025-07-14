import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import JourneyPath from "./JourneyPath";
import CameraController from "./CameraController";

export default function MountainScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();
  
  // Load textures
  const grassTexture = useTexture("/textures/grass.png");
  const sandTexture = useTexture("/textures/sand.jpg");
  
  // Configure texture repetition
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(8, 8);
  
  sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
  sandTexture.repeat.set(4, 4);

  // Create mountain geometry with peaks and valleys
  const mountainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(60, 60, 128, 128);
    
    // Modify vertices to create mountain terrain
    const positions = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      
      // Create multiple peaks with noise
      let height = 0;
      
      // Main peak in the center-back
      const mainPeakDistance = Math.sqrt((x - 0) ** 2 + (y - 15) ** 2);
      height += Math.max(0, 12 - mainPeakDistance * 0.8);
      
      // Secondary peaks
      const peak2Distance = Math.sqrt((x - 15) ** 2 + (y - 20) ** 2);
      height += Math.max(0, 8 - peak2Distance * 0.6);
      
      const peak3Distance = Math.sqrt((x + 12) ** 2 + (y - 10) ** 2);
      height += Math.max(0, 6 - peak3Distance * 0.5);
      
      // Add some noise for realistic terrain
      height += Math.sin(x * 0.3) * Math.cos(y * 0.2) * 0.5;
      height += Math.sin(x * 0.1) * Math.cos(y * 0.15) * 1.2;
      
      // Ensure we don't go below ground level
      height = Math.max(0, height);
      
      positions[i + 2] = height;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }, []);

  // Create base terrain geometry
  const baseGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(100, 100, 64, 64);
    
    const positions = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      
      // Gentle rolling hills for the base
      let height = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 1.5;
      height += Math.sin(x * 0.02) * Math.cos(y * 0.03) * 0.8;
      
      positions[i + 2] = Math.max(-0.5, height);
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }, []);

  // Animate subtle movement
  useFrame((state) => {
    if (meshRef.current) {
      // Very subtle breathing effect for the mountains
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Add fog for atmosphere
  scene.fog = new THREE.Fog(0x1a1a2e, 30, 80);

  return (
    <group>
      {/* Base terrain */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
        receiveShadow
      >
        <primitive object={baseGeometry} />
        <meshLambertMaterial map={grassTexture} />
      </mesh>

      {/* Mountain terrain */}
      <mesh 
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={mountainGeometry} />
        <meshLambertMaterial map={sandTexture} />
      </mesh>

      {/* Journey path with milestones */}
      <JourneyPath />
      
      {/* Camera controller */}
      <CameraController />

      {/* Atmospheric particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={500}
            array={useMemo(() => {
              const positions = new Float32Array(1500);
              for (let i = 0; i < 1500; i += 3) {
                positions[i] = (Math.random() - 0.5) * 100;
                positions[i + 1] = Math.random() * 30 + 5;
                positions[i + 2] = (Math.random() - 0.5) * 100;
              }
              return positions;
            }, [])}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#87ceeb" transparent opacity={0.6} />
      </points>
    </group>
  );
}
