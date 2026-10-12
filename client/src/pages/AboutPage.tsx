import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  ShieldCheck,
  Users,
  Code2,
  ArrowRight,
  Sparkles,
  Calendar,
  Star,
  UserCheck,
  CheckCircle2,
  Heart,
  Zap,
  Lightbulb,
  Check,
  Linkedin,
  Github,
  Instagram,
  X,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { PublicNavbar } from '../components/landing/PublicNavbar';
import { Footer } from '../components/layout/Footer';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  badge?: string;
  image: string;
  shortBio?: string;
  bio: string;
  specialties?: string[];
  skills: string[];
  linkedin: string;
  github: string;
  instagram?: string;
  email?: string;
  accent?: {
    text: string;
    badgeBg: string;
    border: string;
    glow: string;
    ring: string;
    gradient: string;
  };
}

const DEFAULT_ACCENTS = [
  {
    text: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    border: 'hover:border-cyan-500/50',
    glow: 'group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    ring: 'ring-cyan-500/40',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
  },
  {
    text: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
    border: 'hover:border-indigo-500/50',
    glow: 'group-hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]',
    ring: 'ring-indigo-500/40',
    gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
  },
  {
    text: 'text-purple-400',
    badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    border: 'hover:border-purple-500/50',
    glow: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]',
    ring: 'ring-purple-500/40',
    gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
  },
];

