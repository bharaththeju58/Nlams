import { UserRole } from '../types';
import { NavigationTab, PortalUserType } from '../context/AppContext';
import {
  LayoutDashboard,
  Briefcase,
  MapPin,
  BellRing,
  Award,
  CreditCard,
  FileCheck2,
  Home,
  Map,
  MessageSquareWarning,
  FileSpreadsheet,
  History,
  Globe,
  Settings2,
  LucideIcon
} from 'lucide-react';

export interface RoleNavConfigItem {
  id: NavigationTab;
  label: string;
  icon: LucideIcon;
  badgeCountKey?: 'activeGrievances' | 'pendingScrutiny';
}

export interface RoleJurisdictionInfo {
  role: UserRole;
  portalUserType: PortalUserType;
  jurisdictionBadge: string;
  clearanceLabel: string;
  badgeBgClass: string;
  badgeTextClass: string;
  badgeBorderClass: string;
  allowedTabs: NavigationTab[];
  defaultTab: NavigationTab;
  // Permissions flags
  canEditCadastralBoundary: boolean;
  canAuthorizePFMS: boolean;
  canSubmitRequisition: boolean;
  canDepositEscrow: boolean;
  canApproveScrutiny: boolean;
  canSignSec11Sec19: boolean;
  canDeclareAward: boolean;
  canAdjudicateGrievance: boolean;
  canConductRRCensus: boolean;
  canSanctionRRBenefits: boolean;
  canAcknowledgeRoW: boolean;
  canReportEncroachment: boolean;
  canViewFinancialAwards: boolean;
  isNationalMonitoringReadOnly: boolean;
}

