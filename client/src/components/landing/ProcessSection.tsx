import React from 'react';
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
      title: 'Idea',
      icon: Lightbulb,
      description: 'Understand your vision and goals.',
      color: 'text-amber-400',
    },
    {
      step: '02',
      title: 'Requirements',
      icon: FileText,
      description: 'Gather detailed requirements.',
      color: 'text-blue-400',
    },
    {
      step: '03',
      title: 'Design',
      icon: PenTool,
      description: 'Create wireframes and UI/UX designs.',
      color: 'text-purple-400',
    },
    {
      step: '04',
      title: 'Development',
      icon: Code2,
      description: 'Build your solution with clean code.',
      color: 'text-cyan-400',
    },
    {
      step: '05',
      title: 'Testing',
      icon: CheckCircle2,
      description: 'Ensure quality and performance.',
      color: 'text-emerald-400',
    },
    {
      step: '06',
      title: 'Launch',
      icon: Rocket,
      description: 'Deploy and support your product.',
      color: 'text-rose-400',
    },
  ];

  return (
    <section id="process" className="py-20 bg-[#0B0F19] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="space-y-1.5 text-left mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <span>«</span>
            <span>OUR PROCESS</span>
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How We Work
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
            We follow a simple and effective process to deliver the best results.
          </p>
        </div>

        {/* 6 Connected Steps Horizontal Pipeline (Desktop) & Responsive Grid (Mobile/Tablet) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div
                key={s.step}
                className="flex flex-col items-center text-center group relative"
              >
                {/* Step Circular Node */}
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#111827] border border-white/10 group-hover:border-indigo-500/50 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    <Icon className={`w-6 h-6 ${s.color} transition-transform group-hover:scale-105`} />
                  </div>

                  {/* Connecting Arrow for Desktop (hidden on last item) */}
                  {!isLast && (
                    <div className="hidden lg:flex items-center justify-center absolute -right-6 top-1/2 -translate-y-1/2 text-gray-600 z-10">
                      <ArrowRight className="w-4 h-4 opacity-60 group-hover:text-cyan-400 group-hover:opacity-100 transition-colors" />
                    </div>
                  )}
                </div>

                {/* Step Number & Title */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-xs font-bold text-gray-400 font-mono">
                      {s.step}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {s.title}
                    </h3>
                  </div>

                  {/* Step Description */}
                  <p className="text-xs text-gray-400 leading-relaxed max-w-[150px] mx-auto">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
