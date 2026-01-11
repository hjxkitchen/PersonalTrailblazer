import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Box, 
  Briefcase, 
  Cpu, 
  Gamepad2, 
  Rocket,
  Users,
  Layers,
  ExternalLink 
} from "lucide-react";

const CATEGORIES = [
  { id: "All", label: "All Works", icon: Layers },
  { id: "AI & Intelligence", label: "AI & Intel", icon: Sparkles },
  { id: "Spatial Computing", label: "Spatial & 3D", icon: Box },
  { id: "Commerce & Business", label: "Commerce", icon: Briefcase },
  { id: "Infrastructure", label: "Infrastructure", icon: Cpu },
  { id: "Interactive & Games", label: "Games", icon: Gamepad2 },
  { id: "Productivity", label: "Productivity", icon: Briefcase },
  { id: "Hackathon", label: "Hackathon", icon: Rocket },
  { id: "Hardware", label: "Hardware", icon: Cpu },
  { id: "Social", label: "Social", icon: Users },
] as const;

type CategoryId = typeof CATEGORIES[number]["id"];

// Helper function to convert project name to thumbnail filename
function getThumbnailPath(projectName: string): string {
  const thumbnailMap: Record<string, string> = {
    "3d ball game": "3d-ball-game.jpg",
    "mindgraph": "mindgraph.jpg",
    "Voice Pos": "voice-pos.jpg",
    "Sky Walk World": "sky-walk-world.jpg",
    "Star Select": "star-select.jpg",
    "Fund Guard": "fund-guard.jpg",
    "Tech Spec Pro": "tech-spec-pro.jpg",
    "ShelfScan Catalog": "shelfscan-catalog.jpg",
    "Serendipity": "serendipity.jpg",
    "BusDev": "busdev.jpg",
    "World Culture Events": "world-culture-events.jpg",
    "Bus Onboard": "bus-onboard.jpg",
    "Business Card AR": "business-card-ar.jpg",
    "3d Social World": "3d-social-world.jpg",
    "Socos": "socos.jpg",
    "Gpt Chat Viewer": "gpt-chat-viewer.jpg",
    "Prompt Generator": "prompt-generator.jpg",
    "OpenCV": "opencv.jpg",
    "Smart Contract": "smart-contract.jpg",
    "Applauncher": "applauncher.jpg",
    "Native CRM": "native-crm.jpg",
    "N8n Clone": "n8n-clone.jpg",
    "Alpha Crispr Chemical Library": "alpha-crispr-chemical-library.jpg",
    "Vr Sensai": "vr-sensai.jpg",
    "Ml Models": "ml-models.jpg",
    "Multiagent": "multiagent.jpg",
    "Agihack": "agihack.jpg",
    "Fraud Detection Multiagent": "fraud-detection-multiagent.jpg",
    "Smart Irrigation": "smart-irrigation.jpg",
    "Water Token Dispense Mobile Money": "water-token-dispense-mobile-money.jpg",
    "Bulk Sms Automation": "bulk-sms-automation.jpg",
    "Stepwise Erp and Apip": "stepwise-erp-and-apip.jpg",
    "Hc Pe Consolidation": "hc-pe-consolidation.jpg",
    "Isaac Sim Semantic Manipulation": "isaac-sim-semantic-manipulation.jpg",
    "IoT Blockchain Supply Chain": "iot-blockchain-supply-chain.jpg",
    "Autonomous Retail Robots": "autonomous-retail-robots.jpg",
    "Solar Flow": "solar-flow.jpg",
    "Virtual Sphere": "virtual-sphere.jpg",
    "Delivery Swarm": "delivery-swarm.jpg",
    "Tanzania Trekker": "tanzania-trekker.jpg",
    "Data Dialog": "datadialog.jpg",
    "Meeting Manager": "meeting-manager.jpg",
    "Sightline": "sightline.jpg",
    "Neurotech Horror": "neurotech-horror.jpg",
    "Wall3d": "wall3d.jpg",
    "Party Promoter": "party-promoter.jpg",
    "MindCRM / Journai": "mindcrm-journai.jpg",
    "Mlgame": "mlgame.jpg",
    "P5 Art": "p5-art.jpg",
    "Mediapipe Table Tennis": "mediapipe-table-tennis.jpg",
  };

  // Try direct match first
  if (thumbnailMap[projectName]) {
    return `/thumbnails/${thumbnailMap[projectName]}`;
  }
  
  // Convert project name to kebab-case for fallback matching
  const normalizedName = projectName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  
  // Try normalized match
  for (const [key, value] of Object.entries(thumbnailMap)) {
    const normalizedKey = key
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    
    if (normalizedKey === normalizedName) {
      return `/thumbnails/${value}`;
    }
  }
  
  // Final fallback: try the normalized name directly
  return `/thumbnails/${normalizedName}.jpg`;
}

