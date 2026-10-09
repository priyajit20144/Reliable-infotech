import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  ShoppingCart,
  Settings,
  PenTool,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Check,
  Lightbulb,
  FileText,
  Rocket,
  ArrowUpRight,
} from 'lucide-react';
import { PublicNavbar } from '../components/landing/PublicNavbar';
import { Footer } from '../components/layout/Footer';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';

interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  visualType: 'web' | 'ecommerce' | 'software' | 'uiux' | 'redesign' | 'maintenance';
  deliverables: string[];
  techStack: string[];
}

export const ServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  const services: ServiceDetail[] = [
    {
      id: 'web-development',
      title: 'Web Development',
      description:
        'Custom websites and web applications built with modern technologies for performance and scalability.',
      icon: Code2,
      iconBg: 'bg-indigo-500/20 border-indigo-500/30',
      iconColor: 'text-indigo-400',
      visualType: 'web',
      deliverables: [
        'Single Page & Multi-Page Web Applications',
        'SEO-optimized, server-rendered platforms',
        'Headless CMS & REST/GraphQL API integration',
        'Sub-second page loading & accessibility compliance',
      ],
      techStack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'MongoDB'],
    },
    {
      id: 'ecommerce-development',
      title: 'E-Commerce Development',
      description:
        'Powerful e-commerce solutions with secure payments, inventory management and seamless user experience.',
      icon: ShoppingCart,
      iconBg: 'bg-purple-500/20 border-purple-500/30',
      iconColor: 'text-purple-400',
      visualType: 'ecommerce',
      deliverables: [
        'Custom shopping cart & high-converting checkout funnels',
        'Stripe, PayPal, and multi-currency global gateways',
        'Inventory reservation & real-time stock alerts',
        'Comprehensive admin & analytics dashboard',
      ],
      techStack: ['Next.js', 'Stripe API', 'Node.js', 'PostgreSQL / MongoDB', 'Tailwind'],
    },
    {
      id: 'custom-software',
      title: 'Custom Software',
      description:
        'Tailored software solutions to solve your unique business challenges and automate your processes.',
      icon: Settings,
      iconBg: 'bg-blue-500/20 border-blue-500/30',
      iconColor: 'text-blue-400',
      visualType: 'software',
      deliverables: [
        'Bespoke internal workflow & CRM platforms',
        'Role-based access matrix (RBAC) & audit logs',
        'Automated telemetry & data visualization',
        'Third-party cloud & API synchronization',
      ],
      techStack: ['React', 'Node.js', 'Express', 'Redis', 'Docker'],
    },
    {
      id: 'uiux-design',
      title: 'UI/UX Design',
      description:
        'Beautiful and user-friendly designs that create memorable experiences and drive engagement.',
      icon: PenTool,
      iconBg: 'bg-purple-500/20 border-purple-500/30',
      iconColor: 'text-purple-400',
      visualType: 'uiux',
      deliverables: [
        'Wireframing & user flow journey mapping',
        'Interactive Figma prototypes with fluid micro-interactions',
        'Modern dark mode design systems & component libraries',
        'Usability testing & conversion rate optimization',
      ],
      techStack: ['Figma', 'Framer', 'Design Tokens', 'Tailwind', 'Storybook'],
    },
    {
      id: 'website-redesign',
      title: 'Website Redesign',
      description:
        'Modernize your existing website with a fresh look, better performance and improved user experience.',
      icon: RefreshCw,
      iconBg: 'bg-sky-500/20 border-sky-500/30',
      iconColor: 'text-sky-400',
      visualType: 'redesign',
      deliverables: [
        'Zero-downtime database & content migration',
        'Mobile-first responsive architecture overhaul',
        'Core Web Vitals & speed optimization (Score > 90)',
        'Modern glassmorphism & typography refresh',
      ],
      techStack: ['React', 'Next.js', 'Lighthouse Audit', 'Tailwind CSS'],
    },
    {
      id: 'maintenance-support',
      title: 'Maintenance & Support',
      description:
        'Keep your platform secure, updated and running smoothly with our ongoing support services.',
      icon: ShieldCheck,
      iconBg: 'bg-indigo-500/20 border-indigo-500/30',
      iconColor: 'text-indigo-400',
      visualType: 'maintenance',
      deliverables: [
        '24/7 uptime & health telemetry monitoring',
        'Scheduled database backups & disaster recovery drills',
        'Security patch audits & vulnerability mitigation',
        'Dedicated SLA support & rapid feature iterations',
      ],
      techStack: ['Docker', 'AWS / Cloudflare', 'MongoDB Atlas', 'Datadog'],
    },
  ];

  // Process steps
  const processSteps = [
    {
      step: '01',
      title: 'Idea',
      icon: Lightbulb,
      description: 'We understand your vision and goals.',
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

  // Tech items
  const technologies = [
    { name: 'React', iconText: '⚛️' },
    { name: 'Node.js', iconText: 'JS' },
    { name: 'Express', iconText: 'ex' },
    { name: 'MongoDB', iconText: '🍃' },
    { name: 'TypeScript', iconText: 'TS' },
    { name: 'Git', iconText: 'git' },
    { name: 'Docker', iconText: '🐳' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC]">
      <PublicNavbar />

      <main className="space-y-20 py-10 md:py-14">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Our Services)                                            */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Ambient background glows */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-600/15 via-indigo-600/20 to-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
            {/* Left Column: Heading, Subtitle, 3 Badges */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Top Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-indigo-500/30 backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-indigo-300">
                  • Our Services
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.12]">
                We Build Digital Solutions for{' '}
                <span className="text-gradient-brand drop-shadow-[0_0_35px_rgba(192,132,252,0.35)]">
                  Your Growth
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl font-normal">
                From stunning websites to powerful web applications, we offer end-to-end digital solutions to help businesses and individuals turn their ideas into reality.
              </p>

              {/* 3 Key Trust Badges */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                {/* Badge 1 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Modern Technology</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Latest tools & frameworks</p>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Secure & Reliable</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Your data, our priority</p>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">On-Time Delivery</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">We respect your time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Laptop, Phone, and Floating Badges */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[420px] h-[300px] flex items-center justify-center">

                {/* Floating Badge 1: React (Top Left) */}
                <div className="absolute top-2 left-6 z-20 animate-float">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 border border-cyan-500/40 text-cyan-400 text-xs font-bold shadow-lg backdrop-blur-md">
                    <span>⚛️</span>
                    <span>React</span>
                  </div>
                </div>

                {/* Floating Badge 2: Node.js (Top Right) */}
                <div className="absolute top-0 right-10 z-20 animate-float-delayed">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-lg backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Node.js</span>
                  </div>
                </div>

                {/* Floating Badge 3: MongoDB (Right) */}
                <div className="absolute top-20 -right-2 z-20 animate-float">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-lg backdrop-blur-md">
                    <span>🍃</span>
                    <span>MongoDB</span>
                  </div>
                </div>

                {/* Floating "Build Your Dream Project" Card */}
                <div className="absolute bottom-24 -left-4 z-20 animate-float-slow hidden sm:block">
                  <div className="px-3.5 py-2 rounded-2xl bg-[#0F172A]/90 border border-indigo-500/30 text-xs font-bold text-indigo-300 shadow-xl backdrop-blur-md">
                    <p className="text-[10px] text-gray-400 font-normal">Build</p>
                    <p className="text-xs text-white">Your Dream Project</p>
                  </div>
                </div>

                {/* Central 3D Laptop Mockup */}
                <div className="relative z-10 w-[270px] sm:w-[320px]">
                  <div className="rounded-t-xl bg-[#0A0E17] border-2 border-slate-700 p-2 shadow-2xl">
                    <div className="rounded-lg bg-[#070A12] p-2.5 font-mono text-[9px] text-gray-300 space-y-1 overflow-hidden">
                      <div className="flex items-center gap-1.5 pb-1 border-b border-white/10 text-gray-400 text-[8px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="ml-1 text-gray-300">Solutions.tsx</span>
                      </div>
                      <p className="text-cyan-400">const deploy = () =&gt; &#123;</p>
                      <p className="text-purple-400 pl-2">return &lt;DigitalGrowth /&gt;;</p>
                      <p className="text-cyan-400">&#125;;</p>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-b-md shadow-lg" />
                </div>

                {/* Smartphone Mockup */}
                <div className="absolute right-4 bottom-2 z-30 w-20 h-40 rounded-xl bg-[#0A0E17] border-2 border-slate-600 p-1 shadow-2xl animate-float-delayed">
                  <div className="w-full h-full rounded-lg bg-[#0B0F19] p-1 flex flex-col justify-between">
                    <div className="w-6 h-1 rounded-full bg-slate-800 mx-auto" />
                    <div className="space-y-1 my-auto">
                      <div className="h-2 bg-cyan-400/30 rounded" />
                      <div className="h-2 bg-indigo-500/30 rounded" />
                      <div className="h-2 bg-purple-500/30 rounded" />
                    </div>
                    <div className="w-6 h-0.5 rounded-full bg-white/20 mx-auto" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SECTION: WHAT WE OFFER — OUR SERVICES (6 Rich Detailed Cards)         */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="space-y-2 text-left mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-indigo-500/30">
              <span className="text-xs font-semibold text-indigo-300">• What We Offer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our <span className="text-gradient-brand">Services</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
              We provide a wide range of digital services to help your business scale, innovate and succeed in the online world.
            </p>
          </div>

          {/* 6 Rich Service Cards Grid (3 Columns Desktop, 2 Tablet, 1 Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className="rounded-2xl bg-[#0F172A]/75 hover:bg-[#131B33]/90 border border-white/8 hover:border-indigo-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group shadow-xl cursor-pointer text-left relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Row: Service Icon (Left) + Graphic/Illustration Box (Right) */}
                    <div className="flex items-start justify-between gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl ${s.iconBg} border flex items-center justify-center ${s.iconColor} transition-transform duration-300 group-hover:scale-110 shadow-sm`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Service Illustration Preview Box matching reference image */}
                      <div className="w-28 h-18 rounded-xl bg-slate-900/80 border border-white/5 p-1.5 flex flex-col justify-between overflow-hidden shadow-inner">
                        {s.visualType === 'web' && (
                          <div className="w-full h-full rounded bg-[#090D16] p-1 flex flex-col justify-between">
                            <div className="flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-red-400" />
                              <span className="w-1 h-1 rounded-full bg-emerald-400" />
                              <div className="h-1 w-10 bg-white/10 rounded ml-1" />
                            </div>
                            <div className="h-7 w-full bg-gradient-to-t from-indigo-950 to-cyan-950 rounded flex items-center justify-center text-[7px] text-cyan-300 font-mono">
                              &lt;Web /&gt;
                            </div>
                          </div>
                        )}

                        {s.visualType === 'ecommerce' && (
                          <div className="w-full h-full rounded bg-[#090D16] p-1 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                              <ShoppingCart className="w-5 h-5" />
                            </div>
                          </div>
                        )}

                        {s.visualType === 'software' && (
                          <div className="w-full h-full rounded bg-[#090D16] p-1 space-y-1">
                            <div className="h-2 w-full bg-blue-500/20 rounded" />
                            <div className="h-2 w-3/4 bg-blue-500/30 rounded" />
                            <div className="h-2 w-1/2 bg-blue-500/20 rounded" />
                          </div>
                        )}

                        {s.visualType === 'uiux' && (
                          <div className="w-full h-full rounded bg-[#090D16] p-1 flex items-center justify-between gap-1">
                            <div className="w-8 h-full rounded bg-purple-500/20 border border-purple-500/30" />
                            <div className="flex-1 h-full rounded bg-indigo-500/20 border border-indigo-500/30" />
                          </div>
                        )}

                        {s.visualType === 'redesign' && (
                          <div className="w-full h-full rounded bg-[#090D16] p-1 flex items-center justify-between text-[8px] font-mono">
                            <span className="text-gray-500">Before</span>
                            <span className="text-cyan-400">→</span>
                            <span className="text-emerald-400 font-bold">After</span>
                          </div>
                        )}

                        {s.visualType === 'maintenance' && (
                          <div className="w-full h-full rounded bg-[#090D16] p-1 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {s.title}
                    </h3>

                    {/* Service Description */}
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                      {s.description}
                    </p>
                  </div>

                  {/* Bottom Row: Learn More link & Circular arrow button */}
                  <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>

                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-gray-400 transition-all duration-200">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SECTION: HOW WE WORK (Our Process)                                     */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="space-y-6 text-left mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-cyan-500/30">
              <span className="text-xs font-semibold text-cyan-300">• Our Process</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  How We <span className="text-gradient-cyan">Work</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed mt-1">
                  Our streamlined development process ensures your project is delivered on time, with high quality and complete transparency.
                </p>
              </div>

              <Link to="/request">
                <Button
                  variant="primary"
                  size="md"
                  className="rounded-full shadow-glow-primary px-6"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* 6 Connected Steps Horizontal Pipeline */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
            {processSteps.map((s, idx) => {
              const Icon = s.icon;
              const isLast = idx === processSteps.length - 1;

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

                    {/* Connecting Arrow for Desktop */}
                    {!isLast && (
                      <div className="hidden lg:flex items-center justify-center absolute -right-6 top-1/2 -translate-y-1/2 text-gray-600 z-10">
                        <ArrowRight className="w-4 h-4 opacity-60 group-hover:text-cyan-400 group-hover:opacity-100 transition-colors" />
                      </div>
                    )}
                  </div>

                  {/* Step Title */}
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold text-gray-400 font-mono">
                        {s.step}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-[150px] mx-auto">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SECTION: TECHNOLOGIES WE USE (Ribbon + Terminal Code Card)             */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1.5 text-left mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-cyan-500/30">
              <span className="text-xs font-semibold text-cyan-300">• Technologies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Technologies We Use
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
              We work with the latest technologies to build high-quality solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Tech Badges Row (col-span-8) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {technologies.map((t, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#0F172A]/70 hover:bg-[#131B33]/90 border border-white/5 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 group shadow-md"
                >
                  <span className="text-2xl mb-1">{t.iconText}</span>
                  <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors truncate">
                    {t.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Neon Terminal Code Card (col-span-4) matching reference image */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0F172A]/90 border border-indigo-500/30 shadow-2xl relative overflow-hidden text-left flex items-center justify-between">
              <div className="space-y-1 font-mono text-xs sm:text-sm">
                <p className="text-cyan-400 font-bold">// Build</p>
                <p className="text-indigo-400 font-bold">// Innovate</p>
                <p className="text-purple-400 font-bold">// Grow</p>
              </div>

              {/* 3D Polyhedron Diamond graphic */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/30 to-purple-500/30 border border-indigo-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] animate-float">
                <Sparkles className="w-7 h-7 text-indigo-300" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. BANNER: HAVE AN IDEA? LET'S BUILD IT TOGETHER                          */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0C1A38] via-[#151D45] to-[#1F174A] border border-indigo-500/30 p-8 sm:p-12 shadow-[0_0_50px_rgba(99,102,241,0.2)] relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-left">
            
            {/* Left Content */}
            <div className="space-y-3 max-w-xl relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                Ready to Get Started?
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Have an idea? Let's build it together.
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                Tell us about your project and our team will get back to you within 24 hours.
              </p>
              <div className="pt-2">
                <Link
                  to="/request"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-slate-950 bg-white hover:bg-gray-100 shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <span>Request a Custom Website</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>
              </div>
            </div>

            {/* Right Graphic: Laptop, Phone, and Hand-drawn Arrow Message */}
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              {/* Mini Laptop & Phone Graphics */}
              <div className="relative w-44 h-24 flex items-center justify-center">
                <div className="w-32 h-20 rounded-t-lg bg-[#0F172A] border border-cyan-500/30 p-1 shadow-lg">
                  <div className="w-full h-full bg-[#080B12] rounded p-1 font-mono text-[7px] text-cyan-300 flex items-center justify-center">
                    &lt;DevCraft /&gt;
                  </div>
                </div>
                <div className="absolute -right-2 bottom-0 w-10 h-18 rounded-lg bg-[#0A0E17] border border-slate-600 p-0.5 shadow-md">
                  <div className="w-full h-full bg-[#0B0F19] rounded flex items-center justify-center text-[5px] text-indigo-300">
                    App
                  </div>
                </div>
              </div>

              {/* Hand-drawn Arrow Message text matching reference image */}
              <div className="text-xs font-mono text-cyan-300 text-center sm:text-left space-y-0.5">
                <p>Your Idea</p>
                <p>Our Code</p>
                <p className="font-bold text-white">Great Result</p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Service Detail Inspection Modal */}
      <Modal
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        title={selectedService?.title || 'Service Overview'}
      >
        {selectedService && (
          <div className="space-y-4 text-left text-xs">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="text-base font-bold text-white">{selectedService.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {selectedService.description}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Key Deliverables & Specifications
              </p>
              <div className="space-y-1.5">
                {selectedService.deliverables.map((deliv, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Technology Architecture
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedService.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-mono font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <Link to={`/request?service=${selectedService.id}`} className="flex-1">
                <Button variant="primary" size="sm" className="w-full">
                  <span>Request Quote For This Service</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
              <Button variant="secondary" size="sm" onClick={() => setSelectedService(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ServicesPage;
