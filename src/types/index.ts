export type AppRole = 'student' | 'admin';
export type AppMode = 'events' | 'study' | 'clubs';
export type StudentTab = 'catalog' | 'qr-hub' | 'feedback' | 'login';
export type AdminTab = 'events' | 'study' | 'clubs' | 'analytics' | 'attendance-certs' | 'complaints';

export type IndianLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'pa' | 'ml';
export type ThemeMode = 'light' | 'dark';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  rollNumber?: string;
  department?: string;
  avatar?: string;
}

export type EventCategory = 'all' | 'hackathon' | 'workshop' | 'tech-talk' | 'competition' | 'bootcamp';
export type EventStatus = 'all' | 'upcoming' | 'ongoing' | 'completed';
export type EventFormat = 'in-person' | 'virtual' | 'hybrid';

export interface EventSpeaker {
  name: string;
  role: string;
  company: string;
  avatar: string;
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'hackathon' | 'workshop' | 'tech-talk' | 'competition' | 'bootcamp';
  format: EventFormat;
  venue: string;
  startDate: string; // ISO string
  endDate: string;
  registrationDeadline: string;
  totalSeats: number;
  registeredCount: number;
  price: 'Free' | string;
  prizes?: string;
  bannerImage: string;
  speakers: EventSpeaker[];
  tags: string[];
  featured?: boolean;
  agenda?: { time: string; activity: string }[];
}

export type ResourceType = 'pdf' | 'notes' | 'video' | 'cheatsheet' | 'pyq' | 'code';
export type Department = 'cs' | 'ai' | 'ece' | 'math' | 'cyber' | 'cloud';

export interface StudyResource {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  department: Department;
  semester: number;
  type: ResourceType;
  description: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  fileSize?: string;
  pageCount?: number;
  duration?: string;
  rating: number;
  ratingCount: number;
  downloadCount: number;
  likesCount: number;
  tags: string[];
  lastUpdated: string;
  featured?: boolean;
  contentPreview?: {
    summary: string;
    keyPoints: string[];
    sampleSnippet?: string;
  };
}

export interface UserRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeeRole: string;
  ticketCode: string;
  qrData: string;
  registeredAt: string;
}

export interface ClubItem {
  id: string;
  name: string;
  category: string;
  meetingTime: string;
  location: string;
  currentMembers: number;
  leadName: string;
  qrToken: string;
  icon: string;
  description?: string;
  email?: string;
  tags?: string[];
  coverImage?: string;
  recruiting?: boolean;
}

export interface CertificateItem {
  id: string;
  title: string;
  issueDate: string;
  recipientName: string;
  recipientEmail: string;
  verificationId: string;
  qrCode: string;
  issuer: string;
  grade: string;
  skills: string[];
}

export interface EventFeedback {
  id: string;
  eventId: string;
  eventTitle: string;
  studentName: string;
  studentEmail: string;
  type: 'review' | 'complaint' | 'suggestion';
  rating: number;
  category: 'Organization' | 'Technical Glitch' | 'Speaker Quality' | 'Venue & Refreshments' | 'General';
  subject: string;
  message: string;
  status: 'Pending' | 'Under Review' | 'Resolved';
  adminResponse?: string;
  createdAt: string;
}

export type SpecializationField = 'cs' | 'data-science' | 'ai-ml' | 'engineering' | 'design';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  field?: SpecializationField;
  suggestedPrompts?: string[];
}

