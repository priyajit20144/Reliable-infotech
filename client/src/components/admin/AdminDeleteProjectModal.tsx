import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  AlertTriangle,
  X,
  ExternalLink,
  DollarSign,
  Tag,
  ShieldAlert,
} from 'lucide-react';
import { Project } from '../../types';

interface AdminDeleteProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const AdminDeleteProjectModal: React.FC<AdminDeleteProjectModalProps> = ({
  isOpen,
  project,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={isDeleting ? undefined : onClose}
            aria-hidden="true"
          />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0F172A] border border-rose-500/30 shadow-2xl p-6 sm:p-7 z-10 my-auto overflow-hidden text-left"
          role="dialog"
          aria-modal="true"
        >
          {/* Ambient warning radial glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-rose-600/20 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-amber-600/10 blur-[80px] pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4 mb-5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-950/40">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] font-semibold text-rose-300 font-mono mb-1">
                <ShieldAlert className="w-3 h-3" />
                <span>IRREVERSIBLE ACTION</span>
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Delete Showcase Project
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Permanently remove this project from your portfolio catalog
              </p>
            </div>
          </div>

          {/* Project Preview Card */}
          <div className="relative z-10 p-3.5 rounded-2xl bg-[#0B0F19]/90 border border-white/10 mb-5 flex items-center gap-3.5">
            <img
              src={
                project.thumbnail ||
                project.images?.[0] ||
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'
              }
              alt={project.title}
              className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{project.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 text-gray-300 border border-white/10">
                  {project.category}
                </span>
                {project.price ? (
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ${project.price.toLocaleString()}
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-gray-400 truncate mt-1">
                Slug: <code className="text-indigo-300 font-mono">{project.slug || project._id}</code>
              </p>
            </div>
          </div>

          {/* Warning Advisory Callout */}
          <div className="relative z-10 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-200 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">{project.title}</strong>? Once deleted, the public showcase page, metadata, and live preview links will no longer be accessible to clients.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex items-center justify-end gap-3 pt-2 border-t border-white/8">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-950/50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting Project...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Project</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
};
