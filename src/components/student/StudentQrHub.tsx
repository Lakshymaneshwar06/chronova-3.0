import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  Download,
  ShieldCheck,
  Camera,
  Clock,
  MapPin,
  ExternalLink,
  Check,
  UserCheck
} from 'lucide-react';
import { UserRegistration, ClubItem, CertificateItem } from '../../types';
import { RealQrCode } from '../common/RealQrCode';
import { ChronovaLogo } from '../common/ChronovaLogo';

interface StudentQrHubProps {
  registrations: UserRegistration[];
  clubs: ClubItem[];
  certificates: CertificateItem[];
  onCheckInClub: (clubId: string) => void;
  checkedInClubIds: Set<string>;
  onPreviewCertificate?: (cert: CertificateItem) => void;
}

export const StudentQrHub: React.FC<StudentQrHubProps> = ({
  registrations,
  clubs,
  certificates,
  onCheckInClub,
  checkedInClubIds,
  onPreviewCertificate
}) => {
  const [activeQrTab, setActiveQrTab] = useState<'events' | 'clubs' | 'certs'>('events');
  const [selectedReg, setSelectedReg] = useState<UserRegistration | null>(
    registrations[0] || null
  );
  const [selectedClub, setSelectedClub] = useState<ClubItem | null>(clubs[0] || null);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(certificates[0] || null);
  const [simulatedScannerActive, setSimulatedScannerActive] = useState(false);
  const [scannerSuccessMsg, setScannerSuccessMsg] = useState<string | null>(null);

  const handleSimulateScan = (title: string) => {
    setSimulatedScannerActive(true);
    setScannerSuccessMsg(null);
    setTimeout(() => {
      setSimulatedScannerActive(false);
      setScannerSuccessMsg(`✓ Successfully verified attendance for: ${title}`);
      setTimeout(() => setScannerSuccessMsg(null), 4000);
    }, 1000);
  };

  const handleDownloadCertificate = (cert: CertificateItem) => {
    const certText = `CHRONOVA VERIFIED ACADEMIC CREDENTIAL\n=======================================\nCredential ID: ${cert.verificationId}\nTitle: ${cert.title}\nRecipient: ${cert.recipientName} (${cert.recipientEmail})\nIssued By: ${cert.issuer}\nDate: ${cert.issueDate}\nGrade: ${cert.grade}\nKey Competencies: ${cert.skills.join(', ')}\nVerification QR: ${cert.qrCode}\n=======================================\nCryptographically signed by Chronova Academic Ledger.`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cert.verificationId}_Chronova_Certificate.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="student-qr-hub" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2.5">
              <QrCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Smart QR Attendance & Verification Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Event Attendance, Club Attendance & Certifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              Scan or display real, dynamic QR codes to verify entry at event gates, register weekly club attendance, and inspect verified course completion credentials.
            </p>
          </div>

          {/* Quick Scanner Simulation */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => handleSimulateScan(
                activeQrTab === 'events' ? (selectedReg?.eventTitle || 'Campus Event') :
                activeQrTab === 'clubs' ? (selectedClub?.name || 'Club Meetup') :
                (selectedCert?.title || 'Academic Certification')
              )}
              disabled={simulatedScannerActive}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>{simulatedScannerActive ? 'Scanning Camera Feed...' : 'Simulate QR Scan'}</span>
            </button>
          </div>
        </div>

        {scannerSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{scannerSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* QR Category Switcher */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs w-full sm:w-fit overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveQrTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeQrTab === 'events'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Event Attendance QR ({registrations.length})</span>
        </button>

        <button
          onClick={() => setActiveQrTab('clubs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeQrTab === 'clubs'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Club Attendance QR ({clubs.length})</span>
        </button>

        <button
          onClick={() => setActiveQrTab('certs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeQrTab === 'certs'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certification QR ({certificates.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: EVENT ATTENDANCE QR
         ========================================================================= */}
      {activeQrTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Registered Events List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Registered Event Passes
            </h3>
            {registrations.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <Calendar className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-xs font-medium">No event registrations found.</p>
                <p className="text-[11px] text-slate-400 mt-1">Register for an event to generate your check-in QR code.</p>
              </div>
            ) : (
              registrations.map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => setSelectedReg(reg)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedReg?.id === reg.id
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        {reg.ticketCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {reg.eventTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {new Date(reg.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        selectedReg?.id === reg.id
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Interactive Pass Card with Real QR Image */}
          <div className="lg:col-span-2">
            {selectedReg ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pastel-sky/60 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-pastel-lavender/40">
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pastel-lavender text-indigo-800 text-[11px] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        Official Admission Pass
                      </span>
                      <ChronovaLogo size="xs" variant="compact" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-800 font-heading">
                      {selectedReg.eventTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(selectedReg.eventDate).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        Main Auditorium / North Hall
                      </span>
                    </div>
                  </div>

                  {/* Real Scannable QR Code Image */}
                  <div className="shrink-0 flex flex-col items-center">
                    <RealQrCode
                      data={selectedReg.qrData || `CHRONOVA::EVENT::${selectedReg.ticketCode}`}
                      size={150}
                      label={selectedReg.ticketCode}
                    />
                    <span className="text-[10px] text-slate-400 mt-1">Scan at Gate Ingress</span>
                  </div>
                </div>

                <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Attendee
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{selectedReg.attendeeName}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Role
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{selectedReg.attendeeRole}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Status
                    </span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified RSVP
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Issued At
                    </span>
                    <p className="font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                      {new Date(selectedReg.registeredAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500">Select an event from the list to display its attendance QR code.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CLUB ATTENDANCE QR
         ========================================================================= */}
      {activeQrTab === 'clubs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Clubs List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Student Club
            </h3>
            {clubs.map((club) => {
              const isCheckedIn = checkedInClubIds.has(club.id);
              return (
                <div
                  key={club.id}
                  onClick={() => setSelectedClub(club)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedClub?.id === club.id
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        {club.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {club.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{club.meetingTime}</p>
                    </div>
                    {isCheckedIn && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                        Present
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Club Attendance QR Check-In Pass */}
          <div className="lg:col-span-2">
            {selectedClub ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Weekly Club Roll Call Token
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                      {selectedClub.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {selectedClub.description || 'Active campus tech society organizing hands-on labs.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {selectedClub.meetingTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {selectedClub.location}
                      </span>
                    </div>
                  </div>

                  {/* Real Scannable Club Attendance QR */}
                  <div className="shrink-0 flex flex-col items-center">
                    <RealQrCode
                      data={`CHRONOVA::CLUB::${selectedClub.id}::ATTENDANCE::${selectedClub.qrToken}`}
                      size={150}
                      label={`TOKEN: ${selectedClub.qrToken}`}
                    />
                    <span className="text-[10px] text-slate-400 mt-1">Scan for Lab Attendance</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Status:</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {checkedInClubIds.has(selectedClub.id) ? '✓ Checked In for Today' : 'Not Checked In'}
                    </p>
                  </div>

                  <button
                    onClick={() => onCheckInClub(selectedClub.id)}
                    className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      checkedInClubIds.has(selectedClub.id)
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {checkedInClubIds.has(selectedClub.id) ? 'Revoke Attendance' : 'Confirm Attendance Now'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500">Select a club to view its attendance QR pass.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CERTIFICATION QR
         ========================================================================= */}
      {activeQrTab === 'certs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Certifications List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Verified Certificates
            </h3>
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedCert?.id === cert.id
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {cert.verificationId}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cert.issuer}</p>
                  </div>
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Credential Card with Real Verification QR */}
          <div className="lg:col-span-2">
            {selectedCert ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      Chronova Certified Academic Credential
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                      {selectedCert.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Awarded to <span className="font-bold text-slate-900 dark:text-white">{selectedCert.recipientName}</span> by {selectedCert.issuer}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {selectedCert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Real Scannable Certification Verification QR */}
                  <div className="shrink-0 flex flex-col items-center">
                    <RealQrCode
                      data={`https://chronova.campus.verify/cert/${selectedCert.verificationId}`}
                      size={150}
                      label={selectedCert.verificationId}
                    />
                    <span className="text-[10px] text-slate-400 mt-1">Scan to Verify Authenticity</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Performance Grade:</span>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{selectedCert.grade}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {onPreviewCertificate && (
                      <button
                        onClick={() => onPreviewCertificate(selectedCert)}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>View Official Certificate</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadCertificate(selectedCert)}
                      className="py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Credential (.txt)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500">Select a certificate to inspect its verification QR code.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
