import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ArrowUp,
  Rocket,
  ArrowRight,
  Heart,
  Sparkles,
  Terminal,
  CheckCircle2,
  Github,
  Copy,
  Check,
  Zap,
  ExternalLink,
  ShieldCheck,
  Send,
  Cpu,
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface CreatorProfile {
  id: string;
  name: string;
  role: string;
  badge: string;
  avatar: string;
  initials: string;
  shortBio: string;
  fullBio: string;
  specialties: string[];
  skills: string[];
  github: string;
  linkedin: string;
  email: string;
  accent: {
    name: string;
    text: string;
    badgeBg: string;
    border: string;
    glow: string;
    gradient: string;
    ring: string;
  };
}

const CREATORS: CreatorProfile[] = [
  {
    id: 'sahil-sekh',
    name: 'Sahil Sekh',
    role: 'Lead Full Stack & UI Architect',
    badge: 'UI Architecture Lead',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    initials: 'SS',
    shortBio: 'Frontend architect and full-stack specialist crafting interactive user interfaces and micro-animations.',
    fullBio: 'Sahil is a Senior Full Stack Developer specializing in responsive design architectures, high-performance React ecosystems, dynamic animations, and state orchestration. He leads the visual fidelity, UX design language, and frontend performance at Reliable InfoTech.',
    specialties: ['React / Next.js', 'Interactive UI & Motion', 'TypeScript Ecosystem', 'Component Systems'],
    skills: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'REST/GraphQL', 'Vite', 'UI/UX Design'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'sahil@reliableinfotech.io',
    accent: {
      name: 'cyan',
      text: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
      border: 'hover:border-cyan-500/50',
      glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
      gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      ring: 'ring-cyan-500/40',
    },
  },
  {
    id: 'diganta-chakraborty',
    name: 'Diganta Chakraborty',
    role: 'Senior Full Stack & Systems Engineer',
    badge: 'Cloud & API Systems Lead',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    initials: 'DC',
    shortBio: 'Full-stack systems engineer focused on resilient backend microservices, databases, and secure APIs.',
    fullBio: 'Diganta leads backend engineering, data modeling, database optimizations, and secure API gateways. With a deep passion for scalable architecture, he ensures every system behind Reliable InfoTech is lightning fast, reliable, and fault-tolerant.',
    specialties: ['Backend Engineering', 'Database Design & SQL', 'Cloud Microservices', 'API Security & Auth'],
    skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST APIs', 'System Design', 'Docker', 'Redis'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'diganta@reliableinfotech.io',
    accent: {
      name: 'indigo',
      text: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
      border: 'hover:border-indigo-500/50',
      glow: 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]',
      gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
      ring: 'ring-indigo-500/40',
    },
  },
  {
    id: 'priyajit-das',
    name: 'Priyajit Das',
    role: 'Founder & Principal Systems Architect',
    badge: 'Founder & Systems Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    initials: 'PD',
    shortBio: 'Visionary architect and founder steering enterprise digital transformations, cloud infrastructure, and technical strategy.',
    fullBio: 'Priyajit is the Founder and Principal Systems Architect behind Reliable InfoTech. He leads technical roadmap execution, enterprise web strategy, scalable cloud platforms, and end-to-end full-stack digital transformations with unwavering dedication to engineering excellence.',
    specialties: ['Enterprise Architecture', 'Cloud Infrastructure', 'Technical Leadership', 'Full Stack Core'],
    skills: ['Cloud Architecture', 'DevOps & CI/CD', 'Full Stack Development', 'Product Strategy', 'System Scaling', 'Database Optimization'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'priyajit@reliableinfotech.io',
    accent: {
      name: 'purple',
      text: 'text-purple-400',
      badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
      border: 'hover:border-purple-500/50',
      glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
      ring: 'ring-purple-500/40',
    },
  },
];

