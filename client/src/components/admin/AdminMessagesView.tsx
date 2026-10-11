import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Search,
  Send,
  User,
  CheckCheck,
  Circle,
  ChevronLeft,
  Clock,
  RefreshCw,
  ShieldCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { messageService } from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';

interface MessageItem {
  id: string;
  _id?: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  message?: string;
  time: string;
  isMe: boolean;
  createdAt?: string;
}

interface ConversationItem {
  id: string;
  _id?: string;
  clientName: string;
  clientEmail: string;
  clientAvatar: string;
  projectSubject: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
  updatedAt?: string;
}

export const AdminMessagesView: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of thread
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom(messages.length <= 1 ? 'auto' : 'smooth');
  }, [messages]);

  // Fetch real conversations from API
  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await messageService.getConversations();
      if (res.success && Array.isArray(res.data)) {
        const formatted: ConversationItem[] = res.data.map((c: any) => ({
          id: c.id || c._id,
          _id: c.id || c._id,
          clientName: c.clientName || 'Client',
          clientEmail: c.clientEmail || '',
          clientAvatar:
            c.clientAvatar && c.clientAvatar.startsWith('http')
              ? c.clientAvatar
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  c.clientName || 'User'
                )}&background=2563eb&color=fff&bold=true`,
          projectSubject:
            c.projectSubject && !c.projectSubject.includes('DevCraft')
              ? c.projectSubject
              : 'Reliable Info Tech Support & Architecture Consultation',
          lastMessage: c.lastMessage || 'No messages yet.',
          time: c.time || 'Recent',
          unreadCount: c.unreadCount || 0,
          online: c.online !== undefined ? c.online : true,
          updatedAt: c.updatedAt,
        }));

        setConversations(formatted);

        // Auto-select first conversation if none selected yet or previous selection is gone
        setSelectedConvId((currentSelected) => {
          if (formatted.length === 0) return '';
          const exists = formatted.some((c) => c.id === currentSelected);
          return exists ? currentSelected : formatted[0].id;
        });
      }
    } catch (err) {
      console.error('[Admin fetchConversations error]:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (convId: string, silent = false) => {
    if (!convId) return;
    try {
      if (!silent) setMessagesLoading(true);
      const res = await messageService.getMessages(convId);
      if (res.success && Array.isArray(res.data)) {
        setMessages(
          res.data.map((m: any) => ({
            id: m.id || m._id,
            _id: m.id || m._id,
            senderId: m.senderId,
            senderName:
              m.senderRole === 'ADMIN' || m.senderRole === 'TEAM_MEMBER'
                ? m.senderName || 'Priyajit Das (Administrator)'
                : m.senderName || 'Client',
            senderRole: m.senderRole || 'USER',
            text: m.text || m.message || '',
            message: m.text || m.message || '',
            time: m.time || 'Recent',
            isMe: Boolean(m.isMe || m.senderRole === 'ADMIN' || m.senderRole === 'TEAM_MEMBER'),
            createdAt: m.createdAt,
          }))
        );
      }
    } catch (err) {
      console.error('[Admin fetchMessages error]:', err);
    } finally {
      if (!silent) setMessagesLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, []);

  // When active conversation changes, load messages and mark as read
  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId);
      messageService.markAsRead(selectedConvId).catch(() => {});
      // Decrement unread in local state
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedConvId ? { ...c, unreadCount: 0 } : c))
      );
    } else {
      setMessages([]);
    }
  }, [selectedConvId]);

  // Real-time polling every 4 seconds to sync client messages
  useEffect(() => {
    const timer = setInterval(() => {
      fetchConversations(true);
      if (selectedConvId) {
        fetchMessages(selectedConvId, true);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [selectedConvId]);

  // Selected conversation object
  const selectedConv = conversations.find((c) => c.id === selectedConvId) || null;

  // Handle Admin Sending Reply
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = inputText.trim();
    if (!content || !selectedConvId || sending) return;

    const adminName = user?.name || 'Priyajit Das';
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: MessageItem = {
      id: tempId,
      _id: tempId,
      senderId: user?.id || 'usr_admin_1',
      senderName: `${adminName} (Administrator)`,
      senderRole: 'ADMIN',
      text: content,
      message: content,
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      isMe: true,
      createdAt: new Date().toISOString(),
    };

    // Optimistically append message
    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText('');

    // Update conversation last message in local list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConvId
          ? {
              ...c,
              lastMessage: content,
              time: 'Just now',
            }
          : c
      )
    );

    try {
      setSending(true);
      const res = await messageService.sendMessage(selectedConvId, content);
      if (res.success && res.data) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...res.data,
                  isMe: true,
                  text: res.data.message || res.data.text || content,
                }
              : m
          )
        );
      }
    } catch (err) {
      console.error('[Admin sendMessage error]:', err);
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.clientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.projectSubject.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.clientEmail.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-140px)] min-h-[560px] flex flex-col animate-in fade-in duration-300">
      {/* Messages Shell Container */}
      <div className="flex-1 rounded-2xl sm:rounded-3xl bg-[#0B0F1D] border border-slate-800 overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        {/* ======================================================== */}
        {/* LEFT PANEL: Client Messages List                          */}
        {/* ======================================================== */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-800/80 flex flex-col bg-[#070D1E] shrink-0 h-full ${
            mobileThreadOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header & Search */}
          <div className="p-4 sm:p-5 border-b border-slate-800 space-y-3.5 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight">
                    Client Messages
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Verified Registered Users
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchConversations()}
                  title="Refresh conversations"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  {totalUnread > 0 ? `${totalUnread} Unread` : 'All Read'}
                </span>
              </div>
            </div>

            {/* Search conversations input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search clients, email, or messages..."
                className="w-full bg-[#0B1224] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-blue-500/80 transition-colors"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
            {loading && conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                <span>Loading active client messages...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                {conversations.length === 0
                  ? 'No client conversations yet.'
                  : 'No conversations matching search.'}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      setMobileThreadOpen(true);
                    }}
                    className={`w-full text-left p-4 flex items-start gap-3.5 transition-all relative ${
                      isSelected
                        ? 'bg-blue-600/10 border-l-4 border-blue-500'
                        : 'hover:bg-slate-800/30 border-l-4 border-transparent'
                    }`}
                  >
                    {/* Client Avatar with Online Status Indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={conv.clientAvatar}
                        alt={conv.clientName}
                        onError={(e) => {
                          // Fallback on image error
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            conv.clientName || 'User'
                          )}&background=2563eb&color=fff&bold=true`;
                        }}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-700/80 bg-slate-800"
                      />
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#070D1E]" />
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">
                          {conv.clientName}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 shrink-0">
                          {conv.time}
                        </span>
                      </div>

                      {/* Project / Subject Tag */}
                      <p className="text-[11px] font-medium text-cyan-400 truncate mt-0.5">
                        {conv.projectSubject}
                      </p>

                      {/* Message Preview Snippet */}
                      <p className="text-[11px] text-slate-400 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {/* Unread Pill Badge */}
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold shrink-0 self-center flex items-center justify-center shadow-md shadow-blue-600/40">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Active Chat Thread                          */}
        {/* ======================================================== */}
        <div
          className={`flex-1 flex flex-col bg-[#0A1024] min-w-0 h-full ${
            !mobileThreadOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 sm:p-5 border-b border-slate-800/80 flex items-center justify-between gap-3 bg-[#080E20]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setMobileThreadOpen(false)}
                    className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors shrink-0"
                    title="Back to conversation list"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="relative shrink-0">
                    <img
                      src={selectedConv.clientAvatar}
                      alt={selectedConv.clientName}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedConv.clientName || 'User'
                        )}&background=2563eb&color=fff&bold=true`;
                      }}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-700 bg-slate-800"
                    />
                    {selectedConv.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#080E20]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                      <span>{selectedConv.clientName}</span>
                      {selectedConv.clientEmail && (
                        <span className="text-[11px] font-normal text-slate-400 truncate hidden sm:inline">
                          ({selectedConv.clientEmail})
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] font-medium text-cyan-400 truncate mt-0.5">
                      {selectedConv.projectSubject}
                    </p>
                  </div>
                </div>

                {/* Encrypted Channel Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Circle className="w-1.5 h-1.5 fill-emerald-400" />
                    <span>Encrypted Channel</span>
                  </span>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#070D1E]/40">
                {/* Centered Consultation Notice */}
                <div className="text-center my-2">
                  <span className="px-3.5 py-1 rounded-full bg-slate-900/90 text-[11px] text-slate-400 border border-slate-800 font-medium">
                    Direct Consultation with{' '}
                    <strong className="text-slate-200">{selectedConv.clientName}</strong>
                  </span>
                </div>

                {messagesLoading && messages.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                    <span>Loading conversation history...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 text-xs">
                    No messages in this conversation yet. Send a greeting below!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id || msg._id}
                      className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                    >
                      {/* Sender Name & Timestamp */}
                      <div
                        className={`flex items-baseline gap-2 mb-1 px-1 text-[11px] ${
                          msg.isMe ? 'flex-row-reverse text-right' : 'text-left'
                        }`}
                      >
                        <span className="font-bold text-slate-300">
                          {msg.isMe ? 'You (Administrator)' : msg.senderName}
                        </span>
                        <span className="text-slate-500 text-[10px]">{msg.time}</span>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap select-text ${
                          msg.isMe
                            ? 'bg-blue-600 text-white rounded-tr-sm shadow-[0_0_20px_rgba(37,99,235,0.35)] font-normal'
                            : 'bg-[#111A2E] text-slate-200 rounded-tl-sm border border-slate-800/80 font-normal shadow-md'
                        }`}
                      >
                        {msg.text || msg.message}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Reply Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-slate-800/80 bg-[#070D1E]/95 backdrop-blur-md flex items-center gap-2.5 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Reply to ${selectedConv.clientName}...`}
                  className="flex-1 bg-[#0F172A] text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-600/30 transition-all shrink-0 active:scale-95 flex items-center justify-center min-w-[44px]"
                  title="Send reply"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            /* Empty State when no conversation is selected */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Select a Conversation</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Choose a client from the conversation sidebar on the left to review inquiries, milestones, and send direct architectural replies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessagesView;
