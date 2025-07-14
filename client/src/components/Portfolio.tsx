import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import MountainScene from "./MountainScene";
import StoryPanel from "./StoryPanel";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import { usePortfolio } from "../lib/stores/usePortfolio";

export default function Portfolio() {
  const { currentMilestone, showTraditionalPortfolio, toggleView } = usePortfolio();
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <>
      {/* 3D Mountain Scene */}
      <Canvas
        shadows
        camera={{
          position: [15, 8, 15],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={["#1a1a2e"]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 20, 0]} intensity={0.5} color="#87ceeb" />

        <Suspense fallback={null}>
          <MountainScene />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      {showInstructions && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg max-w-sm z-10">
          <h3 className="font-bold mb-2">Navigate the Journey</h3>
          <p className="text-sm mb-2">Use WASD or arrow keys to explore</p>
          <p className="text-sm mb-3">Click on glowing markers to learn about each milestone</p>
          <button 
            onClick={() => setShowInstructions(false)}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
          >
            Got it!
          </button>
        </div>
      )}

      {/* View Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleView}
          className="bg-slate-800/90 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
        >
          {showTraditionalPortfolio ? "Show 3D Journey" : "Show Portfolio"}
        </button>
      </div>

      {/* Story Panel */}
      {currentMilestone && !showTraditionalPortfolio && (
        <StoryPanel />
      )}

      {/* Traditional Portfolio View */}
      {showTraditionalPortfolio && (
        <div className="absolute inset-0 bg-slate-900 overflow-y-auto z-20">
          <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
              <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">
                  From Tanzania to San Francisco
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  An unconventional journey through technology, business, and innovation
                </p>
              </header>
              
              <SkillsSection />
              <ProjectsSection />
              <ContactSection />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
