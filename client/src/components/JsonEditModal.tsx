import { useState, useRef, useEffect } from "react";
import { X, Copy, Check, AlertTriangle } from "lucide-react";

interface JsonEditModalProps {
  /** The data object to edit */
  data: unknown;
  /** Label shown in the title, e.g. "Portfolio Projects" */
  label: string;
  onSave: (parsed: unknown) => void;
  onClose: () => void;
}

export default function JsonEditModal({ data, label, onSave, onClose }: JsonEditModalProps) {
  const [text, setText] = useState(() => JSON.stringify(data, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea on open
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(text);
      setError(null);
      onSave(parsed);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Ctrl/Cmd+S to save
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col"
        style={{ width: "min(860px, 96vw)", height: "min(680px, 92vh)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <h2 className="text-sm font-semibold text-slate-300">
              Edit JSON — <span className="text-white">{label}</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs transition-colors"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="flex-1 overflow-hidden relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="w-full h-full resize-none bg-[#0d1117] text-[#e6edf3] font-mono text-sm leading-relaxed px-5 py-4 outline-none border-0 focus:ring-0"
            style={{ fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", "Consolas", monospace' }}
          />
        </div>

        {/* Error bar */}
        {error && (
          <div className="flex items-start gap-2 px-5 py-3 bg-red-950/50 border-t border-red-800/40 text-red-300 text-xs font-mono shrink-0">
            <AlertTriangle size={13} className="shrink-0 mt-0.5 text-red-400" />
            <span className="break-all">{error}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-700/70 shrink-0">
          <span className="text-xs text-slate-600 select-none">
            {text.split("\n").length} lines · Ctrl+S to save
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Save JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
