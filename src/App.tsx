import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProjectsList } from './components/ProjectsList';
import { ParcelsModule } from './components/ParcelsModule';
import { NotificationsModule } from './components/NotificationsModule';
import { GISParcelViewer } from './components/GISParcelViewer';
import { AwardsModule } from './components/AwardsModule';
import { CompensationModule } from './components/CompensationModule';
import { PossessionModule } from './components/PossessionModule';
import { RRModule } from './components/RRModule';
import { GrievancesModule } from './components/GrievancesModule';
import { ReportsModule } from './components/ReportsModule';
import { AuditTrailModule } from './components/AuditTrailModule';
import { CitizenPortal } from './components/CitizenPortal';
import { SettingsModule } from './components/SettingsModule';
import { UserTypeSelection } from './components/UserTypeSelection';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import {
  isTabAllowedForRole,
  getDefaultTabForRole,
  getRoleJurisdictionInfo
} from './utils/rbacPermissions';

import { AIAssistant } from './components/AIAssistant';

const MainContent: React.FC = () => {
  const { activeTab, portalUserType, role, setActiveTab } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Automatically synchronize activeTab with role permissions when switching or entering
  React.useEffect(() => {
    if (portalUserType !== 'unselected') {
      if (!isTabAllowedForRole(role, portalUserType, activeTab)) {
        setActiveTab(getDefaultTabForRole(role, portalUserType));
      }
    }
  }, [role, portalUserType, activeTab, setActiveTab]);

  // If user hasn't selected a user type yet, show the First Screen: Welcome to NLAMS
  if (portalUserType === 'unselected') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-blue-800 selection:text-white">
        <DisclaimerBanner />
        <UserTypeSelection />
      </div>
    );
  }

  // RBAC Enforcement for view rendering
  const renderModule = () => {
    // If activeTab is 'Dashboard', route directly to the role's primary dashboard:
    // Citizen opens CitizenPortal, Auditor opens AuditTrailModule.
    if (activeTab === 'Dashboard') {
      if (portalUserType === 'citizen' || role === 'Public/Citizen') {
        return <CitizenPortal />;
      }
      if (portalUserType === 'auditor' || role === 'Auditor') {
        return <AuditTrailModule />;
      }
    }

    // Check if the current tab is permitted for the active role
    if (!isTabAllowedForRole(role, portalUserType, activeTab)) {
      const jurisdiction = getRoleJurisdictionInfo(role, portalUserType);
      const fallbackTab = getDefaultTabForRole(role, portalUserType);
      return (
        <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-amber-200 rounded-2xl shadow-xs text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-black uppercase tracking-widest rounded border border-amber-200">
            Statutory Scope Restriction (RFCTLARR Act, 2013)
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-3">
            Module &quot;{activeTab}&quot; Not Authorized for {role}
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
            Under your statutory jurisdiction (<strong className="text-slate-900">{jurisdiction.jurisdictionBadge}</strong>), direct access to the <strong>{activeTab}</strong> module is restricted to enforce segregation of powers under the RFCTLARR Act, 2013.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab(fallbackTab)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Authorized Dashboard</span>
            </button>
          </div>
        </div>
      );
    }

    // Citizen Portal
    if (portalUserType === 'citizen') {
      if (activeTab === 'Grievances') return <GrievancesModule />;
      return <CitizenPortal />;
    }

    // Auditor Portal
    if (portalUserType === 'auditor') {
      switch (activeTab) {
        case 'Audit Trail':
          return <AuditTrailModule />;
        case 'Reports':
          return <ReportsModule />;
        case 'Compensation':
          return <CompensationModule />;
        case 'Awards':
          return <AwardsModule />;
        case 'Projects':
          return <ProjectsList />;
        case 'Land Parcels':
          return <ParcelsModule />;
        case 'GIS Map':
          return <GISParcelViewer />;
        default:
          return <AuditTrailModule />;
      }
    }

    // Officer & Administrator Navigation
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Projects':
        return <ProjectsList />;
      case 'Land Parcels':
        return <ParcelsModule />;
      case 'Notifications':
        return <NotificationsModule />;
      case 'Awards':
        return <AwardsModule />;
      case 'Compensation':
        return <CompensationModule />;
      case 'Possession':
        return <PossessionModule />;
      case 'Rehabilitation & Resettlement':
        return <RRModule />;
      case 'GIS Map':
        return <GISParcelViewer />;
      case 'Grievances':
        return <GrievancesModule />;
      case 'Reports':
        return <ReportsModule />;
      case 'Audit Trail':
        return <AuditTrailModule />;
      case 'Public Portal':
        return <CitizenPortal />;
      case 'Settings':
        if (portalUserType === 'admin') return <SettingsModule />;
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-blue-800 selection:text-white">
      {/* Statutory & Demonstration Disclaimer Banner */}
      <DisclaimerBanner />

      {/* National Portal Header with Role Switcher, Alerts, and Search */}
      <Header onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)} />

      {/* Main Structural Body: Sidebar + Dynamic Workspace View */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderModule()}
        </main>
      </div>

      {/* National Portal Official Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-6 px-6">
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
    </div>
  );
};

const AIAssistantWrapper: React.FC = () => {
  const { portalUserType } = useApp();
  if (portalUserType !== 'officer' && portalUserType !== 'auditor') {
    return null;
  }
  return <AIAssistant />;
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
      <AIAssistantWrapper />
    </AppProvider>
  );
}
