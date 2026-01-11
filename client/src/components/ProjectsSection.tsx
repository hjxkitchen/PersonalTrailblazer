import { useState } from "react";
import { Box } from "lucide-react";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  status: string;
  link?: string;
}

// Helper function to convert project title to thumbnail filename
// Returns path to local thumbnail file, or empty string if not found
function getThumbnailPath(projectTitle: string): string {
  const thumbnailMap: Record<string, string> = {
    "Socos": "socos.jpg",
    "Agora": "agora.jpg",
    "Zahab Energy": "zahab-energy.jpg",
    "B2B Marketplace & Commerce Orchestration": "b2b-marketplace.jpg",
    "Wild Earth Safaris": "wild-earth-safaris.jpg",
    "Mechatronics & Automation Systems": "mechatronics.jpg",
  };

  // Try direct match first
  if (thumbnailMap[projectTitle]) {
    return `/thumbnails/${thumbnailMap[projectTitle]}`;
  }
  
  // Convert project title to kebab-case for fallback matching
  const normalizedName = projectTitle
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

// Thumbnail component - shows local thumbnail if available, otherwise placeholder
function ProjectThumbnail({ project, isExpanded }: { project: Project; isExpanded: boolean }) {
  const [imageError, setImageError] = useState(false);
  const thumbnailPath = getThumbnailPath(project.title);

  // Show placeholder if image fails to load or no thumbnail path
  if (imageError || !thumbnailPath) {
    return (
      <div 
        className="relative bg-slate-950 overflow-hidden flex items-center justify-center rounded-t-2xl transition-all duration-500 ease-in-out"
        style={{ 
          maxHeight: isExpanded ? '256px' : '0px',
          minHeight: isExpanded ? '256px' : '0px',
          willChange: 'max-height'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20" />
        <div className={`relative text-slate-700 transition-all duration-300 ${isExpanded ? 'text-blue-400 opacity-100' : 'opacity-0'}`}>
          <Box size={40} strokeWidth={1.5} />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-slate-950 overflow-hidden rounded-t-2xl transition-all duration-500 ease-in-out"
      style={{ 
        maxHeight: isExpanded ? '256px' : '0px',
        minHeight: isExpanded ? '256px' : '0px',
        willChange: 'max-height'
      }}
    >
      <img
        src={thumbnailPath}
        alt={project.title}
        className={`w-full h-full object-cover transition-all duration-500 ${isExpanded ? 'scale-110 opacity-100' : 'opacity-0 scale-100'}`}
        onError={() => setImageError(true)}
        style={{ height: isExpanded ? '256px' : '0px', minHeight: isExpanded ? '256px' : '0px' }}
      />
    </div>
  );
}

export default function ProjectsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const projects: Project[] = [
    {
      title: "Socos",
      description: "Hyperlocal social platform with brand-driven trade, e-commerce, and tools for the next generation of social businesses, creators, and influencers.",
      technologies: ["AI/ML", "Marketplace", "ERP", "Blockchain"],
      status: "In Development",
    },
    {
      title: "Zahab Energy",
      description: "Resilient infrastructure, off-grid systems, and leapfrog projects including decentralized community grids, water systems, and IoT-digitized agro processing.",
      technologies: ["Solar Energy", "Off-Grid", "IoT", "Agro Processing"],
      status: "Active",
      link: "zahabenergy.com",
    },
    {
      title: "Wild Earth Safaris",
      description: "Lifestyle-focused curated tourism experiences with local guides, safaris, and cultural activities.",
      technologies: ["Travel Tech", "AI Recommendations"],
      status: "Active",
      link: "wildearthsafaris.com",
    },
    {
      title: "Agora",
      description: "AI-powered platform for regional governance, social discourse, humanitarian-organized projects, voting, and structured local & global civic engagement.",
      technologies: ["AI/ML", "Blockchain", "Civic Tech"],
      status: "Concept / MVP",
      link: "agora.ecom.ac",
    },
    {
      title: "B2B Marketplace & Commerce Orchestration",
      description: "Platform for complex B2B marketplace operations and supply chain coordination with IoT, AI optimization, and smart contracts.",
      technologies: ["IoT", "AI/ML", "Blockchain", "Supply Chain"],
      status: "Concept / In Development",
    },
    // {
    //   title: "AI Business Tools",
    //   description: "AI compliance tools (FundGuard, TechSpec Pro), assistants, marketing automation, and inventory management systems.",
    //   technologies: ["AI/ML", "FinTech", "Legal Tech", "CRM"],
    //   status: "Completed",
    // },
    {
      title: "Mechatronics & Automation Systems",
      description: "Hands-on engineering work with CAD/CAM, 6-axis CNC machines, robotics, and industrial automation systems during early studies and internship experience.",
      technologies: ["Mechatronics", "CAD/CAM", "CNC", "Industrial Automation"],
      status: "Completed",
    },
    
  ];
  

  const interests = [
    "Robotics",
    "Manufacturing",
    "Facilities",
    "Off-Grid Infrastructure",
    "Agro Processing",
    "Decentralized Community Grids",
    "Supply Chain Orchestration",
    "Space Infrastructure",
    "Materials Science",
    "Biomedical",
    "Neurotech",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600/20 text-green-300 border-green-600/30";
      case "Completed":
        return "bg-blue-600/20 text-blue-300 border-blue-600/30";
      case "In Development":
        return "bg-orange-600/20 text-orange-300 border-orange-600/30";
      default:
        return "bg-slate-600/20 text-slate-300 border-slate-600/30";
    }
  };

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Projects
      </h2>

      <div className="columns-1 md:columns-2 gap-8 mb-16" style={{ columnGap: '2rem', contain: 'layout' }}>
  {projects.map((project, index) => {
    const isExpanded = expandedIndex === index;
    return (
    <div
      key={index}
      className="
        group relative rounded-2xl p-[1px]
        bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent
        hover:from-blue-400/30 hover:via-purple-400/20
        transition-all duration-300
        break-inside-avoid
        mb-8
        cursor-pointer
      "
      onClick={() => setExpandedIndex(isExpanded ? null : index)}
      style={{ contain: 'layout style' }}
    >
      <div
        className="
          rounded-2xl bg-slate-900/80 backdrop-blur
          border border-slate-700/60
          overflow-hidden
          transition-all duration-300
          group-hover:border-slate-600
        "
      >
        {/* Thumbnail Image - expands and pushes content down */}
        <ProjectThumbnail project={project} isExpanded={isExpanded} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-white tracking-tight">
            {project.title}
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`}
            />
            <span className="text-slate-300 uppercase tracking-wide">
              {project.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="
                px-3 py-1 rounded-full text-xs
                bg-slate-800/70 text-slate-200
                border border-slate-700
                hover:border-slate-500
                transition
              "
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Link */}
        {project.link && (
          <a
            href={`https://${project.link}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="
              inline-flex items-center gap-2 text-sm
              text-blue-400 hover:text-blue-300
              transition
            "
          >
            <span className="border-b border-transparent group-hover:border-blue-400 transition">
              View Project
            </span>
            <span className="opacity-60 group-hover:opacity-100 transition">
              →
            </span>
          </a>
        )}
        </div>
      </div>
    </div>
    );
  })}
</div>

{/* Interests */}
<div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-purple-500/20 to-blue-500/10">
  <div className="rounded-2xl bg-slate-900/80 border border-slate-700/60 p-8">
    <h3 className="text-lg font-semibold text-white mb-4 tracking-tight">
      Areas of Interest
    </h3>

    <div className="flex flex-wrap gap-3">
      {interests.map((interest, index) => (
        <span
          key={index}
          className="
            px-4 py-1.5 rounded-full text-sm
            bg-purple-500/10 text-purple-300
            border border-purple-500/30
            hover:bg-purple-500/20
            transition
          "
        >
          {interest}
        </span>
      ))}
    </div>
  </div>
</div>

    </section>
  );
}
