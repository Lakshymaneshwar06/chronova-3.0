import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bookmark,
  Bell,
  Search,
  CheckCircle2,
  Calendar,
  FileText,
  X,
  User,
  Shield,
  GraduationCap,
  QrCode,
  MessageSquare,
  ChevronDown,
  Users,
  LogIn,
  LogOut,
  Menu,
  Compass
} from 'lucide-react';
import { AppMode, AppRole, StudentTab, UserProfile, ThemeMode, IndianLanguage } from '../types';
import { ChronovaLogo } from './common/ChronovaLogo';

interface CleanHeaderProps {
  currentRole: AppRole;
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  studentTab: StudentTab;
  onStudentTabChange: (tab: StudentTab) => void;
  user: UserProfile | null;
  onOpenAuthModal: (preferredRole?: AppRole) => void;
  onLogout: () => void;
  onOpenUpload: () => void;
  onOpenSavedVault: () => void;
  savedCount: number;
  registeredCount: number;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  eventCount: number;
  studyCount: number;
  clubCount: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  language: IndianLanguage;
  onLanguageChange: (lang: IndianLanguage) => void;
  t: (key: string) => string;
}

export const Header: React.FC<CleanHeaderProps> = ({
  currentRole,
  currentMode,
  onModeChange,
  studentTab,
  onStudentTabChange,
  user,
  onOpenAuthModal,
  onLogout,
  onOpenUpload,
  onOpenSavedVault,
  savedCount,
  registeredCount,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  searchQuery,
  onSearchChange,
  eventCount,
  studyCount,
  clubCount,
  theme,
  onToggleTheme,
  language,
  onLanguageChange,
  t
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 border-b border-pastel-lavender/60 transition-colors shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 min-w-0">
          {/* 1. Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0 min-w-0">
            <ChronovaLogo
              size="md"
              variant="full"
              onClick={() => {
                onStudentTabChange('catalog');
                onModeChange('events');
              }}
            />

            {/* Main Navigation Links:
                - In Student Panel: Shows Events, Study Hub, Club Directory, QR Hub, Feedback (NO Portal Login)
                - In Admin Panel: Events, Study Hub, Club Directory and Portal Login are REMOVED per user request
            */}
            {currentRole === 'student' ? (
              <nav className="hidden md:flex items-center gap-1">
                <button
                  id="nav-events-btn"
                  onClick={() => {
                    onStudentTabChange('catalog');
                    onModeChange('events');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    studentTab === 'catalog' && currentMode === 'events'
                      ? 'bg-pastel-lavender text-indigo-900 font-bold border border-pastel-lavender shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-pastel-lavender/40'
                  }`}
                >
                  <span>{t('events')}</span>
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-white/80 text-slate-700">
                    {eventCount}
                  </span>
                </button>

                <button
                  id="nav-study-btn"
                  onClick={() => {
                    onStudentTabChange('catalog');
                    onModeChange('study');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    studentTab === 'catalog' && currentMode === 'study'
                      ? 'bg-pastel-sky text-sky-900 font-bold border border-pastel-sky shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-pastel-sky/40'
                  }`}
                >
                  <span>{t('studyHub')}</span>
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-white/80 text-slate-700">
                    {studyCount}
                  </span>
                </button>

                <button
                  id="nav-clubs-btn"
                  onClick={() => {
                    onStudentTabChange('catalog');
                    onModeChange('clubs');
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    studentTab === 'catalog' && currentMode === 'clubs'
                      ? 'bg-pastel-peach text-amber-900 font-bold border border-pastel-peach shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-pastel-peach/40'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t('clubs')}</span>
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-white/80 text-slate-700">
                    {clubCount}
                  </span>
                </button>

                <button
                  id="nav-qr-btn"
                  onClick={() => onStudentTabChange('qr-hub')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    studentTab === 'qr-hub'
                      ? 'bg-pastel-mint text-emerald-800 font-bold border border-pastel-mint shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-pastel-mint/40'
                  }`}
                >
                  {t('qrHub')}
                </button>

                <button
                  id="nav-feedback-btn"
                  onClick={() => onStudentTabChange('feedback')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    studentTab === 'feedback'
                      ? 'bg-pastel-rose text-rose-800 font-bold border border-pastel-rose shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-pastel-rose/40'
                  }`}
                >
                  {t('feedback')}
                </button>
              </nav>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold shadow-2xs">
                  <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Faculty Admin Console</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Middle Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-pastel-lavender/30 border border-pastel-lavender/70 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-medium transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3. Right: Utility Controls (Vault, Notifications, Login / User Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Mobile Search button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Bookmarks / Vault */}
            <button
              id="header-vault-btn"
              onClick={onOpenSavedVault}
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-indigo-600 bg-slate-100 border border-slate-200 transition-colors cursor-pointer shrink-0"
              title={t('myVault')}
            >
              <Bookmark className="w-4 h-4 text-indigo-600" />
              {(savedCount > 0 || registeredCount > 0) && (
                 <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white font-mono shadow-xs">
                   {savedCount + registeredCount}
                 </span>
              )}
            </button>

            {/* Live Campus Notifications Bell */}
            <button
              id="header-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-indigo-600 bg-slate-100 border border-slate-200 transition-colors cursor-pointer shrink-0"
              title="Campus Live Updates"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white font-mono animate-pulse shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Authentication Button OR User Profile Menu */}
            {!user ? (
              <button
                id="header-login-btn"
                onClick={() => onOpenAuthModal()}
                className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t('login')}</span>
              </button>
            ) : (
              <div className="relative" ref={userRef}>
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 pr-1">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {user.role}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 mr-1" />
                </button>

                {showUserMenu && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs"
                  >
                    <div className="pb-2 mb-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-indigo-600 font-bold">
                        {user.role === 'admin' ? 'Faculty Admin' : `ID: ${user.rollNumber || 'CH-2026'}`}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {user.role === 'admin' ? (
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-800 text-[11px] font-medium mb-1">
                          ✓ Admin Access Granted
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            onOpenAuthModal('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-between"
                        >
                          <span>Switch to Admin Panel</span>
                          <Shield className="w-3.5 h-3.5 text-indigo-600" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onOpenSavedVault();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                      >
                        {t('myVault')}
                      </button>

                      {/* Upload / Contribute Material option strictly restricted to Admin only */}
                      {user.role === 'admin' && (
                        <button
                          id="header-admin-upload-btn"
                          onClick={() => {
                            onOpenUpload();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 font-bold cursor-pointer"
                        >
                          + Upload Material (Admin)
                        </button>
                      )}

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            onLogout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {showMobileSearch && (
          <div className="lg:hidden pb-3 pt-1 border-t border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2.5 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation bar:
            - In Student Panel: Shows Events, Study Hub, Clubs, QR Hub, Feedback (NO Login button)
            - In Admin Panel: Events, Study Hub, Club Directory and Login are completely removed
        */}
        {currentRole === 'student' ? (
          <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs overflow-x-auto scrollbar-none">
            <button
              onClick={() => {
                onStudentTabChange('catalog');
                onModeChange('events');
              }}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                studentTab === 'catalog' && currentMode === 'events'
                  ? 'text-indigo-600 font-bold bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('events')}
            </button>
            <button
              onClick={() => {
                onStudentTabChange('catalog');
                onModeChange('study');
              }}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                studentTab === 'catalog' && currentMode === 'study'
                  ? 'text-indigo-600 font-bold bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('studyHub')}
            </button>
            <button
              onClick={() => {
                onStudentTabChange('catalog');
                onModeChange('clubs');
              }}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                studentTab === 'catalog' && currentMode === 'clubs'
                  ? 'text-indigo-600 font-bold bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('clubs')}
            </button>
            <button
              onClick={() => onStudentTabChange('qr-hub')}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                studentTab === 'qr-hub'
                  ? 'text-emerald-700 font-bold bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('qrHub')}
            </button>
            <button
              onClick={() => onStudentTabChange('feedback')}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                studentTab === 'feedback'
                  ? 'text-rose-700 font-bold bg-pastel-rose'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('feedback')}
            </button>
          </div>
        ) : (
          <div className="md:hidden flex items-center justify-between px-3.5 py-2 border-t border-amber-200/80 bg-amber-50/70 text-xs">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Faculty Admin Console</span>
            </span>
            <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-200">
              Restricted Controls
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
