import React from 'react';
import { Code2, Sparkles } from 'lucide-react';

interface BrandLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const BrandLoader: React.FC<BrandLoaderProps> = ({
  message = 'Building your digital experience...',
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? 'fixed inset-0 bg-[#0B0F19] z-50' : 'py-20'
      } text-center px-4`}
      role="status"
      aria-live="polite"
    >
      {/* Brand Icon with glowing ring */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-devcraft-primary to-devcraft-secondary flex items-center justify-center shadow-glow-primary animate-pulse">
          <Code2 className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center animate-bounce">
          <Sparkles className="w-3 h-3 text-[#0B0F19]" />
        </div>
      </div>

      {/* Brand Name */}
      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
        <span>Reliable Info Tech</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal border border-indigo-500/30">
          PRO
        </span>
      </h2>
      <p className="text-xs text-indigo-300/80 mt-1 font-medium tracking-wide">
        Ideas to Digital Reality
      </p>

      {/* Animated Progress Bar */}
      <div className="w-48 h-1 bg-white/10 rounded-full mt-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-devcraft-primary via-purple-500 to-cyan-400 w-1/2 rounded-full animate-[progress_1.5s_ease-in-out_infinite]" />
      </div>

      {/* Status Message */}
      <p className="text-xs text-gray-400 mt-4 animate-pulse">{message}</p>
    </div>
  );
};
