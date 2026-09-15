import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  RotateCw,
  KeyRound,
  FileCheck2,
  Layers,
  Sparkles,
  ExternalLink,
  Cpu,
  BadgeCheck,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, OfficerCredential } from '../../types';
import {
  SECTOR_AGNOSTIC_OFFICER_ROLES,
  getOfficerCredentialByRole,
  generateMockParichayJwt
} from '../../data/officialAuthData';

interface OfficerParichayModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const OfficerParichayModal: React.FC<OfficerParichayModalProps> = ({
  isOpen,
  onClose,
  selectedRole,
  onSelectRole
}) => {
  const { t } = useTranslation();
  const { setRole, setPortalUserType, setAuthenticatedOfficer, setActiveTab } = useApp();
  const [activeRoleKey, setActiveRoleKey] = useState<UserRole>(selectedRole);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showJwtToken, setShowJwtToken] = useState<boolean>(false);
  const [sessionNonce, setSessionNonce] = useState<string>('IN-PAR-98421');

  useEffect(() => {
    if (isOpen) {
      setActiveRoleKey(selectedRole);
      setIsVerifying(false);
      setShowJwtToken(false);
      setSessionNonce(`IN-PAR-${Math.floor(10000 + Math.random() * 90000)}`);
    }
  }, [isOpen, selectedRole]);

  if (!isOpen) return null;

  const currentOfficer: OfficerCredential = getOfficerCredentialByRole(activeRoleKey);
  const mockJwt = generateMockParichayJwt(currentOfficer);

  const handleRoleChange = (role: UserRole) => {
    setActiveRoleKey(role);
    onSelectRole(role);
  };

  const handleVerifySso = () => {
    setIsVerifying(true);

    setTimeout(() => {
      setRole(currentOfficer.role);
      setAuthenticatedOfficer(currentOfficer);
      setPortalUserType('officer');
      setActiveTab('Dashboard');
      try {
        localStorage.setItem('nlams_demo_role', currentOfficer.role);
        localStorage.setItem('nlams_demo_portal', 'officer');
        localStorage.setItem('nlams_demo_officer', JSON.stringify(currentOfficer));
      } catch (e) {}
      setIsVerifying(false);
      onClose();
    }, 550);
  };

  return (
    <AnimatePresence>
      <div
        id="officer-parichay-modal-backdrop"
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
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="parichay-modal-title"
        >
          {/* Official Indian Tricolor Top Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

          {/* Modal Header: JanParichay / MeriPehchaan Branding */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-700/80 border border-blue-500/40 flex items-center justify-center text-xl shadow-xs">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                    JanParichay SSO
                  </span>
                  <span className="text-[10px] text-blue-200 font-bold bg-blue-900/60 px-1.5 py-0.5 rounded border border-blue-400/30">
                    SSO = Single Sign-On
                  </span>
                </div>
                <h3 id="parichay-modal-title" className="text-base font-black text-white tracking-tight leading-tight mt-0.5">
                  Government Officer — JanParichay SSO
                </h3>
                <p className="text-[11px] text-slate-300">
                  Secure login using your official government identity.
                </p>
              </div>
            </div>

            <button
              id="btn-close-parichay-modal"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick-Switch Chips Across All 6 Sector-Agnostic Roles */}
          <div className="bg-slate-100/80 border-b border-slate-200 px-6 py-2.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
              <span>Select Authorized Governance Role (Pre-populated Profiles):</span>
              <span className="text-blue-700 font-bold font-mono">6 Sector-Agnostic Roles</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SECTOR_AGNOSTIC_OFFICER_ROLES.map((officer) => {
                const isActive = activeRoleKey === officer.role;
                return (
                  <button
                    key={officer.role}
                    type="button"
                    onClick={() => handleRoleChange(officer.role)}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer truncate ${
                      isActive
                        ? 'bg-blue-700 text-white border-blue-800 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                    title={`${officer.role} - ${officer.name}`}
                  >
                    <span className="block truncate">{officer.designationLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* User-Friendly JanParichay SSO Explanation */}
            <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0" />
                <div>
                  <div className="font-black text-blue-900 text-xs">JanParichay SSO</div>
                  <div className="text-[11px] font-medium text-slate-700">
                    Secure login using your official government identity.
                  </div>
                </div>
              </div>
              <span className="self-start sm:self-center px-2 py-0.5 bg-blue-100 border border-blue-200 text-blue-800 text-[10px] font-bold rounded whitespace-nowrap">
                SSO = Single Sign-On
              </span>
            </div>

            {/* Active Officer Identity Card */}
            <div className="bg-slate-50 border-2 border-blue-200 rounded-xl p-4 relative overflow-hidden shadow-2xs">
              <div className="absolute top-0 right-0 bg-blue-700 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                LOA-3 Assured
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 text-blue-800 flex items-center justify-center font-black text-lg flex-shrink-0 shadow-2xs">
                  <UserCheck className="w-6 h-6 text-blue-700" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-slate-900 truncate">
                      {currentOfficer.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                      <BadgeCheck className="w-3 h-3 text-emerald-700" />
                      <span>Parichay Verified</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2.5 text-xs">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Official ID / Email:
                      </span>
                      <span className="font-mono font-bold text-blue-800">{currentOfficer.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        NIC Badge & Session:
                      </span>
                      <span className="font-mono font-bold text-slate-700">{currentOfficer.employeeBadgeId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Department / Jurisdiction:
                      </span>
                      <span className="font-bold text-slate-800 line-clamp-1">{currentOfficer.departmentOrAgency}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Statutory Clearance:
                      </span>
                      <span className="font-bold text-emerald-700 line-clamp-1">{currentOfficer.clearance}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Parichay Handshake & Network Metadata */}
            <div className="bg-slate-900 text-slate-300 rounded-xl p-3.5 text-xs font-mono border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>NIC SSO Handshake Gateway: CONNECTED</span>
                </div>
                <span className="text-slate-500">TLS 1.3 / AES-256</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Session Nonce:</span>
                  <span className="text-slate-200 font-bold">{sessionNonce}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">NIC Gateway:</span>
                  <span className="text-slate-200">sso.nic.in (Delhi Node)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">IP Binding:</span>
                  <span className="text-slate-200">10.24.18.91 (NICGovNet)</span>
                </div>
              </div>

              {/* Collapsible Mock Bearer Token Viewer */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowJwtToken(!showJwtToken)}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>{showJwtToken ? 'Hide Parichay Bearer JWT' : 'Inspect Generated Bearer Token / JWT Claims'}</span>
                </button>

                {showJwtToken && (
                  <div className="mt-1.5 p-2 bg-slate-950 rounded border border-slate-800 text-[10px] text-amber-300 break-all leading-tight">
                    {mockJwt}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>e-Gov Cybersecurity Standard (CERT-In)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  id="btn-verify-parichay-sso"
                  type="button"
                  onClick={handleVerifySso}
                  disabled={isVerifying}
                  className="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 disabled:bg-blue-400 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Validating Parichay SSO Token...</span>
                    </>
                  ) : (
                    <>
                      <span>{t('auth.verifySsoSession', 'Verify Government SSO Session')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
