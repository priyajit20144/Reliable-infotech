import React, { useState } from 'react';
import { X, Check, Clock, User, Mail, Globe, DollarSign, Calendar, ShieldCheck } from 'lucide-react';
import { CustomRequest, CustomRequestStatus } from '../../types';
import { RequestRowItem } from './AdminRecentRequestsTable';

interface AdminRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: RequestRowItem | null;
  onSaveStatus?: (reqId: string, newStatus: string, note: string, assignedTo: string) => Promise<void>;
}

export const AdminRequestModal: React.FC<AdminRequestModalProps> = ({
  isOpen,
  onClose,
  request,
  onSaveStatus,
}) => {
  if (!isOpen || !request) return null;

  const original = request.originalRequest;
  const initialStatus = original?.status || 'UNDER_REVIEW';
  const [status, setStatus] = useState<string>(initialStatus);
  const [assignedTo, setAssignedTo] = useState<string>(original?.assignedTo || 'Sarah Chen (Lead Architect)');
  const [note, setNote] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveStatus) {
      onClose();
      return;
    }
    try {
      setSaving(true);
      await onSaveStatus(original?._id || request.id, status, note, assignedTo);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 font-mono font-bold text-xs">
              {request.id}
            </span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {request.type}
              </h3>
              <p className="text-xs text-slate-400">
                Submitted by <span className="text-white font-medium">{request.client}</span> on {request.date}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Key details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Client Contact
              </span>
              <p className="text-xs font-bold text-white mt-1 truncate">
                {original?.email || 'client@reliableinfotech.io'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {original?.phone || '+1 (555) 234-5678'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Target Budget
              </span>
              <p className="text-xs font-bold text-emerald-400 mt-1">
                ${original?.budgetMin || 2500} – ${original?.budgetMax || 5000}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Priority: <span className="text-white font-semibold">{request.priority}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Target Deadline
              </span>
              <p className="text-xs font-bold text-cyan-300 mt-1">
                {original?.deadline || 'Dec 15, 2026'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">SLA: Active</p>
            </div>
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="text-[11px] font-bold text-white block">Project Requirements Description:</span>
            <p className="leading-relaxed">
              {original?.description ||
                'Full custom development required including high performance responsive architecture, custom client review dashboard, modern animated interactions, secure user auth, and Stripe payment gateway.'}
            </p>
          </div>

          {/* Workflow Status Modifier */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Manage Pipeline State
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Change Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="NEW">NEW</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="REQUIREMENTS">REQUIREMENTS</option>
                  <option value="QUOTATION">QUOTATION</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="IN_DEVELOPMENT">IN DEVELOPMENT</option>
                  <option value="TESTING">TESTING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Assign Lead Engineer
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="Sarah Chen (Lead Architect)">Sarah Chen (Lead Architect)</option>
                  <option value="Rahul Sharma (Frontend Developer)">Rahul Sharma (Frontend Developer)</option>
                  <option value="Priya Mehta (Backend Developer)">Priya Mehta (Backend Developer)</option>
                  <option value="Alex Rivera (System Admin)">Alex Rivera (System Admin)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Internal Status Update Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add milestone note or client feedback..."
                rows={2}
                className="w-full bg-[#111827] text-xs text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Updating...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
