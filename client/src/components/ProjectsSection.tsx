import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, RotateCcw, X, Code2, ExternalLink, GripVertical } from "lucide-react";
import defaultData from "../data/mainProjectsData.json";
import MainProjectEditModal, { MainProject } from "./MainProjectEditModal";
import JsonEditModal from "./JsonEditModal";
import { usePortfolio } from "../lib/stores/usePortfolio";

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
const LS_KEY = "portfolio-main-data";

interface MainData {
  projects: MainProject[];
  interests: string[];
}

function loadData(): MainData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    projects: defaultData.projects as MainProject[],
    interests: defaultData.interests,
  };
}

function saveData(data: MainData) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function getStatusColor(status: string) {
  switch (status) {
    case "Active": return "bg-green-500/15 text-green-300 border-green-500/30";
    case "Completed": return "bg-blue-500/15 text-blue-300 border-blue-500/30";
    case "In Development": return "bg-orange-500/15 text-orange-300 border-orange-500/30";
    default: return "bg-slate-500/15 text-slate-400 border-slate-500/30";
  }
}

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────
const THUMBNAIL_MAP: Record<string, string> = {
  "WhatsLocal": "whatslocal.jpg",
  "Agora": "agora.jpg",
  "Zahab Energy": "zahab-energy.jpg",
  "B2B Marketplace & Commerce Orchestration": "b2b-marketplace.jpg",
  "Wild Earth Safaris": "wild-earth-safaris.jpg",
  "Mechatronics & Automation Systems": "mechatronics.jpg",
};

function getThumbnailPath(title: string): string {
  if (THUMBNAIL_MAP[title]) return `/thumbnails/${THUMBNAIL_MAP[title]}`;
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `/thumbnails/${slug}.jpg`;
}

