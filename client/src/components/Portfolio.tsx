import { useState } from "react";
import TimelineJourney from "./TimelineJourney";
import StoryPanel from "./StoryPanel";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import MissionSection from "./MissionSection";
import { usePortfolio } from "../lib/stores/usePortfolio";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Portfolio() {
  const { currentMilestone, showTraditionalPortfolio, toggleView } = usePortfolio();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden overflow-y-auto">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-32 h-32 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-blue-400 flex-shrink-0">
                <img 
                  src="/imgg.jpg" 
                  alt="Your Name" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  John Xen
                </h1>
                <h2 className="text-lg md:text-xl text-blue-400 font-semibold mb-1">
                  Builder. Doer. Problem Solver.
                </h2>
                <p className="text-sm md:text-base text-slate-300">
                  Ready to drive results through technology, business innovation, and relentless execution
                </p>

                {/* Social Media Icons */}
                <div className="flex justify-center md:justify-start gap-6 mt-4">
                  <a
                    href="https://www.youtube.com/@johnxen6385"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-red-500 text-xl transition-colors"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/hjxen25"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-pink-500 text-xl transition-colors"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href="https://x.com/hk6547"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 text-xl transition-colors"
                  >
                    <i className="fab fa-x"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/john-xen-75a150209"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-500 text-xl transition-colors"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>

              </div>
            </div>
            <button
              onClick={toggleView}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg transition-colors text-sm md:text-base self-start md:self-auto"
            >
              {showTraditionalPortfolio ? "Show Mission" : "Show Portfolio"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen">
        {!showTraditionalPortfolio ? (
          <MissionSection />
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
