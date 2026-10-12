import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'emerald' | 'amber' | 'sky' | 'rose' | 'gray';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  dot = false,
}) => {
  const variants = {
    purple: 'bg-[#181818] text-[#EEEEEE] border-[#363636]',
    emerald: 'bg-[#142319] text-[#4ADE80] border-[#1D3B26]',
    amber: 'bg-[#261E14] text-[#FBBF24] border-[#3D2E1A]',
    sky: 'bg-[#141E26] text-[#60A5FA] border-[#1D2F3E]',
    rose: 'bg-[#261416] text-[#F87171] border-[#3E1D22]',
    gray: 'bg-[#181818] text-[#A1A1AA] border-[#262626]',
  };

  const dotColors = {
    purple: 'bg-[#EEEEEE]',
    emerald: 'bg-[#4ADE80]',
    amber: 'bg-[#FBBF24]',
    sky: 'bg-[#60A5FA]',
    rose: 'bg-[#F87171]',
    gray: 'bg-[#A1A1AA]',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono tracking-wider',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5 font-mono tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center rounded border ${variants[variant]} ${sizes[size]} select-none`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0 animate-pulse`} />
      )}
      {children}
    </span>
  );
};