const projects = [
  {
    name: "3d ball game",
    description: "A 3d ball game built with Three.js",
    url: "https://3dballgame.netlify.app",
    category: "Interactive & Games"
  },
  {
    name: "mindgraph",
    description: "A mindgraph built with Three.js",
    url: "https://mindgraph.socos.ai",
    category: "Productivity"
  },
  {
    name: "Voice Pos",
    description: "A voice powered pos system for small businesses and retailers.",
    url: "https://vistavoicepos.netlify.app",
    category: "Commerce & Business"
  },
  {
    name: "Sky Walk World",
    description: "A 3d world game where you can import 3d glb models and walk around in a 3d world built with Three.js",
    url: "https://skywalkworld.netlify.app",
    category: "Spatial Computing"
  },
  {
    name: "Star Select",
    description: "A multiplayer game built with Mediapipe and camera hand tracking.",
    url: "https://starselect.netlify.app",
    category: "Interactive & Games"
  },
  {
    name: "Fund Guard",
    description: "Evaluate investment terms compared to standards and other terms.",
    url: "https://fundguard.ecom.ac",
    category: "Commerce & Business"
  },
  {
    name: "Tech Spec Pro",
    description: "Define procurement criteria and generate technical specifications.",
    url: "https://techpspecpro.ecom.ac",
    category: "Commerce & Business"
  },
  {
    name: "ShelfScan Catalog",
    description: "Scan shelves to generate a digital catalog of products.",
    url: "https://shelf-scan-catalog-hjx52.replit.app",
    category: "Commerce & Business"
  },
  {
    name: "Serendipity",
    description: "Journaling tool to meet people with similar interests.",
    url: "https://serendipity.lovable.app",
    category: "Social"
  },
  {
    name: "BusDev",
    description: "Platform for learning business development and entrepreneurship.",
    url: "https://busdev.socos.ai",
    category: "Commerce & Business"
  },
  {
    name: "World Culture Events",
    description: "Format to learn about different cultures and traditions.",
    url: "https://worldcultureevent.lovable.app",
    category: "Social"
  },
  {
    name: "Bus Onboard",
    description: "Onboard media and operational data for businesses.",
    url: "https://busonboard.netlify.app",
    category: "Commerce & Business"
  },
  {
    name: "Business Card AR",
    description: "Create AR-enabled business cards for modern networking.",
    url: "https://businesscardar.netlify.app",
    category: "Spatial Computing"
  },
  {
    name: "3d Social World",
    description: "Spatial environment where multiple people can coexist.",
    url: "https://social.socos.app",
    category: "Spatial Computing"
  },
  {
    name: "Socos",
    description: "Hyperlocal marketplace and business enablement tools.",
    url: "https://socos.app",
    category: "Commerce & Business"
  },
  {
    name: "Gpt Chat Viewer",
    description: "View and edit GPT chat histories with ease.",
    url: "https://gptchatviewer.netlify.app",
    category: "Productivity"
  },
  {
    name: "Prompt Generator",
    description: "Advanced tool to generate high-quality prompts.",
    url: "https://promptgenerator.netlify.app",
    category: "Productivity"
  },
  {
    name: "OpenCV",
    description: "Computer vision toolkit for various analysis tasks.",
    url: "https://opencv.netlify.app",
    category: "AI & Intelligence"
  },
  {
    name: "Smart Contract",
    description: "Tool to create and deploy blockchain smart contracts.",
    url: "https://smartcontract.netlify.app",
    category: "Commerce & Business"
  },
  {
    name: "Applauncher",
    description: "Unified dashboard to launch various applications.",
    url: "https://applauncher.netlify.app",
    category: "Productivity"
  },
  {
    name: "Native CRM",
    description: "Customer relationship management and sales tool.",
    url: "https://nativecrm.netlify.app",
    category: "Commerce & Business"
  },
  {
    name: "N8n Clone",
    description: "Visual workflow automation and deployment tool.",
    url: "https://n8nclone.netlify.app",
    category: "Productivity"
  },
  {
    name: "Alpha Crispr Chemical Library",
    description: "Management system for chemical and CRISPR libraries.",
    url: "https://alphacrisprchemicallibrary.netlify.app",
    category: "AI & Intelligence"
  },
  {
    name: "Vr Sensai",
    description: "Virtual reality training and management platform.",
    url: "https://vr.netlify.app",
    category: "Interactive & Games"
  },
  {
    name: "Ml Models",
    description: "Create, train, and manage machine learning models.",
    url: "https://mlmodel.netlify.app",
    category: "AI & Intelligence"
  },
  {
    name: "Multiagent",
    description: "Orchestration system for multi-agent AI environments.",
    url: "https://multiagent.netlify.app",
    category: "AI & Intelligence"
  },
  {
    name: "Agihack",
    description: "Experimental framework for AGI development.",
    url: "https://agihack.netlify.app",
    category: "Hackathon"
  },
  {
    name: "Fraud Detection Multiagent",
    description: "Multi-agent system for real-time fraud detection.",
    url: "https://frauddetectionmultiagent.netlify.app",
    category: "Hackathon"
  },
  {
    name: "Smart Irrigation",
    description: "Automated irrigation systems for efficient water usage.",
    url: "https://smartirrigation.netlify.app",
    category: "Infrastructure"
  },
  {
    name: "Water Token Dispense Mobile Money",
    description: "Tokenizing water access with mobile money integration.",
    url: "https://watertokendispensemobilemoney.netlify.app",
    category: "Infrastructure"
  },
  {
    name: "Bulk Sms Automation",
    description: "Messaging automation for large-scale communication.",
    url: "https://bulksmsautomationwithautomateapp.netlify.app",
    category: "Commerce & Business"
  },
  {
    name: "Stepwise Erp and Apip",
    description: "Integrated ERP and API portal for enterprise operations.",
    url: "https://stepwiseerpandapip.netlify.app",
    category: "Commerce & Business"
  },
  {
    name: "Hc Pe Consolidation",
    description: "Strategic consolidation tools for private equity.",
    url: "https://hcpeconsolidationstrategic.netlify.app",
    category: "Commerce & Business"
  },
  {
    name: "Isaac Sim Semantic Manipulation",
    description: "Advanced semantic manipulation in NVIDIA Isaac Sim.",
    url: "https://isaacsimandsima3dsemanticmanipulation.netlify.app",
    category: "AI & Intelligence"
  },
  {
    name: "IoT Blockchain Supply Chain",
    description: "Hardware retrofit with edge AI for facilities sensors.",
    url: "https://blockchainsupplychainhardwareretrofitfacilitiessensorswedgeai.netlify.app",
    category: "Hardware"
  },
  {
    name: "Autonomous Retail Robots",
    description: "Robots for cleaning, stocking, and picking in retail.",
    url: "https://pickerrobot.netlify.app",
    category: "Hardware"
  },
  {
    name: "Solar Flow",
    description: "System for monitoring and managing solar energy flow.",
    url: "https://solarflow.netlify.app",
    category: "Infrastructure"
  },
  {
    name: "Virtual Sphere",
    description: "Interactive virtual sphere environments.",
    url: "https://virtualsphere.netlify.app",
    category: "Social"
  },
  {
    name: "Delivery Swarm",
    description: "Delivery drivers gig economy platform",
    url: "https://deliveryswarm.netlify.app",
    category: "Infrastructure"
  },
  {
    name: "Tanzania Trekker",
    description: "Plan your safari in Tanzania.",
    url: "https://tanzaniatrekker.netlify.app",
    category: "Productivity"
  },
  {
    name: "Data Dialog",
    description: "Conversational interface for complex data analysis.",
    url: "https://datadialog.netlify.app",
    category: "AI & Intelligence"
  },
  {
    name: "Meeting Manager",
    description: "Streamlined coordination for enterprise meetings.",
    url: "https://meetingmanager.netlify.app",
    category: "Productivity"
  },
  {
    name: "Sightline",
    description: "Predictive analytics and visualization platform.",
    url: "https://sightline.netlify.app",
    category: "Interactive & Games"
  },
  {
    name: "Neurotech Horror",
    description: "Bio-feedback driven interactive horror experience.",
    url: "https://neurotechhorrorgame.netlify.app",
    category: "Interactive & Games"
  },
  {
    name: "Wall3d",
    description: "Interactive 3D wall visualizations.",
    url: "https://wall3d.netlify.app",
    category: "Interactive & Games"
  },
  {
    name: "Party Promoter",
    description: "Automated event promotion and management.",
    url: "https://partypromoter.netlify.app",
    category: "Social"
  },
  {
    name: "MindCRM / Journai",
    description: "AI-integrated customer relationship management.",
    url: "https://mindcrmjournaicrm.netlify.app",
    category: "Productivity"
  },
  {
    name: "Mlgame",
    description: "Gamified machine learning education platform.",
    url: "https://mlgame.netlify.app",
    category: "Interactive & Games"
  },
  {
    name: "P5 Art",
    description: "Generative art collection built with P5.js.",
    url: "https://p5art.netlify.app",
    category: "Interactive & Games"
  },
  {
    name: "Mediapipe Table Tennis",
    description: "Hand-tracked table tennis using Mediapipe.",
    url: "https://mediapipe-tabletennis.netlify.app",
    category: "Interactive & Games"
  }
];

