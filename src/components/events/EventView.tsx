import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  LayoutGrid,
  ListOrdered,
  Search,
  Trophy,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { EventItem, EventCategory, EventFormat } from '../../types';
import { EventCard } from './EventCard';
import { EventTimeline } from './EventTimeline';
import { CountdownTimer } from '../common/CountdownTimer';

interface EventViewProps {
  events: EventItem[];
  searchQuery: string;
  onSelectEvent: (event: EventItem) => void;
  onRegisterClick: (event: EventItem) => void;
  savedEventIds: Set<string>;
  onToggleSaveEvent: (id: string) => void;
  registeredEventIds: Set<string>;
  isSplitView?: boolean;
}

export const EventView: React.FC<EventViewProps> = ({
  events,
  searchQuery,
  onSelectEvent,
  onRegisterClick,
  savedEventIds,
  onToggleSaveEvent,
  registeredEventIds,
  isSplitView = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | EventFormat>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const categories: { id: EventCategory; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'tech-talk', label: 'Tech Talks' },
    { id: 'competition', label: 'Competitions' },
    { id: 'bootcamp', label: 'Bootcamps' }
  ];

  const featuredEvent = useMemo(() => {
    return events.find((e) => e.featured) || events[0];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesDesc = evt.description.toLowerCase().includes(q);
        const matchesVenue = evt.venue.toLowerCase().includes(q);
        const matchesTags = evt.tags.some((t) => t.toLowerCase().includes(q));
        const matchesSpeaker = evt.speakers.some((s) => s.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesTags && !matchesSpeaker) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && evt.category !== selectedCategory) {
        return false;
      }

      // Format
      if (selectedFormat !== 'all' && evt.format !== selectedFormat) {
        return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedCategory, selectedFormat]);

  return (
    <div id="event-view-container" className="space-y-8 animate-in fade-in duration-300">
      {/* Featured Hero Banner */}
      {!isSplitView && !searchQuery && featuredEvent && (
        <div
          id="featured-event-hero"
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-pastel-sky/60 via-pastel-lavender/50 to-pastel-peach/40 border border-pastel-sky/80 shadow-md p-6 sm:p-10"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-pastel-mint/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pastel-blush/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              {/* Badge Row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-mint text-emerald-900 border border-pastel-mint text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Featured Event
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-pastel-peach text-amber-900 border border-pastel-peach">
                  {featuredEvent.prizes || 'Free Registration'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-pastel-sky/60 shadow-xs">
                  {featuredEvent.format.toUpperCase()}
                </span>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading">
                {featuredEvent.title}
              </h1>
              <p className="text-sm sm:text-base text-indigo-900/90 font-medium mt-2">
                {featuredEvent.tagline}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {featuredEvent.description}
              </p>

              {/* Event Metadata Highlights */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  <span>
                    {new Date(featuredEvent.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span className="truncate max-w-[200px]">
                    {featuredEvent.venue}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>
                    {featuredEvent.registeredCount}/{featuredEvent.totalSeats} seats filled
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button
                  id="featured-hero-register-btn"
                  onClick={() => onRegisterClick(featuredEvent)}
                  className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2 cursor-pointer font-heading"
                >
                  {registeredEventIds.has(featuredEvent.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>View My Digital Pass</span>
                    </>
                  ) : (
                    <>
                      <span>Claim Free Spot</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSelectEvent(featuredEvent)}
                  className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer shadow-xs"
                >
                  View Schedule & Mentors
                </button>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="w-full lg:w-auto shrink-0 p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg flex flex-col items-center">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-700 tracking-wider uppercase mb-3">
                <Clock className="w-4 h-4 animate-spin-slow text-indigo-600" />
                <span>Kickoff Countdown</span>
              </div>
              <div className="w-full flex justify-center overflow-x-auto pb-1">
                <CountdownTimer
                  targetDate={featuredEvent.startDate}
                  accentColor="cyan"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-3 font-medium text-center">
                Live check-in begins at 09:00 AM UTC
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Discovery Header & Filter Controls Bar */}
      <div
        id="events-filter-bar"
        className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>Event Discovery Hub</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                {filteredEvents.length} Events Available
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore hackathons, developer meetups, technical bootcamps, and coding tournaments.
            </p>
          </div>

          {/* View Mode Switcher (Grid vs Timeline) */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
            <button
              id="event-view-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid View</span>
            </button>

            <button
              id="event-view-timeline-btn"
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Timeline</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills & Format Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Format Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">Format:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['all', 'in-person', 'virtual', 'hybrid'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-all cursor-pointer ${
                    selectedFormat === fmt
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Events Presentation */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No events match your criteria
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, choosing a different category, or resetting filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedFormat('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-indigo-700 border border-slate-200 hover:bg-slate-200 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onSelect={onSelectEvent}
              onRegisterClick={onRegisterClick}
              isSaved={savedEventIds.has(evt.id)}
              onToggleSave={onToggleSaveEvent}
              isRegistered={registeredEventIds.has(evt.id)}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200">
          <EventTimeline
            events={filteredEvents}
            onSelectEvent={onSelectEvent}
            onRegisterClick={onRegisterClick}
            registeredIds={registeredEventIds}
          />
        </div>
      )}
    </div>
  );
};
