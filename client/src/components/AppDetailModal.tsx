import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import type { ExtendedProject } from "./ExtendedProjectEditModal";

function isVideoUrl(url: string) {
  return (
    url.startsWith("data:video") ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) ||
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com")
  );
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^"&?/\s]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0` : null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function MediaSlide({ url }: { url: string }) {
  const ytEmbed = (url.includes("youtube.com") || url.includes("youtu.be"))
    ? getYouTubeEmbedUrl(url)
    : null;
  const vimeoId = url.includes("vimeo.com") ? getVimeoId(url) : null;

  if (ytEmbed) {
    return (
      <iframe
        src={ytEmbed}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        title="YouTube video"
      />
    );
  }
  if (vimeoId) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}`}
        allowFullScreen
        className="w-full h-full"
        title="Vimeo video"
      />
    );
  }
  if (isVideoUrl(url)) {
    return <video src={url} controls className="w-full h-full object-contain" />;
  }
  return <img src={url} alt="" className="w-full h-full object-contain" />;
}

function MediaCarousel({ media }: { media: string[] }) {
  const [idx, setIdx] = useState(0);

  if (!media || media.length === 0) return null;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + media.length) % media.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % media.length);
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0"
        >
          <MediaSlide url={media[idx]} />
        </motion.div>
      </AnimatePresence>

      {media.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {media.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === idx ? "bg-white w-5" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute top-3 right-3 z-10 text-xs text-white/70 bg-black/50 px-2 py-1 rounded-full">
            {idx + 1} / {media.length}
          </div>
        </>
      )}
    </div>
  );
}

interface AppDetailModalProps {
  project: ExtendedProject;
  onClose: () => void;
}

export default function AppDetailModal({ project, onClose }: AppDetailModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const hasMedia = project.media && project.media.length > 0;
  const hasTech = project.technologies && project.technologies.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        className="relative bg-slate-900 border border-slate-700/60 rounded-3xl w-full max-w-4xl my-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient header bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-8 md:p-12">
          {/* Category badge */}
          <div className="mb-5">
            <span className="inline-block text-xs uppercase tracking-widest text-blue-400 font-bold px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
              {project.category}
            </span>
          </div>

          {/* Large title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
            {project.name}
          </h1>

          {/* Short description */}
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mb-8">
            {project.description}
          </p>

          {/* Media carousel */}
          {hasMedia && (
            <div className="mb-10">
              <MediaCarousel media={project.media!} />
            </div>
          )}

          {/* Long description */}
          {project.longDescription && (
            <div className="mb-8">
              <h2 className="text-sm uppercase tracking-widest text-slate-500 font-semibold mb-3">
                About
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
                {project.longDescription}
              </p>
            </div>
          )}

          {/* Technologies */}
          {hasTech && (
            <div className="mb-8">
              <h2 className="text-sm uppercase tracking-widest text-slate-500 font-semibold mb-3">
                Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies!.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Open Project <ExternalLink size={15} />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
