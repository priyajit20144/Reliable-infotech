import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-[#0B0B0B] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variants = {
    primary:
      'bg-[#EEEEEE] hover:bg-white text-[#121212] font-semibold shadow-sm focus:ring-[#EEEEEE] border border-white/20',
    secondary:
      'bg-[#181818] hover:bg-[#1E1E1E] text-[#EEEEEE] border border-[#262626] hover:border-[#363636] focus:ring-[#EEEEEE]',
    outline:
      'bg-transparent hover:bg-[#181818] text-[#EEEEEE] border border-[#262626] hover:border-[#363636] focus:ring-[#EEEEEE]',
    ghost:
      'bg-transparent hover:bg-[#181818] text-[#A1A1AA] hover:text-[#EEEEEE] focus:ring-[#EEEEEE]',
    danger:
      'bg-[#2A1215] hover:bg-[#38161A] text-[#F87171] border border-[#4C1D24] focus:ring-red-400',
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
