export default function MissionSection() {


  const projects = [
    {
      
      // 3d world game
      name: "3d world game",
      description: "A 3d world game built with Three.js",
      url: "https://3dballgame.netlify.app",
    },
    {
      name: "mindgraph",
      description: "A mindgraph built with Three.js",
      url: "https://mindgraph.socos.ai",
    },
    {
      name: "Voice Pos",
      description: "A voice powered pos system for small businesses and retailers.",
      url: "https://vistavoicepos.netlify.app",
    },
    {
      name: "Sky Walk World",
      description: "A 3d world game where you can import 3d glb models and walk around in a 3d world built with Three.js",
      url: "https://skywalkworld.netlify.app",
    },
    {
      name: "Star Select",
      // multiplayer game built with mediapipe and camer ahand trakcing to selct stars on a screen
      description: "A multiplayergame built with mediapipe and camer ahand trakcing to selct stars on a screen",
      url: "https://starselect.netlify.app",
    },
    {
      name: "Fund Guard",
      // upload invesmtent terms and get them evaluated and comapred to standards and other terms
      description: "A tool to upload investment terms and get them evaluated and comapred to standards and other terms",
      url: "https://investoshield.netlify.app",
    },
    {
      name: "Tech Spec Pro",
      // define criteria for procurement and get highly techincal specs to help procurement
      description: "A tool to define criteria for procurement and get highly techincal specs to help procurement",
      url: "https://techprocure.netlify.app",
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
    <div className="hidden container mx-auto px-4 max-w-3xl">
  
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          My Mission
        </h1>
        <p className="text-lg text-slate-300">
          Unifying commerce, infrastructure, governance, and culture for the next era.
        </p>
      </div>
  
      {/* Single Mission Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-10 md:p-12 border border-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Build the Systems of a Resilient, Abundant Civilization
        </h2>
  
        <p className="text-slate-300 leading-relaxed text-lg">
          My work connects the full stack of how societies function — from how people buy,
          trade, and collaborate, to how communities power themselves, govern themselves, 
          and preserve their culture.  
          <br /><br />
          <span className="text-white font-semibold">Socos</span> starts at the hyperlocal level: 
          empowering creators, small businesses, and neighborhoods with social commerce and
          brand-driven trade. This naturally expands into <span className="text-white font-semibold">
          B2B marketplaces</span>, supply chains, and complex commerce orchestration — creating
          the digital flow tools needed for modern economies.
          <br /><br />
          Through <span className="text-white font-semibold">Zahab Energy</span>, we extend this into 
          real-world infrastructure: resilient off-grid energy, water, agro-processing, and 
          decentralized systems we've built for more than a decade across Tanzania. These 
          foundations enable leapfrog development and set the stage for future industrial and 
          space-age manufacturing in areas like neurotech, biotech, and advanced materials.
          <br /><br />
          In parallel, <span className="text-white font-semibold">Agora AI</span> reimagines civic 
          engagement — regional discourse, transparent participation, humanitarian coordination, 
          and secure-by-design governance for a digital world.
          <br /><br />
          And with <span className="text-white font-semibold">Wild Earth Safaris</span>, we help 
          people explore cultures, nature, and heritage — grounding us in what makes humanity 
          worth building for as we aim toward the stars.
          <br /><br />
          Together, these efforts form one mission: to build the systems, tools, and cultural 
          foundation for an abundant, connected, and future-ready civilization.
        </p>
      </div>
  
    </div>
    <div className="container mx-auto px-4 py-12">
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {projects.map((project) => (
      <div
        key={project.name}
        className="
          group relative rounded-2xl overflow-hidden
          border border-slate-700/60
          bg-slate-900/80
          transition hover:border-slate-500
        "
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] bg-black overflow-hidden">
          <iframe
            src={project.url}
            title={project.name}
            loading="lazy"
            className="
              absolute inset-0 w-full h-full
              scale-[1.02]
              pointer-events-none
            "
          />

          {/* Overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t from-black/80 via-black/30 to-transparent
              opacity-90
            "
          />

          {/* Hover CTA */}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              absolute inset-0 flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition
            "
          >
            <span
              className="
                px-5 py-2 rounded-full
                bg-blue-600 hover:bg-blue-500
                text-white text-sm font-medium
                transition
              "
            >
              Visit Project →
            </span>
          </a>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-white font-semibold text-lg tracking-tight mb-1">
            {project.name}
          </h3>

          {project.description && (
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

  </div>
  

  
  
  );
}