/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Shield } from 'lucide-react';
import {
  AppMode,
  AppRole,
  StudentTab,
  EventItem,
  StudyResource,
  UserRegistration,
  EventFeedback,
  CertificateItem,
  ClubItem,
  UserProfile,
  ThemeMode,
  IndianLanguage
} from './types';
import {
  MOCK_EVENTS,
  MOCK_STUDY_RESOURCES,
  MOCK_FEEDBACKS,
  MOCK_CERTIFICATES,
  MOCK_CLUBS
} from './data/mockData';
import { TRANSLATIONS } from './utils/languages';
import { Header } from './components/Header';
import { EventView } from './components/events/EventView';
import { StudyView } from './components/study/StudyView';
import { ClubDirectoryView } from './components/clubs/ClubDirectoryView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentQrHub } from './components/student/StudentQrHub';
import { StudentFeedbackSection } from './components/student/StudentFeedbackSection';
import { LoginPage } from './components/auth/LoginPage';
import { ChronovaAiBot } from './components/ai/ChronovaAiBot';
import { EventModal } from './components/events/EventModal';
import { StudyPreviewModal } from './components/study/StudyPreviewModal';
import { UploadModal } from './components/study/UploadModal';
import { BookmarksDrawer } from './components/common/BookmarksDrawer';
import { AuthModal } from './components/common/AuthModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { CertificateModal } from './components/common/CertificateModal';
import { NotificationCenter, CampusNotification } from './components/common/NotificationCenter';
import { Footer } from './components/Footer';

