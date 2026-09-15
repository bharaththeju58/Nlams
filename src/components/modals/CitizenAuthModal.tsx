import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Phone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  User,
  ArrowRight,
  RotateCw,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { findRegisteredLandowner, MOCK_REGISTERED_LANDOWNERS } from '../../data/citizenAuthData';

interface CitizenAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
}

export const CitizenAuthModal: React.FC<CitizenAuthModalProps> = ({
  isOpen,
  onClose,
  initialPhone = '9876541022'
}) => {
  const { t } = useTranslation();
  const { setRole, setPortalUserType, authenticateCitizenByPhone, setActiveTab } = useApp();
  const [phoneNumber, setPhoneNumber] = useState<string>(initialPhone);
  const [otp, setOtp] = useState<string>('482910');
  const [countdown, setCountdown] = useState<number>(60);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendNotification, setResendNotification] = useState<string | null>(null);

  // Auto-detect matched landowner record from database
  const matchedLandowner = findRegisteredLandowner(phoneNumber);

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber(initialPhone);
      setOtp('482910');
      setCountdown(60);
      setErrorMessage(null);
      setResendNotification(null);
    }
  }, [isOpen, initialPhone]);

  // Resend Countdown Timer
  useEffect(() => {
    if (!isOpen) return;
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  const handleResendOtp = () => {
    setCountdown(60);
    setOtp('482910');
    setResendNotification(`New SMS OTP dispatched to +91 ${phoneNumber}! Demo code: 482910`);
    setTimeout(() => {
      setResendNotification(null);
    }, 4000);
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setErrorMessage(t('auth.invalidOtp', 'Please enter the 6-digit OTP received via SMS.'));
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      // Authenticate citizen in AppContext
      authenticateCitizenByPhone(phoneNumber, cleanOtp);
      setRole('Public/Citizen');
      setPortalUserType('citizen');
      setActiveTab('Public Portal');
      try {
        localStorage.setItem('nlams_demo_role', 'Public/Citizen');
        localStorage.setItem('nlams_demo_portal', 'citizen');
        localStorage.removeItem('nlams_demo_officer');
      } catch (e) {}
      setIsVerifying(false);
      onClose();
    }, 450);
  };

  const selectPreset = (phone: string, name: string) => {
    setPhoneNumber(phone);
    setOtp('482910');
    setCountdown(60);
    setErrorMessage(null);
  };

  return (
    <AnimatePresence>
      <div
        id="citizen-auth-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden my-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="citizen-modal-title"
        >
          {/* Header Tricolor Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

          {/* Modal Header */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 mb-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>Landowner Mobile Authentication</span>
                </div>
                <h3 id="citizen-modal-title" className="text-base font-black text-slate-900 tracking-tight leading-tight">
                  {t('auth.citizenPhoneSms', 'Citizen Phone & SMS OTP Verification')}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Statutory transparency under RFCTLARR Act 2013 & PFMS Disbursal
                </p>
              </div>
            </div>
            <button
              id="btn-close-citizen-modal"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleVerify} className="p-6 space-y-4">
            {/* Demo OTP Banner Required by User Request */}
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900 shadow-2xs">
              <Sparkles className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="font-bold flex items-center gap-1.5">
                  <span>{t('auth.demoOtp', 'Demo OTP:')}</span>
                  <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded font-black tracking-wider text-xs">
                    482910
                  </span>
                  <span className="text-slate-500 font-normal text-[11px]">for +91 {phoneNumber}</span>
                </div>
                <p className="text-[11px] text-blue-800/90 mt-0.5">
                  {t('auth.codePrefilled', 'Code pre-filled below.')} {t('auth.testWithRegistered', 'You may test with any registered phone number or click the demo chips below.')}
                </p>
              </div>
            </div>

            {resendNotification && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{resendNotification}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-900 rounded-lg text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Mobile Phone Input */}
            <div>
              <label htmlFor="citizen-phone-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('auth.registeredMobile', 'Registered Mobile Number')}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1 text-slate-500 font-mono text-xs font-bold border-r border-slate-200 pr-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+91</span>
                </div>
                <input
                  id="citizen-phone-input"
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(val);
                  }}
                  placeholder={t('auth.mobileNumber', '10-digit mobile number')}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl py-2.5 pl-20 pr-4 text-sm font-mono font-bold text-slate-900 outline-none transition-all shadow-2xs"
                  required
                />
              </div>

              {/* Live Landowner Identification Badge */}
              <div className="mt-2">
                {matchedLandowner ? (
                  <div className="p-2.5 bg-emerald-50/90 border border-emerald-200 rounded-lg flex items-start gap-2 text-xs text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block text-emerald-950">
                        {matchedLandowner.landownerName} • Parcel #{matchedLandowner.parcelId}
                      </span>
                      <span className="text-[11px] text-emerald-800">
                        Survey {matchedLandowner.surveyNumber} ({matchedLandowner.landAcres} Acres), {matchedLandowner.village}, {matchedLandowner.district} ({matchedLandowner.state})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-2 text-xs text-slate-700">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Enter registered mobile number to verify your land parcels</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick-Pick Demo Landowner Presets */}
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Quick Demo Presets (Instant Fill)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => selectPreset('9876541022', 'P. Muniswamy Gounder')}
                  className={`text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                    phoneNumber === '9876541022'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  <span className="block font-bold">👨‍🌾 P. Muniswamy (TN)</span>
                  <span className="text-[10px] text-slate-500 block">NH-44 Corridor • Parcel 1003</span>
                </button>
                <button
                  type="button"
                  onClick={() => selectPreset('9415044890', 'Rameshwar Nath Tripathi')}
                  className={`text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                    phoneNumber === '9415044890'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  <span className="block font-bold">🌾 R.N. Tripathi (UP)</span>
                  <span className="text-[10px] text-slate-500 block">EDFC Rail Corridor • Parcel 2001</span>
                </button>
              </div>
            </div>

            {/* 6-Digit OTP Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="citizen-otp-input" className="block text-xs font-bold text-slate-700">
                  {t('auth.enterOtp', 'Enter 6-Digit Verification Code (OTP)')}
                </label>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {countdown > 0 ? (
                    <span className="font-mono font-bold text-blue-700">Resend in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-blue-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>{t('auth.resendOtp', 'Resend OTP')}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  id="citizen-otp-input"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="482910"
                  className="w-full bg-slate-50 focus:bg-white border border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl py-2.5 px-4 text-center font-mono font-black text-xl tracking-[0.35em] text-blue-900 outline-none transition-all shadow-2xs"
                  required
                />
              </div>
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
                id="btn-verify-citizen-otp"
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:bg-blue-300 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>{t('auth.verifyingCode', 'Verifying Code...')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('auth.verifyAccessCitizen', 'Verify & Access Citizen Portal')}</span>
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
