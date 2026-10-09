import React, { useState } from 'react';
import { X, Plus, Upload, Check } from 'lucide-react';
import { adminService } from '../../services/adminService';

interface AdminCreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}

export const AdminCreateProjectModal: React.FC<AdminCreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('E-commerce');
  const [price, setPrice] = useState(3800);
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [tech, setTech] = useState('React, TypeScript, Tailwind CSS, Node.js');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminService.createProject({
        title,
        category,
        price,
        shortDescription: shortDesc || 'High-performance bespoke digital experience',
        description: desc || shortDesc || 'Engineered with modern full-stack best practices.',
        technologies: tech.split(',').map((t) => t.trim()).filter(Boolean),
        demoUrl: demoUrl || 'https://demo.devcraft.io',
        githubUrl: githubUrl || 'https://github.com/devcraft-org',
        images: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        ],
        thumbnail:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
        features: ['Production Architecture', 'High Availability SLA', 'Modern Responsive UI'],
      });
      onProjectCreated?.();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              Add Showcase Project
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NexusCloud Analytics Platform"
              className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="E-commerce">E-commerce</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Productivity">Productivity</option>
                <option value="Education">Education</option>
                <option value="Cloud / DevOps">Cloud / DevOps</option>
                <option value="Fintech / Payments">Fintech / Payments</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Price ($ USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Short Description</label>
            <input
              type="text"
              required
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Brief overview for catalog cards..."
              className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="React, TypeScript, Tailwind CSS, Node.js"
              className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Live Demo URL</label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">GitHub URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Creating...' : 'Publish to Showcase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
