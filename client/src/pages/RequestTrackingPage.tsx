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
import { websocketService } from '../services/websocketService';
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
          // Fetch messages for user conversation
          const convId = user?.id ? `conv_${user.id}` : (res.data.userId ? `conv_${res.data.userId}` : `conv_${id}`);
          const msgRes = await messageService.getMessages(convId);
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
  }, [id, user?.id]);

  // Real-time WebSocket listener for incoming messages on this request thread
  useEffect(() => {
    const unsubscribe = websocketService.subscribe('NEW_MESSAGE', (payload: any) => {
      if (payload && payload.message) {
        const msg = payload.message;
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const convId = user?.id ? `conv_${user.id}` : (request?.userId ? `conv_${request.userId}` : `conv_${id}`);
    try {
      setSendingMsg(true);
      const res = await messageService.sendMessage(convId, newMessage.trim());
      if (res.success && res.data) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === res.data._id)) return prev;
          return [...prev, res.data];
        });
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
      <Card brackets={true} className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="purple" size="sm">{request.websiteType}</Badge>
              <Badge variant="emerald" size="sm" dot>{request.status}</Badge>
            </div>
            <h1 className="text-2xl font-medium text-white">
              {request.businessName || request.websiteType}
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-1 font-mono">
              Submitted on {new Date(request.createdAt).toLocaleDateString()} · Request ID: {request._id}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#EEEEEE]">
            <div className="p-3 rounded bg-[#181818] border border-[#262626]">
              <span className="text-[10px] text-[#A1A1AA] font-mono block uppercase">Budget Scope</span>
              <span className="font-bold text-white font-mono">${request.budgetMin} – ${request.budgetMax}</span>
            </div>
            <div className="p-3 rounded bg-[#181818] border border-[#262626]">
              <span className="text-[10px] text-[#A1A1AA] font-mono block uppercase">Assigned Team</span>
              <span className="font-semibold text-[#EEEEEE]">{request.assignedTo || 'Reliable Info Tech Core Team'}</span>
            </div>
          </div>
        </div>

        {/* 10-Step Interactive Status Timeline */}
        <div className="pt-8">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-6">
            Sprint Milestone Progress
          </h4>

          <div className="relative">
            {/* Timeline track line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#262626] -translate-y-1/2" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-4 relative z-10">
              {timelineSteps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold transition-all shadow-md ${
                        isCurrent
                          ? 'bg-[#EEEEEE] text-[#0B0B0B] ring-2 ring-[#EEEEEE]/40 scale-110'
                          : isPassed
                          ? 'bg-[#4ADE80] text-[#0B0B0B]'
                          : 'bg-[#181818] text-[#71717A] border border-[#262626]'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-mono mt-2 leading-tight ${
                        isCurrent
                          ? 'text-white font-bold'
                          : isPassed
                          ? 'text-[#EEEEEE]'
                          : 'text-[#71717A]'
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
          <Card brackets={true} className="space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-[#262626] pb-2 font-mono uppercase">
              Requirements Specification
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              {request.description}
            </p>

            <div>
              <p className="text-[11px] font-mono uppercase text-[#71717A] mb-2">Required Features:</p>
              <div className="flex flex-wrap gap-1.5">
                {request.requiredFeatures.map((f, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#181818] text-[#EEEEEE] border border-[#262626] font-mono"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {request.referenceUrls && request.referenceUrls.length > 0 && (
              <div>
                <p className="text-[11px] font-mono uppercase text-[#71717A] mb-1">References:</p>
                {request.referenceUrls.map((u, i) => (
                  <a
                    key={i}
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#EEEEEE] hover:underline block truncate font-mono"
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
          <Card brackets={true} className="flex flex-col h-[520px] p-0 overflow-hidden">
            <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#121212]">
              <div>
                <h3 className="text-sm font-semibold text-white">Direct Team Communication</h3>
                <p className="text-[11px] text-[#A1A1AA] font-mono">
                  Sprint discussion with {request.assignedTo || 'Sarah Chen (Lead Architect)'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#4ADE80] font-mono">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                <span>ONLINE</span>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B0B0B]/40">
              {messages.map((m) => {
                const isMe = m.senderId === user?.id;
                return (
                  <div
                    key={m._id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-[#71717A] font-mono mb-1">
                      <span>{m.senderName}</span>
                      <span>·</span>
                      <span>{m.senderRole}</span>
                    </div>
                    <div
                      className={`max-w-md p-3 rounded text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#EEEEEE] text-[#0B0B0B] font-medium shadow-sm'
                          : 'bg-[#181818] text-[#EEEEEE] border border-[#262626]'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#262626] bg-[#121212] flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message or sprint feedback..."
                className="flex-1 bg-[#181818] text-xs text-white rounded px-3.5 py-2.5 border border-[#262626] focus:outline-none focus:border-[#EEEEEE]"
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
