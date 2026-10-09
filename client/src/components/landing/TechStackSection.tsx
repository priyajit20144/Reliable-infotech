import React from 'react';

export const TechStackSection: React.FC = () => {
  const technologies = [
    {
      name: 'React',
      icon: (
        <svg className="w-6 h-6 text-cyan-400" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor">
          <circle cx="0" cy="0" r="2.05" fill="#38BDF8" stroke="none" />
          <ellipse rx="11" ry="4.2" strokeWidth="1" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" strokeWidth="1" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" strokeWidth="1" />
        </svg>
      ),
    },
    {
      name: 'Next.js',
      icon: (
        <div className="w-6 h-6 rounded-full bg-white text-black font-black text-xs flex items-center justify-center font-mono">
          N
        </div>
      ),
    },
    {
      name: 'Node.js',
      icon: (
        <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
          JS
        </div>
      ),
    },
    {
      name: 'Express',
      icon: (
        <div className="w-6 h-6 rounded-md bg-white/10 text-gray-200 font-bold text-xs flex items-center justify-center font-mono">
          ex
        </div>
      ),
    },
    {
      name: 'MongoDB',
      icon: (
        <span className="text-xl leading-none">🍃</span>
      ),
    },
    {
      name: 'TypeScript',
      icon: (
        <div className="w-6 h-6 rounded bg-[#3178C6] text-white font-bold text-xs flex items-center justify-center font-mono">
          TS
        </div>
      ),
    },
    {
      name: 'Tailwind CSS',
      icon: (
        <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
        </svg>
      ),
    },
    {
      name: 'Git',
      icon: (
        <div className="w-6 h-6 rounded bg-[#F05032]/20 border border-[#F05032]/40 text-[#F05032] font-bold text-xs flex items-center justify-center font-mono">
          git
        </div>
      ),
    },
    {
      name: 'Docker',
      icon: (
        <div className="w-6 h-6 rounded bg-sky-500/20 border border-sky-500/40 text-sky-400 font-bold text-xs flex items-center justify-center">
          🐳
        </div>
      ),
    },
  ];

  return (
    <section id="technologies" className="py-20 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-1.5 text-left mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <span>«</span>
            <span>TECHNOLOGIES</span>
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technologies We Use
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
            We work with the latest technologies to build high-quality solutions.
          </p>
        </div>

        {/* Horizontal Ribbon / Icons Grid matching reference image */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-4 items-center justify-center">
          {technologies.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#0F172A]/70 hover:bg-[#131B33]/90 border border-white/5 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 group shadow-md"
            >
              <div className="w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                {t.icon}
              </div>
              <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors mt-2 text-center truncate max-w-[80px]">
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
