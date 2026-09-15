import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { RRDashboard } from './rr/RRDashboard';
import { RRFamilies } from './rr/RRFamilies';
import { RRPlans } from './rr/RRPlans';
import { RRProgress } from './rr/RRProgress';
import { RRBenefits } from './rr/RRBenefits';
import { RRGrievances } from './rr/RRGrievances';
import { RRDocuments } from './rr/RRDocuments';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  TrendingUp,
  IndianRupee,
  MessageSquareWarning,
  FileText,
  RotateCw,
  Building2,
  ShieldCheck
} from 'lucide-react';

export const RRModule: React.FC = () => {
  const { t } = useTranslation();
  const {
    projects,
    refreshRRData,
    toastMessage,
    role
  } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await refreshRRData();
    } finally {
      setIsSyncing(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: t('rr.overviewDashboard', 'Overview Dashboard'), icon: LayoutDashboard },
    { id: 'families', label: t('rr.affectedFamilies', 'Affected Families'), icon: Users },
    { id: 'plans', label: t('rr.plansAmenities', 'R&R Plans & Amenities'), icon: FileCheck },
    { id: 'progress', label: t('rr.lifecycleProgress', 'Lifecycle Progress'), icon: TrendingUp },
    { id: 'benefits', label: t('rr.compensationDbt', 'Compensation & DBT'), icon: IndianRupee },
    { id: 'grievances', label: t('rr.grievanceRedressal', 'Grievance Redressal'), icon: MessageSquareWarning },
    { id: 'documents', label: t('rr.statutoryArchive', 'Statutory Archive'), icon: FileText },
  ];

  return (
    <div className="space-y-6 pb-12" id="rr-module-root">
      {/* Top Banner & Context Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-teal-100 text-teal-900 border border-teal-200">
              RFCTLARR Act 2013 • Second & Third Schedules
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {t('rr.statutoryAdministration', 'Statutory Administration')}
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            {t('rr.title', 'Rehabilitation & Resettlement (R&R) Directorate')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('rr.subtitle', 'Live statutory monitoring of displaced families, civic colony infrastructure, DBT entitlements, and grievance tribunals')}
          </p>
        </div>

        {/* Project Selector & Sync Button */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t('rr.filterByProject', 'Filter by Project')}</label>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-blue-600 shadow-2xs cursor-pointer"
            >
              <option value="ALL">{t('rr.allProjects', 'All Acquisition Projects (Aggregated)')}</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            title="Synchronize with Backend Database"
            className="self-end p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* National Read-Only Monitoring Banner */}
      {role === 'Central Sponsoring Ministry' && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 text-xs text-sky-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0" />
            <span>
              <strong>National Read-Only Monitoring Mode:</strong> Active oversight session for Central Sponsoring Ministry. R&R scheme approvals, census registrations, and Second Schedule disbursements are administered by the State Rehabilitation & Resettlement Authority.
            </span>
          </div>
          <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-black text-[10px] uppercase tracking-wider whitespace-nowrap">
            Read-Only
          </span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-1 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {activeTab === 'dashboard' && (
          <RRDashboard
            selectedProjectId={selectedProjectId}
            onNavigateTab={tabId => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'families' && (
          <RRFamilies selectedProjectId={selectedProjectId} />
        )}

        {activeTab === 'plans' && (
          <RRPlans selectedProjectId={selectedProjectId} />
        )}

        {activeTab === 'progress' && (
          <RRProgress selectedProjectId={selectedProjectId} />
        )}

        {activeTab === 'benefits' && (
          <RRBenefits selectedProjectId={selectedProjectId} />
        )}

        {activeTab === 'grievances' && (
          <RRGrievances selectedProjectId={selectedProjectId} />
        )}

        {activeTab === 'documents' && (
          <RRDocuments selectedProjectId={selectedProjectId} />
        )}
      </div>
    </div>
  );
};
