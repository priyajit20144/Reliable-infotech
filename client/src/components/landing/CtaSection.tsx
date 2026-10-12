import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-14 md:py-20 relative">
      <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Architectural Inverted Framed Banner with Corner Brackets */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="nf-frame border border-[#363636] rounded p-8 sm:p-12 lg:p-16 relative overflow-hidden bg-[#181818]"
        >
          <span className="nf-c nf-c-tl" />
          <span className="nf-c nf-c-tr" />
          <span className="nf-c nf-c-bl" />
          <span className="nf-c nf-c-br" />

          {/* Subtle Grid Hatch Texture Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,#000,transparent)] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider text-[#A1A1AA] bg-[#121212] border border-[#262626]">
              <Sparkles className="w-3 h-3 text-[#E4E4E7]" />
              <span>START A NEW COLLABORATION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#EEEEEE]">
              <span>Ready to Engineer </span>
              <span className="font-serif italic text-[#C9C9C9]">Your Next Product?</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#8D8D8D] leading-relaxed max-w-lg mx-auto">
              Get in touch with our solutions engineering team. We'll examine your specifications and provide a detailed roadmap and estimate within 24 hours.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/request"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded text-sm font-semibold text-[#121212] bg-[#EEEEEE] hover:bg-white shadow-sm hover:scale-[1.02] active:scale-95 transition-all group"
              >
                <span>Request a Custom Website</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded text-sm font-medium text-[#EEEEEE] bg-[#121212] hover:bg-[#1E1E1E] border border-[#262626] transition-colors"
              >
                <span>Contact Engineering Team</span>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
