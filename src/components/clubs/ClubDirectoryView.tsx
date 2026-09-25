import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  MapPin,
  Clock,
  ExternalLink,
  QrCode,
  Sparkles,
  Bot,
  Code2,
  ShieldCheck,
  Palette,
  Terminal,
  Cpu,
  Mail,
  Filter,
  UserPlus
} from 'lucide-react';
import { ClubItem } from '../../types';

interface ClubDirectoryViewProps {
  clubs: ClubItem[];
  joinedClubIds: Set<string>;
  onToggleJoinClub: (clubId: string) => void;
  onCheckInClub: (clubId: string) => void;
  checkedInClubIds: Set<string>;
  t: (key: string) => string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Bot: <Bot className="w-5 h-5 text-indigo-500" />,
  Code2: <Code2 className="w-5 h-5 text-emerald-500" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-cyan-500" />,
  Palette: <Palette className="w-5 h-5 text-purple-500" />,
  Terminal: <Terminal className="w-5 h-5 text-amber-500" />,
  Cpu: <Cpu className="w-5 h-5 text-rose-500" />
};

export const ClubDirectoryView: React.FC<ClubDirectoryViewProps> = ({
  clubs,
  joinedClubIds,
  onToggleJoinClub,
  onCheckInClub,
  checkedInClubIds,
  t
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClub, setSelectedClub] = useState<ClubItem | null>(null);

  const categories = ['all', ...Array.from(new Set(clubs.map((c) => c.category)))];

  const filteredClubs = clubs.filter((club) => {
    const matchesQuery =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.tags && club.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div id="club-directory-root" className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-900/90 via-slate-900 to-cyan-950 border border-slate-700/50 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Users className="w-3.5 h-3.5" />
            Campus Student Organizations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            {t('activeClubs')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Join student-led tech guilds, attend weekly skill sessions, collaborate on real projects, and earn verified participation credentials.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search clubs by name, tech or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Clubs' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => {
          const isJoined = joinedClubIds.has(club.id);
          const isCheckedIn = checkedInClubIds.has(club.id);

          return (
            <div
              key={club.id}
              className="flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all overflow-hidden group"
            >
              {/* Cover Image if available */}
              {club.coverImage && (
                <div className="h-32 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  <img
                    src={club.coverImage}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-indigo-700 dark:text-indigo-400 backdrop-blur-xs">
                    {club.category}
                  </span>
                  {club.recruiting && (
                    <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                      Recruiting
                    </span>
                  )}
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shrink-0">
                      {ICON_MAP[club.icon] || <Users className="w-5 h-5 text-indigo-500" />}
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        {club.currentMembers + (isJoined ? 1 : 0)}
                      </span>
                      <p className="text-[10px] text-slate-400">Members</p>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-heading leading-snug">
                    {club.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {club.description || 'Active campus tech society organizing hands-on labs and peer sprints.'}
                  </p>

                  {/* Tags */}
                  {club.tags && club.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {club.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Details */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{club.meetingTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{club.location}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onToggleJoinClub(club.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isJoined
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('joined')}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{t('joinClub')}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onCheckInClub(club.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isCheckedIn
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    title="Check in for attendance with QR Token"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{isCheckedIn ? t('checkedIn') : t('checkIn')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
