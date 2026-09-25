import React, { useRef } from 'react';
import {
  Award,
  Download,
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CertificateItem } from '../../types';
import { RealQrCode } from './RealQrCode';
import { ChronovaLogo } from './ChronovaLogo';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const content = `
================================================================================
                     CHRONOVA CAMPUS ECOSYSTEM ACADEMIC CREDENTIAL
================================================================================

Credential Verification ID: ${certificate.verificationId}
Title:                      ${certificate.title}
Issued To:                  ${certificate.recipientName}
Email:                      ${certificate.recipientEmail}
Issuing Body:               ${certificate.issuer}
Date of Award:              ${certificate.issueDate}
Distinction / Grade:        ${certificate.grade}

Key Competencies & Verified Skills:
${certificate.skills.map((s) => `  • ${s}`).join('\n')}

Verification Ledger URL:
https://chronova.campus.verify/cert/${certificate.verificationId}

================================================================================
This credential is cryptographically attested and tamper-evident under the Chronova
Decentralized Academic Ledger protocol.
================================================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certificate.verificationId}_Official_Certificate.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      id="certificate-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/20 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="certificate-modal-container"
        className="relative w-full max-w-3xl rounded-3xl bg-white border border-pastel-sky/60 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 border-b border-pastel-sky/40 bg-pastel-lavender/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
              <Award className="w-4 h-4 text-amber-600" />
            </span>
            <span className="text-xs font-bold text-slate-900 font-heading">
              Official Credential Preview
            </span>
            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
              {certificate.verificationId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Card View */}
        <div className="p-6 sm:p-10 bg-gradient-to-b from-slate-50 to-white overflow-y-auto max-h-[75vh]">
          <div
            ref={certificateRef}
            className="relative p-6 sm:p-10 rounded-2xl border-4 border-double border-indigo-200 bg-white shadow-xl text-center space-y-6"
          >
            {/* Corner Decorative Accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-500" />

            {/* Emblem Header */}
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <ChronovaLogo size="lg" variant="mark" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold tracking-widest text-indigo-600 uppercase font-mono">
                Chronova Campus Ecosystem
              </h2>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading mt-1">
                Certificate of Academic Achievement
              </h1>
              <p className="text-[11px] text-slate-500">
                Issued in accordance with the Chronova Academic Excellence Standards
              </p>
            </div>

            {/* Recipient Details */}
            <div className="py-2 border-y border-slate-100 max-w-lg mx-auto space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                This certifies that
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading text-indigo-950">
                {certificate.recipientName}
              </h3>
              <p className="text-xs text-slate-600">
                has successfully fulfilled all requirements and demonstrated mastery in
              </p>
              <h4 className="text-base sm:text-lg font-bold text-indigo-700 font-heading">
                {certificate.title}
              </h4>
            </div>

            {/* Skills & Performance */}
            <div className="space-y-3 max-w-md mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Performance: {certificate.grade}</span>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5">
                {certificate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Signatures and Verification QR */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="text-center sm:text-left space-y-1">
                <p className="text-xs font-mono font-bold text-slate-800">
                  {certificate.issueDate}
                </p>
                <p className="text-[10px] text-slate-500 uppercase">Award Date</p>
              </div>

              <div className="flex flex-col items-center">
                <RealQrCode
                  data={`https://chronova.campus.verify/cert/${certificate.verificationId}`}
                  size={100}
                  label={certificate.verificationId}
                />
                <span className="text-[9px] text-slate-500 font-mono mt-1">
                  Scan to verify on-chain
                </span>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <p className="text-xs font-bold text-slate-800 font-heading">
                  {certificate.issuer}
                </p>
                <p className="text-[10px] text-slate-500 uppercase">Authorizing Directorate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
