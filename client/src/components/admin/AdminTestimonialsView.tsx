import React, { useState } from 'react';
import { Star, Plus, Trash2, Check, Eye, X, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  published: boolean;
  date: string;
}

export const AdminTestimonialsView: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [addModal, setAddModal] = useState(false);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 't_1',
      clientName: 'Rahul Sharma',
      role: 'Creative Director',
      company: 'Horizon Studio',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      content:
        'Reliable Info Tech delivered our custom studio showcase on time with flawless animations and responsive design. Our client conversion increased by 40% in month one!',
      rating: 5,
      published: true,
      date: 'March 12, 2026',
    },
    {
      id: 't_2',
      clientName: 'Priya Sharma',
      role: 'VP of Product',
      company: 'NextGen Mobility',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      content:
        'The engineering discipline of the Reliable Info Tech team is unparalleled. High availability architecture, pristine code, and an intuitive dashboard.',
      rating: 5,
      published: true,
      date: 'February 28, 2026',
    },
    {
      id: 't_3',
      clientName: 'Amit Verma',
      role: 'CEO',
      company: 'Apex Logistics',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      content:
        'Sub-second load times and seamless Stripe escrow payment integration. Couldn’t have asked for a better digital agency partner.',
      rating: 5,
      published: true,
      date: 'April 02, 2026',
    },
    {
      id: 't_4',
      clientName: 'Neha Singh',
      role: 'Brand Founder',
      company: 'Verve Luxury Retail',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      content:
        'Our luxury catalog looks stunning on all devices from iPhone to 4K displays. The dark mode glassmorphism UI is unmatched in the industry.',
      rating: 5,
      published: false,
      date: 'April 06, 2026',
    },
  ]);

  // Form state
  const [newClient, setNewClient] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState(5);

  const togglePublished = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, published: !t.published } : t))
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient || !newContent) return;

    const newT: Testimonial = {
      id: `t_${Date.now()}`,
      clientName: newClient,
      role: newRole || 'Founder',
      company: newCompany || 'Independent Client',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      content: newContent,
      rating: newRating,
      published: true,
      date: 'Just now',
    };

    setTestimonials([newT, ...testimonials]);
    setNewClient('');
    setNewCompany('');
    setNewRole('');
    setNewContent('');
    setAddModal(false);
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === 'PUBLISHED') return t.published;
    if (filter === 'DRAFT') return !t.published;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0D1527] border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Client Feedback & Testimonials Showcase
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Curate client reviews and ratings published on the public landing page
            </p>
          </div>
        </div>

        <button
          onClick={() => setAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Total Client Reviews</span>
          <p className="text-2xl font-black text-white mt-1">{testimonials.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Live on Public Landing</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {testimonials.filter((t) => t.published).length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Average Rating</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-amber-400">5.0</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === st
                ? 'bg-blue-600 text-white'
                : 'bg-[#0D1527] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTestimonials.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <Quote className="w-16 h-16 text-white/[0.03] absolute -top-2 -right-2 pointer-events-none" />

            <div>
              {/* Stars & Published badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.published
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-700/50 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.published ? 'Live on Landing' : 'Draft / Hidden'}
                  </span>
                </div>
              </div>

              {/* Quote Content */}
              <p className="text-xs sm:text-sm text-slate-200 mt-3 leading-relaxed italic">
                "{item.content}"
              </p>
            </div>

            {/* Author details & actions */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.clientName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{item.clientName}</h4>
                  <p className="text-[11px] text-slate-400">
                    {item.role} • {item.company}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublished(item.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    item.published
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {item.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Testimonial */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setAddModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-[#0F172A] border border-slate-700 shadow-2xl p-6 z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base text-white">Add Client Review</h3>
              <button onClick={() => setAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTestimonial} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Role</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. CTO"
                    className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Company</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. TechCorp"
                    className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Review Statement</label>
                <textarea
                  rows={3}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write the client's quote and recommendation..."
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
