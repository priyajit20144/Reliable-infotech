import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Smartphone,
  Cloud,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

let hasSeenIntroThisSession = false;

export const markIntroSeen = () => {
  hasSeenIntroThisSession = true;
};

export const resetIntroSession = () => {
  hasSeenIntroThisSession = false;
};

export const getHasSeenIntro = () => {
  return hasSeenIntroThisSession;
};

export interface IntroAnimationPageProps {
  onComplete?: () => void;
}

export const IntroAnimationPage: React.FC<IntroAnimationPageProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [autoRedirect] = useState<boolean>(true);

  const handleExit = () => {
    markIntroSeen();
    if (onComplete) {
      onComplete();
    } else {
      navigate('/');
    }
  };

  // Realistic non-linear progress counter (smooth load from 0% to 100%)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < 25) {
        current += 1.8;
      } else if (current < 60) {
        current += 1.4;
      } else if (current < 85) {
        current += 1.1;
      } else if (current < 100) {
        current += 1.5;
      } else {
        current = 100;
        clearInterval(interval);
        setIsCompleted(true);
      }
      setProgress(Math.min(100, Math.round(current)));
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Auto-transition shortly after completion
  useEffect(() => {
    if (isCompleted && autoRedirect) {
      const timeout = setTimeout(() => {
        handleExit();
      }, 1600);
      return () => clearTimeout(timeout);
    }
  }, [isCompleted, autoRedirect]);

  return (
    <div className="relative min-h-screen w-full bg-[#020515] text-white overflow-hidden flex flex-col justify-between select-none">
      {/* 1. COSMIC BACKGROUND WITH LENS FLARE, NEON WAVES & STARLIT PARTICLES */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Left Brilliant Cyan/Blue Lens Flare */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-blue-600/30 blur-[90px]" />
        <div className="absolute top-4 left-4 w-28 h-28 rounded-full bg-cyan-300/40 blur-[30px]" />
        <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-white/90 blur-[10px] animate-pulse" />

        {/* Ambient Center Blue & Magenta Nebula Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[300px] rounded-full bg-cyan-500/10 blur-[120px]" />

        {/* Flowing Curved Neon Wave Ribbons (Matching reference image curves) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-70"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cyan neon wave ribbon */}
          <path
            d="M-80 620 C 320 740, 780 480, 1550 640"
            stroke="url(#reliable-cyan-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            className="animate-wave-glow"
          />
          {/* Violet / Magenta wave ribbon */}
          <path
            d="M-100 700 C 420 540, 920 720, 1560 560"
            stroke="url(#reliable-violet-grad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="animate-wave-glow"
            style={{ animationDelay: '1.8s' }}
          />
          {/* Deep blue accent wave */}
          <path
            d="M-50 780 C 460 760, 900 640, 1500 750"
            stroke="url(#reliable-blue-grad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="animate-wave-glow"
            style={{ animationDelay: '3.2s' }}
          />
          <defs>
            <linearGradient id="reliable-cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#00f0ff" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="reliable-violet-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
              <stop offset="40%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#d946ef" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="reliable-blue-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient Glossy Floor Glow Reflection at Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-blue-950/40 via-cyan-950/15 to-transparent pointer-events-none" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Floating Starlight Particle Sparkles */}
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse pointer-events-none"
            style={{
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              top: `${(i * 17) % 94}%`,
              left: `${(i * 31) % 96}%`,
              backgroundColor: i % 2 === 0 ? '#38bdf8' : '#c084fc',
              opacity: (i % 5) * 0.15 + 0.3,
              boxShadow: i % 2 === 0 ? '0 0 8px #38bdf8' : '0 0 8px #c084fc',
              animationDuration: `${(i % 4) + 2.5}s`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      {/* 2. TOP BAR: Skip / Enter Site Button */}
      <header className="relative z-20 px-6 pt-6 sm:pt-8 max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Invisible spacer on left for balanced flex distribution */}
        <div className="w-28 sm:w-32 invisible" aria-hidden="true" />

        {/* Empty Center Space */}
        <div className="flex-1" />

        {/* Right CTA: Skip Intro Button */}
        <div className="w-28 sm:w-32 flex justify-end">
          <button
            onClick={handleExit}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-cyan-500/40 hover:border-cyan-300 text-xs font-bold text-cyan-200 hover:text-white transition-all backdrop-blur-md active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.25)] whitespace-nowrap"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
          </button>
        </div>
      </header>

      {/* 3. MAIN CENTER & RIGHT GRID: Responsive 2-Column Showcase */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* LEFT/CENTER HERO BLOCK (Span 12 on mobile, Span 9 on desktop to center relative to right features) */}
          <div className="lg:col-span-9 flex flex-col items-center justify-center text-center">
            {/* 3D "R" Planetary Orbital Logo */}
            <div className="relative group flex items-center justify-center my-1 sm:my-2">
              {/* Radial Cyan & Purple Neon Aura Behind Logo */}
              <div className="absolute w-52 sm:w-64 md:w-72 h-52 sm:h-64 md:h-72 rounded-full bg-gradient-to-tr from-cyan-500/30 via-blue-600/20 to-fuchsia-600/30 blur-3xl pointer-events-none animate-pulse" />

              {/* The High-Fidelity 3D R Logo */}
              <img
                src="/reliable-logo-transparent.png"
                alt="Reliable Info Tech Logo"
                className="relative z-10 w-44 sm:w-56 md:w-64 max-w-full object-contain drop-shadow-[0_0_35px_rgba(6,182,212,0.65)] select-none pointer-events-none transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/reliable-logo-perfect.png';
                }}
              />
            </div>

            {/* Brand Title: "Reliable Info Tech" */}
            <div className="mt-2 sm:mt-3 space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black tracking-tight flex items-center justify-center gap-2 sm:gap-3 leading-tight">
                <span className="text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.4)]">
                  Reliable
                </span>
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(6,182,212,0.7)]">
                  Info
                </span>
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(192,38,211,0.7)]">
                  Tech
                </span>
              </h1>

              {/* Tagline: "Your Vision • Our Technology • A Better Tomorrow" */}
              <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium tracking-wide flex items-center justify-center gap-2 sm:gap-2.5 pt-1">
                <span>Your Vision</span>
                <span className="text-cyan-400 text-sm font-bold">•</span>
                <span>Our Technology</span>
                <span className="text-cyan-400 text-sm font-bold">•</span>
                <span>A Better Tomorrow</span>
              </p>
            </div>

            {/* Glowing Loading Bar & Status */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mt-6 sm:mt-7 space-y-2.5">
              {/* Progress Track */}
              <div className="relative w-full h-2.5 sm:h-3 bg-[#070D1E]/95 rounded-full border border-slate-700/60 p-[1.5px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 transition-all duration-150 ease-out shadow-[0_0_18px_rgba(6,182,212,0.85)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status Row */}
              <div className="flex items-center justify-center">
                <p className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-slate-400 uppercase flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>{isCompleted ? 'ALL SYSTEMS OPERATIONAL' : 'LOADING...'}</span>
                  <span className="text-cyan-400 font-bold ml-1">{progress}%</span>
                </p>
              </div>
            </div>

            {/* Completion CTA (Appears when loading finishes) */}
            {isCompleted && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                <button
                  onClick={handleExit}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all active:scale-95"
                >
                  <span>Explore Reliable InfoTech</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    markIntroSeen();
                    navigate('/admin');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition-all backdrop-blur-md active:scale-95"
                >
                  <span>Admin Console</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SERVICES PILLARS (Span 3 on Desktop, matching reference image) */}
          <div className="lg:col-span-3 flex flex-col gap-3.5 sm:gap-4 max-w-sm mx-auto lg:mx-0 w-full">
            {/* Feature 1: Web Development */}
            <div className="flex items-center gap-3.5 p-2 rounded-2xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all group cursor-default backdrop-blur-sm shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#081026] border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:scale-105 group-hover:border-cyan-300 transition-all">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                  Web Development
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  Modern • Scalable • Fast
                </p>
              </div>
            </div>

            {/* Feature 2: Mobile Apps */}
            <div className="flex items-center gap-3.5 p-2 rounded-2xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all group cursor-default backdrop-blur-sm shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#081026] border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:scale-105 group-hover:border-cyan-300 transition-all">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                  Mobile Apps
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  iOS • Android • Cross-Platform
                </p>
              </div>
            </div>

            {/* Feature 3: Cloud Solutions */}
            <div className="flex items-center gap-3.5 p-2 rounded-2xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all group cursor-default backdrop-blur-sm shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#081026] border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:scale-105 group-hover:border-cyan-300 transition-all">
                <Cloud className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                  Cloud Solutions
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  Secure • Flexible • Reliable
                </p>
              </div>
            </div>

            {/* Feature 4: IT Consulting */}
            <div className="flex items-center gap-3.5 p-2 rounded-2xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all group cursor-default backdrop-blur-sm shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#081026] border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:scale-105 group-hover:border-cyan-300 transition-all">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                  IT Consulting
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  Strategy • Support • Growth
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. FOOTER: Bottom-Left Tagline ("LET'S BUILD TOGETHER") */}
      <footer className="relative z-20 px-6 sm:px-12 pb-6 sm:pb-8 max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Bottom-Left Accent Line & Text (Matching reference image) */}
        <div className="flex items-center gap-3">
          <span className="w-6 sm:w-8 h-[2px] rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-slate-400 uppercase">
            Let's Build Together
          </span>
        </div>

        {/* Bottom Right Minimal Indicator */}
        <div className="text-[10px] font-mono text-slate-500 tracking-wider">
          v2.0 • RELIABLE INFOTECH
        </div>
      </footer>
    </div>
  );
};

export default IntroAnimationPage;