export const ROLE_JURISDICTION_REGISTRY: Record<string, RoleJurisdictionInfo> = {
  'Central Sponsoring Ministry': {
    role: 'Central Sponsoring Ministry',
    portalUserType: 'officer',
    jurisdictionBadge: 'National Read-Only Oversight',
    clearanceLabel: 'Union Cross-Sector Oversight • Read-Only Monitoring',
    badgeBgClass: 'bg-blue-50',
    badgeTextClass: 'text-blue-900',
    badgeBorderClass: 'border-blue-200',
    allowedTabs: ['Dashboard', 'Projects', 'GIS Map', 'Compensation', 'Reports'],
    defaultTab: 'Dashboard',
    canEditCadastralBoundary: false,
    canAuthorizePFMS: false,
    canSubmitRequisition: true,
    canDepositEscrow: false,
    canApproveScrutiny: false,
    canSignSec11Sec19: false,
    canDeclareAward: false,
    canAdjudicateGrievance: false,
    canConductRRCensus: false,
    canSanctionRRBenefits: false,
    canAcknowledgeRoW: false,
    canReportEncroachment: false,
    canViewFinancialAwards: true,
    isNationalMonitoringReadOnly: true
  },
  'Requiring Body / Proponent (PSU / Department)': {
    role: 'Requiring Body / Proponent (PSU / Department)',
    portalUserType: 'officer',
    jurisdictionBadge: 'Proponent Requisition Jurisdiction',
    clearanceLabel: 'Executing Proponent • Requisition & Escrow Purview',
    badgeBgClass: 'bg-indigo-50',
    badgeTextClass: 'text-indigo-900',
    badgeBorderClass: 'border-indigo-200',
    allowedTabs: ['Dashboard', 'Projects', 'Land Parcels', 'Possession', 'GIS Map'],
    defaultTab: 'Dashboard',
    canEditCadastralBoundary: false,
    canAuthorizePFMS: false,
    canSubmitRequisition: true,
    canDepositEscrow: true,
    canApproveScrutiny: false,
    canSignSec11Sec19: false,
    canDeclareAward: false,
    canAdjudicateGrievance: false,
    canConductRRCensus: false,
    canSanctionRRBenefits: false,
    canAcknowledgeRoW: false,
    canReportEncroachment: false,
    canViewFinancialAwards: false,
    isNationalMonitoringReadOnly: false
  },
  'State Revenue & Nodal Authority': {
    role: 'State Revenue & Nodal Authority',
    portalUserType: 'officer',
    jurisdictionBadge: 'State Revenue Nodal Authority',
    clearanceLabel: 'State Revenue Secretariat • Statutory Scrutiny & Gazette',
    badgeBgClass: 'bg-emerald-50',
    badgeTextClass: 'text-emerald-900',
    badgeBorderClass: 'border-emerald-200',
    allowedTabs: ['Dashboard', 'Projects', 'Notifications', 'GIS Map', 'Reports'],
    defaultTab: 'Dashboard',
    canEditCadastralBoundary: true,
    canAuthorizePFMS: false,
    canSubmitRequisition: false,
    canDepositEscrow: false,
    canApproveScrutiny: true,
    canSignSec11Sec19: false, // Collector has CALA signing power under Sec 11/19
    canDeclareAward: false,
    canAdjudicateGrievance: false,
    canConductRRCensus: false,
    canSanctionRRBenefits: false,
    canAcknowledgeRoW: false,
    canReportEncroachment: false,
    canViewFinancialAwards: true,
    isNationalMonitoringReadOnly: false
  },
  'Competent Authority (District Collector / CALA)': {
    role: 'Competent Authority (District Collector / CALA)',
    portalUserType: 'officer',
    jurisdictionBadge: 'Krishnagiri District CALA',
    clearanceLabel: 'District Competent Authority • Full Operational Powers',
    badgeBgClass: 'bg-amber-50',
    badgeTextClass: 'text-amber-900',
    badgeBorderClass: 'border-amber-200',
    allowedTabs: [
      'Dashboard',
      'Projects',
      'Land Parcels',
      'Notifications',
      'Awards',
      'Compensation',
      'Possession',
      'Grievances',
      'GIS Map'
    ],
    defaultTab: 'Dashboard',
    canEditCadastralBoundary: true,
    canAuthorizePFMS: true,
    canSubmitRequisition: true,
    canDepositEscrow: false,
    canApproveScrutiny: true,
    canSignSec11Sec19: true,
    canDeclareAward: true,
    canAdjudicateGrievance: true,
    canConductRRCensus: true,
    canSanctionRRBenefits: true,
    canAcknowledgeRoW: true,
    canReportEncroachment: true,
    canViewFinancialAwards: true,
    isNationalMonitoringReadOnly: false
  },
  'Rehabilitation & Resettlement (R&R) Authority': {
    role: 'Rehabilitation & Resettlement (R&R) Authority',
    portalUserType: 'officer',
    jurisdictionBadge: 'R&R Commissionerate (Sec 43)',
    clearanceLabel: 'R&R Commissionerate • Schedule II/III Entitlements',
    badgeBgClass: 'bg-teal-50',
    badgeTextClass: 'text-teal-900',
    badgeBorderClass: 'border-teal-200',
    allowedTabs: ['Dashboard', 'Rehabilitation & Resettlement', 'Grievances', 'Reports'],
    defaultTab: 'Dashboard',
    canEditCadastralBoundary: false,
    canAuthorizePFMS: false,
    canSubmitRequisition: false,
    canDepositEscrow: false,
    canApproveScrutiny: false,
    canSignSec11Sec19: false,
    canDeclareAward: false,
    canAdjudicateGrievance: true, // R&R grievances
    canConductRRCensus: true,
    canSanctionRRBenefits: true,
    canAcknowledgeRoW: false,
    canReportEncroachment: false,
    canViewFinancialAwards: false, // Exclude land valuation triggers
    isNationalMonitoringReadOnly: false
  },
  'Project Implementing Agency (PIA / Concessionaire)': {
    role: 'Project Implementing Agency (PIA / Concessionaire)',
    portalUserType: 'officer',
    jurisdictionBadge: 'PIA Right-of-Way Execution',
    clearanceLabel: 'PIA / Concessionaire • RoW Possession & Physical Works',
    badgeBgClass: 'bg-orange-50',
    badgeTextClass: 'text-orange-900',
    badgeBorderClass: 'border-orange-200',
    allowedTabs: ['Dashboard', 'Possession', 'GIS Map', 'Reports'],
    defaultTab: 'Dashboard',
    canEditCadastralBoundary: false,
    canAuthorizePFMS: false,
    canSubmitRequisition: false,
    canDepositEscrow: false,
    canApproveScrutiny: false,
    canSignSec11Sec19: false,
    canDeclareAward: false,
    canAdjudicateGrievance: false,
    canConductRRCensus: false,
    canSanctionRRBenefits: false,
    canAcknowledgeRoW: true,
    canReportEncroachment: true,
    canViewFinancialAwards: false, // Redact financial awards from PIA
    isNationalMonitoringReadOnly: false
  },
  'System Administrator': {
    role: 'System Administrator',
    portalUserType: 'admin',
    jurisdictionBadge: 'MeghRaj Platform SuperAdmin',
    clearanceLabel: 'Enterprise Security • Full System Administration',
    badgeBgClass: 'bg-purple-50',
    badgeTextClass: 'text-purple-900',
    badgeBorderClass: 'border-purple-200',
    allowedTabs: [
      'Dashboard',
      'Projects',
      'Land Parcels',
      'Notifications',
      'Awards',
      'Compensation',
      'Possession',
      'Rehabilitation & Resettlement',
      'GIS Map',
      'Grievances',
      'Reports',
      'Audit Trail',
      'Public Portal',
      'Settings'
    ],
    defaultTab: 'Dashboard',
    canEditCadastralBoundary: true,
    canAuthorizePFMS: true,
    canSubmitRequisition: true,
    canDepositEscrow: true,
    canApproveScrutiny: true,
    canSignSec11Sec19: true,
    canDeclareAward: true,
    canAdjudicateGrievance: true,
    canConductRRCensus: true,
    canSanctionRRBenefits: true,
    canAcknowledgeRoW: true,
    canReportEncroachment: true,
    canViewFinancialAwards: true,
    isNationalMonitoringReadOnly: false
  },
  'Auditor': {
    role: 'Auditor',
    portalUserType: 'auditor',
    jurisdictionBadge: 'CAG Forensic Audit (Read-Only)',
    clearanceLabel: 'Comptroller & Auditor General • Non-Repudiable Read-Only',
    badgeBgClass: 'bg-slate-100',
    badgeTextClass: 'text-slate-900',
    badgeBorderClass: 'border-slate-300',
    allowedTabs: [
      'Audit Trail',
      'Reports',
      'Compensation',
      'Awards',
      'Projects',
      'Land Parcels',
      'GIS Map'
    ],
    defaultTab: 'Audit Trail',
    canEditCadastralBoundary: false,
    canAuthorizePFMS: false,
    canSubmitRequisition: false,
    canDepositEscrow: false,
    canApproveScrutiny: false,
    canSignSec11Sec19: false,
    canDeclareAward: false,
    canAdjudicateGrievance: false,
    canConductRRCensus: false,
    canSanctionRRBenefits: false,
    canAcknowledgeRoW: false,
    canReportEncroachment: false,
    canViewFinancialAwards: true,
    isNationalMonitoringReadOnly: true
  },
  'Public/Citizen': {
    role: 'Public/Citizen',
    portalUserType: 'citizen',
    jurisdictionBadge: 'Public Citizen Portal',
    clearanceLabel: 'Aadhaar/OTP Verified Landowner Access',
    badgeBgClass: 'bg-emerald-50',
    badgeTextClass: 'text-emerald-900',
    badgeBorderClass: 'border-emerald-200',
    allowedTabs: ['Public Portal', 'Grievances'],
    defaultTab: 'Public Portal',
    canEditCadastralBoundary: false,
    canAuthorizePFMS: false,
    canSubmitRequisition: false,
    canDepositEscrow: false,
    canApproveScrutiny: false,
    canSignSec11Sec19: false,
    canDeclareAward: false,
    canAdjudicateGrievance: false,
    canConductRRCensus: false,
    canSanctionRRBenefits: false,
    canAcknowledgeRoW: false,
    canReportEncroachment: false,
    canViewFinancialAwards: true,
    isNationalMonitoringReadOnly: false
  }
};

