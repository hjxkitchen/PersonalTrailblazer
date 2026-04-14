import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, ExternalLink, Github, Globe, ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { ExtendedProject } from "./ExtendedProjectEditModal";

function getGitHubPath(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "github.com") return null;
    const parts = u.pathname.replace(/^\//, "").replace(/\/$/, "").split("/");
    if (parts.length >= 2 && parts[0] && parts[1]) return `${parts[0]}/${parts[1]}`;
  } catch {}
  return null;
}

function getStackBlitzUrl(githubUrl: string): string | null {
  const path = getGitHubPath(githubUrl);
  return path ? `https://stackblitz.com/github/${path}` : null;
}

// ─── App icon gradient ────────────────────────────────────────────────────────
const GRADIENTS: [string, string][] = [
  ["#3b82f6", "#6366f1"],
  ["#8b5cf6", "#ec4899"],
  ["#06b6d4", "#10b981"],
  ["#f59e0b", "#ef4444"],
  ["#6366f1", "#a78bfa"],
  ["#10b981", "#3b82f6"],
  ["#f97316", "#ef4444"],
  ["#14b8a6", "#6366f1"],
  ["#e879f9", "#8b5cf6"],
  ["#22c55e", "#06b6d4"],
];

function getGradient(name: string): [string, string] {
  const hash = Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
}

function AppIcon({ name, size = 100 }: { name: string; size?: number }) {
  const [from, to] = getGradient(name);
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center shadow-2xl"
      style={{
        width: size,
        height: size,
        borderRadius: "22%",
        background: `linear-gradient(145deg, ${from}, ${to})`,
        boxShadow: `0 8px 32px ${from}55`,
      }}
    >
      <span
        className="font-bold text-white select-none tracking-tight"
        style={{ fontSize: size * 0.42 }}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

// ─── Media helpers ────────────────────────────────────────────────────────────
function isVideoUrl(url: string) {
  return (
    url.startsWith("data:video") ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) ||
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com")
  );
}

function getYouTubeEmbed(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^"&?/\s]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=0&rel=0` : null;
}

function getVimeoId(url: string) {
  return url.match(/vimeo\.com\/(\d+)/)?.[1] ?? null;
}

function MediaSlide({ url }: { url: string }) {
  const yt = (url.includes("youtube.com") || url.includes("youtu.be")) ? getYouTubeEmbed(url) : null;
  const vi = url.includes("vimeo.com") ? getVimeoId(url) : null;
  if (yt) return <iframe src={yt} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" title="YouTube" />;
  if (vi) return <iframe src={`https://player.vimeo.com/video/${vi}`} allowFullScreen className="w-full h-full" title="Vimeo" />;
  if (isVideoUrl(url)) return <video src={url} controls className="w-full h-full object-contain bg-black" />;
  return <img src={url} alt="" className="w-full h-full object-cover" />;
}

