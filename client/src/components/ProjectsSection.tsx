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
    "Social Commerce (Global, HyperLocal)": [
      {
        title: "Socos AI",
        description:
          "A global, hyperlocal, AI-powered social e-commerce platform that integrates local discovery, vendor tools, and intelligent automation for business growth and community engagement. Includes AI-driven recommendations, smart analytics, and operational orchestration connecting inventory, sales, marketing, and fulfillment flows.",
        technologies: [
          "AI/ML",
          "Marketplace",
          "ERP",
          "Blockchain",
          "Automation",
        ],
        status: "In Development",
        impact:
          "Empowering small businesses and communities through intelligent, fair, and scalable commerce.",
        subProjects: [
          "AI-Powered Vendor Tools & Recommendations",
          "Local Discovery & Community Commerce",
          "Integrated ERP & Workflow Automation",
          "Blockchain-Verified Trade & Transparency",
        ],
        link: "socos.ai",
      },
    ],

    "Social Communities & Governance (Global, HyperLocal)": [
      {
        title: "Agora AI",
        description:
          "A social, AI-powered platform for global and hyperlocal communities (agora.ecom.ac). It integrates immersive 3D worlds, participatory governance, and community-driven discussions that bridge the digital and physical world. Agora enables citizens to co-experience, co-create, and co-decide on global and local issues through an intelligent, inclusive network.",
        technologies: [
          "AI/ML",
          "3D/VR",
          "Blockchain",
          "WebGL",
          "Social Platforms",
          "Civic Tech",
        ],
        status: "Concept / MVP",
        impact:
          "Building a foundation for digital democracy and community-led global collaboration through immersive and intelligent communication tools.",
        subProjects: [
          "AI-Powered Global Conversations & Humanitarian Networks",
          "Layered Governance: Local-to-Global Civic Dialogue",
          "3D Social Worlds & Immersive Co-Experiencing Spaces",
        ],
        link: "agora.ecom.ac",
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
    ],

    // "Industrial / Complex Subcontracting x Resource Flows Orchestration": [
    //   {
    //     title: "Industrial Orchestration & Resource Flows",
    //     description: "A platform for orchestrating complex subcontracting, supplier coordination, and resource flows across industries. Combines IoT nodes, human input, and AI optimization to manage logistics, manufacturing, and industrial service chains. Features integration of suppliers, subcontractors, and logistics providers into dynamic process flows with smart contract verification and predictive insights.",
    //     technologies: ["IoT", "AI/ML", "Blockchain", "ERP", "Workflow Automation", "Logistics Optimization"],
    //     status: "Concept / In Development",
    //     impact: "Enabling businesses and industries to coordinate large-scale subcontracting and resource flows with transparency, efficiency, and resilience."
    //   }
    // ],

    "Businesses & Ventures": [
      {
        title: "Wild Earth Safaris",
        description:
          "Curated tourism experiences with local guides, safaris, and cultural activities. Integrated with discovery, booking, and storytelling layers.",
        technologies: ["Travel Tech", "AI Recommendations", "Marketplace"],
        status: "Active Projects",
        impact:
          "Promoting East African tourism with authentic, locally-driven experiences.",
        link: "wildearthsafaris.com",
      },
      // {
      //   title: "Zahab Solar & Engineering",
      //   description: "Renewable energy, off-grid solutions, agro-tech machinery, and integrated infrastructure/industrial solutions.",
      //   technologies: ["Solar Energy", "Electrical Engineering", "Automation", "IoT"],
      //   status: "Operational / Expanding",
      //   impact: "Delivering clean energy and scalable engineering solutions to communities and industries."
      // },
      {
        title: "Zahab Energy",
        description:
          "Directed family business growth from small solar retail to comprehensive energy, security, off-grid, and agro-processing solutions. Led market education and workforce development in challenging conditions.",
        technologies: [
          "Solar Energy Systems",
          "Business Operations",
          "Team Leadership",
          "Market Development",
        ],
        status: "Active Projects",
        impact:
          "Expanded business into multiple sectors while building skilled workforce and educating non-technical market",
        link: "zahabenergy.com",
      },
      {
        title: "Mechatronics & Automation Systems",
        description:
          "Developed industrial automation solutions during community college studies and internship experiences.",
        technologies: ["Mechatronics", "Industrial Automation", "Engineering"],
        status: "Completed",
        impact:
          "Gained hands-on engineering experience and technical foundation",
      },
    ],

    "Business Tools": [
      {
        title: "AI Compliance & Procurement Tools",
        description:
          "Specialized AI tools for legal, fundraising, and procurement support. FundGuard protects startups against predatory investor terms, while TechSpec Pro generates precise technical specifications for quality procurement and supplier communication.",
        technologies: [
          "AI/ML",
          "FinTech",
          "Legal Tech",
          "Procurement Tech",
          "Risk Analysis",
          "Document Generation",
        ],
        status: "Completed",
        impact:
          "Enabling startups and businesses to raise responsibly and improve supply chain quality through automated compliance and documentation.",
        subProjects: ["FundGuard", "TechSpec Pro"],
        links: {
          FundGuard: "fundguard.ecom.ac",
          TechSpecPro: "techspecpro.ecom.ac",
        },
      },
      {
        title: "AI Assistants & Insights",
        description:
          "AI-driven assistants and insights engines for business operations. Includes conversational chatbots for customer support, as well as a central AI hub for analytics, integrations, and agentic workflow automation.",
        technologies: [
          "AI/ML",
          "Chatbots",
          "NLP",
          "Data Analytics",
          "Integrations",
          "Agentic Workflows",
        ],
        status: "Completed",
        impact:
          "Reducing response times, improving customer satisfaction, and empowering decision-making through actionable intelligence.",
        subProjects: ["AI Chat Assistant", "Central AI Business Assistant"],
      },

      {
        title: "Marketing & Business Profile Tools",
        description:
          "Integrated marketing and discovery stack for businesses. Features bulk SMS campaigns tied to CRM and POS, automated website generation from business data, and unified business profiles to ensure cross-platform consistency.",
        technologies: [
          "SMS APIs",
          "Marketing Automation",
          "AI Targeting",
          "Website Builder",
          "No-Code Tools",
          "Social Discovery",
        ],
        status: "Completed",
        impact:
          "Helping businesses stay discoverable, communicate with customers, and establish a professional online presence instantly.",
        subProjects: [
          "Smart SMS Marketing System",
          "Automated Business Website Generator",
          "Unified Business Profile",
        ],
      },
      {
        title: "Inventory & Sales Management",
        description:
          "A unified suite covering inventory, warehousing, sales, and CRM integration. Includes product management with barcodes, warehouses, POS with invoicing, customer tracking, pipeline management, and sales project oversight.",
        technologies: [
          "POS",
          "CRM",
          "Inventory Management",
          "Barcode",
          "Cloud",
          "Project Management",
          "Workflow Automation",
        ],
        status: "Completed",
        impact:
          "Simplifying operations and giving businesses a single hub to manage inventory, sales, and customer relationships.",
        subProjects: [
          "Inventory & POS System",
          "Sales Management",
          "CRM with Pipelines & Campaigns",
        ],
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
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Key Projects & Experiences
      </h2>

      <div className="space-y-12">
        {Object.entries(projectGroups).map(([groupName, projects]) => (
          <div key={groupName}>
            <h3 className="text-2xl font-bold text-blue-400 mb-6 border-b border-slate-600 pb-2">
              {groupName}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 p-6 rounded-lg border border-slate-600"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {project.title}
                    </h3>
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
                      <h4 className="text-sm font-bold text-blue-300 mb-2">
                        Includes:
                      </h4>
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
                    <h4 className="text-sm font-semibold text-slate-400 mb-2">
                      Technologies:
                    </h4>
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
                    <h4 className="text-sm font-semibold text-slate-400 mb-1">
                      Impact:
                    </h4>
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
