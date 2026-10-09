import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Smartphone,
  Check,
  TrendingUp,
  Terminal,
  Activity,
  Code2,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden bg-[#0B0F19]">
      {/* Dynamic Ambient Neon Wave Glow Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[1000px] h-[450px] bg-gradient-to-r from-blue-600/15 via-indigo-600/20 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-wave-glow" />
      <div className="absolute top-12 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 left-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle SVG Neon Light Trail Wave (as seen in reference image) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 1440 800"
      >
        <path
          d="M300,500 C600,650 900,200 1350,350 C1550,420 1600,550 1700,600"
          stroke="url(#neon-trail-1)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="blur(2px)"
        />
        <path
          d="M200,450 C550,550 850,150 1400,280"
          stroke="url(#neon-trail-2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <defs>
          <linearGradient id="neon-trail-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="neon-trail-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: HERO CONTENT (Typography, Buttons, Stats)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-7 text-left">
            {/* Top Pill Tag: • Build • Develop • Grow & Intro Link */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-indigo-500/30 backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-indigo-300">
                  • Build • Develop • Grow
                </span>
              </div>
              <Link
                to="/intro"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:text-white transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] group"
              >
                <Sparkles className="w-3 h-3 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>Experience Intro Animation</span>
              </Link>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.12]">
              Turn Your Ideas Into{' '}
              <span className="block mt-1 text-gradient-cyan drop-shadow-[0_0_35px_rgba(56,189,248,0.35)]">
                Digital Reality
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl font-normal">
              We build modern websites, web applications, e-commerce platforms and custom digital products for businesses and individuals.
            </p>

            {/* CTAs matching the image pill styles */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-glow-primary transition-all duration-200 hover:scale-[1.03] active:scale-95"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/request"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-gray-200 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-200 hover:text-white"
              >
                <span>Request a Website</span>
              </Link>
            </div>

            {/* Stats Metrics Row */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">50+</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">Projects Completed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">30+</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">Happy Clients</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">5+</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">Years Experience</p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: 3D LAPTOP, PHONE & FLOATING TECH BADGES     */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative w-full max-w-[540px] sm:max-w-[620px] h-[360px] sm:h-[420px] flex items-center justify-center">

              {/* Floating Badge 1: React Icon (Top Left) */}
              <div className="absolute top-2 left-6 sm:left-12 z-20 animate-float">
                <div className="p-2.5 rounded-2xl bg-[#0F172A]/90 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-md flex items-center justify-center text-cyan-400 group hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 animate-spin [animation-duration:12s]" viewBox="-11.5 -10.23174 23 20.46348">
                    <circle cx="0" cy="0" r="2.05" fill="#38BDF8"/>
                    <g stroke="#38BDF8" strokeWidth="1" fill="none">
                      <ellipse rx="11" ry="4.2"/>
                      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Floating Badge 2: Node.js (Top Right) */}
              <div className="absolute top-0 right-10 sm:right-16 z-20 animate-float-delayed">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md text-emerald-400 text-xs font-bold">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Node.js</span>
                </div>
              </div>

              {/* Floating Badge 3: MongoDB (Middle Right) */}
              <div className="absolute top-1/4 right-0 sm:-right-2 z-20 animate-float">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)] backdrop-blur-md text-emerald-300 text-xs font-semibold">
                  <span className="text-emerald-400 font-bold">🍃</span>
                  <span>MongoDB</span>
                </div>
              </div>

              {/* Floating Glass Card (Left): Main.js Code Snippet */}
              <div className="absolute -left-2 sm:left-2 bottom-20 z-20 animate-float-slow hidden sm:block">
                <div className="w-36 p-3 rounded-2xl bg-[#0F172A]/85 border border-white/10 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-white/10 text-[10px] text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-red-400/80" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                    <span className="ml-1 font-mono text-[9px] text-gray-300">App.tsx</span>
                  </div>
                  <div className="pt-2 space-y-1 font-mono text-[9px]">
                    <p className="text-cyan-400">const dev = True;</p>
                    <p className="text-indigo-300">return &lt;Launch /&gt;;</p>
                    <div className="h-1.5 w-12 rounded bg-indigo-500/30" />
                  </div>
                </div>
              </div>

              {/* Floating Glass Card (Right): Modern & Fast Metric */}
              <div className="absolute -right-2 sm:right-4 bottom-14 z-20 animate-float-delayed">
                <div className="p-3.5 rounded-2xl bg-[#0F172A]/90 border border-indigo-500/30 backdrop-blur-xl shadow-2xl space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-white">Modern & Fast</p>
                      <p className="text-[9px] text-gray-400">Sub-100ms API Latency</p>
                    </div>
                  </div>
                  <div className="w-28 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-4/5 h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* CENTRAL 3D LAPTOP MOCKUP                                   */}
              {/* ========================================================= */}
              <div className="relative z-10 w-[310px] sm:w-[410px] transition-transform duration-500 hover:scale-[1.02]">
                
                {/* Laptop Lid Screen */}
                <div className="relative rounded-t-2xl bg-[#0A0E17] border-2 border-slate-700/80 p-2 sm:p-2.5 shadow-2xl">
                  {/* Web Camera dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mx-auto mb-1.5" />
                  
                  {/* Laptop Screen Bezel / Display Window */}
                  <div className="rounded-xl bg-[#090D16] border border-white/5 overflow-hidden shadow-inner">
                    {/* IDE Header Bar */}
                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#0D1322] border-b border-white/5 text-[10px] text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                        <span className="ml-2 font-mono text-[9px] text-gray-300">DevCraft Studio Workspace</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[9px] text-indigo-400">
                        <span>TypeScript</span>
                        <span>•</span>
                        <span className="text-emerald-400">Ready</span>
                      </div>
                    </div>

                    {/* IDE Code Editor Body */}
                    <div className="p-3 sm:p-4 font-mono text-[10px] sm:text-[11px] leading-relaxed text-gray-300 space-y-1 bg-[#070A12]">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 select-none text-[9px]">1</span>
                        <span>
                          <strong className="text-purple-400 font-normal">import</strong>{' '}
                          <span className="text-cyan-300">React</span>{' '}
                          <strong className="text-purple-400 font-normal">from</strong>{' '}
                          <span className="text-emerald-300">'react'</span>;
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 select-none text-[9px]">2</span>
                        <span>
                          <strong className="text-purple-400 font-normal">import</strong>{' '}
                          <span className="text-cyan-300">{'{ DigitalReality }'}</span>{' '}
                          <strong className="text-purple-400 font-normal">from</strong>{' '}
                          <span className="text-emerald-300">'@devcraft/core'</span>;
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 select-none text-[9px]">3</span>
                        <span>
                          <span className="text-blue-400">export default function</span>{' '}
                          <span className="text-yellow-300">App</span>() {'{'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <span className="text-gray-400 select-none text-[9px]">4</span>
                        <span>
                          <strong className="text-purple-400 font-normal">return</strong> (
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pl-8">
                        <span className="text-gray-400 select-none text-[9px]">5</span>
                        <span className="text-cyan-300">
                          &lt;<span className="text-indigo-400">DigitalReality</span>{' '}
                          <span className="text-amber-300">ideas</span>=
                          <span className="text-emerald-300">"infinite"</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pl-12">
                        <span className="text-gray-400 select-none text-[9px]">6</span>
                        <span className="text-cyan-300">
                          <span className="text-amber-300">speed</span>=
                          <span className="text-emerald-300">"blazing"</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pl-12">
                        <span className="text-gray-400 select-none text-[9px]">7</span>
                        <span className="text-cyan-300">
                          <span className="text-amber-300">aesthetic</span>=
                          <span className="text-emerald-300">"future"</span> /&gt;
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <span className="text-gray-400 select-none text-[9px]">8</span>
                        <span>);</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 select-none text-[9px]">9</span>
                        <span>{'}'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laptop Base & Keyboard Shelf */}
                <div className="h-4 sm:h-5 bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 rounded-b-xl relative shadow-2xl flex items-center justify-center">
                  {/* Notch cutout */}
                  <div className="w-16 h-1 rounded-full bg-slate-500/80 mb-1" />
                </div>
                {/* Laptop bottom desk glow reflection */}
                <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-sm -mt-0.5" />
              </div>

              {/* ========================================================= */}
              {/* SMARTPHONE DEVICE (Tilted beside laptop)                   */}
              {/* ========================================================= */}
              <div className="absolute right-6 sm:right-10 bottom-2 z-30 w-24 sm:w-28 h-48 sm:h-56 rounded-2xl bg-[#090D16] border-2 border-slate-700 p-1.5 shadow-2xl transition-transform duration-300 hover:scale-105">
                {/* Screen frame */}
                <div className="w-full h-full rounded-xl bg-[#0B0F19] p-2 flex flex-col justify-between overflow-hidden border border-white/5">
                  {/* Dynamic Island / Speaker notch */}
                  <div className="w-8 h-1.5 rounded-full bg-slate-800 mx-auto" />
                  
                  {/* App UI inside phone */}
                  <div className="space-y-1.5 text-left my-auto">
                    <span className="text-[8px] font-bold text-cyan-400 block">DevCraft Mobile</span>
                    <div className="p-1 rounded-lg bg-white/5 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[7px] text-gray-300">
                        <span>Speed</span>
                        <span className="text-emerald-400">99.8%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-cyan-400" />
                      </div>
                    </div>
                    <div className="h-5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                      <span className="text-[7px] font-bold text-indigo-300">Active Sprint</span>
                    </div>
                  </div>

                  {/* Home indicator bar */}
                  <div className="w-8 h-1 rounded-full bg-white/20 mx-auto" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
