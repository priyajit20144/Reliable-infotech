import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-mono font-medium text-[#A1A1AA]">
          {label}
        </label>
      )}
      <div className="relative rounded">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#181818] text-[#EEEEEE] placeholder-[#71717A] text-sm rounded border border-[#262626] hover:border-[#363636] px-3.5 py-2.5 transition-colors focus:outline-none focus:border-[#EEEEEE] focus:ring-1 focus:ring-[#EEEEEE] disabled:opacity-50 ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-red-500/80 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1 font-mono">{error}</p>}
    </div>
  );
};
