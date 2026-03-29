import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useMousePosition } from "../hooks/useMousePosition";
import TiltCard from "./TiltCard";
import type { LucideIcon } from "lucide-react";
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
  Upload,
  ImageIcon,
  List,
  LayoutGrid,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  EyeOff,
  Github,
  Check,
  Search,
  X,
} from "lucide-react";
import defaultData from "../data/portfolioData.json";
import ExtendedProjectEditModal, { ExtendedProject } from "./ExtendedProjectEditModal";
import AppDetailModal from "./AppDetailModal";
import JsonEditModal from "./JsonEditModal";
import { usePortfolio } from "../lib/stores/usePortfolio";

// ─── Icon map ────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
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
  // JSON is the source of truth for core fields (url, github, visible, name, description, category).
  // localStorage only persists additive/edit-only fields: media, longDescription, technologies.
  const jsonProjects = defaultData.projects as ExtendedProject[];
  const jsonCategories = defaultData.categories as Category[];

  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as { categories: Category[]; projects: ExtendedProject[] };
      // Build a map of saved extras keyed by id
      const savedMap = new Map(saved.projects.map((p) => [p.id, p]));
      // Merge: JSON fields win for core data; saved fields win for media/longDescription/technologies/visible
      const merged = jsonProjects.map((jp) => {
        const sp = savedMap.get(jp.id);
        if (!sp) return jp;
        return {
          ...jp, // core fields from JSON (url, github, name, description, category)
          visible: sp.visible !== undefined ? sp.visible : jp.visible,
          media: sp.media,
          longDescription: sp.longDescription,
          technologies: sp.technologies,
        };
      });
      // Include any projects added via the UI that aren't in the JSON
      const jsonIds = new Set(jsonProjects.map((p) => p.id));
      const extraProjects = saved.projects.filter((p) => !jsonIds.has(p.id));
      return { categories: jsonCategories, projects: [...merged, ...extraProjects] };
    }
  } catch {}
  return { categories: jsonCategories, projects: jsonProjects };
}

function saveData(data: { categories: Category[]; projects: ExtendedProject[] }) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ─── Image processing for card drops ─────────────────────────────────────────
async function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1400;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function processFiles(files: FileList): Promise<string[]> {
  const results: string[] = [];
  for (const file of Array.from(files)) {
    try {
      if (file.type.startsWith("image/")) {
        results.push(await processImageFile(file));
      } else if (file.type.startsWith("video/")) {
        await new Promise<void>((res) => {
          const reader = new FileReader();
          reader.onload = (e) => { results.push(e.target!.result as string); res(); };
          reader.readAsDataURL(file);
        });
      }
    } catch {
      console.warn("Failed to process", file.name);
    }
  }
  return results;
}

