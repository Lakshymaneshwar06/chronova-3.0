import React from 'react';
import { Sparkles, BookOpen, Users, Terminal, Shield } from 'lucide-react';
import { AppMode } from '../types';
import { ChronovaLogo } from './common/ChronovaLogo';

interface FooterProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onOpenUpload: () => void;
  t: (key: string) => string;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  currentMode,
  onModeChange,
  onOpenUpload,
  t,
  isAdmin = false
}) => {
  return (
    <footer
      id="main-footer"
      className="mt-20 border-t border-pastel-lavender/60 bg-white/90 backdrop-blur-md text-slate-500 text-xs transition-colors pb-16 md:pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <ChronovaLogo size="md" variant="full" />
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-indigo-500" />
              <span>Campus Ecosystem Portal</span>
            </div>
          </div>

          {/* Col 2: Event Portal Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>{t('events')}</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onModeChange('events')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Hackathons & Sprints
                </button>
              </li>
              <li>
                <button
                  onClick={() => onModeChange('events')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Hands-On Technical Workshops
                </button>
              </li>
              <li>
                <button
                  onClick={() => onModeChange('events')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Competitive Coding Arenas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Study Hub Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('studyHub')}</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onModeChange('study')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Data Structures & Algorithms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onModeChange('study')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Solved Previous Year Papers (PYQ)
                </button>
              </li>
              {isAdmin && (
                <li>
                  <button
                    onClick={onOpenUpload}
                    className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                  >
                    + Upload Course Notes (Admin)
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Club Directory Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('clubs')}</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onModeChange('clubs')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Robotics & AI Guild
                </button>
              </li>
              <li>
                <button
                  onClick={() => onModeChange('clubs')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Competitive Programmers Guild
                </button>
              </li>
              <li>
                <button
                  onClick={() => onModeChange('clubs')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Open Source Society
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Chronova. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">Honor Code</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
