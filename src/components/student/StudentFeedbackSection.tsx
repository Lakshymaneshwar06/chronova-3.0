import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Sparkles,
  Calendar,
  ThumbsUp
} from 'lucide-react';
import { EventItem, EventFeedback } from '../../types';

interface StudentFeedbackSectionProps {
  events: EventItem[];
  feedbacks: EventFeedback[];
  onSubmitFeedback: (newFeedback: EventFeedback) => void;
  t?: (key: string) => string;
}

export const StudentFeedbackSection: React.FC<StudentFeedbackSectionProps> = ({
  events,
  feedbacks,
  onSubmitFeedback
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [type, setType] = useState<'review' | 'complaint' | 'suggestion'>('review');
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<EventFeedback['category']>('Organization');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [studentName, setStudentName] = useState('Alex Mercer');
  const [studentEmail, setStudentEmail] = useState('alex.mercer@chronova.edu');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const matchedEvent = events.find((ev) => ev.id === selectedEventId);

    setTimeout(() => {
      const newEntry: EventFeedback = {
        id: `fb-${Date.now()}`,
        eventId: selectedEventId,
        eventTitle: matchedEvent ? matchedEvent.title : 'Chronova Campus Event',
        studentName: studentName || 'Anonymous Student',
        studentEmail: studentEmail || 'student@chronova.edu',
        type,
        rating,
        category,
        subject,
        message,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      onSubmitFeedback(newEntry);
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 450);
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesStatus = filterStatus === 'all' || fb.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesType = filterType === 'all' || fb.type === filterType;
    return matchesStatus && matchesType;
  });

  return (
    <div id="student-feedback-section" className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2.5">
            <MessageSquare className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Event Review & Grievance Resolution</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Review & Complaint Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Submit constructive reviews or report complaints regarding any campus event (venue audio, scheduling delays, logistics, wifi, or mentors) directly to the student council.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Submit Event Feedback
            </h3>
            <span className="text-[11px] text-slate-400">Step 1 of 1</span>
          </div>

          {showSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Feedback submitted! The organizing team has received your ticket.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Feedback Type Tabs */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Submission Type *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setType('review')}
                  className={`py-2 px-2 rounded-xl font-bold border transition-all cursor-pointer text-center ${
                    type === 'review'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-800 dark:text-amber-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  ⭐ Review
                </button>

                <button
                  type="button"
                  onClick={() => setType('complaint')}
                  className={`py-2 px-2 rounded-xl font-bold border transition-all cursor-pointer text-center ${
                    type === 'complaint'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-800 dark:text-rose-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  ⚠️ Complaint
                </button>

                <button
                  type="button"
                  onClick={() => setType('suggestion')}
                  className={`py-2 px-2 rounded-xl font-bold border transition-all cursor-pointer text-center ${
                    type === 'suggestion'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 text-indigo-800 dark:text-indigo-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  💡 Suggestion
                </button>
              </div>
            </div>

            {/* Event Selector */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Event *
              </label>
              <div className="relative">
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({new Date(ev.startDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rating Stars (for Review) */}
            {type === 'review' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Overall Event Rating
                </label>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Feedback Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventFeedback['category'])}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="Organization">Event Organization & Scheduling</option>
                <option value="Venue & Facilities">Venue, Seating & Acoustics</option>
                <option value="Technical Glitches">Wi-Fi, Platform & Projector Glitches</option>
                <option value="Speaker/Mentor">Speaker, Mentorship & Content</option>
                <option value="Refreshments">Refreshments & Hospitality</option>
                <option value="Other">Other Operational Concern</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject / Title *
              </label>
              <input
                type="text"
                required
                placeholder={
                  type === 'complaint'
                    ? 'e.g. Wi-Fi down during afternoon hackathon sprint'
                    : 'e.g. Hands-on coding session was exceptionally well guided'
                }
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Message Details */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Message *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Provide specific details, room numbers, or timestamps to help organizers resolve this swiftly..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting...' : 'Submit Entry'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Feed of Reviews & Complaints */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Public Transparency Wall
              </h3>
              <p className="text-[11px] text-slate-400">
                {filteredFeedbacks.length} submissions recorded
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="all">All Types</option>
                <option value="review">Reviews Only</option>
                <option value="complaint">Complaints Only</option>
                <option value="suggestion">Suggestions Only</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="all">All Status</option>
                <option value="resolved">Resolved</option>
                <option value="in review">In Review</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-xs font-semibold">No feedback matching your selected filter.</p>
              </div>
            ) : (
              filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            fb.type === 'complaint'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : fb.type === 'review'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          {fb.type}
                        </span>

                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {fb.category}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ml-auto sm:ml-0 ${
                            fb.status === 'Resolved'
                              ? 'bg-pastel-mint text-emerald-800'
                              : fb.status === 'Under Review'
                              ? 'bg-pastel-sky text-sky-800'
                              : 'bg-pastel-peach text-amber-800'
                          }`}
                        >
                          {fb.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {fb.subject}
                      </h4>
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        Event: {fb.eventTitle}
                      </p>
                    </div>

                    {fb.type === 'review' && fb.rating && (
                      <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold font-mono">{fb.rating}.0</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {fb.message}
                  </p>

                  {/* Admin Response Box if available */}
                  {fb.adminResponse && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-l-4 border-emerald-500 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        <span>Official Council Response</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{fb.adminResponse}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>By: {fb.studentName}</span>
                    <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
