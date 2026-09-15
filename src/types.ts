export type UserRole =
  | 'National Administrator'
  | 'System Administrator'
  | 'Central Sponsoring Ministry'
  | 'Requiring Body / Proponent (PSU / Department)'
  | 'State Revenue & Nodal Authority'
  | 'Competent Authority (District Collector / CALA)'
  | 'Rehabilitation & Resettlement (R&R) Authority'
  | 'Project Implementing Agency (PIA / Concessionaire)'
  | 'State Nodal Officer'
  | 'District Collector'
  | 'Land Requiring Body'
  | 'Central Line Ministry (MoRTH, Railways, Power)'
  | 'Central Line Ministry'
  | 'Project Implementing Agency'
  | 'Administrator (R&R) / Commissioner (RFCTLARR Sec 43)'
  | 'R&R Officer'
  | 'Auditor'
  | 'Public/Citizen';

export interface OfficerCredential {
  role: UserRole;
  name: string;
  officialId: string;
  email: string;
  departmentOrAgency: string;
  clearance: string;
  jurisdictionOrEntity?: string;
  designationLabel: string;
  employeeBadgeId: string;
}

export type ProjectSector =
  | 'Highways'
  | 'Railways'
  | 'Irrigation'
  | 'Urban Infrastructure'
  | 'Renewable Energy'
  | 'Other Infrastructure';

export type ProjectStatus =
  | 'Proposal Submitted'
  | 'Under Scrutiny'
  | 'Preliminary Notification Published'
  | 'Final Declaration Published'
  | 'Award Declared'
  | 'Compensation Disbursement'
  | 'Possession Handover'
  | 'R&R Implementation'
  | 'Project Closed';

export type ParcelStatus =
  | 'Proposed'
  | 'Notified'
  | 'Acquired'
  | 'Disputed'
  | 'Excluded';

export type LandType =
  | 'Agricultural (Irrigated)'
  | 'Agricultural (Dry)'
  | 'Non-Agricultural / Commercial'
  | 'Residential / Abadi'
  | 'Government / Wasteland'
  | 'Forest Land';

export interface LandParcel {
  id: string;
  surveyNumber: string;
  projectId: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  areaAcres: number;
  landType: LandType;
  ownerName: string;
  ownerReferenceMasked: string;
  ownershipType: 'Private Individual' | 'Joint / Coparcenary' | 'Community' | 'State Government';
  status: ParcelStatus;
  compensationStatus: 'Not Assessed' | 'Award Declared' | 'PFMS Processing' | 'Disbursed' | 'Disputed / In Escrow';
  possessionStatus: 'Pending' | 'Notice Issued' | 'Possession Taken';
  coordinates: { x: number; y: number; width?: number; height?: number; points?: string };
  marketValuePerAcre: number;
  externalLandRecordSource?: string; // e.g., "Bhoomi (Karnataka)" or "Bhulekh (UP)"
  mutationStatus?: 'Verified' | 'Pending Verification' | 'Disputed';
  // Real Geographic GIS fields
  latitude: number;
  longitude: number;
  geometry?: {
    type: 'Polygon';
    coordinates: [number, number][][]; // GeoJSON format: [[lng, lat], ...]
  };
  awardStatus?: 'Pending' | 'Notice Under Section 21' | 'Award Declared' | 'Payment Initiated' | 'Paid';
  notificationStatus?: 'Section 11 Notified' | 'Section 19 Declared' | 'Pending Notification' | 'Exempted';
  rrStatus?: 'Not Required' | 'Survey Pending' | 'Entitlement Approved' | 'Resettled';
  rehabilitationStatus?: string;
  compensationAmount?: number;
  amountPaid?: number;
  amountPending?: number;
  verificationStatus?: string;
}

