import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Send,
  User,
  Shield,
  FileText,
  DollarSign,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { requestService } from '../services/requestService';
import { messageService } from '../services/messageService';
import { CustomRequest, CustomRequestStatus, Message } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { BrandLoader } from '../components/common/BrandLoader';
import { useAuth } from '../context/AuthContext';

export const RequestTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [request, setRequest] = useState<CustomRequest | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const timelineSteps: { key: CustomRequestStatus; label: string }[] = [
    { key: 'NEW', label: 'Submitted' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'REQUIREMENTS', label: 'Requirements' },
    { key: 'QUOTATION', label: 'Quotation' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'IN_DEVELOPMENT', label: 'In Development' },
    { key: 'TESTING', label: 'Testing & QA' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!id) return;
      try {
        const res = await requestService.getRequestById(id);
        if (res.success && res.data) {
          setRequest(res.data);
          // Fetch messages for conv_1 or mock conv
          const msgRes = await messageService.getMessages('conv_1');
          if (msgRes.success && msgRes.data) {
            setMessages(msgRes.data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSendingMsg(true);
      const res = await messageService.sendMessage('conv_1', newMessage.trim());
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return <BrandLoader message="Loading request telemetry and sprint history..." />;
  }

  if (!request) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-white">Request Not Found</h2>
        <Link to="/dashboard/requests" className="text-xs text-indigo-400 mt-2 inline-block">
          Return to My Requests
        </Link>
      </div>
    );
  }

  const currentStepIndex = timelineSteps.findIndex((s) => s.key === request.status);

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full min-w-0">
      {/* Top back navigation */}
      <Link
        to="/dashboard/requests"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Requests</span>
      </Link>

      {/* Header Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="purple" size="sm">{request.websiteType}</Badge>
              <Badge variant="emerald" size="sm" dot>{request.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {request.businessName || request.websiteType}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Submitted on {new Date(request.createdAt).toLocaleDateString()} · Request ID: {request._id}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-300">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-gray-400 block uppercase">Budget Scope</span>
              <span className="font-bold text-white">${request.budgetMin} – ${request.budgetMax}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-gray-400 block uppercase">Assigned Team</span>
              <span className="font-bold text-indigo-300">{request.assignedTo || 'Reliable Info Tech Core Team'}</span>
            </div>
          </div>
        </div>

        {/* 10-Step Interactive Status Timeline */}
        <div className="pt-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
            Sprint Milestone Progress
          </h4>

          <div className="relative">
            {/* Timeline track line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-4 relative z-10">
              {timelineSteps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                        isCurrent
                          ? 'bg-devcraft-primary text-white ring-4 ring-indigo-500/30 scale-110'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 text-gray-500 border border-white/10'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-medium mt-2 leading-tight ${
                        isCurrent
                          ? 'text-white font-bold'
                          : isPassed
                          ? 'text-gray-300'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* 2-Column: Details & Messaging Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Specifications */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/8 pb-2">
              Requirements Specification
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {request.description}
            </p>

            <div>
              <p className="text-[11px] font-semibold text-gray-400 mb-2">Required Features:</p>
              <div className="flex flex-wrap gap-1.5">
                {request.requiredFeatures.map((f, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {request.referenceUrls && request.referenceUrls.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-gray-400 mb-1">References:</p>
                {request.referenceUrls.map((u, i) => (
                  <a
                    key={i}
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:underline block truncate"
                  >
                    {u}
                  </a>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right 2 Columns: Messaging with Team */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[520px] p-0 overflow-hidden">
            <div className="p-4 border-b border-white/8 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-sm font-bold text-white">Direct Team Communication</h3>
                <p className="text-[11px] text-gray-400">
                  Sprint discussion with {request.assignedTo || 'Sarah Chen (Lead Architect)'}
                </p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Team Online" />
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const isMe = m.senderId === user?.id;
                return (
                  <div
                    key={m._id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-1">
                      <span>{m.senderName}</span>
                      <span>·</span>
                      <span>{m.senderRole}</span>
                    </div>
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-devcraft-primary text-white rounded-br-none shadow-sm'
                          : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/10'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/8 bg-[#111827] flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message or sprint feedback..."
                className="flex-1 bg-[#0B0F19] text-xs text-white rounded-xl px-3.5 py-2.5 border border-white/10 focus:outline-none focus:border-indigo-500"
              />
              <Button type="submit" variant="primary" size="sm" loading={sendingMsg}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
