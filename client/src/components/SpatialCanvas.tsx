import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type, Heading1, BookOpen, Layers, Link2, Plus, Trash2, Pencil,
  RotateCcw, ZoomIn, ZoomOut, Maximize2, ExternalLink, X, Move,
  Minus, Code2,
} from "lucide-react";
import { usePortfolio } from "../lib/stores/usePortfolio";
import defaultData from "../data/spatialCanvasData.json";
import JsonEditModal from "./JsonEditModal";

// ─── Types ────────────────────────────────────────────────────────────────────

type FontSize = "sm" | "md" | "lg" | "xl";
type Align = "left" | "center" | "right";
type ElementType = "heading" | "text" | "story" | "project" | "link";

export interface SpatialElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  zIndex?: number;
  // heading / text
  content?: string;
  fontSize?: FontSize;
  align?: Align;
  // story
  title?: string;
  body?: string;
  accent?: string;
  // project
  projectName?: string;
  projectDesc?: string;
  projectUrl?: string;
  projectCategory?: string;
  // link
  label?: string;
  href?: string;
}

interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

interface CanvasData {
  viewport: Viewport;
  elements: SpatialElement[];
}

// ─── LocalStorage ─────────────────────────────────────────────────────────────

const LS_KEY = "portfolio-spatial-canvas";

function loadData(): CanvasData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultData as CanvasData;
}

function saveData(data: CanvasData) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const FONT_SIZES: Record<FontSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl md:text-3xl",
  xl: "text-4xl md:text-5xl",
};

const FONT_WEIGHTS: Record<FontSize, string> = {
  sm: "font-normal",
  md: "font-normal",
  lg: "font-bold",
  xl: "font-extrabold",
};

