import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  User,
  MessageSquare,
  ShieldCheck,
  CheckCheck,
  Clock,
  Sparkles,
  RefreshCw,
  Circle,
  Lock,
  Headphones,
  Zap,
} from 'lucide-react';
import { messageService } from '../services/messageService';
import { Conversation, Message } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/common/Skeleton';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [messages]);

  // Initial load: Fetch conversations
  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await messageService.getConversations();
      if (res.success && res.data) {
        setConversations(res.data);
        if (res.data.length > 0) {
          // If no activeConvId selected yet, or current active is not in list, select the first one
          setActiveConvId((prev) => {
            const found = res.data.some((c: any) => (c._id || c.id) === prev);
            return found ? prev : (res.data[0]._id || res.data[0].id);
          });
        } else if (user?.id) {
          setActiveConvId(`conv_${user.id}`);
        }
      }
    } catch (err) {
      console.error('[fetchConversations error]:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user?.id]);

  // Fetch messages for active conversation
  const fetchMessages = async (convId: string, silent = false) => {
    if (!convId) return;
    try {
      if (!silent) setRefreshing(true);
      const res = await messageService.getMessages(convId);
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('[fetchMessages error]:', err);
    } finally {
      if (!silent) setRefreshing(false);
    }
  };

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
      // Mark read
      messageService.markAsRead(activeConvId).catch(() => {});
    }
  }, [activeConvId]);

  // Live polling every 4 seconds to sync replies from Admin seamlessly
  useEffect(() => {
    if (!activeConvId) return;
    const interval = setInterval(() => {
      fetchMessages(activeConvId, true);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeConvId]);

  // Handle Send Message
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const content = newMsg.trim();
    if (!content) return;

    const targetId = activeConvId || `conv_${user?.id || 'client'}`;

    // Optimistic UI update
    const optimisticMsg: Message = {
      _id: `temp_${Date.now()}`,
      id: `temp_${Date.now()}`,
      conversationId: targetId,
      senderId: user?.id || 'usr_client',
      senderName: user?.name || 'You',
      senderRole: 'USER',
      message: content,
      text: content,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      isMe: true,
      isRead: false,
      attachments: [],
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMsg('');
    inputRef.current?.focus();

    // Update conversation lastMessage snippet
    setConversations((prev) =>
      prev.map((c) =>
        (c._id === targetId || c.id === targetId)
          ? { ...c, lastMessage: content, time: 'Just now' }
          : c
      )
    );

    try {
      setSending(true);
      const res = await messageService.sendMessage(targetId, content);
      if (res.success && res.data) {
        // Replace optimistic message with server verified message
        setMessages((prev) =>
          prev.map((m) => (m._id === optimisticMsg._id ? res.data : m))
        );
      }
    } catch (err: any) {
      console.error('[sendMessage error]:', err);
      alert(err.message || 'Error sending message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Quick suggestion prompts for user convenience
  const quickSuggestions = [
    'Can we review the current sprint roadmap?',
    'I have feedback on the website wireframes.',
    'What is the estimated delivery turnaround?',
    'Can we schedule a 15-minute architecture call?',
  ];

  const handleSuggestionClick = (text: string) => {
    setNewMsg(text);
    inputRef.current?.focus();
  };

  // Find active conversation details
  const currentConv =
    conversations.find((c) => (c._id || c.id) === activeConvId) || conversations[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0 pb-8 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="pb-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Client & Team Messages
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Direct Channel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Direct 1-on-1 messaging channel with assigned DevCraft lead architects, engineers, and project managers
          </p>
        </div>

        {/* Encrypted Line Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>End-to-End Encrypted</span>
          </div>
          <button
            onClick={() => {
              if (activeConvId) fetchMessages(activeConvId);
            }}
            disabled={refreshing}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all disabled:opacity-50"
            title="Refresh messages"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px] h-[calc(100vh-210px)] max-h-[850px]">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Active Channel & Direct Support Info (4 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full">
          {/* Active Conversation Card */}
          <Card className="p-4 bg-[#0B0F1D] border-slate-800/80 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                Active Consultation Thread
              </h3>
              <span className="text-[10px] font-bold text-blue-400 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                1-on-1 Direct
              </span>
            </div>

            {loading ? (
              <div className="space-y-3 py-2">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ) : (
              <div className="space-y-2">
                {/* Active Support Channel Item */}
                <button
                  type="button"
                  onClick={() => {
                    if (currentConv) setActiveConvId(currentConv._id || currentConv.id || '');
                  }}
                  className="w-full p-3.5 rounded-2xl text-left transition-all border bg-blue-600/10 border-blue-500/40 text-white shadow-lg shadow-blue-500/5 relative group"
                >
                  <div className="flex items-center gap-3">
                    {/* Admin Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                        alt="DevCraft Support"
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/40"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0B0F1D]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                          <span>Alex Rivera</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {currentConv?.time || 'Active'}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-cyan-400 truncate">
                        DevCraft Lead Architect
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-1">
                        {currentConv?.lastMessage || 'Hello! How can we assist you today?'}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </Card>

          {/* Direct Architecture Channel Info Card */}
          <Card className="p-4 bg-[#090D1A] border-slate-800/80 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-white text-xs font-bold">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <span>DevCraft Client Assurance</span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
                <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Strict Client Privacy: </span>
                    Messages are strictly confidential between your account and verified DevCraft administrators.
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Rapid Response SLA: </span>
                    Lead engineers monitor this channel with guaranteed response within 15 minutes during active sprints.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Consultation Chips */}
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Inquiries
              </span>
              <div className="flex flex-col gap-1.5">
                {quickSuggestions.slice(0, 3).map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(sug)}
                    className="text-left text-[11px] text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-800 transition-colors truncate"
                  >
                    💬 {sug}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 1-on-1 Interactive Chat Box (8 cols)        */}
        {/* ========================================================= */}
        <Card className="lg:col-span-8 p-0 bg-[#0A1024] border-slate-800 flex flex-col h-full overflow-hidden shadow-2xl">
          {/* Chat Window Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-[#080E20]/90 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Alex Rivera"
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-700"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#080E20]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Alex Rivera
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    Lead Architect & Admin
                  </span>
                </div>
                <p className="text-[11px] text-cyan-400 font-medium truncate mt-0.5">
                  Direct Architecture Consultation & Milestone Support
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Circle className="w-1.5 h-1.5 fill-emerald-400" />
                <span>Online & Available</span>
              </span>
            </div>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0 bg-[#070D1E]/40">
            {/* Direct Consultation Welcome Pill */}
            <div className="text-center my-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/90 text-[11px] text-slate-400 border border-slate-800 font-medium shadow-sm">
                <Lock className="w-3 h-3 text-emerald-400" />
                Direct 1-on-1 Consultation between{' '}
                <strong className="text-slate-200">{user?.name || 'You'}</strong> and{' '}
                <strong className="text-slate-200">DevCraft Admin</strong>
              </span>
            </div>

            {loading ? (
              <div className="space-y-4 py-6">
                <Skeleton className="h-16 w-3/4 rounded-2xl" />
                <Skeleton className="h-16 w-1/2 ml-auto rounded-2xl" />
                <Skeleton className="h-16 w-2/3 rounded-2xl" />
              </div>
            ) : messages.length === 0 ? (
              /* Friendly Empty State */
              <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div className="max-w-md space-y-1">
                  <h4 className="text-sm font-bold text-white">Start your consultation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Have questions about your custom website build, tech stack, or roadmap? Send a message directly to DevCraft Lead Architect Alex Rivera.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {quickSuggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(sug)}
                      className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 transition-all"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message Bubbles: Only Current User and Admin messages */
              messages.map((m) => {
                const isMe = m.senderId === user?.id || m.isMe;
                return (
                  <div
                    key={m._id || m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                  >
                    {/* Message Header info */}
                    <div
                      className={`flex items-baseline gap-2 mb-1 px-1 text-[11px] ${
                        isMe ? 'flex-row-reverse text-right' : 'text-left'
                      }`}
                    >
                      <span className="font-bold text-slate-300 flex items-center gap-1">
                        {isMe ? 'You' : m.senderName || 'Alex Rivera'}
                        {!isMe && (
                          <span className="text-[10px] font-semibold text-blue-400 px-1.5 py-0.2 rounded bg-blue-500/15">
                            ADMIN
                          </span>
                        )}
                      </span>
                      <span className="text-slate-500 text-[10px] flex items-center gap-1">
                        {m.time || '10:00 AM'}
                        {isMe && <CheckCheck className="w-3 h-3 text-blue-400" />}
                      </span>
                    </div>

                    {/* Message Bubble Card */}
                    <div
                      className={`max-w-[85%] sm:max-w-[72%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all ${
                        isMe
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-lg shadow-blue-500/20 border border-blue-400/20 font-normal'
                          : 'bg-[#111A2E] text-slate-100 rounded-tl-xs border border-slate-800/80 font-normal shadow-md'
                      }`}
                    >
                      {m.message || m.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips Carousel */}
          <div className="px-4 py-2 border-t border-slate-800/60 bg-[#080E20]/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Prompt:
            </span>
            {quickSuggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestionClick(sug)}
                className="text-[11px] text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-800 whitespace-nowrap transition-colors shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Bottom Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3.5 sm:p-4 border-t border-slate-800/80 bg-[#070D1E] flex items-center gap-2.5 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Type message to Alex Rivera (DevCraft Lead Architect)...`}
              className="flex-1 bg-[#0F172A] text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={sending}
              disabled={!newMsg.trim() || sending}
              className="rounded-xl px-4 py-3 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 text-white shrink-0 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
