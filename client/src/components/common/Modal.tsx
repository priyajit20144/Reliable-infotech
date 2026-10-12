import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog with Corner Brackets */}
      <div className="nf-frame relative z-10 w-full flex justify-center">
        <span className="nf-c nf-c-tl" />
        <span className="nf-c nf-c-tr" />
        <span className="nf-c nf-c-bl" />
        <span className="nf-c nf-c-br" />

        <div
          className={`relative w-full ${maxStyles[maxWidth]} max-h-[90vh] flex flex-col bg-[#121212] border border-[#262626] rounded shadow-2xl p-4 sm:p-6 my-auto transition-all duration-300 animate-in fade-in zoom-in-95`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#262626] mb-4 shrink-0">
            <h3 className="text-base sm:text-lg font-medium text-[#EEEEEE] truncate pr-2 font-sans tracking-tight">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#8D8D8D] hover:text-white hover:bg-[#1E1E1E] transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 pr-1 -mr-1">{children}</div>
        </div>
      </div>
    </div>
  );
};
