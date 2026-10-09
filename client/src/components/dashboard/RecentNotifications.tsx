import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowRight, CheckCircle2, MessageSquare, Zap, Clock } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Card } from '../common/Card';

export const RecentNotifications: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'REQUEST_STATUS':
        return <Zap className="w-3.5 h-3.5 text-indigo-400" />;
      case 'MESSAGE':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case 'PROJECT_COMPLETED':
        return <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <Card className="p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Recent Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <Link
            to="/dashboard/notifications"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {notifications.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            You're all caught up! No recent alerts.
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  n.isRead
                    ? 'bg-white/[0.01] border-white/5 opacity-75'
                    : 'bg-indigo-500/10 border-indigo-500/25 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-white/5 text-right">
        <Link
          to="/dashboard/notifications"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
        >
          Manage Alert Preferences
        </Link>
      </div>
    </Card>
  );
};
