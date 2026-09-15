import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserRole,
  OfficerCredential,
  Project,
  LandParcel,
  Award,
  CompensationPayment,
  PossessionRecord,
  AffectedFamily,
  Grievance,
  AuditLog,
  RuleAlert,
  ProjectSector,
  RRPlan,
  RRBenefit,
  RRGrievance,
  RRDocument,
  RRRuleAlert,
  ResettlementSite
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_PARCELS,
  INITIAL_AWARDS,
  INITIAL_COMPENSATIONS,
  INITIAL_POSSESSION_RECORDS,
  INITIAL_GRIEVANCES,
  INITIAL_AUDIT_LOGS,
  INITIAL_ALERTS
} from '../data/initialData';
import {
  INITIAL_RR_FAMILIES,
  INITIAL_RR_PLANS,
  INITIAL_RR_BENEFITS,
  INITIAL_RR_GRIEVANCES,
  INITIAL_RR_DOCUMENTS
} from '../data/rrInitialData';
import { rrApiService } from '../services/rrApiService';
import { findRegisteredLandowner, normalizePhoneNumber } from '../data/citizenAuthData';
import { getOfficerCredentialByRole } from '../data/officialAuthData';
import {
  isTabAllowedForRole,
  getDefaultTabForRole,
  getRoleJurisdictionInfo
} from '../utils/rbacPermissions';

export type PortalUserType = 'unselected' | 'citizen' | 'officer' | 'admin' | 'auditor';

