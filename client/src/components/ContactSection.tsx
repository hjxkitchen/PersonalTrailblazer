export default function ContactSection() {
  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold text-white mb-8">Let's Connect</h2>
      
      <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-600 max-w-2xl mx-auto">
        <p className="text-slate-300 mb-6 leading-relaxed">
          I'm always interested in connecting with fellow entrepreneurs, technologists, and innovators. 
          Whether you're interested in AI applications, business development, or exploring new ventures, 
          let's discuss how we can create something meaningful together.
        </p>

        <div className="space-y-4">
          <div className="flex justify-center space-x-6">
            <a
              href="mailto:contact@example.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Get in Touch
            </a>
            <a
              href="#"
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              LinkedIn
            </a>
          </div>
          
          <p className="text-sm text-slate-400">
            Currently based in San Francisco, exploring the intersection of AI, business, and innovation
          </p>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-slate-800/30 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-2">Future Interests</h3>
          <p className="text-sm text-slate-300">Hardware, Manufacturing, Industrial, Solar Energy</p>
        </div>
        <div className="bg-slate-800/30 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-2">Current Focus</h3>
          <p className="text-sm text-slate-300">AI Applications, Product Development, Venture Building</p>
        </div>
        <div className="bg-slate-800/30 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-2">Expertise Areas</h3>
          <p className="text-sm text-slate-300">Cross-Cultural Business, Technology, Operations</p>
        </div>
      </div>
    </section>
  );
}
