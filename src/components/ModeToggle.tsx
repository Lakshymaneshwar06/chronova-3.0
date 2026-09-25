import React from 'react';
import { Sparkles, BookOpen, Users } from 'lucide-react';
import { AppMode } from '../types';

interface ModeToggleProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  eventCount?: number;
  studyCount?: number;
  clubCount?: number;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  currentMode,
  onModeChange,
  eventCount = 6,
  studyCount = 8,
  clubCount = 6
}) => {
  return (
    <div
      id="mode-toggle-container"
      className="inline-flex items-center p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner backdrop-blur-xl transition-all"
    >
      {/* Event Mode Button */}
      <button
        id="mode-toggle-events-btn"
        onClick={() => onModeChange('events')}
        className={`relative flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
          currentMode === 'events'
            ? 'text-cyan-900 dark:text-cyan-100 bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-700 shadow-xs'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Sparkles className={`w-3.5 h-3.5 ${currentMode === 'events' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
        <span>Events</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {eventCount}
        </span>
      </button>

      {/* Study Material Mode Button */}
      <button
        id="mode-toggle-study-btn"
        onClick={() => onModeChange('study')}
        className={`relative flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
          currentMode === 'study'
            ? 'text-indigo-900 dark:text-indigo-100 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 shadow-xs'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <BookOpen className={`w-3.5 h-3.5 ${currentMode === 'study' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
        <span>Study Hub</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {studyCount}
        </span>
      </button>

      {/* Club Directory Mode Button */}
      <button
        id="mode-toggle-clubs-btn"
        onClick={() => onModeChange('clubs')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
          currentMode === 'clubs'
            ? 'text-emerald-900 dark:text-emerald-100 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 shadow-xs'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Users className={`w-3.5 h-3.5 ${currentMode === 'clubs' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
        <span>Clubs</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {clubCount}
        </span>
      </button>
    </div>
  );
};
