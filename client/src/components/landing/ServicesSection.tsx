import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Monitor,
  ShoppingCart,
  Layers,
  Palette,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      id: 'web-dev',
      icon: Monitor,
      title: 'Web Development',
      badge: 'CORE',
      description: 'Ultra-fast, responsive web architectures built with modern React, TypeScript, and cloud infrastructure.',
    },
    {
      id: 'ecommerce',
      icon: ShoppingCart,
      title: 'E-Commerce Platforms',
      badge: 'SCALE',
      description: 'High-converting digital storefronts with secure payment gateways, inventory management, and zero checkout friction.',
    },
    {
      id: 'custom-software',
      icon: Layers,
      title: 'Custom Enterprise Software',
      badge: 'SYSTEMS',
      description: 'Tailor-made portals, workflow automation tools, and APIs engineered around your unique business operations.',
    },
    {
      id: 'uiux-design',
      icon: Palette,
      title: 'UI/UX Product Design',
      badge: 'DESIGN',
      description: 'High-fidelity wireframes, interactive prototypes, design systems, and engaging micro-interactions that captivate users.',
    },
    {
      id: 'website-redesign',
      icon: RefreshCw,
      title: 'Platform Modernization',
      badge: 'REBUILD',
      description: 'Revitalize legacy websites with modern performance optimizations, responsive layouts, and cutting-edge aesthetics.',
    },
    {
      id: 'maintenance',
      icon: ShieldCheck,
      title: 'SLA Maintenance & Support',
      badge: 'RELIABILITY',
      description: '24/7 security patch monitoring, automated backups, continuous integration, and dedicated developer support.',
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 relative">
      <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Template Aesthetic */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider text-[#A1A1AA] bg-[#181818] border border-[#262626]">
              <span>PLATFORM · CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#EEEEEE]">
              <span>Engineered for </span>
              <span className="font-serif italic text-[#C9C9C9]">Exceptional Impact</span>
            </h2>
            <p className="text-sm text-[#8D8D8D] max-w-xl leading-relaxed">
              From conception to deployment, we deliver bespoke digital products engineered with craftsmanship and speed.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#EEEEEE] hover:text-white bg-[#181818] hover:bg-[#1E1E1E] px-4 py-2 rounded border border-[#262626] transition-colors shrink-0 group"
          >
            <span>View All Capabilities</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Services Bento Grid with Corner Brackets & Framer Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, index) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="nf-frame nf-frame-hover"
              >
                <span className="nf-c nf-c-tl" />
                <span className="nf-c nf-c-tr" />
                <span className="nf-c nf-c-bl" />
                <span className="nf-c nf-c-br" />

                <div className="h-full p-6 bg-[#181818] border border-[#262626] hover:border-[#363636] rounded flex flex-col justify-between transition-colors shadow-sm group">
                  <div className="space-y-4">
                    {/* Top Row: Icon + Monospace Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded border border-[#363636] bg-[#1E1E1E] flex items-center justify-center text-[#EEEEEE] group-hover:text-white group-hover:border-[#444444] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[10px] text-[#71717A] tracking-wider px-2 py-0.5 rounded border border-[#262626] bg-[#121212]">
                        {s.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#EEEEEE] tracking-tight group-hover:text-white transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-xs text-[#8D8D8D] leading-relaxed mt-2.5">
                        {s.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Link */}
                  <div className="pt-6 mt-4 border-t border-dashed border-[#262626] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#71717A]">
                      0{index + 1} //
                    </span>
                    <Link
                      to={`/request?service=${s.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C9C9C9] group-hover:text-white transition-colors"
                    >
                      <span>Explore service</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
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
