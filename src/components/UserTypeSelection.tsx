import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { LanguageSelector } from './LanguageSelector';
import {
  User,
  Building2,
  ShieldAlert,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  MapPin,
  IndianRupee,
  Layers,
  FileText,
  Activity
} from 'lucide-react';
import { findRegisteredLandowner } from '../data/citizenAuthData';
import {
  getOfficerCredentialByRole,
  SECTOR_AGNOSTIC_OFFICER_ROLES,
  MOCK_SYSTEM_ADMIN_CREDENTIALS,
  MOCK_AUDITOR_CREDENTIALS
} from '../data/officialAuthData';
import { CitizenAuthModal } from './modals/CitizenAuthModal';
import { OfficerParichayModal } from './modals/OfficerParichayModal';
import { SystemAdminAuthModal } from './modals/SystemAdminAuthModal';
import { AuditorAuthModal } from './modals/AuditorAuthModal';

export const UserTypeSelection: React.FC = () => {
  const { t } = useTranslation();
  const { setPortalUserType, setRole, authenticateCitizenByPhone, projects, parcels, compensations } = useApp();

  // Dynamic statistics calculated directly from existing dataset
  const totalProjectsCount = projects.length;
  const totalLandAcres = projects.reduce((acc, p) => acc + p.estimatedLandAcres, 0);
  const totalCompensationCr = projects.reduce((acc, p) => acc + p.compensationDisbursedCrores, 0);
  const totalParcelsCount = parcels.length;
  const activeStatesCount = new Set(projects.map(p => p.state)).size;

  const [selectedOfficerRole, setSelectedOfficerRole] = useState<UserRole>(
    'Competent Authority (District Collector / CALA)'
  );

  // Authentication Modals Visibility State
  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState<boolean>(false);
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAuditorModalOpen, setIsAuditorModalOpen] = useState<boolean>(false);

  // Citizen Quick Phone Field State
  const [citizenPhoneInput, setCitizenPhoneInput] = useState<string>('9876541022');

  const matchedLandowner = findRegisteredLandowner(citizenPhoneInput);
  const boundOfficer = getOfficerCredentialByRole(selectedOfficerRole);

  const openCitizenModalWithPhone = (phone: string) => {
    setCitizenPhoneInput(phone);
    setIsCitizenModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-blue-800 selection:text-white">
      {/* Top Official National Tricolor Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Official Top Bar */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white font-serif font-black text-xl shadow-xs border border-blue-800">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-900 tracking-tight">भारत सरकार</span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs font-bold text-slate-700">Government of India</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Ministry of Rural Development • Department of Land Resources (DoLR)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            {/* Language Selector */}
            <LanguageSelector compact={false} />

            <div className="hidden sm:block text-xs">
              <span className="font-bold text-slate-800">{t('common.rfctlarrAct', 'RFCTLARR Act, 2013')}</span>
              <p className="text-[11px] text-slate-500">Statutory Land Governance</p>
            </div>
            <div className="hidden sm:block h-7 w-px bg-slate-200" />
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-[11px] font-bold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>SSO Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* Portal Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-900 text-xs font-bold mb-3 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Unified {t('common.appSubtitle', 'National Land Acquisition & Management System (NLAMS)')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {t('userTypeSelection.title', 'Role-Based Statutory Access Gateway')}
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-normal">
            {t('userTypeSelection.subtitle', 'Select your statutory portal below. Authenticate via JanParichay (National SSO), Mobile SMS OTP, Enterprise Multi-Factor Token, or Statutory CAG Audit PKI.')}
          </p>
        </div>

        {/* 4 User Type Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ========================================================================= */}
          {/* 1. CITIZEN CARD */}
          {/* ========================================================================= */}
          <div
            id="card-citizen-auth"
            className="bg-white border-2 border-blue-200 hover:border-blue-600 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                  <User className="w-6 h-6" />
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                  Public & Landowner
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                {t('userTypeSelection.citizenCardTitle', 'Citizen Portal')}
              </h2>
              <p className="text-xs font-bold text-blue-600 mb-4">
                {t('userTypeSelection.citizenCardSubtitle', 'Aadhaar / Mobile Verified Landowner Access')}
              </p>

              {/* Citizen Mobile Phone Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-xs space-y-2.5">
                <div>
                  <label htmlFor="card-phone-input" className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                    {t('auth.enterPhoneNumber', 'Enter Mobile Number:')}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-[11px] font-mono font-bold text-slate-500 border-r border-slate-300 pr-1.5">
                      +91
                    </span>
                    <input
                      id="card-phone-input"
                      type="tel"
                      maxLength={10}
                      value={citizenPhoneInput}
                      onChange={(e) => setCitizenPhoneInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876541022"
                      className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-lg py-1.5 pl-12 pr-2 text-xs font-mono font-bold text-slate-800 outline-none shadow-2xs"
                    />
                  </div>

                  {/* Live Match Preview */}
                  <div className="mt-2">
                    {matchedLandowner ? (
                      <div className="p-1.5 bg-emerald-50 border border-emerald-200 rounded text-[10px] text-emerald-900 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">
                          {matchedLandowner.landownerName.split(' ')[0]} (Parcel #{matchedLandowner.parcelId})
                        </span>
                      </div>
                    ) : citizenPhoneInput.trim().length >= 10 ? (
                      <div className="p-1.5 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-900 font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>Unregistered Mobile Number</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2 border-t border-slate-200 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Demo Presets:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => openCitizenModalWithPhone('9876541022')}
                      className={`text-left px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                        citizenPhoneInput === '9876541022'
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      👨‍🌾 Landowner (TN)
                    </button>
                    <button
                      type="button"
                      onClick={() => openCitizenModalWithPhone('9415044890')}
                      className={`text-left px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                        citizenPhoneInput === '9415044890'
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      🌾 Landowner (UP)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                id="btn-open-citizen-modal"
                onClick={() => setIsCitizenModalOpen(true)}
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{t('auth.sendOtp', 'Send OTP via SMS')} →</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCitizenModalOpen(true)}
                className="w-full text-center text-[11px] font-bold text-blue-700 hover:underline cursor-pointer py-0.5"
              >
                Open OTP Verification Dialog
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. GOVERNMENT OFFICER CARD */}
          {/* ========================================================================= */}
          <div
            id="card-officer-auth"
            className="bg-white border-2 border-slate-200 hover:border-blue-600 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                  JanParichay SSO
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                {t('userTypeSelection.officerCardTitle', 'Government Officer')}
              </h2>
              <p className="text-xs font-bold text-slate-500 mb-2.5">
                {t('userTypeSelection.officerCardSubtitle', 'Operational Management')}
              </p>

              {/* JanParichay SSO Explanation Box */}
              <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-3 mb-3 text-xs shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-extrabold text-blue-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                    <span>JanParichay SSO</span>
                  </span>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-100/90 border border-blue-200 px-1.5 py-0.5 rounded whitespace-nowrap">
                    SSO = Single Sign-On
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-700 leading-snug">
                  Secure login using your official government identity.
                </p>
              </div>

              {/* Sector-Agnostic National Governance Hierarchy Dropdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-xs space-y-2">
                <div>
                  <label htmlFor="select-officer-role-dropdown" className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                    SELECT OFFICER ROLE:
                  </label>
                  <select
                    id="select-officer-role-dropdown"
                    value={selectedOfficerRole}
                    onChange={(e) => setSelectedOfficerRole(e.target.value as UserRole)}
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-2 text-xs font-bold text-slate-800 outline-none shadow-2xs cursor-pointer"
                  >
                    <option value="Central Sponsoring Ministry">1. Central Sponsoring Ministry</option>
                    <option value="Requiring Body / Proponent (PSU / Department)">2. Requiring Body / Proponent (PSU / Department)</option>
                    <option value="State Revenue & Nodal Authority">3. State Revenue & Nodal Authority</option>
                    <option value="Competent Authority (District Collector / CALA)">4. Competent Authority (District Collector / CALA)</option>
                    <option value="Rehabilitation & Resettlement (R&R) Authority">5. Rehabilitation & Resettlement (R&R) Authority</option>
                    <option value="Project Implementing Agency (PIA / Concessionaire)">6. Project Implementing Agency (PIA / Concessionaire)</option>
                  </select>
                </div>

                {/* Pre-Bound Official Identity Preview */}
                <div className="p-2.5 bg-blue-50/90 border border-blue-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-blue-950">
                    <span className="truncate">{boundOfficer.name.split(',')[0]}</span>
                    <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                      LOA-3
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-blue-900 truncate">
                    {boundOfficer.email}
                  </div>
                  <div className="text-[10px] text-slate-600 leading-tight truncate">
                    {boundOfficer.departmentOrAgency}
                  </div>
                </div>
              </div>
            </div>

            <button
              id="btn-open-officer-parichay-modal"
              onClick={() => setIsOfficerModalOpen(true)}
              className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-950 active:bg-slate-950 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{t('userTypeSelection.enterOfficer', 'Login with JanParichay SSO')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 3. SYSTEM ADMINISTRATOR CARD */}
          {/* ========================================================================= */}
          <div
            id="card-admin-auth"
            className="bg-white border-2 border-slate-200 hover:border-purple-600 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-2xs">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                  IT & SYSTEM INFRASTRUCTURE
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                {t('userTypeSelection.adminCardTitle', 'System Administrator')}
              </h2>
              <p className="text-xs font-bold text-purple-600 mb-3">
                {t('userTypeSelection.adminCardSubtitle', 'Platform SuperAdmin')}
              </p>

              {/* Pre-Bound Admin Credential Preview */}
              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3 mb-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
                    SUPERADMIN IDENTITY:
                  </span>
                  <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                    2FA TOTP
                  </span>
                </div>
                <div className="p-2 bg-white border border-purple-200 rounded-lg text-xs space-y-1">
                  <div className="text-[11px] font-mono font-bold text-purple-950 truncate">
                    {MOCK_SYSTEM_ADMIN_CREDENTIALS.email}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-600">
                    <span>Hardware 2FA: Active</span>
                    <span className="font-mono font-bold text-purple-700">Code: {MOCK_SYSTEM_ADMIN_CREDENTIALS.totpCode}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              id="btn-open-admin-modal"
              onClick={() => setIsAdminModalOpen(true)}
              className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{t('userTypeSelection.enterAdmin', 'Enter Admin Console')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 4. AUDITOR CARD */}
          {/* ========================================================================= */}
          <div
            id="card-auditor-auth"
            className="bg-white border-2 border-slate-200 hover:border-emerald-600 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
                  <Search className="w-6 h-6" />
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider rounded-md border border-emerald-200">
                  READ-ONLY FORENSIC ACCESS
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                {t('userTypeSelection.auditorCardTitle', 'Auditor')}
              </h2>
              <p className="text-xs font-bold text-emerald-600 mb-3">
                {t('userTypeSelection.auditorCardSubtitle', 'CAG & Statutory Vigilance Inspection')}
              </p>

              {/* Pre-Bound Auditor PKI Credential Preview */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 mb-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                    CAG AUDITOR IDENTITY:
                  </span>
                  <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                    FIPS-140-2
                  </span>
                </div>
                <div className="p-2 bg-white border border-emerald-200 rounded-lg text-xs space-y-1">
                  <div className="text-[11px] font-bold text-slate-900 truncate">
                    {MOCK_AUDITOR_CREDENTIALS.name.split(',')[0]}
                  </div>
                  <div className="text-[10px] text-slate-600 truncate">
                    {MOCK_AUDITOR_CREDENTIALS.organization}
                  </div>
                </div>
              </div>
            </div>

            <button
              id="btn-open-auditor-modal"
              onClick={() => setIsAuditorModalOpen(true)}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{t('userTypeSelection.enterAuditor', 'Enter Audit Portal (Read-Only)')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* National Macro Analytics Indicators Strip */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-700" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                National Land Acquisition Telemetry
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              Live RFCTLARR 2013 Statutory Compliance Monitor
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider">Active Corridors</span>
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {totalProjectsCount} Projects
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Across {activeStatesCount} Union States / UTs
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider">Demarcated Land</span>
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {totalLandAcres.toLocaleString()} Acres
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Notified Sec 11 / 19 Alignments
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider">Compensation Paid</span>
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                ₹{totalCompensationCr.toLocaleString()} Cr
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Disbursed via PFMS v2.4
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider">Demarcated Parcels</span>
                <Layers className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {totalParcelsCount}+ Parcels
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Acquisition Project Registry
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Official National Portal Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-5 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-900 font-serif font-black flex items-center justify-center text-sm border border-blue-200">
              🇮🇳
            </div>
            <div>
              <p className="font-bold text-slate-900">
                National Land Acquisition & Management System (NLAMS)
              </p>
              <p className="text-[11px] text-slate-500">
                Ministry of Rural Development & Department of Land Resources (DoLR), Government of India
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
            <span>RFCTLARR Act, 2013 Statutory Compliance</span>
            <span>•</span>
            <span>PFMS v2.4 Certified</span>
            <span>•</span>
            <span>Live OpenStreetMap Geospatial Integration</span>
            <span>•</span>
            <span className="font-mono text-slate-400">v2.1.0-eGov</span>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* AUTHENTICATION MODALS */}
      {/* ========================================================================= */}
      <CitizenAuthModal
        isOpen={isCitizenModalOpen}
        onClose={() => setIsCitizenModalOpen(false)}
        initialPhone={citizenPhoneInput}
      />

      <OfficerParichayModal
        isOpen={isOfficerModalOpen}
        onClose={() => setIsOfficerModalOpen(false)}
        selectedRole={selectedOfficerRole}
        onSelectRole={(r) => setSelectedOfficerRole(r)}
      />

      <SystemAdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <AuditorAuthModal
        isOpen={isAuditorModalOpen}
        onClose={() => setIsAuditorModalOpen(false)}
      />
    </div>
  );
};
