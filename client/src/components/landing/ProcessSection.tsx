import React from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  FileText,
  PenTool,
  Code2,
  CheckCircle2,
  Rocket,
  ArrowRight,
} from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Discovery',
      icon: Lightbulb,
      description: 'Understanding domain logic, system goals, and strategic success metrics.',
    },
    {
      step: '02',
      title: 'Architecture',
      icon: FileText,
      description: 'Technical specs, schema design, and cloud infrastructure roadmap.',
    },
    {
      step: '03',
      title: 'Interface Design',
      icon: PenTool,
      description: 'Interactive high-fidelity prototypes and crafted design systems.',
    },
    {
      step: '04',
      title: 'Engineering',
      icon: Code2,
      description: 'Clean TypeScript implementation with automated tests and CI/CD pipelines.',
    },
    {
      step: '05',
      title: 'Quality Assurance',
      icon: CheckCircle2,
      description: 'Cross-device validation, end-to-end testing, and performance profiling.',
    },
    {
      step: '06',
      title: 'Deployment',
      icon: Rocket,
      description: 'Zero-downtime production launch, observability monitoring, and handoff.',
    },
  ];

  return (
    <section id="process" className="py-16 md:py-24 relative border-t border-[#262626]">
      <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-3 text-left mb-14">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider text-[#A1A1AA] bg-[#181818] border border-[#262626]">
            <span>METHODOLOGY · LIFECYCLE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#EEEEEE]">
            <span>Built With </span>
            <span className="font-serif italic text-[#C9C9C9]">Quiet Rigor</span>
          </h2>
          <p className="text-sm text-[#8D8D8D] max-w-xl leading-relaxed">
            A repeatable, transparent development pipeline focused on velocity without sacrificing engineering quality.
          </p>
        </div>

        {/* 6 Connected Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -3 }}
                className="nf-frame nf-frame-hover"
              >
                <span className="nf-c nf-c-tl" />
                <span className="nf-c nf-c-tr" />
                <span className="nf-c nf-c-bl" />
                <span className="nf-c nf-c-br" />

                <div className="h-full p-5 rounded bg-[#181818] border border-[#262626] hover:border-[#363636] flex flex-col justify-between transition-colors shadow-sm text-left group">
                  <div>
                    {/* Step Telemetry Number */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-semibold text-[#EEEEEE] px-2 py-0.5 rounded bg-[#121212] border border-[#262626]">
                        {s.step}
                      </span>
                      <Icon className="w-4 h-4 text-[#8D8D8D] group-hover:text-[#EEEEEE] transition-colors" />
                    </div>

                    <h3 className="text-sm font-semibold text-[#EEEEEE] group-hover:text-white transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-[#8D8D8D] leading-relaxed mt-2">
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-dashed border-[#262626] flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                    <span>STEP {s.step}</span>
                    {idx < steps.length - 1 ? (
                      <ArrowRight className="w-3 h-3 text-[#5D5D5D]" />
                    ) : (
                      <span className="text-[#22C55E]">LIVE</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