export interface Project {
  id: string;
  name: string;
  sector: ProjectSector;
  requiringBody: string;
  state: string;
  district: string;
  estimatedLandAcres: number;
  acquiredLandAcres: number;
  numberOfVillages: number;
  projectCostCrores: number;
  compensationBudgetCrores: number;
  compensationDisbursedCrores: number;
  startDate: string;
  expectedCompletionDate: string;
  status: ProjectStatus;
  scrutinyStatus: 'Pending' | 'Approved' | 'Clarification Requested' | 'Rejected';
  scrutinyNotes?: string;
  alignmentMapUrl?: string;
  preliminaryNotificationNumber?: string;
  preliminaryNotificationDate?: string;
  finalDeclarationNumber?: string;
  finalDeclarationDate?: string;
  rrCompletionPercent: number;
  delayed: boolean;
  delayReason?: string;
  createdAt: string;
  
  totalAffectedParcels?: number;
  verifiedParcels?: number;
  pendingVerification?: number;
  totalLandArea?: number;
  totalLandowners?: number;
  
  // Real Geographic GIS fields
  centerCoordinates?: [number, number]; // [latitude, longitude]
  zoomLevel?: number;
  alignmentGeometry?: {
    type: 'LineString';
    coordinates: [number, number][]; // [[latitude, longitude], ...] for Leaflet polyline
  };
  affectedDistricts?: string[];
  affectedVillages?: string[];
}

export interface Award {
  id: string;
  awardNumber: string;
  projectId: string;
  parcelId: string;
  landownerName: string;
  landAreaAcres: number;
  marketValueBase: number;
  multiplierFactor: number; // 1.0 to 2.0 based on rural/urban under First Schedule
  solatium100Percent: number; // 100% of market value
  additionalInterest12Percent: number; // 12% per annum from Sec 11 notification to award
  assetValuation: number; // Trees, structures, crops
  totalAwardAmount: number;
  awardDate: string;
  status: 'Draft' | 'Verified' | 'Declared' | 'Payment Initiated' | 'Paid';
  declarationAuthority: string;
  awardDocumentUrl?: string;
}

export interface CompensationRecord {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  parcelId: string;
  bankName: string;
  bankAccountNumberMasked: string;
  ifscMasked: string;
  amount: number;
  aadhaarVerified: boolean;
  status: 'Initiated' | 'Processing' | 'Disbursed' | 'Failed' | 'On Hold';
  utrNumber: string;
  disbursedDate?: string;
}

export interface ResettlementSite {
  id: string;
  name: string;
  location: string;
  projectId: string;
  plotsDeveloped: number;
  plotsAllotted: number;
}

export interface CompensationPayment {
  id: string;
  awardId: string;
  projectId: string;
  parcelId: string;
  beneficiaryName: string;
  beneficiaryMasked: string;
  bankAccountMasked: string;
  ifscMasked: string;
  amount: number;
  pfmsReferenceId?: string;
  paymentStatus: 'Pending' | 'Processing' | 'Paid' | 'Delayed' | 'Failed';
  dueDate: string;
  paymentDate?: string;
  remarks?: string;
}

export interface PossessionRecord {
  id: string;
  projectId: string;
  parcelId: string;
  surveyNumber: string;
  possessionDate: string;
  vestingOrderNumber: string;
  recordingOfficer: string;
  officerDesignation: string;
  certificateDocumentUrl: string;
  panchnamaUploaded: boolean;
  encumbranceFreeConfirmed: boolean;
  gisSynced: boolean;
  timestamp: string;
}

