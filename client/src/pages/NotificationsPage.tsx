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
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-devcraft-primary text-white'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'unread'
              ? 'bg-devcraft-primary text-white'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No notifications</p>
          <p className="text-xs text-gray-400 mt-1">You are all caught up.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <Card
              key={n._id}
              className={`p-4 transition-all flex items-start justify-between gap-4 ${
                n.isRead
                  ? 'bg-white/[0.01] border-white/5 opacity-80'
                  : 'bg-indigo-500/10 border-indigo-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {!n.isRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs shrink-0"
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
