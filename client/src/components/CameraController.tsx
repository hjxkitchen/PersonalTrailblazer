import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";

export default function CameraController() {
  const { camera } = useThree();
  const [, getControls] = useKeyboardControls();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  // Set initial camera position if not already set
  useEffect(() => {
    camera.position.set(15, 8, 15);
    camera.lookAt(0, 5, 0);
  }, [camera]);

  useFrame((state, delta) => {
    const controls = getControls();
    
    // Reset velocity
    velocity.current.set(0, 0, 0);
    
    // Get camera direction vectors
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; // Keep movement on horizontal plane
    forward.normalize();
    
    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();
    
    // Movement speed
    const speed = 15 * delta;
    
    // Apply controls
    if (controls.forward) {
      velocity.current.addScaledVector(forward, speed);
    }
    if (controls.backward) {
      velocity.current.addScaledVector(forward, -speed);
    }
    if (controls.leftward) {
      velocity.current.addScaledVector(right, -speed);
    }
    if (controls.rightward) {
      velocity.current.addScaledVector(right, speed);
    }
    if (controls.up) {
      velocity.current.y += speed;
    }
    if (controls.down) {
      velocity.current.y -= speed;
    }
    
    // Apply movement with bounds checking
    const newPosition = camera.position.clone().add(velocity.current);
    
    // Keep camera within reasonable bounds
    newPosition.x = THREE.MathUtils.clamp(newPosition.x, -40, 40);
    newPosition.y = THREE.MathUtils.clamp(newPosition.y, 2, 25);
    newPosition.z = THREE.MathUtils.clamp(newPosition.z, -40, 40);
    
    camera.position.copy(newPosition);
    
    // Smooth camera rotation to look at the mountain peak
    const targetLookAt = new THREE.Vector3(0, 8, 15);
    const currentLookAt = new THREE.Vector3();
    
    // Calculate where camera is currently looking
    camera.getWorldDirection(direction.current);
    currentLookAt.copy(camera.position).add(direction.current);
    
    // Smoothly interpolate look direction
    currentLookAt.lerp(targetLookAt, 0.02);
    camera.lookAt(currentLookAt);
  });

  return null;
}
