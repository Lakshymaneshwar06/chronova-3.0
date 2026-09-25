import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Calendar,
  FileText,
  Trash2,
  ExternalLink,
  QrCode,
  Sparkles,
  Ticket
} from 'lucide-react';
import { EventItem, StudyResource, UserRegistration } from '../../types';
import { RealQrCode } from './RealQrCode';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedEvents: EventItem[];
  savedResources: StudyResource[];
  registrations: UserRegistration[];
  onSelectEvent: (event: EventItem) => void;
  onSelectResource: (resource: StudyResource) => void;
  onRemoveEvent: (id: string) => void;
  onRemoveResource: (id: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  savedEvents,
  savedResources,
  registrations,
  onSelectEvent,
  onSelectResource,
  onRemoveEvent,
  onRemoveResource
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'tickets' | 'study' | 'events'>('tickets');

  return (
    <div
      id="bookmarks-drawer-overlay"
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="bookmarks-drawer-panel"
        className="w-full max-w-md bg-white border-l border-slate-200 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                My Chronova Vault
              </h3>
              <p className="text-xs text-slate-500">
                {registrations.length} Passes • {savedResources.length} Notes • {savedEvents.length} Saved
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-4 bg-slate-50/40">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tickets'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Passes ({registrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('study')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'study'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Study ({savedResources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'events'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events ({savedEvents.length})</span>
          </button>
        </div>

        {/* Drawer Content Area */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {/* TAB 1: TICKETS */}
          {activeTab === 'tickets' && (
            <>
              {registrations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Ticket className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">
                    No active event passes yet
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Register for upcoming hackathons or workshops in Event Mode to get instant digital passes.
                  </p>
                </div>
              ) : (
                registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-700 font-bold">
                          {reg.ticketCode}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {reg.eventTitle}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Attendee: {reg.attendeeName} ({reg.attendeeRole})
                        </p>
                      </div>

                      <div className="shrink-0">
                        <RealQrCode
                          data={reg.qrData || `CHRONOVA::${reg.ticketCode}`}
                          size={64}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      <span className="font-mono">
                        {new Date(reg.eventDate).toLocaleDateString()}
                      </span>
                      <span className="text-emerald-700 font-semibold">
                        • Verified RSVP
                      </span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* TAB 2: STUDY MATERIALS */}
          {activeTab === 'study' && (
            <>
              {savedResources.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">
                    No bookmarked study materials
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Click the bookmark icon on any course note or PYQ to save it for quick revision.
                  </p>
                </div>
              ) : (
                savedResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 hover:border-indigo-300 transition-colors"
                  >
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        onSelectResource(res);
                        onClose();
                      }}
                    >
                      <span className="text-[10px] font-mono font-bold text-indigo-700">
                        {res.courseCode} • Sem {res.semester}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                        {res.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {res.type.toUpperCase()} • {res.fileSize || res.duration}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveResource(res.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </>
          )}

          {/* TAB 3: SAVED EVENTS */}
          {activeTab === 'events' && (
            <>
              {savedEvents.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">
                    No saved events
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Bookmark upcoming hackathons or talks to monitor seat availability.
                  </p>
                </div>
              ) : (
                savedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 hover:border-cyan-400 transition-colors"
                  >
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        onSelectEvent(evt);
                        onClose();
                      }}
                    >
                      <span className="text-[10px] uppercase font-bold text-cyan-700">
                        {evt.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(evt.startDate).toLocaleDateString()} • {evt.venue}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveEvent(evt.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors cursor-pointer"
                      title="Remove saved event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
