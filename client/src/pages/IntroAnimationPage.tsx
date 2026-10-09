import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Rocket,
  Shield,
  Code2,
  Cloud,
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Laptop,
  CheckCircle2,
} from 'lucide-react';

export const IntroAnimationPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Initializing DevCraft Core...');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [autoRedirect, setAutoRedirect] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle futuristic sound using Web Audio API
  const playChime = (freq = 520, type: OscillatorType = 'sine', duration = 0.3) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  };

  // Realistic non-linear progress counter (similar to the 72% checkpoint in reference image)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Non-linear simulation with natural easing
      if (current < 25) {
        current += 1.2;
        setStatusText('Initializing DevCraft Engine...');
      } else if (current < 55) {
        current += 0.8;
        setStatusText('Loading Architectural Modules...');
      } else if (current < 72) {
        current += 0.6;
        setStatusText('Compiling Reactive Workspaces...');
      } else if (current < 92) {
        current += 1.4;
        setStatusText('Optimizing High-Performance Assets...');
      } else if (current < 100) {
        current += 0.9;
        setStatusText('Finalizing Cloud Infrastructure...');
      } else {
        current = 100;
        clearInterval(interval);
        setIsCompleted(true);
        setStatusText('All Systems Operational • Welcome!');
        playChime(880, 'sine', 0.6);
      }

      setProgress(Math.min(100, Math.round(current)));
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Optional auto-redirect after completion
  useEffect(() => {
    if (isCompleted && autoRedirect) {
      const timeout = setTimeout(() => {
        navigate('/');
      }, 3500);
      return () => clearTimeout(timeout);
    }
  }, [isCompleted, autoRedirect, navigate]);

  const handleRestart = () => {
    setProgress(0);
    setIsCompleted(false);
    setStatusText('Initializing DevCraft Core...');
    playChime(440, 'triangle', 0.2);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        playChime(660, 'sine', 0.3);
      }
      return next;
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#060913] text-white overflow-hidden flex flex-col justify-between select-none">
      {/* 1. Deep Cosmic Nebula Background with Glowing Neon Curves */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Radial Center Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[400px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />

        {/* Dynamic Curved Neon Wave Ribbons (Matching reference image) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Violet wave ribbon */}
          <path
            d="M-100 280 C 350 450, 750 150, 1550 320"
            stroke="url(#neon-violet-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-wave-glow"
          />
          {/* Cyan wave ribbon */}
          <path
            d="M-50 480 C 450 620, 950 340, 1600 480"
            stroke="url(#neon-cyan-grad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="animate-wave-glow"
            style={{ animationDelay: '2s' }}
          />
          <defs>
            <linearGradient id="neon-violet-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.05" />
              <stop offset="40%" stopColor="#A855F7" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#EC4899" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="neon-cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
              <stop offset="45%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#38BDF8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>

        {/* Cosmic floating particle sparkles */}
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-300 animate-pulse"
            style={{
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              top: `${(i * 19) % 95}%`,
              left: `${(i * 29) % 95}%`,
              opacity: (i % 5) * 0.15 + 0.2,
              animationDuration: `${(i % 4) + 2.5}s`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* 2. Top Navigation Bar & Brand Header */}
      <header className="relative z-20 px-6 pt-6 sm:pt-8 max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Empty left anchor or quick actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-2 backdrop-blur-md"
            title={soundEnabled ? 'Audio enabled' : 'Enable sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio On' : 'Audio Off'}</span>
          </button>

          <button
            onClick={handleRestart}
            aria-label="Replay intro animation"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-1.5 backdrop-blur-md"
            title="Replay animation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>

        {/* Central Logo Header: Glowing D Badge + DevCraft + Tagline */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            {/* 3D Hexagon / Pill Logo Icon with Inner Glyph */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_25px_rgba(59,130,246,0.6)]">
              <div className="w-full h-full bg-[#080E21] rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent" />
                {/* Stylized code arrow "D" */}
                <div className="flex items-center text-cyan-300 font-black text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                  <span>&gt;</span>
                </div>
              </div>
            </div>

            {/* Brand Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              <span className="text-white">Dev</span>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Craft
              </span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-widest mt-1.5 flex items-center gap-2">
            <span>Build</span>
            <span className="text-cyan-400 text-base leading-none">•</span>
            <span>Innovate</span>
            <span className="text-cyan-400 text-base leading-none">•</span>
            <span>Grow</span>
          </p>
        </div>

        {/* Right CTA: Skip / Enter Site Button */}
        <div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 hover:border-blue-400 text-xs font-bold text-blue-200 hover:text-white transition-all backdrop-blur-md active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 3. Center Section: 3D Workstation Scene + Typography + Glowing Progress Bar */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-5xl mx-auto w-full">
        {/* 3D Floating Workstation Container */}
        <div className="relative flex flex-col items-center justify-center my-2 sm:my-4 group">
          {/* Luminous Neon Disc Halo Floor Ring (Underneath Laptop Platform) */}
          <div className="absolute bottom-2 sm:bottom-4 w-[340px] sm:w-[520px] md:w-[620px] h-20 sm:h-28 rounded-full border border-cyan-400/50 bg-gradient-to-t from-cyan-500/15 via-indigo-500/10 to-transparent blur-sm animate-pulse-halo pointer-events-none" />

          {/* Floating Workstation Graphic */}
          <div className="relative z-10 animate-float-gentle transition-transform duration-500 hover:scale-[1.02]">
            <img
              src="/intro-workstation-smooth.png"
              alt="DevCraft 3D Workstation with live code"
              className="w-[320px] sm:w-[480px] md:w-[580px] lg:w-[620px] max-h-[300px] sm:max-h-[360px] object-contain drop-shadow-[0_20px_40px_rgba(6,182,212,0.25)] select-none pointer-events-none"
              onError={(e) => {
                // Fallback to hero image if crop is unavailable
                (e.target as HTMLImageElement).src = '/intro-hero.png';
              }}
            />

            {/* Holographic glowing micro-badges floating around the laptop */}
            <div className="absolute top-4 left-6 sm:left-12 px-2.5 py-1 rounded-xl bg-indigo-950/70 border border-indigo-500/50 backdrop-blur-md text-[10px] sm:text-xs font-mono font-bold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center gap-1 animate-bounce">
              <Code2 className="w-3 h-3 text-cyan-400" />
              <span>&lt;/&gt;</span>
            </div>

            <div
              className="absolute top-2 right-12 sm:right-24 px-2.5 py-1 rounded-xl bg-cyan-950/70 border border-cyan-400/50 backdrop-blur-md text-[10px] sm:text-xs font-mono font-bold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center gap-1.5"
              style={{ animation: 'float 3.5s ease-in-out infinite 1s' }}
            >
              <Cloud className="w-3 h-3 text-cyan-300" />
              <span>Cloud Ready</span>
            </div>
          </div>
        </div>

        {/* Central Headline & Tagline */}
        <div className="text-center mt-2 sm:mt-4 space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg">
            <span className="text-white">Your Ideas. </span>
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Our Code.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
            Building something amazing for you...
          </p>
        </div>

        {/* 4. Futuristic Animated Glowing Loading Bar */}
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mt-5 sm:mt-6 space-y-2">
          {/* Progress Track */}
          <div className="relative w-full h-3 sm:h-3.5 bg-slate-900/90 rounded-full border border-slate-700/60 p-[2px] shadow-inner backdrop-blur-md overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-150 ease-out shimmer-bar shadow-[0_0_20px_rgba(6,182,212,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status Label & Percentage Row */}
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="truncate max-w-[200px] sm:max-w-[320px]">{statusText}</span>
            </div>

            <div className="font-mono font-bold text-cyan-400 tracking-tight text-xs sm:text-sm">
              {progress}%
            </div>
          </div>
        </div>

        {/* 5. Completion Overlay CTA (Appears when progress reaches 100%) */}
        {isCompleted && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all active:scale-95"
            >
              <span>Explore DevCraft</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition-all backdrop-blur-md active:scale-95"
            >
              <span>Admin Console</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        )}
      </main>

      {/* 6. Bottom Feature Trust Pillars (Matching Reference Image Exactly) */}
      <footer className="relative z-20 px-4 py-6 sm:py-8 border-t border-slate-900/80 bg-[#060913]/70 backdrop-blur-md">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          {/* Pillar 1: Fast & Reliable */}
          <div className="flex flex-col items-center justify-center pt-3 sm:pt-0 sm:px-4 group cursor-default">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-blue-600/20 group-hover:text-cyan-300 transition-all">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors text-center">
              Fast & Reliable
            </span>
          </div>

          {/* Pillar 2: Secure */}
          <div className="flex flex-col items-center justify-center pt-3 sm:pt-0 sm:px-4 group cursor-default">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-indigo-600/20 group-hover:text-indigo-300 transition-all">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors text-center">
              Secure
            </span>
          </div>

          {/* Pillar 3: Modern Technology */}
          <div className="flex flex-col items-center justify-center pt-3 sm:pt-0 sm:px-4 group cursor-default">
            <div className="w-8 h-8 rounded-xl bg-cyan-600/10 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-cyan-600/20 group-hover:text-cyan-300 transition-all">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors text-center">
              Modern Technology
            </span>
          </div>

          {/* Pillar 4: Always Online */}
          <div className="flex flex-col items-center justify-center pt-3 sm:pt-0 sm:px-4 group cursor-default">
            <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-purple-600/20 group-hover:text-purple-300 transition-all">
              <Cloud className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors text-center">
              Always Online
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IntroAnimationPage;
