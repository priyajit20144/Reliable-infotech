import React from 'react';
import {
  ShieldCheck,
  Zap,
  Code2,
  Clock,
  Headphones,
  Smartphone,
} from 'lucide-react';
import { Card } from '../common/Card';

export const WhyChooseSection: React.FC = () => {
  const benefits = [
    {
      icon: Code2,
      title: 'Modern Architecture Stacks',
      description: 'Zero bloat. Built strictly with modern React, TypeScript, Node.js, and MongoDB with best-in-class performance.',
    },
    {
      icon: Zap,
      title: 'Sub-Second Page Speeds',
      description: 'Optimized rendering trees, asset compression, code splitting, and database indexing for instant transitions.',
    },
    {
      icon: Smartphone,
      title: '100% Responsive Engineering',
      description: 'Tested and verified across all viewport widths from 320px mobile up to 1920px 4K displays with zero layout collisions.',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Security Hardening',
      description: 'JWT authentication with secure HTTP-only cookies, bcrypt hashing, input sanitization, and role-based guards.',
    },
    {
      icon: Clock,
      title: 'Rapid & Transparent Delivery',
      description: 'Agile sprints with live tracking, continuous staging deployments, and active direct client-team communication.',
    },
    {
      icon: Headphones,
      title: 'Long-Term Support & SLA',
      description: 'Continuous bug fixes, security patch updates, feature expansions, and dedicated technical maintenance.',
    },
  ];

  return (
    <section className="py-20 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Why Partner With DevCraft
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered For Excellence
          </h2>
          <p className="text-sm text-gray-400">
            We don't just build websites; we architect durable digital assets that empower businesses to scale securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <Card key={i} className="space-y-3 hover:border-indigo-500/30">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{b.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {b.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
