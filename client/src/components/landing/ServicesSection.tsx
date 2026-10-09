import React from 'react';
import { Link } from 'react-router-dom';
import {
  Monitor,
  ShoppingCart,
  Layers,
  Palette,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Code2,
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      id: 'web-dev',
      icon: Monitor,
      iconColor: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
      title: 'Web Development',
      description: 'Modern, responsive and scalable websites for your business.',
    },
    {
      id: 'ecommerce',
      icon: ShoppingCart,
      iconColor: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30',
      title: 'E-Commerce',
      description: 'Powerful online stores with secure payment integration.',
    },
    {
      id: 'custom-software',
      icon: Layers,
      iconColor: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30',
      title: 'Custom Software',
      description: 'Tailored solutions for your unique needs.',
    },
    {
      id: 'uiux-design',
      icon: Palette,
      iconColor: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
      title: 'UI/UX Design',
      description: 'Beautiful and user-friendly designs that convert.',
    },
    {
      id: 'website-redesign',
      icon: RefreshCw,
      iconColor: 'from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/30',
      title: 'Website Redesign',
      description: 'Give your existing site a modern look.',
    },
    {
      id: 'maintenance',
      icon: ShieldCheck,
      iconColor: 'from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30',
      title: 'Maintenance & Support',
      description: 'Keep your platform secure and up to date.',
    },
  ];

  return (
    <section id="services" className="py-20 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-1.5 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span>«</span>
              <span>OUR SERVICES</span>
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              What We Do
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
              We offer a wide range of development services to bring your ideas to life and help your business grow online.
            </p>
          </div>

          <Link
            to="/request"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Services Responsive Grid (1 col mobile, 2 col sm, 3 col md, 6 col lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="rounded-2xl bg-[#0F172A]/75 hover:bg-[#131B33]/90 border border-white/8 hover:border-indigo-500/40 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group shadow-lg"
              >
                <div className="space-y-4 text-left">
                  {/* Service Icon Box */}
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${s.iconColor} border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-2 line-clamp-3">
                      {s.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Circular Arrow Button */}
                <div className="pt-4 mt-3 flex justify-end">
                  <Link
                    to={`/request?service=${s.id}`}
                    className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-gray-400 transition-all duration-200"
                    aria-label={`Explore ${s.title}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