// Thumbnail component with error handling
function ThumbnailImage({ project }: { project: typeof projects[number] }) {
  const [imageError, setImageError] = useState(false);
  const cat = CATEGORIES.find(c => c.id === project.category);
  const Icon = cat?.icon || Box;

  if (imageError) {
    return (
      <div className="relative h-48 bg-slate-950 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20" />
        <div className="relative text-slate-700 group-hover:text-blue-400 transition-colors">
          <Icon size={48} strokeWidth={1.5} />
        </div>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white text-slate-950 rounded-full text-sm font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
            Open Project <ExternalLink size={14} />
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="relative h-48 bg-slate-950 overflow-hidden">
      <img
        src={getThumbnailPath(project.name)}
        alt={project.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={() => setImageError(true)}
      />
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-white text-slate-950 rounded-full text-sm font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
          Open Project <ExternalLink size={14} />
        </div>
      </a>
    </div>
  );
}

export default function MissionSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("All");

  const filteredProjects = projects.filter(
    (project) => activeCategory === "All" || project.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <div className="relative overflow-hidden pt-24 pb-16">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
            >
              The Portfolio
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto"
            >
              An ecosystem of tools, games, and infrastructure built to unify 
              commerce, technology, and culture.
            </motion.p>
          </div>

          {/* Mission Card (Hidden by default as per original) */}
          <div className="hidden container mx-auto px-4 max-w-3xl mb-20">
            <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-10 md:p-12 border border-slate-800/60 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Build the Systems of a Resilient, Abundant Civilization
              </h2>
              <div className="text-slate-400 leading-relaxed text-lg space-y-4">
                <p>
                  My work connects the full stack of how societies function — from how people buy,
                  trade, and collaborate, to how communities power themselves, govern themselves, 
                  and preserve their culture.  
                </p>
                <p>
                  <span className="text-blue-400 font-semibold text-white">Socos</span> starts at the hyperlocal level: 
                  empowering creators, small businesses, and neighborhoods. This naturally expands into 
                  <span className="text-blue-400 font-semibold text-white"> B2B marketplaces</span> and supply chains.
                </p>
                <p>
                  Through <span className="text-blue-400 font-semibold text-white">Zahab Energy</span>, we extend this into 
                  real-world infrastructure: resilient off-grid energy, water, and agro-processing built across Tanzania.
                </p>
              </div>
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                    transition-all duration-500 group
                    ${isActive 
                      ? "text-white" 
                      : "text-slate-400 hover:text-slate-200 bg-slate-900/20 border border-slate-800/50 hover:border-slate-700/80"}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  key={project.name}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="group relative"
                >
                  <div className="
                    h-full bg-slate-900/40 backdrop-blur-sm rounded-2xl overflow-hidden
                    border border-slate-800/60 transition-all duration-500
                    hover:border-blue-500/50 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-blue-500/10
                    flex flex-col
                  ">
                    {/* Thumbnail Image */}
                    <ThumbnailImage project={project} />


                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                          {project.name}
                        </h3>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-1 bg-slate-800/50 rounded-md">
                          {project.category}
                        </span>
                      </div>
                      
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6 group-hover:text-slate-300 transition-colors">
                        {project.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between">
                         <div className="text-[10px] text-slate-600 font-medium truncate max-w-[150px]">
                           {new URL(project.url).hostname}
                         </div>
                         <a 
                           href={project.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                         >
                           View <ExternalLink size={12} />
                         </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}