import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Share2,
  CheckCircle2,
  QrCode,
  Download,
  CalendarPlus,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { EventItem, UserRegistration } from '../../types';
import { CountdownTimer } from '../common/CountdownTimer';
import { RealQrCode } from '../common/RealQrCode';

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
  onRegisterSuccess: (registration: UserRegistration) => void;
  existingRegistration?: UserRegistration | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  onRegisterSuccess,
  existingRegistration
}) => {
  if (!event) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'agenda' | 'register'>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student Developer',
    track: 'AI & Machine Learning',
    teamName: ''
  });
  const [ticketData, setTicketData] = useState<UserRegistration | null>(existingRegistration || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startDate = new Date(event.startDate);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const timeFormatted = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket: UserRegistration = {
        id: `reg-${Date.now()}`,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.startDate,
        attendeeName: formData.name,
        attendeeEmail: formData.email,
        attendeeRole: formData.role,
        ticketCode: `CHRON-${Math.floor(100000 + Math.random() * 900000)}`,
        qrData: `CHRONOVA::${event.id}::${formData.email}::2026`,
        registeredAt: new Date().toISOString()
      };

      setTicketData(newTicket);
      onRegisterSuccess(newTicket);
      setIsSubmitting(false);
      setActiveTab('register');
    }, 500);
  };

  const handleDownloadCalendar = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Chronova//Event Portal//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
      `LOCATION:${event.venue}`,
      `DTSTART:${event.startDate.replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${event.endDate.replace(/[-:]/g, '').split('.')[0]}Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.id}-chronova-event.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="event-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/20 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="event-detail-modal-container"
        className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Hero */}
        <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-100">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 border border-white shadow-sm transition-colors z-10 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Banner Floating Meta */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-white">
                  {event.category.replace('-', ' ')}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-white">
                  {event.format.toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                {event.title}
              </h2>
              <p className="text-xs sm:text-sm text-cyan-200 font-medium">
                {event.tagline}
              </p>
            </div>

            <div className="shrink-0 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-white">
              <CountdownTimer targetDate={event.startDate} compact accentColor="cyan" />
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/80">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Speakers
          </button>

          {event.agenda && event.agenda.length > 0 && (
            <button
              onClick={() => setActiveTab('agenda')}
              className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'agenda'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Agenda Schedule
            </button>
          )}

          <button
            onClick={() => setActiveTab('register')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'register'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{ticketData ? 'Digital Pass' : 'RSVP / Register'}</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Date, Location, Seats Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-100">
                  <div className="flex items-center gap-2 text-cyan-800 text-xs font-semibold">
                    <Calendar className="w-4 h-4 text-cyan-600" />
                    <span>Date & Time</span>
                  </div>
                  <p className="text-xs text-slate-800 font-semibold mt-1">
                    {formattedDate}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {timeFormatted} UTC
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-800 text-xs font-semibold">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>Location</span>
                  </div>
                  <p className="text-xs text-slate-800 font-semibold mt-1 truncate">
                    {event.venue}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {event.format === 'virtual' ? 'Online Livestream' : 'Campus Venue'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>Capacity</span>
                  </div>
                  <p className="text-xs text-slate-800 font-semibold mt-1 font-mono">
                    {event.registeredCount} / {event.totalSeats} seats
                  </p>
                  <p className="text-[11px] text-emerald-600 font-bold">
                    {event.price} Entry
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-heading">
                  About This Event
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Prizes & Perks */}
              {event.prizes && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>Prizes & Awards</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {event.prizes}
                  </p>
                </div>
              )}

              {/* Speakers Section */}
              {event.speakers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 font-heading">
                    Featured Speakers & Mentors
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.speakers.map((sp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200"
                      >
                        <img
                          src={sp.avatar}
                          alt={sp.name}
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-white"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 truncate">
                            {sp.name}
                          </h5>
                          <p className="text-[11px] text-indigo-600 font-semibold truncate">
                            {sp.role}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {sp.company}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AGENDA */}
          {activeTab === 'agenda' && event.agenda && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-heading">
                Official Event Schedule
              </h4>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-xs font-mono font-bold text-indigo-700">
                        {item.time}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">
                        {item.activity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REGISTER / DIGITAL TICKET */}
          {activeTab === 'register' && (
            <div>
              {ticketData ? (
                /* Ticket Confirmation Card */
                <div className="space-y-5">
                  <div className="text-center">
                    <div className="inline-flex p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 mb-2">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      Seat Reserved!
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your attendee pass has been securely generated. Keep this digital pass handy for gate verification.
                    </p>
                  </div>

                  {/* Boarding Pass */}
                  <div className="relative p-6 rounded-3xl bg-slate-950 text-white shadow-xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-dashed border-slate-700">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                          OFFICIAL ATTENDEE PASS
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                          {event.title}
                        </h4>
                        <p className="text-xs text-slate-400">{event.venue}</p>
                      </div>

                      <div className="shrink-0">
                        <RealQrCode
                          data={ticketData.qrData || `CHRONOVA::${ticketData.ticketCode}`}
                          size={88}
                          label="SCAN AT GATE"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium">
                          ATTENDEE
                        </span>
                        <p className="font-bold text-white truncate mt-0.5">
                          {ticketData.attendeeName}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium">
                          ROLE
                        </span>
                        <p className="font-semibold text-cyan-300 truncate mt-0.5">
                          {ticketData.attendeeRole}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium">
                          TICKET ID
                        </span>
                        <p className="font-mono font-bold text-amber-400 mt-0.5">
                          {ticketData.ticketCode}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium">
                          STATUS
                        </span>
                        <p className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>CONFIRMED</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Ticket */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleDownloadCalendar}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <CalendarPlus className="w-4 h-4 text-indigo-600" />
                      <span>Add to Calendar (.ics)</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Print / Save Pass</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegister} className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900">
                    Reserve your spot for <span className="font-bold">{event.title}</span>. Free general admission with instant QR verification pass.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Mercer"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        University Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@chronova.edu"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Academic Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="Undergraduate Student">Undergraduate Student</option>
                        <option value="Graduate / Researcher">Graduate / Researcher</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Faculty / Educator">Faculty / Educator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Interest Track
                      </label>
                      <select
                        value={formData.track}
                        onChange={(e) =>
                          setFormData({ ...formData, track: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="FullStack & Cloud Architecture">FullStack & Cloud Architecture</option>
                        <option value="Competitive Programming & Algorithms">Competitive Programming & Algorithms</option>
                        <option value="Robotics & Embedded Systems">Robotics & Embedded Systems</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Team Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NeuralKnights"
                      value={formData.teamName}
                      onChange={(e) =>
                        setFormData({ ...formData, teamName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Allocating Seat & Issuing Pass...</span>
                    ) : (
                      <>
                        <span>Complete Registration & Generate Pass</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg cursor-pointer"
          >
            Close
          </button>

          {activeTab !== 'register' && !ticketData && (
            <button
              onClick={() => setActiveTab('register')}
              className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Claim Spot Free
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
