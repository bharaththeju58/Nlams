import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { LanguageSelector } from './LanguageSelector';
import {
  Bell,
  Search,
  ShieldCheck,
  User,
  Menu,
  AlertCircle,
  LogOut,
  ChevronDown,
  Building2,
  Check,
  Shield,
  Layers
} from 'lucide-react';
import { getRoleJurisdictionInfo, getDefaultTabForRole } from '../utils/rbacPermissions';
import { SECTOR_AGNOSTIC_OFFICER_ROLES, getOfficerCredentialByRole } from '../data/officialAuthData';
import { UserRole } from '../types';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { t } = useTranslation();
  const {
    role,
    authenticatedOfficer,
    alerts,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    portalUserType,
    switchUserRole,
    logout
  } = useApp();
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const isCitizenMode = portalUserType === 'citizen' || role === 'Public/Citizen';
  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;
  const jurisdictionInfo = getRoleJurisdictionInfo(role, portalUserType);

  const handleSelectOfficerRole = (targetRole: UserRole) => {
    const creds = getOfficerCredentialByRole(targetRole);
    switchUserRole(targetRole, 'officer', creds);
    setShowRoleSwitcher(false);
  };

  const handleSelectAuditor = () => {
    switchUserRole('Auditor', 'auditor', null);
    setShowRoleSwitcher(false);
  };

  const handleSelectCitizen = () => {
    switchUserRole('Public/Citizen', 'citizen', null);
    setShowRoleSwitcher(false);
  };

  const handleSelectAdmin = () => {
    switchUserRole('System Administrator', 'admin', null);
    setShowRoleSwitcher(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Indian National Tricolor Accent Bar */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left Section: Mobile Menu & Bold App Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab(getDefaultTabForRole(role, portalUserType))}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* National Seal / NLAMS Icon */}
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-xs border border-blue-800">
              <div className="flex flex-col items-center justify-center leading-none font-black text-xs tracking-tighter">
                <span className="text-[10px] text-amber-400 font-black">GOI</span>
                <span className="text-[11px] tracking-wider text-white font-black">NLAMS</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors leading-none">
                  NLAMS
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
                  {t('common.eGovernance', 'e-Governance')}
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200">
                  {t('common.rfctlarrAct', 'RFCTLARR 2013')}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 hidden sm:block">
                {t('common.appSubtitle', 'National Land Acquisition & Management System')}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Bold styled Search input */}
        <div className="hidden md:flex items-center max-w-xs xl:max-w-md w-full relative">
          <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={t('common.searchPlaceholder', 'Search project ID, survey number, village...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 font-semibold placeholder-slate-400 outline-none transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              {t('common.clear', 'Clear')}
            </button>
          )}
        </div>

        {/* Right Section: Language Selector + Alert Badge + Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Global Language Selector */}
          <LanguageSelector compact={false} />

          {/* Design Theme Alert Pill (Officers / Admin only) */}
          {!isCitizenMode && activeAlertsCount > 0 && (
            <div
              onClick={() => setShowAlertMenu(!showAlertMenu)}
              className="hidden sm:flex items-center px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-amber-100/80 transition-colors shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse flex-shrink-0" />
              <span>{t('header.activeAlertsCount', { count: activeAlertsCount, defaultValue: `${activeAlertsCount} Rule Alerts` })}</span>
            </div>
          )}

          {/* Rule-based Alerts Circular Bell (Officers / Admin only) */}
          {!isCitizenMode && (
            <div className="relative">
              <button
                onClick={() => setShowAlertMenu(!showAlertMenu)}
                className="relative w-9 h-9 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-900 hover:border-slate-300 transition-colors bg-white shadow-2xs"
                title="Rule-based Alerts"
                aria-label="View Rule Alerts"
              >
                <Bell className="w-4 h-4" />
                {activeAlertsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                    {activeAlertsCount}
                  </span>
                )}
              </button>

            {showAlertMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-black text-xs text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Rule-Based Monitoring Alerts
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                    {activeAlertsCount} Active
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setShowAlertMenu(false);
                        if (alert.actionRoute) setActiveTab(alert.actionRoute as any);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                            alert.severity === 'Critical'
                              ? 'bg-red-600 ring-2 ring-red-200'
                              : alert.severity === 'High'
                              ? 'bg-orange-500'
                              : 'bg-amber-400'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-xs font-black text-slate-900 leading-tight">
                            {alert.title}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 font-medium">
                            {alert.description}
                          </p>
                          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                            <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">{alert.module}</span>
                            <span className="text-blue-700 font-bold hover:underline">
                              {alert.actionLabel || 'Inspect'} →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] font-bold text-slate-500 text-center uppercase tracking-wider">
                  Rule-based alerts under statutory timeframes • Non-predictive
                </div>
              </div>
            )}
          </div>
          )}

          {/* Jurisdictional Clearance Badge & Interactive Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs ${jurisdictionInfo.badgeBgClass} ${jurisdictionInfo.badgeBorderClass}`}
              title="Click to switch active role and jurisdiction clearance"
              id="btn-switch-jurisdiction"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-2xs text-blue-900 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${jurisdictionInfo.badgeTextClass}`}>
                    {jurisdictionInfo.jurisdictionBadge}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="block text-[11px] font-bold text-slate-700 line-clamp-1 max-w-[200px] leading-tight">
                  {authenticatedOfficer ? authenticatedOfficer.name : (isCitizenMode ? 'Public / Landowner' : role)}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* Dropdown Menu for Switching Roles */}
            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden text-xs">
                <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 block">
                      Demo Role & Jurisdiction Switcher
                    </span>
                    <h3 className="text-xs font-black tracking-tight mt-0.5">
                      Statutory RFCTLARR RBAC Switcher
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowRoleSwitcher(false)}
                    className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100">
                  {/* Sector-Agnostic National Governance Hierarchy */}
                  <div className="pb-1.5">
                    <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      National Governance Hierarchy (6 Roles)
                    </span>
                    <div className="space-y-1 mt-1">
                      {SECTOR_AGNOSTIC_OFFICER_ROLES.map((r, idx) => {
                        const isSelected = portalUserType === 'officer' && role === r.role;
                        const creds = getOfficerCredentialByRole(r.role);
                        return (
                          <button
                            key={r.role}
                            onClick={() => handleSelectOfficerRole(r.role)}
                            className={`w-full text-left p-2 rounded-lg transition flex items-start justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 border border-blue-300 text-blue-950 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono font-bold text-slate-400">0{idx + 1}.</span>
                                <span className="font-black text-xs text-slate-900 truncate">
                                  {r.role}
                                </span>
                              </div>
                              <span className="block text-[10px] text-blue-700 font-bold mt-0.5">
                                {creds.name} • {creds.designationLabel}
                              </span>
                              <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase tracking-wider">
                                {r.clearance}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-blue-700 flex-shrink-0 mt-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Public & Auditor Roles */}
                  <div className="pt-2 pb-1 space-y-1">
                    <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      Other Statutory Roles
                    </span>

                    {/* CAG Auditor */}
                    <button
                      onClick={handleSelectAuditor}
                      className={`w-full text-left p-2 rounded-lg transition flex items-start justify-between gap-2 cursor-pointer ${
                        portalUserType === 'auditor'
                          ? 'bg-blue-50 border border-blue-300 text-blue-950 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-black text-xs text-slate-900 block">
                          Comptroller & Auditor General (CAG)
                        </span>
                        <span className="block text-[10px] text-slate-500 font-medium">
                          Forensic Read-Only Inspection • Immutable Hash Verification
                        </span>
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase tracking-wider">
                          CAG Forensic Audit (Read-Only)
                        </span>
                      </div>
                      {portalUserType === 'auditor' && (
                        <Check className="w-4 h-4 text-blue-700 flex-shrink-0 mt-1" />
                      )}
                    </button>

                    {/* Affected Citizen */}
                    <button
                      onClick={handleSelectCitizen}
                      className={`w-full text-left p-2 rounded-lg transition flex items-start justify-between gap-2 cursor-pointer ${
                        portalUserType === 'citizen'
                          ? 'bg-blue-50 border border-blue-300 text-blue-950 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-black text-xs text-slate-900 block">
                          Affected Landowner / Citizen
                        </span>
                        <span className="block text-[10px] text-slate-500 font-medium">
                          Aadhaar/OTP Verified Landowner Access & Records
                        </span>
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-black uppercase tracking-wider">
                          Public Citizen Portal
                        </span>
                      </div>
                      {portalUserType === 'citizen' && (
                        <Check className="w-4 h-4 text-blue-700 flex-shrink-0 mt-1" />
                      )}
                    </button>

                    {/* System Administrator */}
                    <button
                      onClick={handleSelectAdmin}
                      className={`w-full text-left p-2 rounded-lg transition flex items-start justify-between gap-2 cursor-pointer ${
                        portalUserType === 'admin'
                          ? 'bg-blue-50 border border-blue-300 text-blue-950 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-black text-xs text-slate-900 block">
                          System Administrator (NIC MeghRaj)
                        </span>
                        <span className="block text-[10px] text-slate-500 font-medium">
                          Full Platform Administration & Security Maintenance
                        </span>
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded text-[9px] font-black uppercase tracking-wider">
                          MeghRaj Platform SuperAdmin
                        </span>
                      </div>
                      {portalUserType === 'admin' && (
                        <Check className="w-4 h-4 text-blue-700 flex-shrink-0 mt-1" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 text-center font-medium">
                  Permissions automatically update navigation links and read/write rules.
                </div>
              </div>
            )}
          </div>

          {/* Official Log Out Action */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title={t('common.logout', 'Log Out')}
            aria-label={t('common.logout', 'Log Out')}
          >
            <LogOut className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            <span>{t('common.logout', 'Log Out')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