// ─── Category Edit Modal ──────────────────────────────────────────────────────
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
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Category ID</label>
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
  const [selectedProject, setSelectedProject] = useState<ExtendedProject | null>(null);
  const [fileDragOverId, setFileDragOverId] = useState<string | null>(null);

  // ── Parallax background blobs ──
  const { x: mouseX, y: mouseY } = useMousePosition();
  const blobSpringCfg = { stiffness: 40, damping: 20 };
  const smoothX = useSpring(mouseX, blobSpringCfg);
  const smoothY = useSpring(mouseY, blobSpringCfg);
  const blob1X = useTransform(smoothX, [0, typeof window !== "undefined" ? window.innerWidth : 1440], [-28, 28]);
  const blob1Y = useTransform(smoothY, [0, typeof window !== "undefined" ? window.innerHeight : 900], [-20, 20]);
  const blob2X = useTransform(smoothX, [0, typeof window !== "undefined" ? window.innerWidth : 1440], [28, -28]);
  const blob2Y = useTransform(smoothY, [0, typeof window !== "undefined" ? window.innerHeight : 900], [20, -20]);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "/") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // List view state
  const [listView, setListView] = useState(false);
  type SortCol = "name" | "category" | "url" | "github" | "media" | "visible";
  const [sortCol, setSortCol] = useState<SortCol>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  // List view filters
  const [listVisFilter, setListVisFilter] = useState<"all" | "visible" | "hidden">("all");
  const [listCatFilter, setListCatFilter] = useState("All");

  // Inline row editing
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [rowDraft, setRowDraft] = useState<Partial<ExtendedProject>>({});

  const startRowEdit = (project: ExtendedProject) => {
    setEditingRowId(project.id);
    setRowDraft({ ...project });
  };

  const saveRowEdit = () => {
    if (!editingRowId) return;
    const orig = data.projects.find((p) => p.id === editingRowId);
    if (!orig) return;
    const updated = { ...orig, ...rowDraft };
    update({ ...data, projects: data.projects.map((p) => (p.id === editingRowId ? updated : p)) });
    setEditingRowId(null);
    setRowDraft({});
  };

  const cancelRowEdit = () => {
    setEditingRowId(null);
    setRowDraft({});
  };

  // Drag-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const isDragSelecting = useRef(false);
  const dragAnchorIdx = useRef<number | null>(null);
  const dragMoved = useRef(false);
  const lastClickIdx = useRef<number | null>(null);

  const onRowMouseDown = (e: React.MouseEvent, idx: number, id: string) => {
    if (e.button !== 0) return;
    e.preventDefault();
    isDragSelecting.current = true;
    dragAnchorIdx.current = idx;
    dragMoved.current = false;

    if (e.shiftKey && lastClickIdx.current !== null) {
      const start = Math.min(lastClickIdx.current, idx);
      const end = Math.max(lastClickIdx.current, idx);
      setSelectedIds(new Set(listFilteredProjects.slice(start, end + 1).map((p) => p.id)));
    } else if (e.ctrlKey || e.metaKey) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
      });
      lastClickIdx.current = idx;
    } else {
      setSelectedIds(new Set([id]));
      lastClickIdx.current = idx;
    }
  };

  const onRowMouseEnter = (e: React.MouseEvent, idx: number) => {
    if (!isDragSelecting.current || e.buttons !== 1) return;
    const anchor = dragAnchorIdx.current ?? idx;
    if (idx !== anchor) dragMoved.current = true;
    const start = Math.min(anchor, idx);
    const end = Math.max(anchor, idx);
    setSelectedIds(new Set(listFilteredProjects.slice(start, end + 1).map((p) => p.id)));
  };

  const onRowMouseUp = (e: React.MouseEvent, project: ExtendedProject) => {
    isDragSelecting.current = false;
    if (!dragMoved.current && !isEditMode) {
      setSelectedProject(project);
    }
  };

  const bulkSetVisibility = (vis: boolean) => {
    const next = data.projects.map((p) =>
      selectedIds.has(p.id) ? { ...p, visible: vis } : p
    );
    update({ ...data, projects: next });
  };

  const toggleVisibility = (id: string) => {
    const next = data.projects.map((p) =>
      p.id === id ? { ...p, visible: p.visible === false ? true : false } : p
    );
    update({ ...data, projects: next });
  };

  // Edit modal state
  const [editingProject, setEditingProject] = useState<ExtendedProject | null | "new">(null);
  const [editingCategory, setEditingCategory] = useState<Category | null | "new">(null);
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  // Drag state for project reordering
  const dragProjectIndex = useRef<number | null>(null);
  const dragOverProjectIndex = useRef<number | null>(null);
  const isDraggingCard = useRef(false);

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

  // ── Project drag-and-drop (reorder) ──
  const searchLower = searchQuery.trim().toLowerCase();

  const matchesSearch = (p: ExtendedProject) => {
    if (!searchLower) return true;
    return (
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower) ||
      p.technologies?.some((t) => t.toLowerCase().includes(searchLower))
    );
  };

  const visibleProjects = (() => {
    const catFiltered =
      activeCategory === "All"
        ? data.projects
        : data.projects.filter((p) => p.category === activeCategory);
    const visFiltered = isEditMode ? catFiltered : catFiltered.filter((p) => p.visible !== false);
    return visFiltered.filter(matchesSearch);
  })();

  const sortedProjects = [...visibleProjects].sort((a, b) => {
    let cmp = 0;
    if (sortCol === "name") cmp = a.name.localeCompare(b.name);
    else if (sortCol === "category") cmp = a.category.localeCompare(b.category);
    else if (sortCol === "url") cmp = (a.url ? 1 : 0) - (b.url ? 1 : 0);
    else if (sortCol === "github") cmp = (a.github ? 1 : 0) - (b.github ? 1 : 0);
    else if (sortCol === "media") cmp = (a.media?.length ?? 0) - (b.media?.length ?? 0);
    else if (sortCol === "visible") cmp = (a.visible === false ? 0 : 1) - (b.visible === false ? 0 : 1);
    return sortDir === "asc" ? cmp : -cmp;
  });

  // List view pulls directly from data.projects so hidden items are never lost,
  // regardless of which category tab is active or edit-mode state.
  const listFilteredProjects = (() => {
    let base = [...data.projects];
    base.sort((a, b) => {
      let cmp = 0;
      if (sortCol === "name") cmp = a.name.localeCompare(b.name);
      else if (sortCol === "category") cmp = a.category.localeCompare(b.category);
      else if (sortCol === "url") cmp = (a.url ? 1 : 0) - (b.url ? 1 : 0);
      else if (sortCol === "github") cmp = (a.github ? 1 : 0) - (b.github ? 1 : 0);
      else if (sortCol === "media") cmp = (a.media?.length ?? 0) - (b.media?.length ?? 0);
      else if (sortCol === "visible") cmp = (a.visible === false ? 0 : 1) - (b.visible === false ? 0 : 1);
      return sortDir === "asc" ? cmp : -cmp;
    });
    if (listVisFilter === "visible") base = base.filter((p) => p.visible !== false);
    else if (listVisFilter === "hidden") base = base.filter((p) => p.visible === false);
    if (listCatFilter !== "All") base = base.filter((p) => p.category === listCatFilter);
    base = base.filter(matchesSearch);
    return base;
  })();

  const onProjectDragStart = (visibleIdx: number) => {
    isDraggingCard.current = true;
    dragProjectIndex.current = visibleIdx;
  };

  const onProjectDragOver = (e: React.DragEvent, visibleIdx: number) => {
    // Only handle card reorder if not dropping files
    if (e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    dragOverProjectIndex.current = visibleIdx;
  };

  const onProjectDrop = (e: React.DragEvent, visibleIdx: number) => {
    if (e.dataTransfer.types.includes("Files")) return;
    const from = dragProjectIndex.current;
    const to = dragOverProjectIndex.current;
    if (from === null || to === null || from === to) return;

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
    isDraggingCard.current = false;
  };

  // ── File drop on card (add media) ──
  const onCardFileDragOver = (e: React.DragEvent, projectId: string) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    e.stopPropagation();
    setFileDragOverId(projectId);
  };

  const onCardFileDrop = async (e: React.DragEvent, project: ExtendedProject) => {
    if (!e.dataTransfer.files.length) return;
    e.preventDefault();
    e.stopPropagation();
    setFileDragOverId(null);

    const newMedia = await processFiles(e.dataTransfer.files);
    if (!newMedia.length) return;

    const updated: ExtendedProject = {
      ...project,
      media: [...(project.media ?? []), ...newMedia],
    };
    saveProject(updated);
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

  // ── Active category icon ──
  const getCategoryIcon = (categoryId: string) => {
    const cat = data.categories.find((c) => c.id === categoryId);
    return cat?.icon || "Box";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <div className="relative overflow-hidden pt-24 pb-16">
        {/* Background blobs */}
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
          <div className="text-center mb-16 relative">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight inline-flex items-center gap-4"
            >
              The Portfolio
              <button
                onClick={() => setListView((v) => !v)}
                title={listView ? "Grid view" : "List view"}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  listView
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                }`}
              >
                {listView ? <LayoutGrid size={15} /> : <List size={15} />}
                <span className="text-sm font-medium">{listView ? "Grid" : "List"}</span>
              </button>
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
              <span className="text-xs text-slate-500 italic">Drag cards or tabs to reorder · Drop images/videos onto cards</span>
            </div>
          )}

          {/* Search bar */}
          <div className="flex justify-center mb-6">
            <div className={`relative flex items-center transition-all duration-300 ${
              searchOpen ? "w-full max-w-lg" : "w-auto"
            }`}>
              {searchOpen ? (
                <div className="relative w-full">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
                    }}
                    placeholder="Search projects…"
                    className="w-full bg-slate-900/80 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-10 py-2.5 text-white placeholder-slate-500 text-sm outline-none transition-colors backdrop-blur-sm shadow-lg"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <Search size={13} className="hidden" />
                      <span className="text-xs font-medium">✕</span>
                    </button>
                  )}
                  {!searchQuery && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-600 font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">esc</span>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 0); }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-500 hover:text-slate-300 rounded-xl text-sm transition-all"
                >
                  <Search size={14} />
                  <span>Search</span>
                  <span className="text-[11px] font-mono bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-slate-600">/</span>
                </button>
              )}
            </div>
          </div>

          {/* Search results count */}
          {searchQuery && (() => {
            const count = listView ? listFilteredProjects.length : visibleProjects.length;
            return (
              <p className="text-center text-sm text-slate-500 mb-6 -mt-2">
                {count} result{count !== 1 ? "s" : ""} for <span className="text-white font-medium">"{searchQuery}"</span>
                <button onClick={() => setSearchQuery("")} className="ml-3 text-slate-600 hover:text-slate-400 text-xs underline">clear</button>
              </p>
            );
          })()}

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

          {/* List view */}
          {listView && (
            <div className="mb-8">

              {/* ── Filter bar ── */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* Category filter */}
                <select
                  value={listCatFilter}
                  onChange={(e) => setListCatFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {data.categories.filter((c) => c.id !== "All").map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>

                {/* Visibility filter — always show, but "Hidden" only useful in edit mode */}
                <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700/60 rounded-lg p-0.5">
                  {(["all", "visible", "hidden"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setListVisFilter(f)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        listVisFilter === f
                          ? "bg-slate-600 text-white"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {f === "all" ? "All" : f === "visible" ? "Visible" : "Hidden"}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-600 ml-auto">{listFilteredProjects.length} project{listFilteredProjects.length !== 1 ? "s" : ""}</span>
              </div>

              {/* ── Bulk action bar ── */}
              {isEditMode && selectedIds.size > 0 && (
                <div className="flex items-center gap-3 mb-2 px-3 py-2 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                  <span className="text-blue-300 text-xs font-medium">{selectedIds.size} selected</span>
                  <div className="flex gap-2 ml-auto">
                    <button onClick={() => bulkSetVisibility(true)} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs transition-colors"><Eye size={11} /> Show</button>
                    <button onClick={() => bulkSetVisibility(false)} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs transition-colors"><EyeOff size={11} /> Hide</button>
                    <button onClick={() => setSelectedIds(new Set())} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded text-xs transition-colors">Clear</button>
                  </div>
                </div>
              )}

              {/* ── Table ── */}
              {(() => {
                // Column template — minmax(0,Xfr) prevents grid blowout
                const COLS = isEditMode
                  ? "48px minmax(0,2fr) 136px minmax(0,1.8fr) 144px 144px 48px 72px"
                  : "minmax(0,2fr) 136px minmax(0,1.8fr) 144px 144px 48px";

                const SortBtn = ({ col, label }: { col: SortCol | null; label: string }) => (
                  <button
                    onClick={() => col && toggleSort(col)}
                    className={`w-full h-full px-3 py-2 text-left flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold transition-colors ${
                      col ? "cursor-pointer hover:text-slate-300" : "cursor-default"
                    } ${col && sortCol === col ? "text-blue-400" : "text-slate-500"}`}
                  >
                    {label}
                    {col && (sortCol === col
                      ? (sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />)
                      : <ChevronsUpDown size={9} className="opacity-25" />)}
                  </button>
                );

                return (
                  <div
                    className="rounded-xl border border-slate-800 overflow-hidden text-xs select-none"
                    onMouseUp={() => { isDragSelecting.current = false; }}
                    onMouseLeave={() => { isDragSelecting.current = false; }}
                  >
                    {/* Header */}
                    <div className="grid bg-slate-900/80 border-b border-slate-800" style={{ gridTemplateColumns: COLS }}>
                      {isEditMode && (
                        <div className="flex items-center justify-center gap-1 px-1 py-2">
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              const allSelected = listFilteredProjects.length > 0 && listFilteredProjects.every((p) => selectedIds.has(p.id));
                              if (allSelected) {
                                setSelectedIds(new Set());
                              } else {
                                setSelectedIds(new Set(listFilteredProjects.map((p) => p.id)));
                              }
                            }}
                            className="flex items-center justify-center w-4 h-4 rounded border border-slate-600 hover:border-blue-400 transition-colors flex-shrink-0"
                            style={{
                              background: listFilteredProjects.length > 0 && listFilteredProjects.every((p) => selectedIds.has(p.id))
                                ? "rgb(37 99 235)"
                                : listFilteredProjects.some((p) => selectedIds.has(p.id))
                                ? "rgba(37,99,235,0.4)"
                                : "transparent",
                            }}
                            title="Select all"
                          >
                            {listFilteredProjects.length > 0 && listFilteredProjects.every((p) => selectedIds.has(p.id)) && (
                              <Check size={10} className="text-white" />
                            )}
                            {listFilteredProjects.some((p) => selectedIds.has(p.id)) && !listFilteredProjects.every((p) => selectedIds.has(p.id)) && (
                              <span className="block w-2 h-0.5 bg-blue-300 rounded" />
                            )}
                          </button>
                          <SortBtn col="visible" label="" />
                        </div>
                      )}
                      <SortBtn col="name" label="Name" />
                      <SortBtn col="category" label="Category" />
                      <SortBtn col={null} label="Description" />
                      <SortBtn col="github" label="GitHub" />
                      <SortBtn col="url" label="URL" />
                      <SortBtn col="media" label="Media" />
                      {isEditMode && <div />}
                    </div>

                    {/* Rows */}
                    {listFilteredProjects.map((project, i) => {
                      const isEditing = editingRowId === project.id;
                      const isHidden = project.visible === false;
                      const isSelected = selectedIds.has(project.id);

                      const hostname = project.url
                        ? (() => { try { return new URL(project.url).hostname; } catch { return project.url; } })()
                        : null;
                      const githubDisplay = project.github
                        ? (() => { try { const u = new URL(project.github); return (u.pathname.replace(/^\//, "").replace(/\/$/, "") || u.hostname); } catch { return project.github; } })()
                        : null;

                      // ── Editing row ──
                      if (isEditing) {
                        const inputCls = "w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs outline-none focus:border-blue-500 min-w-0";
                        return (
                          <div
                            key={project.id}
                            className="grid items-center border-b border-slate-800/40 last:border-0 bg-blue-950/30"
                            style={{ gridTemplateColumns: COLS }}
                          >
                            {/* Vis toggle */}
                            {isEditMode && (
                              <div className="flex justify-center px-1 py-2">
                                <button
                                  onClick={() => setRowDraft((d) => ({ ...d, visible: d.visible === false ? true : false }))}
                                  className={`p-0.5 rounded transition-colors ${
                                    rowDraft.visible === false ? "text-slate-600 hover:text-slate-400" : "text-green-400 hover:text-green-300"
                                  }`}
                                >
                                  {rowDraft.visible === false ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                              </div>
                            )}
                            {/* Name */}
                            <div className="px-2 py-1.5 min-w-0">
                              <input className={inputCls} value={rowDraft.name ?? ""} onChange={(e) => setRowDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Name" />
                            </div>
                            {/* Category */}
                            <div className="px-2 py-1.5 min-w-0">
                              <select
                                className={inputCls}
                                value={rowDraft.category ?? ""}
                                onChange={(e) => setRowDraft((d) => ({ ...d, category: e.target.value }))}
                              >
                                {data.categories.filter((c) => c.id !== "All").map((c) => (
                                  <option key={c.id} value={c.id}>{c.label}</option>
                                ))}
                              </select>
                            </div>
                            {/* Description */}
                            <div className="px-2 py-1.5 min-w-0">
                              <input className={inputCls} value={rowDraft.description ?? ""} onChange={(e) => setRowDraft((d) => ({ ...d, description: e.target.value }))} placeholder="Description" />
                            </div>
                            {/* GitHub */}
                            <div className="px-2 py-1.5 min-w-0">
                              <input className={inputCls} value={rowDraft.github ?? ""} onChange={(e) => setRowDraft((d) => ({ ...d, github: e.target.value }))} placeholder="https://github.com/..." />
                            </div>
                            {/* URL */}
                            <div className="px-2 py-1.5 min-w-0">
                              <input className={inputCls} value={rowDraft.url ?? ""} onChange={(e) => setRowDraft((d) => ({ ...d, url: e.target.value }))} placeholder="https://..." />
                            </div>
                            {/* Media */}
                            <div className="px-2 py-1.5 text-center text-slate-500">
                              {project.media?.length ?? 0}
                            </div>
                            {/* Save / Cancel */}
                            {isEditMode && (
                              <div className="px-1.5 py-1 flex items-center justify-end gap-1">
                                <button onClick={saveRowEdit} className="p-1 text-green-400 hover:text-green-300 transition-colors rounded" title="Save"><Check size={13} /></button>
                                <button onClick={cancelRowEdit} className="p-1 text-slate-500 hover:text-slate-300 transition-colors rounded" title="Cancel"><X size={13} /></button>
                              </div>
                            )}
                          </div>
                        );
                      }

                      // ── Display row ──
                      return (
                        <div
                          key={project.id}
                          className={`grid items-center border-b border-slate-800/40 last:border-0 transition-colors group ${
                            isSelected ? "bg-blue-600/15" : i % 2 === 0 ? "" : "bg-white/[0.015]"
                          } ${isHidden ? "opacity-40" : ""} hover:bg-blue-600/10 cursor-default`}
                          style={{ gridTemplateColumns: COLS }}
                          onMouseDown={(e) => onRowMouseDown(e, i, project.id)}
                          onMouseEnter={(e) => onRowMouseEnter(e, i)}
                          onMouseUp={(e) => onRowMouseUp(e, project)}
                        >
                          {/* Vis toggle */}
                          {isEditMode && (
                            <div className="flex justify-center px-1 py-2">
                              <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => { e.stopPropagation(); toggleVisibility(project.id); }}
                                className={`p-0.5 rounded transition-colors ${isHidden ? "text-slate-700 hover:text-slate-500" : "text-green-500 hover:text-green-400"}`}
                                title={isHidden ? "Hidden" : "Visible"}
                              >
                                {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                            </div>
                          )}

                          {/* Name */}
                          <div className={`px-3 py-2 font-medium truncate min-w-0 transition-colors ${isHidden ? "text-slate-500" : isSelected ? "text-blue-200" : "text-slate-100"}`}>
                            {project.name}
                          </div>

                          {/* Category */}
                          <div className="px-3 py-2 min-w-0 overflow-hidden">
                            <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/60 max-w-full truncate">
                              {project.category}
                            </span>
                          </div>

                          {/* Description */}
                          <div className="px-3 py-2 text-slate-500 truncate min-w-0 text-[11px]">
                            {project.description || <span className="text-slate-700">—</span>}
                          </div>

                          {/* GitHub */}
                          <div className="px-3 py-2 min-w-0 overflow-hidden">
                            {githubDisplay ? (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors min-w-0"
                              >
                                <Github size={10} className="shrink-0" />
                                <span className="truncate font-mono text-[11px]">{githubDisplay}</span>
                              </a>
                            ) : (
                              <span className="text-slate-700">—</span>
                            )}
                          </div>

                          {/* URL */}
                          <div className="px-3 py-2 min-w-0 overflow-hidden">
                            {hostname ? (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors min-w-0"
                              >
                                <ExternalLink size={10} className="shrink-0" />
                                <span className="truncate font-mono text-[11px]">{hostname}</span>
                              </a>
                            ) : (
                              <span className="text-slate-700">—</span>
                            )}
                          </div>

                          {/* Media */}
                          <div className="px-3 py-2 text-center">
                            {(project.media?.length ?? 0) > 0 ? (
                              <span className="inline-flex items-center gap-0.5 text-slate-400">
                                <ImageIcon size={10} />
                                {project.media!.length}
                              </span>
                            ) : (
                              <span className="text-slate-700">—</span>
                            )}
                          </div>

                          {/* Actions */}
                          {isEditMode && (
                            <div className="px-2 py-1.5 flex items-center justify-end gap-0.5">
                              <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => { e.stopPropagation(); startRowEdit(project); }}
                                className="p-1.5 text-slate-600 hover:text-blue-400 hover:bg-slate-700/50 transition-colors rounded"
                                title="Edit row"
                              >
                                <Pencil size={11} />
                              </button>
                              <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                                className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-slate-700/50 transition-colors rounded"
                                title="Delete"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {listFilteredProjects.length === 0 && (
                      <div className="py-16 text-center text-slate-600 text-sm">No projects match the current filters</div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Projects grid */}
          {!listView && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project, visibleIdx) => {
                const hasMedia = project.media && project.media.length > 0;
                const isFileDragTarget = fileDragOverId === project.id;
                const Icon = ICON_MAP[getCategoryIcon(project.category)] || Box;
                const isHiddenCard = project.visible === false;

                return (
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
                    onDragOver={(e) => {
                      if (isEditMode) {
                        if (e.dataTransfer.types.includes("Files")) {
                          onCardFileDragOver(e, project.id);
                        } else {
                          onProjectDragOver(e, visibleIdx);
                        }
                      }
                    }}
                    onDragLeave={() => setFileDragOverId(null)}
                    onDrop={(e) => {
                      if (isEditMode) {
                        if (e.dataTransfer.files.length) {
                          onCardFileDrop(e, project);
                        } else {
                          onProjectDrop(e, visibleIdx);
                        }
                      }
                    }}
                    onClick={() => {
                      if (!isEditMode) setSelectedProject(project);
                    }}
                  >
                    <TiltCard disabled={isEditMode} className="h-full">
                      <div className={`
                        h-full bg-slate-900/40 backdrop-blur-sm rounded-2xl overflow-hidden
                        border transition-all duration-500
                        flex flex-col
                        ${isHiddenCard ? "opacity-40" : ""}
                        ${isFileDragTarget
                          ? "border-blue-400 bg-slate-900/80 shadow-lg shadow-blue-500/20"
                          : isEditMode
                          ? "border-blue-500/30 hover:border-blue-400/60 cursor-grab active:cursor-grabbing"
                          : "border-slate-800/60 hover:border-blue-500/50 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"}
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
                          <div className="absolute top-2 left-2 z-20 flex items-center gap-1">
                            <div className="p-1.5 text-slate-500">
                              <GripVertical size={16} />
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleVisibility(project.id); }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isHiddenCard
                                  ? "bg-slate-900/90 text-slate-600 hover:text-slate-300"
                                  : "bg-slate-900/90 text-green-400 hover:text-green-300"
                              }`}
                              title={isHiddenCard ? "Hidden — click to show" : "Visible — click to hide"}
                            >
                              {isHiddenCard ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                          </div>
                        )}

                        {/* File drop zone overlay (edit mode) */}
                        {isEditMode && (
                          <div className={`
                            mx-4 mt-4 rounded-xl border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-2 text-xs
                            ${isFileDragTarget
                              ? "border-blue-400 bg-blue-500/10 text-blue-400 py-5"
                              : "border-slate-700/50 text-slate-600 py-3 hover:border-slate-600"}
                          `}>
                            <Upload size={12} />
                            {isFileDragTarget ? "Drop to add media" : "Drop images/videos here"}
                            {hasMedia && (
                              <span className="ml-1 flex items-center gap-1 text-slate-500">
                                <ImageIcon size={11} /> {project.media!.length}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="p-6 flex flex-col flex-grow">
                          {/* Media badge (non-edit, has media) */}
                          {!isEditMode && hasMedia && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                              <ImageIcon size={11} />
                              <span>{project.media!.length} media slide{project.media!.length !== 1 ? "s" : ""}</span>
                            </div>
                          )}

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
                            <div className="flex items-center gap-2">
                              {!isEditMode && (
                                <span className="text-slate-600 text-xs">View details →</span>
                              )}
                              {project.url && (
                                <a
                                  href={project.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
          )}

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
      <AnimatePresence>
        {selectedProject && (
          <AppDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
