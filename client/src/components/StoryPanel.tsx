import { usePortfolio } from "../lib/stores/usePortfolio";

export default function StoryPanel() {
  const { currentMilestone, setCurrentMilestone } = usePortfolio();

  if (!currentMilestone) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:max-w-md bg-black/90 backdrop-blur-sm text-white p-6 rounded-lg border border-slate-600 z-20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{currentMilestone.title}</h3>
          <p className="text-sm text-slate-300">{currentMilestone.location} • {currentMilestone.year}</p>
        </div>
        <button
          onClick={() => setCurrentMilestone(null)}
          className="text-slate-400 hover:text-white text-xl leading-none"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-slate-200 leading-relaxed">
          {currentMilestone.description}
        </p>

        {currentMilestone.challenges && currentMilestone.challenges.length > 0 && (
          <div>
            <h4 className="font-semibold text-red-400 mb-2">Challenges Faced:</h4>
            <ul className="space-y-1">
              {currentMilestone.challenges.map((challenge, index) => (
                <li key={index} className="text-sm text-slate-300 flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentMilestone.achievements && currentMilestone.achievements.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-400 mb-2">Key Achievements:</h4>
            <ul className="space-y-1">
              {currentMilestone.achievements.map((achievement, index) => (
                <li key={index} className="text-sm text-slate-300 flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentMilestone.skills && currentMilestone.skills.length > 0 && (
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Skills Gained:</h4>
            <div className="flex flex-wrap gap-2">
              {currentMilestone.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
