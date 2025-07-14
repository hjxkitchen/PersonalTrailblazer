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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                From Tanzania to San Francisco
              </h1>
              <p className="text-slate-300 mt-1">
                An unconventional journey through technology, business, and innovation
              </p>
            </div>
            <button
              onClick={toggleView}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {showTraditionalPortfolio ? "Show Journey" : "Show Portfolio"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {!showTraditionalPortfolio ? (
        <div className="relative">
          <TimelineJourney />
          {currentMilestone && <StoryPanel />}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </div>
      )}
    </div>
  );
}
