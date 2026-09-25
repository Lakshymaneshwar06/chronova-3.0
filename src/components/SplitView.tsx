import React from 'react';
import { Sparkles, BookOpen, Maximize2, ExternalLink } from 'lucide-react';
import { EventItem, StudyResource, AppMode } from '../types';
import { EventCard } from './events/EventCard';
import { StudyCard } from './study/StudyCard';

interface SplitViewProps {
  events: EventItem[];
  resources: StudyResource[];
  onSelectEvent: (event: EventItem) => void;
  onRegisterClick: (event: EventItem) => void;
  savedEventIds: Set<string>;
  onToggleSaveEvent: (id: string) => void;
  registeredEventIds: Set<string>;
  onPreviewResource: (resource: StudyResource) => void;
  onDownloadResource: (resource: StudyResource) => void;
  savedResourceIds: Set<string>;
  onToggleSaveResource: (id: string) => void;
  onRateResource: (id: string, rating: number) => void;
  onToggleLikeResource: (id: string) => void;
  likedResourceIds: Set<string>;
  onSwitchMode: (mode: AppMode) => void;
}

export const SplitView: React.FC<SplitViewProps> = ({
  events,
  resources,
  onSelectEvent,
  onRegisterClick,
  savedEventIds,
  onToggleSaveEvent,
  registeredEventIds,
  onPreviewResource,
  onDownloadResource,
  savedResourceIds,
  onToggleSaveResource,
  onRateResource,
  onToggleLikeResource,
  likedResourceIds,
  onSwitchMode
}) => {
  return (
    <div id="split-view-container" className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
      {/* Left Column: Event Portal Panel */}
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-3xl bg-cyan-50/70 border border-cyan-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-cyan-100 text-cyan-800">
              <Sparkles className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Event Portal Stream
              </h3>
              <p className="text-xs text-slate-500">
                {events.length} Upcoming Campus & Online Events
              </p>
            </div>
          </div>

          <button
            onClick={() => onSwitchMode('events')}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-800 hover:text-cyan-900 px-3 py-1.5 rounded-xl bg-white border border-cyan-200 shadow-xs cursor-pointer"
          >
            <span>Full Event Mode</span>
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-6">
          {events.slice(0, 3).map((evt) => (
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
      </div>

      {/* Right Column: Study Material Hub Panel */}
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-3xl bg-indigo-50/70 border border-indigo-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-indigo-100 text-indigo-800">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Study Material Hub
              </h3>
              <p className="text-xs text-slate-500">
                {resources.length} Verified Course Resources
              </p>
            </div>
          </div>

          <button
            onClick={() => onSwitchMode('study')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 hover:text-indigo-900 px-3 py-1.5 rounded-xl bg-white border border-indigo-200 shadow-xs cursor-pointer"
          >
            <span>Full Study Mode</span>
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-6">
          {resources.slice(0, 3).map((res) => (
            <StudyCard
              key={res.id}
              resource={res}
              onPreview={onPreviewResource}
              onDownload={onDownloadResource}
              isSaved={savedResourceIds.has(res.id)}
              onToggleSave={onToggleSaveResource}
              onRate={onRateResource}
              onToggleLike={onToggleLikeResource}
              isLiked={likedResourceIds.has(res.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
