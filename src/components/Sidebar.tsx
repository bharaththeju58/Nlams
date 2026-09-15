import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  X,
  Building2,
  ShieldAlert,
  Search,
  User,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import {
  getRoleNavigationItems,
  getRoleJurisdictionInfo
} from '../utils/rbacPermissions';
import { getLocalizedNavLabel } from '../utils/translateNav';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    setSelectedProjectId,
    grievances,
    projects,
    role,
    authenticatedOfficer,
    portalUserType,
    logout
  } = useApp();

  const activeGrievances = grievances.filter(g => g.status === 'Submitted' || g.status === 'Action Required').length;
  const pendingScrutiny = projects.filter(p => p.scrutinyStatus === 'Pending').length;

  // Strict RBAC role navigation items
  const rawNavItems = getRoleNavigationItems(role, portalUserType);
  const NAV_ITEMS = rawNavItems.map(item => {
    let count: number | undefined = undefined;
    if (item.badgeCountKey === 'activeGrievances' && activeGrievances > 0) {
      count = activeGrievances;
    } else if (item.badgeCountKey === 'pendingScrutiny' && pendingScrutiny > 0) {
      count = pendingScrutiny;
    }
    return {
      ...item,
      badgeCount: count
    };
  });

  const jurisdictionInfo = getRoleJurisdictionInfo(role, portalUserType);

  const handleSelect = (tab: NavigationTab) => {
    setActiveTab(tab);
    setSelectedProjectId(null);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200">
      {/* Sidebar Header with Bold Brand Typography */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center text-white font-black text-sm shadow-xs border border-blue-800">
            NL
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-blue-900 leading-none">
              NLAMS
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              National Land System
            </p>
          </div>
        </div>
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Active User Account & Portal Information with Jurisdictional Badge */}
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
            {t('header.activeSession', 'Active Session')}
          </span>
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${jurisdictionInfo.badgeBgClass} ${jurisdictionInfo.badgeTextClass} ${jurisdictionInfo.badgeBorderClass}`}>
            {jurisdictionInfo.jurisdictionBadge}
          </span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-xs">
          {portalUserType === 'citizen' && (
            <>
              <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block truncate">{t('userTypeSelection.citizenCardTitle', 'Citizen Portal')}</span>
                <span className="text-[10px] text-slate-500 block">{t('citizen.landownerAccess', 'Landowner Access')}</span>
              </div>
            </>
          )}
          {portalUserType === 'officer' && (
            <>
              <Building2 className="w-4 h-4 text-slate-700 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block truncate" title={authenticatedOfficer ? authenticatedOfficer.name : 'Government Officer'}>
                  {authenticatedOfficer ? authenticatedOfficer.name : t('userTypeSelection.officerCardTitle', 'Government Officer')}
                </span>
                <span className="text-[10px] text-slate-500 block truncate" title={authenticatedOfficer?.designationLabel || role}>
                  {authenticatedOfficer?.designationLabel || role}
                </span>
              </div>
            </>
          )}
          {portalUserType === 'admin' && (
            <>
              <ShieldAlert className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block truncate">{t('userTypeSelection.adminCardTitle', 'System Administrator')}</span>
                <span className="text-[10px] text-purple-600 block">Enterprise Clearance</span>
              </div>
            </>
          )}
          {portalUserType === 'auditor' && (
            <>
              <Search className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block truncate">{t('userTypeSelection.auditorCardTitle', 'CAG Auditor')}</span>
                <span className="text-[10px] text-emerald-600 block">Forensic Oversight</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        <div className="px-2 pt-2 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {portalUserType === 'citizen'
            ? t('citizen.portalTitle', 'Citizen Navigation')
            : portalUserType === 'auditor'
            ? t('auditTrail.title', 'Audit Modules')
            : t('common.rfctlarrAct', 'Permitted Modules')}
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const localizedLabel = getLocalizedNavLabel(item.id, item.label, t);
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all group cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-black shadow-2xs border-l-3 border-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="truncate tracking-tight">{localizedLabel}</span>
              </div>
              {item.badgeCount !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black tracking-wider ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer with Log Out Action */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2.5">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-red-50 active:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
          title={t('common.logout', 'Log Out of System')}
          aria-label={t('common.logout', 'Log Out of System')}
        >
          <LogOut className="w-3.5 h-3.5 text-red-600" />
          <span>{t('common.logout', 'Log Out')}</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
          <span className="font-semibold text-slate-600">RFCTLARR 2013</span>
          <span className="font-mono text-[10px] text-slate-400">v2.1.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
