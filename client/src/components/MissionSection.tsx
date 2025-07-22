export default function MissionSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Mission Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            My Mission
          </h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
          <p className="text-xl text-slate-300 leading-relaxed">
            Empowering the next generation of innovation in the AI age
          </p>
        </div>

        {/* Main Mission Statement */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-12 border border-slate-700">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Empowering Small Businesses & Players in the AI Revolution
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            I believe we're at a pivotal moment in history. The AI age presents unprecedented opportunities 
            for small businesses and individual players to compete on a global scale, innovate faster, 
            and create solutions that were once only possible for large corporations.
          </p>
          <p className="text-lg text-slate-300 leading-relaxed">
            My mission is to democratize access to these powerful tools and strategies, enabling 
            entrepreneurs and small businesses to harness AI for growth, efficiency, and innovation.
          </p>
        </div>

        {/* Network Revolution Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-700/50">
            <h3 className="text-xl font-bold text-white mb-4">
              Network Revolution
            </h3>
            <p className="text-slate-300 leading-relaxed">
              I believe in a network revolution that connects resources, knowledge, and opportunities 
              more efficiently than ever before. By building interconnected systems and communities, 
              we can maximize resource utilization and minimize waste.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-xl p-8 border border-green-700/50">
            <h3 className="text-xl font-bold text-white mb-4">
              Responsible Innovation
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Technology should serve humanity responsibly. Through thoughtful implementation of AI 
              and network technologies, we can create sustainable solutions that lead to abundance 
              rather than scarcity, opportunity rather than displacement.
            </p>
          </div>
        </div>

        {/* Vision for the Future */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-700">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Vision for Abundance
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            I envision a future where intelligent networks and AI-powered systems enable us to:
          </p>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Optimize resource allocation across communities and businesses</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Enable small players to access enterprise-level capabilities</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Create sustainable, interconnected economic ecosystems</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Foster innovation that benefits both business and society</span>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Build the Future Together?
          </h3>
          <p className="text-lg text-slate-300 mb-8">
            Let's connect and explore how we can leverage AI and network technologies 
            to create meaningful impact in your business or project.
          </p>
          <a 
            href="https://www.linkedin.com/in/john-xen-75a150209/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </div>
  );
}