/**
 * Return strict, role-filtered navigation items for the Sidebar
 */
export const getRoleNavigationItems = (
  role: UserRole,
  portalUserType: PortalUserType
): RoleNavConfigItem[] => {
  // If Citizen
  if (portalUserType === 'citizen' || role === 'Public/Citizen') {
    return [
      { id: 'Public Portal', label: 'Citizen Portal', icon: Globe },
      { id: 'Grievances', label: 'Grievances', icon: MessageSquareWarning, badgeCountKey: 'activeGrievances' }
    ];
  }

  // If Auditor
  if (portalUserType === 'auditor' || role === 'Auditor') {
    return [
      { id: 'Audit Trail', label: 'Audit Trail & Hashes', icon: History },
      { id: 'Reports', label: 'Statutory Reports', icon: FileSpreadsheet },
      { id: 'Compensation', label: 'PFMS Disbursements', icon: CreditCard },
      { id: 'Awards', label: 'Statutory Awards', icon: Award },
      { id: 'Projects', label: 'Project Register', icon: Briefcase },
      { id: 'Land Parcels', label: 'Land Parcels', icon: MapPin },
      { id: 'GIS Map', label: 'GIS Map', icon: Map }
    ];
  }

  // If System Administrator
  if (portalUserType === 'admin' || role === 'System Administrator' || role === 'National Administrator') {
    return [
      { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'Projects', label: 'Projects & Scrutiny', icon: Briefcase, badgeCountKey: 'pendingScrutiny' },
      { id: 'Land Parcels', label: 'Land Parcels', icon: MapPin },
      { id: 'Notifications', label: 'Notifications', icon: BellRing },
      { id: 'Awards', label: 'Awards', icon: Award },
      { id: 'Compensation', label: 'Compensation (PFMS)', icon: CreditCard },
      { id: 'Possession', label: 'Possession Handover', icon: FileCheck2 },
      { id: 'Rehabilitation & Resettlement', label: 'R&R Management', icon: Home },
      { id: 'GIS Map', label: 'GIS Map', icon: Map },
      { id: 'Grievances', label: 'Grievances', icon: MessageSquareWarning, badgeCountKey: 'activeGrievances' },
      { id: 'Reports', label: 'Reports & Exports', icon: FileSpreadsheet },
      { id: 'Audit Trail', label: 'Audit Trail', icon: History },
      { id: 'Public Portal', label: 'Citizen Portal Preview', icon: Globe },
      { id: 'Settings', label: 'Settings & Integrations', icon: Settings2 }
    ];
  }

  // 1. Central Sponsoring Ministry
  // Include: Dashboard (National View), Projects & Scrutiny, GIS Map, Compensation (PFMS), Reports & Analytics.
  // Exclude: Land Parcels (Edit), Notifications (Drafting), Awards (Formulation), Possession Handover, R&R Management, Grievances.
  if (role === 'Central Sponsoring Ministry') {
    return [
      { id: 'Dashboard', label: 'Dashboard (National View)', icon: LayoutDashboard },
      { id: 'Projects', label: 'Projects & Scrutiny', icon: Briefcase, badgeCountKey: 'pendingScrutiny' },
      { id: 'GIS Map', label: 'GIS Map', icon: Map },
      { id: 'Compensation', label: 'Compensation (PFMS)', icon: CreditCard },
      { id: 'Reports', label: 'Reports & Analytics', icon: FileSpreadsheet }
    ];
  }

  // 2. Requiring Body / Proponent (PSU / Department)
  // Include: Dashboard (Proponent View), Projects & Scrutiny, Land Parcels (Proposed), Possession Handover, GIS Map.
  // Exclude: Notifications, Awards, Compensation (PFMS), R&R Management, Grievances.
  if (role === 'Requiring Body / Proponent (PSU / Department)' || role === 'Land Requiring Body') {
    return [
      { id: 'Dashboard', label: 'Dashboard (Proponent View)', icon: LayoutDashboard },
      { id: 'Projects', label: 'Projects & Scrutiny', icon: Briefcase, badgeCountKey: 'pendingScrutiny' },
      { id: 'Land Parcels', label: 'Land Parcels (Proposed)', icon: MapPin },
      { id: 'Possession', label: 'Possession Handover', icon: FileCheck2 },
      { id: 'GIS Map', label: 'GIS Map', icon: Map }
    ];
  }

  // 3. State Revenue & Nodal Authority
  // Include: Dashboard (State View), Projects & Scrutiny, Notifications, GIS Map, Reports & Analytics.
  // Exclude: Awards, Compensation (PFMS), Possession Handover, R&R Management, Grievances.
  if (role === 'State Revenue & Nodal Authority' || role === 'State Nodal Officer') {
    return [
      { id: 'Dashboard', label: 'Dashboard (State View)', icon: LayoutDashboard },
      { id: 'Projects', label: 'Projects & Scrutiny', icon: Briefcase, badgeCountKey: 'pendingScrutiny' },
      { id: 'Notifications', label: 'Notifications', icon: BellRing },
      { id: 'GIS Map', label: 'GIS Map', icon: Map },
      { id: 'Reports', label: 'Reports & Analytics', icon: FileSpreadsheet }
    ];
  }

  // 4. Competent Authority (District Collector / CALA)
  // Include: Dashboard (District View), Projects & Scrutiny, Land Parcels, Notifications, Awards, Compensation (PFMS), Possession Handover, Grievances, GIS Map.
  // Exclude: None (Complete district operational workflow).
  if (role === 'Competent Authority (District Collector / CALA)' || role === 'District Collector') {
    return [
      { id: 'Dashboard', label: 'Dashboard (District View)', icon: LayoutDashboard },
      { id: 'Projects', label: 'Projects & Scrutiny', icon: Briefcase, badgeCountKey: 'pendingScrutiny' },
      { id: 'Land Parcels', label: 'Land Parcels', icon: MapPin },
      { id: 'Notifications', label: 'Notifications', icon: BellRing },
      { id: 'Awards', label: 'Awards', icon: Award },
      { id: 'Compensation', label: 'Compensation (PFMS)', icon: CreditCard },
      { id: 'Possession', label: 'Possession Handover', icon: FileCheck2 },
      { id: 'Grievances', label: 'Grievances', icon: MessageSquareWarning, badgeCountKey: 'activeGrievances' },
      { id: 'GIS Map', label: 'GIS Map', icon: Map }
    ];
  }

  // 5. Rehabilitation & Resettlement (R&R) Authority
  // Include: Dashboard (R&R Purview), R&R Management, Grievances, Reports & Analytics.
  // Exclude: Land Parcels, Notifications, Awards, Compensation (PFMS), Possession Handover, GIS Map.
  if (
    role === 'Rehabilitation & Resettlement (R&R) Authority' ||
    role === 'Administrator (R&R) / Commissioner (RFCTLARR Sec 43)' ||
    role === 'R&R Officer'
  ) {
    return [
      { id: 'Dashboard', label: 'Dashboard (R&R Purview)', icon: LayoutDashboard },
      { id: 'Rehabilitation & Resettlement', label: 'R&R Management', icon: Home },
      { id: 'Grievances', label: 'Grievances', icon: MessageSquareWarning, badgeCountKey: 'activeGrievances' },
      { id: 'Reports', label: 'Reports & Analytics', icon: FileSpreadsheet }
    ];
  }

  // 6. Project Implementing Agency (PIA / Concessionaire)
  // Include: Dashboard (Execution View), Possession Handover, GIS Map, Reports & Analytics.
  // Exclude: Projects & Scrutiny, Land Parcels, Notifications, Awards, Compensation (PFMS), R&R Management, Grievances.
  if (
    role === 'Project Implementing Agency (PIA / Concessionaire)' ||
    role === 'Project Implementing Agency'
  ) {
    return [
      { id: 'Dashboard', label: 'Dashboard (Execution View)', icon: LayoutDashboard },
      { id: 'Possession', label: 'Possession Handover', icon: FileCheck2 },
      { id: 'GIS Map', label: 'GIS Map', icon: Map },
      { id: 'Reports', label: 'Reports & Analytics', icon: FileSpreadsheet }
    ];
  }

  // Default fallback for any other officer role: complete district operational workflow
  return [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Projects', label: 'Projects & Scrutiny', icon: Briefcase, badgeCountKey: 'pendingScrutiny' },
    { id: 'Land Parcels', label: 'Land Parcels', icon: MapPin },
    { id: 'Notifications', label: 'Notifications', icon: BellRing },
    { id: 'Awards', label: 'Awards', icon: Award },
    { id: 'Compensation', label: 'Compensation (PFMS)', icon: CreditCard },
    { id: 'Possession', label: 'Possession Handover', icon: FileCheck2 },
    { id: 'Rehabilitation & Resettlement', label: 'R&R Management', icon: Home },
    { id: 'GIS Map', label: 'GIS Map', icon: Map },
    { id: 'Grievances', label: 'Grievances', icon: MessageSquareWarning, badgeCountKey: 'activeGrievances' },
    { id: 'Reports', label: 'Reports & Analytics', icon: FileSpreadsheet }
  ];
};

