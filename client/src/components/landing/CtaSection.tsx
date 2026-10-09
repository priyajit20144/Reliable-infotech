import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2 } from 'lucide-react';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-12 bg-[#0B0F19] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Glowing Banner Container matching reference image */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0C1A38] via-[#151D45] to-[#1F174A] border border-indigo-500/30 p-8 sm:p-10 shadow-[0_0_50px_rgba(99,102,241,0.2)] relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Neon Light Trail Behind Banner */}
          <div className="absolute -bottom-8 left-0 right-0 h-16 bg-gradient-to-r from-cyan-500/20 via-indigo-500/30 to-purple-500/20 blur-xl pointer-events-none" />

          {/* Left Text Block */}
          <div className="space-y-2 text-left max-w-xl relative z-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 block">
              HAVE AN IDEA?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Let's Build It Together.
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
              Get a custom website or web application tailored to your needs.
            </p>
          </div>

          {/* Right Action Block: Mini Laptop & CTA Pill Button */}
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {/* Mini 3D Laptop Preview graphic */}
            <div className="hidden sm:flex items-center justify-center relative w-28 h-18 opacity-85">
              <div className="w-24 h-15 rounded-t-lg bg-[#0F172A] border border-cyan-500/30 p-1 shadow-lg">
                <div className="w-full h-full bg-[#080B12] rounded p-1 font-mono text-[6px] text-cyan-300 flex items-center justify-center">
                  &lt;code /&gt;
                </div>
              </div>
              <div className="absolute -bottom-1 w-28 h-1.5 rounded-b-md bg-slate-700 shadow-md" />
            </div>

            {/* Request Pill Button */}
            <Link
              to="/request"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-glow-primary transition-all duration-200 hover:scale-[1.03] active:scale-95 shrink-0"
            >
              <span>Request a Custom Website</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