export const Footer: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('contact@reliableinfotech.io');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <footer className="w-full bg-[#0B0B0B] border-t border-[#262626] pt-16 pb-12 text-[#8D8D8D] select-none relative overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. MAIN GRID (5 Columns)                                                  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-[#262626] text-left items-start">
          
          {/* Column 1: Brand Info (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded border border-[#363636] bg-[#181818] p-1 flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src="/reliable-symbol.png"
                  alt="Reliable InfoTech Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[15px] font-semibold text-[#EEEEEE] tracking-tight flex items-center">
                <span>Reliable</span>
                <span className="text-[#8D8D8D] font-serif italic ml-1.5 font-normal text-base">InfoTech</span>
              </span>
            </Link>

            <p className="text-xs text-[#8D8D8D] leading-relaxed max-w-xs font-normal">
              We engineer scalable web applications, enterprise software, e-commerce architectures and custom digital products for businesses worldwide.
            </p>

            {/* Live Operational Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Available for New Projects</span>
            </div>

            {/* Social Icons with Glowing States */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
                { Icon: Github, href: 'https://github.com', label: 'GitHub' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 border border-transparent flex items-center justify-center text-gray-400 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(6,182,212,0.4)] hover:-translate-y-0.5 transition-all duration-200"
                  aria-label={label}
                  title={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { to: '/', label: 'Home' },
                { to: '/projects', label: 'Projects' },
                { href: '#services', label: 'Services' },
                { href: '#process', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map((item, idx) => (
                <li key={idx}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className="group flex items-center gap-1.5 hover:text-white transition-all duration-200 hover:translate-x-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-cyan-400 transition-colors" />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="group flex items-center gap-1.5 hover:text-white transition-all duration-200 hover:translate-x-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-cyan-400 transition-colors" />
                      <span>{item.label}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services (col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                'Web Development',
                'E-Commerce',
                'Custom Software',
                'UI/UX Design',
                'Cloud & Maintenance',
              ].map((service, idx) => (
                <li key={idx}>
                  <a
                    href="#services"
                    className="group flex items-center gap-1.5 hover:text-white transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-indigo-400 transition-colors" />
                    <span>{service}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Details (col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Contact
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="relative group">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex items-center gap-2 text-left hover:text-white transition-colors w-full focus:outline-none"
                  title="Click to copy email address"
                >
                  <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 text-indigo-400 transition-colors">
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Mail className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate text-gray-300 group-hover:text-white">
                      contact@reliableinfotech.io
                    </span>
                    <span className="text-[10px] text-cyan-400/80 group-hover:text-cyan-300 flex items-center gap-1 mt-0.5">
                      {copiedEmail ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Copied to clipboard!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Copy className="w-2.5 h-2.5" /> Click to copy
                        </span>
                      )}
                    </span>
                  </div>
                </button>
              </li>
              <li className="flex items-center gap-2 group">
                <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <Phone className="w-3 h-3" />
                </div>
                <a href="tel:+15551234567" className="hover:text-white transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2 group">
                <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <MapPin className="w-3 h-3" />
                </div>
                <span>Berkeley, CA, USA</span>
              </li>
              <li className="pt-1">
                <div className="px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] text-gray-400 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Avg. response time: &lt; 2 hours</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 5: Right Banner "Have a project in mind?" (col-span-3) */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-950/90 via-[#151D42] to-blue-950/90 border border-indigo-500/40 p-5 space-y-3 text-left shadow-glow-primary relative overflow-hidden group hover:border-indigo-400 transition-all duration-300">
              {/* Background ambient shine */}
              <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:text-cyan-300 transition-all">
                <Rocket className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Have a project in mind?</span>
                </h4>
                <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                  Let&#39;s bring your ideas to life with our expert full-stack engineering team.
                </p>
              </div>
              <Link
                to="/request"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-devcraft-primary to-devcraft-secondary hover:from-devcraft-primaryHover hover:to-[#7C3AED] shadow-md hover:shadow-glow-secondary transition-all hover:scale-105 active:scale-95 group/btn"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. EXCLUSIVE ANIMATED DEVELOPER SHOWCASE & SIGNATURE SECTION              */}
        {/* ========================================================================= */}
        <div className="my-6 sm:my-7 relative">
          <div className="nf-frame rounded bg-[#181818] border border-[#262626] p-4 sm:p-5 lg:p-6 shadow-sm relative overflow-hidden">
            <span className="nf-c nf-c-tl" />
            <span className="nf-c nf-c-tr" />
            <span className="nf-c nf-c-bl" />
            <span className="nf-c nf-c-br" />

            {/* Showcase Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-3.5 border-b border-[#262626] relative z-10 text-left">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider text-[#A1A1AA] bg-[#121212] border border-[#262626]">
                  <Sparkles className="w-3 h-3 text-[#E4E4E7]" />
                  <span>CORE ENGINEERING LEADERSHIP</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse ml-0.5" />
                </div>
                <h3 className="text-base sm:text-lg font-normal text-[#EEEEEE] tracking-tight mt-1">
                  <span>Architected &amp; Engineered by </span>
                  <span className="font-serif italic text-[#C9C9C9]">Senior Full-Stack Specialists</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-[#8D8D8D] mt-0.5 max-w-xl font-normal leading-relaxed">
                  Handcrafted with performance, security, and responsive elegance. Click any developer to view technical dossier.
                </p>
              </div>

              {/* Live Terminal / Git Build Badge */}
              <div className="flex items-center gap-2 bg-[#121212] border border-[#262626] rounded px-2.5 py-1.5 text-[11px] font-mono text-[#A1A1AA] shrink-0 self-start sm:self-center">
                <Terminal className="w-3 h-3 text-[#A1A1AA] shrink-0" />
                <span className="text-[#71717A]">git:</span>
                <span className="text-[#EEEEEE] font-semibold">prod/v2.4.0</span>
                <span className="text-[#363636]">|</span>
                <span className="text-[#A1A1AA] flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-[#EEEEEE]" />
                  TS + CANVAS 3D
                </span>
              </div>
            </div>

            {/* 3 Developer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-3.5 sm:pt-4 relative z-10">
              {CREATORS.map((creator) => (
                <div
                  key={creator.id}
                  onClick={() => setSelectedCreator(creator)}
                  className="nf-frame nf-frame-hover group relative rounded bg-[#121212] hover:bg-[#151515] border border-[#262626] hover:border-[#363636] p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left shadow-sm flex flex-col justify-between"
                >
                  <span className="nf-c nf-c-tl" />
                  <span className="nf-c nf-c-tr" />
                  <span className="nf-c nf-c-bl" />
                  <span className="nf-c nf-c-br" />

                  <div className="relative z-10 space-y-2.5">
                    {/* Top Row: Avatar & Status + Micro Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-xl overflow-hidden ring-1.5 ${creator.accent.ring} bg-slate-800 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback placeholder if unsplash fails
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.parentElement) {
                                target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center font-bold text-xs text-white bg-indigo-600/50">${creator.initials}</div>`;
                              }
                            }}
                          />
                        </div>
                        {/* Active Beacon Dot */}
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#090E1A] ring-1 ring-white/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                        </span>
                      </div>

                      {/* Role Pill */}
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${creator.accent.badgeBg}`}>
                        {creator.badge}
                      </span>
                    </div>

                    {/* Developer Name & Role */}
                    <div>
                      <h4 className={`text-sm font-bold text-white group-hover:${creator.accent.text} transition-colors flex items-center gap-1.5`}>
                        <span>{creator.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </h4>
                      <p className="text-[11px] font-medium text-gray-300 mt-0.5">
                        {creator.role}
                      </p>
                      <p className="text-[11px] text-gray-400 leading-relaxed mt-1.5 line-clamp-2">
                        {creator.shortBio}
                      </p>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {creator.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.03] text-gray-300 border border-white/5 font-mono"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Interactive Links & View Profile CTA */}
                  <div
                    className="relative z-10 pt-2.5 mt-2.5 border-t border-white/5 flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1">
                      <a
                        href={creator.github}
                        target="_blank"
                        rel="noreferrer"
                        className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs"
                        title="GitHub Profile"
                      >
                        <Github className="w-3 h-3" />
                      </a>
                      <a
                        href={creator.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-3 h-3" />
                      </a>
                      <a
                        href={`mailto:${creator.email}`}
                        className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs"
                        title={`Email ${creator.name}`}
                      >
                        <Mail className="w-3 h-3" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCreator(creator)}
                      className={`text-[10px] sm:text-[11px] font-semibold text-gray-400 group-hover:${creator.accent.text} flex items-center gap-1 transition-colors`}
                    >
                      <span>Spotlight</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Interactive Command Bar */}
            <div className="mt-3.5 pt-2.5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-gray-400 font-mono relative z-10">
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                <span className="text-cyan-400 font-bold">$</span>
                <span className="text-gray-300 truncate">
                  reliable-infotech --authors &quot;Sahil Sekh, Diganta Chakraborty, Priyajit Das&quot;
                </span>
                <span className="text-emerald-400 font-bold shrink-0">[100% PRODUCTION READY]</span>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="flex items-center gap-1 text-gray-400">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  Enterprise Grade
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Ultra Fast Vite Engine
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM BAR: Copyright, Animated Heart Credits & Status                 */}
        {/* ========================================================================= */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          
          {/* Copyright */}
          <p className="order-2 md:order-1 text-center md:text-left">
            © 2026 Reliable Info Tech. All rights reserved.
          </p>

          {/* Animated Trio Credit Chip */}
          <div className="order-1 md:order-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/8 hover:border-cyan-500/30 transition-all shadow-inner group">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow shrink-0" />
            <span className="text-gray-400 text-[11px]">Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse shrink-0" />
            <span className="text-gray-400 text-[11px]">by</span>
            <div className="flex items-center gap-1.5 font-semibold text-white text-[11px]">
              <span
                onClick={() => setSelectedCreator(CREATORS[0])}
                className="hover:text-cyan-300 cursor-pointer transition-colors"
                title="View Sahil Sekh's Profile"
              >
                Sahil Sekh
              </span>
              <span className="text-gray-600">•</span>
              <span
                onClick={() => setSelectedCreator(CREATORS[1])}
                className="hover:text-indigo-300 cursor-pointer transition-colors"
                title="View Diganta Chakraborty's Profile"
              >
                Diganta Chakraborty
              </span>
              <span className="text-gray-600">•</span>
              <span
                onClick={() => setSelectedCreator(CREATORS[2])}
                className="hover:text-purple-300 cursor-pointer transition-colors"
                title="View Priyajit Das's Profile"
              >
                Priyajit Das
              </span>
            </div>
          </div>

          {/* Legal Links & Status */}
          <div className="order-3 flex items-center gap-5 text-center">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>99.9% Uptime</span>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Back-to-Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-gradient-to-tr from-devcraft-primary to-devcraft-secondary text-white shadow-glow-primary hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center group"
        title="Back to Top"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      </button>

      {/* ========================================================================= */}
      {/* 4. DEVELOPER SPOTLIGHT INTERACTIVE MODAL                                  */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(selectedCreator)}
        onClose={() => setSelectedCreator(null)}
        title={selectedCreator?.name || 'Developer Spotlight'}
      >
        {selectedCreator && (
          <div className="space-y-6 text-left text-xs">
            {/* Header with Avatar & Title */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/8 relative overflow-hidden">
              <div className={`w-16 h-16 rounded-2xl overflow-hidden ring-2 ${selectedCreator.accent.ring} shrink-0 bg-slate-800`}>
                <img
                  src={selectedCreator.avatar}
                  alt={selectedCreator.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-lg font-black text-white">{selectedCreator.name}</h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${selectedCreator.accent.badgeBg}`}>
                    {selectedCreator.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-medium">{selectedCreator.role}</p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={selectedCreator.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={selectedCreator.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`mailto:${selectedCreator.email}`}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
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
                {selectedCreator.fullBio}
              </div>
            </div>

            {/* Core Tech Stack */}
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Core Technologies &amp; Architecture Focus</span>
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedCreator.skills.map((skill, sIdx) => (
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
                href={`mailto:${selectedCreator.email}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-devcraft-primary to-devcraft-secondary hover:brightness-110 shadow-glow-primary transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Connect via Email</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedCreator(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </footer>
  );
};
