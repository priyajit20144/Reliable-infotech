import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
  brackets?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
  brackets = false,
  ...props
}) => {
  return (
    <div
      className={`relative bg-[#181818] rounded border border-[#262626] p-6 transition-all duration-300 ${
        hover ? 'hover:border-[#363636] hover:-translate-y-0.5' : ''
      } ${brackets ? 'nf-frame nf-frame-hover' : ''} ${className}`}
      {...props}
    >
      {brackets && (
        <>
          <span className="nf-c nf-c-tl" />
          <span className="nf-c nf-c-tr" />
          <span className="nf-c nf-c-bl" />
          <span className="nf-c nf-c-br" />
        </>
      )}
      {children}
    </div>
  );
};
