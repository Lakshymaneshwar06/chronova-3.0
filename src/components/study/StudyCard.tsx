import React, { useState } from 'react';
import {
  FileText,
  Video,
  Download,
  Eye,
  Bookmark,
  Heart,
  Star,
  Layers,
  Code2,
  FileCheck2,
  BookMarked
} from 'lucide-react';
import { StudyResource } from '../../types';

interface StudyCardProps {
  resource: StudyResource;
  onPreview: (resource: StudyResource) => void;
  onDownload: (resource: StudyResource) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onRate?: (id: string, userRating: number) => void;
  onToggleLike?: (id: string) => void;
  isLiked?: boolean;
}

export const StudyCard: React.FC<StudyCardProps> = ({
  resource,
  onPreview,
  onDownload,
  isSaved = false,
  onToggleSave,
  onRate,
  onToggleLike,
  isLiked = false
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const getTypeVisual = (type: string) => {
    switch (type) {
      case 'pdf':
        return {
          icon: FileText,
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'PDF Textbook'
        };
      case 'notes':
        return {
          icon: BookMarked,
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          label: 'Lecture Notes'
        };
      case 'cheatsheet':
        return {
          icon: Layers,
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Cheat Sheet'
        };
      case 'pyq':
        return {
          icon: FileCheck2,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Solved PYQ'
        };
      case 'video':
        return {
          icon: Video,
          bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          label: 'Video Masterclass'
        };
      case 'code':
        return {
          icon: Code2,
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'Lab Code'
        };
      default:
        return {
          icon: FileText,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          label: 'Study Material'
        };
    }
  };

  const visual = getTypeVisual(resource.type);
  const IconComponent = visual.icon;

  return (
    <div
      id={`study-card-${resource.id}`}
      className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 p-5 shadow-xs"
    >
      <div>
        {/* Header: Course Code, Semester & Type Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800">
              {resource.courseCode}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              Sem {resource.semester}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark */}
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(resource.id)}
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
                title={isSaved ? 'Remove from Saved' : 'Save Material'}
                aria-label="Save Material"
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            {/* Like/Upvote */}
            {onToggleLike && (
              <button
                onClick={() => onToggleLike(resource.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                  isLiked
                    ? 'bg-rose-50 text-rose-600 border-rose-300'
                    : 'bg-slate-50 text-slate-600 hover:text-rose-600 border-slate-200 hover:bg-slate-100'
                }`}
                title="Upvote resource"
                aria-label="Upvote"
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                <span>{resource.likesCount + (isLiked ? 1 : 0)}</span>
              </button>
            )}
          </div>
        </div>

        {/* Resource Type Pill */}
        <div className="mb-2.5">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${visual.bg}`}
          >
            <IconComponent className="w-3 h-3" />
            <span>{visual.label}</span>
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onPreview(resource)}
          className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors cursor-pointer line-clamp-2 leading-snug font-heading"
        >
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Author / Source */}
        <div className="mt-3.5 flex items-center gap-2.5 pt-3 border-t border-slate-100">
          <img
            src={resource.author.avatar}
            alt={resource.author.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {resource.author.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {resource.author.role}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/80 font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Rating, File Meta, Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {/* Star Rating & File Specs */}
        <div className="flex items-center justify-between mb-3 text-xs">
          {/* Interactive Rating */}
          <div className="flex items-center gap-1" title="Rate this resource">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled =
                  hoverRating !== null
                    ? star <= hoverRating
                    : star <= Math.round(resource.rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => onRate && onRate(resource.id, star)}
                    className="text-amber-400 hover:scale-110 transition-transform p-0.5 cursor-pointer"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isFilled ? 'fill-current text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="font-mono font-bold text-slate-800 ml-1 text-xs">
              {resource.rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-400">
              ({resource.ratingCount})
            </span>
          </div>

          {/* File Size / Duration */}
          <span className="text-[11px] font-mono text-slate-500">
            {resource.fileSize || resource.duration}
          </span>
        </div>

        {/* Actions: Preview & Download */}
        <div className="flex items-center gap-2">
          <button
            id={`preview-btn-${resource.id}`}
            onClick={() => onPreview(resource)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Preview</span>
          </button>

          <button
            id={`download-btn-${resource.id}`}
            onClick={() => onDownload(resource)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
