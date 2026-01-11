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
          <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
              <div className="w-32 h-32 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-blue-400 flex-shrink-0">
                <img 
                  src="/img.jpg" 
                  alt="Your Name" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  John Xen
                </h1>
                <h2 className="text-lg md:text-xl text-blue-400 font-semibold mb-1">
                Building systems for a connected, resilient, and responsible world.
                  
                </h2>
                <p className="text-sm md:text-base text-slate-300">
                Building Technology. Creating Value. Shaping Culture. Driving Impact.
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
                  {/* <a
                    href="https://www.instagram.com/hjxen25"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-pink-500 text-xl transition-colors"
                  >
                    <i className="fab fa-instagram"></i>
                  </a> */}
                  <a
                    href="https://x.com/xen2025"
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
            <div className="flex flex-col md:flex-row gap-3 items-center">
            <a href="https://spaceagevision.com">
            <button
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-xl shadow-lg transition-all duration-200 text-sm md:text-base font-semibold tracking-wide hover:scale-105"
            >
             Space Age Mission !!
            </button>
            </a>
            <button
              onClick={toggleView}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg transition-colors text-sm md:text-base"
            >
              {showTraditionalPortfolio ? "Show Other Projects" : "Show Main"}
            </button>
            </div>
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
            {/* <SkillsSection /> */}
            <ContactSection />
          </div>
        )}
      </div>
    </div>
  );
}
