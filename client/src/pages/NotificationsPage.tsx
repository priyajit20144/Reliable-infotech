import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, Zap, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.isRead : true));

  const getIcon = (type: string) => {
    switch (type) {
      case 'REQUEST_STATUS':
        return <Zap className="w-4 h-4 text-indigo-400" />;
      case 'MESSAGE':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'PROJECT_COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications Center</h1>
          <p className="text-xs text-gray-400 mt-1">
            Stay informed on custom website milestones, review notices, and sprint updates
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            icon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#EEEEEE] text-[#0B0B0B]'
              : 'bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
          }`}
        >
          ALL ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'bg-[#EEEEEE] text-[#0B0B0B]'
              : 'bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
          }`}
        >
          UNREAD ({unreadCount})
        </button>
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <Card brackets={true} className="text-center py-16">
          <Bell className="w-8 h-8 text-[#71717A] mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No notifications</p>
          <p className="text-xs text-[#A1A1AA] mt-1 font-mono">You are all caught up.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <Card
              key={n._id}
              brackets={true}
              className={`p-4 transition-all flex items-start justify-between gap-4 ${
                n.isRead
                  ? 'opacity-80'
                  : 'border-[#EEEEEE]/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-[#181818] border border-[#262626] flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#4ADE80] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-[#71717A] font-mono">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {!n.isRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs shrink-0 cursor-pointer"
                  onClick={() => markAsRead(n._id)}
                >
                  Mark read
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
