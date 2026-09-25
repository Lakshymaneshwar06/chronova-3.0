import React from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Sparkles,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { EventItem } from '../../types';

interface EventTimelineProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onRegisterClick: (event: EventItem) => void;
  registeredIds: Set<string>;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  onSelectEvent,
  onRegisterClick,
  registeredIds
}) => {
  // Sort events by date ascending
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-2 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-indigo-500 before:to-slate-800">
      {sortedEvents.map((evt, idx) => {
        const dateObj = new Date(evt.startDate);
        const dateFormatted = dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const timeFormatted = dateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        });

        const isRegistered = registeredIds.has(evt.id);

        return (
          <div key={evt.id} className="relative group">
            {/* Timeline Node Dot */}
            <div
              className={`absolute -left-6 sm:-left-10 top-5 w-4 h-4 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                idx === 0
                  ? 'bg-cyan-500 border-cyan-300 ring-4 ring-cyan-500/20 shadow-md shadow-cyan-500/30'
                  : 'bg-white dark:bg-slate-900 border-indigo-500 ring-2 ring-slate-200 dark:ring-slate-800'
              }`}
            />

            {/* Timeline Content Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 shadow-md hover:shadow-xl backdrop-blur-md transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  {/* Date & Tag Header */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30 text-xs font-mono font-bold text-cyan-800 dark:text-cyan-300">
                      <CalendarIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      {dateFormatted} • {timeFormatted}
                    </span>

                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {evt.category.replace('-', ' ')}
                    </span>

                    {evt.prizes && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 font-medium">
                        <Trophy className="w-3 h-3 text-amber-500" />
                        {evt.prizes}
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3
                    onClick={() => onSelectEvent(evt)}
                    className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors cursor-pointer font-heading"
                  >
                    {evt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {evt.tagline}
                  </p>

                  {/* Venue & Capacity */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>{evt.venue}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>
                        {evt.registeredCount} / {evt.totalSeats} seats filled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onSelectEvent(evt)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    Schedule & Speakers
                  </button>

                  <button
                    onClick={() => onRegisterClick(evt)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                      isRegistered
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
                        : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/20'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <>
                        <span>Claim Free Seat</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
