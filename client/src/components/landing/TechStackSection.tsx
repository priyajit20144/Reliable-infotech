import React from 'react';
import { motion } from 'framer-motion';

interface TechItem {
  id: string;
  name: string;
  role: string;
  badge: string;
}

export const TechStackSection: React.FC = () => {
  const technologies: TechItem[] = [
    { id: 'react', name: 'React 18', role: 'Frontend UI', badge: 'CORE' },
    { id: 'nextjs', name: 'Next.js 14', role: 'Full-Stack SSR', badge: 'FRAMEWORK' },
    { id: 'typescript', name: 'TypeScript', role: 'Type Safe System', badge: 'LANG' },
    { id: 'nodejs', name: 'Node.js', role: 'Runtime Engine', badge: 'BACKEND' },
    { id: 'tailwind', name: 'Tailwind CSS', role: 'Design Tokens', badge: 'STYLING' },
    { id: 'postgresql', name: 'PostgreSQL', role: 'Relational DB', badge: 'STORAGE' },
    { id: 'mongodb', name: 'MongoDB', role: 'Document DB', badge: 'NOSQL' },
    { id: 'redis', name: 'Redis', role: 'In-Memory Cache', badge: 'PERF' },
    { id: 'docker', name: 'Docker', role: 'Containers', badge: 'DEVOPS' },
    { id: 'aws', name: 'AWS Cloud', role: 'Cloud Infra', badge: 'INFRA' },
    { id: 'git', name: 'Git Workflow', role: 'Version Control', badge: 'VCS' },
  ];

  const marqueeItems = [...technologies, ...technologies];

  return (
    <section
      id="technologies"
      className="py-16 sm:py-24 relative overflow-hidden select-none border-t border-[#262626]"
      role="region"
      aria-label="Technologies We Use"
    >
      {/* Section Header */}
      <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10">
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider text-[#A1A1AA] bg-[#181818] border border-[#262626]">
            <span>INFRASTRUCTURE · STACK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#EEEEEE]">
            <span>Engineered With </span>
            <span className="font-serif italic text-[#C9C9C9]">Modern Foundations</span>
          </h2>
          <p className="text-sm text-[#8D8D8D] max-w-xl leading-relaxed">
            We build with industry-tested toolchains and battle-hardened modern frameworks to guarantee long-term stability.
          </p>
        </div>
      </div>

      {/* Marquee Ticker with Edge Fade Masks */}
      <div className="relative w-full overflow-hidden py-3">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-r from-[#0B0B0B] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-l from-[#0B0B0B] to-transparent z-20 pointer-events-none" />

        <div className="flex overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
            className="flex items-center gap-4 py-2"
          >
            {marqueeItems.map((tech, index) => (
              <div
                key={`single-marquee-${tech.id}-${index}`}
                className="nf-frame nf-frame-hover w-44 flex-shrink-0"
              >
                <span className="nf-c nf-c-tl" />
                <span className="nf-c nf-c-tr" />
                <span className="nf-c nf-c-bl" />
                <span className="nf-c nf-c-br" />

                <div className="p-4 rounded bg-[#181818] border border-[#262626] hover:border-[#363636] transition-colors shadow-sm flex flex-col justify-between h-28">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#71717A] tracking-wider px-1.5 py-0.5 rounded border border-[#262626] bg-[#121212]">
                      {tech.badge}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#363636]" />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[#EEEEEE] tracking-tight">
                      {tech.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#8D8D8D] mt-0.5">
                      {tech.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
