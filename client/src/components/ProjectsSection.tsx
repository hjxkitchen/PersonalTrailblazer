import { useState, useRef } from "react";
import { Box, GripVertical, Pencil, Trash2, Plus, RotateCcw, X } from "lucide-react";
import defaultData from "../data/mainProjectsData.json";
import MainProjectEditModal, { MainProject } from "./MainProjectEditModal";
import { usePortfolio } from "../lib/stores/usePortfolio";

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
const LS_KEY = "portfolio-main-data";

interface MainData {
  projects: MainProject[];
  interests: string[];
}

function loadData(): MainData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    projects: defaultData.projects as MainProject[],
    interests: defaultData.interests,
  };
}

function saveData(data: MainData) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────
const THUMBNAIL_MAP: Record<string, string> = {
  "Socos": "socos.jpg",
  "Agora": "agora.jpg",
  "Zahab Energy": "zahab-energy.jpg",
  "B2B Marketplace & Commerce Orchestration": "b2b-marketplace.jpg",
  "Wild Earth Safaris": "wild-earth-safaris.jpg",
  "Mechatronics & Automation Systems": "mechatronics.jpg",
};

function getThumbnailPath(title: string): string {
  if (THUMBNAIL_MAP[title]) return `/thumbnails/${THUMBNAIL_MAP[title]}`;
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `/thumbnails/${slug}.jpg`;
}

