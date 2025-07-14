import { useState } from "react";
import TimelineJourney from "./TimelineJourney";
import StoryPanel from "./StoryPanel";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import { usePortfolio } from "../lib/stores/usePortfolio";

export default function Portfolio() {
  const { currentMilestone, showTraditionalPortfolio, toggleView } = usePortfolio();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Builder. Doer. Problem Solver.
              </h1>
              <p className="text-slate-300 mt-1 text-sm md:text-base">
                Ready to drive results through technology, business innovation, and relentless execution
              </p>
            </div>
            <button
              onClick={toggleView}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg transition-colors text-sm md:text-base self-start"
            >
              {showTraditionalPortfolio ? "Show Journey Timeline" : "Show Portfolio"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="overflow-y-auto">
        {!showTraditionalPortfolio ? (
          <div className="relative">
            <TimelineJourney />
            {currentMilestone && <StoryPanel />}
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <ProjectsSection />
            <SkillsSection />
            <ContactSection />
          </div>
        )}
      </div>
    </div>
  );
}
