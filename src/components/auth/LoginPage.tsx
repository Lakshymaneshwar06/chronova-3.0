import React, { useState } from 'react';
import {
  GraduationCap,
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Building,
  School,
  IdCard,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { AppRole, UserProfile } from '../../types';
import { ChronovaLogo } from '../common/ChronovaLogo';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onCancel?: () => void;
  t: (key: string) => string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onCancel,
  t
}) => {
  const [selectedRole, setSelectedRole] = useState<AppRole>('student');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid academic email address (e.g. name@chronova.edu)');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Password should be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const displayName = name.trim() || (selectedRole === 'admin' ? 'Faculty Admin' : 'Alex Mercer');
      const profile: UserProfile = {
        id: `user-${Date.now()}`,
        name: displayName,
        email: email.trim(),
        role: selectedRole,
        rollNumber: selectedRole === 'student' ? (rollNumber || 'CH-2026-CS-042') : 'FACULTY-CH-801',
        department: department,
        avatar:
          selectedRole === 'student'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
      };

      onLoginSuccess(profile);
      setIsLoading(false);
    }, 500);
  };

  const handleInstantDemoLogin = (role: AppRole) => {
    const demoProfile: UserProfile =
      role === 'student'
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

    onLoginSuccess(demoProfile);
  };

  return (
    <div
      id="login-page-view"
      className="min-h-[80vh] flex flex-col justify-center items-center py-8 px-4 sm:px-6 animate-in fade-in duration-300"
    >
      {/* Top Welcome Title with Chronova Logo */}
      <div className="text-center max-w-lg mb-8 space-y-3 flex flex-col items-center">
        <ChronovaLogo size="xl" variant="full" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-heading tracking-tight mt-2">
          Campus Gateway Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Sign in to access events, attendance QR passports, course materials, or switch to the faculty admin council.
        </p>
      </div>

      {/* Main Dual Role Auth Card with Soft Pastel Aesthetic */}
      <div className="w-full max-w-xl rounded-3xl bg-white/95 border border-pastel-sky/50 shadow-xl overflow-hidden backdrop-blur-md">
        {/* Soft Pastel Header with Role Selection Tabs */}
        <div className="p-6 bg-gradient-to-r from-pastel-lavender/50 via-pastel-blush/40 to-pastel-peach/40 border-b border-pastel-sky/30">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 text-center">
            Choose Your Portal Access Role
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {/* Student Role Tab */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setErrorMsg('');
              }}
              className={`p-3.5 rounded-2xl border transition-all text-left flex items-start gap-3 cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-white border-pastel-lavender shadow-md ring-2 ring-indigo-200'
                  : 'bg-white/60 border-transparent hover:bg-white/90 text-slate-600'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  selectedRole === 'student'
                    ? 'bg-pastel-lavender text-indigo-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">Student Portal</span>
                  {selectedRole === 'student' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Passports, Study & Clubs
                </p>
              </div>
            </button>

            {/* Admin Role Tab */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setErrorMsg('');
              }}
              className={`p-3.5 rounded-2xl border transition-all text-left flex items-start gap-3 cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-white border-pastel-peach shadow-md ring-2 ring-amber-200'
                  : 'bg-white/60 border-transparent hover:bg-white/90 text-slate-600'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  selectedRole === 'admin'
                    ? 'bg-pastel-peach text-amber-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">Faculty Admin</span>
                  {selectedRole === 'admin' && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Analytics & Issue Certs
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Mode Switcher: Sign In vs Register */}
          <div className="flex items-center justify-center p-1 rounded-2xl bg-pastel-mint/30 border border-pastel-mint/50 max-w-xs mx-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Registration
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-pastel-lavender/20 border border-pastel-lavender/70 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {selectedRole === 'student' ? 'College Student Email *' : 'Faculty / Admin Email *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder={
                    selectedRole === 'student'
                      ? 'student@chronova.edu'
                      : 'faculty.admin@chronova.edu'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-pastel-lavender/20 border border-pastel-lavender/70 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            {/* Roll / ID Number for students or Dept for faculty */}
            {mode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {selectedRole === 'student' ? 'Student Roll Number' : 'Employee ID'}
                  </label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder={selectedRole === 'student' ? 'CH-2026-CS-042' : 'FAC-801'}
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-pastel-lavender/20 border border-pastel-lavender/70 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Academic Department
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-pastel-lavender/20 border border-pastel-lavender/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      <option value="Computer Science & Engineering">Computer Science</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                      <option value="Electronics & Communication">ECE</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="Mechanical & Mechatronics">Mechatronics</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Password *
                </label>
                {mode === 'login' && (
                  <span className="text-[11px] text-indigo-600 hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-pastel-lavender/20 border border-pastel-lavender/70 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-2xl text-xs font-extrabold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                selectedRole === 'student'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
              }`}
            >
              <span>
                {isLoading
                  ? 'Verifying Credentials...'
                  : mode === 'login'
                  ? `Sign In as ${selectedRole === 'student' ? 'Student' : 'Faculty Admin'}`
                  : `Create ${selectedRole === 'student' ? 'Student' : 'Admin'} Profile`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Instant Demo Logins in Pastel Cards */}
          <div className="pt-4 border-t border-pastel-sky/40 space-y-3">
            <p className="text-[11px] font-bold text-slate-500 text-center uppercase tracking-wide">
              Instant One-Click Demo Access
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleInstantDemoLogin('student')}
                className="p-3 rounded-2xl bg-pastel-lavender/60 hover:bg-pastel-lavender border border-pastel-lavender text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5"
              >
                <div className="p-1.5 rounded-xl bg-white shadow-xs text-indigo-600">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">Student Demo</p>
                  <p className="text-[10px] text-slate-500 font-normal">Alex Mercer (CS-2026)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleInstantDemoLogin('admin')}
                className="p-3 rounded-2xl bg-pastel-peach/60 hover:bg-pastel-peach border border-pastel-peach text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5"
              >
                <div className="p-1.5 rounded-xl bg-white shadow-xs text-amber-700">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">Admin Demo</p>
                  <p className="text-[10px] text-slate-500 font-normal">Dr. Sarah Jenkins (Dean)</p>
                </div>
              </button>
            </div>
          </div>

          {onCancel && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                ← Back to Campus Catalog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
