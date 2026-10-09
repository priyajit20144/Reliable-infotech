import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechSolutions',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      content:
        'DevCraft delivered an amazing website for our business. The team was professional, responsive and easy to work with. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Founder, StartupHub',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      content:
        'Their attention to detail and communication made our project smooth and successful. We love the final product.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Marketing Manager',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      content:
        'Great team, excellent work! They built our e-commerce platform exactly as we wanted, and the support has been fantastic.',
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-1.5 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span>«</span>
              <span>TESTIMONIALS</span>
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              What Our Clients Say
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
              Don't just take our word for it. Here's what our clients have to say about working with DevCraft.
            </p>
          </div>

          {/* Carousel Arrows matching reference image */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Testimonials Grid (Desktop 3 col, Mobile/Tablet responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0F172A]/75 hover:bg-[#131B33]/90 border border-white/8 hover:border-indigo-500/40 p-6 flex flex-col justify-between space-y-4 text-left transition-all duration-300 hover:-translate-y-1 group shadow-lg"
            >
              {/* Client Profile Row (Top) */}
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-indigo-500/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                "{t.content}"
              </p>

              {/* 5 Gold Stars (Bottom) */}
              <div className="flex items-center gap-1 text-amber-400 pt-2 border-t border-white/5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
