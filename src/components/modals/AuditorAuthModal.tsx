import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  RotateCw,
  Cpu,
  KeyRound,
  FileText,
  BadgeAlert,
  AlertTriangle,
  Usb,
  Fingerprint
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_AUDITOR_CREDENTIALS } from '../../data/officialAuthData';

interface AuditorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditorAuthModal: React.FC<AuditorAuthModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();
  const { setRole, setPortalUserType, setAuthenticatedOfficer, setActiveTab } = useApp();
  const [tokenPin, setTokenPin] = useState<string>('••••••');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [handshakeSuccess, setHandshakeSuccess] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleAuthorize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      const auditorCreds = {
        role: 'Auditor' as const,
        name: MOCK_AUDITOR_CREDENTIALS.name,
        officialId: MOCK_AUDITOR_CREDENTIALS.email,
        email: MOCK_AUDITOR_CREDENTIALS.email,
        departmentOrAgency: MOCK_AUDITOR_CREDENTIALS.organization,
        clearance: MOCK_AUDITOR_CREDENTIALS.clearance,
        designationLabel: 'Auditor (CAG Statutory Inspection)',
        employeeBadgeId: 'CAG-PDA-7712'
      };
      setRole('Auditor');
      setAuthenticatedOfficer(auditorCreds);
      setPortalUserType('auditor');
      setActiveTab('Audit Trail');
      try {
        localStorage.setItem('nlams_demo_role', 'Auditor');
        localStorage.setItem('nlams_demo_portal', 'auditor');
        localStorage.setItem('nlams_demo_officer', JSON.stringify(auditorCreds));
      } catch (e) {}
      setIsVerifying(false);
      onClose();
    }, 550);
  };

  return (
    <AnimatePresence>
      <div
        id="auditor-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-2xl border border-emerald-200 max-w-xl w-full overflow-hidden my-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auditor-modal-title"
        >
          {/* Header Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700" />

          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center shadow-2xs flex-shrink-0">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 mb-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Statutory Forensic Inspection</span>
                </div>
                <h3 id="auditor-modal-title" className="text-base font-black text-slate-900 tracking-tight leading-tight">
                  CAG & Statutory Vigilance Authentication
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Comptroller & Auditor General of India • Parliamentary Public Accounts
                </p>
              </div>
            </div>

            <button
              id="btn-close-auditor-modal"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Class-3 Digital Signature Certificate (DSC) Hardware Handshake Box */}
            <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Usb className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Class-3 PKI Digital Signature Dongle Handshake
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Token Connected</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Hardware Device:</span>
                  <span className="text-slate-200 font-semibold">{MOCK_AUDITOR_CREDENTIALS.dscDevice}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Token Serial:</span>
                  <span className="text-slate-200 font-bold">{MOCK_AUDITOR_CREDENTIALS.tokenSerial}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Certificate Authority:</span>
                  <span className="text-slate-200">{MOCK_AUDITOR_CREDENTIALS.issuingCA}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Status / Expiry:</span>
                  <span className="text-emerald-400">{MOCK_AUDITOR_CREDENTIALS.validUntil}</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 break-all leading-tight">
                <span className="text-slate-500">SHA-256 Fingerprint: </span>
                <span className="text-amber-300">{MOCK_AUDITOR_CREDENTIALS.shaFingerprint}</span>
              </div>
            </div>

            {/* Explicit Read-Only Forensic Assurance Banner (Required by prompt) */}
            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-950 shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span className="text-xs font-black uppercase tracking-wide text-emerald-900">
                  Read-Only Forensic Session Verified (Zero Write Privileges)
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                By statutory mandate, this session permits non-repudiable read-only inspection of Section 11/19 timeline lapses, Solatium compliance, PFMS disbursement reconciliation, and cryptographic SHA-256 mutation ledgers. All write endpoints are cryptographically locked.
              </p>
            </div>

            {/* Auditor Profile Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
              <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                <span>Auditor Principal: {MOCK_AUDITOR_CREDENTIALS.name}</span>
                <span className="text-slate-500 font-mono text-[11px]">{MOCK_AUDITOR_CREDENTIALS.email}</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Authorized for CAG infrastructure audit compliance and parliamentary inquiry review.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-authorize-auditor-session"
                type="button"
                onClick={handleAuthorize}
                disabled={isVerifying}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:bg-emerald-400 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>{t('auth.verifyingHardware', 'Verifying Hardware PKI Handshake...')}</span>
                  </>
                ) : (
                  <>
                    <span>Enter Audit Portal (Read-Only)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
