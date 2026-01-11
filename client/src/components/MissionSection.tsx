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
      url: "https://fundguard.ecom.ac",
    },
    {
      name: "Tech Spec Pro",
      // define criteria for procurement and get highly techincal specs to help procurement
      description: "A tool to define criteria for procurement and get highly techincal specs to help procurement",
      url: "https://techpspecpro.ecom.ac",
    },
    // shelfscancatalog
    {
      name: "ShelfScan Catalog",
      description: "A tool to scan shelves and get a catalog of the products on the shelf",
      url: "https://shelf-scan-catalog-hjx52.replit.app",
    },
    {
      name: "Serendipity",
      description: "A tool to journal and meet people with similar interests",
      url: "https://serendipity.lovable.app",
    },
    {
      name: "BusDev",
      description: "A site to learn about business development and entrepreneurship",
      url: "https://busdev.socos.ai",
    },
    {
      name: "World Culture Events",
      description: "A special event format to learn about different cultures and traditions",
      url: "https://worldcultureevent.lovable.app",
    },
    {
      name: "Bus Onboard",
      description: "A tool to onboard media, and other data for businesses",
      url: "https://busonboard.netlify.app",
    },
    {
      name: "Business Card AR",
      description: "A tool to create AR business cards for businesses",
      url: "https://businesscardar.netlify.app",
    },
    {
      name: "3d Social World",
      description: "A 3d world multiple people can coexist in a spatial environment",
      url: "https://social.socos.app",
    },
    {
      name: "Socos",
      description: "Local Marketplace and Business Tools",
      url: "https://socos.app",
    },
    // gpt chat viewer, prompt generator, opencv, smart contract, applauncher, native crm, n8n clone, alpha-crispr-chemical library, vr sensai, ml model, multiagent, agihack, fraud detection multiagent, 
    // smart irrigation, water token dispense mobile money, bulk sms automation with automate app, stepwise erp and apip, hc pe consolidation stategic, isaac sim and sima3d semantic manipulation, blockchain supply chain hardware retrofit facilities sensors w edge ai, retail cleaner, stocker, picker robot integrated with online marketplace for 24/7 pickup/delivery
    // (solar flow, virtual sphere, discovery swarm, tanzania trekker, data dialog, meeting manager, sightline, neurotech horrorgame, wall3d, party promoter, mindcrm/journai crm, mlgame, p5 art, mediapipe tabletennis, n8n clone)
    {
      name: "Gpt Chat Viewer",
      description: "A tool to view and edit gpt chat history",
      url: "https://gptchatviewer.netlify.app",
    },
    {
      name: "Prompt Generator",
      description: "A tool to generate prompts for various tasks",
      url: "https://promptgenerator.netlify.app",
    },
    {
      name: "OpenCV",
      description: "A tool to use opencv for various tasks",
      url: "https://opencv.netlify.app",
    },
    {
      name: "Smart Contract",
      description: "A tool to create and deploy smart contracts",
      url: "https://smartcontract.netlify.app",
    },
    {
      name: "Applauncher",
      description: "A tool to launch applications",
      url: "https://applauncher.netlify.app",
    },
    {
      name: "Native CRM",
      description: "A tool to manage customers and sales",
      url: "https://nativecrm.netlify.app",
    },
    {
      name: "N8n Clone",
      description: "A tool to create and deploy n8n workflows",
      url: "https://n8nclone.netlify.app",
    },
    {
      name: "Alpha Crispr Chemical Library",
      description: "A tool to create and manage chemical libraries",
      url: "https://alphacrisprchemicallibrary.netlify.app",
    },
    {
      name: "Vr Sensai",
      description: "A tool to create and manage vr sensai",
      url: "https://vr.netlify.app",
    },
    {
      name: "Ml Model",
      description: "A tool to create and manage ml models",
      url: "https://mlmodel.netlify.app",
    },  
    {
      name: "Multiagent",
      description: "A tool to create and manage multiagent systems",
      url: "https://multiagent.netlify.app",
    },
    {
      name: "Agihack",
      description: "A tool to create and manage agihack systems",
      url: "https://agihack.netlify.app",
    },
    {
      name: "Fraud Detection Multiagent",
      description: "A tool to create and manage fraud detection multiagent systems",
      url: "https://frauddetectionmultiagent.netlify.app",
    },
    {
      name: "Smart Irrigation",
      description: "A tool to create and manage smart irrigation systems",
      url: "https://smartirrigation.netlify.app",
    },
    {
      name: "Water Token Dispense Mobile Money",
      description: "A tool to create and manage water token dispense mobile money systems",
      url: "https://watertokendispensemobilemoney.netlify.app",
    },
    {
      name: "Bulk Sms Automation with Automate App",
      description: "A tool to create and manage bulk sms automation with automate app systems",
      url: "https://bulksmsautomationwithautomateapp.netlify.app",
    },
    {
      name: "Stepwise Erp and Apip",
      description: "A tool to create and manage stepwise erp and apip systems",
      url: "https://stepwiseerpandapip.netlify.app",
    },
    {
      name: "Hc Pe Consolidation Sategic",
      description: "A tool to create and manage hc pe consolidation stategic systems",
      url: "https://hcpeconsolidationstrategic.netlify.app",
    },
    {
      name: "Isaac Sim and Sima3d Semantic Manipulation",
      description: "A tool to create and manage isaac sim and sima3d semantic manipulation systems",
      url: "https://isaacsimandsima3dsemanticmanipulation.netlify.app",
    },
    {
      name: "Blockchain Supply Chain Hardware Retrofit Facilities Sensors w Edge Ai",
      description: "A tool to create and manage blockchain supply chain hardware retrofit facilities sensors w edge ai systems",
      url: "https://blockchainsupplychainhardwareretrofitfacilitiessensorswedgeai.netlify.app",
    },
    {
      name: "Retail Cleaner, Stocker, and Picker Robot",
      description: "A robot to clean, stock, and pick products for retail",
      url: "https://pickerrobot.netlify.app",
    },
    {
      name: "Solar Flow",
      description: "A tool to create and manage solar flow systems",
      url: "https://solarflow.netlify.app",
    },
    {
      name: "Virtual Sphere",
      description: "A tool to create and manage virtual sphere systems",
      url: "https://virtualsphere.netlify.app",
    },
    {
      name: "Discovery Swarm",
      description: "A tool to create and manage discovery swarm systems",
      url: "https://discoveryswarm.netlify.app",
    },
    {
      name: "Tanzania Trekker",
      description: "A tool to create and manage tanzania trekker systems",
      url: "https://tanzaniatrekker.netlify.app",
    },
    {
      name: "Data Dialog",
      description: "A tool to create and manage data dialog systems",
      url: "https://datadialog.netlify.app",
    },
    {
      name: "Meeting Manager",
      description: "A tool to create and manage meeting manager systems",
      url: "https://meetingmanager.netlify.app",
    },
    {
      name: "Sightline",
      description: "A tool to create and manage sightline systems",
      url: "https://sightline.netlify.app",
    },
    {
      name: "Neurotech Horrorgame",
      description: "A tool to create and manage neurotech horrorgame systems",
      url: "https://neurotechhorrorgame.netlify.app",
    },
    {
      name: "Wall3d",
      description: "A tool to create and manage wall3d systems",
      url: "https://wall3d.netlify.app",
    },
    {
      name: "Party Promoter",
      description: "A tool to create and manage party promoter systems",
      url: "https://partypromoter.netlify.app",
    },
    {
      name: "Mindcrm/Journai Crm",
      description: "A tool to create and manage mindcrm/journai crm systems",
      url: "https://mindcrmjournaicrm.netlify.app",
    },
    {
      name: "Mlgame",
      description: "A tool to create and manage mlgame systems",
      url: "https://mlgame.netlify.app",
    },
    {
      name: "P5 Art",
      description: "A tool to create and manage p5 art systems",
      url: "https://p5art.netlify.app",
    },
    {
      name: "Mediapipe Tabletennis",
      description: "A tool to create and manage mediapipe tabletennis systems",
      url: "https://mediapipe-tabletennis.netlify.app",
    },
    {
      name: "N8n Clone",
      description: "A tool to create and manage n8n clone systems",
      url: "https://n8nclone.netlify.app",
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
            // src={project.url}
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