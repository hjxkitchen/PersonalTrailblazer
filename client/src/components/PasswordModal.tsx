import { useState } from "react";
import { X, Lock } from "lucide-react";

// Change this to your desired edit password
const EDIT_PASSWORD = "portfolio2025";

interface PasswordModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function PasswordModal({ onSuccess, onClose }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === EDIT_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setPassword("");
    }
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Lock size={20} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Edit Mode</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoFocus
              placeholder="Enter edit password"
              className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 transition-all ${
                error
                  ? "border-red-500 focus:ring-red-500/30"
                  : "border-slate-700 focus:ring-blue-500/30 focus:border-blue-500"
              }`}
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">Incorrect password. Try again.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Unlock Editing
          </button>
        </form>
      </div>
    </div>
  );
}