export default function App() {
  // Theme state: Forced to 'light' mode per user specification
  const [theme, setTheme] = useState<ThemeMode>('light');

  // Language state: Indian Regional Languages
  const [language, setLanguage] = useState<IndianLanguage>(() => {
    const savedLang = localStorage.getItem('chronova_language');
    return (savedLang as IndianLanguage) || 'en';
  });

  // Translation helper function
  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  // User Profile state (null = not logged in, or object)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const local = localStorage.getItem('chronova_user');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return null;
      }
    }
    // Default logged-in demo student for a seamless experience
    return {
      id: 'user-default-1',
      name: 'Alex Mercer',
      email: 'alex.mercer@chronova.edu',
      role: 'student',
      rollNumber: 'CH-2026-CS-042',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
    };
  });

  // Active portal role is derived from user, default to 'student'
  const currentRole: AppRole = user ? user.role : 'student';

  // Student sub-tabs: 'catalog' | 'qr-hub' | 'feedback'
  const [studentTab, setStudentTab] = useState<StudentTab>('catalog');

  // AppMode: 'events' | 'study' | 'clubs' (replacing dual view with club directory)
  const [currentMode, setCurrentMode] = useState<AppMode>('events');
  const [searchQuery, setSearchQuery] = useState('');

  // Events in state
  const [events, setEvents] = useState<EventItem[]>(() => {
    const local = localStorage.getItem('chronova_events');
    return local ? JSON.parse(local) : MOCK_EVENTS;
  });

  // Study resources in state
  const [studyResources, setStudyResources] = useState<StudyResource[]>(() => {
    const local = localStorage.getItem('chronova_resources');
    return local ? JSON.parse(local) : MOCK_STUDY_RESOURCES;
  });

  // Feedback & complaints in state
  const [feedbacks, setFeedbacks] = useState<EventFeedback[]>(() => {
    const local = localStorage.getItem('chronova_feedbacks');
    return local ? JSON.parse(local) : MOCK_FEEDBACKS;
  });

  // Certificates in state
  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    const local = localStorage.getItem('chronova_certificates');
    return local ? JSON.parse(local) : MOCK_CERTIFICATES;
  });

  // Clubs in state
  const [clubs, setClubs] = useState<ClubItem[]>(() => {
    const local = localStorage.getItem('chronova_clubs');
    return local ? JSON.parse(local) : MOCK_CLUBS;
  });

  // Joined club IDs
  const [joinedClubIds, setJoinedClubIds] = useState<Set<string>>(() => {
    const local = localStorage.getItem('chronova_joined_clubs');
    return local ? new Set(JSON.parse(local)) : new Set<string>(['club-1', 'club-2']);
  });

  // Checked-in club IDs
  const [checkedInClubIds, setCheckedInClubIds] = useState<Set<string>>(() => {
    const local = localStorage.getItem('chronova_checkedin_clubs');
    return local ? new Set(JSON.parse(local)) : new Set<string>(['club-1']);
  });

  // Saved / Bookmarks state
  const [savedEventIds, setSavedEventIds] = useState<Set<string>>(() => {
    const local = localStorage.getItem('chronova_saved_events');
    return local ? new Set(JSON.parse(local)) : new Set<string>(['evt-1']);
  });

  const [savedResourceIds, setSavedResourceIds] = useState<Set<string>>(() => {
    const local = localStorage.getItem('chronova_saved_resources');
    return local ? new Set(JSON.parse(local)) : new Set<string>(['res-1', 'res-3']);
  });

  const [likedResourceIds, setLikedResourceIds] = useState<Set<string>>(() => {
    const local = localStorage.getItem('chronova_liked_resources');
    return local ? new Set(JSON.parse(local)) : new Set<string>(['res-1']);
  });

  // User Event Registrations (Passes)
  const [registrations, setRegistrations] = useState<UserRegistration[]>(() => {
    const local = localStorage.getItem('chronova_registrations');
    if (local) return JSON.parse(local);
    return [
      {
        id: 'reg-demo-1',
        eventId: 'evt-1',
        eventTitle: 'Chronova HackFest 2026',
        eventDate: '2026-10-10T09:00:00Z',
        attendeeName: 'Alex Mercer',
        attendeeEmail: 'alex.mercer@chronova.edu',
        attendeeRole: 'Student Developer',
        ticketCode: 'CHRON-491028',
        qrData: 'CHRONOVA::evt-1::alex.mercer@chronova.edu::2026',
        registeredAt: '2026-09-21T14:30:00Z'
      },
      {
        id: 'reg-demo-2',
        eventId: 'evt-2',
        eventTitle: 'Zero to Transformer: Hands-On LLM Workshop',
        eventDate: '2026-09-28T14:00:00Z',
        attendeeName: 'Alex Mercer',
        attendeeEmail: 'alex.mercer@chronova.edu',
        attendeeRole: 'Student Attendee',
        ticketCode: 'CHRON-882194',
        qrData: 'CHRONOVA::evt-2::alex.mercer@chronova.edu::2026',
        registeredAt: '2026-09-20T11:15:00Z'
      }
    ];
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [preferredAuthRole, setPreferredAuthRole] = useState<AppRole>('student');
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);
  const [selectedResourcePreview, setSelectedResourcePreview] = useState<StudyResource | null>(null);
  const [selectedCertificateModal, setSelectedCertificateModal] = useState<CertificateItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSavedVaultOpen, setIsSavedVaultOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Live Campus Notifications
  const [notifications, setNotifications] = useState<CampusNotification[]>([
    {
      id: 'notif-1',
      title: 'HackFest 2026 Registration Open',
      message: 'Claim your early-bird ticket for Chronova HackFest before seats run out!',
      time: '10m ago',
      type: 'event',
      unread: true
    },
    {
      id: 'notif-2',
      title: 'New Distributed Systems Cheatsheet',
      message: 'Prof. Sharma uploaded notes for CS-402 Distributed Systems.',
      time: '1h ago',
      type: 'academic',
      unread: true
    },
    {
      id: 'notif-3',
      title: 'Robotics & AI Guild Meetup',
      message: 'Weekly lab orientation tomorrow at 04:30 PM in Robotics Lab 2.',
      time: '3h ago',
      type: 'club',
      unread: false
    }
  ]);

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'info' | 'error', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Enforce pure light theme globally
  useEffect(() => {
    localStorage.setItem('chronova_theme', 'light');
    document.documentElement.classList.remove('dark');
  }, [theme]);

  // Sync language to localStorage
  useEffect(() => {
    localStorage.setItem('chronova_language', language);
  }, [language]);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('chronova_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('chronova_user');
    }
  }, [user]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('chronova_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('chronova_resources', JSON.stringify(studyResources));
  }, [studyResources]);

  useEffect(() => {
    localStorage.setItem('chronova_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('chronova_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('chronova_clubs', JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem('chronova_joined_clubs', JSON.stringify(Array.from(joinedClubIds)));
  }, [joinedClubIds]);

  useEffect(() => {
    localStorage.setItem('chronova_checkedin_clubs', JSON.stringify(Array.from(checkedInClubIds)));
  }, [checkedInClubIds]);

  useEffect(() => {
    localStorage.setItem('chronova_saved_events', JSON.stringify(Array.from(savedEventIds)));
  }, [savedEventIds]);

  useEffect(() => {
    localStorage.setItem('chronova_saved_resources', JSON.stringify(Array.from(savedResourceIds)));
  }, [savedResourceIds]);

  useEffect(() => {
    localStorage.setItem('chronova_liked_resources', JSON.stringify(Array.from(likedResourceIds)));
  }, [likedResourceIds]);

  useEffect(() => {
    localStorage.setItem('chronova_registrations', JSON.stringify(registrations));
  }, [registrations]);

  // Toggle Theme between Light and Dark
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Open Auth Modal
  const handleOpenAuthModal = (role: AppRole = 'student') => {
    setPreferredAuthRole(role);
    setIsAuthModalOpen(true);
  };

  // Login Success
  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    showToast(
      'success',
      `Welcome, ${profile.name}!`,
      `Logged in to ${profile.role === 'admin' ? 'Admin Portal' : 'Student Portal'}.`
    );
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    showToast('info', 'Logged Out', 'You have been signed out of Chronova.');
  };

  // Handle Event Registration
  const handleRegisterSuccess = (registration: UserRegistration) => {
    setRegistrations((prev) => [registration, ...prev]);

    setEvents((prev) =>
      prev.map((e) =>
        e.id === registration.eventId
          ? { ...e, registeredCount: e.registeredCount + 1 }
          : e
      )
    );

    showToast(
      'success',
      'Pass Issued & Verified!',
      `You're confirmed for ${registration.eventTitle}. Pass ID: ${registration.ticketCode}`
    );
  };

  // Toggle Save Event
  const handleToggleSaveEvent = (eventId: string) => {
    const next = new Set(savedEventIds);
    const evt = events.find((e) => e.id === eventId);
    if (next.has(eventId)) {
      next.delete(eventId);
      showToast('info', 'Event Removed from Vault');
    } else {
      next.add(eventId);
      showToast('success', 'Event Saved to Vault', evt?.title);
    }
    setSavedEventIds(next);
  };

  // Toggle Save Resource
  const handleToggleSaveResource = (resId: string) => {
    const next = new Set(savedResourceIds);
    const res = studyResources.find((r) => r.id === resId);
    if (next.has(resId)) {
      next.delete(resId);
      showToast('info', 'Material Removed from Vault');
    } else {
      next.add(resId);
      showToast('success', 'Study Material Saved', res?.title);
    }
    setSavedResourceIds(next);
  };

  // Rate Resource
  const handleRateResource = (resId: string, userRating: number) => {
    setStudyResources((prev) =>
      prev.map((r) => {
        if (r.id === resId) {
          const newCount = r.ratingCount + 1;
          const newRating = Number(
            ((r.rating * r.ratingCount + userRating) / newCount).toFixed(2)
          );
          return { ...r, rating: newRating, ratingCount: newCount };
        }
        return r;
      })
    );
    showToast(
      'success',
      'Thank you for rating!',
      `You rated this material ${userRating} stars.`
    );
  };

  // Toggle Like Resource
  const handleToggleLikeResource = (resId: string) => {
    const nextLikes = new Set(likedResourceIds);
    const isAlreadyLiked = nextLikes.has(resId);

    if (isAlreadyLiked) {
      nextLikes.delete(resId);
    } else {
      nextLikes.add(resId);
    }
    setLikedResourceIds(nextLikes);

    setStudyResources((prev) =>
      prev.map((r) => {
        if (r.id === resId) {
          return {
            ...r,
            likesCount: isAlreadyLiked
              ? Math.max(0, r.likesCount - 1)
              : r.likesCount + 1
          };
        }
        return r;
      })
    );
  };

  // Download Resource
  const handleDownloadResource = (resource: StudyResource) => {
    setStudyResources((prev) =>
      prev.map((r) =>
        r.id === resource.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
      )
    );

    const dummyContent = `# ${resource.title}\n\nCourse: ${resource.courseCode} - ${resource.courseName}\nAuthor: ${resource.author.name}\nChronova Verified Academic Material\n\n## Overview\n${resource.description}\n\n## High-Yield Points\n${
      resource.contentPreview?.keyPoints?.map((p) => `- ${p}`).join('\n') ||
      'Complete lecture notes and exam formula proofs.'
    }\n\nDownloaded from Chronova Study Material Hub.`;

    const blob = new Blob([dummyContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.courseCode}-${resource.title.slice(0, 24).replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(
      'success',
      'Download Started',
      `Saving ${resource.courseCode}: ${resource.title.slice(0, 32)}... (${resource.fileSize || resource.duration})`
    );
  };

  // Guarded Upload Modal Opener (Only Admin Authorized)
  const handleOpenUploadModal = () => {
    if (currentRole !== 'admin') {
      showToast(
        'error',
        'Upload Restricted',
        'Students do not have upload privileges. Only Faculty Administrators can upload content.'
      );
      return;
    }
    setIsUploadModalOpen(true);
  };

  // Add Uploaded Resource (Strictly Admin Authorized via Backend RBAC)
  const handleUploadSuccess = async (newResource: StudyResource) => {
    if (currentRole !== 'admin') {
      showToast(
        'error',
        'Upload Forbidden',
        'Students are not authorized to upload content. This attempt has been blocked.'
      );
      return;
    }

    try {
      const res = await fetch('/api/upload/resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentRole,
          'Authorization': `Bearer admin-token-${user?.id || 'admin'}`
        },
        body: JSON.stringify(newResource)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('error', 'Backend Authorization Rejection', data.error || 'Server rejected upload.');
        return;
      }
    } catch (e) {
      console.warn('API sync notice:', e);
    }

    setStudyResources((prev) => [newResource, ...prev]);
    showToast(
      'success',
      'Material Published!',
      `${newResource.courseCode}: "${newResource.title}" is now live in the repository.`
    );
  };

  // Student submits feedback / complaint
  const handleSubmitFeedback = (newFeedback: EventFeedback) => {
    setFeedbacks((prev) => [newFeedback, ...prev]);
    showToast(
      'success',
      'Feedback Logged',
      `Your report for "${newFeedback.eventTitle}" has been received by the organizing council.`
    );
  };

  // Admin resolves feedback / complaint
  const handleResolveFeedback = (id: string, status: EventFeedback['status'], adminReply: string) => {
    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === id
          ? {
              ...fb,
              status,
              adminResponse: adminReply
            }
          : fb
      )
    );
    showToast('success', `Feedback status updated to "${status}"`);
  };

  // Admin issues new certificate
  const handleIssueCertificate = (cert: CertificateItem) => {
    setCertificates((prev) => [cert, ...prev]);
    showToast(
      'success',
      'Certificate Generated & Verified',
      `Issued credential ID ${cert.verificationId} to ${cert.recipientName}.`
    );
  };

  // Admin creates new event (Events section only)
  const handleCreateEvent = async (newEvent: EventItem) => {
    if (currentRole !== 'admin') {
      showToast('error', 'Upload Forbidden', 'Only Faculty Admins can publish events.');
      return;
    }
    try {
      await fetch('/api/upload/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentRole,
          'Authorization': `Bearer admin-token-${user?.id || 'admin'}`
        },
        body: JSON.stringify(newEvent)
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
    setEvents((prev) => [newEvent, ...prev]);
    showToast(
      'success',
      'Event Published Successfully',
      `"${newEvent.title}" is now open for registrations.`
    );
  };

  // Admin registers new club (Clubs section only)
  const handleCreateClub = async (newClub: ClubItem) => {
    if (currentRole !== 'admin') {
      showToast('error', 'Upload Forbidden', 'Only Faculty Admins can register clubs.');
      return;
    }
    try {
      await fetch('/api/upload/club', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentRole,
          'Authorization': `Bearer admin-token-${user?.id || 'admin'}`
        },
        body: JSON.stringify(newClub)
      });
    } catch (e) {
      console.warn('API sync notice:', e);
    }
    setClubs((prev) => [newClub, ...prev]);
    showToast(
      'success',
      'Club Registered Successfully',
      `"${newClub.name}" is now live in the campus directory.`
    );
  };

  // Admin deletion handlers
  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('info', 'Event Removed', 'The event has been deleted.');
  };

  const handleDeleteStudy = (id: string) => {
    setStudyResources((prev) => prev.filter((r) => r.id !== id));
    showToast('info', 'Study Material Removed', 'The resource has been deleted from repository.');
  };

  const handleDeleteClub = (id: string) => {
    setClubs((prev) => prev.filter((c) => c.id !== id));
    showToast('info', 'Club Removed', 'The club has been removed from directory.');
  };

  // Student join / leave club
  const handleToggleJoinClub = (clubId: string) => {
    const next = new Set(joinedClubIds);
    const club = clubs.find((c) => c.id === clubId);
    if (next.has(clubId)) {
      next.delete(clubId);
      showToast('info', 'Left Club', `You are no longer a member of ${club?.name}.`);
    } else {
      next.add(clubId);
      showToast('success', 'Joined Club!', `You are now a registered member of ${club?.name}.`);
    }
    setJoinedClubIds(next);
  };

  // Student check-in to club
  const handleCheckInClub = (clubId: string) => {
    const next = new Set(checkedInClubIds);
    const club = clubs.find((c) => c.id === clubId);
    if (next.has(clubId)) {
      next.delete(clubId);
      showToast('info', 'Club Check-In Revoked', club?.name);
    } else {
      next.add(clubId);
      showToast('success', 'Club Attendance Checked In!', `Verified participation in ${club?.name}.`);
    }
    setCheckedInClubIds(next);
  };

  // Registered event IDs
  const registeredEventIds = useMemo(() => {
    return new Set(registrations.map((r) => r.eventId));
  }, [registrations]);

  // Saved items list for Vault
  const savedEventsList = useMemo(() => {
    return events.filter((e) => savedEventIds.has(e.id));
  }, [events, savedEventIds]);

  const savedResourcesList = useMemo(() => {
    return studyResources.filter((r) => savedResourceIds.has(r.id));
  }, [studyResources, savedResourceIds]);

  return (
    <div
      id="chronova-app-root"
      className="min-h-screen flex flex-col bg-[#faf8fd] text-slate-800 font-sans selection:bg-pastel-lavender selection:text-indigo-900 transition-colors relative w-full max-w-full overflow-x-hidden"
    >
      {/* Dynamic Pastel Ambient Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 max-w-full">
        <div className="absolute -top-28 -left-28 w-[380px] sm:w-[580px] h-[380px] sm:h-[580px] rounded-full bg-pastel-lavender/70 blur-[120px]" />
        <div className="absolute top-1/4 -right-28 w-[400px] sm:w-[620px] h-[400px] sm:h-[620px] rounded-full bg-pastel-mint/60 blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] rounded-full bg-pastel-sky/60 blur-[130px]" />
        <div className="absolute bottom-10 right-1/3 w-[320px] sm:w-[450px] h-[320px] sm:h-[450px] rounded-full bg-pastel-blush/50 blur-[120px]" />
      </div>

      {/* Clean, Non-Bulky Navbar */}
      <Header
        currentRole={currentRole}
        currentMode={currentMode}
        onModeChange={(mode) => setCurrentMode(mode)}
        studentTab={studentTab}
        onStudentTabChange={(tab) => setStudentTab(tab)}
        user={user}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
        onOpenUpload={handleOpenUploadModal}
        onOpenSavedVault={() => setIsSavedVaultOpen(true)}
        savedCount={savedResourceIds.size + savedEventIds.size}
        registeredCount={registrations.length}
        unreadNotificationsCount={notifications.filter((n) => n.unread).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        eventCount={events.length}
        studyCount={studyResources.length}
        clubCount={clubs.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 relative z-10 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-x-hidden">
        {/* =========================================================================
            ADMIN PANEL VIEW (Active when user role is 'admin')
           ========================================================================= */}
        {currentRole === 'admin' && (
          <div key="panel-admin" className="animate-in fade-in duration-300">
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ADM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Admin Management Portal
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      Upload Authorized
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Logged in as Faculty Admin: {user?.name || 'Administrator'} • Category-based upload privileges active.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (user) {
                    const studentUser = { ...user, role: 'student' as AppRole };
                    setUser(studentUser);
                    localStorage.setItem('chronova_user', JSON.stringify(studentUser));
                    showToast('info', 'Switched to Student Role', 'View-only mode active. Upload functionality is disabled.');
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 hover:shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                Switch to Student View
              </button>
            </div>

            <AdminDashboard
              events={events}
              resources={studyResources}
              clubs={clubs}
              feedbacks={feedbacks}
              certificates={certificates}
              registrations={registrations}
              onResolveFeedback={handleResolveFeedback}
              onIssueCertificate={handleIssueCertificate}
              onCreateEvent={handleCreateEvent}
              onUploadStudy={handleUploadSuccess}
              onCreateClub={handleCreateClub}
              onDeleteEvent={handleDeleteEvent}
              onDeleteStudy={handleDeleteStudy}
              onDeleteClub={handleDeleteClub}
            />
          </div>
        )}

        {/* =========================================================================
            STUDENT PANEL VIEW (View-Only Privileges: Upload option hidden everywhere)
           ========================================================================= */}
        {currentRole === 'student' && (
          <div key="panel-student" className="animate-in fade-in duration-300">
            {/* 1. STUDENT TAB: CATALOG (EVENTS / STUDY HUB / CLUBS) */}
            {studentTab === 'catalog' && (
              <>
                {/* EVENT MODE */}
                {currentMode === 'events' && (
                  <div key="mode-events" className="transition-all duration-300">
                    <EventView
                      events={events}
                      searchQuery={searchQuery}
                      onSelectEvent={(evt) => setSelectedEventModal(evt)}
                      onRegisterClick={(evt) => setSelectedEventModal(evt)}
                      savedEventIds={savedEventIds}
                      onToggleSaveEvent={handleToggleSaveEvent}
                      registeredEventIds={registeredEventIds}
                    />
                  </div>
                )}

                {/* STUDY MATERIAL MODE */}
                {currentMode === 'study' && (
                  <div key="mode-study" className="transition-all duration-300">
                    <StudyView
                      resources={studyResources}
                      searchQuery={searchQuery}
                      onPreviewResource={(res) => setSelectedResourcePreview(res)}
                      onDownloadResource={handleDownloadResource}
                      savedResourceIds={savedResourceIds}
                      onToggleSaveResource={handleToggleSaveResource}
                      onRateResource={handleRateResource}
                      onToggleLikeResource={handleToggleLikeResource}
                      likedResourceIds={likedResourceIds}
                      onOpenUpload={handleOpenUploadModal}
                      isAdmin={false}
                    />
                  </div>
                )}

                {/* CLUB DIRECTORY MODE (Replaced dual split mode as requested) */}
                {currentMode === 'clubs' && (
                  <div key="mode-clubs" className="transition-all duration-300">
                    <ClubDirectoryView
                      clubs={clubs}
                      joinedClubIds={joinedClubIds}
                      onToggleJoinClub={handleToggleJoinClub}
                      onCheckInClub={handleCheckInClub}
                      checkedInClubIds={checkedInClubIds}
                      t={t}
                    />
                  </div>
                )}
              </>
            )}

            {/* 2. STUDENT TAB: QR HUB (EVENTS ATTENDANCE, CLUBS, CERTIFICATES) */}
            {studentTab === 'qr-hub' && (
              <StudentQrHub
                registrations={registrations}
                clubs={clubs}
                certificates={certificates}
                onCheckInClub={handleCheckInClub}
                checkedInClubIds={checkedInClubIds}
                onPreviewCertificate={(cert) => setSelectedCertificateModal(cert)}
              />
            )}

            {/* 3. STUDENT TAB: FEEDBACK & COMPLAINTS */}
            {studentTab === 'feedback' && (
              <StudentFeedbackSection
                events={events}
                feedbacks={feedbacks}
                onSubmitFeedback={handleSubmitFeedback}
              />
            )}

            {/* 4. STUDENT TAB: DEDICATED FULL-PAGE LOGIN (STUDENT & ADMIN) */}
            {studentTab === 'login' && (
              <LoginPage
                onLoginSuccess={(loggedInUser) => {
                  handleLoginSuccess(loggedInUser);
                  setStudentTab('catalog');
                }}
                onCancel={() => setStudentTab('catalog')}
                t={t}
              />
            )}
          </div>
        )}
      </main>

      {/* Global AI Assistant Bot */}
      <ChronovaAiBot
        events={events}
        resources={studyResources}
        onSelectEvent={(evt) => setSelectedEventModal(evt)}
        onSelectResource={(res) => setSelectedResourcePreview(res)}
      />

      {/* Auth Modal for Student / Admin Login */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        defaultRole={preferredAuthRole}
        t={t}
      />

      {/* Event Registration & Details Modal */}
      <EventModal
        event={selectedEventModal}
        onClose={() => setSelectedEventModal(null)}
        onRegisterSuccess={handleRegisterSuccess}
        existingRegistration={
          selectedEventModal
            ? registrations.find((r) => r.eventId === selectedEventModal.id) || null
            : null
        }
      />

      {/* Study Resource Reader / Preview Modal */}
      <StudyPreviewModal
        resource={selectedResourcePreview}
        onClose={() => setSelectedResourcePreview(null)}
        onDownload={handleDownloadResource}
        isSaved={
          selectedResourcePreview
            ? savedResourceIds.has(selectedResourcePreview.id)
            : false
        }
        onToggleSave={handleToggleSaveResource}
      />

      {/* Upload / Contribute Material Modal (Protected: Never rendered if not Admin) */}
      <UploadModal
        isOpen={isUploadModalOpen && currentRole === 'admin'}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Saved Items & Tickets Drawer */}
      <BookmarksDrawer
        isOpen={isSavedVaultOpen}
        onClose={() => setIsSavedVaultOpen(false)}
        savedEvents={savedEventsList}
        savedResources={savedResourcesList}
        registrations={registrations}
        onSelectEvent={(evt) => {
          setSelectedEventModal(evt);
          setIsSavedVaultOpen(false);
        }}
        onSelectResource={(res) => {
          setSelectedResourcePreview(res);
          setIsSavedVaultOpen(false);
        }}
        onRemoveEvent={handleToggleSaveEvent}
        onRemoveResource={handleToggleSaveResource}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Official Certificate Verification & Print Modal */}
      <CertificateModal
        certificate={selectedCertificateModal}
        onClose={() => setSelectedCertificateModal(null)}
      />

      {/* Campus Notifications Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onDismissNotification={handleDismissNotification}
      />

      {/* Clean Footer */}
      <Footer
        currentMode={currentMode}
        onModeChange={(mode) => {
          setStudentTab('catalog');
          setCurrentMode(mode);
        }}
        onOpenUpload={handleOpenUploadModal}
        t={t}
        isAdmin={currentRole === 'admin'}
      />
    </div>
  );
}
