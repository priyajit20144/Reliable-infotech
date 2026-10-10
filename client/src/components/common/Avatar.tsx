import React, { useState, useEffect } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  border?: boolean;
  glow?: boolean;
  ringColor?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

// Preset modern gradient palettes based on deterministic string hash
const GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-pink-500',
  'from-amber-500 to-rose-500',
  'from-fuchsia-500 to-indigo-600',
];

function getGradient(name?: string): string {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZE_MAP: Record<AvatarSize, { container: string; text: string; status: string; statusOffset: string }> = {
  xs: {
    container: 'w-6 h-6',
    text: 'text-[10px] font-bold',
    status: 'w-1.5 h-1.5',
    statusOffset: 'bottom-0 right-0',
  },
  sm: {
    container: 'w-8 h-8',
    text: 'text-xs font-bold',
    status: 'w-2 h-2',
    statusOffset: 'bottom-0 right-0',
  },
  md: {
    container: 'w-10 h-10',
    text: 'text-sm font-bold',
    status: 'w-2.5 h-2.5',
    statusOffset: 'bottom-0 right-0',
  },
  lg: {
    container: 'w-12 h-12',
    text: 'text-base font-bold',
    status: 'w-3 h-3',
    statusOffset: 'bottom-0.5 right-0.5',
  },
  xl: {
    container: 'w-16 h-16',
    text: 'text-xl font-bold',
    status: 'w-3.5 h-3.5',
    statusOffset: 'bottom-1 right-1',
  },
  '2xl': {
    container: 'w-20 h-20',
    text: 'text-2xl font-bold',
    status: 'w-4 h-4',
    statusOffset: 'bottom-1 right-1',
  },
  '3xl': {
    container: 'w-24 h-24 sm:w-28 sm:h-28',
    text: 'text-3xl sm:text-4xl font-extrabold',
    status: 'w-5 h-5',
    statusOffset: 'bottom-1.5 right-1.5',
  },
};

const STATUS_COLORS: Record<'online' | 'offline' | 'away' | 'busy', string> = {
  online: 'bg-emerald-500 ring-emerald-950',
  away: 'bg-amber-400 ring-amber-950',
  busy: 'bg-rose-500 ring-rose-950',
  offline: 'bg-slate-500 ring-slate-950',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  alt,
  size = 'md',
  className = '',
  status,
  border = false,
  glow = false,
  ringColor = 'ring-white/10',
  onClick,
  children,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset error & loaded state whenever src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
  const initials = getInitials(name || alt);
  const gradient = getGradient(name || alt);

  // Determine if a valid non-empty string is passed
  const cleanSrc = typeof src === 'string' && src.trim() !== '' ? src.trim() : null;
  const shouldRenderImage = Boolean(cleanSrc) && !hasError;

  return (
    <div
      role={onClick ? 'button' : 'img'}
      aria-label={name ? `${name}'s avatar` : 'User avatar'}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative shrink-0 select-none rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
        sizeConfig.container
      } ${
        border ? `ring-2 ${ringColor}` : ''
      } ${
        glow ? 'shadow-glow-primary' : ''
      } ${
        onClick ? 'cursor-pointer hover:scale-[1.03] active:scale-[0.97]' : ''
      } ${className}`}
    >
      {/* 1. Underlying Fallback Layer: Always present with gradient & initials */}
      <div
        className={`absolute inset-0 w-full h-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white ${sizeConfig.text} tracking-tight`}
      >
        <span>{initials}</span>
      </div>

      {/* 2. Real Image Layer: Smoothly fades in only if load succeeds */}
      {shouldRenderImage && (
        <img
          src={cleanSrc!}
          alt="" // Keep alt empty so browsers do NOT render broken text if error occurs before unmount
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(false);
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
      )}

      {/* 3. Optional Overlay Children (e.g. Camera hover badge, edit icon) */}
      {children && <div className="absolute inset-0 z-10">{children}</div>}

      {/* 4. Optional Status Dot Indicator */}
      {status && (
        <span
          className={`absolute ${sizeConfig.statusOffset} ${sizeConfig.status} rounded-full ring-2 ${STATUS_COLORS[status]} z-20`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;
