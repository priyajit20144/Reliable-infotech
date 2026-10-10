import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Search,
  Send,
  User,
  Paperclip,
  CheckCheck,
  Circle,
  ChevronLeft,
  Clock,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { messageService } from '../../services/messageService';

interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  time: string;
  isMe: boolean;
  createdAt?: string;
}

interface ConversationItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientAvatar: string;
  projectSubject: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
}

export const AdminMessagesView: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationItem[]>([
    {
      id: 'conv_1',
      clientName: 'Rahul Sharma',
      clientEmail: 'client@reliableinfotech.io',
      clientAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      projectSubject: 'Horizon Creative Studio Showcase',
      lastMessage: 'Awesome, can we schedule a demo call tomorrow at 3 PM?',
      time: '12m ago',
      unreadCount: 2,
      online: true,
    },
    {
      id: 'conv_2',
      clientName: 'Priya Sharma',
      clientEmail: 'priya@nextgenmobility.com',
      clientAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      projectSubject: 'E-commerce EV Charging Architecture',
      lastMessage: 'Stripe currency rates look spotless. Approved to deploy.',
      time: '2h ago',
      unreadCount: 1,
      online: true,
    },
    {
      id: 'conv_3',
      clientName: 'Amit Verma',
      clientEmail: 'amit@apexlogistics.io',
      clientAvatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      projectSubject: 'Project #PRJ-003 Logistics Gateway',
      lastMessage: 'Can you please send over the latest staging preview URL?',
      time: '4h ago',
      unreadCount: 2,
      online: false,
    },
  ]);

  const [selectedConvId, setSelectedConvId] = useState<string>('conv_1');
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'msg_1',
      senderId: 'usr_client_1',
      senderName: 'Rahul Sharma',
      senderRole: 'USER',
      text: 'Hi Reliable Info Tech Team! We just reviewed the first sprint milestone for our portfolio platform.',
      time: '10:15 AM',
      isMe: false,
    },
    {
      id: 'msg_2',
      senderId: 'usr_admin_1',
      senderName: 'Alex Rivera',
      senderRole: 'ADMIN',
      text: 'Great to hear Rahul! Sarah Chen has also finalized the high-availability database schema and API endpoints.',
      time: '10:22 AM',
      isMe: true,
    },
    {
      id: 'msg_3',
      senderId: 'usr_client_1',
      senderName: 'Rahul Sharma',
      senderRole: 'USER',
      text: 'Awesome, can we schedule a demo call tomorrow at 3 PM?',
      time: '10:30 AM',
      isMe: false,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch real conversations from API
  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await messageService.getConversations();
      if (res.success && res.data && res.data.length > 0) {
        setConversations(
          res.data.map((c: any) => ({
            id: c.id || c._id,
            clientName: c.clientName || 'Client',
            clientEmail: c.clientEmail || 'client@reliableinfotech.io',
            clientAvatar:
              c.clientAvatar ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            projectSubject: c.projectSubject || 'Project Consultation',
            lastMessage: c.lastMessage || 'No messages yet.',
            time: c.time || 'Recent',
            unreadCount: c.unreadCount || 0,
            online: c.online !== undefined ? c.online : true,
          }))
        );
      }
    } catch (err) {
      console.warn('Using seeded conversations data fallback:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (convId: string) => {
    if (!convId) return;
    try {
      const res = await messageService.getMessages(convId);
      if (res.success && res.data && res.data.length > 0) {
        setMessages(
          res.data.map((m: any) => ({
            id: m.id || m._id,
            senderId: m.senderId,
            senderName: m.senderName || (m.senderRole === 'ADMIN' ? 'Alex Rivera' : 'Client'),
            senderRole: m.senderRole || 'USER',
            text: m.text || m.message,
            time: m.time || '10:00 AM',
            isMe: Boolean(m.isMe || m.senderRole === 'ADMIN'),
            createdAt: m.createdAt,
          }))
        );
      }
    } catch (err) {
      console.warn('Using local thread fallback:', err);
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
      // Mark read in backend
      messageService.markAsRead(selectedConvId).catch(() => {});
      // Decrement unread in local state
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedConvId ? { ...c, unreadCount: 0 } : c))
      );
    }
  }, [selectedConvId]);

  // Real-time background polling every 4 seconds to catch new messages from any user
  useEffect(() => {
    const timer = setInterval(() => {
      fetchConversations(true);
      if (selectedConvId) {
        fetchMessages(selectedConvId);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [selectedConvId]);

  const selectedConv =
    conversations.find((c) => c.id === selectedConvId) || conversations[0] || {
      id: 'conv_1',
      clientName: 'Rahul Sharma',
      clientEmail: 'client@reliableinfotech.io',
      clientAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      projectSubject: 'Horizon Creative Studio Showcase',
      lastMessage: 'Awesome, can we schedule a demo call tomorrow at 3 PM?',
      time: '12m ago',
      unreadCount: 0,
      online: true,
    };

  // Handle Admin Sending Reply
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = inputText.trim();
    if (!content) return;

    const optimisticMsg: MessageItem = {
      id: `m_${Date.now()}`,
      senderId: 'usr_admin_1',
      senderName: 'Alex Rivera',
      senderRole: 'ADMIN',
      text: content,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      isMe: true,
    };

    // Optimistically append message
    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText('');

    // Update conversation last message in local list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConv.id
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
      await messageService.sendMessage(selectedConv.id, content);
    } catch (err) {
      console.warn('Sent locally fallback:', err);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.clientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.projectSubject.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.clientEmail.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-300">
      {/* Messages Shell Container */}
      <div className="flex-1 rounded-3xl bg-[#0B0F1D] border border-slate-800 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* ======================================================== */}
        {/* LEFT PANEL: Client Messages List                          */}
        {/* ======================================================== */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-800/80 flex flex-col bg-[#070D1E] shrink-0 ${
            mobileThreadOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header & Search */}
          <div className="p-4 sm:p-5 border-b border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Client Messages
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
                {totalUnread > 0 ? `${totalUnread} Unread` : 'All Read'}
              </span>
            </div>

            {/* Search conversations input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-[#0B1224] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-blue-500/80 transition-colors"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No conversations found matching search.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConv.id;
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
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-700/80"
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
          className={`flex-1 flex flex-col bg-[#0A1024] min-w-0 ${
            !mobileThreadOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Thread Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between gap-3 bg-[#080E20]/80 backdrop-blur-md">
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                onClick={() => setMobileThreadOpen(false)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={selectedConv.clientAvatar}
                  alt={selectedConv.clientName}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-700"
                />
                {selectedConv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#080E20]" />
                )}
              </div>

              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                  <span>{selectedConv.clientName}</span>
                  <span className="text-[11px] font-normal text-slate-400 truncate">
                    ({selectedConv.clientEmail})
                  </span>
                </h4>
                <p className="text-[11px] font-medium text-cyan-400 truncate mt-0.5">
                  Re: {selectedConv.projectSubject}
                </p>
              </div>
            </div>

            {/* Encrypted Channel Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Circle className="w-1.5 h-1.5 fill-emerald-400" />
                <span>Encrypted Channel</span>
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Centered Sprint Consultation Pill */}
            <div className="text-center my-3">
              <span className="px-3.5 py-1 rounded-full bg-slate-800/50 text-[11px] text-slate-400 border border-slate-800 font-medium">
                Direct Sprint Consultation with Client
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                {/* Sender Name & Timestamp */}
                <div
                  className={`flex items-baseline gap-2 mb-1 px-1 text-[11px] ${
                    msg.isMe ? 'flex-row-reverse text-right' : 'text-left'
                  }`}
                >
                  <span className="font-bold text-slate-300">{msg.senderName}</span>
                  <span className="text-slate-500 text-[10px]">{msg.time}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.isMe
                      ? 'bg-blue-600 text-white rounded-tr-sm shadow-[0_0_20px_rgba(37,99,235,0.35)] font-normal'
                      : 'bg-[#111A2E] text-slate-200 rounded-tl-sm border border-slate-800/80 font-normal'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Reply Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3.5 sm:p-4 border-t border-slate-800/80 bg-[#070D1E]/90 backdrop-blur-md flex items-center gap-2.5"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Reply to ${selectedConv.clientName}...`}
              className="flex-1 bg-[#0F172A] text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-600/30 transition-all shrink-0 active:scale-95"
              title="Send reply"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminMessagesView;
