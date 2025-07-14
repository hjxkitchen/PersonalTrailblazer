export default function ProjectsSection() {
  const projects = [
    {
      title: "AI-Powered Business Applications",
      description: "Building full AI applications and products in San Francisco, focusing on practical business solutions and venture development.",
      technologies: ["AI/ML", "Product Development", "Business Strategy"],
      status: "Current",
      impact: "Developing next-generation AI products for market deployment"
    },
    {
      title: "Tanzania Business Operations Platform",
      description: "Built comprehensive business management platform while learning operations, technology, and self-taught coding in Tanzania.",
      technologies: ["Full-Stack Development", "Business Operations", "System Architecture"],
      status: "Completed",
      impact: "Streamlined business operations and gained entrepreneurial experience"
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
      impact: "Identifying new market opportunities and business models"
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
          </div>
        ))}
      </div>
    </section>
  );
}
