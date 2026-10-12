import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Play,
  CheckCircle2,
  TrendingUp,
  Layers,
  Code2,
} from 'lucide-react';
import { InkSculpture3D } from './InkSculpture3D';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-4 pb-16 md:pt-8 md:pb-24 overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Container with Corner Brackets */}
        <div className="nf-frame border border-[#262626] bg-[#121212] overflow-hidden rounded">
          <span className="nf-c nf-c-tl" />
          <span className="nf-c nf-c-tr" />
          <span className="nf-c nf-c-bl" />
          <span className="nf-c nf-c-br" />

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[660px]">
            
            {/* Left Column: Hero Editorial Content */}
            <div className="lg:col-span-6 flex flex-col justify-center p-6 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-[#262626] z-10">
              
              {/* Top Tag & Intro Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-center gap-2.5 mb-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-mono tracking-wider text-[#A1A1AA] bg-[#181818] border border-[#262626]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                  <span>FORGE 2.0 · DIGITAL STUDIO</span>
                </div>
                <Link
                  to="/intro"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono text-[#E4E4E7] bg-[#1E1E1E] hover:bg-[#262626] border border-[#363636] transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-[#E4E4E7]" />
                  <span>Intro Experience</span>
                </Link>
              </motion.div>

              {/* Shaded Gradient Horizontal Band for Headline (as in template) */}
              <motion.div
                initial={{ opacity: 0.9, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="py-4 px-3 -mx-3 sm:-mx-4 sm:px-4 mb-4 border-y border-[#262626] bg-gradient-to-r from-[#181818] via-[#141414] to-transparent"
              >
                <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] tracking-tight leading-[1.08] font-normal text-white">
                  <span className="block font-sans font-medium text-white">Turn Ideas Into</span>
                  <span className="block font-serif italic text-white/90 tracking-normal mt-0.5">
                    Digital Precision
                  </span>
                </h1>
              </motion.div>

              {/* Lede Subtitle */}
              <motion.p
                initial={{ opacity: 0.9, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-sm sm:text-[15px] leading-relaxed text-[#A1A1AA] max-w-xl font-normal mb-8"
              >
                Reliable InfoTech architects high-performance web systems, enterprise portals, bespoke mobile apps, and scalable digital solutions — transforming bold product visions into reality.
              </motion.p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Primary Inverted Button */}
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded text-sm font-semibold text-[#121212] bg-[#EEEEEE] hover:bg-white shadow-sm hover:scale-[1.02] active:scale-95 transition-all group"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {/* Secondary Bracketed Ghost Button */}
                <div className="nf-frame nf-frame-hover">
                  <span className="nf-c nf-c-tl" />
                  <span className="nf-c nf-c-tr" />
                  <span className="nf-c nf-c-bl" />
                  <span className="nf-c nf-c-br" />
                  <Link
                    to="/request"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded text-sm font-medium text-[#EEEEEE] bg-[#181818] hover:bg-[#1E1E1E] border border-[#262626] transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-[#A1A1AA] fill-current" />
                    <span>Request a Website</span>
                  </Link>
                </div>
              </div>

              {/* Social Proof + Stats Row */}
              <div className="pt-4 border-t border-[#262626] flex flex-wrap items-center justify-between gap-4">
                {/* Avatar Cluster */}
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    {['1534528741775-53994a69daeb', '1507003211169-0a1dd7228f2d', '1492562080023-ab3db95bfbce', '1517841905240-472988babdf9'].map((id, i) => (
                      <img
                        key={i}
                        src={`https://images.unsplash.com/photo-${id}?w=64&h=64&fit=crop&crop=face`}
                        alt="Client avatar"
                        className="w-7 h-7 rounded-full border-2 border-[#121212] object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#8D8D8D] font-mono">
                    Loved by <strong className="text-[#EEEEEE] font-semibold">120+ teams</strong>
                  </span>
                </div>

                {/* Inline Quick Stats */}
                <div className="flex items-center gap-4 text-xs font-mono text-[#8D8D8D]">
                  <div>
                    <span className="text-[#EEEEEE] font-semibold">50+</span> Projects
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[#363636]" />
                  <div>
                    <span className="text-[#EEEEEE] font-semibold">30+</span> Clients
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[#363636]" />
                  <div>
                    <span className="text-[#EEEEEE] font-semibold">5+</span> Yrs
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Full Interactive 3D Generative Ink Sculpture Canvas */}
            <div className="lg:col-span-6 relative min-h-[420px] sm:min-h-[500px] lg:min-h-full flex flex-col justify-center bg-[#0E0E0E]">
              <InkSculpture3D height="100%" interactive={true} initialSeed={4211} />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
