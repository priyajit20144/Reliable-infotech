import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  id,
  rows = 4,
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-mono font-medium text-[#A1A1AA]">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full bg-[#181818] text-[#EEEEEE] placeholder-[#71717A] text-sm rounded border border-[#262626] hover:border-[#363636] px-3.5 py-2.5 transition-colors focus:outline-none focus:border-[#EEEEEE] focus:ring-1 focus:ring-[#EEEEEE] disabled:opacity-50 ${
          error ? 'border-red-500/80 focus:border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1 font-mono">{error}</p>}
    </div>
  );
};
