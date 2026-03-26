import { useState } from "react";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import MissionSection from "./MissionSection";
import SpatialCanvas from "./SpatialCanvas";
import PasswordModal from "./PasswordModal";
import CursorGlow from "./CursorGlow";
import ClickBurst from "./ClickBurst";
import { usePortfolio } from "../lib/stores/usePortfolio";
import type { PortfolioView } from "../lib/stores/usePortfolio";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Pencil, X, LayoutGrid, Sparkles, Globe } from "lucide-react";
import { motion } from "framer-motion";

const VIEW_TABS: { view: PortfolioView; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { view: "main",     label: "Main",     icon: LayoutGrid },
  { view: "extended", label: "Portfolio", icon: Sparkles  },
  { view: "spatial",  label: "Spatial",  icon: Globe      },
];

function TabBar({ view, setView }: { view: PortfolioView; setView: (v: PortfolioView) => void }) {
  return (
    <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-xl p-1 gap-0.5">
      {VIEW_TABS.map(({ view: v, label, icon: Icon }) => {
        const active = view === v;
        return (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              active ? "text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {active && (
              <motion.div
                layoutId="viewTab"
                className="absolute inset-0 bg-blue-600 rounded-lg shadow-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Icon size={14} className="relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Portfolio() {
  const { view, setView, isEditMode, setEditMode } = usePortfolio();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleEditClick = () => {
    if (isEditMode) setEditMode(false);
    else setShowPasswordModal(true);
  };

  const isSpatial = view === "spatial";

  return (
    <div
      className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden ${
        isSpatial ? "h-screen flex flex-col overflow-hidden" : "min-h-screen overflow-y-auto"
      }`}
    >
      {/* Global interactive effects */}
      <CursorGlow />
      <ClickBurst />

      {/* Edit mode banner (fixed, always on top) */}
      {isEditMode && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-blue-600/95 backdrop-blur-sm text-white text-center py-1.5 text-sm font-medium flex items-center justify-center gap-3">
          <Pencil size={14} />
          Edit mode active — changes save automatically
          <button
            onClick={() => setEditMode(false)}
            className="flex items-center gap-1 px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors"
          >
            <X size={12} /> Exit
          </button>
        </div>
      )}

      {/* ── Spatial: ultra-slim header ── */}
      {isSpatial ? (
        <header
          className={`flex-shrink-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 ${
            isEditMode ? "mt-8" : ""
          }`}
        >
          <div className="flex items-center gap-3 px-4 py-2">
            <img
              src="/img.jpg"
              alt="John Xen"
              className="w-7 h-7 rounded-full border border-blue-400/60 object-cover flex-shrink-0"
            />
            <span className="text-white font-semibold text-sm hidden sm:block">John Xen</span>
            <div className="flex-1" />
            <TabBar view={view} setView={setView} />
            <button
              onClick={handleEditClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ml-1 ${
                isEditMode
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
              }`}
            >
              <Pencil size={12} />
              {isEditMode ? "Exit Edit" : "Edit"}
            </button>
          </div>
        </header>
      ) : (
        /* ── Full header for Main / Portfolio views ── */
        <header className={`bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 ${isEditMode ? "mt-8" : ""}`}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-4">
              {/* Identity */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                <div className="w-32 h-32 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-blue-400 flex-shrink-0">
                  <img src="/img.jpg" alt="John Xen" className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">John Xen</h1>
                  <h2 className="text-lg md:text-xl text-blue-400 font-semibold mb-1">
                    Building systems for a connected, resilient, and responsible world.
                  </h2>
                  <p className="text-sm md:text-base text-slate-300">
                    Building Technology. Creating Value. Shaping Culture. Driving Impact.
                  </p>
                  <div className="flex justify-center md:justify-start gap-6 mt-4">
                    <a href="https://www.youtube.com/@johnxen6385" target="_blank" rel="noopener noreferrer"
                      className="text-white hover:text-red-500 text-xl transition-colors">
                      <i className="fab fa-youtube" />
                    </a>
                    <a href="https://x.com/xen2025" target="_blank" rel="noopener noreferrer"
                      className="text-white hover:text-blue-400 text-xl transition-colors">
                      <i className="fab fa-x" />
                    </a>
                    <a href="https://www.linkedin.com/in/john-xen-75a150209" target="_blank" rel="noopener noreferrer"
                      className="text-white hover:text-blue-500 text-xl transition-colors">
                      <i className="fab fa-linkedin" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <a href="https://spaceagevision.com">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-xl shadow-lg transition-all duration-200 text-sm md:text-base font-semibold tracking-wide hover:scale-105">
                    Space Age Mission !!
                  </button>
                </a>
                <TabBar view={view} setView={setView} />
                <button
                  onClick={handleEditClick}
                  className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-lg transition-colors text-sm font-medium ${
                    isEditMode
                      ? "bg-blue-500 text-white hover:bg-blue-400"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                  }`}
                >
                  <Pencil size={14} />
                  {isEditMode ? "Exit Edit" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ── Main Content ── */}
      {isSpatial ? (
        <div className="flex-1 min-h-0">
          <SpatialCanvas />
        </div>
      ) : view === "extended" ? (
        <MissionSection />
      ) : (
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <ProjectsSection />
            <ContactSection />
          </div>
        </div>
      )}

      {showPasswordModal && (
        <PasswordModal
          onSuccess={() => { setEditMode(true); setShowPasswordModal(false); }}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
}
