import { useState, useRef } from "react";
import { X, Upload, Link, Trash2, GripVertical, Image as ImageIcon, Film } from "lucide-react";

export type DemoType = "live" | "stackblitz" | "e2b" | "video" | "none";

export interface ExtendedProject {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  technologies?: string[];
  url: string;
  github?: string;
  category: string;
  /** Section within the top-level category (e.g. Core Agents, Voice AI). */
  subgroup?: string;
  media?: string[];
  visible?: boolean; // undefined/true = visible; false = hidden
  /** How this project should be demoed. Auto-detected when absent. */
  demoType?: DemoType;
}

interface Props {
  project?: ExtendedProject;
  categories: string[];
  onSave: (project: ExtendedProject) => void;
  onClose: () => void;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
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

function isVideoUrl(url: string) {
  return (
    url.startsWith("data:video") ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) ||
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com")
  );
}

function MediaThumb({ url }: { url: string }) {
  if (isVideoUrl(url)) {
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^"&?/\s]{11})/);
    if (ytMatch) {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          <img
            src={`https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Film size={20} className="text-white drop-shadow-lg" />
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
        <Film size={20} className="text-slate-400" />
      </div>
    );
  }
  return <img src={url} alt="" className="w-full h-full object-cover" />;
}

export default function ExtendedProjectEditModal({ project, categories, onSave, onClose }: Props) {
  const isNew = !project;
  const [form, setForm] = useState<ExtendedProject>(
    project ?? {
      id: "",
      name: "",
      description: "",
      longDescription: "",
      technologies: [],
      url: "",
      github: "",
      category: categories[0] ?? "",
      media: [],
      visible: true,
    }
  );
  const [techInput, setTechInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaDragFrom = useRef<number | null>(null);
  const mediaDragTo = useRef<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.id || slugify(form.name) || `project-${Date.now()}`;
    onSave({ ...form, id });
  };

  const addFiles = async (files: FileList | File[]) => {
    setUploading(true);
    const results: string[] = [];
    for (const file of Array.from(files)) {
      try {
        if (file.type.startsWith("image/")) {
          results.push(await processImageFile(file));
        } else if (file.type.startsWith("video/")) {
          await new Promise<void>((res, rej) => {
            const reader = new FileReader();
            reader.onload = (e) => { results.push(e.target!.result as string); res(); };
            reader.onerror = rej;
            reader.readAsDataURL(file);
          });
        }
      } catch {
        console.warn("Failed to process file", file.name);
      }
    }
    if (results.length) {
      setForm((f) => ({ ...f, media: [...(f.media ?? []), ...results] }));
    }
    setUploading(false);
  };

  const addUrlMedia = () => {
    const u = urlInput.trim();
    if (!u) return;
    setForm((f) => ({ ...f, media: [...(f.media ?? []), u] }));
    setUrlInput("");
  };

  const removeMedia = (idx: number) => {
    setForm((f) => ({ ...f, media: (f.media ?? []).filter((_, i) => i !== idx) }));
  };

  const reorderMedia = () => {
    const from = mediaDragFrom.current;
    const to = mediaDragTo.current;
    if (from === null || to === null || from === to) return;
    const arr = [...(form.media ?? [])];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setForm((f) => ({ ...f, media: arr }));
    mediaDragFrom.current = null;
    mediaDragTo.current = null;
  };

  const addTech = () => {
    const t = techInput.trim();
    if (!t) return;
    setForm((f) => ({ ...f, technologies: [...(f.technologies ?? []), t] }));
    setTechInput("");
  };

  const removeTech = (idx: number) => {
    setForm((f) => ({ ...f, technologies: (f.technologies ?? []).filter((_, i) => i !== idx) }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">
          {isNew ? "Add Project" : "Edit Project"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Short description */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Short Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>

          {/* Long description */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Long Description (shown in detail view)</label>
            <textarea
              value={form.longDescription ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))}
              rows={4}
              placeholder="Detailed description, context, challenges solved..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>

          {/* URLs row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">URL</label>
              <input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">GitHub</label>
              <input
                value={form.github ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
                placeholder="https://github.com/..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 text-sm"
            >
              {categories.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Subgroup (optional)</label>
            <input
              value={form.subgroup ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, subgroup: e.target.value || undefined }))}
              placeholder="e.g. Core Agents, Voice AI"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Demo type */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Demo Type</label>
            <select
              value={form.demoType ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, demoType: (e.target.value || undefined) as DemoType | undefined }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Auto-detect</option>
              <option value="live">Live — already deployed</option>
              <option value="stackblitz">StackBlitz — run in browser (JS/Node)</option>
              <option value="e2b">E2B Sandbox — Python / backend (coming soon)</option>
              <option value="video">Video / screenshots only</option>
              <option value="none">None</option>
            </select>
            <p className="text-[11px] text-slate-600 mt-1">Auto-detect picks StackBlitz for GitHub URLs, Live for everything else.</p>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                placeholder="e.g. React, Python..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={addTech}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
              >
                Add
              </button>
            </div>
            {(form.technologies ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {(form.technologies ?? []).map((t, i) => (
                  <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full text-xs border border-slate-700">
                    {t}
                    <button type="button" onClick={() => removeTech(i)} className="text-slate-500 hover:text-red-400 ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Media */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
              Media / Carousel <span className="normal-case text-slate-600">(images & videos shown on the detail page)</span>
            </label>

            {/* Drop zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer mb-3 ${
                isDraggingOver
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/30"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
              />
              {uploading ? (
                <p className="text-sm text-blue-400">Processing files…</p>
              ) : (
                <>
                  <Upload size={24} className="mx-auto text-slate-500 mb-2" />
                  <p className="text-sm text-slate-400">
                    Drag &amp; drop images or videos here, or click to browse
                  </p>
                  <p className="text-xs text-slate-600 mt-1">JPG, PNG, GIF, WEBP, MP4, WEBM</p>
                </>
              )}
            </div>

            {/* URL input */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrlMedia(); } }}
                  placeholder="Or paste a URL (YouTube, image link, etc.)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={addUrlMedia}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
              >
                Add
              </button>
            </div>

            {/* Media grid */}
            {(form.media ?? []).length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {(form.media ?? []).map((url, i) => (
                  <div
                    key={i}
                    className="relative group aspect-video rounded-lg overflow-hidden bg-slate-800 border border-slate-700 cursor-grab"
                    draggable
                    onDragStart={() => { mediaDragFrom.current = i; }}
                    onDragOver={(e) => { e.preventDefault(); mediaDragTo.current = i; }}
                    onDrop={reorderMedia}
                  >
                    <MediaThumb url={url} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={10} />
                    </button>
                    <div className="absolute bottom-1 left-1 p-0.5 text-slate-300 opacity-0 group-hover:opacity-70">
                      <GripVertical size={12} />
                    </div>
                    <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-70">
                      {isVideoUrl(url) ? <Film size={10} className="text-slate-300" /> : <ImageIcon size={10} className="text-slate-300" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Visible on site</p>
              <p className="text-xs text-slate-500 mt-0.5">Hidden projects only appear in edit mode</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, visible: f.visible === false ? true : false }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.visible !== false ? "bg-blue-600" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  form.visible !== false ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {isNew ? "Add Project" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