const CORE_CREATORS: TeamMember[] = [
  {
    id: 'sahil-sekh',
    name: 'Sahil Sekh',
    role: 'Lead Full Stack & UI Architect',
    badge: 'UI Architecture Lead',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    shortBio: 'Frontend architect and full-stack specialist crafting interactive user interfaces and micro-animations.',
    bio: 'Sahil is a Senior Full Stack Developer specializing in responsive design architectures, high-performance React ecosystems, dynamic animations, and state orchestration. He leads the visual fidelity, UX design language, and frontend performance at Reliable InfoTech.',
    specialties: ['React / Next.js', 'Interactive UI & Motion', 'TypeScript Ecosystem', 'Component Systems'],
    skills: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'REST/GraphQL', 'UI/UX Design'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'sahil@reliableinfotech.io',
    accent: DEFAULT_ACCENTS[0],
  },
  {
    id: 'diganta-chakraborty',
    name: 'Diganta Chakraborty',
    role: 'Senior Full Stack & Systems Engineer',
    badge: 'Cloud & API Systems Lead',
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    shortBio: 'Full-stack systems engineer focused on resilient backend microservices, databases, and secure APIs.',
    bio: 'Diganta leads backend engineering, data modeling, database optimizations, and secure API gateways. With a deep passion for scalable architecture, he ensures every system behind Reliable InfoTech is lightning fast, reliable, and fault-tolerant.',
    specialties: ['Backend Engineering', 'Database Design & SQL', 'Cloud Microservices', 'API Security & Auth'],
    skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST APIs', 'System Design', 'Docker', 'Redis'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'diganta@reliableinfotech.io',
    accent: DEFAULT_ACCENTS[1],
  },
  {
    id: 'priyajit-das',
    name: 'Priyajit Das',
    role: 'Founder & Principal Systems Architect',
    badge: 'Founder & Systems Architect',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    shortBio: 'Visionary architect and founder steering enterprise digital transformations, cloud infrastructure, and technical strategy.',
    bio: 'Priyajit is the Founder and Principal Systems Architect behind Reliable InfoTech. He leads technical roadmap execution, enterprise web strategy, scalable cloud platforms, and end-to-end full-stack digital transformations with unwavering dedication to engineering excellence.',
    specialties: ['Enterprise Architecture', 'Cloud Infrastructure', 'Technical Leadership', 'Full Stack Core'],
    skills: ['Cloud Architecture', 'DevOps & CI/CD', 'Full Stack Development', 'Product Strategy', 'System Scaling'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'priyajit@reliableinfotech.io',
    accent: DEFAULT_ACCENTS[2],
  },
];

export const AboutPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const parseStoredMembers = (): TeamMember[] => {
    try {
      localStorage.removeItem('reliable_admin_team_members');
      localStorage.removeItem('devcraft_team_members');
      const saved = localStorage.getItem('reliable_foundation_team_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const fakeNames = [
            'sarah chen',
            'rahul sharma',
            'priya mehta',
            'amit verma',
            'neha singh',
            'alex rivera',
          ];
          const demoIds = ['tm_1', 'tm_2', 'tm_3', 'tm_4', 'tm_5', 'tm_6'];
          const valid = parsed.filter(
            (m: any) =>
              m &&
              m.name &&
              !demoIds.includes(m.id) &&
              !fakeNames.includes(m.name.toLowerCase().trim())
          );
          if (valid.length > 0) {
            return valid.map((m: any, idx: number) => {
              const matchedCreator = CORE_CREATORS.find((c) => c.id === m.id || c.name.toLowerCase() === m.name?.toLowerCase());
              return {
                id: m.id,
                name: m.name,
                role: m.role || matchedCreator?.role || 'Core Engineer',
                badge: m.badge || matchedCreator?.badge || (m.department ? `${m.department} Lead` : 'Engineering Specialist'),
                image: m.avatar || m.image || matchedCreator?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
                shortBio: m.shortBio || matchedCreator?.shortBio || m.bio || `Specialist in ${m.department || 'full-stack engineering'} architecting resilient digital platforms.`,
                bio: m.bio || matchedCreator?.bio || `Core specialist contributing to scalable enterprise web platforms at Reliable Info Tech.`,
                specialties: m.specialties || matchedCreator?.specialties || (m.skills?.slice(0, 4)) || ['Full Stack', 'Modern Web', 'Reliable Tech', 'Cloud Architecture'],
                skills: m.skills || matchedCreator?.skills || ['Full Stack', 'Modern Web', 'Reliable Info Tech'],
                linkedin: m.linkedin || matchedCreator?.linkedin || 'https://linkedin.com',
                github: m.github || matchedCreator?.github || 'https://github.com',
                instagram: m.instagram || matchedCreator?.instagram || 'https://instagram.com',
                email: m.email || matchedCreator?.email || 'contact@reliableinfotech.io',
                accent: matchedCreator?.accent || DEFAULT_ACCENTS[idx % DEFAULT_ACCENTS.length],
              };
            });
          }
        }
      }
    } catch (e) {}
    return CORE_CREATORS;
  };

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(parseStoredMembers);

  useEffect(() => {
    const handleUpdate = () => {
      setTeamMembers(parseStoredMembers());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('reliable_team_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('reliable_team_updated', handleUpdate);
    };
  }, []);

  const values = [
    {
      id: 'innovation',
      title: 'Innovation',
      description: 'We embrace new technologies and creative solutions.',
      icon: Lightbulb,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'quality',
      title: 'Quality',
      description: 'We deliver clean, scalable and maintainable code.',
      icon: ShieldCheck,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'collaboration',
      title: 'Collaboration',
      description: 'We grow stronger by working together.',
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      id: 'customer-focus',
      title: 'Customer Focus',
      description: 'Your success is our biggest reward.',
      icon: Heart,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      id: 'continuous-growth',
      title: 'Continuous Growth',
      description: 'We keep learning and improving every day.',
      icon: Zap,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#EEEEEE] selection:bg-[#EEEEEE] selection:text-[#121212] font-sans">
      <PublicNavbar />

      <main className="space-y-24 py-10 md:py-16">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: About Reliable Info Tech                                */}
        {/* ========================================================================= */}
        <section className="max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="nf-frame nf-frame-hover relative overflow-hidden rounded bg-[#121212] border border-[#262626] p-6 sm:p-10 shadow-xl">
            <span className="nf-c nf-c-tl" />
            <span className="nf-c nf-c-tr" />
            <span className="nf-c nf-c-bl" />
            <span className="nf-c nf-c-br" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
              {/* Left Column: Heading, Subtitle, 3 Badges */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Top Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-mono tracking-wider text-[#A1A1AA] bg-[#181818] border border-[#262626]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                  <span>ABOUT · RELIABLE INFOTECH</span>
                </div>

                {/* Main Headline */}
                <div className="py-2.5 px-3 -mx-3 border-y border-[#262626] bg-gradient-to-r from-[#181818] via-[#141414] to-transparent">
                  <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
                    <span>We Build </span>
                    <span className="font-serif italic text-white/90">Digital Systems That Matter</span>
                  </h1>
                </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl font-normal">
                Reliable Info Tech is a modern software development company focused on creating innovative web applications, e-commerce platforms, and custom digital solutions for businesses and individuals.
              </p>

              {/* 3 Key Feature / Trust Badges */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                {/* Badge 1 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md flex items-center gap-3 hover:border-cyan-500/30 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Innovative Solutions</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Modern & Scalable</p>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md flex items-center gap-3 hover:border-blue-500/30 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Trusted Partner</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Quality & Security</p>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md flex items-center gap-3 hover:border-purple-500/30 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Client Focused</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Your Success, Our Priority</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Laptop, Code Card, Cloud Card, Phone */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[430px] h-[320px] flex items-center justify-center">

                {/* Floating Neon Code Symbol Card (Top Left) */}
                <div className="absolute top-2 left-6 z-20 animate-float">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600/80 to-purple-600/80 border border-indigo-400/40 flex items-center justify-center text-white shadow-glow-primary backdrop-blur-md">
                    <Code2 className="w-6 h-6" />
                  </div>
                </div>

                {/* Floating Cloud Milestone Card (Right Side) */}
                <div className="absolute top-4 right-2 z-20 animate-float-delayed">
                  <div className="px-3.5 py-2.5 rounded-2xl bg-[#0F172A]/90 border border-indigo-500/30 shadow-2xl backdrop-blur-md space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-200">Plan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                        <Check className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-200">Design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                        <Check className="w-3 h-3 text-indigo-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-200">Develop</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                        <Check className="w-3 h-3 text-purple-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-200">Launch</span>
                    </div>
                  </div>
                </div>

                {/* Floating 3D Diamond / Cube (Bottom Left) */}
                <div className="absolute bottom-6 left-4 z-20 animate-float-slow hidden sm:block">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/30 via-indigo-500/40 to-purple-500/40 border border-cyan-400/30 flex items-center justify-center shadow-lg backdrop-blur-md">
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                  </div>
                </div>

                {/* Central 3D Laptop Mockup */}
                <div className="relative z-10 w-[260px] max-w-[calc(100%-2rem)] sm:w-[320px]">
                  <div className="rounded-t-xl bg-[#0A0E17] border-2 border-slate-700 p-2 shadow-2xl">
                    <div className="rounded-lg bg-[#070A12] p-2.5 font-mono text-[9px] text-gray-300 space-y-1 overflow-hidden">
                      <div className="flex items-center gap-1.5 pb-1 border-b border-white/10 text-gray-400 text-[8px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="ml-1 text-gray-300">AboutReliableInfoTech.tsx</span>
                      </div>
                      <p className="text-cyan-400">const team = [</p>
                      <p className="text-purple-400 pl-2">&#39;Passion&#39;, &#39;Innovation&#39;, &#39;Quality&#39;</p>
                      <p className="text-cyan-400">];</p>
                      <p className="text-emerald-400">export default DigitalReality;</p>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-b-md shadow-lg" />
                </div>

                {/* Smartphone Preview Frame (Floating Right) */}
                <div className="absolute right-2 sm:right-12 bottom-4 z-30 w-20 h-40 rounded-xl bg-[#0A0E17] border-2 border-slate-600 p-1 shadow-2xl animate-float-delayed">
                  <div className="w-full h-full rounded-lg bg-[#0B0F19] p-1 flex flex-col justify-between">
                    <div className="w-6 h-1 rounded-full bg-slate-800 mx-auto" />
                    <div className="space-y-1 my-auto">
                      <div className="h-2 bg-indigo-500/40 rounded" />
                      <div className="h-2 bg-purple-500/40 rounded" />
                      <div className="h-2 bg-cyan-400/40 rounded" />
                    </div>
                    <div className="w-6 h-0.5 rounded-full bg-white/20 mx-auto" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

        {/* ========================================================================= */}
        {/* 2. SECTION: OUR STORY (Text, Workstation Photo & 4 Stats Cards)            */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Story narrative & Projects CTA button (col-span-4) */}
            <div className="lg:col-span-4 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-indigo-500/30">
                <span className="text-xs font-semibold text-indigo-300">• Our Story</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                From a Simple Idea to a{' '}
                <span className="text-gradient-brand">Growing Team</span>
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                Reliable Info Tech started with a passion for technology and a simple belief — that great ideas deserve great digital products. What began as a small team of passionate developers has now grown into a full-service software development company helping businesses turn their ideas into reality.
              </p>

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal">
                Today, we work with clients from around the world, building modern websites, web applications, e-commerce platforms, and custom software solutions that make a real impact.
              </p>

              <div className="pt-2">
                <Link to="/projects">
                  <Button
                    variant="primary"
                    size="md"
                    className="rounded-full shadow-glow-primary px-6"
                  >
                    <span>Our Projects</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Center Column: High Quality Developer Workstation Setup (col-span-5) */}
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0F172A] aspect-[16/11]">
                <img
                  src="/images/workstation.jpg"
                  alt="Reliable Info Tech Workstation Setup"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to high-res tech workstation if local image fails
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80';
                  }}
                />
                
                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-transparent to-black/20 pointer-events-none" />

                {/* Hand-drawn neon cursive text matching reference design */}
                <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                  <p className="text-xs sm:text-sm font-mono tracking-wider text-cyan-300 drop-shadow-[0_2px_10px_rgba(6,182,212,0.8)] font-semibold italic">
                    Ideas → Code → Reality
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Stat Cards Stack (col-span-3) */}
            <div className="lg:col-span-3 space-y-3.5">
              
              {/* Stat 1: 50+ Projects Completed */}
              <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-white/5 hover:border-indigo-500/30 transition-all text-left flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold text-white">50+</span>
                    <span className="text-xs font-semibold text-gray-300">Projects Completed</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    We&#39;ve delivered 50+ successful projects for clients worldwide.
                  </p>
                </div>
              </div>

              {/* Stat 2: 30+ Happy Clients */}
              <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-white/5 hover:border-blue-500/30 transition-all text-left flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold text-white">30+</span>
                    <span className="text-xs font-semibold text-gray-300">Happy Clients</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    Trusted by businesses and individuals across the globe.
                  </p>
                </div>
              </div>

              {/* Stat 3: 5+ Years Experience */}
              <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-white/5 hover:border-purple-500/30 transition-all text-left flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold text-white">5+</span>
                    <span className="text-xs font-semibold text-gray-300">Years Experience</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    Years of experience in web and mobile development.
                  </p>
                </div>
              </div>

              {/* Stat 4: 100% Quality Focus */}
              <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-white/5 hover:border-amber-500/30 transition-all text-left flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold text-white">100%</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    Our focus is always on delivering high-quality solutions.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SECTION: OUR TEAM (5 Team Cards Row)                                   */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="space-y-4 text-left mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-indigo-500/30">
              <span className="text-xs font-semibold text-indigo-300">• Our Team</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Meet the People Behind{' '}
                  <span className="text-gradient-brand">Reliable Info Tech</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed mt-1">
                  A passionate team of developers, designers, and problem-solvers working together to build amazing digital experiences.
                </p>
              </div>

              <Link to="/projects">
                <Button
                  variant="primary"
                  size="md"
                  className="rounded-full shadow-glow-primary px-6 shrink-0"
                >
                  <span>Our Projects</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Connected Team Member Cards Grid matching Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teamMembers.map((member) => {
              const accent = member.accent || DEFAULT_ACCENTS[0];

              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="nf-frame nf-frame-hover rounded bg-[#181818] hover:bg-[#1C1C1C] border border-[#262626] hover:border-[#363636] p-5 transition-colors cursor-pointer text-left shadow-md flex flex-col justify-between relative"
                >
                  <span className="nf-c nf-c-tl" />
                  <span className="nf-c nf-c-tr" />
                  <span className="nf-c nf-c-bl" />
                  <span className="nf-c nf-c-br" />

                  <div className="relative z-10 space-y-3.5">
                    {/* Top Row: Avatar & Status + Micro Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative">
                        <div
                          className={`w-14 h-14 rounded-2xl overflow-hidden ring-2 ${accent.ring} bg-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300`}
                        >
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                member.name
                              )}&background=2563eb&color=fff&bold=true`;
                            }}
                          />
                        </div>
                        {/* Active Beacon Dot */}
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#090E1A] ring-1 ring-white/10">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        </span>
                      </div>

                      {/* Role Pill */}
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${accent.badgeBg}`}
                      >
                        {member.badge || 'Engineering Lead'}
                      </span>
                    </div>

                    {/* Developer Name & Role */}
                    <div>
                      <h4
                        className={`text-base font-extrabold text-white group-hover:${accent.text} transition-colors flex items-center gap-1.5`}
                      >
                        <span>{member.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </h4>
                      <p className="text-xs font-medium text-gray-300 mt-0.5">
                        {member.role}
                      </p>
                      <p className="text-[11px] text-gray-400 leading-relaxed mt-2 line-clamp-2">
                        {member.shortBio || member.bio}
                      </p>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(member.specialties || member.skills.slice(0, 4)).map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] text-gray-300 border border-white/5 font-mono"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Interactive Links & View Profile CTA */}
                  <div
                    className="relative z-10 pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs"
                        title="GitHub Profile"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs"
                          title={`Email ${member.name}`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      ) : member.instagram ? (
                        <a
                          href={member.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs"
                          title="Instagram"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                        </a>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedMember(member)}
                      className={`text-[11px] font-semibold text-gray-400 group-hover:${accent.text} flex items-center gap-1 transition-colors`}
                    >
                      <span>Spotlight</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SECTION: OUR VALUES (5 Value Cards)                                    */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 text-left mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-indigo-500/30">
              <span className="text-xs font-semibold text-indigo-300">• Our Values</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  What Drives <span className="text-gradient-brand">Us</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed mt-1">
                  Our values shape how we work, how we build, and how we treat our clients.
                </p>
              </div>

              <Link to="/contact?subject=Careers">
                <Button
                  variant="primary"
                  size="md"
                  className="rounded-full shadow-glow-primary px-6 shrink-0"
                >
                  <span>Join Our Team</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* 5 Value Cards in a sleek horizontal grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.id}
                  className="p-5 rounded-2xl bg-[#0F172A]/80 hover:bg-[#131B33]/90 border border-white/8 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 group shadow-lg text-left flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-xl ${v.bg} border flex items-center justify-center ${v.color} mb-4 transition-transform group-hover:scale-110`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {v.title}
                    </h3>

                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CTA BANNER: LET'S BUILD SOMETHING GREAT TOGETHER                       */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0C1A38] via-[#151D45] to-[#1F174A] border border-indigo-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(99,102,241,0.2)] flex flex-col lg:flex-row items-center justify-between gap-6 text-left">
            
            {/* Left Content with Rocket */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-glow-primary shrink-0">
                <Rocket className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Let&#39;s Build Something Great Together
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Have a project in mind? We&#39;d love to hear from you.
                </p>
              </div>
            </div>

            {/* Connecting Arrow for Desktop */}
            <div className="hidden lg:flex items-center text-indigo-400/60 flex-1 justify-center px-8">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500 relative">
                <ArrowRight className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 text-indigo-300" />
              </div>
            </div>

            {/* Right Action Button */}
            <Link to="/contact">
              <Button
                variant="primary"
                size="md"
                className="rounded-full shadow-glow-primary px-7 py-3 text-sm font-semibold whitespace-nowrap"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>

          </div>
        </section>

      </main>

      {/* Team Member Interactive Spotlight Modal */}
      <Modal
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name || 'Developer Spotlight'}
      >
        {selectedMember && (
          <div className="space-y-6 text-left text-xs">
            {/* Header with Avatar & Title */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/8 relative overflow-hidden">
              <div
                className={`w-16 h-16 rounded-2xl overflow-hidden ring-2 ${
                  selectedMember.accent?.ring || 'ring-indigo-500/40'
                } shrink-0 bg-slate-800`}
              >
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-lg font-black text-white">{selectedMember.name}</h4>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      selectedMember.accent?.badgeBg || 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                    }`}
                  >
                    {selectedMember.badge || 'Engineering Lead'}
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-medium">{selectedMember.role}</p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={selectedMember.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                  {selectedMember.email ? (
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                      title="Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  ) : selectedMember.instagram ? (
                    <a
                      href={selectedMember.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Engineering Dossier / Biography */}
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Engineering Biography</span>
              </h5>
              <div className="p-3.5 rounded-xl bg-[#090E1A] border border-white/5 text-gray-300 leading-relaxed font-normal">
                {selectedMember.bio}
              </div>
            </div>

            {/* Core Tech Stack */}
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Core Technologies &amp; Architecture Focus</span>
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedMember.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 font-mono font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/8 flex items-center justify-between gap-3">
              <a
                href={selectedMember.email ? `mailto:${selectedMember.email}` : '/contact'}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-devcraft-primary to-devcraft-secondary hover:brightness-110 shadow-glow-primary transition-all active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Connect With {selectedMember.name.split(' ')[0]}</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;
