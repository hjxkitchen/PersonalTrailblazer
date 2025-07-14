export default function SkillsSection() {
  const skillCategories = [
    {
      title: "AI & Machine Learning",
      skills: ["AI Product Development", "LLM Integration", "AI Business Applications", "Data Analytics"],
      color: "blue"
    },
    {
      title: "Technology & Development",
      skills: ["Full-Stack Development", "Mobile App Development", "System Architecture", "API Design"],
      color: "green"
    },
    {
      title: "Business & Operations",
      skills: ["Business Operations", "Market Education", "Workforce Development", "Strategic Planning", "Technical Sales"],
      color: "purple"
    },
    {
      title: "Energy & Engineering Systems",
      skills: ["Solar Energy Systems", "Off-Grid Solutions", "Energy Storage", "Agro-Processing Machinery", "Security Systems"],
      color: "orange"
    },
    {
      title: "Leadership & Soft Skills",
      skills: ["Team Leadership", "Cross-Cultural Communication", "Problem Solving", "Adaptability"],
      color: "pink"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-600/20 text-blue-300 border-blue-600/30",
      green: "bg-green-600/20 text-green-300 border-green-600/30",
      purple: "bg-purple-600/20 text-purple-300 border-purple-600/30",
      orange: "bg-orange-600/20 text-orange-300 border-orange-600/30",
      pink: "bg-pink-600/20 text-pink-300 border-pink-600/30"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Skills & Expertise</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, index) => (
          <div key={index} className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
            <h3 className="text-xl font-semibold text-white mb-4">{category.title}</h3>
            <div className="space-y-2">
              {category.skills.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className={`px-3 py-2 rounded border ${getColorClasses(category.color)}`}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
