import { useState } from "react";
import { X } from "lucide-react";

export interface ExtendedProject {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
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

export default function ExtendedProjectEditModal({ project, categories, onSave, onClose }: Props) {
  const isNew = !project;
  const [form, setForm] = useState<ExtendedProject>(
    project ?? { id: "", name: "", description: "", url: "", category: categories[0] ?? "" }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.id || slugify(form.name) || `project-${Date.now()}`;
    onSave({ ...form, id });
  };

  const field = (key: keyof ExtendedProject) => (
    <input
      value={form[key]}
      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
    />
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
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
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Name</label>
            {field("name")}
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
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">URL</label>
            {field("url")}
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
            >
              {categories.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
