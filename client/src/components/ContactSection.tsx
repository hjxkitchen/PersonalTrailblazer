export default function ContactSection() {
  return (
    <section className="text-center relative">
    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-10">
      Let’s Connect
    </h2>
  
    {/* Primary card */}
    <div className="relative max-w-2xl mx-auto rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent">
      <div className="rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-700/60 p-8 md:p-10">
        <p className="text-slate-300 leading-relaxed mb-8">
          I’m always interested in connecting with fellow entrepreneurs,
          technologists, and builders. Whether you’re exploring AI
          applications, product strategy, or new ventures, I’m open to
          thoughtful conversations focused on creating real value.
        </p>
  
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <a
            href="https://www.linkedin.com/in/john-xen-75a150209/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center gap-2
              px-7 py-3 rounded-full
              bg-blue-600 hover:bg-blue-500
              text-white text-sm font-medium
              transition
            "
          >
            Start a Conversation
            <span className="opacity-80">→</span>
          </a>
  
          <a
            href="https://www.linkedin.com/in/john-xen-75a150209/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center
              px-7 py-3 rounded-full
              bg-slate-800 hover:bg-slate-700
              border border-slate-600
              text-white text-sm font-medium
              transition
            "
          >
            LinkedIn Profile
          </a>
        </div>
  
        <p className="text-xs text-slate-400">
          Based in San Francisco · Exploring the intersection of AI,
          business, and long-term innovation
        </p>
      </div>
    </div>
  
    {/* Focus areas */}
    <div className="mt-14 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {[
        {
          title: "Future Interests",
          body: "Hardware, Manufacturing, Industrial Systems, Solar Energy",
        },
        {
          title: "Current Focus",
          body: "AI Applications, Product Development, Venture Building",
        },
        {
          title: "Expertise Areas",
          body: "Cross-Cultural Business, Technology, Operations",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="
            rounded-2xl p-[1px]
            bg-gradient-to-br from-slate-700/40 to-transparent
          "
        >
          <div className="rounded-2xl bg-slate-900/70 border border-slate-700/60 p-5 text-left">
            <h3 className="text-sm font-semibold text-white mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {item.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
  
  );
}
