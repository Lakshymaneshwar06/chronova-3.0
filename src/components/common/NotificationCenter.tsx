import React from 'react';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  X,
  Check
} from 'lucide-react';

export interface CampusNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'event' | 'academic' | 'club' | 'system';
  unread: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CampusNotification[];
  onMarkAllAsRead: () => void;
  onDismissNotification: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onDismissNotification
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getIcon = (type: CampusNotification['type']) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-4 h-4 text-cyan-600" />;
      case 'academic':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'club':
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div
      id="notification-modal-overlay"
      className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-950/20 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="notification-panel"
        className="relative w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden mt-14 sm:mt-16 animate-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 font-heading">
                Campus Live Updates
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                {unreadCount > 0 ? `${unreadCount} unread notices` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                Mark Read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-2 space-y-1.5 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No campus alerts at this time.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                  item.unread
                    ? 'bg-indigo-50/50 border-indigo-100 shadow-xs'
                    : 'bg-white border-slate-100'
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-xs shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    {item.message}
                  </p>
                </div>

                <button
                  onClick={() => onDismissNotification(item.id)}
                  className="text-slate-300 hover:text-slate-500 p-1 -mr-1 transition-colors cursor-pointer"
                  title="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
