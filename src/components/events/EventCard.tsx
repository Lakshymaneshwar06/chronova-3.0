import React from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Video,
  ExternalLink,
  Bookmark,
  Share2,
  Sparkles,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { EventItem } from '../../types';
import { CountdownTimer } from '../common/CountdownTimer';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  onRegisterClick: (event: EventItem) => void;
  isSaved?: boolean;
  onToggleSave?: (eventId: string) => void;
  isRegistered?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onRegisterClick,
  isSaved = false,
  onToggleSave,
  isRegistered = false
}) => {
  const startDate = new Date(event.startDate);
  const monthName = startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const dayNum = startDate.getDate();
  const timeString = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const percentFull = Math.min(
    100,
    Math.round((event.registeredCount / event.totalSeats) * 100)
  );

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'hackathon':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'workshop':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'tech-talk':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'competition':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}#event-${event.id}`);
    }
  };

  return (
    <div
      id={`event-card-${event.id}`}
      className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 hover:border-cyan-400 hover:shadow-xl transition-all duration-300 overflow-hidden shadow-xs"
    >
      {/* Top Banner Image with Overlay */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

        {/* Date Box Top-Left */}
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center w-12 h-13 rounded-2xl bg-white/95 border border-white text-slate-900 shadow-md backdrop-blur-md">
          <span className="text-[10px] font-bold text-cyan-600 tracking-wider">
            {monthName}
          </span>
          <span className="text-lg font-extrabold leading-none text-slate-900 font-mono">
            {dayNum}
          </span>
        </div>

        {/* Top-Right Badges & Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {/* Format Badge */}
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-white/90 text-slate-800 border border-white shadow-xs backdrop-blur-md">
            {event.format === 'virtual' ? (
              <>
                <Video className="w-3 h-3 text-cyan-600" />
                <span>Virtual</span>
              </>
            ) : event.format === 'hybrid' ? (
              <>
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Hybrid</span>
              </>
            ) : (
              <>
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>In-Person</span>
              </>
            )}
          </span>

          {/* Save Button */}
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(event.id);
              }}
              className={`p-1.5 rounded-xl border backdrop-blur-md transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                  : 'bg-white/90 text-slate-600 hover:text-slate-900 border-white hover:bg-white'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save Event'}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-xl bg-white/90 text-slate-600 hover:text-slate-900 border border-white backdrop-blur-md transition-colors cursor-pointer"
            title="Copy link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category & Countdown Bottom Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border backdrop-blur-md ${getCategoryTheme(
              event.category
            )}`}
          >
            {event.category.replace('-', ' ')}
          </span>

          {/* Live Countdown in Compact Pill */}
          <div className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-white">
            <CountdownTimer targetDate={event.startDate} compact accentColor="cyan" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Tagline */}
          <h3
            onClick={() => onSelect(event)}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors cursor-pointer line-clamp-1 font-heading"
          >
            {event.title}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Venue and Time metadata */}
          <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span className="truncate">{timeString} UTC onwards</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate text-slate-700">{event.venue}</span>
            </div>
          </div>

          {/* Prizes highlight if any */}
          {event.prizes && (
            <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <Trophy className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span className="truncate font-semibold">{event.prizes}</span>
            </div>
          )}

          {/* Speakers Avatar list */}
          {event.speakers.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  {event.speakers.map((sp, i) => (
                    <img
                      key={i}
                      src={sp.avatar}
                      alt={sp.name}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                    />
                  ))}
                </div>
                <span className="text-[11px] text-slate-600 font-medium truncate max-w-[150px]">
                  {event.speakers[0].name}
                  {event.speakers.length > 1 && ` +${event.speakers.length - 1}`}
                </span>
              </div>

              <span className="text-[11px] font-mono text-emerald-600 font-bold">
                {event.price}
              </span>
            </div>
          )}
        </div>

        {/* Capacity Bar & Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {/* Seat Capacity Meter */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-600" />
                <span>Attendance</span>
              </span>
              <span className="font-mono text-slate-700 font-medium">
                {event.registeredCount}/{event.totalSeats} ({percentFull}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentFull >= 90
                    ? 'bg-rose-500'
                    : percentFull >= 75
                    ? 'bg-amber-500'
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${percentFull}%` }}
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <button
              id={`view-details-${event.id}`}
              onClick={() => onSelect(event)}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-center"
            >
              Details
            </button>

            <button
              id={`register-btn-${event.id}`}
              onClick={() => onRegisterClick(event)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                isRegistered
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
              }`}
            >
              {isRegistered ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pass Issued</span>
                </>
              ) : (
                <>
                  <span>Claim Spot</span>
                  <ExternalLink className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
