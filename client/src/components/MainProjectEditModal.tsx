import { useState } from "react";
import { X, Plus } from "lucide-react";

export interface MainProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: string;
  link?: string;
}

const STATUS_OPTIONS = ["Active", "In Development", "Concept / MVP", "Concept / In Development", "Completed"];

interface Props {
  project?: MainProject;
  onSave: (project: MainProject) => void;
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

export default function MainProjectEditModal({ project, onSave, onClose }: Props) {
  const isNew = !project;
  const [form, setForm] = useState<MainProject>(
    project ?? { id: "", title: "", description: "", technologies: [], status: "In Development", link: "" }
  );
  const [techInput, setTechInput] = useState("");

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      setForm((f) => ({ ...f, technologies: [...f.technologies, t] }));
    }
    setTechInput("");
  };

  const removeTech = (tech: string) => {
    setForm((f) => ({ ...f, technologies: f.technologies.filter((t) => t !== tech) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.id || slugify(form.title) || `project-${Date.now()}`;
    onSave({ ...form, id, link: form.link || undefined });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Link (optional)</label>
            <input
              value={form.link ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              placeholder="example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                placeholder="Add a technology..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={addTech}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.technologies.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-200 border border-slate-700"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="ml-1 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
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
