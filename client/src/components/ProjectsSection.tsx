interface Project {
  title: string;
  description: string;
  technologies: string[];
  status: string;
  impact: string;
  link?: string;
}

interface ProjectGroups {
  [key: string]: Project[];
}

export default function ProjectsSection() {
  const projectGroups: ProjectGroups = {
    "AI & Social Innovation": [
      {
        title: "AI-Powered Business Applications",
        description: "Building full AI applications and products in San Francisco, focusing on practical business solutions and venture development.",
        technologies: ["AI/ML", "Product Development", "Business Strategy"],
        status: "In Development",
        impact: "Developing next-generation AI products for market deployment",
      },
      {
        title: "Socos",
        description: "A decentralized social-commerce platform enabling local discovery, vendor tools, and AI-powered recommendations.",
        technologies: ["AI/ML", "Marketplace", "ERP", "Blockchain"],
        status: "In Development",
        impact: "Empowering small businesses and communities through intelligent, fair, and scalable commerce."
      },
      {
        title: "Social Global Conversation & Humanitarian",
        description: "A global dialogue layer enabling communities worldwide to connect across borders, languages, and humanitarian causes.",
        technologies: ["AI Translation", "Social Platforms", "Global Networking"],
        status: "Concept / MVP",
        impact: "Creating truly global conversations and coordinated humanitarian responses."
      },
      {
        title: "Governance",
        description: "Local-to-global governance dialogues with layered community conversations (neighborhood, city, state, national, global).",
        technologies: ["Blockchain", "AI Moderation", "Civic Tech"],
        status: "In Development",
        impact: "Enabling transparent, participatory, and multi-layered digital governance systems."
      },
      {
        title: "People Matching",
        description: "AI-driven matching system for authentic, meaningful local and global human connections.",
        technologies: ["AI/ML", "Recommendation Systems", "Social Graphs"],
        status: "Prototype",
        impact: "Helping people find true connections based on values, interests, and proximity."
      },
      {
        title: "3D Co-Experiencing World (Three.js)",
        description: "Immersive 3D environments for social interaction, co-watching, and community-based events.",
        technologies: ["Three.js", "WebGL", "Socket.IO", "Spatial Audio"],
        status: "In Development",
        impact: "Delivering immersive social and experiential layers for global communities."
      },
      {
        title: "Creatives Network",
        description: "A platform for musicians, artists, designers, and creative professionals to connect, collaborate, and build opportunities.",
        technologies: ["AI Discovery", "Networking Tools", "Marketplace"],
        status: "In Development",
        impact: "Unlocking collaboration and opportunity in the global creative economy."
      },
      {
        title: "Artist Visibility Platform",
        description: "A creative network platform for musicians, artists, and cultural creators to gain visibility and connect with global opportunities.",
        technologies: ["AI Discovery", "Streaming Integration", "Community Tools"],
        status: "In Development",
        impact: "Amplifying creative voices and connecting artists with fans, brands, and collaborators."
      },
    ],
    "Business Management & Tools": [
      {
        title: "CRM with Pipelines & Campaigns",
        description: "A modern CRM with intuitive UI for managing pipelines, stages, campaigns, and customer interactions.",
        technologies: ["CRM", "React", "Automations", "APIs"],
        status: "In Development",
        impact: "Helping businesses manage relationships and sales with clarity and ease."
      },
      {
        title: "Inventory & POS System",
        description: "Product management with barcode scanning, images, multi-warehouse tracking, sectioned storage, and POS integration for easy invoicing and CRM syncing. Includes multi-user logins, business dashboards, and warehouse apps.",
        technologies: ["POS", "Inventory Management", "Barcode", "Cloud"],
        status: "In Development",
        impact: "Simplifying operations for businesses through integrated inventory and sales systems."
      },
      {
        title: "Sales Management",
        description: "Manage customer and product details with sales tracking, statuses, logs, document uploads, and integration with project management tools. Supports automations and team management for overseeing installations.",
        technologies: ["CRM", "Project Management", "Workflow Automation"],
        status: "Prototype",
        impact: "Providing a single hub to oversee sales, customers, and project execution end-to-end."
      },
      {
        title: "Smart SMS Marketing System",
        description: "Bulk SMS campaigns integrated with POS and CRM. Includes campaign design, audience targeting, and performance tracking.",
        technologies: ["SMS APIs", "Marketing Automation", "AI Targeting"],
        status: "In Development",
        impact: "Enabling businesses to reach and retain customers effectively through smart campaigns."
      },
      {
        title: "AI Chat Assistant",
        description: "An AI assistant that responds to customer inquiries on behalf of businesses across chat, SMS, and web channels.",
        technologies: ["AI/ML", "Chatbots", "NLP", "CRM Integration"],
        status: "Prototype",
        impact: "Reducing response time and improving customer satisfaction with AI-driven support."
      },
      {
        title: "Automated Business Website Generator",
        description: "Instant websites created from business profiles, products, categories, and styling choices. Fully responsive with e-commerce capabilities.",
        technologies: ["AI Website Builder", "No-Code Tools", "Web Design"],
        status: "In Development",
        impact: "Giving businesses a professional digital presence instantly, without technical barriers."
      },
      {
        title: "Unified Business Profile",
        description: "A consolidated profile for businesses that powers marketing, discovery, and cross-platform consistency.",
        technologies: ["CRM", "Social Discovery", "Search Indexing"],
        status: "Concept",
        impact: "Creating a single source of truth for business identity and outreach."
      },
      {
        title: "Central AI Business Assistant",
        description: "An AI hub providing insights into business data, with integrations into CRM, POS, PM tools, and more. Supports agentic workflows for actions and decision-making.",
        technologies: ["AI/ML", "Data Analytics", "Agentic Workflows", "Integrations"],
        status: "In Development",
        impact: "Empowering businesses with actionable intelligence and automated workflows."
      },
      {
        title: "Logistics",
        description: "Smart logistics and fulfillment layer connecting suppliers, warehouses, and delivery operations.",
        technologies: ["IoT", "Logistics Optimization", "AI Routing"],
        status: "Concept",
        impact: "Streamlining movement of goods with intelligent and efficient logistics solutions."
      },
    ],
    "Tourism & Travel": [
      {
        title: "Tourism & Venture Development",
        description: "Exploring tourism industry applications and venture opportunities, combining technology with business development.",
        technologies: ["Tourism Tech", "Venture Development", "Market Analysis"],
        status: "Current",
        impact: "Identifying new market opportunities and business models",
        link: "wildearthsafaris.com"
      },
      {
        title: "Tourism & Safari Experiences",
        description: "Curated tourism experiences with local guides, safaris, and cultural activities. Integrated with discovery, booking, and storytelling layers.",
        technologies: ["Travel Tech", "AI Recommendations", "Marketplace"],
        status: "Active Projects",
        impact: "Promoting East African tourism with authentic, locally-driven experiences."
      },
    ],
    "Energy & Engineering": [
      {
        title: "Zahab Solar & Engineering",
        description: "Renewable energy, off-grid solutions, agro-tech machinery, and integrated infrastructure/industrial solutions.",
        technologies: ["Solar Energy", "Electrical Engineering", "Automation", "IoT"],
        status: "Operational / Expanding",
        impact: "Delivering clean energy and scalable engineering solutions to communities and industries."
      },
      {
        title: "Solar Business Expansion & Operations",
        description: "Directed family business growth from small solar retail to comprehensive energy, security, off-grid, and agro-processing solutions. Led market education and workforce development in challenging conditions.",
        technologies: ["Solar Energy Systems", "Business Operations", "Team Leadership", "Market Development"],
        status: "Completed",
        impact: "Expanded business into multiple sectors while building skilled workforce and educating non-technical market",
        link: "zahabenergy.com"
      },
    ],
    "Completed Ventures": [
      {
        title: "FundGuard",
        description: "Protect startups from predatory fundraising terms with AI-powered term sheet analysis. Set your strategy once, then get instant risk scoring and actionable recommendations against Y Combinator and trustworthy investor standards.",
        technologies: ["AI/ML", "FinTech", "Legal Tech", "Risk Analysis"],
        status: "Completed", 
        impact: "Empowering startups to make informed fundraising decisions",
        link: "fundguard.ecom.ac"
      },
      {
        title: "TechSpec Pro",
        description: "AI-powered platform that transforms vague requirements into precise technical specifications for quality procurement. Features automatic specification generation, built-in quality checklists, translation bridge for supplier communication, and multi-format export capabilities.",
        technologies: ["AI/ML", "Procurement Tech", "NLP", "Document Generation"],
        status: "Completed",
        impact: "Streamlining technical procurement and improving supply chain quality",
        link: "techspecpro.ecom.ac"
      },
      {
        title: "Mechatronics & Automation Systems",
        description: "Developed industrial automation solutions during community college studies and internship experiences.",
        technologies: ["Mechatronics", "Industrial Automation", "Engineering"],
        status: "Completed",
        impact: "Gained hands-on engineering experience and technical foundation"
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Current":
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
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Projects & Experiences</h2>
      
      <div className="space-y-12">
        {Object.entries(projectGroups).map(([groupName, projects]) => (
          <div key={groupName}>
            <h3 className="text-2xl font-bold text-blue-400 mb-6 border-b border-slate-600 pb-2">
              {groupName}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs border ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-400 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-600 pt-3">
                    <h4 className="text-sm font-semibold text-slate-400 mb-1">Impact:</h4>
                    <p className="text-sm text-slate-300">{project.impact}</p>
                  </div>

                  {project.link && (
                    <div className="border-t border-slate-600 pt-3 mt-3">
                      <a
                        href={`https://${project.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                      >
                        <span>🔗</span>
                        {project.link}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
