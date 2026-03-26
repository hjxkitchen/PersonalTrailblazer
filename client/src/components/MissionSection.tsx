import { useState, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useMousePosition } from "../hooks/useMousePosition";
import TiltCard from "./TiltCard";
import {
  Sparkles,
  Box,
  Briefcase,
  Cpu,
  Gamepad2,
  Rocket,
  Users,
  Layers,
  ExternalLink,
  GripVertical,
  Pencil,
  Trash2,
  Plus,
  RotateCcw,
  Code2,
} from "lucide-react";
import defaultData from "../data/portfolioData.json";
import ExtendedProjectEditModal, { ExtendedProject } from "./ExtendedProjectEditModal";
import JsonEditModal from "./JsonEditModal";
import { usePortfolio } from "../lib/stores/usePortfolio";

// ─── Icon map ────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>> = {
  Sparkles, Box, Briefcase, Cpu, Gamepad2, Rocket, Users, Layers,
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
  icon: string;
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
const LS_KEY = "portfolio-extended-data";

function loadData(): { categories: Category[]; projects: ExtendedProject[] } {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    categories: defaultData.categories as Category[],
    projects: defaultData.projects as ExtendedProject[],
  };
}

function saveData(data: { categories: Category[]; projects: ExtendedProject[] }) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────
const THUMBNAIL_MAP: Record<string, string> = {
  "3d ball game": "3d-ball-game.jpg",
  "mindgraph": "mindgraph.jpg",
  "Voice Pos": "voice-pos.jpg",
  "Sky Walk World": "sky-walk-world.jpg",
  "Star Select": "star-select.jpg",
  "Fund Guard": "fund-guard.jpg",
  "Tech Spec Pro": "tech-spec-pro.jpg",
  "ShelfScan Catalog": "shelfscan-catalog.jpg",
  "Serendipity": "serendipity.jpg",
  "BusDev": "busdev.jpg",
  "World Culture Events": "world-culture-events.jpg",
  "Bus Onboard": "bus-onboard.jpg",
  "Business Card AR": "business-card-ar.jpg",
  "3d Social World": "3d-social-world.jpg",
  "Socos": "socos.jpg",
  "Gpt Chat Viewer": "gpt-chat-viewer.jpg",
  "Prompt Generator": "prompt-generator.jpg",
  "OpenCV": "opencv.jpg",
  "Smart Contract": "smart-contract.jpg",
  "Applauncher": "applauncher.jpg",
  "Native CRM": "native-crm.jpg",
  "N8n Clone": "n8n-clone.jpg",
  "Alpha Crispr Chemical Library": "alpha-crispr-chemical-library.jpg",
  "Vr Sensai": "vr-sensai.jpg",
  "Ml Models": "ml-models.jpg",
  "Multiagent": "multiagent.jpg",
  "Agihack": "agihack.jpg",
  "Fraud Detection Multiagent": "fraud-detection-multiagent.jpg",
  "Smart Irrigation": "smart-irrigation.jpg",
  "Water Token Dispense Mobile Money": "water-token-dispense-mobile-money.jpg",
  "Bulk Sms Automation": "bulk-sms-automation.jpg",
  "Stepwise Erp and Apip": "stepwise-erp-and-apip.jpg",
  "Hc Pe Consolidation": "hc-pe-consolidation.jpg",
  "Isaac Sim Semantic Manipulation": "isaac-sim-semantic-manipulation.jpg",
  "IoT Blockchain Supply Chain": "iot-blockchain-supply-chain.jpg",
  "Autonomous Retail Robots": "autonomous-retail-robots.jpg",
  "Solar Flow": "solar-flow.jpg",
  "Virtual Sphere": "virtual-sphere.jpg",
  "Delivery Swarm": "delivery-swarm.jpg",
  "Tanzania Trekker": "tanzania-trekker.jpg",
  "Data Dialog": "datadialog.jpg",
  "Meeting Manager": "meeting-manager.jpg",
  "Sightline": "sightline.jpg",
  "Neurotech Horror": "neurotech-horror.jpg",
  "Wall3d": "wall3d.jpg",
  "Party Promoter": "party-promoter.jpg",
  "MindCRM / Journai": "mindcrm-journai.jpg",
  "Mlgame": "mlgame.jpg",
  "P5 Art": "p5-art.jpg",
  "Mediapipe Table Tennis": "mediapipe-table-tennis.jpg",
};

