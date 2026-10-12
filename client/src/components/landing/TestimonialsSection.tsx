import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechSolutions',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      content:
        'Reliable InfoTech delivered an exceptional digital architecture for our SaaS operations. The team executed with rare precision, speed, and proactive communication.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Founder, StartupHub',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      content:
        'Their engineering rigor and attention to aesthetic details made our product launch remarkably seamless. The final platform exceeded our expectations.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Head of Product, RetailFlow',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      content:
        'A world-class team. They engineered our enterprise portal and custom dashboard with zero downtime, robust security, and delightful micro-interactions.',
      rating: 5,
    },
  ];

  const brandLogos = [
    'Brightdesk',
    'Kinfolk Studio',
    'Meridian Labs',
    'Parcel Cloud',
    'Tandem Tech',
    'Vertex Systems',
    'Lumen Digital',
    'Quanta Core',
  ];

  return (
    <section className="py-16 md:py-24 relative border-t border-[#262626]">
      <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-3 text-left mb-14">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider text-[#A1A1AA] bg-[#181818] border border-[#262626]">
            <span>VERIFIED ENDORSEMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#EEEEEE]">
            <span>Partners Who </span>
            <span className="font-serif italic text-[#C9C9C9]">Trust Our Craft</span>
          </h2>
          <p className="text-sm text-[#8D8D8D] max-w-xl leading-relaxed">
            Real feedback from founders, product leaders, and enterprise teams scaling on our software solutions.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.09 }}
              whileHover={{ y: -4 }}
              className="nf-frame nf-frame-hover"
            >
              <span className="nf-c nf-c-tl" />
              <span className="nf-c nf-c-tr" />
              <span className="nf-c nf-c-bl" />
              <span className="nf-c nf-c-br" />

              <div className="h-full p-6 rounded bg-[#181818] border border-[#262626] hover:border-[#363636] flex flex-col justify-between space-y-5 text-left transition-colors shadow-sm group">
                <div className="space-y-4">
                  {/* Stars + Quote Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#EEEEEE]">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <Quote className="w-4 h-4 text-[#5D5D5D] group-hover:text-[#8D8D8D] transition-colors" />
                  </div>

                  {/* Quote text */}
                  <blockquote className="text-xs sm:text-[13.5px] text-[#C9C9C9] leading-relaxed font-sans">
                    "{t.content}"
                  </blockquote>
                </div>

                {/* Client Profile Row (Bottom) */}
                <div className="pt-4 border-t border-dashed border-[#262626] flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#363636]"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-[#EEEEEE]">
                      {t.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#8D8D8D]">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Infinite Brand Marquee (as in 21st template) */}
        <div className="mt-16 pt-8 border-t border-[#262626] overflow-hidden">
          <p className="text-[10px] font-mono tracking-widest text-[#5D5D5D] uppercase text-center mb-6">
            ENTERPRISES & FAST-GROWING VENTURES
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              className="flex w-max items-center gap-12 sm:gap-16 py-2"
            >
              {[...brandLogos, ...brandLogos].map((brand, i) => (
                <span
                  key={i}
                  className="font-mono text-sm sm:text-base font-medium text-[#71717A] hover:text-[#EEEEEE] transition-colors whitespace-nowrap tracking-wider"
                >
                  {brand}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};
