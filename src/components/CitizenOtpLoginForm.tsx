import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import {
  Phone,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info,
  RefreshCw,
  Lock,
  UserCheck,
  Building2,
  FileText
} from 'lucide-react';
import {
  DEMO_PRESET_USERS,
  findRegisteredLandowner,
  normalizePhoneNumber
} from '../data/citizenAuthData';

interface CitizenOtpLoginFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export const CitizenOtpLoginForm: React.FC<CitizenOtpLoginFormProps> = ({
  onSuccess,
  compact = false
}) => {
  const { t } = useTranslation();
  const { authenticateCitizenByPhone } = useApp();

  const [phoneInput, setPhoneInput] = useState<string>('9876541022');
  const [otpInput, setOtpInput] = useState<string>('123456');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [simulatedSmsNotice, setSimulatedSmsNotice] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);

  // Check if current phone/input matches a registered landowner
  const matchedLandowner = findRegisteredLandowner(phoneInput);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleaned = phoneInput.trim();
    if (!cleaned) {
      setErrorMessage(t('auth.enterPhoneNumber', 'Enter Phone Number'));
      return;
    }

    // Accept 10 digits or recognized ID
    const digits = normalizePhoneNumber(cleaned);
    if (digits.length !== 10 && !cleaned.toUpperCase().startsWith('FAM-') && !cleaned.toUpperCase().startsWith('PAR-')) {
      setErrorMessage(t('auth.invalidPhoneNumber', 'Invalid phone number'));
      return;
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setStep('otp');
      setOtpInput('123456'); // Auto-filled for testing ease
      setCountdown(30);
      setSimulatedSmsNotice(`Demo SMS Gateway: OTP is 123456 (Sent to +91 ${digits || cleaned})`);
    }, 600);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!otpInput.trim()) {
      setErrorMessage(t('auth.enterOtp', 'Enter 6-Digit OTP'));
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const res = authenticateCitizenByPhone(phoneInput, otpInput);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        if (onSuccess) onSuccess();
      }
    }, 500);
  };

  const handleSelectPreset = (preset: typeof DEMO_PRESET_USERS[0]) => {
    setPhoneInput(preset.phone);
    setErrorMessage('');
    // Direct quick login or prefill
    setStep('phone');
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden ${compact ? 'p-4' : 'p-6 sm:p-8'}`}>
      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              {t('citizen.loginTitle', 'Citizen Phone & OTP Verification')}
            </h3>
            <span className="text-[10px] text-slate-500 font-medium">
              National Land Acquisition Portal • Digital Identity Access
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase rounded-full tracking-wider flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>NIC OTP Gateway</span>
        </span>
      </div>

      {/* Simulated SMS Alert Banner */}
      {simulatedSmsNotice && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="font-semibold">{simulatedSmsNotice}</span>
          </div>
          <button
            onClick={() => setSimulatedSmsNotice(null)}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-900"
          >
            {t('common.dismiss', 'Dismiss')}
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Authentication Form */}
      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
              <span>{t('auth.enterPhoneNumber', 'Enter Phone Number')}</span>
              <span className="text-[10px] font-normal text-slate-400">{t('auth.mobileNumber', '10-Digit Mobile Number')}</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 font-mono font-bold text-xs text-slate-500 border-r border-slate-300 pr-2 pointer-events-none">
                +91
              </span>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-300 focus:border-blue-600 rounded-lg py-2.5 pl-14 pr-3 text-xs font-mono font-bold text-slate-900 outline-none transition-all shadow-2xs"
                autoFocus
              />
            </div>

            {/* Live Identification Badge */}
            <div className="mt-2 text-xs">
              {matchedLandowner ? (
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-2 text-emerald-900">
                  <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-emerald-800 text-[11px] block">
                      ✓ {t('citizen.landownerPortal', 'Registered Affected Landowner')}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700 block mt-0.5">
                      {matchedLandowner.landownerName} • Survey {matchedLandowner.surveyNumber} ({matchedLandowner.landAcres} Acres)
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Village {matchedLandowner.village}, {matchedLandowner.district} • Parcel {matchedLandowner.parcelId}
                    </span>
                  </div>
                </div>
              ) : phoneInput.trim().length >= 10 ? (
                <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-900">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-amber-800 text-[11px] block">
                      Unregistered Mobile Number
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      No land acquisition records are tied to this number. Please check the number or use a demo profile below.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Enter registered mobile or click a demo profile below</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSendingOtp}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white text-xs font-black rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {isSendingOtp ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending OTP via SMS...</span>
              </>
            ) : (
              <>
                <span>{t('auth.sendOtp', 'Send OTP')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {t('auth.enterOtp', 'Enter 6-Digit OTP')}
              </label>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
              >
                {t('auth.changeNumber', 'Change Number')} (+91 {phoneInput})
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-300 focus:border-blue-600 rounded-lg py-2.5 px-3 text-center text-lg font-mono font-black tracking-widest text-slate-900 outline-none transition-all shadow-2xs"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-[11px] text-slate-500">
                {t('auth.defaultDemoOtp', 'Default demo OTP is')} <strong className="font-mono text-blue-700">123456</strong>
              </span>
              {countdown > 0 ? (
                <span className="text-[11px] text-slate-400 font-mono">Resend in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold"
                >
                  {t('auth.resendOtp', 'Resend OTP')}
                </button>
              )}
            </div>

            {/* Target View Indicator */}
            <div className="mt-3 p-2 rounded bg-slate-50 border border-slate-200 text-xs">
              {matchedLandowner ? (
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{t('auth.willAuthenticateAs', 'Will authenticate as:')} <strong>{matchedLandowner.landownerName}</strong> ({t('citizen.landownerPortal', 'Personal Landowner Dashboard')})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-800 font-semibold">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{t('auth.willAuthenticateAs', 'Will authenticate as:')} <strong>Unregistered User</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              {t('auth.backBtn', 'Back')}
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-300 text-white text-xs font-black rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('auth.verifyingCode', 'Verifying OTP...')}</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{t('auth.verifyOtp', 'Verify OTP')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Quick-Select Demo Testing Presets */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
          {t('auth.demoProfiles', 'One-Click Demo Test Profiles:')}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DEMO_PRESET_USERS.map((preset) => {
            const isLandowner = preset.type === 'landowner';
            const isSelected = phoneInput === preset.phone;
            return (
              <button
                key={preset.phone}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-xs text-slate-900 truncate">
                    {preset.name}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
                    isLandowner ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isLandowner ? t('citizen.landownerPortal', 'Landowner') : 'Public'}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-blue-700 font-bold">
                  {preset.displayPhone}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {preset.detail}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statutory Privacy Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Section 45 RFCTLARR Act Privacy Protection</span>
        </span>
        <span className="font-semibold text-slate-600">e-Pramaan / DoLR</span>
      </div>
    </div>
  );
};
