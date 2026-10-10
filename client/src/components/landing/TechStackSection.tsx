import React from 'react';

interface TechItem {
  id: string;
  name: string;
  role: string;
  glowColor: string;
  icon: React.ReactNode;
}

export const TechStackSection: React.FC = () => {
  // Core technologies matching the user reference
  const technologies: TechItem[] = [
    {
      id: 'react',
      name: 'React',
      role: 'Frontend UI',
      glowColor: 'rgba(56, 189, 248, 0.4)',
      icon: (
        <svg className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor">
          <circle cx="0" cy="0" r="2.05" fill="#38BDF8" stroke="none" />
          <ellipse rx="11" ry="4.2" strokeWidth="1.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" strokeWidth="1.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" strokeWidth="1.2" />
        </svg>
      ),
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      role: 'Full-Stack SSR',
      glowColor: 'rgba(255, 255, 255, 0.35)',
      icon: (
        <div className="w-8 h-8 rounded-full bg-white text-black font-black text-sm flex items-center justify-center font-mono shadow-[0_0_12px_rgba(255,255,255,0.4)]">
          N
        </div>
      ),
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      role: 'Runtime Engine',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
          JS
        </div>
      ),
    },
    {
      id: 'express',
      name: 'Express',
      role: 'Backend API',
      glowColor: 'rgba(203, 213, 225, 0.35)',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-white/10 text-gray-200 font-bold text-xs flex items-center justify-center font-mono border border-white/15 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          ex
        </div>
      ),
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      role: 'NoSQL Database',
      glowColor: 'rgba(16, 170, 80, 0.45)',
      icon: (
        <svg className="w-8 h-8 text-[#10AA50] drop-shadow-[0_0_10px_rgba(16,170,80,0.5)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.193 9.555c-1.264-4.499-4.323-7.415-4.693-7.755-.17-.16-.43-.16-.6 0-.37.34-3.429 3.256-4.693 7.755-1.42 5.05 1.05 9.04 4.543 12.345.26.25.68.25.94 0 3.493-3.305 5.963-7.295 4.503-12.345zm-4.993 10.375c-.27-.26-.51-.53-.74-.81v-7.21c0-.44-.36-.8-.8-.8s-.8.36-.8.8v5.82c-1.48-2.31-1.74-5.24-.76-8.73.96-3.41 3.1-5.75 3.1-5.75s2.14 2.34 3.1 5.75c.98 3.49.72 6.42-.76 8.73v-3.82c0-.44-.36-.8-.8-.8s-.8.36-.8.8v5.21c-.23.28-.47.55-.74.81z" />
        </svg>
      ),
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      role: 'Type Safe JS',
      glowColor: 'rgba(49, 120, 198, 0.45)',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-[#3178C6] text-white font-bold text-xs flex items-center justify-center font-mono shadow-[0_0_12px_rgba(49,120,198,0.4)]">
          TS
        </div>
      ),
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      role: 'Modern Styling',
      glowColor: 'rgba(56, 189, 248, 0.45)',
      icon: (
        <svg className="w-8 h-8 text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
        </svg>
      ),
    },
    {
      id: 'git',
      name: 'Git',
      role: 'Version Control',
      glowColor: 'rgba(240, 80, 50, 0.45)',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-[#F05032]/20 border border-[#F05032]/40 text-[#F05032] font-bold text-xs flex items-center justify-center font-mono shadow-[0_0_10px_rgba(240,80,50,0.3)]">
          git
        </div>
      ),
    },
    {
      id: 'docker',
      name: 'Docker',
      role: 'Containers',
      glowColor: 'rgba(36, 150, 237, 0.45)',
      icon: (
        <svg className="w-8 h-8 text-[#2496ED] drop-shadow-[0_0_10px_rgba(36,150,237,0.5)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186m0 2.714h2.118a.186.186 0 00.186-.185V6.289a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.954 0h2.119a.186.186 0 00.186-.185V6.289a.186.186 0 00-.186-.185H8.075a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.955 0h2.119a.186.186 0 00.185-.185V6.289a.186.186 0 00-.185-.185H5.12a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m0 2.716h2.119a.186.186 0 00.185-.186V9.006a.186.186 0 00-.185-.186H5.12a.185.185 0 00-.185.186v1.888c0 .102.083.186.185.186m2.955 0h2.119a.186.186 0 00.186-.186V9.006a.186.186 0 00-.186-.186H8.075a.185.185 0 00-.185.186v1.888c0 .102.083.186.185.186m2.954 0h2.118a.186.186 0 00.186-.186V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.888c0 .102.082.186.185.186m10.825-.333c-.347-.205-.989-.283-1.637-.205-.145-.733-.585-1.385-1.196-1.787l-.459-.304-.321.447c-.456.636-.677 1.488-.677 2.378 0 .428.055.83.165 1.197-.487.276-1.127.428-1.892.428H1.365a.366.366 0 00-.365.365c0 1.258.337 2.457.962 3.513 1.084 1.83 2.96 3.193 5.166 3.757 1.05.27 2.164.385 3.313.385 4.606 0 8.878-2.222 11.233-5.918.828-1.3 1.272-2.793 1.272-4.341 0-.175-.01-.347-.029-.516l-.286-.185z" />
        </svg>
      ),
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      role: 'SQL Database',
      glowColor: 'rgba(51, 103, 145, 0.45)',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-[#336791]/20 border border-[#336791]/50 text-[#336791] font-bold text-xs flex items-center justify-center font-mono">
          PG
        </div>
      ),
    },
    {
      id: 'redis',
      name: 'Redis',
      role: 'In-Memory Cache',
      glowColor: 'rgba(220, 56, 45, 0.45)',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-[#DC382D]/20 border border-[#DC382D]/50 text-[#DC382D] font-bold text-xs flex items-center justify-center font-mono">
          RDS
        </div>
      ),
    },
    {
      id: 'aws',
      name: 'AWS Cloud',
      role: 'Cloud Infra',
      glowColor: 'rgba(255, 153, 0, 0.45)',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-[#FF9900]/20 border border-[#FF9900]/50 text-[#FF9900] font-bold text-xs flex items-center justify-center font-mono">
          AWS
        </div>
      ),
    },
  ];

  // Exact 2-set clone for seamless, mathematically perfect -50% infinite marquee loop
  const marqueeItems = [...technologies, ...technologies];

  return (
    <section
      id="technologies"
      className="py-16 sm:py-20 bg-[#0B0F19] relative overflow-hidden select-none"
      role="region"
      aria-label="Technologies We Use"
    >
      {/* Background atmospheric ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[550px] h-[300px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[550px] h-[300px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Clean Section Header (No extra options/toolbars) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 sm:mb-12">
        <div className="space-y-1.5 text-left">
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
      </div>

      {/* ========================================================= */}
      {/* SINGLE LINE ALL-TIME CONTINUOUS RUNNING TICKER */}
      {/* ========================================================= */}
      <div className="relative w-full overflow-hidden py-3 marquee-group">
        
        {/* Left Gradient Edge Fade Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-r from-[#0B0F19] to-transparent z-20 pointer-events-none" />
        
        {/* Right Gradient Edge Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-l from-[#0B0F19] to-transparent z-20 pointer-events-none" />

        {/* Single Running Track (Smooth 60fps CSS Animation) */}
        <div className="flex overflow-hidden">
          <div
            style={{ '--marquee-duration': '30s' } as React.CSSProperties}
            className="animate-marquee-left flex items-center gap-3.5 sm:gap-4 md:gap-5"
          >
            {marqueeItems.map((tech, index) => (
              <div
                key={`single-marquee-${tech.id}-${index}`}
                className="w-28 sm:w-32 md:w-36 flex-shrink-0 flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-[#0F172A]/70 hover:bg-[#131B33]/90 border border-white/5 hover:border-cyan-400/40 transition-all duration-300 hover:-translate-y-1.5 group shadow-md cursor-pointer"
                style={{
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.45)',
                }}
              >
                {/* Tech Icon with Subtle Hover Expansion */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {tech.icon}
                </div>

                {/* Tech Name */}
                <span className="text-xs sm:text-sm font-semibold text-gray-300 group-hover:text-white transition-colors mt-2 text-center truncate max-w-[100px]">
                  {tech.name}
                </span>

                {/* Role Subtitle */}
                <span className="text-[10px] text-gray-400 group-hover:text-cyan-300 transition-colors mt-0.5 text-center font-medium">
                  {tech.role}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