// ─── Screenshot strip ─────────────────────────────────────────────────────────
function ScreenshotStrip({ media }: { media: string[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollTo = (i: number) => {
    setActive(i);
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  if (media.length === 0) return null;

  return (
    <div>
      {/* Strip */}
      <div
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pl-6"
        style={{ scrollbarWidth: "none" }}
      >
        {media.map((url, i) => (
          <div
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            onClick={() => scrollTo(i)}
            className={`flex-shrink-0 rounded-2xl overflow-hidden snap-start cursor-pointer transition-all duration-200 ${
              active === i
                ? "ring-2 ring-blue-500 shadow-xl shadow-blue-500/20"
                : "ring-1 ring-white/8 opacity-80 hover:opacity-100"
            }`}
            style={{ width: 272 }}
          >
            <div className="aspect-video bg-slate-950">
              <MediaSlide url={url} />
            </div>
          </div>
        ))}
        <div className="flex-shrink-0 w-2" />
      </div>

      {/* Dot indicators */}
      {media.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active ? "w-5 h-1.5 bg-blue-500" : "w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Hero carousel (for large single view) ───────────────────────────────────
function HeroCarousel({ media }: { media: string[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + media.length) % media.length);
  const next = () => setIdx((i) => (i + 1) % media.length);

  return (
    <div className="relative w-full aspect-video bg-black">
      <MediaSlide url={media[idx]} />
      {media.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors">
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {media.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`rounded-full transition-all ${i === idx ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-5">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-4">{title}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-800/80 mx-6" />;
}

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800/60 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:text-blue-300 font-medium text-right max-w-[220px] truncate flex items-center gap-1"
        >
          {value} <ExternalLink size={11} />
        </a>
      ) : (
        <span className="text-sm text-slate-300 font-medium">{value}</span>
      )}
    </div>
  );
}

function isSourceUrl(url: string): boolean {
  return url.includes("lovable.dev") || url.includes("replit.com");
}

// ─── Main modal ───────────────────────────────────────────────────────────────
interface Props {
  project: ExtendedProject;
  onClose: () => void;
  isEditMode?: boolean;
  showGitHub?: boolean;
}

export default function AppDetailModal({ project, onClose, isEditMode = false, showGitHub = false }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hasMedia = (project.media?.length ?? 0) > 0;
  const hasTech = (project.technologies?.length ?? 0) > 0;

  const isUrlGitHub = project.url ? !!getGitHubPath(project.url) : false;

  // Hide lovable/replit URLs in non-edit mode
  const effectiveUrl = project.url && (!isSourceUrl(project.url) || isEditMode) ? project.url : null;

  const urlHost = effectiveUrl && !isUrlGitHub
    ? (() => { try { return new URL(effectiveUrl).hostname; } catch { return effectiveUrl; } })()
    : null;

  // Prefer explicit github field; fall back to url if it's a GitHub URL
  const resolvedGithub = project.github || (isUrlGitHub ? effectiveUrl : null);
  const githubPath = resolvedGithub
    ? (() => { try { const u = new URL(resolvedGithub); return u.pathname.replace(/^\//, "").replace(/\/$/, "") || u.hostname; } catch { return resolvedGithub; } })()
    : null;

  const [from, to] = getGradient(project.name);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overflow-hidden"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 48 }}
        transition={{ type: "spring", bounce: 0.12, duration: 0.5 }}
        className="relative w-full sm:max-w-xl flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
        style={{
          background: "#0d0f14",
          maxHeight: "92vh",
          boxShadow: "0 32px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pull handle (mobile) */}
        <div className="flex-shrink-0 flex justify-center pt-2.5 pb-1 sm:hidden">
          <div className="w-8 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: "none" }}>

          {/* Hero / media banner (if has media) */}
          {hasMedia && (
            <div className="relative">
              <HeroCarousel media={project.media!} />
              {/* Gradient overlay so icon blends in */}
              <div
                className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                style={{ background: "linear-gradient(to top, #0d0f14, transparent)" }}
              />
            </div>
          )}

          {/* App header card */}
          <div className={`px-6 ${hasMedia ? "pt-4" : "pt-8"} pb-6`}>
            <div className="flex items-start gap-4">
              {/* Icon — overlaps hero if media present */}
              <AppIcon name={project.name} size={84} />

              <div className="flex-1 min-w-0 pt-0.5">
                <h1 className="text-xl font-bold text-white leading-tight tracking-tight">
                  {project.name}
                </h1>
                <p className="text-[13px] text-blue-400 font-medium mt-0.5">John Xen</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  {project.subgroup && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
                      style={{
                        background: `linear-gradient(135deg, ${from}18, ${to}18)`,
                        color: "#94a3b8",
                        border: `1px solid ${from}33`,
                      }}
                    >
                      {project.subgroup}
                    </span>
                  )}
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
                    style={{
                      background: `linear-gradient(135deg, ${from}22, ${to}22)`,
                      color: from,
                      border: `1px solid ${from}44`,
                    }}
                  >
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-500 hover:text-white rounded-full transition-colors mt-0.5"
              >
                <X size={15} />
              </button>
            </div>

            {/* Tagline */}
            <p className="text-slate-400 text-sm leading-relaxed mt-4">
              {project.description}
            </p>

            {/* Action buttons */}
            <div className="flex gap-2.5 mt-5">
              {(() => {
                const explicitType = project.demoType;
                const isGitHub = effectiveUrl ? !!getGitHubPath(effectiveUrl) : false;
                const stackBlitzUrl = effectiveUrl ? getStackBlitzUrl(effectiveUrl) : null;
                const githubUrl = project.github || (isGitHub ? effectiveUrl : null);

                // Tier 3 — E2B sandbox (categorized, not yet implemented)
                if (explicitType === "e2b") {
                  return (
                    <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-slate-500 bg-slate-800/60 border border-slate-700/60 cursor-not-allowed select-none">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">Soon</span>
                      Python / Backend Sandbox
                    </div>
                  );
                }

                // Tier 4 — video/screenshots only
                if (explicitType === "video") {
                  return (githubUrl && showGitHub) ? (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all active:scale-95"
                    >
                      <Github size={15} />
                      View on GitHub
                    </a>
                  ) : null;
                }

                if (stackBlitzUrl) {
                  // GitHub URL → offer StackBlitz demo + code link
                  return (
                    <>
                      <a
                        href={stackBlitzUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
                        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                      >
                        <Play size={15} />
                        Run Demo
                      </a>
                      {showGitHub && (
                        <a
                          href={effectiveUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all active:scale-95"
                        >
                          <Github size={15} />
                          Code
                        </a>
                      )}
                    </>
                  );
                }

                // Live URL
                return (
                  <>
                    {effectiveUrl && (isEditMode || showGitHub) && (
                      <a
                        href={effectiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
                        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                      >
                        <Globe size={15} />
                        Visit Project
                      </a>
                    )}
                    {githubUrl && showGitHub && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all active:scale-95 ${effectiveUrl ? "px-5" : "flex-1"}`}
                      >
                        <Github size={15} />
                        {effectiveUrl ? "GitHub" : "View on GitHub"}
                      </a>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Screenshot strip */}
          {hasMedia && project.media!.length > 1 && (
            <>
              <Divider />
              <div className="py-5">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-4 px-6">Screenshots</p>
                <ScreenshotStrip media={project.media!} />
              </div>
            </>
          )}

          {/* About */}
          {(project.longDescription || project.description) && (
            <>
              <Divider />
              <Section title="About">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {project.longDescription || project.description}
                </p>
              </Section>
            </>
          )}

          {/* Built with */}
          {hasTech && (
            <>
              <Divider />
              <Section title="Built With">
                <div className="flex flex-wrap gap-2">
                  {project.technologies!.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border"
                      style={{
                        background: `linear-gradient(135deg, ${from}15, ${to}10)`,
                        color: "#cbd5e1",
                        borderColor: `${from}30`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* Information */}
          <Divider />
          <div className="px-6 pt-5 pb-10">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Information</p>
            <InfoRow label="Category" value={project.category} />
            {project.subgroup && <InfoRow label="Subgroup" value={project.subgroup} />}
            {urlHost && (isEditMode || showGitHub) && <InfoRow label="Website" value={urlHost} href={effectiveUrl!} />}
            {githubPath && showGitHub && <InfoRow label="GitHub" value={githubPath} href={resolvedGithub!} />}
            <InfoRow label="Developer" value="John Xen" />
          </div>

        </div>
      </motion.div>
    </div>
  );
}