const ALIGN_CLASSES: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const ACCENT_PRESETS = [
  { label: "Blue",   value: "#3b82f6" },
  { label: "Green",  value: "#10b981" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Amber",  value: "#f59e0b" },
  { label: "Pink",   value: "#ec4899" },
  { label: "Teal",   value: "#14b8a6" },
];

// ─── Element renderers ────────────────────────────────────────────────────────

function HeadingEl({ el }: { el: SpatialElement }) {
  const fs = el.fontSize ?? "lg";
  const align = el.align ?? "left";
  return (
    <p
      className={`${FONT_SIZES[fs]} ${FONT_WEIGHTS[fs]} ${ALIGN_CLASSES[align]} text-white leading-tight tracking-tight select-none`}
      style={{ lineHeight: 1.15 }}
    >
      {el.content || "Heading"}
    </p>
  );
}

function TextEl({ el }: { el: SpatialElement }) {
  const fs = el.fontSize ?? "md";
  const align = el.align ?? "left";
  return (
    <p
      className={`${FONT_SIZES[fs]} ${ALIGN_CLASSES[align]} text-slate-300 leading-relaxed select-none`}
    >
      {el.content || "Text block"}
    </p>
  );
}

function StoryEl({ el }: { el: SpatialElement }) {
  const accent = el.accent ?? "#3b82f6";
  return (
    <div
      className="rounded-2xl p-6 bg-slate-900/80 backdrop-blur-sm border border-slate-700/60"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      {el.title && (
        <h3 className="text-white font-bold text-lg mb-3 leading-tight" style={{ color: accent }}>
          {el.title}
        </h3>
      )}
      {el.body && (
        <p className="text-slate-300 text-sm leading-relaxed">{el.body}</p>
      )}
    </div>
  );
}

function ProjectEl({ el }: { el: SpatialElement }) {
  return (
    <div className="rounded-2xl p-5 bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 hover:border-blue-500/40 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-white font-bold text-base leading-tight">{el.projectName || "Project"}</h3>
        {el.projectCategory && (
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-0.5 bg-slate-800/50 rounded ml-2 shrink-0">
            {el.projectCategory}
          </span>
        )}
      </div>
      {el.projectDesc && (
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{el.projectDesc}</p>
      )}
      {el.projectUrl && (
        <a
          href={el.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          View Project <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}

function LinkEl({ el }: { el: SpatialElement }) {
  return (
    <a
      href={el.href ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg"
    >
      {el.label || "Link"} <ExternalLink size={13} />
    </a>
  );
}

function renderElement(el: SpatialElement) {
  switch (el.type) {
    case "heading": return <HeadingEl el={el} />;
    case "text":    return <TextEl el={el} />;
    case "story":   return <StoryEl el={el} />;
    case "project": return <ProjectEl el={el} />;
    case "link":    return <LinkEl el={el} />;
  }
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

interface EditModalProps {
  element?: SpatialElement;
  type: ElementType;
  onSave: (el: SpatialElement) => void;
  onClose: () => void;
}

function EditModal({ element, type, onSave, onClose }: EditModalProps) {
  const isNew = !element;
  const [form, setForm] = useState<SpatialElement>(
    element ?? {
      id: `el-${Date.now()}`,
      type,
      x: 0, y: 0, width: 360, zIndex: 1,
    }
  );

  const set = <K extends keyof SpatialElement>(k: K, v: SpatialElement[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const inputCls =
    "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm";
  const labelCls = "block text-xs text-slate-400 mb-1.5 uppercase tracking-wider";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={18} />
        </button>
        <h2 className="text-xl font-bold text-white mb-6 capitalize">
          {isNew ? `Add ${type}` : `Edit ${type}`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Heading / Text */}
          {(type === "heading" || type === "text") && (
            <>
              <div>
                <label className={labelCls}>Content</label>
                {type === "text" ? (
                  <textarea
                    value={form.content ?? ""}
                    onChange={(e) => set("content", e.target.value)}
                    rows={4}
                    className={`${inputCls} resize-none`}
                    placeholder="Enter text..."
                  />
                ) : (
                  <input
                    value={form.content ?? ""}
                    onChange={(e) => set("content", e.target.value)}
                    className={inputCls}
                    placeholder="Enter heading..."
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Size</label>
                  <select
                    value={form.fontSize ?? "md"}
                    onChange={(e) => set("fontSize", e.target.value as FontSize)}
                    className={inputCls}
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="xl">XL</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Alignment</label>
                  <select
                    value={form.align ?? "left"}
                    onChange={(e) => set("align", e.target.value as Align)}
                    className={inputCls}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Story */}
          {type === "story" && (
            <>
              <div>
                <label className={labelCls}>Title</label>
                <input
                  value={form.title ?? ""}
                  onChange={(e) => set("title", e.target.value)}
                  className={inputCls}
                  placeholder="Section title"
                />
              </div>
              <div>
                <label className={labelCls}>Body</label>
                <textarea
                  value={form.body ?? ""}
                  onChange={(e) => set("body", e.target.value)}
                  rows={4}
                  className={`${inputCls} resize-none`}
                  placeholder="Story content..."
                />
              </div>
              <div>
                <label className={labelCls}>Accent color</label>
                <div className="flex gap-2 flex-wrap">
                  {ACCENT_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => set("accent", p.value)}
                      title={p.label}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        form.accent === p.value ? "border-white scale-110" : "border-transparent"
                      }`}
                      style={{ background: p.value }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Project */}
          {type === "project" && (
            <>
              <div>
                <label className={labelCls}>Project Name</label>
                <input value={form.projectName ?? ""} onChange={(e) => set("projectName", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  value={form.projectDesc ?? ""}
                  onChange={(e) => set("projectDesc", e.target.value)}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className={labelCls}>URL</label>
                <input value={form.projectUrl ?? ""} onChange={(e) => set("projectUrl", e.target.value)} className={inputCls} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <input value={form.projectCategory ?? ""} onChange={(e) => set("projectCategory", e.target.value)} className={inputCls} placeholder="e.g. Commerce, Infrastructure" />
              </div>
            </>
          )}

          {/* Link */}
          {type === "link" && (
            <>
              <div>
                <label className={labelCls}>Label</label>
                <input value={form.label ?? ""} onChange={(e) => set("label", e.target.value)} className={inputCls} placeholder="Button text" />
              </div>
              <div>
                <label className={labelCls}>URL</label>
                <input value={form.href ?? ""} onChange={(e) => set("href", e.target.value)} className={inputCls} placeholder="https://..." />
              </div>
            </>
          )}

          {/* Width */}
          <div>
            <label className={labelCls}>Width (px on canvas)</label>
            <input
              type="number"
              min={150}
              max={900}
              value={form.width}
              onChange={(e) => set("width", Number(e.target.value))}
              className={inputCls}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-lg text-sm">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-sm">
              {isNew ? "Add to Canvas" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Canvas Component ────────────────────────────────────────────────────

export default function SpatialCanvas() {
  const { isEditMode } = usePortfolio();

  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas data (persisted)
  const [data, setData] = useState<CanvasData>(() => loadData());
  const viewport = data.viewport;
  const elements = data.elements;

  // Interaction state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ type: ElementType; element?: SpatialElement } | null>(null);
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  // Refs for stable event-handler access (avoids stale closures)
  const viewportRef = useRef(viewport);
  useEffect(() => { viewportRef.current = viewport; }, [viewport]);

  const isEditRef = useRef(isEditMode);
  useEffect(() => { isEditRef.current = isEditMode; }, [isEditMode]);

  // Pan state
  const panInfo = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  // Element drag state
  const dragInfo = useRef<{
    id: string;
    startX: number; startY: number;
    origX: number; origY: number;
    moved: boolean;
  } | null>(null);

  // ── Update helpers ──
  const updateViewport = useCallback((fn: (v: Viewport) => Viewport) => {
    setData((d) => {
      const next = { ...d, viewport: fn(d.viewport) };
      saveData(next);
      return next;
    });
  }, []);

  const updateElements = useCallback((fn: (els: SpatialElement[]) => SpatialElement[]) => {
    setData((d) => {
      const next = { ...d, elements: fn(d.elements) };
      saveData(next);
      return next;
    });
  }, []);

  // ── Wheel zoom (passive: false required) ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.ctrlKey
        ? e.deltaY > 0 ? 0.95 : 1.05
        : e.deltaY > 0 ? 0.91 : 1.1;
      const vp = viewportRef.current;
      const newZoom = Math.max(0.1, Math.min(4, vp.zoom * factor));
      if (newZoom === vp.zoom) return;
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      updateViewport(() => ({
        zoom: newZoom,
        x: cx - (cx - vp.x) * (newZoom / vp.zoom),
        y: cy - (cy - vp.y) * (newZoom / vp.zoom),
      }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [updateViewport]);

  // ── Global mouse move / up ──
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Pan
      if (panInfo.current) {
        const dx = e.clientX - panInfo.current.startX;
        const dy = e.clientY - panInfo.current.startY;
        updateViewport(() => ({
          ...viewportRef.current,
          x: panInfo.current!.origX + dx,
          y: panInfo.current!.origY + dy,
        }));
      }
      // Element drag (edit mode only)
      if (dragInfo.current && isEditRef.current) {
        const vp = viewportRef.current;
        const dx = (e.clientX - dragInfo.current.startX) / vp.zoom;
        const dy = (e.clientY - dragInfo.current.startY) / vp.zoom;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          dragInfo.current.moved = true;
          const id = dragInfo.current.id;
          const nx = dragInfo.current.origX + dx;
          const ny = dragInfo.current.origY + dy;
          setData((d) => ({
            ...d,
            elements: d.elements.map((el) =>
              el.id === id ? { ...el, x: nx, y: ny } : el
            ),
          }));
        }
      }
    };

    const onUp = () => {
      panInfo.current = null;
      if (dragInfo.current) {
        if (dragInfo.current.moved) {
          // persist final position
          setData((d) => { saveData(d); return d; });
        }
        dragInfo.current = null;
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [updateViewport]);

  // ── Keyboard ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isEditRef.current) return;
      if ((e.key === "Delete" || e.key === "Backspace") &&
          selectedId &&
          (e.target as HTMLElement).tagName !== "INPUT" &&
          (e.target as HTMLElement).tagName !== "TEXTAREA") {
        deleteElement(selectedId);
        setSelectedId(null);
      }
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  // ── Container (background) mouse down → start pan ──
  const handleBgMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setSelectedId(null);
    panInfo.current = {
      startX: e.clientX, startY: e.clientY,
      origX: viewport.x, origY: viewport.y,
    };
  };

  // ── Element mouse down → start drag or select ──
  const handleElementMouseDown = (e: React.MouseEvent, el: SpatialElement) => {
    e.stopPropagation();
    setSelectedId(el.id);
    if (isEditMode) {
      dragInfo.current = {
        id: el.id,
        startX: e.clientX, startY: e.clientY,
        origX: el.x, origY: el.y,
        moved: false,
      };
    }
  };

  // ── CRUD ──
  const saveElement = (el: SpatialElement) => {
    updateElements((els) => {
      const idx = els.findIndex((e) => e.id === el.id);
      if (idx >= 0) {
        const next = [...els];
        next[idx] = el;
        return next;
      }
      return [...els, el];
    });
    setModal(null);
    setSelectedId(el.id);
  };

  const deleteElement = (id: string) => {
    if (!confirm("Remove this element from the canvas?")) return;
    updateElements((els) => els.filter((e) => e.id !== id));
    setSelectedId(null);
  };

  const addElement = (type: ElementType) => {
    // Place at current viewport center
    const rect = containerRef.current?.getBoundingClientRect();
    const cx = rect ? rect.width / 2 : 400;
    const cy = rect ? rect.height / 2 : 300;
    const canvasX = (cx - viewport.x) / viewport.zoom - 180;
    const canvasY = (cy - viewport.y) / viewport.zoom - 80;
    const base: SpatialElement = {
      id: `el-${Date.now()}`,
      type,
      x: canvasX,
      y: canvasY,
      width: type === "link" ? 240 : type === "heading" ? 500 : 380,
      zIndex: elements.length + 1,
    };
    setModal({ type, element: { ...base } });
  };

  // New element from modal — position already set, just save
  const handleNewElementSave = (el: SpatialElement) => {
    saveElement(el);
  };

  // ── Fit all elements to view ──
  const fitToView = () => {
    if (elements.length === 0) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const minX = Math.min(...elements.map((e) => e.x));
    const maxX = Math.max(...elements.map((e) => e.x + e.width));
    const minY = Math.min(...elements.map((e) => e.y));
    const maxY = Math.max(...elements.map((e) => e.y + 200));
    const padding = 80;
    const zoom = Math.min(
      (rect.width - padding * 2) / (maxX - minX),
      (rect.height - padding * 2) / (maxY - minY),
      1.5
    );
    updateViewport(() => ({
      zoom,
      x: rect.width / 2 - ((minX + maxX) / 2) * zoom,
      y: rect.height / 2 - ((minY + maxY) / 2) * zoom,
    }));
  };

  const resetCanvas = () => {
    if (!confirm("Reset canvas to default layout?")) return;
    localStorage.removeItem(LS_KEY);
    setData(defaultData as CanvasData);
    setSelectedId(null);
  };

  // ── Screen-space position of selected element (for mini toolbar) ──
  const selectedEl = elements.find((e) => e.id === selectedId);
  const selectedScreenX = selectedEl
    ? selectedEl.x * viewport.zoom + viewport.x + (selectedEl.width * viewport.zoom) / 2
    : 0;
  const selectedScreenY = selectedEl ? selectedEl.y * viewport.zoom + viewport.y : 0;

  // ── Dot grid background ──
  const dotSpacing = Math.max(16, 32 * viewport.zoom);
  const bgX = ((viewport.x % dotSpacing) + dotSpacing) % dotSpacing;
  const bgY = ((viewport.y % dotSpacing) + dotSpacing) % dotSpacing;

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 117px)" }}>
      {/* Canvas container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden bg-[#020617] select-none"
        style={{
          cursor: panInfo.current ? "grabbing" : "grab",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.065) 1px, transparent 1px)",
          backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
          backgroundPosition: `${bgX}px ${bgY}px`,
        }}
        onMouseDown={handleBgMouseDown}
      >
        {/* Vignette edges */}
        <div className="absolute inset-0 pointer-events-none z-[3]"
          style={{ boxShadow: "inset 0 0 140px rgba(2,6,23,0.8)" }} />

        {/* Canvas world */}
        <div
          style={{
            position: "absolute",
            transformOrigin: "0 0",
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            willChange: "transform",
          }}
        >
          {elements.map((el) => {
            const isSelected = selectedId === el.id;
            return (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  zIndex: isSelected ? 1000 : (el.zIndex ?? 1),
                  cursor: isEditMode ? (dragInfo.current?.id === el.id ? "grabbing" : "grab") : "default",
                }}
                onMouseDown={(e) => handleElementMouseDown(e, el)}
              >
                {/* Selection ring */}
                {isSelected && (
                  <div
                    className="absolute pointer-events-none rounded-2xl"
                    style={{
                      inset: -6,
                      border: "2px solid rgba(59,130,246,0.7)",
                      boxShadow: "0 0 20px rgba(59,130,246,0.25)",
                      borderRadius: 20,
                    }}
                  />
                )}
                {renderElement(el)}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mini toolbar above selected element (fixed) ── */}
      <AnimatePresence>
        {isEditMode && selectedEl && (
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[1001] pointer-events-auto"
            style={{
              left: selectedScreenX,
              top: selectedScreenY - 52,
              transform: "translateX(-50%)",
            }}
          >
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 shadow-2xl">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider px-1 font-medium">
                {selectedEl.type}
              </span>
              <div className="w-px h-4 bg-slate-700" />
              <button
                onClick={() => setModal({ type: selectedEl.type, element: selectedEl })}
                className="flex items-center gap-1 px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs transition-colors"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={() => deleteElement(selectedEl.id)}
                className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg text-xs transition-colors"
              >
                <Trash2 size={12} /> Delete
              </button>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-1 px-2 text-slate-600 text-[10px]">
                <Move size={10} /> Drag to move
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add toolbar (bottom center, edit mode only) ── */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className="flex items-center gap-2 bg-slate-900/95 border border-slate-700 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-sm">
              <span className="text-xs text-slate-500 font-medium pr-1">Add:</span>
              {(
                [
                  { type: "heading" as ElementType, icon: Heading1, label: "Heading" },
                  { type: "text"    as ElementType, icon: Type,     label: "Text" },
                  { type: "story"   as ElementType, icon: BookOpen,  label: "Story" },
                  { type: "project" as ElementType, icon: Layers,    label: "Project" },
                  { type: "link"    as ElementType, icon: Link2,     label: "Link" },
                ] as const
              ).map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => addElement(type)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all"
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
              <div className="w-px h-5 bg-slate-700 mx-1" />
              <button
                onClick={() => setShowJsonEditor(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-all border border-slate-600/40"
                title="Edit raw JSON"
              >
                <Code2 size={13} /> JSON
              </button>
              <button
                onClick={resetCanvas}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-400 rounded-xl text-xs font-medium transition-all"
                title="Reset to default layout"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Zoom / nav controls (always visible) ── */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        <button
          onClick={() => updateViewport((v) => ({ ...v, zoom: Math.min(4, v.zoom * 1.2) }))}
          className="w-9 h-9 bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm"
        >
          <ZoomIn size={15} />
        </button>
        <div className="w-9 h-8 bg-slate-900/90 border border-slate-700 text-slate-500 rounded-xl flex items-center justify-center text-[10px] font-mono shadow-lg backdrop-blur-sm">
          {Math.round(viewport.zoom * 100)}%
        </div>
        <button
          onClick={() => updateViewport((v) => ({ ...v, zoom: Math.max(0.1, v.zoom / 1.2) }))}
          className="w-9 h-9 bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm"
        >
          <ZoomOut size={15} />
        </button>
        <button
          onClick={fitToView}
          title="Fit all to view"
          className="w-9 h-9 bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* ── Hint (non-edit mode) ── */}
      {!isEditMode && (
        <div className="fixed bottom-6 left-6 z-[100] text-[11px] text-slate-600 pointer-events-none select-none">
          Scroll to zoom · Drag to pan
        </div>
      )}

      {/* ── Edit modal ── */}
      <AnimatePresence>
        {modal && (
          <EditModal
            type={modal.type}
            element={modal.element}
            onSave={handleNewElementSave}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>

      {/* ── JSON editor ── */}
      {showJsonEditor && (
        <JsonEditModal
          data={data}
          label="Spatial Canvas"
          onSave={(parsed) => {
            const next = parsed as CanvasData;
            setData(next);
            saveData(next);
            setShowJsonEditor(false);
          }}
          onClose={() => setShowJsonEditor(false)}
        />
      )}
    </div>
  );
}
