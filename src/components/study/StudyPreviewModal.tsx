import React, { useState } from 'react';
import {
  X,
  Download,
  Bookmark,
  Share2,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Video,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Code
} from 'lucide-react';
import { StudyResource } from '../../types';

interface StudyPreviewModalProps {
  resource: StudyResource | null;
  onClose: () => void;
  onDownload: (resource: StudyResource) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const StudyPreviewModal: React.FC<StudyPreviewModalProps> = ({
  resource,
  onClose,
  onDownload,
  isSaved = false,
  onToggleSave
}) => {
  if (!resource) return null;

  const [activeTab, setActiveTab] = useState<'summary' | 'chapters' | 'interactive'>('summary');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const chapters = [
    { num: '01', title: 'Foundations, Memory Layout & Axioms', duration: '18 min' },
    { num: '02', title: 'Algorithmic Complexity & Worst-Case Bounds', duration: '24 min' },
    { num: '03', title: 'Core Implementation & State Machine Code', duration: '35 min' },
    { num: '04', title: 'Edge Cases, Concurrency Hazards & Mitigations', duration: '28 min' },
    { num: '05', title: 'Worked University Exam Questions & Rubric', duration: '30 min' }
  ];

  return (
    <div
      id="study-preview-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/20 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="study-preview-modal-container"
        className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 border border-indigo-200 text-xs font-mono font-bold text-indigo-800">
                {resource.courseCode}
              </span>
              <span className="text-xs font-medium text-slate-600">
                {resource.courseName}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                Sem {resource.semester}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug font-heading">
              {resource.title}
            </h2>

            {/* Author details */}
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <span>Authored by {resource.author.name}</span>
              <span>•</span>
              <span>Updated {resource.lastUpdated}</span>
              <span>•</span>
              <span className="text-indigo-600 font-semibold">
                {resource.downloadCount} Downloads
              </span>
            </div>
          </div>

          {/* Close & Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(resource.id)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                    : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
                }`}
                title={isSaved ? 'Saved to Vault' : 'Save Material'}
                aria-label="Save Material"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Mode Simulation Banner */}
        {resource.type === 'video' && (
          <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center border-b border-slate-200 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80"
              alt="Video Preview"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isPlayingVideo ? 'opacity-40' : 'opacity-70'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

            {!isPlayingVideo ? (
              <button
                onClick={() => setIsPlayingVideo(true)}
                className="group relative z-10 flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-indigo-900 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span>Watch Video Lecture ({resource.duration})</span>
              </button>
            ) : (
              <div className="relative z-10 text-center p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-indigo-200 max-w-md mx-4 shadow-lg text-slate-900">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-900">Streaming Masterclass</p>
                <p className="text-xs text-slate-500 mt-1">Interactive academic video player stream is active</p>
                <button
                  onClick={() => setIsPlayingVideo(false)}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Pause Stream
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'summary'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Summary & Key Concepts
          </button>

          <button
            onClick={() => setActiveTab('chapters')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'chapters'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Table of Contents
          </button>

          <button
            onClick={() => setActiveTab('interactive')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'interactive'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Quiz</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-6">
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-heading">
                  Material Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              {/* Key Concept Points */}
              {resource.contentPreview?.keyPoints && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-900 text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Key Examination Takeaways</span>
                  </div>
                  <ul className="space-y-2">
                    {resource.contentPreview.keyPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Code Snippet Walkthrough if available */}
              {resource.contentPreview?.sampleSnippet && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                      <Code className="w-4 h-4 text-indigo-600" />
                      <span>Code Implementation Snapshot</span>
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(resource.contentPreview!.sampleSnippet!)
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 cursor-pointer transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                    {resource.contentPreview.sampleSnippet}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TABLE OF CONTENTS */}
          {activeTab === 'chapters' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-heading">
                Structured Course Syllabus Breakdown
              </h4>
              {chapters.map((ch) => (
                <div
                  key={ch.num}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-indigo-700 px-2 py-0.5 rounded bg-indigo-100 border border-indigo-200">
                      {ch.num}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {ch.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {ch.duration}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: INTERACTIVE QUIZ */}
          {activeTab === 'interactive' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-900 text-xs font-bold mb-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Knowledge Check</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-medium">
                  Which algorithmic mechanism guarantees optimal shortest path bounds on non-negative weighted graphs?
                </p>

                <div className="space-y-2 mt-3">
                  {[
                    'Dijkstra Algorithm with Min-Heap Priority Queue',
                    'Breadth-First Search (BFS) without edge weights',
                    'Greedy Depth-First Search without cycle memoization',
                    'Floyd-Warshall with cubic O(V³) dynamic matrix iterations'
                  ].map((option, idx) => {
                    const isCorrect = idx === 0;
                    const isSelected = quizSelected === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setQuizSelected(idx)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-rose-100 border-rose-300 text-rose-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {isSelected && isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700">
                              CORRECT!
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Format: {resource.type.toUpperCase()} • Size:{' '}
            {resource.fileSize || resource.duration}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Done Reading
            </button>

            <button
              onClick={() => onDownload(resource)}
              className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Resource</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
