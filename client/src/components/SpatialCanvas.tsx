import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type, Heading1, BookOpen, Layers, Link2, Trash2, Pencil,
  RotateCcw, ZoomIn, ZoomOut, Maximize2, ExternalLink, X, Move,
  Minus, Code2, ArrowRight, Square as SquareIcon,
} from "lucide-react";
import { usePortfolio } from "../lib/stores/usePortfolio";
import defaultData from "../data/spatialCanvasData.json";
import JsonEditModal from "./JsonEditModal";

// ─── Types ────────────────────────────────────────────────────────────────────

type FontSize = "sm" | "md" | "lg" | "xl";
type Align = "left" | "center" | "right";
type ElementType = "heading" | "text" | "story" | "project" | "link" | "line" | "arrow" | "square";

export interface SpatialElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height?: number;
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
  // line / arrow
  strokeColor?: string;
  flipY?: boolean;
  // square
  fillColor?: string;
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
  { label: "Red",    value: "#ef4444" },
  { label: "Slate",  value: "#64748b" },
  { label: "White",  value: "#f1f5f9" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns explicit height for shape elements; undefined = auto (content) */
function getElHeight(el: SpatialElement): number | undefined {
  if (el.type === "line" || el.type === "arrow") return Math.max(el.height ?? 2, 24);
  if (el.type === "square") return el.height ?? el.width;
  return undefined;
}

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
    <p className={`${FONT_SIZES[fs]} ${ALIGN_CLASSES[align]} text-slate-300 leading-relaxed select-none`}>
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
      {el.body && <p className="text-slate-300 text-sm leading-relaxed">{el.body}</p>}
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

function LineEl({ el }: { el: SpatialElement }) {
  const stroke = el.strokeColor ?? "#94a3b8";
  const flipY = el.flipY ?? false;
  const h = el.height ?? 2;
  const divH = Math.max(h, 24);
  const isFlat = h <= 2;
  const y1 = isFlat ? divH / 2 : flipY ? divH - 1 : 1;
  const y2 = isFlat ? divH / 2 : flipY ? 1 : divH - 1;
  return (
    <svg width={el.width} height={divH} style={{ display: "block" }}>
      <line x1={1} y1={y1} x2={el.width - 1} y2={y2} stroke={stroke} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function ArrowEl({ el }: { el: SpatialElement }) {
  const stroke = el.strokeColor ?? "#94a3b8";
  const flipY = el.flipY ?? false;
  const h = el.height ?? 2;
  const divH = Math.max(h, 24);
  const isFlat = h <= 2;
  const y1 = isFlat ? divH / 2 : flipY ? divH - 1 : 1;
  const y2 = isFlat ? divH / 2 : flipY ? 1 : divH - 1;
  const markerId = `arrow-head-${el.id}`;
  return (
    <svg width={el.width} height={divH} style={{ display: "block" }}>
      <defs>
        <marker id={markerId} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={stroke} />
        </marker>
      </defs>
      <line
        x1={1} y1={y1} x2={el.width - 10} y2={y2}
        stroke={stroke} strokeWidth={2} strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
}

function SquareEl({ el }: { el: SpatialElement }) {
  const fill = el.fillColor ?? "#3b82f6";
  const stroke = el.strokeColor;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: fill,
        borderRadius: 8,
        border: stroke ? `2px solid ${stroke}` : "none",
        opacity: 0.9,
      }}
    />
  );
}

function renderElement(el: SpatialElement) {
  switch (el.type) {
    case "heading": return <HeadingEl el={el} />;
    case "text":    return <TextEl el={el} />;
    case "story":   return <StoryEl el={el} />;
    case "project": return <ProjectEl el={el} />;
    case "link":    return <LinkEl el={el} />;
    case "line":    return <LineEl el={el} />;
    case "arrow":   return <ArrowEl el={el} />;
    case "square":  return <SquareEl el={el} />;
  }
}

// ─── Color swatch picker ──────────────────────────────────────────────────────

function ColorPicker({
  value,
  onChange,
  allowNone,
}: {
  value?: string;
  onChange: (v: string | undefined) => void;
  allowNone?: boolean;
}) {
  return (
    <div className="flex gap-2 flex-wrap items-center">
      {allowNone && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={`px-3 py-1 rounded-lg text-xs border transition-colors ${
            !value ? "border-white text-white bg-slate-700" : "border-slate-600 text-slate-400 bg-slate-800"
          }`}
        >
          None
        </button>
      )}
      {ACCENT_PRESETS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          title={p.label}
          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
            value === p.value ? "border-white scale-110" : "border-transparent"
          }`}
          style={{ background: p.value }}
        />
      ))}
    </div>
  );
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
    element ?? { id: `el-${Date.now()}`, type, x: 0, y: 0, width: 360, zIndex: 1 }
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
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
                  <select value={form.fontSize ?? "md"} onChange={(e) => set("fontSize", e.target.value as FontSize)} className={inputCls}>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="xl">XL</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Alignment</label>
                  <select value={form.align ?? "left"} onChange={(e) => set("align", e.target.value as Align)} className={inputCls}>
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
                <input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="Section title" />
              </div>
              <div>
                <label className={labelCls}>Body</label>
                <textarea value={form.body ?? ""} onChange={(e) => set("body", e.target.value)} rows={4} className={`${inputCls} resize-none`} placeholder="Story content..." />
              </div>
              <div>
                <label className={labelCls}>Accent color</label>
                <ColorPicker value={form.accent} onChange={(v) => set("accent", v)} />
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
                <textarea value={form.projectDesc ?? ""} onChange={(e) => set("projectDesc", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
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

          {/* Line / Arrow */}
          {(type === "line" || type === "arrow") && (
            <>
              <div>
                <label className={labelCls}>Color</label>
                <ColorPicker value={form.strokeColor} onChange={(v) => set("strokeColor", v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Length (px)</label>
                  <input type="number" min={20} max={1200} value={form.width} onChange={(e) => set("width", Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Height / Angle (px)</label>
                  <input type="number" min={0} max={800} value={form.height ?? 0} onChange={(e) => set("height", Number(e.target.value))} className={inputCls} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="flipY-cb"
                  checked={form.flipY ?? false}
                  onChange={(e) => set("flipY", e.target.checked)}
                  className="w-4 h-4 accent-blue-500"
                />
                <label htmlFor="flipY-cb" className="text-sm text-slate-300 cursor-pointer">
                  Flip direction (↗ instead of ↘)
                </label>
              </div>
            </>
          )}

          {/* Square */}
          {type === "square" && (
            <>
              <div>
                <label className={labelCls}>Fill color</label>
                <ColorPicker value={form.fillColor} onChange={(v) => set("fillColor", v)} />
              </div>
              <div>
                <label className={labelCls}>Border color</label>
                <ColorPicker value={form.strokeColor} onChange={(v) => set("strokeColor", v)} allowNone />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Width (px)</label>
                  <input type="number" min={20} max={900} value={form.width} onChange={(e) => set("width", Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Height (px)</label>
                  <input type="number" min={20} max={900} value={form.height ?? form.width} onChange={(e) => set("height", Number(e.target.value))} className={inputCls} />
                </div>
              </div>
            </>
          )}

          {/* Width — only for content-based types */}
          {type !== "line" && type !== "arrow" && type !== "square" && (
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
          )}

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

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [primarySelectedId, setPrimarySelectedId] = useState<string | null>(null);

  const [modal, setModal] = useState<{ type: ElementType; element?: SpatialElement } | null>(null);
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  // Refs for stable event-handler access
  const viewportRef = useRef(viewport);
  useEffect(() => { viewportRef.current = viewport; }, [viewport]);

  const isEditRef = useRef(isEditMode);
  useEffect(() => { isEditRef.current = isEditMode; }, [isEditMode]);

  const selectedIdsRef = useRef<Set<string>>(selectedIds);
  useEffect(() => { selectedIdsRef.current = selectedIds; }, [selectedIds]);

  const elementsRef = useRef(elements);
  useEffect(() => { elementsRef.current = elements; }, [elements]);

  // Pan state
  const panInfo = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  // Element drag state — tracks original positions of ALL selected elements
  const dragInfo = useRef<{
    startX: number;
    startY: number;
    origPositions: Record<string, { x: number; y: number }>;
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

  // ── Wheel zoom ──
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
      if (panInfo.current) {
        const dx = e.clientX - panInfo.current.startX;
        const dy = e.clientY - panInfo.current.startY;
        updateViewport(() => ({
          ...viewportRef.current,
          x: panInfo.current!.origX + dx,
          y: panInfo.current!.origY + dy,
        }));
      }
      if (dragInfo.current && isEditRef.current) {
        const vp = viewportRef.current;
        const dx = (e.clientX - dragInfo.current.startX) / vp.zoom;
        const dy = (e.clientY - dragInfo.current.startY) / vp.zoom;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          dragInfo.current.moved = true;
          const origPositions = dragInfo.current.origPositions;
          setData((d) => ({
            ...d,
            elements: d.elements.map((el) => {
              const orig = origPositions[el.id];
              if (orig) return { ...el, x: orig.x + dx, y: orig.y + dy };
              return el;
            }),
          }));
        }
      }
    };

    const onUp = () => {
      panInfo.current = null;
      if (dragInfo.current) {
        if (dragInfo.current.moved) {
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
      const sIds = selectedIdsRef.current;
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        sIds.size > 0 &&
        (e.target as HTMLElement).tagName !== "INPUT" &&
        (e.target as HTMLElement).tagName !== "TEXTAREA"
      ) {
        const count = sIds.size;
        if (!confirm(count > 1 ? `Remove ${count} elements from the canvas?` : "Remove this element from the canvas?")) return;
        updateElements((els) => els.filter((el) => !sIds.has(el.id)));
        setSelectedIds(new Set());
        setPrimarySelectedId(null);
      }
      if (e.key === "Escape") {
        setSelectedIds(new Set());
        setPrimarySelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [updateElements]);

  // ── Background mouse down → pan + deselect ──
  const handleBgMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setSelectedIds(new Set());
    setPrimarySelectedId(null);
    panInfo.current = { startX: e.clientX, startY: e.clientY, origX: viewport.x, origY: viewport.y };
  };

  // ── Element mouse down → select + drag ──
  const handleElementMouseDown = (e: React.MouseEvent, el: SpatialElement) => {
    e.stopPropagation();

    let newIds: Set<string>;
    if (e.shiftKey) {
      // Toggle this element in selection
      const next = new Set(selectedIdsRef.current);
      if (next.has(el.id)) next.delete(el.id);
      else next.add(el.id);
      newIds = next;
    } else if (selectedIdsRef.current.has(el.id) && selectedIdsRef.current.size > 1) {
      // Clicking inside existing multi-select: keep the group for dragging
      newIds = new Set(selectedIdsRef.current);
    } else {
      // Regular click: select just this element
      newIds = new Set([el.id]);
    }

    setSelectedIds(newIds);
    setPrimarySelectedId(el.id);

    if (isEditMode && newIds.size > 0) {
      const origPositions: Record<string, { x: number; y: number }> = {};
      Array.from(newIds).forEach((id) => {
        const elem = elementsRef.current.find((e) => e.id === id);
        if (elem) origPositions[id] = { x: elem.x, y: elem.y };
      });
      dragInfo.current = { startX: e.clientX, startY: e.clientY, origPositions, moved: false };
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
    setSelectedIds(new Set([el.id]));
    setPrimarySelectedId(el.id);
  };

  const deleteSelected = (ids: Set<string>) => {
    const count = ids.size;
    if (!confirm(count > 1 ? `Remove ${count} elements?` : "Remove this element from the canvas?")) return;
    updateElements((els) => els.filter((e) => !ids.has(e.id)));
    setSelectedIds(new Set());
    setPrimarySelectedId(null);
  };

  const addElement = (type: ElementType) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const cx = rect ? rect.width / 2 : 400;
    const cy = rect ? rect.height / 2 : 300;
    const canvasX = (cx - viewport.x) / viewport.zoom - 180;
    const canvasY = (cy - viewport.y) / viewport.zoom - 80;

    const widthDefaults: Partial<Record<ElementType, number>> = {
      link: 240, heading: 500, line: 200, arrow: 200, square: 200,
    };
    const heightDefaults: Partial<Record<ElementType, number>> = {
      line: 0, arrow: 0, square: 200,
    };

    const base: SpatialElement = {
      id: `el-${Date.now()}`,
      type,
      x: canvasX,
      y: canvasY,
      width: widthDefaults[type] ?? 380,
      height: heightDefaults[type],
      zIndex: elements.length + 1,
      strokeColor: (type === "line" || type === "arrow") ? "#94a3b8" : undefined,
      fillColor: type === "square" ? "#3b82f6" : undefined,
    };
    setModal({ type, element: { ...base } });
  };

  // ── Fit all to view ──
  const fitToView = () => {
    if (elements.length === 0) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const minX = Math.min(...elements.map((e) => e.x));
    const maxX = Math.max(...elements.map((e) => e.x + e.width));
    const minY = Math.min(...elements.map((e) => e.y));
    const maxY = Math.max(...elements.map((e) => e.y + (e.height ?? 200)));
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
    setSelectedIds(new Set());
    setPrimarySelectedId(null);
  };

  // ── Toolbar positioning ──
  const primaryEl = primarySelectedId
    ? elements.find((e) => e.id === primarySelectedId && selectedIds.has(e.id))
    : null;

  const containerRect = containerRef.current?.getBoundingClientRect();
  const containerLeft = containerRect?.left ?? 0;
  const containerTop  = containerRect?.top  ?? 0;

  const toolbarScreenX = primaryEl
    ? primaryEl.x * viewport.zoom + viewport.x + (primaryEl.width * viewport.zoom) / 2 + containerLeft
    : 0;
  const toolbarScreenY = primaryEl
    ? primaryEl.y * viewport.zoom + viewport.y + containerTop
    : 0;

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
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none z-[3]" style={{ boxShadow: "inset 0 0 140px rgba(2,6,23,0.8)" }} />

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
            const isSelected = selectedIds.has(el.id);
            const elH = getElHeight(el);
            return (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: elH,
                  zIndex: isSelected ? 1000 : (el.zIndex ?? 1),
                  cursor: isEditMode ? "grab" : "default",
                }}
                onMouseDown={(e) => handleElementMouseDown(e, el)}
              >
                {isSelected && (
                  <div
                    className="absolute pointer-events-none"
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

      {/* ── Mini toolbar above selected element ── */}
      <AnimatePresence>
        {isEditMode && primaryEl && (
          <motion.div
            key={primarySelectedId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[1001] pointer-events-auto"
            style={{ left: toolbarScreenX, top: toolbarScreenY - 52, transform: "translateX(-50%)" }}
          >
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 shadow-2xl">
              {selectedIds.size > 1 ? (
                <span className="text-[10px] text-blue-400 uppercase tracking-wider px-1 font-medium">
                  {selectedIds.size} selected
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 uppercase tracking-wider px-1 font-medium">
                  {primaryEl.type}
                </span>
              )}
              <div className="w-px h-4 bg-slate-700" />
              {selectedIds.size === 1 && (
                <button
                  onClick={() => setModal({ type: primaryEl.type, element: primaryEl })}
                  className="flex items-center gap-1 px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
              <button
                onClick={() => deleteSelected(selectedIds)}
                className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg text-xs transition-colors"
              >
                <Trash2 size={12} /> {selectedIds.size > 1 ? `Delete ${selectedIds.size}` : "Delete"}
              </button>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-1 px-2 text-slate-600 text-[10px]">
                <Move size={10} /> Drag to move
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add toolbar ── */}
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
              {/* Shape tools */}
              <button
                onClick={() => addElement("line")}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all"
                title="Add line"
              >
                <Minus size={13} /> Line
              </button>
              <button
                onClick={() => addElement("arrow")}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all"
                title="Add arrow"
              >
                <ArrowRight size={13} /> Arrow
              </button>
              <button
                onClick={() => addElement("square")}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all"
                title="Add square"
              >
                <SquareIcon size={13} /> Square
              </button>
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

      {/* ── Zoom controls ── */}
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

      {/* ── Hint ── */}
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
            onSave={saveElement}
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