// ─── Inline project card ──────────────────────────────────────────────────────
function ManifestoCard({
  project,
  isEditMode,
  onEdit,
  onDelete,
  noExpand = false,
  dragProps,
}: {
  project: MainProject;
  isEditMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  noExpand?: boolean;
  dragProps?: {
    draggable: boolean;
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: () => void;
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const canExpand = !noExpand && !isEditMode;
  const hasLive = !!project.link;

  // Expanded content height — bigger when showing iframe
  const expandedHeight = hasLive ? "72vh" : "260px";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative my-10 md:my-14 w-full ${isEditMode ? "cursor-grab" : ""}`}
      {...dragProps}
    >
      <div
        className={`
          relative rounded-2xl overflow-hidden border
          bg-slate-900/70 backdrop-blur-sm
          ${isEditMode ? "border-blue-500/40" : "border-slate-700/50 hover:border-slate-600"}
          shadow-xl shadow-black/30 transition-colors duration-300
        `}
      >
        {/* Top accent bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-500/60 via-purple-500/40 to-transparent" />

        {/* Expandable area — iframe or thumbnail */}
        <motion.div
          animate={{ height: expanded ? expandedHeight : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: "hidden" }}
        >
          {hasLive ? (
            /* ── Live iframe ── */
            <div className="relative w-full bg-slate-950" style={{ height: expandedHeight }}>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950">
                  <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-blue-500/60 animate-spin" />
                  <p className="text-xs text-slate-500">Loading {project.title}…</p>
                </div>
              )}
              {expanded && (
                <iframe
                  src={`https://${project.link}`}
                  title={project.title}
                  className="w-full h-full border-0"
                  style={{ height: expandedHeight }}
                  onLoad={() => setIframeLoaded(true)}
                  allow="fullscreen"
                />
              )}
            </div>
          ) : (
            /* ── Thumbnail image ── */
            <div className="relative bg-slate-950" style={{ height: "260px" }}>
              {!imgError ? (
                <img
                  src={getThumbnailPath(project.title)}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10">
                  <div className="text-4xl font-black text-slate-800">{project.title[0]}</div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            </div>
          )}
        </motion.div>

        {/* Card body */}
        <div
          className={`p-6 ${canExpand ? "cursor-pointer" : ""}`}
          onClick={() => canExpand && setExpanded((v) => !v)}
        >
          {/* Edit controls */}
          {isEditMode && (
            <div className="flex items-center justify-between mb-3">
              <GripVertical size={16} className="text-slate-600" />
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-md text-xs transition-colors"
                >
                  <Pencil size={11} /> Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-md text-xs transition-colors"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg font-bold text-white leading-tight">{project.title}</h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              {canExpand && (
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-500 text-xs"
                >
                  ↓
                </motion.span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.map((tech, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-full text-[11px] bg-slate-800/80 text-slate-300 border border-slate-700/60">
                {tech}
              </span>
            ))}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between gap-2">
            {project.link && (
              <a
                href={`https://${project.link}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <ExternalLink size={11} />
                {project.link}
              </a>
            )}
            {canExpand && (
              <span className="text-[11px] text-slate-600 ml-auto">
                {expanded ? (hasLive ? "Click to close" : "Click to collapse") : (hasLive ? "Click to preview" : "Click to expand")}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="flex items-center gap-4 my-16 md:my-20">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-700/60" />
      <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
      <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
      <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-700/60" />
    </div>
  );
}

// ─── Pull quote ───────────────────────────────────────────────────────────────
function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="my-12 md:my-16">
      <blockquote className="relative border-l-2 border-blue-500/50 pl-6 md:pl-8">
        <p className="text-xl md:text-2xl font-light text-slate-200 leading-relaxed italic">
          {children}
        </p>
      </blockquote>
    </Reveal>
  );
}

// ─── Chapter heading ──────────────────────────────────────────────────────────
function Chapter({ roman, title }: { roman: string; title: string }) {
  return (
    <Reveal className="mb-8 md:mb-10">
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500/70">{roman}</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>
      <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h2>
    </Reveal>
  );
}

// ─── Prose paragraph ─────────────────────────────────────────────────────────
function P({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <p className="text-slate-400 text-base md:text-lg leading-[1.85] mb-6">
        {children}
      </p>
    </Reveal>
  );
}

// ─── Interest tag edit modal ──────────────────────────────────────────────────
function InterestEditModal({
  interests,
  onSave,
  onClose,
}: {
  interests: string[];
  onSave: (interests: string[]) => void;
  onClose: () => void;
}) {
  const [list, setList] = useState([...interests]);
  const [input, setInput] = useState("");

  const add = () => {
    const t = input.trim();
    if (t && !list.includes(t)) setList((l) => [...l, t]);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={18} /></button>
        <h2 className="text-xl font-bold text-white mb-6">Edit Interests</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder="Add interest..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 text-sm"
          />
          <button onClick={add} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"><Plus size={16} /></button>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {list.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-500/10 text-purple-300 border border-purple-500/30">
              {item}
              <button onClick={() => setList((l) => l.filter((_, i) => i !== idx))} className="ml-1 text-purple-400 hover:text-red-400 transition-colors"><X size={11} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-lg text-sm">Cancel</button>
          <button onClick={() => { onSave(list); onClose(); }} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const { isEditMode } = usePortfolio();
  const [data, setData] = useState<MainData>(() => loadData());
  const [editingProject, setEditingProject] = useState<MainProject | null | "new">(null);
  const [editingInterests, setEditingInterests] = useState(false);
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const update = (next: MainData) => { setData(next); saveData(next); };

  const resetToDefaults = () => {
    if (confirm("Reset to defaults? This cannot be undone.")) {
      localStorage.removeItem(LS_KEY);
      setData({ projects: defaultData.projects as MainProject[], interests: defaultData.interests });
    }
  };

  const saveProject = (project: MainProject) => {
    const idx = data.projects.findIndex((p) => p.id === project.id);
    const next = [...data.projects];
    if (idx >= 0) next[idx] = project; else next.push(project);
    update({ ...data, projects: next });
    setEditingProject(null);
  };

  const deleteProject = (id: string) => {
    if (!confirm("Delete this project?")) return;
    update({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  };

  const onDragStart = (idx: number) => { dragIndex.current = idx; };
  const onDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); dragOverIndex.current = idx; };
  const onDrop = () => {
    const from = dragIndex.current; const to = dragOverIndex.current;
    if (from === null || to === null || from === to) return;
    const next = [...data.projects];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    update({ ...data, projects: next });
    dragIndex.current = null; dragOverIndex.current = null;
  };

  const dragProps = (idx: number) => ({
    draggable: isEditMode,
    onDragStart: () => isEditMode && onDragStart(idx),
    onDragOver: (e: React.DragEvent) => isEditMode && onDragOver(e, idx),
    onDrop: () => isEditMode && onDrop(),
  });

  const project = (id: string) => data.projects.find((p) => p.id === id);
  const projectIdx = (id: string) => data.projects.findIndex((p) => p.id === id);

  // Projects not mapped to specific manifesto slots — render at end
  const PINNED_IDS = ["mechatronics", "wild-earth-safaris", "zahab-energy", "b2b-marketplace", "whatslocal", "agora"];
  const floatingProjects = data.projects.filter((p) => !PINNED_IDS.includes(p.id));

  return (
    <section className="mb-24">

      {/* Edit toolbar */}
      {isEditMode && (
        <div className="mb-8 flex flex-wrap gap-3 p-4 bg-slate-900/60 border border-blue-500/30 rounded-2xl">
          <button onClick={() => setEditingProject("new")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus size={15} /> Add Project
          </button>
          <button onClick={() => setShowJsonEditor(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-600/50">
            <Code2 size={14} /> Edit JSON
          </button>
          <button onClick={() => setEditingInterests(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-600/50">
            <Pencil size={14} /> Edit Interests
          </button>
          <button onClick={resetToDefaults} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded-lg text-sm font-medium transition-colors">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      )}

      {/* ── MANIFESTO ── */}
      <div className="max-w-5xl mx-auto">

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 md:mb-28 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-500/70 mb-6">A Manifesto</p>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight mb-8">
            Building systems for a{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              connected, resilient,
            </span>{" "}
            and responsible world.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
            Technology. Culture. Infrastructure. Commerce. Governance.
            One ecosystem. One vision. Built from the ground up.
          </p>
        </motion.div>

        {/* ── I. ORIGINS ── */}
        <Chapter roman="I" title="Where It Begins" />

        <P>
          It started with machines. Before software, before startups — there were lathes,
          CNC mills, six-axis robots, and the deep satisfaction of understanding how
          physical systems move, fail, and endure. I studied mechatronics because I
          believed then what I still believe now: the world's most important problems
          are not abstract. They are material. They have weight, friction, and heat.
        </P>

        <P delay={0.05}>
          That engineering lens never left. It became the way I see every system I
          build — not as software, but as infrastructure. As something that has to
          hold, under real-world load, for real people, in real places.
        </P>

        {project("mechatronics") && (
          <ManifestoCard
            project={project("mechatronics")!}
            isEditMode={isEditMode}
            noExpand
            onEdit={() => setEditingProject(project("mechatronics")!)}
            onDelete={() => deleteProject("mechatronics")}
            dragProps={dragProps(projectIdx("mechatronics"))}
          />
        )}

        <Divider />

        {/* ── II. THE LAND ── */}
        <Chapter roman="II" title="The Continent" />

        <PullQuote>
          Africa is not a problem to be solved. It is the most extraordinary
          opportunity in human history — and it deserves technology built for it,
          not repurposed from somewhere else.
        </PullQuote>

        <P>
          I grew up shaped by East Africa. By the scale of its landscapes, the
          warmth of its people, the complexity of its economies, and the gap between
          what is and what could be. That gap is not a tragedy. It is an invitation.
        </P>

        <P delay={0.05}>
          Tourism is not just an industry here — it is a cultural bridge. When someone
          stands at the edge of the Serengeti, they are not just a consumer. They are a
          witness. Wild Earth Safaris was built around that idea: that travel, done
          right, generates trust, exchange, and understanding between worlds.
        </P>

        {project("wild-earth-safaris") && (
          <ManifestoCard
            project={project("wild-earth-safaris")!}
            isEditMode={isEditMode}
            onEdit={() => setEditingProject(project("wild-earth-safaris")!)}
            onDelete={() => deleteProject("wild-earth-safaris")}

            dragProps={dragProps(projectIdx("wild-earth-safaris"))}
          />
        )}

        <Divider />

        {/* ── III. THE GRID ── */}
        <Chapter roman="III" title="The Foundation" />

        <P>
          You cannot build a digital economy on an unreliable grid. You cannot run
          a supply chain without power. You cannot digitize agriculture without
          connectivity. Before the apps, before the platforms — you need infrastructure.
        </P>

        <P delay={0.05}>
          Zahab Energy is the answer to that first principle. Off-grid solar systems,
          decentralized community grids, IoT-connected agro processing — the unsexy,
          load-bearing work that makes everything else possible. I believe deeply that
          the communities who have been most underserved by centralized grids will
          become, through distributed energy, among the most resilient.
        </P>

        <PullQuote>
          Leapfrogging is real. The communities that never had landlines now run
          mobile money. The ones without centralized grids will run on distributed power.
          We are building for that future, now.
        </PullQuote>

        {project("zahab-energy") && (
          <ManifestoCard
            project={project("zahab-energy")!}
            isEditMode={isEditMode}
            onEdit={() => setEditingProject(project("zahab-energy")!)}
            onDelete={() => deleteProject("zahab-energy")}

            dragProps={dragProps(projectIdx("zahab-energy"))}
          />
        )}

        <Divider />

        {/* ── IV. THE MARKET ── */}
        <Chapter roman="IV" title="The Economy" />

        <P>
          Commerce is civilization's oldest technology. Long before the internet,
          trade routes built cities, spread ideas, and connected cultures. The
          question has never been whether people will trade — it is whether the
          systems they trade through serve them, or extract from them.
        </P>

        <P delay={0.05}>
          The B2B layer is where most of the real economic activity happens — and
          where software has consistently failed emerging markets. Supply chains
          that rely on WhatsApp threads. Procurement that runs on handshakes and
          spreadsheets. AI-optimized logistics that stops at the last mile because
          the last mile is hard. We are building the orchestration layer that makes
          complex B2B trade legible, automated, and fair.
        </P>

        {project("b2b-marketplace") && (
          <ManifestoCard
            project={project("b2b-marketplace")!}
            isEditMode={isEditMode}
            onEdit={() => setEditingProject(project("b2b-marketplace")!)}
            onDelete={() => deleteProject("b2b-marketplace")}

            dragProps={dragProps(projectIdx("b2b-marketplace"))}
          />
        )}

        <Divider />

        {/* ── V. THE PEOPLE ── */}
        <Chapter roman="V" title="The Social Layer" />

        <P>
          Economics without culture is just extraction. The most durable economies
          are embedded in community — in trust, in identity, in belonging. The next
          generation of creators, entrepreneurs, and builders does not want to
          choose between building a brand and building a business. They want both.
          They want a platform that understands them.
        </P>

        <P delay={0.05}>
          WhatsLocal is the social layer of this ecosystem. Hyperlocal by design — because
          the most important commerce happens between people who share a neighborhood,
          a market, a culture. It is not trying to be everything for everyone. It is
          trying to be exactly right for the communities it serves, with the tools
          creators and businesses actually need to grow.
        </P>

        {project("whatslocal") && (
          <ManifestoCard
            project={project("whatslocal")!}
            isEditMode={isEditMode}
            onEdit={() => setEditingProject(project("whatslocal")!)}
            onDelete={() => deleteProject("socos")}

            dragProps={dragProps(projectIdx("socos"))}
          />
        )}

        <Divider />

        {/* ── VI. THE VOICE ── */}
        <Chapter roman="VI" title="The Governance" />

        <P>
          The hardest problem in any system is not technical. It is political.
          Who decides? Who is heard? Whose priorities shape the infrastructure
          that shapes everyone's lives? These questions do not have easy answers —
          but they have better and worse processes. And right now, the processes
          are broken.
        </P>

        <P delay={0.05}>
          Agora is the long bet. AI-powered civic engagement, structured discourse,
          regional governance tools — not to replace human judgment, but to make
          collective decision-making more legible, more inclusive, and harder to
          corrupt. Democracy is a technology. Like any technology, it can be updated.
        </P>

        <PullQuote>
          If the physical infrastructure is the grid and the social layer is the
          network, then governance is the protocol — the rules by which all of it
          runs. We intend to build a better protocol.
        </PullQuote>

        {project("agora") && (
          <ManifestoCard
            project={project("agora")!}
            isEditMode={isEditMode}
            onEdit={() => setEditingProject(project("agora")!)}
            onDelete={() => deleteProject("agora")}

            dragProps={dragProps(projectIdx("agora"))}
          />
        )}

        <Divider />

        {/* ── VII. THE DREAM ── */}
        <Chapter roman="VII" title="The Dream" />

        <P>
          The dream is not a product. It is not even a company. It is a condition —
          a world where the infrastructure for a good life is not gated by geography,
          or inheritance, or which grid you happen to be connected to.
        </P>

        <P delay={0.05}>
          Every piece of this ecosystem — the energy systems, the marketplaces,
          the social platforms, the civic tools — is a node in a larger network.
          They are designed to work together, to reinforce each other, to make the
          whole greater than the sum of its parts. That is what it means to build
          a system, rather than a product.
        </P>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="my-16 p-8 md:p-10 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent text-center"
        >
          <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
            Building Technology.<br />
            Creating Value.<br />
            <span className="text-blue-400">Shaping Culture.</span><br />
            <span className="text-purple-400">Driving Impact.</span>
          </p>
          <p className="text-slate-500 text-sm mt-6 max-w-md mx-auto leading-relaxed">
            This is the work. It is long. It is hard. It is worth doing.
            If any of this resonates — reach out.
          </p>
        </motion.div>

        {/* Extra projects added via edit mode */}
        {floatingProjects.length > 0 && (
          <div className="mt-8">
            {floatingProjects.map((p, i) => (
              <ManifestoCard
                key={p.id}
                project={p}
                isEditMode={isEditMode}
                onEdit={() => setEditingProject(p)}
                onDelete={() => deleteProject(p.id)}

                dragProps={dragProps(data.projects.indexOf(p))}
              />
            ))}
          </div>
        )}

        {/* Add project shortcut */}
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

        <Divider />

        {/* ── INTERESTS ── */}
        <Reveal>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Areas of Deep Interest</h3>
            {isEditMode && (
              <button
                onClick={() => setEditingInterests(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg text-xs transition-colors"
              >
                <Pencil size={12} /> Edit
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {data.interests.map((interest, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="px-4 py-1.5 rounded-full text-sm text-slate-300 border border-slate-700/70 bg-slate-800/40 hover:border-slate-600 hover:text-white transition-colors cursor-default"
              >
                {interest}
              </motion.span>
            ))}
          </div>
        </Reveal>

      </div>

      {/* Modals */}
      {editingProject && (
        <MainProjectEditModal
          project={editingProject === "new" ? undefined : editingProject}
          onSave={saveProject}
          onClose={() => setEditingProject(null)}
        />
      )}
      {editingInterests && (
        <InterestEditModal
          interests={data.interests}
          onSave={(interests) => update({ ...data, interests })}
          onClose={() => setEditingInterests(false)}
        />
      )}
      {showJsonEditor && (
        <JsonEditModal
          data={data}
          label="Main Projects"
          onSave={(parsed) => { update(parsed as MainData); setShowJsonEditor(false); }}
          onClose={() => setShowJsonEditor(false)}
        />
      )}
    </section>
  );
}