function getThumbnailPath(name: string): string {
  if (THUMBNAIL_MAP[name]) return `/thumbnails/${THUMBNAIL_MAP[name]}`;
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `/thumbnails/${slug}.jpg`;
}

// ─── Card thumbnail ───────────────────────────────────────────────────────────
function ThumbnailImage({ project, iconName }: { project: ExtendedProject; iconName: string }) {
  const [imageError, setImageError] = useState(false);
  const Icon = ICON_MAP[iconName] || Box;

  if (imageError) {
    return (
      <div className="relative h-48 bg-slate-950 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20" />
        <div className="relative text-slate-700 group-hover:text-blue-400 transition-colors">
          <Icon size={48} strokeWidth={1.5} />
        </div>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white text-slate-950 rounded-full text-sm font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
            Open Project <ExternalLink size={14} />
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="relative h-48 bg-slate-950 overflow-hidden">
      <img
        src={getThumbnailPath(project.name)}
        alt={project.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={() => setImageError(true)}
      />
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-white text-slate-950 rounded-full text-sm font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
          Open Project <ExternalLink size={14} />
        </div>
      </a>
    </div>
  );
}

// ─── Category Edit Modal (inline / simple) ────────────────────────────────────
function CategoryEditModal({
  category,
  onSave,
  onClose,
}: {
  category?: Category;
  onSave: (cat: Category) => void;
  onClose: () => void;
}) {
  const isNew = !category;
  const [form, setForm] = useState<Category>(
    category ?? { id: "", label: "", icon: "Layers" }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.id || form.label;
    onSave({ ...form, id });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-6">{isNew ? "Add Category" : "Edit Category"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Label</label>
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Category ID (unique key)</label>
            <input
              value={form.id}
              onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
              placeholder="e.g. AI & Intelligence"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Icon</label>
            <select
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 text-sm"
            >
              {Object.keys(ICON_MAP).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-sm">{isNew ? "Add" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MissionSection() {
  const { isEditMode } = usePortfolio();
  const [data, setData] = useState(() => loadData());
  const [activeCategory, setActiveCategory] = useState("All");

  // ── Parallax background blobs ──
  const { x: mouseX, y: mouseY } = useMousePosition();
  const blobSpringCfg = { stiffness: 40, damping: 20 };
  const smoothX = useSpring(mouseX, blobSpringCfg);
  const smoothY = useSpring(mouseY, blobSpringCfg);
  const blob1X = useTransform(smoothX, [0, typeof window !== "undefined" ? window.innerWidth : 1440], [-28, 28]);
  const blob1Y = useTransform(smoothY, [0, typeof window !== "undefined" ? window.innerHeight : 900], [-20, 20]);
  const blob2X = useTransform(smoothX, [0, typeof window !== "undefined" ? window.innerWidth : 1440], [28, -28]);
  const blob2Y = useTransform(smoothY, [0, typeof window !== "undefined" ? window.innerHeight : 900], [20, -20]);

  // Edit modal state
  const [editingProject, setEditingProject] = useState<ExtendedProject | null | "new">(null);
  const [editingCategory, setEditingCategory] = useState<Category | null | "new">(null);
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  // Drag state for projects
  const dragProjectIndex = useRef<number | null>(null);
  const dragOverProjectIndex = useRef<number | null>(null);

  // Drag state for categories
  const dragCatIndex = useRef<number | null>(null);
  const dragOverCatIndex = useRef<number | null>(null);

  // ── Persist helper ──
  const update = (next: typeof data) => {
    setData(next);
    saveData(next);
  };

  // ── Reset ──
  const resetToDefaults = () => {
    if (confirm("Reset all portfolio data to defaults? This cannot be undone.")) {
      localStorage.removeItem(LS_KEY);
      const fresh = {
        categories: defaultData.categories as Category[],
        projects: defaultData.projects as ExtendedProject[],
      };
      setData(fresh);
      setActiveCategory("All");
    }
  };

  // ── Project CRUD ──
  const saveProject = (project: ExtendedProject) => {
    const idx = data.projects.findIndex((p) => p.id === project.id);
    const next = [...data.projects];
    if (idx >= 0) next[idx] = project;
    else next.push(project);
    update({ ...data, projects: next });
    setEditingProject(null);
  };

  const deleteProject = (id: string) => {
    if (!confirm("Delete this project?")) return;
    update({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  };

  // ── Category CRUD ──
  const saveCategory = (cat: Category) => {
    const idx = data.categories.findIndex((c) => c.id === cat.id);
    const next = [...data.categories];
    if (idx >= 0) next[idx] = cat;
    else next.push(cat);
    update({ ...data, categories: next });
    setEditingCategory(null);
  };

  const deleteCategory = (id: string) => {
    if (id === "All") return;
    if (!confirm(`Delete category "${id}"? Projects in this category will not be deleted.`)) return;
    update({ ...data, categories: data.categories.filter((c) => c.id !== id) });
    if (activeCategory === id) setActiveCategory("All");
  };

  // ── Project drag-and-drop ──
  const visibleProjects =
    activeCategory === "All"
      ? data.projects
      : data.projects.filter((p) => p.category === activeCategory);

  const onProjectDragStart = (visibleIdx: number) => {
    dragProjectIndex.current = visibleIdx;
  };

  const onProjectDragOver = (e: React.DragEvent, visibleIdx: number) => {
    e.preventDefault();
    dragOverProjectIndex.current = visibleIdx;
  };

  const onProjectDrop = () => {
    const from = dragProjectIndex.current;
    const to = dragOverProjectIndex.current;
    if (from === null || to === null || from === to) return;

    // Map visible indices to full array indices
    const allProjects = [...data.projects];
    const fromId = visibleProjects[from].id;
    const toId = visibleProjects[to].id;
    const fromGlobal = allProjects.findIndex((p) => p.id === fromId);
    const toGlobal = allProjects.findIndex((p) => p.id === toId);

    const [moved] = allProjects.splice(fromGlobal, 1);
    allProjects.splice(toGlobal, 0, moved);
    update({ ...data, projects: allProjects });

    dragProjectIndex.current = null;
    dragOverProjectIndex.current = null;
  };

  // ── Category drag-and-drop ──
  const onCatDragStart = (idx: number) => { dragCatIndex.current = idx; };
  const onCatDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); dragOverCatIndex.current = idx; };
  const onCatDrop = () => {
    const from = dragCatIndex.current;
    const to = dragOverCatIndex.current;
    if (from === null || to === null || from === to) return;
    const next = [...data.categories];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    update({ ...data, categories: next });
    dragCatIndex.current = null;
    dragOverCatIndex.current = null;
  };

  // ── Active category icon (for thumbnail fallback) ──
  const getCategoryIcon = (categoryId: string) => {
    const cat = data.categories.find((c) => c.id === categoryId);
    return cat?.icon || "Box";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <div className="relative overflow-hidden pt-24 pb-16">
        {/* Background — parallax blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <motion.div
            style={{ x: blob1X, y: blob1Y }}
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"
          />
          <motion.div
            style={{ x: blob2X, y: blob2Y }}
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
            >
              The Portfolio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto"
            >
              An ecosystem of tools, games, and infrastructure built to unify commerce, technology, and culture.
            </motion.p>
          </div>

          {/* Edit toolbar */}
          {isEditMode && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 p-4 bg-slate-900/60 border border-blue-500/30 rounded-2xl">
              <button
                onClick={() => setEditingProject("new")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={15} /> Add Project
              </button>
              <button
                onClick={() => setEditingCategory("new")}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={15} /> Add Category
              </button>
              <button
                onClick={() => setShowJsonEditor(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-600/50"
              >
                <Code2 size={14} /> Edit JSON
              </button>
              <button
                onClick={resetToDefaults}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded-lg text-sm font-medium transition-colors"
              >
                <RotateCcw size={14} /> Reset to Defaults
              </button>
              <span className="text-xs text-slate-500 italic">Drag cards or tabs to reorder</span>
            </div>
          )}

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
            {data.categories.map((cat, idx) => {
              const Icon = ICON_MAP[cat.icon] || Layers;
              const isActive = activeCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className="relative flex items-center"
                  draggable={isEditMode}
                  onDragStart={() => isEditMode && onCatDragStart(idx)}
                  onDragOver={(e) => isEditMode && onCatDragOver(e, idx)}
                  onDrop={() => isEditMode && onCatDrop()}
                >
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className={`
                      relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                      transition-all duration-500 group
                      ${isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-200 bg-slate-900/20 border border-slate-800/50 hover:border-slate-700/80"}
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {isEditMode && <GripVertical size={12} className="relative z-10 text-slate-500 cursor-grab" />}
                    <Icon className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                    <span className="relative z-10">{cat.label}</span>
                  </button>
                  {isEditMode && cat.id !== "All" && (
                    <div className="flex gap-1 ml-1">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="p-1 text-slate-500 hover:text-blue-400 transition-colors"
                        title="Edit category"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Projects grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project, visibleIdx) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="group relative"
                  draggable={isEditMode}
                  onDragStart={() => isEditMode && onProjectDragStart(visibleIdx)}
                  onDragOver={(e) => isEditMode && onProjectDragOver(e, visibleIdx)}
                  onDrop={() => isEditMode && onProjectDrop()}
                >
                  <TiltCard disabled={isEditMode} className="h-full">
                  <div className={`
                    h-full bg-slate-900/40 backdrop-blur-sm rounded-2xl overflow-hidden
                    border transition-all duration-500
                    flex flex-col
                    ${isEditMode
                      ? "border-blue-500/30 hover:border-blue-400/60 cursor-grab active:cursor-grabbing"
                      : "border-slate-800/60 hover:border-blue-500/50 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-blue-500/10"}
                  `}>
                    {/* Edit overlay controls */}
                    {isEditMode && (
                      <div className="absolute top-2 right-2 z-20 flex gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingProject(project); }}
                          className="p-1.5 bg-slate-900/90 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                          title="Edit project"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                          className="p-1.5 bg-slate-900/90 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                          title="Delete project"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                    {isEditMode && (
                      <div className="absolute top-2 left-2 z-20 p-1.5 text-slate-500">
                        <GripVertical size={16} />
                      </div>
                    )}

                    <ThumbnailImage project={project} iconName={getCategoryIcon(project.category)} />

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                          {project.name}
                        </h3>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-1 bg-slate-800/50 rounded-md shrink-0 ml-2">
                          {project.category}
                        </span>
                      </div>

                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6 group-hover:text-slate-300 transition-colors">
                        {project.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between">
                        <div className="text-[10px] text-slate-600 font-medium truncate max-w-[150px]">
                          {(() => { try { return new URL(project.url).hostname; } catch { return project.url; } })()}
                        </div>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          View <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Add project shortcut in edit mode */}
          {isEditMode && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setEditingProject("new")}
                className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-slate-700 hover:border-blue-500 text-slate-500 hover:text-blue-400 rounded-2xl transition-colors text-sm"
              >
                <Plus size={18} /> Add another project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {editingProject && (
        <ExtendedProjectEditModal
          project={editingProject === "new" ? undefined : editingProject}
          categories={data.categories.map((c) => c.id)}
          onSave={saveProject}
          onClose={() => setEditingProject(null)}
        />
      )}
      {editingCategory && (
        <CategoryEditModal
          category={editingCategory === "new" ? undefined : editingCategory}
          onSave={saveCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
      {showJsonEditor && (
        <JsonEditModal
          data={data}
          label="Portfolio Projects"
          onSave={(parsed) => {
            const next = parsed as typeof data;
            update(next);
            setShowJsonEditor(false);
          }}
          onClose={() => setShowJsonEditor(false)}
        />
      )}
    </div>
  );
}