/**
 * Check if a tab is allowed under the active role's RBAC scope
 */
export const isTabAllowedForRole = (
  role: UserRole,
  portalUserType: PortalUserType,
  tab: NavigationTab
): boolean => {
  const items = getRoleNavigationItems(role, portalUserType);
  return items.some(item => item.id === tab);
};

/**
 * Get the default or first allowed tab for a role
 */
export const getDefaultTabForRole = (
  role: UserRole,
  portalUserType: PortalUserType
): NavigationTab => {
  const items = getRoleNavigationItems(role, portalUserType);
  return items[0]?.id || 'Dashboard';
};

/**
 * Retrieve the active role's jurisdiction info
 */
export const getRoleJurisdictionInfo = (
  role: UserRole,
  portalUserType: PortalUserType
): RoleJurisdictionInfo => {
  if (portalUserType === 'citizen') {
    return ROLE_JURISDICTION_REGISTRY['Public/Citizen'];
  }
  if (portalUserType === 'auditor') {
    return ROLE_JURISDICTION_REGISTRY['Auditor'];
  }
  if (portalUserType === 'admin') {
    return ROLE_JURISDICTION_REGISTRY['System Administrator'];
  }
  return (
    ROLE_JURISDICTION_REGISTRY[role] ||
    ROLE_JURISDICTION_REGISTRY['Competent Authority (District Collector / CALA)']
  );
};

export type PermissionKey =
  | 'canEditCadastralBoundary'
  | 'canAuthorizePFMS'
  | 'canSubmitRequisition'
  | 'canDepositEscrow'
  | 'canApproveScrutiny'
  | 'canSignSec11Sec19'
  | 'canDeclareAward'
  | 'canDeclareAwards'
  | 'canAdjudicateGrievance'
  | 'canConductRRCensus'
  | 'canSanctionRRBenefits'
  | 'canAcknowledgeRoW'
  | 'canReportEncroachment'
  | 'canViewFinancialAwards'
  | 'canEditParcels'
  | 'isNationalMonitoringReadOnly';

/**
 * Check if the active role is permitted to perform a statutory or operational action
 */
export const canPerformAction = (
  role: UserRole,
  portalUserType: PortalUserType,
  permission: PermissionKey
): boolean => {
  const info = getRoleJurisdictionInfo(role, portalUserType);
  if (!info) return false;

  if (permission === 'canDeclareAwards') return info.canDeclareAward;
  if (permission === 'canEditParcels') {
    return info.canEditCadastralBoundary || info.canSubmitRequisition;
  }

  return Boolean(info[permission as keyof RoleJurisdictionInfo]);
};

