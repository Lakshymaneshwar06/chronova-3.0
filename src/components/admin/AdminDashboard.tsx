import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  BookOpen,
  Users,
  AlertCircle,
  QrCode,
  Award,
  PlusCircle,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sparkles,
  UploadCloud,
  FileText,
  Lock,
  Trash2,
  X,
  MapPin,
  Tag,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  EventItem,
  StudyResource,
  EventFeedback,
  CertificateItem,
  ClubItem,
  UserRegistration,
  AdminTab,
  Department,
  ResourceType
} from '../../types';
import { RealQrCode } from '../common/RealQrCode';

interface AdminDashboardProps {
  events: EventItem[];
  resources: StudyResource[];
  clubs: ClubItem[];
  feedbacks: EventFeedback[];
  certificates: CertificateItem[];
  registrations: UserRegistration[];
  onResolveFeedback: (id: string, status: EventFeedback['status'], adminReply: string) => void;
  onIssueCertificate: (cert: CertificateItem) => void;
  onCreateEvent: (event: EventItem) => void;
  onUploadStudy: (resource: StudyResource) => void;
  onCreateClub: (club: ClubItem) => void;
  onDeleteEvent?: (id: string) => void;
  onDeleteStudy?: (id: string) => void;
  onDeleteClub?: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  events,
  resources,
  clubs,
  feedbacks,
  certificates,
  registrations,
  onResolveFeedback,
  onIssueCertificate,
  onCreateEvent,
  onUploadStudy,
  onCreateClub,
  onDeleteEvent,
  onDeleteStudy,
  onDeleteClub
}) => {
  // Navigation tab state: 'events' | 'study' | 'clubs' | 'analytics' | 'attendance-certs' | 'complaints'
  const [adminTab, setAdminTab] = useState<AdminTab>('events');

  // Search & Filter state for Events
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('all');
  const [eventFormatFilter, setEventFormatFilter] = useState<string>('all');

  // Search & Filter state for Study Materials
  const [studySearch, setStudySearch] = useState('');
  const [studyDeptFilter, setStudyDeptFilter] = useState<string>('all');
  const [studySemesterFilter, setStudySemesterFilter] = useState<number>(0);
  const [studyTypeFilter, setStudyTypeFilter] = useState<string>('all');

  // Search & Filter state for Clubs
  const [clubSearch, setClubSearch] = useState('');
  const [clubCategoryFilter, setClubCategoryFilter] = useState<string>('all');

  // Modal display states for section-specific uploads
  const [isEventUploadOpen, setIsEventUploadOpen] = useState(false);
  const [isStudyUploadOpen, setIsStudyUploadOpen] = useState(false);
  const [isClubUploadOpen, setIsClubUploadOpen] = useState(false);

  // Category restriction violation banner state (if an attempt is made to bypass)
  const [uploadError, setUploadError] = useState<string | null>(null);

  // -------------------------------------------------------------
  // EVENT FORM STATE (Strictly Event-Only)
  // -------------------------------------------------------------
  const [newEvent, setNewEvent] = useState({
    title: '',
    tagline: '',
    category: 'hackathon' as EventItem['category'],
    format: 'in-person' as EventItem['format'],
    venue: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    totalSeats: 120,
    prizes: '$10,000 Prize Pool',
    description: '',
    speakerName: 'Dr. Jane Foster',
    speakerRole: 'Principal Architect',
    speakerOrg: 'Chronova Research Labs',
    bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    tagsInput: 'Hackathon, Innovation, AI'
  });

  // -------------------------------------------------------------
  // STUDY FORM STATE (Strictly Study-Only)
  // -------------------------------------------------------------
  const [newStudy, setNewStudy] = useState({
    courseCode: '',
    courseName: '',
    department: 'cs' as Department,
    semester: 3,
    type: 'pdf' as ResourceType,
    title: '',
    description: '',
    authorName: 'Prof. Arvind Sharma',
    authorRole: 'Faculty Chair, Computer Science',
    tagsInput: 'LectureNotes, SolvedPYQ, ExamGuide',
    keyPointsInput: 'Core distributed consensus, Time complexity proof, Cheat-sheet summaries'
  });
  const [studyFileName, setStudyFileName] = useState<string | null>(null);
  const [studyFileSize, setStudyFileSize] = useState<string | null>(null);

  // -------------------------------------------------------------
  // CLUB FORM STATE (Strictly Club-Only)
  // -------------------------------------------------------------
  const [newClub, setNewClub] = useState({
    name: '',
    category: 'Technical Guild',
    meetingTime: 'Every Wednesday at 4:30 PM',
    location: 'Turing Innovation Lab 3, Block C',
    currentMembers: 45,
    leadName: 'Aarav Patel',
    email: 'robotics-lead@chronova.edu',
    qrToken: 'CHRON-CLUB-ROBOTICS-01',
    description: 'Dedicated to autonomous robotics, rover firmware, and computer vision systems.',
    recruiting: true,
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    tagsInput: 'Robotics, Embedded, Hardware, ROS2'
  });

  // Feedback resolution modal state
  const [activeFeedbackModal, setActiveFeedbackModal] = useState<EventFeedback | null>(null);
  const [modalStatus, setModalStatus] = useState<EventFeedback['status']>('Resolved');
  const [adminReplyText, setAdminReplyText] = useState('');

  // Attendance QR projection state
  const [projectedEventId, setProjectedEventId] = useState<string>(events[0]?.id || '');
  const [projectedScanCount, setProjectedScanCount] = useState<number>(48);

  // Certificate generation form state
  const [newCert, setNewCert] = useState({
    title: 'Excellence in Cloud & Systems Engineering',
    recipientName: '',
    recipientEmail: '',
    grade: 'Grade A+ with Distinction',
    issuer: 'Chronova Academic Directorate',
    skills: 'Distributed Systems, Raft, Microservices'
  });

  const pendingComplaintsCount = feedbacks.filter((f) => f.status === 'Pending').length;

  // -------------------------------------------------------------
  // FILTERED COLLECTIONS (Strict category separation)
  // -------------------------------------------------------------
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      if (eventSearch.trim()) {
        const q = eventSearch.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesVenue = evt.venue.toLowerCase().includes(q);
        const matchesDesc = evt.description.toLowerCase().includes(q);
        const matchesSpeaker = evt.speakers.some((s) => s.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesVenue && !matchesDesc && !matchesSpeaker) return false;
      }
      if (eventCategoryFilter !== 'all' && evt.category !== eventCategoryFilter) return false;
      if (eventFormatFilter !== 'all' && evt.format !== eventFormatFilter) return false;
      return true;
    });
  }, [events, eventSearch, eventCategoryFilter, eventFormatFilter]);

  const filteredStudyResources = useMemo(() => {
    return resources.filter((res) => {
      if (studySearch.trim()) {
        const q = studySearch.toLowerCase();
        const matchesCode = res.courseCode.toLowerCase().includes(q);
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesName = res.courseName.toLowerCase().includes(q);
        const matchesAuthor = res.author.name.toLowerCase().includes(q);
        if (!matchesCode && !matchesTitle && !matchesName && !matchesAuthor) return false;
      }
      if (studyDeptFilter !== 'all' && res.department !== studyDeptFilter) return false;
      if (studySemesterFilter !== 0 && res.semester !== studySemesterFilter) return false;
      if (studyTypeFilter !== 'all' && res.type !== studyTypeFilter) return false;
      return true;
    });
  }, [resources, studySearch, studyDeptFilter, studySemesterFilter, studyTypeFilter]);

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      if (clubSearch.trim()) {
        const q = clubSearch.toLowerCase();
        const matchesName = club.name.toLowerCase().includes(q);
        const matchesLead = club.leadName.toLowerCase().includes(q);
        const matchesLoc = club.location.toLowerCase().includes(q);
        if (!matchesName && !matchesLead && !matchesLoc) return false;
      }
      if (clubCategoryFilter !== 'all' && club.category !== clubCategoryFilter) return false;
      return true;
    });
  }, [clubs, clubSearch, clubCategoryFilter]);

  // -------------------------------------------------------------
  // SUBMIT HANDLERS WITH STRICT CATEGORY VALIDATION
  // -------------------------------------------------------------
  const handleEventUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    // Strict Category Validation: Events only
    if (adminTab !== 'events') {
      setUploadError('Category Restriction Violation: Events can only be published from the Events section.');
      return;
    }

    if (!newEvent.title.trim()) {
      setUploadError('Event Title is required.');
      return;
    }

    // Ensure it cannot be disguised study material or club
    if (newEvent.title.toLowerCase().includes('syllabus') && !newEvent.venue.trim()) {
      setUploadError('Category Error: Detected study material. Study notes must be uploaded in the Study section.');
      return;
    }

    const tags = newEvent.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const createdEvent: EventItem = {
      id: `evt-${Date.now()}`,
      title: newEvent.title.trim(),
      tagline: newEvent.tagline.trim() || 'Premier campus engineering event',
      category: newEvent.category,
      format: newEvent.format,
      venue: newEvent.venue.trim() || 'North Campus Auditorium',
      startDate: newEvent.startDate || new Date(Date.now() + 86400000 * 14).toISOString(),
      endDate: newEvent.endDate || new Date(Date.now() + 86400000 * 15).toISOString(),
      registrationDeadline: newEvent.registrationDeadline || new Date(Date.now() + 86400000 * 10).toISOString(),
      totalSeats: Number(newEvent.totalSeats) || 100,
      registeredCount: 0,
      price: 'Free',
      prizes: newEvent.prizes,
      bannerImage: newEvent.bannerImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      description: newEvent.description || 'Interactive technical event organized by Chronova.',
      speakers: [
        {
          name: newEvent.speakerName || 'Invited Keynote Speaker',
          role: newEvent.speakerRole || 'Distinguished Engineer',
          company: newEvent.speakerOrg || 'Chronova Council',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
        }
      ],
      tags: tags.length ? tags : ['Event', 'Campus']
    };

    onCreateEvent(createdEvent);
    setIsEventUploadOpen(false);
    setNewEvent({
      title: '',
      tagline: '',
      category: 'hackathon',
      format: 'in-person',
      venue: '',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      totalSeats: 120,
      prizes: '$10,000 Prize Pool',
      description: '',
      speakerName: 'Dr. Jane Foster',
      speakerRole: 'Principal Architect',
      speakerOrg: 'Chronova Research Labs',
      bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      tagsInput: 'Hackathon, Innovation, AI'
    });
  };

  const handleStudyUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    // Strict Category Validation: Study only
    if (adminTab !== 'study') {
      setUploadError('Category Restriction Violation: Academic resources can only be uploaded from the Study section.');
      return;
    }

    if (!newStudy.courseCode.trim() || !newStudy.title.trim()) {
      setUploadError('Course Code and Material Title are required for study uploads.');
      return;
    }

    // Validate Course Code format (e.g. CS301, AI202, MATH101)
    const codeClean = newStudy.courseCode.trim().toUpperCase();
    if (codeClean.length < 3 || codeClean.length > 10) {
      setUploadError('Invalid Course Code format. Example format: CS301 or AI402.');
      return;
    }

    const tags = newStudy.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const keyPoints = newStudy.keyPointsInput
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const createdResource: StudyResource = {
      id: `res-${Date.now()}`,
      title: newStudy.title.trim(),
      courseCode: codeClean,
      courseName: newStudy.courseName.trim() || `${codeClean} Academic Course`,
      department: newStudy.department,
      semester: Number(newStudy.semester),
      type: newStudy.type,
      description: newStudy.description.trim() || 'Verified course notes and academic materials curated by university faculty.',
      author: {
        name: newStudy.authorName.trim() || 'Faculty Chair',
        role: newStudy.authorRole.trim() || 'Academic Faculty',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
      },
      fileSize: studyFileSize || '4.2 MB',
      pageCount: 38,
      rating: 5.0,
      ratingCount: 1,
      downloadCount: 0,
      likesCount: 0,
      tags: tags.length ? tags : ['Study', codeClean],
      lastUpdated: new Date().toISOString().split('T')[0],
      contentPreview: {
        summary: `Comprehensive academic guide for ${codeClean}.`,
        keyPoints: keyPoints.length ? keyPoints : ['Fundamental concepts review', 'Solved examples & formula derivations']
      }
    };

    onUploadStudy(createdResource);
    setIsStudyUploadOpen(false);
    setNewStudy({
      courseCode: '',
      courseName: '',
      department: 'cs',
      semester: 3,
      type: 'pdf',
      title: '',
      description: '',
      authorName: 'Prof. Arvind Sharma',
      authorRole: 'Faculty Chair, Computer Science',
      tagsInput: 'LectureNotes, SolvedPYQ, ExamGuide',
      keyPointsInput: 'Core distributed consensus, Time complexity proof, Cheat-sheet summaries'
    });
    setStudyFileName(null);
    setStudyFileSize(null);
  };

  const handleClubUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    // Strict Category Validation: Clubs only
    if (adminTab !== 'clubs') {
      setUploadError('Category Restriction Violation: Clubs can only be registered from the Clubs section.');
      return;
    }

    if (!newClub.name.trim() || !newClub.leadName.trim()) {
      setUploadError('Club Name and Student Lead Name are required.');
      return;
    }

    if (!newClub.location.trim()) {
      setUploadError('Meeting Room / Lab Location is required for club registration.');
      return;
    }

    const tags = newClub.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const token = newClub.qrToken.trim() || `CHRON-CLUB-${Date.now().toString().slice(-4)}`;

    const createdClub: ClubItem = {
      id: `club-${Date.now()}`,
      name: newClub.name.trim(),
      category: newClub.category,
      meetingTime: newClub.meetingTime.trim() || 'Weekly Meetup',
      location: newClub.location.trim(),
      currentMembers: Number(newClub.currentMembers) || 20,
      leadName: newClub.leadName.trim(),
      email: newClub.email.trim() || 'club@chronova.edu',
      qrToken: token,
      icon: 'Users',
      description: newClub.description.trim() || 'Official student society registered with Chronova Campus Council.',
      tags: tags.length ? tags : ['Club', 'Community'],
      coverImage: newClub.coverImage || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      recruiting: Boolean(newClub.recruiting)
    };

    onCreateClub(createdClub);
    setIsClubUploadOpen(false);
    setNewClub({
      name: '',
      category: 'Technical Guild',
      meetingTime: 'Every Wednesday at 4:30 PM',
      location: 'Turing Innovation Lab 3, Block C',
      currentMembers: 45,
      leadName: 'Aarav Patel',
      email: 'robotics-lead@chronova.edu',
      qrToken: 'CHRON-CLUB-ROBOTICS-01',
      description: 'Dedicated to autonomous robotics, rover firmware, and computer vision systems.',
      recruiting: true,
      coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      tagsInput: 'Robotics, Embedded, Hardware, ROS2'
    });
  };

  const handleStudyFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // File type check for study materials
      const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.md', '.zip', '.ipynb', '.py'];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        setUploadError(`File Type Error: ${fileExt} is not an accepted study document. Upload PDF, Word, Markdown, or Code archives.`);
        return;
      }

      setStudyFileName(file.name);
      setStudyFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!newStudy.title) {
        setNewStudy((prev) => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, '')
        }));
      }
    }
  };

  // Feedback Resolution
  const handleOpenFeedbackModal = (fb: EventFeedback) => {
    setActiveFeedbackModal(fb);
    setModalStatus(fb.status);
    setAdminReplyText(fb.adminResponse || '');
  };

  const handleSaveFeedbackResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedbackModal) return;
    onResolveFeedback(activeFeedbackModal.id, modalStatus, adminReplyText);
    setActiveFeedbackModal(null);
  };

  // Issue Certificate
  const handleCreateCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.recipientName || !newCert.recipientEmail) return;

    const certItem: CertificateItem = {
      id: `cert-${Date.now()}`,
      title: newCert.title,
      issueDate: new Date().toISOString().split('T')[0],
      recipientName: newCert.recipientName,
      recipientEmail: newCert.recipientEmail,
      verificationId: `CERT-CHRON-${Math.floor(10000 + Math.random() * 90000)}-VERIF`,
      qrCode: `https://chronova.edu/verify/CERT-CHRON-${Math.floor(10000 + Math.random() * 90000)}`,
      issuer: newCert.issuer,
      grade: newCert.grade,
      skills: newCert.skills.split(',').map((s) => s.trim()).filter(Boolean)
    };

    onIssueCertificate(certItem);
    setNewCert({
      title: 'Excellence in Cloud & Systems Engineering',
      recipientName: '',
      recipientEmail: '',
      grade: 'Grade A+ with Distinction',
      issuer: 'Chronova Academic Directorate',
      skills: 'Distributed Systems, Raft, Microservices'
    });
  };

  return (
    <div id="admin-dashboard" className="space-y-8 animate-in fade-in duration-300">
      {/* 1. TOP HEADER & CATEGORY RESTRICTIONS ENFORCEMENT BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-pastel-lavender/40 via-pastel-sky/30 to-pastel-mint/30 border border-pastel-lavender/60 p-4 sm:p-8 shadow-xs max-w-full overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Campus Management & Faculty Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Chronova Administration Panel
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Strict Category-Based Upload System: Publish and manage content in its dedicated section.
              The Events section accepts only events, Study accepts only academic resources, and Clubs accepts only club profiles.
            </p>
          </div>

          {/* Section Quick Jump Actions with Category Locking Badges */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="admin-jump-events-btn"
              onClick={() => {
                setAdminTab('events');
                setIsEventUploadOpen(true);
              }}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white hover:bg-pastel-lavender/30 text-indigo-950 border border-indigo-200 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
              title="Upload Event in Events section"
            >
              <Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-indigo-600" />
              <span>+ Upload Event</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                Events Only
              </span>
            </button>

            <button
              id="admin-jump-study-btn"
              onClick={() => {
                setAdminTab('study');
                setIsStudyUploadOpen(true);
              }}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white hover:bg-pastel-sky/30 text-indigo-950 border border-pastel-sky text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
              title="Upload Study Material in Study section"
            >
              <BookOpen className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-600" />
              <span>+ Upload Study</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 font-semibold">
                Study Only
              </span>
            </button>

            <button
              id="admin-jump-clubs-btn"
              onClick={() => {
                setAdminTab('clubs');
                setIsClubUploadOpen(true);
              }}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white hover:bg-pastel-mint/30 text-indigo-950 border border-pastel-mint text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
              title="Register Club in Clubs section"
            >
              <Users className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-600" />
              <span>+ Register Club</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                Clubs Only
              </span>
            </button>
          </div>
        </div>

        {/* Category Restriction Notice Pill */}
        <div className="mt-4 pt-4 border-t border-pastel-lavender/40 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 font-bold text-indigo-900">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            Category Isolation Policy:
          </span>
          <span>Each section is locked to accept and render only its relevant domain content. Cross-category uploading is blocked.</span>
        </div>
      </div>

      {/* Global Section Error Notice if an admin tries to cross-upload */}
      {uploadError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. ADMIN TAB SWITCHER */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-x-auto max-w-full scrollbar-none">
        {/* Section 1: EVENTS */}
        <button
          id="admin-tab-events"
          onClick={() => setAdminTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'events'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-pastel-lavender/30'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Events Section</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
              adminTab === 'events' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {events.length}
          </span>
        </button>

        {/* Section 2: STUDY */}
        <button
          id="admin-tab-study"
          onClick={() => setAdminTab('study')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'study'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-pastel-sky/30'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Study Section</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
              adminTab === 'study' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {resources.length}
          </span>
        </button>

        {/* Section 3: CLUBS */}
        <button
          id="admin-tab-clubs"
          onClick={() => setAdminTab('clubs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'clubs'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-pastel-mint/30'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Clubs Section</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
              adminTab === 'clubs' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {clubs.length}
          </span>
        </button>

        {/* Section 4: ANALYTICS */}
        <button
          id="admin-tab-analytics"
          onClick={() => setAdminTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>

        {/* Section 5: ATTENDANCE & CERTS */}
        <button
          id="admin-tab-attendance-certs"
          onClick={() => setAdminTab('attendance-certs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'attendance-certs'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Attendance & Certs</span>
        </button>

        {/* Section 6: COMPLAINTS */}
        <button
          id="admin-tab-complaints"
          onClick={() => setAdminTab('complaints')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'complaints'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Complaints ({pendingComplaintsCount} Pending)</span>
        </button>
      </div>

      {/* =========================================================================
          SECTION 1: EVENTS SECTION (Strictly Event-Related Content Only)
         ========================================================================= */}
      {adminTab === 'events' && (
        <div id="admin-events-section" className="space-y-6">
          {/* Section Rule Header */}
          <div className="p-5 rounded-3xl bg-white border border-pastel-lavender/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-pastel-lavender text-indigo-900 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3 text-indigo-700" />
                  Category Restricted: Events Only
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredEvents.length} active events
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Campus Events Management
              </h3>
              <p className="text-xs text-slate-500">
                In this section, admins can upload and manage only event-related content (hackathons, workshops, technical talks, competitions, bootcamps).
              </p>
            </div>

            <button
              id="open-event-upload-modal-btn"
              onClick={() => {
                setUploadError(null);
                setIsEventUploadOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Event (Events Only)</span>
            </button>
          </div>

          {/* Search and Filters for Events */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:flex-1 sm:max-w-md min-w-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search events by title, venue, or speaker..."
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={eventCategoryFilter}
                onChange={(e) => setEventCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
              >
                <option value="all">All Event Types</option>
                <option value="hackathon">Hackathons</option>
                <option value="workshop">Workshops</option>
                <option value="tech-talk">Tech Talks</option>
                <option value="competition">Competitions</option>
                <option value="bootcamp">Bootcamps</option>
              </select>

              <select
                value={eventFormatFilter}
                onChange={(e) => setEventFormatFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
              >
                <option value="all">All Formats</option>
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Events Grid (Displays ONLY Events) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pastel-lavender text-indigo-900 border border-pastel-lavender">
                      {evt.category}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {evt.format.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-heading line-clamp-1">
                    {evt.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {evt.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{new Date(evt.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Roster: {evt.registeredCount} / {evt.totalSeats} seats</span>
                      <span className="font-semibold text-emerald-600 font-mono">{evt.price}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setProjectedEventId(evt.id);
                      setAdminTab('attendance-certs');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Project Gate QR</span>
                  </button>

                  {onDeleteEvent && (
                    <button
                      onClick={() => onDeleteEvent(evt.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Calendar className="w-10 h-10 mx-auto text-slate-400" />
              <h4 className="text-base font-bold text-slate-800">No events found</h4>
              <p className="text-xs text-slate-500">
                There are no events matching your criteria. Use the "Publish Event" button to upload new event content.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 2: STUDY SECTION (Strictly Study & Courseware Content Only)
         ========================================================================= */}
      {adminTab === 'study' && (
        <div id="admin-study-section" className="space-y-6">
          {/* Section Rule Header */}
          <div className="p-5 rounded-3xl bg-white border border-pastel-sky/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-pastel-sky text-sky-900 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3 text-sky-700" />
                  Category Restricted: Study Materials Only
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredStudyResources.length} courseware items
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Academic Courseware & Study Vault
              </h3>
              <p className="text-xs text-slate-500">
                In this section, admins can upload and manage only study-related content (lecture notes, solved PYQs, exam cheat sheets, lab manuals).
              </p>
            </div>

            <button
              id="open-study-upload-modal-btn"
              onClick={() => {
                setUploadError(null);
                setIsStudyUploadOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload Material (Study Only)</span>
            </button>
          </div>

          {/* Search and Filters for Study Materials */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:flex-1 sm:max-w-md min-w-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search course code, subject, or faculty author..."
                value={studySearch}
                onChange={(e) => setStudySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={studyDeptFilter}
                onChange={(e) => setStudyDeptFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
              >
                <option value="all">All Departments</option>
                <option value="cs">CS & Systems</option>
                <option value="ai">AI & Machine Learning</option>
                <option value="ece">Electronics & Comm</option>
                <option value="math">Mathematics</option>
                <option value="cyber">Cybersecurity</option>
                <option value="cloud">Cloud Computing</option>
              </select>

              <select
                value={studySemesterFilter}
                onChange={(e) => setStudySemesterFilter(Number(e.target.value))}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
              >
                <option value={0}>All Semesters</option>
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
                <option value={3}>Semester 3</option>
                <option value={4}>Semester 4</option>
                <option value={5}>Semester 5</option>
                <option value={6}>Semester 6</option>
                <option value={7}>Semester 7</option>
                <option value={8}>Semester 8</option>
              </select>

              <select
                value={studyTypeFilter}
                onChange={(e) => setStudyTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
              >
                <option value="all">All Resource Types</option>
                <option value="pdf">PDF Notes</option>
                <option value="pyq">Solved PYQs</option>
                <option value="cheatsheet">Cheat Sheets</option>
                <option value="notes">Lecture Notes</option>
                <option value="video">Video Classes</option>
              </select>
            </div>
          </div>

          {/* Study Grid (Displays ONLY Study Resources) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudyResources.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-pastel-sky text-indigo-900 border border-pastel-sky">
                      {res.courseCode}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {res.type.toUpperCase()} • Sem {res.semester}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading line-clamp-1">
                      {res.title}
                    </h4>
                    <p className="text-[11px] text-indigo-700 font-semibold mt-0.5">
                      {res.courseName}
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {res.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="text-[11px] text-slate-500 truncate">By {res.author.name}</span>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {res.fileSize || '3.5 MB'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {res.downloadCount} Downloads
                  </span>

                  {onDeleteStudy && (
                    <button
                      onClick={() => onDeleteStudy(res.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Study Resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredStudyResources.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
              <h4 className="text-base font-bold text-slate-800">No study materials found</h4>
              <p className="text-xs text-slate-500">
                There are no courseware items matching your criteria. Use the "Upload Material" button to add academic content.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 3: CLUBS SECTION (Strictly Club & Society Content Only)
         ========================================================================= */}
      {adminTab === 'clubs' && (
        <div id="admin-clubs-section" className="space-y-6">
          {/* Section Rule Header */}
          <div className="p-5 rounded-3xl bg-white border border-pastel-mint/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-pastel-mint text-emerald-900 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  Category Restricted: Clubs & Societies Only
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredClubs.length} registered campus guilds
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Campus Clubs & Student Societies
              </h3>
              <p className="text-xs text-slate-500">
                In this section, admins can register and manage only student club profiles (technical guilds, open source societies, robotics circles).
              </p>
            </div>

            <button
              id="open-club-upload-modal-btn"
              onClick={() => {
                setUploadError(null);
                setIsClubUploadOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Club (Clubs Only)</span>
            </button>
          </div>

          {/* Search and Filters for Clubs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:flex-1 sm:max-w-md min-w-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search clubs by name, student lead, or room..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={clubCategoryFilter}
                onChange={(e) => setClubCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
              >
                <option value="all">All Club Categories</option>
                <option value="Technical Guild">Technical Guild</option>
                <option value="AI & Robotics Society">AI & Robotics Society</option>
                <option value="Open Source Chapter">Open Source Chapter</option>
                <option value="Competitive Programming Guild">Competitive Programming</option>
                <option value="Design & Creative Circle">Design & Creative</option>
                <option value="Cybersecurity Syndicate">Cybersecurity</option>
              </select>
            </div>
          </div>

          {/* Clubs Grid (Displays ONLY Clubs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pastel-mint text-emerald-900 border border-pastel-mint">
                      {club.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        club.recruiting !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {club.recruiting !== false ? '● Recruiting' : 'Members Only'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-heading line-clamp-1">
                    {club.name}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {club.description || 'Active campus student guild.'}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{club.meetingTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{club.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Lead: {club.leadName}</span>
                      <span className="font-semibold text-indigo-700 font-mono">{club.currentMembers} Members</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-500 truncate">
                    Token: {club.qrToken}
                  </span>

                  {onDeleteClub && (
                    <button
                      onClick={() => onDeleteClub(club.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Disband Club"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredClubs.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Users className="w-10 h-10 mx-auto text-slate-400" />
              <h4 className="text-base font-bold text-slate-800">No clubs found</h4>
              <p className="text-xs text-slate-500">
                There are no clubs matching your criteria. Use the "Register Club" button to add a student society.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 4: ANALYTICS OVERVIEW (Aggregated View Across Sections)
         ========================================================================= */}
      {adminTab === 'analytics' && (
        <div id="admin-analytics-section" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Metric 1: Total Events */}
            <div
              onClick={() => setAdminTab('events')}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden cursor-pointer hover:border-indigo-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Events
                </span>
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-heading">
                  {events.length}
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Events Section
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Click to manage & publish events</p>
            </div>

            {/* Metric 2: Academic Resources */}
            <div
              onClick={() => setAdminTab('study')}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden cursor-pointer hover:border-cyan-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Study Materials
                </span>
                <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-700">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-heading">
                  {resources.length}
                </span>
                <span className="text-xs font-semibold text-cyan-600">
                  Semesters 1 - 8
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Click to manage & upload study files</p>
            </div>

            {/* Metric 3: Active Campus Clubs */}
            <div
              onClick={() => setAdminTab('clubs')}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden cursor-pointer hover:border-emerald-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Registered Clubs
                </span>
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-heading">
                  {clubs.length}
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  Campus Societies
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Click to manage & register clubs</p>
            </div>

            {/* Metric 4: Student Complaints */}
            <div
              onClick={() => setAdminTab('complaints')}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden cursor-pointer hover:border-rose-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Complaints Ledger
                </span>
                <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-700">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-heading">
                  {pendingComplaintsCount}
                </span>
                <span className="text-xs font-semibold text-amber-600">
                  Pending Review
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{feedbacks.length} total reports filed</p>
            </div>
          </div>

          {/* Quick Category Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center justify-between">
                <span>Recent Event Enrollments</span>
                <span
                  onClick={() => setAdminTab('events')}
                  className="text-xs text-indigo-600 font-semibold cursor-pointer"
                >
                  View Events
                </span>
              </h3>
              <div className="divide-y divide-slate-100">
                {registrations.slice(0, 4).map((reg) => (
                  <div key={reg.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{reg.attendeeName}</p>
                      <p className="text-slate-500 text-[11px] truncate max-w-[160px]">{reg.eventTitle}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {reg.ticketCode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center justify-between">
                <span>Top Academic Courseware</span>
                <span
                  onClick={() => setAdminTab('study')}
                  className="text-xs text-indigo-600 font-semibold cursor-pointer"
                >
                  View Study Hub
                </span>
              </h3>
              <div className="divide-y divide-slate-100">
                {resources.slice(0, 4).map((res) => (
                  <div key={res.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{res.courseCode}: {res.title}</p>
                      <p className="text-slate-500 text-[11px]">Sem {res.semester} • {res.author.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-700">{res.downloadCount} DL</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center justify-between">
                <span>Active Student Clubs</span>
                <span
                  onClick={() => setAdminTab('clubs')}
                  className="text-xs text-indigo-600 font-semibold cursor-pointer"
                >
                  View Clubs
                </span>
              </h3>
              <div className="divide-y divide-slate-100">
                {clubs.slice(0, 4).map((club) => (
                  <div key={club.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{club.name}</p>
                      <p className="text-slate-500 text-[11px]">{club.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700">{club.currentMembers} Members</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 5: ATTENDANCE QR PROJECTOR & VERIFIABLE CREDENTIALS
         ========================================================================= */}
      {adminTab === 'attendance-certs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Gate & Turnstile System
              </span>
              <h3 className="text-base font-bold text-slate-900 font-heading mt-1">
                Project Event Attendance QR
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Display this dynamic attendance QR code on the main auditorium screen for students to scan.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Active Projection Event
              </label>
              <select
                value={projectedEventId}
                onChange={(e) => setProjectedEventId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({new Date(evt.startDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 text-white text-center space-y-3 shadow-lg">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE GATE CHECK-IN ACTIVE
              </span>

              <div className="w-fit mx-auto shadow-inner bg-white p-3 rounded-2xl">
                <RealQrCode
                  data={`CHRONOVA::EVENT-GATE::${projectedEventId.toUpperCase()}::SECURE-PASS`}
                  size={176}
                  label={`AUTH-GATE-${projectedEventId.toUpperCase()}`}
                />
              </div>

              <p className="text-xs text-slate-400">
                Gate 1 & North Hall Ingress Point • Scanned: {projectedScanCount} attendees
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                Accreditation Authority
              </span>
              <h3 className="text-base font-bold text-slate-900 font-heading mt-1">
                Issue Verifiable Certificate
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate cryptographically verified academic credentials for toppers and event winners.
              </p>
            </div>

            <form onSubmit={handleCreateCertSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Certification Title *
                </label>
                <input
                  type="text"
                  required
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Student Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Chen"
                    value={newCert.recipientName}
                    onChange={(e) => setNewCert({ ...newCert, recipientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Student Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="m.chen@chronova.edu"
                    value={newCert.recipientEmail}
                    onChange={(e) => setNewCert({ ...newCert, recipientEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Academic Distinction
                  </label>
                  <input
                    type="text"
                    value={newCert.grade}
                    onChange={(e) => setNewCert({ ...newCert, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Key Competencies (comma separated)
                </label>
                <input
                  type="text"
                  value={newCert.skills}
                  onChange={(e) => setNewCert({ ...newCert, skills: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Issue & Register Verifiable Certificate</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 6: COMPLAINTS & REVIEWS RESOLUTION DASHBOARD
         ========================================================================= */}
      {adminTab === 'complaints' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Student Review & Complaint Management
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted issues, assign investigation statuses, and write official resolutions.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        fb.type === 'complaint'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {fb.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {fb.subject}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({fb.category})
                    </span>
                  </div>

                  <p className="text-xs text-indigo-600 font-medium">
                    Event: {fb.eventTitle}
                  </p>

                  <p className="text-xs text-slate-600">
                    "{fb.message}"
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                    <span>Student: {fb.studentName} ({fb.studentEmail})</span>
                    <span>•</span>
                    <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                  </div>

                  {fb.adminResponse && (
                    <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 mt-2">
                      <span className="font-bold">Official Response: </span>
                      {fb.adminResponse}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      fb.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : fb.status === 'Under Review'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {fb.status}
                  </span>

                  <button
                    onClick={() => handleOpenFeedbackModal(fb)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Manage & Respond
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: EVENT UPLOAD MODAL (Strictly Events Category Restricted)
         ========================================================================= */}
      {isEventUploadOpen && (
        <div
          id="event-upload-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs overflow-y-auto animate-in fade-in"
          onClick={() => setIsEventUploadOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl border border-pastel-lavender shadow-2xl p-6 sm:p-8 space-y-5 my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pastel-lavender text-indigo-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Lock className="w-3 h-3 text-indigo-700" />
                  Category: Events Only
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  Publish New Campus Event
                </h3>
                <p className="text-xs text-slate-500">
                  This upload form accepts only event-related details. Study materials and clubs cannot be submitted here.
                </p>
              </div>

              <button
                onClick={() => setIsEventUploadOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEventUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NextGen Autonomous Robotics Hackathon"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Category (Events Only)
                  </label>
                  <select
                    value={newEvent.category}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        category: e.target.value as EventItem['category']
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="hackathon">Hackathon</option>
                    <option value="workshop">Workshop</option>
                    <option value="tech-talk">Tech Talk</option>
                    <option value="competition">Competition</option>
                    <option value="bootcamp">Bootcamp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Format
                  </label>
                  <select
                    value={newEvent.format}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        format: e.target.value as EventItem['format']
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="virtual">Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Seat Capacity *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newEvent.totalSeats}
                    onChange={(e) => setNewEvent({ ...newEvent, totalSeats: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Venue / Room Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. North Auditorium or Zoom Hall A"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Prizes / Award Pool
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $10,000 Cash Pool"
                    value={newEvent.prizes}
                    onChange={(e) => setNewEvent({ ...newEvent, prizes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Keynote Speaker Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Jane Foster"
                    value={newEvent.speakerName}
                    onChange={(e) => setNewEvent({ ...newEvent, speakerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Speaker Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Principal Architect"
                    value={newEvent.speakerRole}
                    onChange={(e) => setNewEvent({ ...newEvent, speakerRole: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Speaker Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google DeepMind"
                    value={newEvent.speakerOrg}
                    onChange={(e) => setNewEvent({ ...newEvent, speakerOrg: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Event Description & Tracks *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details on tracks, mentors, rules, and tech stacks provided..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEventUploadOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: STUDY UPLOAD MODAL (Strictly Study Category Restricted)
         ========================================================================= */}
      {isStudyUploadOpen && (
        <div
          id="study-upload-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs overflow-y-auto animate-in fade-in"
          onClick={() => setIsStudyUploadOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl border border-pastel-sky shadow-2xl p-6 sm:p-8 space-y-5 my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pastel-sky text-sky-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Lock className="w-3 h-3 text-sky-700" />
                  Category: Study Materials Only
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  Upload Academic Courseware
                </h3>
                <p className="text-xs text-slate-500">
                  This upload form accepts only study notes, solved papers, and syllabus materials. Events and clubs cannot be submitted here.
                </p>
              </div>

              <button
                onClick={() => setIsStudyUploadOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStudyUploadSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Course Code * (e.g. CS301, AI402)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS301"
                    value={newStudy.courseCode}
                    onChange={(e) => setNewStudy({ ...newStudy, courseCode: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Subject / Course Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Computing & Distributed Systems"
                    value={newStudy.courseName}
                    onChange={(e) => setNewStudy({ ...newStudy, courseName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Department
                  </label>
                  <select
                    value={newStudy.department}
                    onChange={(e) => setNewStudy({ ...newStudy, department: e.target.value as Department })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="cs">CS & Systems</option>
                    <option value="ai">AI & Machine Learning</option>
                    <option value="ece">Electronics</option>
                    <option value="math">Mathematics</option>
                    <option value="cyber">Cybersecurity</option>
                    <option value="cloud">Cloud Architecture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Academic Semester (1-8)
                  </label>
                  <select
                    value={newStudy.semester}
                    onChange={(e) => setNewStudy({ ...newStudy, semester: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Resource Type (Study Only)
                  </label>
                  <select
                    value={newStudy.type}
                    onChange={(e) => setNewStudy({ ...newStudy, type: e.target.value as ResourceType })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="pdf">PDF Notes</option>
                    <option value="pyq">Solved PYQ Paper</option>
                    <option value="cheatsheet">Exam Cheat Sheet</option>
                    <option value="notes">Handwritten Notes</option>
                    <option value="video">Video Masterclass</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Document / Material Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus & Raft Protocol Deep Dive"
                  value={newStudy.title}
                  onChange={(e) => setNewStudy({ ...newStudy, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              {/* Study Document File Attachment */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Attach Academic File (.pdf, .docx, .zip, .md)
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-white transition-all">
                  <UploadCloud className="w-6 h-6 text-indigo-500 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    {studyFileName || 'Click to select study document file'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {studyFileSize ? `Size: ${studyFileSize}` : 'Accepts PDF, DOCX, ZIP, Markdown'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.zip,.py,.ipynb"
                    className="hidden"
                    onChange={handleStudyFileSelect}
                  />
                </label>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  High-Yield Key Exam Points (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Byzantine fault tolerance, Leader election algorithm, Log replication"
                  value={newStudy.keyPointsInput}
                  onChange={(e) => setNewStudy({ ...newStudy, keyPointsInput: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Material Overview & Chapter Syllabus
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of course modules covered in this document..."
                  value={newStudy.description}
                  onChange={(e) => setNewStudy({ ...newStudy, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStudyUploadOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Upload Study Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: CLUB UPLOAD MODAL (Strictly Club Category Restricted)
         ========================================================================= */}
      {isClubUploadOpen && (
        <div
          id="club-upload-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs overflow-y-auto animate-in fade-in"
          onClick={() => setIsClubUploadOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl border border-pastel-mint shadow-2xl p-6 sm:p-8 space-y-5 my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pastel-mint text-emerald-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  Category: Clubs & Societies Only
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  Register Campus Club & Student Society
                </h3>
                <p className="text-xs text-slate-500">
                  This registration form accepts only club and society profiles. Events and academic study materials cannot be registered here.
                </p>
              </div>

              <button
                onClick={() => setIsClubUploadOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClubUploadSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Club / Society Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chronova Autonomous Robotics Guild"
                    value={newClub.name}
                    onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Guild Category (Clubs Only)
                  </label>
                  <select
                    value={newClub.category}
                    onChange={(e) => setNewClub({ ...newClub, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="Technical Guild">Technical Guild</option>
                    <option value="AI & Robotics Society">AI & Robotics Society</option>
                    <option value="Open Source Chapter">Open Source Chapter</option>
                    <option value="Competitive Programming Guild">Competitive Programming Guild</option>
                    <option value="Design & Creative Circle">Design & Creative Circle</option>
                    <option value="Cybersecurity Syndicate">Cybersecurity Syndicate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Meeting Schedule & Cadence *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Every Wednesday at 4:30 PM"
                    value={newClub.meetingTime}
                    onChange={(e) => setNewClub({ ...newClub, meetingTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Meeting Room / Lab Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Turing Innovation Lab 3, Block C"
                    value={newClub.location}
                    onChange={(e) => setNewClub({ ...newClub, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Student Lead Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Patel"
                    value={newClub.leadName}
                    onChange={(e) => setNewClub({ ...newClub, leadName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="club@chronova.edu"
                    value={newClub.email}
                    onChange={(e) => setNewClub({ ...newClub, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Initial Members Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newClub.currentMembers}
                    onChange={(e) => setNewClub({ ...newClub, currentMembers: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Unique Attendance QR Token *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CHRON-CLUB-ROBOTICS-01"
                    value={newClub.qrToken}
                    onChange={(e) => setNewClub({ ...newClub, qrToken: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Recruitment Status
                  </label>
                  <select
                    value={newClub.recruiting ? 'open' : 'closed'}
                    onChange={(e) => setNewClub({ ...newClub, recruiting: e.target.value === 'open' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="open">Open for New Applications</option>
                    <option value="closed">Closed / Invitation Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Club Mission & Core Objectives *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Focus areas, hardware/software projects, weekly workshops..."
                  value={newClub.description}
                  onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClubUploadOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Register Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Resolution Modal */}
      {activeFeedbackModal && (
        <div
          id="admin-resolution-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs"
          onClick={() => setActiveFeedbackModal(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                {activeFeedbackModal.type} Resolution
              </span>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {activeFeedbackModal.subject}
              </h3>
              <p className="text-xs text-slate-500">
                From: {activeFeedbackModal.studentName} ({activeFeedbackModal.studentEmail})
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 italic">
              "{activeFeedbackModal.message}"
            </div>

            <form onSubmit={handleSaveFeedbackResolution} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Update Resolution Status
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as EventFeedback['status'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Official Admin Response *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the corrective action taken or resolution details..."
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFeedbackModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Save & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
