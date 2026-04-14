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
import { Pencil, X, LayoutGrid, Sparkles, Globe, Github } from "lucide-react";
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
  const { view, setView, isEditMode, setEditMode, showGitHub, setShowGitHub } = usePortfolio();
  const [pendingAction, setPendingAction] = useState<"edit" | "github" | null>(null);

  const handleEditClick = () => {
    if (isEditMode) setEditMode(false);
    else setPendingAction("edit");
  };

  const handleGitHubClick = () => {
    if (showGitHub) setShowGitHub(false);
    else setPendingAction("github");
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
          className={`flex-shrink-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/60 ${
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
              onClick={handleGitHubClick}
              className={`p-2 rounded-lg transition-colors ${
                showGitHub ? "bg-slate-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Github size={14} />
            </button>
            <button
              onClick={handleEditClick}
              className={`p-2 rounded-lg transition-colors ${
                isEditMode ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Pencil size={14} />
            </button>
          </div>
        </header>
      ) : (
        /* ── Full header for Main / Portfolio views ── */
        <header className={`bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/60 ${isEditMode ? "mt-8" : ""}`}>

          {/* ── Mobile header (< md) ── */}
          <div className="md:hidden">
            {/* Top row: avatar + name + action icons */}
            <div className="flex items-center gap-3 px-4 py-3">
              <img
                src="/img.jpg"
                alt="John Xen"
                className="w-10 h-10 rounded-full border-2 border-blue-400/70 object-cover flex-shrink-0 shadow-lg shadow-blue-500/20"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base leading-tight">John Xen</p>
                <p className="text-blue-400 text-[11px] font-medium truncate leading-tight mt-0.5">
                  Technology · Culture · Infrastructure
                </p>
              </div>
              {/* Social icons compact */}
              <div className="flex items-center gap-1">
                <a href="https://www.youtube.com/@johnxen6385" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                  <i className="fab fa-youtube text-sm" />
                </a>
                <a href="https://x.com/xen2025" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition-colors">
                  <i className="fab fa-x text-sm" />
                </a>
                <a href="https://www.linkedin.com/in/john-xen-75a150209" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-400 transition-colors">
                  <i className="fab fa-linkedin text-sm" />
                </a>
                <button onClick={handleGitHubClick}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    showGitHub ? "text-white bg-slate-600" : "text-slate-400 hover:text-white"
                  }`}>
                  <Github size={14} />
                </button>
                <button onClick={handleEditClick}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    isEditMode ? "text-white bg-blue-500" : "text-slate-400 hover:text-white"
                  }`}>
                  <Pencil size={14} />
                </button>
              </div>
            </div>

            {/* Bottom row: tabs + mission button */}
            <div className="flex items-center gap-2 px-4 pb-3">
              <TabBar view={view} setView={setView} />
              <a href="https://spaceagevision.com" className="ml-auto flex-shrink-0">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide shadow-md shadow-purple-500/20"
                >
                  Space Age ✦
                </motion.button>
              </a>
            </div>
          </div>

          {/* ── Desktop header (>= md) ── */}
          <div className="hidden md:block">
            <div className="container mx-auto px-6 py-5">
              <div className="flex items-center justify-between gap-6">
                {/* Identity */}
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400/80 flex-shrink-0 shadow-lg shadow-blue-500/20">
                    <img src="/img.jpg" alt="John Xen" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white leading-tight">John Xen</h1>
                    <p className="text-blue-400 text-sm font-medium mt-0.5">
                      Building systems for a connected, resilient world.
                    </p>
                    <div className="flex gap-4 mt-2">
                      <a href="https://www.youtube.com/@johnxen6385" target="_blank" rel="noopener noreferrer"
                        className="text-slate-400 hover:text-red-400 transition-colors"><i className="fab fa-youtube" /></a>
                      <a href="https://x.com/xen2025" target="_blank" rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"><i className="fab fa-x" /></a>
                      <a href="https://www.linkedin.com/in/john-xen-75a150209" target="_blank" rel="noopener noreferrer"
                        className="text-slate-400 hover:text-blue-400 transition-colors"><i className="fab fa-linkedin" /></a>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <a href="https://spaceagevision.com">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-500 text-white px-5 py-2 rounded-xl shadow-lg shadow-purple-500/20 transition-all text-sm font-semibold tracking-wide"
                    >
                      Space Age Mission ✦
                    </motion.button>
                  </a>
                  <TabBar view={view} setView={setView} />
                  <button onClick={handleGitHubClick}
                    className={`p-2.5 rounded-lg transition-colors ${
                      showGitHub ? "bg-slate-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                    }`}>
                    <Github size={15} />
                  </button>
                  <button onClick={handleEditClick}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      isEditMode ? "bg-blue-500 text-white hover:bg-blue-400" : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                    }`}>
                    <Pencil size={13} />
                    <span>{isEditMode ? "Exit" : "Edit"}</span>
                  </button>
                </div>
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

      {pendingAction && (
        <PasswordModal
          onSuccess={() => {
            if (pendingAction === "edit") setEditMode(true);
            else if (pendingAction === "github") setShowGitHub(true);
            setPendingAction(null);
          }}
          onClose={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}