export interface AffectedFamily {
  id: string;
  projectId: string;
  state?: string;
  district?: string;
  village: string;
  parcelId?: string;
  headOfFamily: string;
  name?: string; // Alias for headOfFamily
  familyMembersCount: number;
  landAcquiredAcres?: number;
  landAcquired?: string | number; // e.g. "3.25 Acres" or numeric
  displacementStatus?: 'Physically Displaced' | 'Economically Displaced' | 'Both' | 'Affected Non-Displaced';
  rrEligibility?: 'Eligible' | 'Under Review' | 'Ineligible';
  contact?: string;
  currentStatus?: 'Surveyed' | 'Eligibility Verified' | 'Plan Formulated' | 'Benefits In Progress' | 'Benefits Delivered' | 'Resettled' | 'Closed';
  category: 'SC' | 'ST' | 'OBC' | 'General' | 'Small/Marginal Farmer' | 'Landless Agricultural Labourer';
  entitlements: {
    housingUnitOrCash: 'Constructed House' | 'Cash Assistance ₹1.5L' | 'Not Applicable' | string;
    oneTimeGrant: number; // ₹50,000 subsistence
    annuityOrLumpSum: '₹2,000/month for 20 yrs' | 'Lump-sum ₹5,00,000' | 'Mandatory Job Offer' | string;
    resettlementSiteName?: string;
  };
  workflowStatus:
    | 'Identified'
    | 'Registered'
    | 'Assessed'
    | 'Benefit Approved'
    | 'Benefit Delivered'
    | 'Resettled'
    | 'Closed';
  housingStatus: 'Pending' | 'Allotted' | 'Possession Given' | 'Exempted';
  livelihoodStatus: 'Pending' | 'Grant Credited' | 'Training Provided' | 'Job Appointed';
  resettlementStatus: 'Pending' | 'Site Transit' | 'Settled';
  grievanceStatus?: 'None' | 'Active Grievance' | 'Resolved';
  resettlementSiteName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RRInfrastructureFacility {
  id: string;
  name: string;
  category: 'Connectivity' | 'Water & Sanitation' | 'Power' | 'Health & Education' | 'Community & Culture';
  status: 'Completed' | 'In Progress' | 'Pending' | 'Delayed';
  mandatorySchedule3: boolean;
  completionPercent: number;
  remarks?: string;
}

export interface RRDocument {
  id: string;
  planId?: string;
  projectId: string;
  familyId?: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  documentCategory: 'Approved R&R Plan' | 'Statutory Entitlement Matrix' | 'Township Masterplan' | 'Allotment Sanction Order' | 'DBT Bank Clearance' | 'Grievance Order' | 'Other';
  downloadUrl: string;
}

export interface RRPlan {
  id: string;
  projectId: string;
  projectName?: string;
  state?: string;
  district?: string;
  affectedFamiliesCount: number;
  housingAssistance: {
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
    unitsPlanned: number;
    unitsConstructed: number;
    unitsAllotted: number;
    details: string;
  };
  livelihoodAssistance: {
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
    targetBeneficiaries: number;
    supportedBeneficiaries: number;
    details: string;
  };
  employmentAssistance: {
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
    targetJobs: number;
    providedJobs: number;
    details: string;
  };
  landPlotAssistance: {
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
    plotsDeveloped: number;
    plotsAllotted: number;
    details: string;
  };
  infrastructureFacilities: RRInfrastructureFacility[];
  otherStatutoryBenefits: string;
  plannedCompletionDate: string;
  actualCompletionDate?: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  remarks: string;
  documents: RRDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface RRBenefit {
  id: string;
  familyId: string;
  beneficiaryName: string;
  projectId: string;
  benefitType:
    | 'Housing Assistance'
    | 'Subsistence Allowance'
    | 'Shifting/Transport Allowance'
    | 'Shifting Grant'
    | 'Resettlement Plot'
    | 'Resettlement Allowance'
    | 'Mandatory Job / Annuity'
    | 'Employment / Annuity Grant'
    | 'Cattle Shed / Petty Shop Grant'
    | 'One-time Grant for SC/ST'
    | 'Skill Training Grant';
  eligibleAmount: number;
  eligibleAmountDisplay: string;
  approved: boolean;
  approvedDate?: string;
  approvedAmount: number;
  disbursed: boolean;
  disbursedDate?: string;
  disbursedAmount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Disbursed' | 'Completed' | 'Delayed';
  pfmsTransactionId?: string;
  remarks: string;
}

export interface RRProgressStage {
  stageKey: string;
  stageName: string;
  stageNumber: number;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Delayed';
  updatedAt?: string;
  officer?: string;
  notes?: string;
}

export interface RRProgressRecord {
  id: string;
  familyId: string;
  projectId: string;
  currentStageIndex: number; // 0 to 6
  stages: RRProgressStage[];
  overallStatus: string;
  updatedAt: string;
}

export interface RRGrievance {
  id: string;
  referenceNumber?: string;
  projectId: string;
  familyId?: string;
  complainantName: string;
  contact?: string;
  category:
    | 'Housing Allotment'
    | 'Housing Unit Allotment'
    | 'Subsistence Allowance Delayed'
    | 'Delayed Disbursement'
    | 'Compensation Amount'
    | 'Plot Allocation Dispute'
    | 'Cadastral Survey Omission'
    | 'Civic Amenities'
    | 'Infrastructure Deficiency'
    | 'Eligibility Rejection'
    | 'Employment / Annuity Grant'
    | 'Other'
    | 'Other R&R Grievance';
  subject?: string;
  description: string;
  submissionDate?: string;
  dateFiled?: string;
  hearingDate?: string;
  status: 'Open' | 'Under Review' | 'Hearing Scheduled' | 'Resolved' | 'Closed';
  priority?: 'Urgent' | 'High' | 'Medium' | 'Low';
  assignedOfficer?: string;
  officialResolutionNotes?: string;
  resolutionNotes?: string;
  resolvedDate?: string;
}

export interface RRRuleAlert {
  id: string;
  ruleType: 'PLAN_DELAYED' | 'BENEFIT_PENDING' | 'GRIEVANCE_OVERDUE';
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  entityId: string;
  entityType: 'Plan' | 'Benefit' | 'Grievance';
  projectId: string;
  triggerDate: string;
}

export interface Grievance {
  id: string;
  referenceNumber?: string;
  projectId: string;
  parcelId?: string;
  complainantName?: string;
  citizenName?: string;
  complainantContactMasked?: string;
  category: string;
  priority?: 'Urgent' | 'High' | 'Medium' | 'Low';
  description: string;
  submissionDate: string;
  hearingDate?: string;
  status: 'Submitted' | 'Under Review' | 'In Review' | 'Hearing Scheduled' | 'Action Required' | 'Resolved' | 'Escalated to Authority' | 'Closed';
  assignedAuthority?: string;
  officialResolutionNotes?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface AuditLog {
  id: string;
  eventId?: string;
  timestamp: string;
  date?: string;
  time?: string;
  userId?: string;
  user_id?: string;
  userName?: string;
  user_name?: string;
  user: string;
  userRole?: UserRole | string;
  user_role?: UserRole | string;
  role: UserRole;
  action: string;
  module: string;
  entityType?: string;
  entity_type?: string;
  entityId?: string;
  entity_id?: string;
  recordId: string;
  projectId?: string;
  project_id?: string;
  description: string;
  details?: string;
  oldValue?: any;
  old_value?: any;
  previousStatus?: string;
  newValue?: any;
  new_value?: any;
  newStatus?: string;
  ipAddress?: string;
  ip_address?: string;
  ipSession?: string;
  status: 'SUCCESS' | 'FAILURE';
  hash?: string;
  createdAt?: string;
  created_at?: string;
}

export interface AuditStats {
  totalActivities: number;
  todayActivities: number;
  successfulActions: number;
  failedActions: number;
  moduleCounts: Record<string, number>;
  recentActivities: AuditLog[];
}

export interface AuditQueryParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  user?: string;
  role?: string;
  module?: string;
  action?: string;
  status?: string;
  entityType?: string;
  entityId?: string;
  projectId?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface RuleAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Informational';
  title: string;
  description: string;
  module: string;
  projectId?: string;
  createdAt: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  actionLabel?: string;
  actionRoute?: string;
}

export interface LandRecordExternalAPI {
  sourceName: string;
  stateCode: string;
  portalUrl: string;
  status: 'Connected (Demo Sandbox)' | 'Sync Active' | 'Awaiting API Key';
  lastSyncTime: string;
  recordsVerifiedCount: number;
}
