interface Project {
  title: string;
  description: string;
  technologies: string[];
  status: string;
  impact: string;
  link?: string;
}

export default function ProjectsSection() {
  const projects = [
    {
      title: "TechSpec Pro",
      description: "AI-powered platform that transforms vague requirements into precise technical specifications for quality procurement. Features automatic specification generation, built-in quality checklists, translation bridge for supplier communication, and multi-format export capabilities.",
      technologies: ["AI/ML", "Procurement Tech", "NLP", "Document Generation"],
      status: "Current",
      impact: "Streamlining technical procurement and improving supply chain quality",
      link: "techspecpro.crowdsquare.ai"
    },
    {
      title: "FundGuard",
      description: "Protect startups from predatory fundraising terms with AI-powered term sheet analysis. Set your strategy once, then get instant risk scoring and actionable recommendations against Y Combinator and trustworthy investor standards.",
      technologies: ["AI/ML", "FinTech", "Legal Tech", "Risk Analysis"],
      status: "Current", 
      impact: "Empowering startups to make informed fundraising decisions",
      link: "fundguard.crowdsquare.ai"
    },
    {
      title: "AI-Powered Business Applications",
      description: "Building full AI applications and products in San Francisco, focusing on practical business solutions and venture development.",
      technologies: ["AI/ML", "Product Development", "Business Strategy"],
      status: "Current",
      impact: "Developing next-generation AI products for market deployment",
      link: "crowdsquare.ai"
    },
    {
      title: "Solar Business Expansion & Operations",
      description: "Directed family business growth from small solar retail to comprehensive energy, security, off-grid, and agro-processing solutions. Led market education and workforce development in challenging conditions.",
      technologies: ["Solar Energy Systems", "Business Operations", "Team Leadership", "Market Development"],
      status: "Completed",
      impact: "Expanded business into multiple sectors while building skilled workforce and educating non-technical market",
      link: "zahabenergy.com"
    },
    {
      title: "3D Ball Game",
      description: "A simple yet engaging 3D game where players navigate a ball through 3D space to hit target boxes within time limits. Features physics-based movement, timer mechanics, and progressive difficulty. Perfect timepass entertainment with intuitive controls.",
      technologies: ["3D Graphics", "Game Development", "Physics Engine", "Web Technologies"],
      status: "Completed",
      impact: "Demonstrating interactive 3D development skills and user engagement design",
      link: "game.zahabenergy.com"
    },
    {
      title: "Mechatronics & Automation Systems",
      description: "Developed industrial automation solutions during community college studies and internship experiences.",
      technologies: ["Mechatronics", "Industrial Automation", "Engineering"],
      status: "Completed",
      impact: "Gained hands-on engineering experience and technical foundation"
    },
    {
      title: "Tourism & Venture Development",
      description: "Exploring tourism industry applications and venture opportunities, combining technology with business development.",
      technologies: ["Tourism Tech", "Venture Development", "Market Analysis"],
      status: "In Development",
      impact: "Identifying new market opportunities and business models",
      link: "africanepic.com"
    }
  ];

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
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">{project.title}</h3>
              <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(project.status)}`}>
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
    </section>
  );
}
