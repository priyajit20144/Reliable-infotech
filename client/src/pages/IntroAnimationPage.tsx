import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Smartphone,
  Cloud,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
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
  const [currentStage, setCurrentStage] = useState<string>('CALIBRATING RUNTIME ENGINE');

  const handleExit = () => {
    markIntroSeen();
    if (onComplete) {
      onComplete();
    } else {
      navigate('/');
    }
  };

  // Realistic smooth loading counter with technical telemetry milestones
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < 25) {
        current += 2.0;
        setCurrentStage('CALIBRATING RUNTIME & WEBSOCKET ENGINE');
      } else if (current < 55) {
        current += 1.6;
        setCurrentStage('INITIALIZING ARCHITECTURAL DESIGN SYSTEM');
      } else if (current < 82) {
        current += 1.3;
        setCurrentStage('SYNCHRONIZING BESPOKE CLOUD SERVICES');
      } else if (current < 99) {
        current += 1.4;
        setCurrentStage('MOUNTING 3D GEOMETRIC SCULPTURE');
      } else {
        current = 100;
        clearInterval(interval);
        setCurrentStage('ALL SYSTEMS OPERATIONAL // READY');
        setIsCompleted(true);
      }
      setProgress(Math.min(100, Math.round(current)));
    }, 38);

    return () => clearInterval(interval);
  }, []);

  // Auto-transition shortly after completion
  useEffect(() => {
    if (isCompleted) {
      const timeout = setTimeout(() => {
        handleExit();
      }, 1600);
      return () => clearTimeout(timeout);
    }
  }, [isCompleted]);

  const capabilities = [
    {
      icon: Code2,
      title: 'Web Engineering',
      desc: 'High-Speed React & Next.js Platforms',
      code: 'SYS_01',
    },
    {
      icon: Smartphone,
      title: 'Mobile Architecture',
      desc: 'iOS & Android Native Ecosystems',
      code: 'SYS_02',
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      desc: 'Scalable Microservices & CI/CD',
      code: 'SYS_03',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Solutions',
      desc: 'Custom APIs & Workflow Engines',
      code: 'SYS_04',
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#0B0B0B] text-[#EEEEEE] overflow-hidden flex flex-col justify-between select-none">
      {/* 1. ARCHITECTURAL MONOCHROME BACKGROUND TEXTURE & ORBITAL GRIDS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Precision Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000,transparent)]" />

        {/* Ambient Subtle Center Monochromatic Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.03] blur-[140px]" />

        {/* Delicate Silver Orbital Ellipse Vectors */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="720"
            cy="450"
            rx="560"
            ry="240"
            stroke="#EEEEEE"
            strokeWidth="0.8"
            strokeDasharray="4 6"
            className="animate-spin-slow origin-center"
          />
          <ellipse
            cx="720"
            cy="450"
            rx="420"
            ry="380"
            stroke="#EEEEEE"
            strokeWidth="0.6"
            strokeDasharray="2 8"
          />
        </svg>

        {/* Monochromatic Starlight Coordinate Sparkles */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${(i % 2) + 1.5}px`,
              height: `${(i % 2) + 1.5}px`,
              top: `${(i * 19) % 92}%`,
              left: `${(i * 29) % 94}%`,
              backgroundColor: '#EEEEEE',
              opacity: (i % 4) * 0.15 + 0.2,
              animation: `pulse ${(i % 3) + 3}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* 2. TOP BAR: Branding Tag + Skip Button */}
      <header className="relative z-20 px-6 sm:px-10 pt-6 sm:pt-8 max-w-7xl 2xl:max-w-[1500px] mx-auto w-full flex items-center justify-between">
        {/* Top-Left Telemetry Coordinates */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#777777] uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>RELIABLE // FORGE SYSTEM v2.0</span>
        </div>

        {/* Skip Intro Button */}
        <div className="flex justify-end">
          <button
            onClick={handleExit}
            className="nf-frame relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 bg-[#181818] hover:bg-[#222222] border border-[#262626] hover:border-[#383838] text-xs font-mono font-medium text-[#CCCCCC] hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <span className="nf-c nf-c-tl" />
            <span className="nf-c nf-c-tr" />
            <span className="nf-c nf-c-bl" />
            <span className="nf-c nf-c-br" />
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#AAAAAA]" />
          </button>
        </div>
      </header>

      {/* 3. CENTER HERO: ARCHITECTURAL MONOCHROME EMBLEM & TELEMETRY PROGRESS */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full text-center">
        {/* Emblem Frame with Corner Brackets */}
        <div className="nf-frame relative p-8 sm:p-10 bg-[#121212] border border-[#262626] max-w-lg w-full flex flex-col items-center justify-center shadow-2xl">
          <span className="nf-c nf-c-tl" />
          <span className="nf-c nf-c-tr" />
          <span className="nf-c nf-c-bl" />
          <span className="nf-c nf-c-br" />

          {/* Top Monospace Pill */}
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-none text-[10px] font-mono tracking-widest text-[#888888] bg-[#181818] border border-[#262626] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EEEEEE] animate-ping" />
            <span>INITIALIZING DIGITAL PLATFORM</span>
          </div>

          {/* Sculpted Emblem with Platinum / Monochrome Styling */}
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <img
              src="/reliable-symbol.png"
              alt="Reliable InfoTech Emblem"
              className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 object-contain filter grayscale contrast-125 brightness-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Dual Typography Headline */}
          <div className="space-y-1.5 mb-2">
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#EEEEEE]">
              <span>Reliable </span>
              <span className="font-serif italic text-white/90">InfoTech</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#888888] font-normal leading-relaxed max-w-md mx-auto">
              Architectural Web Systems & Bespoke Digital Engineering
            </p>
          </div>

          {/* Loading Progress Track */}
          <div className="w-full mt-6 space-y-2.5">
            {/* Progress Bar Container */}
            <div className="relative w-full h-2 bg-[#0B0B0B] border border-[#262626] overflow-hidden">
              <div
                className="h-full bg-[#EEEEEE] transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Stage Telemetry Information */}
            <div className="flex items-center justify-between text-[10px] font-mono text-[#777777]">
              <span className="truncate pr-2">{currentStage}</span>
              <span className="text-[#EEEEEE] font-bold shrink-0">{progress}%</span>
            </div>
          </div>

          {/* Completion Action Buttons (Appear when 100% complete) */}
          {isCompleted && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-200 w-full pt-4 border-t border-[#262626]">
              <button
                onClick={handleExit}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#EEEEEE] hover:bg-white text-[#0B0B0B] font-bold text-xs transition-all active:scale-95 shadow-md"
              >
                <span>Enter Main Platform</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  markIntroSeen();
                  navigate('/admin');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#181818] hover:bg-[#222222] border border-[#262626] text-[#CCCCCC] hover:text-white font-mono text-xs transition-all active:scale-95"
              >
                <span>Admin Console</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#888888]" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile / Tablet Responsive 2x2 Capabilities Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 mt-6 w-full max-w-lg lg:hidden">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="nf-frame relative p-2.5 bg-[#121212] border border-[#262626] text-left"
              >
                <span className="nf-c nf-c-tl" />
                <span className="nf-c nf-c-tr" />
                <span className="nf-c nf-c-bl" />
                <span className="nf-c nf-c-br" />

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#181818] border border-[#262626] text-[#CCCCCC] flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-[#EEEEEE] truncate">{item.title}</h4>
                    <p className="text-[9px] font-mono text-[#777777] truncate">{item.code}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 4. RIGHT-SIDE FLOATING HUD (Visible on Desktop) */}
      <aside className="hidden lg:flex fixed right-6 sm:right-10 xl:right-14 top-1/2 -translate-y-1/2 flex-col gap-3 z-20 w-64 select-none">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#777777] px-1 mb-1">
          Core Capabilities
        </div>
        {capabilities.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="nf-frame relative p-3 bg-[#121212] border border-[#262626] hover:border-[#383838] transition-colors group cursor-default text-left shadow-sm"
            >
              <span className="nf-c nf-c-tl" />
              <span className="nf-c nf-c-tr" />
              <span className="nf-c nf-c-bl" />
              <span className="nf-c nf-c-br" />

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#181818] border border-[#262626] text-[#CCCCCC] flex items-center justify-center shrink-0 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-[#EEEEEE] group-hover:text-white transition-colors truncate">
                      {item.title}
                    </h4>
                    <span className="text-[9px] font-mono text-[#666666]">{item.code}</span>
                  </div>
                  <p className="text-[10px] text-[#888888] font-normal truncate mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </aside>

      {/* 5. FOOTER: Monospace Telemetry & Versioning */}
      <footer className="relative z-20 px-6 sm:px-10 pb-6 sm:pb-8 max-w-7xl 2xl:max-w-[1500px] mx-auto w-full flex items-center justify-between">
        {/* Bottom-Left Accent Line & Text */}
        <div className="flex items-center gap-3">
          <span className="w-5 h-[1.5px] bg-[#EEEEEE]" />
          <span className="text-[10px] font-mono tracking-widest text-[#777777] uppercase">
            Let's Engineer Together
          </span>
        </div>

        {/* Bottom-Right Minimal Coordinates */}
        <div className="text-[10px] font-mono text-[#666666] tracking-wider">
          EST. 2026 // RELIABLE INFOTECH
        </div>
      </footer>
    </div>
  );
};

export default IntroAnimationPage;
