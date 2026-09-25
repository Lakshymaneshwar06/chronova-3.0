import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  SlidersHorizontal,
  PlusCircle,
  GraduationCap,
  Sparkles,
  Bookmark,
  TrendingUp,
  Filter,
  FileCheck2
} from 'lucide-react';
import {
  StudyResource,
  Department,
  ResourceType
} from '../../types';
import {
  DEPARTMENT_OPTIONS,
  RESOURCE_TYPE_OPTIONS,
  SEMESTER_OPTIONS
} from '../../data/mockData';
import { StudyCard } from './StudyCard';

interface StudyViewProps {
  resources: StudyResource[];
  searchQuery: string;
  onPreviewResource: (resource: StudyResource) => void;
  onDownloadResource: (resource: StudyResource) => void;
  savedResourceIds: Set<string>;
  onToggleSaveResource: (id: string) => void;
  onRateResource: (id: string, rating: number) => void;
  onToggleLikeResource: (id: string) => void;
  likedResourceIds: Set<string>;
  onOpenUpload: () => void;
  isSplitView?: boolean;
  isAdmin?: boolean;
}

export const StudyView: React.FC<StudyViewProps> = ({
  resources,
  searchQuery,
  onPreviewResource,
  onDownloadResource,
  savedResourceIds,
  onToggleSaveResource,
  onRateResource,
  onToggleLikeResource,
  likedResourceIds,
  onOpenUpload,
  isSplitView = false,
  isAdmin = false
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'downloads' | 'newest'>('popular');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    return resources
      .filter((res) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = res.title.toLowerCase().includes(q);
          const matchesCode = res.courseCode.toLowerCase().includes(q);
          const matchesCourse = res.courseName.toLowerCase().includes(q);
          const matchesDesc = res.description.toLowerCase().includes(q);
          const matchesTags = res.tags.some((t) => t.toLowerCase().includes(q));
          const matchesAuthor = res.author.name.toLowerCase().includes(q);
          if (
            !matchesTitle &&
            !matchesCode &&
            !matchesCourse &&
            !matchesDesc &&
            !matchesTags &&
            !matchesAuthor
          ) {
            return false;
          }
        }

        // Saved only
        if (onlySaved && !savedResourceIds.has(res.id)) {
          return false;
        }

        // Department
        if (selectedDept !== 'all' && res.department !== selectedDept) {
          return false;
        }

        // Semester
        if (selectedSemester !== 0 && res.semester !== selectedSemester) {
          return false;
        }

        // Resource Type
        if (selectedType !== 'all' && res.type !== selectedType) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'downloads') return b.downloadCount - a.downloadCount;
        if (sortBy === 'newest') return b.lastUpdated.localeCompare(a.lastUpdated);
        // default popular: weighted likes + downloads
        return (b.likesCount * 3 + b.downloadCount) - (a.likesCount * 3 + a.downloadCount);
      });
  }, [
    resources,
    searchQuery,
    selectedDept,
    selectedSemester,
    selectedType,
    sortBy,
    onlySaved,
    savedResourceIds
  ]);

  return (
    <div id="study-view-container" className="space-y-8 animate-in fade-in duration-300">
      {/* Study Hub Hero Feature Card */}
      {!isSplitView && !searchQuery && (
        <div
          id="study-hub-hero"
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-pastel-lavender/60 via-pastel-sky/50 to-pastel-mint/40 border border-pastel-sky/80 shadow-md p-6 sm:p-10"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-pastel-lavender/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pastel-mint/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pastel-lavender text-indigo-900 border border-pastel-lavender text-xs font-bold uppercase tracking-wider mb-3">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Peer-Reviewed Academic Repository</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading">
                Study Material & Exam Vault
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Access verified course notes, solved university previous-year papers (PYQs), concise exam cheat sheets, and video masterclasses curated by university toppers and faculty researchers.
              </p>

              {/* Stat badges */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>100% Free & Open-Access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Curated for Semesters 1 through 8</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>Direct In-Browser Previews</span>
                </div>
              </div>
            </div>

            {/* Quick Upload Action strictly restricted to Admin users */}
            {isAdmin && (
              <div className="shrink-0 flex flex-col sm:flex-row items-stretch md:items-center gap-3">
                <button
                  id="study-hero-upload-btn"
                  onClick={onOpenUpload}
                  className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all font-heading"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Upload Course Material</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter & Sorting Controls */}
      <div
        id="study-filter-controls"
        className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
      >
        {/* Top Row: Discipline Tabs & Sort Dropdown */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Discipline Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {DEPARTMENT_OPTIONS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === dept.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Sort & Saved Only */}
          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-auto">
            {/* My Saved Notes Filter */}
            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                onlySaved
                  ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Saved ({savedResourceIds.size})</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 px-1 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'popular' | 'rating' | 'downloads' | 'newest'
                  )
                }
                className="bg-transparent text-slate-800 focus:outline-none cursor-pointer pr-2 font-semibold"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="downloads">Most Downloaded</option>
                <option value="newest">Recently Updated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Secondary Row: Semester Selector & Format Types */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Format Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {RESOURCE_TYPE_OPTIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  selectedType === t.id
                    ? 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Semester Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Semester:</span>
            {SEMESTER_OPTIONS.map((sem) => (
              <button
                key={sem.id}
                onClick={() => setSelectedSemester(sem.id)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                  selectedSemester === sem.id
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {sem.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No study materials found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try clearing filters or search term. You can also be the first to upload notes for this course!
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => {
                setSelectedDept('all');
                setSelectedSemester(0);
                setSelectedType('all');
                setOnlySaved(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
            >
              Upload Material
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
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
      )}
    </div>
  );
};
