import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldAlert,
  Lock,
  Mail,
  Key,
  KeyRound,
  RotateCw,
  ArrowRight,
  Server,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_SYSTEM_ADMIN_CREDENTIALS } from '../../data/officialAuthData';

interface SystemAdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemAdminAuthModal: React.FC<SystemAdminAuthModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();
  const { setRole, setPortalUserType, setAuthenticatedOfficer, setActiveTab } = useApp();
  const [email, setEmail] = useState<string>(MOCK_SYSTEM_ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState<string>('••••••••••••');
  const [totp, setTotp] = useState<string>(MOCK_SYSTEM_ADMIN_CREDENTIALS.totpCode);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [quickFillNotif, setQuickFillNotif] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickFill = () => {
    setEmail(MOCK_SYSTEM_ADMIN_CREDENTIALS.email);
    setPassword(MOCK_SYSTEM_ADMIN_CREDENTIALS.passwordDemo);
    setTotp(MOCK_SYSTEM_ADMIN_CREDENTIALS.totpCode);
    setQuickFillNotif('Master SuperAdmin credentials & 2FA TOTP token populated!');
    setTimeout(() => setQuickFillNotif(null), 3000);
  };

  const handleAuthorize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      const adminCreds = {
        role: 'System Administrator' as const,
        name: 'Platform SuperAdmin (Infrastructure Controller)',
        officialId: 'admin@nic.landmgmt.gov.in',
        email: 'admin@nic.landmgmt.gov.in',
        departmentOrAgency: 'National Data Centre Infrastructure & Security Division',
        clearance: 'Master IT Infrastructure & API Gateway Root Authority',
        designationLabel: 'System Administrator',
        employeeBadgeId: 'SYS-ADMIN-001'
      };
      setRole('System Administrator');
      setAuthenticatedOfficer(adminCreds);
      setPortalUserType('admin');
      setActiveTab('Dashboard');
      try {
        localStorage.setItem('nlams_demo_role', 'System Administrator');
        localStorage.setItem('nlams_demo_portal', 'admin');
        localStorage.setItem('nlams_demo_officer', JSON.stringify(adminCreds));
      } catch (e) {}
      setIsVerifying(false);
      onClose();
    }, 500);
  };

  return (
    <AnimatePresence>
      <div
        id="system-admin-modal-backdrop"
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
          className="bg-white rounded-2xl shadow-2xl border border-purple-200 max-w-xl w-full overflow-hidden my-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-modal-title"
        >
          {/* Header Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-600" />

          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-100 border border-purple-200 text-purple-800 flex items-center justify-center shadow-2xs flex-shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 mb-0.5">
                  <Lock className="w-3 h-3 text-purple-700" />
                  <span>IT & Infrastructure Master Console</span>
                </div>
                <h3 id="admin-modal-title" className="text-base font-black text-slate-900 tracking-tight leading-tight">
                  System Administrator Authentication
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  NIC MeghRaj Tier-IV Enterprise Operations & RBAC Provisioning
                </p>
              </div>
            </div>

            <button
              id="btn-close-admin-modal"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAuthorize} className="p-6 space-y-4">
            {/* Demo Quick-Fill SuperAdmin Token Button */}
            <div className="flex items-center justify-between p-3 bg-purple-50/70 border border-purple-200 rounded-xl shadow-2xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-700 flex-shrink-0" />
                <div>
                  <span className="text-xs font-black text-purple-950 block">Testing & Demonstration Mode</span>
                  <span className="text-[11px] text-purple-800 block">Single-click pre-fill with valid test credentials</span>
                </div>
              </div>
              <button
                id="btn-quick-fill-admin-token"
                type="button"
                onClick={handleQuickFill}
                className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Demo Quick-Fill SuperAdmin Token</span>
              </button>
            </div>

            {quickFillNotif && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{quickFillNotif}</span>
              </div>
            )}

            {/* Enterprise Admin Email */}
            <div>
              <label htmlFor="admin-email-input" className="block text-xs font-bold text-slate-700 mb-1">
                Enterprise Admin Email / Principal ID
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  id="admin-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 rounded-xl py-2 pl-9 pr-3 text-xs font-mono font-bold text-slate-800 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Master Password */}
            <div>
              <label htmlFor="admin-password-input" className="block text-xs font-bold text-slate-700 mb-1">
                Master Infrastructure Password
              </label>
              <div className="relative flex items-center">
                <Key className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  id="admin-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 rounded-xl py-2 pl-9 pr-3 text-xs font-mono font-bold text-slate-800 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* 6-Digit Authenticator App (TOTP) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="admin-totp-input" className="block text-xs font-bold text-slate-700">
                  {t('auth.authenticatorApp', '6-Digit Authenticator App Code (TOTP)')}
                </label>
                <span className="text-[11px] text-purple-700 font-mono font-bold">
                  Demo Code: {MOCK_SYSTEM_ADMIN_CREDENTIALS.totpCode}
                </span>
              </div>
              <div className="relative flex items-center">
                <KeyRound className="w-4 h-4 text-purple-600 absolute left-3" />
                <input
                  id="admin-totp-input"
                  type="text"
                  maxLength={6}
                  value={totp}
                  onChange={(e) => setTotp(e.target.value.replace(/\D/g, ''))}
                  placeholder="849201"
                  className="w-full bg-purple-50/50 focus:bg-white border border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 rounded-xl py-2 pl-9 pr-3 text-sm font-mono font-black tracking-widest text-purple-900 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* System Node & Infrastructure Scope Strip */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-purple-700" />
                  <span>NIC Cloud Node: MeitY Tier-IV (New Delhi / HYD DR)</span>
                </span>
                <span className="text-emerald-700 font-mono">Uptime 99.99% • 14ms</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Manages API registries (Bhulekh, Bhoomi, Tamil Nilam), RBAC directory provisioning, tenant management, and platform telemetry.
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
                id="btn-authorize-admin-session"
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 disabled:bg-purple-300 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Authorizing Console Access...</span>
                  </>
                ) : (
                  <>
                    <span>Authorize Administrator Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
