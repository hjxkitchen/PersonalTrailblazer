interface Project {
  title: string;
  description: string;
  technologies: string[];
  status: string;
  impact: string;
  link?: string;
  subProjects?: string[];
  links?: { [key: string]: string };
}

interface ProjectGroups {
  [key: string]: Project[];
}

export default function ProjectsSection() {
  const projectGroups: ProjectGroups = {
    "Decentralized Social Commerce": [
      {
        title: "Socos",
        description: "A decentralized social-commerce platform enabling local discovery, vendor tools, and AI-powered recommendations.",
        technologies: ["AI/ML", "Marketplace", "ERP", "Blockchain"],
        status: "In Development",
        impact: "Empowering small businesses and communities through intelligent, fair, and scalable commerce."
      },
      {
        title: "AI-Powered Business Applications",
        description: "Building full AI applications and products in San Francisco, focusing on practical business solutions and venture development.",
        technologies: ["AI/ML", "Product Development", "Business Strategy"],
        status: "In Development",
        impact: "Developing next-generation AI products for market deployment"
      },
 
    ],

    "Decentralized Social Communities & Governance": [
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
      // {
      //   title: "People Matching",
      //   description: "AI-driven matching system for authentic, meaningful local and global human connections.",
      //   technologies: ["AI/ML", "Recommendation Systems", "Social Graphs"],
      //   status: "Prototype",
      //   impact: "Helping people find true connections based on values, interests, and proximity."
      // },
      // {
      //   title: "Creatives Network",
      //   description: "A platform for musicians, artists, designers, and creative professionals to connect, collaborate, and build opportunities.",
      //   technologies: ["AI Discovery", "Networking Tools", "Marketplace"],
      //   status: "In Development",
      //   impact: "Unlocking collaboration and opportunity in the global creative economy."
      // },
      {
        title: "3D Co-Experiencing World (Three.js)",
        description: "Immersive 3D environments for social interaction, co-watching, and community-based events.",
        technologies: ["Three.js", "WebGL", "Socket.IO", "Spatial Audio"],
        status: "In Development",
        impact: "Delivering immersive social and experiential layers for global communities."
      }
    ],

    "Business Tools": [
        {
          title: "Inventory & Sales Management",
          description: "A unified suite covering inventory, warehousing, sales, and CRM integration. Includes product management with barcodes, warehouses, POS with invoicing, customer tracking, pipeline management, and sales project oversight.",
          technologies: ["POS", "CRM", "Inventory Management", "Barcode", "Cloud", "Project Management", "Workflow Automation"],
          status: "In Development / Prototype",
          impact: "Simplifying operations and giving businesses a single hub to manage inventory, sales, and customer relationships.",
          subProjects: [
            "Inventory & POS System",
            "Sales Management",
            "CRM with Pipelines & Campaigns"
          ]
        },
        {
          title: "Marketing & Business Profile Tools",
          description: "Integrated marketing and discovery stack for businesses. Features bulk SMS campaigns tied to CRM and POS, automated website generation from business data, and unified business profiles to ensure cross-platform consistency.",
          technologies: ["SMS APIs", "Marketing Automation", "AI Targeting", "Website Builder", "No-Code Tools", "Social Discovery"],
          status: "In Development / Concept",
          impact: "Helping businesses stay discoverable, communicate with customers, and establish a professional online presence instantly.",
          subProjects: [
            "Smart SMS Marketing System",
            "Automated Business Website Generator",
            "Unified Business Profile"
          ]
        },
        {
          title: "AI Assistants & Insights",
          description: "AI-driven assistants and insights engines for business operations. Includes conversational chatbots for customer support, as well as a central AI hub for analytics, integrations, and agentic workflow automation.",
          technologies: ["AI/ML", "Chatbots", "NLP", "Data Analytics", "Integrations", "Agentic Workflows"],
          status: "Prototype / In Development",
          impact: "Reducing response times, improving customer satisfaction, and empowering decision-making through actionable intelligence.",
          subProjects: [
            "AI Chat Assistant",
            "Central AI Business Assistant"
          ]
        },
        {
          title: "AI Compliance & Procurement Tools",
          description: "Specialized AI tools for legal, fundraising, and procurement support. FundGuard protects startups against predatory investor terms, while TechSpec Pro generates precise technical specifications for quality procurement and supplier communication.",
          technologies: ["AI/ML", "FinTech", "Legal Tech", "Procurement Tech", "Risk Analysis", "Document Generation"],
          status: "Completed",
          impact: "Enabling startups and businesses to raise responsibly and improve supply chain quality through automated compliance and documentation.",
          subProjects: [
            "FundGuard",
            "TechSpec Pro"
          ],
          links: {
            FundGuard: "fundguard.ecom.ac",
            TechSpecPro: "techspecpro.ecom.ac"
          }
        }
      ],

    "Other Businesses & Ventures": [
     
      {
        title: "Tourism & Safari Experiences",
        description: "Curated tourism experiences with local guides, safaris, and cultural activities. Integrated with discovery, booking, and storytelling layers.",
        technologies: ["Travel Tech", "AI Recommendations", "Marketplace"],
        status: "Active Projects",
        impact: "Promoting East African tourism with authentic, locally-driven experiences."
      },
      // {
      //   title: "Zahab Solar & Engineering",
      //   description: "Renewable energy, off-grid solutions, agro-tech machinery, and integrated infrastructure/industrial solutions.",
      //   technologies: ["Solar Energy", "Electrical Engineering", "Automation", "IoT"],
      //   status: "Operational / Expanding",
      //   impact: "Delivering clean energy and scalable engineering solutions to communities and industries."
      // },
      {
        title: "Solar Business Expansion & Operations",
        description: "Directed family business growth from small solar retail to comprehensive energy, security, off-grid, and agro-processing solutions. Led market education and workforce development in challenging conditions.",
        technologies: ["Solar Energy Systems", "Business Operations", "Team Leadership", "Market Development"],
        status: "Completed",
        impact: "Expanded business into multiple sectors while building skilled workforce and educating non-technical market",
        link: "zahabenergy.com"
      },
      {
        title: "Mechatronics & Automation Systems",
        description: "Developed industrial automation solutions during community college studies and internship experiences.",
        technologies: ["Mechatronics", "Industrial Automation", "Engineering"],
        status: "Completed",
        impact: "Gained hands-on engineering experience and technical foundation"
      }
    ]
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

                  {project.subProjects && (
                    <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <h4 className="text-sm font-bold text-blue-300 mb-2">Includes:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {project.subProjects.map((subProject, subIndex) => (
                          <li key={subIndex} className="text-sm text-slate-300">
                            {subProject}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

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

                  {(project.link || project.links) && (
                    <div className="border-t border-slate-600 pt-3 mt-3">
                      {project.link && (
                        <a
                          href={`https://${project.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                        >
                          <span>🔗</span>
                          {project.link}
                        </a>
                      )}
                      {project.links && (
                        <div className="space-y-1">
                          {Object.entries(project.links).map(([name, url]) => (
                            <a
                              key={name}
                              href={`https://${url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium mr-4"
                            >
                              <span>🔗</span>
                              {name}: {url}
                            </a>
                          ))}
                        </div>
                      )}
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