function ProjectThumbnail({ project, isExpanded }: { project: MainProject; isExpanded: boolean }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div
        className="relative bg-slate-950 overflow-hidden flex items-center justify-center rounded-t-2xl transition-all duration-500 ease-in-out"
        style={{ maxHeight: isExpanded ? "256px" : "0px", minHeight: isExpanded ? "256px" : "0px" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20" />
        <div className={`relative text-slate-700 transition-all duration-300 ${isExpanded ? "text-blue-400 opacity-100" : "opacity-0"}`}>
          <Box size={40} strokeWidth={1.5} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative bg-slate-950 overflow-hidden rounded-t-2xl transition-all duration-500 ease-in-out"
      style={{ maxHeight: isExpanded ? "256px" : "0px", minHeight: isExpanded ? "256px" : "0px" }}
    >
      <img
        src={getThumbnailPath(project.title)}
        alt={project.title}
        className={`w-full h-full object-cover transition-all duration-500 ${isExpanded ? "scale-110 opacity-100" : "opacity-0 scale-100"}`}
        onError={() => setImageError(true)}
        style={{ height: isExpanded ? "256px" : "0px", minHeight: isExpanded ? "256px" : "0px" }}
      />
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "Active": return "bg-green-600/20 text-green-300 border-green-600/30";
    case "Completed": return "bg-blue-600/20 text-blue-300 border-blue-600/30";
    case "In Development": return "bg-orange-600/20 text-orange-300 border-orange-600/30";
    default: return "bg-slate-600/20 text-slate-300 border-slate-600/30";
  }
}

// ─── Interest tag edit modal ──────────────────────────────────────────────────
function InterestEditModal({
  interests,
  onSave,
  onClose,
}: {
  interests: string[];
  onSave: (interests: string[]) => void;
  onClose: () => void;
}) {
  const [list, setList] = useState([...interests]);
  const [input, setInput] = useState("");

  const add = () => {
    const t = input.trim();
    if (t && !list.includes(t)) setList((l) => [...l, t]);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={18} /></button>
        <h2 className="text-xl font-bold text-white mb-6">Edit Interests</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder="Add interest..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 text-sm"
          />
          <button onClick={add} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"><Plus size={16} /></button>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {list.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-500/10 text-purple-300 border border-purple-500/30">
              {item}
              <button onClick={() => setList((l) => l.filter((_, i) => i !== idx))} className="ml-1 text-purple-400 hover:text-red-400 transition-colors"><X size={11} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-lg text-sm">Cancel</button>
          <button onClick={() => { onSave(list); onClose(); }} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const { isEditMode } = usePortfolio();
  const [data, setData] = useState<MainData>(() => loadData());
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<MainProject | null | "new">(null);
  const [editingInterests, setEditingInterests] = useState(false);

  // Drag state
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const update = (next: MainData) => {
    setData(next);
    saveData(next);
  };

  const resetToDefaults = () => {
    if (confirm("Reset main projects to defaults? This cannot be undone.")) {
      localStorage.removeItem(LS_KEY);
      setData({ projects: defaultData.projects as MainProject[], interests: defaultData.interests });
      setExpandedIndex(null);
    }
  };

  // ── Project CRUD ──
  const saveProject = (project: MainProject) => {
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
    setExpandedIndex(null);
  };

  // ── Drag-and-drop ──
  const onDragStart = (idx: number) => { dragIndex.current = idx; };
  const onDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); dragOverIndex.current = idx; };
  const onDrop = () => {
    const from = dragIndex.current;
    const to = dragOverIndex.current;
    if (from === null || to === null || from === to) return;
    const next = [...data.projects];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    update({ ...data, projects: next });
    dragIndex.current = null;
    dragOverIndex.current = null;
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white text-center flex-1">Projects</h2>
        {isEditMode && (
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded-lg text-xs transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Edit toolbar */}
      {isEditMode && (
        <div className="mb-6 flex flex-wrap gap-3 p-4 bg-slate-900/60 border border-blue-500/30 rounded-2xl">
          <button
            onClick={() => setEditingProject("new")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={15} /> Add Project
          </button>
          <span className="text-xs text-slate-500 italic self-center">Drag cards to reorder</span>
        </div>
      )}

      <div className="columns-1 md:columns-2 gap-8 mb-16" style={{ columnGap: "2rem", contain: "layout" }}>
        {data.projects.map((project, index) => {
          const isExpanded = expandedIndex === index && !isEditMode;
          return (
            <div
              key={project.id}
              className={`
                group relative rounded-2xl p-[1px]
                bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent
                hover:from-blue-400/30 hover:via-purple-400/20
                transition-all duration-300
                break-inside-avoid
                mb-8
                ${isEditMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}
              `}
              onClick={() => !isEditMode && setExpandedIndex(isExpanded ? null : index)}
              draggable={isEditMode}
              onDragStart={() => isEditMode && onDragStart(index)}
              onDragOver={(e) => isEditMode && onDragOver(e, index)}
              onDrop={() => isEditMode && onDrop()}
              style={{ contain: "layout style" }}
            >
              <div className={`
                rounded-2xl bg-slate-900/80 backdrop-blur
                border overflow-hidden transition-all duration-300
                ${isEditMode ? "border-blue-500/30" : "border-slate-700/60 group-hover:border-slate-600"}
              `}>
                {/* Edit controls overlay */}
                {isEditMode && (
                  <div className="flex items-center justify-between px-4 pt-3 pb-0">
                    <GripVertical size={16} className="text-slate-600" />
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingProject(project); }}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-md text-xs transition-colors"
                      >
                        <Pencil size={11} /> Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-md text-xs transition-colors"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                )}

                <ProjectThumbnail project={project} isExpanded={isExpanded} />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white tracking-tight">{project.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`} />
                      <span className="text-slate-300 uppercase tracking-wide">{project.status}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-5">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, ti) => (
                      <span
                        key={ti}
                        className="px-3 py-1 rounded-full text-xs bg-slate-800/70 text-slate-200 border border-slate-700 hover:border-slate-500 transition"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.link && (
                    <a
                      href={`https://${project.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                      <span className="border-b border-transparent group-hover:border-blue-400 transition">View Project</span>
                      <span className="opacity-60 group-hover:opacity-100 transition">→</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add project shortcut */}
      {isEditMode && (
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setEditingProject("new")}
            className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-slate-700 hover:border-blue-500 text-slate-500 hover:text-blue-400 rounded-2xl transition-colors text-sm"
          >
            <Plus size={18} /> Add another project
          </button>
        </div>
      )}

      {/* Interests */}
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-purple-500/20 to-blue-500/10">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-700/60 p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white tracking-tight">Areas of Interest</h3>
            {isEditMode && (
              <button
                onClick={() => setEditingInterests(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg text-xs transition-colors"
              >
                <Pencil size={12} /> Edit
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {data.interests.map((interest, index) => (
              <span
                key={index}
                className="px-4 py-1.5 rounded-full text-sm bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {editingProject && (
        <MainProjectEditModal
          project={editingProject === "new" ? undefined : editingProject}
          onSave={saveProject}
          onClose={() => setEditingProject(null)}
        />
      )}
      {editingInterests && (
        <InterestEditModal
          interests={data.interests}
          onSave={(interests) => update({ ...data, interests })}
          onClose={() => setEditingInterests(false)}
        />
      )}
    </section>
  );
}
