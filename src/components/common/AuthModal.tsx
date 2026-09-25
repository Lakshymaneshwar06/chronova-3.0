import React, { useState } from 'react';
import {
  X,
  Shield,
  GraduationCap,
  LogIn,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AppRole, UserProfile } from '../../types';
import { ChronovaLogo } from './ChronovaLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  defaultRole?: AppRole;
  t: (key: string) => string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultRole = 'student',
  t
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<AppRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      if (!email.includes('@')) {
        setErrorMessage('Please enter a valid academic or personal email address.');
        setIsLoading(false);
        return;
      }

      const displayName = name || (selectedRole === 'admin' ? 'Admin Council' : 'Alex Mercer');
      const profile: UserProfile = {
        id: `user-${Date.now()}`,
        name: displayName,
        email: email,
        role: selectedRole,
        rollNumber: selectedRole === 'student' ? (rollNumber || 'CH-2026-CS-042') : 'ADMIN-FACULTY-01',
        department: department,
        avatar: selectedRole === 'student' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
      };

      onLoginSuccess(profile);
      setIsLoading(false);
      onClose();
    }, 600);
  };

  const handleQuickDemo = (role: AppRole) => {
    const demoUser: UserProfile = role === 'student' 
      ? {
          id: 'user-demo-student',
          name: 'Alex Mercer',
          email: 'alex.mercer@chronova.edu',
          role: 'student',
          rollNumber: 'CH-2026-CS-042',
          department: 'Computer Science',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
        }
      : {
          id: 'user-demo-admin',
          name: 'Dr. Sarah Jenkins',
          email: 'sarah.jenkins@chronova.edu',
          role: 'admin',
          rollNumber: 'FACULTY-CH-801',
          department: 'Academic Council & Dean Office',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
        };

    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/20 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="auth-modal-container"
        className="relative w-full max-w-md rounded-3xl bg-white border border-pastel-sky/60 shadow-2xl overflow-hidden my-6 text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="p-6 pb-4 border-b border-pastel-sky/40 bg-gradient-to-r from-pastel-lavender/40 via-pastel-blush/30 to-pastel-peach/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ChronovaLogo size="sm" variant="mark" />
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {mode === 'login' ? t('login') : t('signup')}
              </h3>
              <p className="text-[11px] text-slate-500">
                {t('selectRolePrompt')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-4">
          {/* Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Your Portal Role *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-pastel-lavender border-indigo-300 text-indigo-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-pastel-lavender/30'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>{t('studentPanel')} Panel</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-pastel-peach border-amber-300 text-amber-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-pastel-peach/30'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>{t('adminPanel')} Panel</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / Organization Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder={selectedRole === 'student' ? 'student@chronova.edu' : 'faculty@chronova.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-[11px] text-rose-600 font-medium">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>
                    {mode === 'login' ? `Sign In as ${selectedRole === 'student' ? 'Student' : 'Admin'}` : 'Create Account'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Instant Logins */}
          <div className="pt-3 border-t border-pastel-sky/40">
            <p className="text-[11px] font-semibold text-slate-500 text-center mb-2">
              Or instantly login with demo profiles:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="flex-1 py-2 px-2.5 rounded-xl bg-pastel-lavender/60 hover:bg-pastel-lavender text-slate-800 text-[11px] font-bold border border-pastel-lavender transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Demo Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="flex-1 py-2 px-2.5 rounded-xl bg-pastel-peach/60 hover:bg-pastel-peach text-slate-800 text-[11px] font-bold border border-pastel-peach transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setErrorMessage('');
              }}
              className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
            >
              {mode === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