export type NavigationTab =
  | 'Dashboard'
  | 'Projects'
  | 'Land Parcels'
  | 'Notifications'
  | 'Awards'
  | 'Compensation'
  | 'Possession'
  | 'Rehabilitation & Resettlement'
  | 'GIS Map'
  | 'Grievances'
  | 'Reports'
  | 'Audit Trail'
  | 'Public Portal'
  | 'Settings';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  authenticatedOfficer: OfficerCredential | null;
  setAuthenticatedOfficer: (officer: OfficerCredential | null) => void;
  portalUserType: PortalUserType;
  setPortalUserType: (type: PortalUserType) => void;
  switchUserRole: (
    newRole: UserRole,
    newPortalUserType?: PortalUserType,
    officer?: OfficerCredential | null
  ) => void;
  citizenId: string;
  setCitizenId: (id: string) => void;
  citizenPhone: string;
  setCitizenPhone: (phone: string) => void;
  isLandownerAuthenticated: boolean;
  setIsLandownerAuthenticated: (val: boolean) => void;
  authenticatedLandownerParcelId: string | null;
  setAuthenticatedLandownerParcelId: (id: string | null) => void;
  isCitizenOtpVerified: boolean;
  setIsCitizenOtpVerified: (val: boolean) => void;
  authenticateCitizenByPhone: (phoneOrId: string, otp: string) => {
    isLandowner: boolean;
    parcelId: string | null;
    familyId: string | null;
    landownerName?: string;
    error?: string;
  };
  logoutCitizen: () => void;
  logout: () => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedParcelId: string | null;
  setSelectedParcelId: (id: string | null) => void;

  // Filters
  filterState: string;
  setFilterState: (s: string) => void;
  filterSector: string;
  setFilterSector: (s: string) => void;
  filterStatus: string;
  setFilterStatus: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Data states
  projects: Project[];
  parcels: LandParcel[];
  awards: Award[];
  compensations: CompensationPayment[];
  possessionRecords: PossessionRecord[];
  families: AffectedFamily[];
  grievances: Grievance[];
  auditLogs: AuditLog[];
  alerts: RuleAlert[];

  // R&R Specific States
  rrPlans: RRPlan[];
  rrBenefits: RRBenefit[];
  rrGrievances: RRGrievance[];
  rrDocuments: RRDocument[];
  rrAlerts: RRRuleAlert[];
  resettlementSites: ResettlementSite[];

  // Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'acquiredLandAcres' | 'compensationDisbursedCrores' | 'rrCompletionPercent' | 'delayed'>) => void;
  approveScrutiny: (projectId: string, notes?: string) => void;
  requestScrutinyClarification: (projectId: string, notes: string) => void;
  rejectScrutiny: (projectId: string, reason: string) => void;
  publishSection11Notification: (projectId: string, notificationNo: string) => void;
  publishSection19Declaration: (projectId: string, declarationNo: string) => void;
  declareAward: (awardData: Omit<Award, 'id' | 'awardDate' | 'status'>) => void;
  disburseCompensationPFMS: (compensationId: string) => void;
  recordPossession: (data: {
    projectId: string;
    parcelId: string;
    vestingOrderNo: string;
    officerName: string;
    officerDesignation: string;
    docUrl?: string;
  }) => void;
  updateFamilyStatus: (
    familyId: string,
    workflowStatus: AffectedFamily['workflowStatus'],
    housingStatus?: AffectedFamily['housingStatus'],
    livelihoodStatus?: AffectedFamily['livelihoodStatus']
  ) => void;

  // R&R Specific Actions
  addAffectedFamily: (family: Omit<AffectedFamily, 'id'>) => Promise<AffectedFamily>;
  updateAffectedFamily: (id: string, updates: Partial<AffectedFamily>) => Promise<AffectedFamily>;
  deleteAffectedFamily: (id: string) => Promise<boolean>;
  createRRPlan: (plan: Omit<RRPlan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<RRPlan>;
  updateRRPlan: (id: string, updates: Partial<RRPlan>) => Promise<RRPlan>;
  deleteRRPlan: (id: string) => Promise<boolean>;
  togglePlanFacility: (planId: string, facilityId: string, status: 'Completed' | 'In Progress' | 'Pending' | 'Delayed') => Promise<void>;
  recordRRBenefit: (benefit: Omit<RRBenefit, 'id'>) => Promise<RRBenefit>;
  approveRRBenefit: (benefitId: string, amount?: number) => Promise<void>;
  disburseRRBenefit: (benefitId: string) => Promise<void>;
  updateRRBenefit: (benefitId: string, updates: Partial<RRBenefit>) => Promise<void>;
  deleteRRBenefit: (benefitId: string) => Promise<void>;
  submitRRGrievance: (data: Omit<RRGrievance, 'id' | 'referenceNumber' | 'submissionDate'>) => Promise<RRGrievance>;
  updateRRGrievanceStatus: (id: string, status: RRGrievance['status'], notes?: string, assignedOfficer?: string) => Promise<void>;
  updateFamilyWorkflowStage: (familyId: string, stageIndex: number, stageName: string, notes?: string) => Promise<void>;
  addRRDocument: (doc: Omit<RRDocument, 'id' | 'uploadedAt'>) => Promise<RRDocument>;
  refreshRRData: () => Promise<void>;

  submitGrievance: (data: {
    projectId: string;
    parcelId?: string;
    complainantName: string;
    contact: string;
    category: Grievance['category'];
    description: string;
  }) => string;
  resolveGrievance: (grievanceId: string, notes: string, status: 'Resolved' | 'Action Required' | 'Closed') => void;
  dismissAlert: (alertId: string) => void;

  // Toast
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portalUserType, setPortalUserType] = useState<PortalUserType>('unselected');
  const [citizenId, setCitizenId] = useState<string>('FAM-KRI-0034');
  const [citizenPhone, setCitizenPhone] = useState<string>('9876541022');
  const [isLandownerAuthenticated, setIsLandownerAuthenticated] = useState<boolean>(true);
  const [authenticatedLandownerParcelId, setAuthenticatedLandownerParcelId] = useState<string | null>('PAR-KRI-1003');
  const [isCitizenOtpVerified, setIsCitizenOtpVerified] = useState<boolean>(true);
  const [role, setRole] = useState<UserRole>('National Administrator');
  const [authenticatedOfficer, setAuthenticatedOfficer] = useState<OfficerCredential | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>('Dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);

  const [filterState, setFilterState] = useState<string>('All');
  const [filterSector, setFilterSector] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [parcels, setParcels] = useState<LandParcel[]>(INITIAL_PARCELS);
  const [awards, setAwards] = useState<Award[]>(INITIAL_AWARDS);
  const [compensations, setCompensations] = useState<CompensationPayment[]>(INITIAL_COMPENSATIONS);
  const [possessionRecords, setPossessionRecords] = useState<PossessionRecord[]>(INITIAL_POSSESSION_RECORDS);
  const [families, setFamilies] = useState<AffectedFamily[]>(INITIAL_RR_FAMILIES);
  const [rrPlans, setRrPlans] = useState<RRPlan[]>(INITIAL_RR_PLANS);
  const [rrBenefits, setRrBenefits] = useState<RRBenefit[]>(INITIAL_RR_BENEFITS);
  const [rrGrievances, setRrGrievances] = useState<RRGrievance[]>(INITIAL_RR_GRIEVANCES);
  const [rrDocuments, setRrDocuments] = useState<RRDocument[]>(INITIAL_RR_DOCUMENTS);
  const [rrAlerts, setRrAlerts] = useState<RRRuleAlert[]>([]);
  const [resettlementSites, setResettlementSites] = useState<ResettlementSite[]>([
    {
      id: 'SITE-01',
      name: 'Shoolagiri R&R Modern Township Colony',
      location: 'Krishnagiri, Tamil Nadu',
      projectId: 'PRJ-2025-0101',
      plotsDeveloped: 120,
      plotsAllotted: 110
    },
    {
      id: 'SITE-02',
      name: 'Chandauli EDFC Green Habitat Colony',
      location: 'Chandauli, Uttar Pradesh',
      projectId: 'PRJ-2025-0102',
      plotsDeveloped: 180,
      plotsAllotted: 120
    },
    {
      id: 'SITE-03',
      name: 'Krishna Valley Rehabilitation Sector 4',
      location: 'Bagalkote, Karnataka',
      projectId: 'PRJ-2025-0103',
      plotsDeveloped: 100,
      plotsAllotted: 95
    },
    {
      id: 'SITE-04',
      name: 'Haveli Green Habitat Layout',
      location: 'Pune, Maharashtra',
      projectId: 'PRJ-2025-0105',
      plotsDeveloped: 60,
      plotsAllotted: 24
    }
  ]);
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [alerts, setAlerts] = useState<RuleAlert[]>(INITIAL_ALERTS);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshRRData = async () => {
    try {
      const [fams, plns, bnfs, grvs, docs, alrts] = await Promise.all([
        rrApiService.getFamilies(),
        rrApiService.getPlans(),
        rrApiService.getBenefits(),
        rrApiService.getGrievances(),
        rrApiService.getDocuments(),
        rrApiService.getAlerts()
      ]);
      if (fams && fams.length > 0) setFamilies(fams);
      if (plns && plns.length > 0) setRrPlans(plns);
      if (bnfs && bnfs.length > 0) setRrBenefits(bnfs);
      if (grvs && grvs.length > 0) setRrGrievances(grvs);
      if (docs && docs.length > 0) setRrDocuments(docs);
      if (alrts && alrts.length > 0) setRrAlerts(alrts);
    } catch (e) {
      console.warn('Initial RR fetch fallback used', e);
    }
  };

  useEffect(() => {
    refreshRRData();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const createAuditEntry = (
    action: string,
    module: string,
    recordId: string,
    previousStatus: string,
    newStatus: string,
    details?: string
  ) => {
    const now = new Date();
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      eventId: `EVT-NLAMS-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: now.toISOString(),
      user: role === 'Public/Citizen' ? 'Verified Citizen (OTP)' : `${role} Session Officer`,
      role,
      action,
      module,
      recordId,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      ipSession: `10.24.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)} (NICGovNet-Secured)`,
      previousStatus,
      newStatus,
      description: details || `${action} on ${module} record ${recordId}`,
      status: 'SUCCESS',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'acquiredLandAcres' | 'compensationDisbursedCrores' | 'rrCompletionPercent' | 'delayed'>) => {
    const newId = `PRJ-2025-0${projects.length + 101}`;
    const newProject: Project = {
      ...projectData,
      id: newId,
      acquiredLandAcres: 0,
      compensationDisbursedCrores: 0,
      rrCompletionPercent: 0,
      delayed: false,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Proposal Submitted',
      scrutinyStatus: 'Pending'
    };
    setProjects(prev => [newProject, ...prev]);
    createAuditEntry(
      'New Project Proposal Submitted',
      'Projects',
      newId,
      'None',
      'Proposal Submitted',
      `Proposal for ${projectData.name} submitted by ${projectData.requiringBody}`
    );
    showToast(`Project Proposal "${projectData.name}" submitted for scrutiny!`);
  };

  const approveScrutiny = (projectId: string, notes?: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'Preliminary Notification Published',
            scrutinyStatus: 'Approved',
            scrutinyNotes: notes || 'All land boundaries, alignment geometry, and required NOCs verified.'
          };
        }
        return p;
      })
    );
    createAuditEntry(
      'Project Scrutiny Approved',
      'Scrutiny',
      projectId,
      'Under Scrutiny',
      'Preliminary Notification Published',
      notes || 'Statutory review passed. Verified for Preliminary Notification issuance.'
    );
    showToast(`Project ${projectId} scrutiny approved. Proceed to Preliminary Notification.`);
  };

  const requestScrutinyClarification = (projectId: string, notes: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, scrutinyStatus: 'Clarification Requested', scrutinyNotes: notes } : p))
    );
    createAuditEntry(
      'Clarification Requisitioned on Scrutiny',
      'Scrutiny',
      projectId,
      'Pending Scrutiny',
      'Clarification Requested',
      notes
    );
    showToast(`Clarification request sent to Requiring Body for ${projectId}.`);
  };

  const rejectScrutiny = (projectId: string, reason: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, scrutinyStatus: 'Rejected', scrutinyNotes: reason } : p))
    );
    createAuditEntry(
      'Project Proposal Rejected',
      'Scrutiny',
      projectId,
      'Pending Scrutiny',
      'Rejected',
      reason
    );
    showToast(`Project ${projectId} scrutiny rejected.`);
  };

  const publishSection11Notification = (projectId: string, notificationNo: string) => {
    const today = new Date().toISOString().split('T')[0];

    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'Preliminary Notification Published',
            preliminaryNotificationNumber: notificationNo,
            preliminaryNotificationDate: today
          };
        }
        return p;
      })
    );

    // Update parcels of this project from 'Proposed' to 'Notified'
    setParcels(prev =>
      prev.map(parcel => {
        if (parcel.projectId === projectId && parcel.status === 'Proposed') {
          return {
            ...parcel,
            status: 'Notified'
          };
        }
        return parcel;
      })
    );

    createAuditEntry(
      'Section 11 Preliminary Notification Published',
      'Notifications',
      notificationNo,
      'Approved',
      'Published',
      `Gazette notification issued under Section 11 of RFCTLARR Act 2013.`
    );

    showToast(`Section 11 Notification ${notificationNo} successfully published!`);
  };

  const publishSection19Declaration = (projectId: string, declarationNo: string) => {
    const today = new Date().toISOString().split('T')[0];
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'Final Declaration Published',
            finalDeclarationNumber: declarationNo,
            finalDeclarationDate: today
          };
        }
        return p;
      })
    );

    createAuditEntry(
      'Section 19 Final Declaration Published',
      'Notifications',
      declarationNo,
      'Preliminary Notification',
      'Final Declaration',
      `Final declaration published under Section 19 of RFCTLARR Act 2013.`
    );

    showToast(`Section 19 Final Declaration ${declarationNo} published!`);
  };

  const declareAward = (awardData: Omit<Award, 'id' | 'awardDate' | 'status'>) => {
    const newId = `AWD-2025-IND-0${awards.length + 10}`;
    const today = new Date().toISOString().split('T')[0];

    const newAward: Award = {
      ...awardData,
      id: newId,
      awardDate: today,
      status: 'Declared'
    };

    setAwards(prev => [newAward, ...prev]);

    // Also auto-generate corresponding CompensationPayment in PFMS ledger
    const newCmp: CompensationPayment = {
      id: `CMP-2025-0${compensations.length + 50}`,
      awardId: newId,
      projectId: awardData.projectId,
      parcelId: awardData.parcelId,
      beneficiaryName: awardData.landownerName,
      beneficiaryMasked: `${awardData.landownerName.slice(0, 3)}*** (${awardData.parcelId})`,
      bankAccountMasked: 'SBIN000****' + Math.floor(1000 + Math.random() * 9000),
      ifscMasked: 'SBIN0001042',
      amount: awardData.totalAwardAmount,
      paymentStatus: 'Pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      remarks: 'Award declared under Section 23/30. Pending PFMS digital token approval.'
    };
    setCompensations(prev => [newCmp, ...prev]);

    // Update parcel compensation status
    setParcels(prev =>
      prev.map(p => (p.id === awardData.parcelId ? { ...p, compensationStatus: 'Award Declared' } : p))
    );

    createAuditEntry(
      'Section 23/30 Award Declared',
      'Awards',
      newId,
      'Draft',
      'Declared',
      `Award for ₹${(awardData.totalAwardAmount / 10000000).toFixed(2)} Cr declared for parcel ${awardData.parcelId}. 100% Solatium included.`
    );

    showToast(`Award ${awardData.awardNumber} declared! Added to Compensation ledger.`);
  };

  const disburseCompensationPFMS = (compensationId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const utr = `PFMS-2025-IND-${Math.floor(100000 + Math.random() * 900000)}`;

    let paidAmount = 0;
    let targetParcelId = '';
    let targetProjectId = '';

    setCompensations(prev =>
      prev.map(cmp => {
        if (cmp.id === compensationId) {
          paidAmount = cmp.amount;
          targetParcelId = cmp.parcelId;
          targetProjectId = cmp.projectId;
          return {
            ...cmp,
            paymentStatus: 'Paid',
            pfmsReferenceId: utr,
            paymentDate: today,
            remarks: 'Electronic payment successfully settled into verified bank account via PFMS Demo.'
          };
        }
        return cmp;
      })
    );

    // Update parcel compensation status
    if (targetParcelId) {
      setParcels(prev =>
        prev.map(p => (p.id === targetParcelId ? { ...p, compensationStatus: 'Disbursed' } : p))
      );
    }

    // Update project disbursed amount
    if (targetProjectId && paidAmount > 0) {
      const addedCrores = paidAmount / 10000000;
      setProjects(prev =>
        prev.map(p =>
          p.id === targetProjectId
            ? { ...p, compensationDisbursedCrores: Number((p.compensationDisbursedCrores + addedCrores).toFixed(2)) }
            : p
        )
      );
    }

    createAuditEntry(
      'Compensation Disbursed via PFMS',
      'Compensation',
      compensationId,
      'Pending/Processing',
      'Paid',
      `UTR ${utr} settled. Amount: ₹${(paidAmount / 100000).toFixed(2)} Lakhs.`
    );

    showToast(`PFMS Electronic Payment of ₹${(paidAmount / 100000).toFixed(2)} Lakhs settled (Ref: ${utr})!`);
  };

  const recordPossession = (data: {
    projectId: string;
    parcelId: string;
    vestingOrderNo: string;
    officerName: string;
    officerDesignation: string;
    docUrl?: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const targetParcel = parcels.find(p => p.id === data.parcelId);

    const newRecord: PossessionRecord = {
      id: `POS-2025-IND-0${possessionRecords.length + 10}`,
      projectId: data.projectId,
      parcelId: data.parcelId,
      surveyNumber: targetParcel ? targetParcel.surveyNumber : '101/A',
      possessionDate: today,
      vestingOrderNumber: data.vestingOrderNo,
      recordingOfficer: data.officerName,
      officerDesignation: data.officerDesignation,
      certificateDocumentUrl: data.docUrl || 'https://nlams.gov.in/records/possession-cert-demo.pdf',
      panchnamaUploaded: true,
      encumbranceFreeConfirmed: true,
      gisSynced: true,
      timestamp: new Date().toISOString()
    };

    setPossessionRecords(prev => [newRecord, ...prev]);

    // Update parcel status to 'Acquired' and possessionStatus to 'Possession Taken'
    setParcels(prev =>
      prev.map(p => {
        if (p.id === data.parcelId) {
          return {
            ...p,
            status: 'Acquired',
            possessionStatus: 'Possession Taken'
          };
        }
        return p;
      })
    );

    // Update project acquired acres
    if (targetParcel) {
      setProjects(prev =>
        prev.map(p => {
          if (p.id === data.projectId) {
            return {
              ...p,
              acquiredLandAcres: Math.min(p.estimatedLandAcres, p.acquiredLandAcres + targetParcel.areaAcres)
            };
          }
          return p;
        })
      );
    }

    createAuditEntry(
      'Possession Recorded & Vesting Order Issued',
      'Possession',
      data.parcelId,
      'Notified / Pending',
      'Acquired',
      `Possession certificate ${data.vestingOrderNo} uploaded by ${data.officerName} (${data.officerDesignation}). GIS parcel color updated to green.`
    );

    showToast(`Possession recorded! Parcel ${data.parcelId} is now marked Acquired (🟢 Green in GIS).`);
  };

  const updateFamilyStatus = (
    familyId: string,
    workflowStatus: AffectedFamily['workflowStatus'],
    housingStatus?: AffectedFamily['housingStatus'],
    livelihoodStatus?: AffectedFamily['livelihoodStatus']
  ) => {
    setFamilies(prev =>
      prev.map(fam => {
        if (fam.id === familyId) {
          return {
            ...fam,
            workflowStatus,
            housingStatus: housingStatus || fam.housingStatus,
            livelihoodStatus: livelihoodStatus || fam.livelihoodStatus
          };
        }
        return fam;
      })
    );

    createAuditEntry(
      'R&R Family Status Updated',
      'Rehabilitation & Resettlement',
      familyId,
      'In Progress',
      workflowStatus,
      `Housing: ${housingStatus || 'Current'}, Livelihood: ${livelihoodStatus || 'Current'}`
    );

    showToast(`R&R Family ${familyId} status updated to ${workflowStatus}!`);
  };

  // --- R&R Comprehensive Actions ---
  const addAffectedFamily = async (familyData: Omit<AffectedFamily, 'id'>) => {
    const saved = await rrApiService.addFamily(familyData);
    setFamilies(prev => [saved, ...prev.filter(f => f.id !== saved.id)]);
    createAuditEntry(
      'Affected Family Registered (R&R)',
      'Rehabilitation & Resettlement',
      saved.id,
      'None',
      saved.currentStatus || 'Surveyed',
      `Head of Family: ${saved.headOfFamily}, District: ${saved.district}, Village: ${saved.village}`
    );
    showToast(`Family ${saved.headOfFamily} (${saved.id}) successfully enrolled in R&R register.`);
    return saved;
  };

  const updateAffectedFamily = async (id: string, updates: Partial<AffectedFamily>) => {
    const updated = await rrApiService.updateFamily(id, updates);
    setFamilies(prev => prev.map(f => f.id === id ? updated : f));
    createAuditEntry(
      'Affected Family Dossier Updated',
      'Rehabilitation & Resettlement',
      id,
      'Modified',
      updated.currentStatus || 'Updated',
      `Updated R&R parameters for ${updated.headOfFamily}`
    );
    showToast(`Family ${id} updated.`);
    return updated;
  };

  const deleteAffectedFamily = async (id: string) => {
    const success = await rrApiService.deleteFamily(id);
    if (success) {
      setFamilies(prev => prev.filter(f => f.id !== id));
      createAuditEntry(
        'Affected Family Record Deleted',
        'Rehabilitation & Resettlement',
        id,
        'Active',
        'Deleted',
        `Record removed from R&R register`
      );
      showToast(`Family ${id} removed from register.`);
    }
    return success;
  };

  const createRRPlan = async (planData: Omit<RRPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPlan = await rrApiService.createPlan(planData);
    setRrPlans(prev => [newPlan, ...prev]);
    createAuditEntry(
      'R&R Scheme Formulated under RFCTLARR Act',
      'Rehabilitation & Resettlement',
      newPlan.id,
      'Drafting',
      newPlan.status,
      `Project: ${newPlan.projectName || newPlan.projectId}, Families: ${newPlan.affectedFamiliesCount}`
    );
    showToast(`R&R Plan ${newPlan.id} successfully created!`);
    return newPlan;
  };

  const updateRRPlan = async (id: string, updates: Partial<RRPlan>) => {
    const updated = await rrApiService.updatePlan(id, updates);
    setRrPlans(prev => prev.map(p => p.id === id ? updated : p));
    createAuditEntry(
      'R&R Scheme Progress Updated',
      'Rehabilitation & Resettlement',
      id,
      'In Progress',
      updated.status,
      `Status: ${updated.status}, Remarks: ${updated.remarks || 'Updated'}`
    );
    showToast(`R&R Plan ${id} updated.`);
    return updated;
  };

  const deleteRRPlan = async (id: string) => {
    const success = await rrApiService.deletePlan(id);
    if (success) {
      setRrPlans(prev => prev.filter(p => p.id !== id));
      createAuditEntry(
        'R&R Plan Deleted',
        'Rehabilitation & Resettlement',
        id,
        'Active',
        'Deleted'
      );
      showToast(`R&R Plan ${id} deleted.`);
    }
    return success;
  };

  const togglePlanFacility = async (
    planId: string,
    facilityId: string,
    newStatus: 'Completed' | 'In Progress' | 'Pending' | 'Delayed'
  ) => {
    const targetPlan = rrPlans.find(p => p.id === planId);
    if (!targetPlan) return;

    const updatedFacilities = targetPlan.infrastructureFacilities.map(fac => {
      if (fac.id === facilityId) {
        return {
          ...fac,
          status: newStatus,
          completionPercent: newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 50 : 0
        };
      }
      return fac;
    });

    await updateRRPlan(planId, { infrastructureFacilities: updatedFacilities });
    showToast(`Facility ${facilityId} marked as ${newStatus}.`);
  };

  const recordRRBenefit = async (benefitData: Omit<RRBenefit, 'id'>) => {
    const newBnf = await rrApiService.addBenefit(benefitData);
    setRrBenefits(prev => [newBnf, ...prev]);
    createAuditEntry(
      'R&R Statutory Benefit Sanctioned',
      'Rehabilitation & Resettlement',
      newBnf.id,
      'Calculated',
      newBnf.status,
      `Beneficiary: ${newBnf.beneficiaryName}, Type: ${newBnf.benefitType}, Amount: ₹${newBnf.eligibleAmount.toLocaleString('en-IN')}`
    );
    showToast(`Benefit ${newBnf.benefitType} recorded for ${newBnf.beneficiaryName}.`);
    return newBnf;
  };

  const approveRRBenefit = async (benefitId: string, amount?: number) => {
    const bnf = rrBenefits.find(b => b.id === benefitId);
    if (!bnf) return;
    const finalAmount = amount !== undefined ? amount : bnf.eligibleAmount;
    const updated = await rrApiService.updateBenefit(benefitId, {
      approved: true,
      approvedDate: new Date().toISOString().split('T')[0],
      approvedAmount: finalAmount,
      status: 'Approved'
    });
    setRrBenefits(prev => prev.map(b => b.id === benefitId ? updated : b));
    createAuditEntry(
      'R&R Benefit Approved by Authority',
      'Rehabilitation & Resettlement',
      benefitId,
      bnf.status,
      'Approved',
      `Approved amount: ₹${finalAmount.toLocaleString('en-IN')}`
    );
    showToast(`Benefit ${benefitId} approved for ₹${finalAmount.toLocaleString('en-IN')}!`);
  };

  const disburseRRBenefit = async (benefitId: string) => {
    const bnf = rrBenefits.find(b => b.id === benefitId);
    if (!bnf) return;
    const disburseAmt = bnf.approvedAmount || bnf.eligibleAmount;
    const updated = await rrApiService.updateBenefit(benefitId, {
      disbursed: true,
      disbursedDate: new Date().toISOString().split('T')[0],
      disbursedAmount: disburseAmt,
      status: 'Disbursed'
    });
    setRrBenefits(prev => prev.map(b => b.id === benefitId ? updated : b));
    createAuditEntry(
      'R&R Direct Benefit Transfer (DBT) Executed',
      'Rehabilitation & Resettlement',
      benefitId,
      'Approved',
      'Disbursed',
      `Disbursed ₹${disburseAmt.toLocaleString('en-IN')} via PFMS integration`
    );
    showToast(`Statutory benefit ₹${disburseAmt.toLocaleString('en-IN')} disbursed to ${bnf.beneficiaryName}!`);
  };

  const updateRRBenefit = async (benefitId: string, updates: Partial<RRBenefit>) => {
    const updated = await rrApiService.updateBenefit(benefitId, updates);
    setRrBenefits(prev => prev.map(b => b.id === benefitId ? updated : b));
    showToast(`Benefit record ${benefitId} updated.`);
  };

  const deleteRRBenefit = async (benefitId: string) => {
    await rrApiService.deleteBenefit(benefitId);
    setRrBenefits(prev => prev.filter(b => b.id !== benefitId));
    showToast(`Benefit record ${benefitId} removed.`);
  };

  const submitRRGrievance = async (data: Omit<RRGrievance, 'id' | 'referenceNumber' | 'submissionDate'>) => {
    const created = await rrApiService.addGrievance(data);
    setRrGrievances(prev => [created, ...prev]);
    createAuditEntry(
      'R&R Citizen Grievance Filed',
      'Rehabilitation & Resettlement',
      created.referenceNumber,
      'None',
      'Open',
      `Complainant: ${created.complainantName}, Category: ${created.category}, Project: ${created.projectId}`
    );
    showToast(`Grievance submitted! Reference: ${created.referenceNumber}`);
    return created;
  };

  const updateRRGrievanceStatus = async (
    id: string,
    status: RRGrievance['status'],
    notes?: string,
    assignedOfficer?: string
  ) => {
    const updates: Partial<RRGrievance> = { status };
    if (notes) updates.officialResolutionNotes = notes;
    if (assignedOfficer) updates.assignedOfficer = assignedOfficer;
    if (status === 'Resolved' || status === 'Closed') {
      updates.resolvedDate = new Date().toISOString().split('T')[0];
    }
    const updated = await rrApiService.updateGrievance(id, updates);
    setRrGrievances(prev => prev.map(g => g.id === id ? updated : g));
    createAuditEntry(
      `R&R Grievance Updated: ${status}`,
      'Rehabilitation & Resettlement',
      updated.referenceNumber,
      'Pending',
      status,
      notes || `Status marked as ${status}`
    );
    showToast(`Grievance ${updated.referenceNumber} status changed to ${status}.`);
  };

  const updateFamilyWorkflowStage = async (
    familyId: string,
    stageIndex: number,
    stageName: string,
    notes?: string
  ) => {
    // Map stageIndex to currentStatus
    let currentStatus: AffectedFamily['currentStatus'] = 'Surveyed';
    let workflowStatus: AffectedFamily['workflowStatus'] = 'Registered';
    if (stageIndex === 1) {
      currentStatus = 'Eligibility Verified';
      workflowStatus = 'Registered';
    } else if (stageIndex === 2) {
      currentStatus = 'Plan Formulated';
      workflowStatus = 'Benefit Approved';
    } else if (stageIndex === 3) {
      currentStatus = 'Benefits In Progress';
      workflowStatus = 'Benefit Approved';
    } else if (stageIndex === 4) {
      currentStatus = 'Benefits Delivered';
      workflowStatus = 'Benefit Delivered';
    } else if (stageIndex === 5) {
      currentStatus = 'Resettled';
      workflowStatus = 'Closed';
    } else if (stageIndex >= 6) {
      currentStatus = 'Closed';
      workflowStatus = 'Closed';
    }

    await rrApiService.updateProgress(familyId, stageIndex);
    await updateAffectedFamily(familyId, { currentStatus, workflowStatus });

    createAuditEntry(
      `R&R Lifecycle Stage Advanced`,
      'Rehabilitation & Resettlement',
      familyId,
      'Previous Stage',
      stageName,
      notes || `Family transitioned to ${stageName}`
    );
    showToast(`Family ${familyId} advanced to stage: ${stageName}!`);
  };

  const addRRDocument = async (doc: Omit<RRDocument, 'id' | 'uploadedAt'>) => {
    const saved = await rrApiService.addDocument(doc);
    setRrDocuments(prev => [saved, ...prev]);
    showToast(`Document "${saved.title}" attached successfully.`);
    return saved;
  };

  const submitGrievance = (data: {
    projectId: string;
    parcelId?: string;
    complainantName: string;
    contact: string;
    category: Grievance['category'];
    description: string;
  }) => {
    const grvNo = `NLAMS-GRV-2026-${String(100 + grievances.length + 1).padStart(5, '0')}`;
    const newGrv: Grievance = {
      id: `GRV-${Date.now()}`,
      referenceNumber: grvNo,
      projectId: data.projectId,
      parcelId: data.parcelId,
      complainantName: data.complainantName,
      complainantContactMasked: data.contact.length >= 10 ? `${data.contact.slice(0, 4)}****${data.contact.slice(-2)}` : 'Verified Citizen',
      category: data.category,
      description: data.description,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      assignedAuthority: 'District Grievance Redressal Officer (LARR Authority)'
    };

    setGrievances(prev => [newGrv, ...prev]);

    createAuditEntry(
      'Grievance Registered',
      'Grievances',
      grvNo,
      'None',
      'Submitted',
      `Citizen grievance filed under category: ${data.category}`
    );

    showToast(`Grievance submitted successfully! Your tracking reference is ${grvNo}.`);
    return grvNo;
  };

  const resolveGrievance = (grievanceId: string, notes: string, status: 'Resolved' | 'Action Required' | 'Closed') => {
    setGrievances(prev =>
      prev.map(g => {
        if (g.id === grievanceId) {
          return {
            ...g,
            status,
            officialResolutionNotes: notes,
            resolvedAt: new Date().toISOString().split('T')[0]
          };
        }
        return g;
      })
    );

    createAuditEntry(
      `Grievance Updated: ${status}`,
      'Grievances',
      grievanceId,
      'In Review',
      status,
      notes
    );

    showToast(`Grievance ${grievanceId} marked as ${status}.`);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const switchUserRole = (
    newRole: UserRole,
    newPortalUserType: PortalUserType = 'officer',
    officer: OfficerCredential | null = null
  ) => {
    const finalOfficer = officer || (newPortalUserType === 'officer' ? getOfficerCredentialByRole(newRole) : null);
    setRole(newRole);
    setPortalUserType(newPortalUserType);
    setAuthenticatedOfficer(finalOfficer);

    try {
      localStorage.setItem('nlams_demo_role', newRole);
      localStorage.setItem('nlams_demo_portal', newPortalUserType);
      if (finalOfficer) {
        localStorage.setItem('nlams_demo_officer', JSON.stringify(finalOfficer));
      } else {
        localStorage.removeItem('nlams_demo_officer');
      }
    } catch (e) {}

    // Enforce tab validity for new role
    if (!isTabAllowedForRole(newRole, newPortalUserType, activeTab)) {
      const fallbackTab = getDefaultTabForRole(newRole, newPortalUserType);
      setActiveTab(fallbackTab);
    }

    const jurisdiction = getRoleJurisdictionInfo(newRole, newPortalUserType);
    showToast(`Session switched to ${newRole} • Jurisdiction: ${jurisdiction.jurisdictionBadge}`);
  };

  useEffect(() => {
    try {
      const savedPortal = localStorage.getItem('nlams_demo_portal') as PortalUserType | null;
      const savedRole = localStorage.getItem('nlams_demo_role') as UserRole | null;
      const savedOfficerRaw = localStorage.getItem('nlams_demo_officer');
      if (savedPortal && savedRole) {
        setPortalUserType(savedPortal);
        setRole(savedRole);
        if (savedOfficerRaw) {
          setAuthenticatedOfficer(JSON.parse(savedOfficerRaw));
        } else if (savedPortal === 'officer') {
          setAuthenticatedOfficer(getOfficerCredentialByRole(savedRole));
        }
        if (!isTabAllowedForRole(savedRole, savedPortal, activeTab)) {
          setActiveTab(getDefaultTabForRole(savedRole, savedPortal));
        }
      }
    } catch (e) {}
  }, []);

  const logout = () => {
    setIsCitizenOtpVerified(false);
    setIsLandownerAuthenticated(false);
    setAuthenticatedLandownerParcelId(null);
    setCitizenPhone('');
    setCitizenId('');
    setAuthenticatedOfficer(null);
    setPortalUserType('unselected');
    setActiveTab('Dashboard');
    setSelectedProjectId(null);
    setSelectedParcelId(null);
    try {
      localStorage.removeItem('nlams_demo_role');
      localStorage.removeItem('nlams_demo_portal');
      localStorage.removeItem('nlams_demo_officer');
    } catch (e) {}
    showToast('Logged out successfully.');
  };

  const logoutCitizen = () => {
    setIsCitizenOtpVerified(false);
    setIsLandownerAuthenticated(false);
    setAuthenticatedLandownerParcelId(null);
    setCitizenPhone('');
    setCitizenId('');
    setAuthenticatedOfficer(null);
    setPortalUserType('unselected');
    setActiveTab('Dashboard');
    try {
      localStorage.removeItem('nlams_demo_role');
      localStorage.removeItem('nlams_demo_portal');
      localStorage.removeItem('nlams_demo_officer');
    } catch (e) {}
    showToast('Signed out of citizen session.');
  };

  const authenticateCitizenByPhone = (phoneOrId: string, otp: string) => {
    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      return { isLandowner: false, parcelId: null, familyId: null, error: 'Please enter a valid 6-digit OTP' };
    }

    const landownerMatch = findRegisteredLandowner(phoneOrId);
    if (landownerMatch) {
      setCitizenPhone(landownerMatch.phone);
      setIsLandownerAuthenticated(true);
      setAuthenticatedLandownerParcelId(landownerMatch.parcelId);
      setCitizenId(landownerMatch.familyId);
      setIsCitizenOtpVerified(true);
      setRole('Public/Citizen');
      setPortalUserType('citizen');
      setActiveTab('Public Portal');
      try {
        localStorage.setItem('nlams_demo_role', 'Public/Citizen');
        localStorage.setItem('nlams_demo_portal', 'citizen');
        localStorage.removeItem('nlams_demo_officer');
      } catch (e) {}
      showToast(`Welcome ${landownerMatch.landownerName}! Authenticated as Affected Landowner for Parcel ${landownerMatch.parcelId}.`);
      return {
        isLandowner: true,
        parcelId: landownerMatch.parcelId,
        familyId: landownerMatch.familyId,
        landownerName: landownerMatch.landownerName
      };
    } else {
      // General Citizen
      const normalized = normalizePhoneNumber(phoneOrId) || phoneOrId.trim();
      setCitizenPhone(normalized || '9123456789');
      setIsLandownerAuthenticated(false);
      setAuthenticatedLandownerParcelId(null);
      setCitizenId('CITIZEN-GENERAL');
      setIsCitizenOtpVerified(true);
      setRole('Public/Citizen');
      setPortalUserType('citizen');
      setActiveTab('Public Portal');
      try {
        localStorage.setItem('nlams_demo_role', 'Public/Citizen');
        localStorage.setItem('nlams_demo_portal', 'citizen');
        localStorage.removeItem('nlams_demo_officer');
      } catch (e) {}
      showToast('Citizen verification completed.');
      return {
        isLandowner: false,
        parcelId: null,
        familyId: null
      };
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        authenticatedOfficer,
        setAuthenticatedOfficer,
        portalUserType,
        setPortalUserType,
        switchUserRole,
        citizenId,
        setCitizenId,
        citizenPhone,
        setCitizenPhone,
        isLandownerAuthenticated,
        setIsLandownerAuthenticated,
        authenticatedLandownerParcelId,
        setAuthenticatedLandownerParcelId,
        isCitizenOtpVerified,
        setIsCitizenOtpVerified,
        authenticateCitizenByPhone,
        logoutCitizen,
        logout,
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        selectedParcelId,
        setSelectedParcelId,
        filterState,
        setFilterState,
        filterSector,
        setFilterSector,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        projects,
        parcels,
        awards,
        compensations,
        possessionRecords,
        families,
        grievances,
        auditLogs,
        alerts,
        // R&R States
        rrPlans,
        rrBenefits,
        rrGrievances,
        rrDocuments,
        rrAlerts,
        resettlementSites,
        // Actions
        addProject,
        approveScrutiny,
        requestScrutinyClarification,
        rejectScrutiny,
        publishSection11Notification,
        publishSection19Declaration,
        declareAward,
        disburseCompensationPFMS,
        recordPossession,
        updateFamilyStatus,
        // R&R Actions
        addAffectedFamily,
        updateAffectedFamily,
        deleteAffectedFamily,
        createRRPlan,
        updateRRPlan,
        deleteRRPlan,
        togglePlanFacility,
        recordRRBenefit,
        approveRRBenefit,
        disburseRRBenefit,
        updateRRBenefit,
        deleteRRBenefit,
        submitRRGrievance,
        updateRRGrievanceStatus,
        updateFamilyWorkflowStage,
        addRRDocument,
        refreshRRData,
        // General Actions
        submitGrievance,
        resolveGrievance,
        dismissAlert,
        toastMessage,
        setToastMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
