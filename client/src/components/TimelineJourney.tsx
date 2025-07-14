import { useState, useRef, useEffect } from "react";
import { journeyMilestones, futurePaths } from "../data/journeyData";
import { usePortfolio } from "../lib/stores/usePortfolio";

export default function TimelineJourney() {
  const { setCurrentMilestone } = usePortfolio();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(journeyMilestones.length - 1); // Start with the current milestone (SF)

  // Auto-scroll timeline to the rightmost (newest) milestone on mount
  useEffect(() => {
    if (timelineRef.current) {
      const timeline = timelineRef.current;
      const scrollToNewest = () => {
        // Scroll to the rightmost position to show the newest milestone
        timeline.scrollLeft = timeline.scrollWidth - timeline.offsetWidth;
      };
      
      // Delay to ensure DOM is fully rendered
      setTimeout(scrollToNewest, 100);
    }
  }, []);

  const handleMilestoneClick = (milestone: any, index: number) => {
    setCurrentMilestone(milestone);
    setActiveIndex(index);
  };

  const allMilestones = [...journeyMilestones, ...futurePaths];

  return (
    <div className="py-12 px-8">
      {/* Timeline Container */}
      <div className="relative">
        <div 
          ref={timelineRef}
          className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: '#4b5563 #1e293b'
          }}
        >
          <div className="flex items-start min-w-max px-16" style={{ width: 'max-content' }}>
            {allMilestones.map((milestone, index) => {
              const isCompleted = index < journeyMilestones.length;
              const isFuture = index >= journeyMilestones.length;
              const isActive = activeIndex === index;
              
              return (
                <div key={milestone.id} className="flex items-center">
                  {/* Milestone Card */}
                  <div className="relative flex flex-col items-center" style={{ minHeight: '300px' }}>
                    {/* Milestone Marker */}
                    <div className="flex flex-col items-center" style={{ marginTop: '100px' }}>
                      <button
                        onClick={() => handleMilestoneClick(milestone, index)}
                        className={`relative w-20 h-20 rounded-full border-4 transition-all duration-300 transform hover:scale-110 ${
                          isCompleted
                            ? isActive
                              ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50'
                              : 'bg-green-600 border-green-500 hover:bg-green-500'
                            : isFuture
                            ? isActive
                              ? 'bg-amber-500 border-amber-400 shadow-lg shadow-amber-500/50'
                              : 'bg-amber-600 border-amber-500 hover:bg-amber-500'
                            : 'bg-blue-600 border-blue-500 hover:bg-blue-500'
                        }`}
                      >
                      <div className="absolute inset-2 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      
                        {/* Pulse Animation for Active */}
                        {isActive && (
                          <div className={`absolute inset-0 rounded-full animate-ping ${
                            isCompleted ? 'bg-green-500' : isFuture ? 'bg-amber-500' : 'bg-blue-500'
                          } opacity-75`} />
                        )}
                      </button>

                      {/* Milestone Info */}
                      <div className="mt-4 text-center w-48">
                        <h3 className="text-white font-semibold text-sm mb-1">
                          {milestone.title}
                        </h3>
                        <p className="text-slate-400 text-xs mb-1">
                          {milestone.location}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {milestone.year}
                        </p>
                        
                        {/* Status Badge */}
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            isCompleted
                              ? 'bg-green-100 text-green-800'
                              : isFuture
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {isCompleted ? 'Completed' : isFuture ? 'Future Path' : 'Current'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connection Line */}
                  {index < allMilestones.length - 1 && (
                    <div className={`w-32 h-1 mx-4 ${
                      index < journeyMilestones.length - 1
                        ? 'bg-green-500'
                        : 'bg-gradient-to-r from-green-500 to-amber-500'
                    }`}>
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex justify-center space-x-8 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-slate-300">Completed Milestones</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-slate-300">Future Opportunities</span>
        </div>
      </div>

      {/* Journey Summary */}
      <div className="mt-12 max-w-4xl mx-auto px-6">
        <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            The Journey So Far
          </h2>
          <p className="text-slate-300 leading-relaxed text-center">
            From high school in Tanzania to building AI applications in San Francisco, 
            this journey has been marked by resilience, adaptability, and continuous learning. 
            Each challenge became a stepping stone, each setback a redirection toward something better. 
            Now positioned at a pivotal point with exciting paths ahead in hardware manufacturing 
            or advanced AI development.
          </p>
          
          <div className="mt-6 grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{journeyMilestones.length}</div>
              <div className="text-slate-300 text-sm">Milestones Completed</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">2</div>
              <div className="text-slate-300 text-sm">Countries Lived In</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-amber-400">{futurePaths.length}</div>
              <div className="text-slate-300 text-sm">Future Paths Open</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}