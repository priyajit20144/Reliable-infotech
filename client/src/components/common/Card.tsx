import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`glass-card rounded-2xl p-6 border border-white/8 transition-all duration-300 ${
        hover ? 'hover:border-indigo-500/30 hover:shadow-card hover:-translate-y-0.5' : ''
      } ${glow ? 'glow-border' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
