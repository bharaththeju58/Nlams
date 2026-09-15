import {
  AffectedFamily,
  RRPlan,
  RRBenefit,
  RRGrievance,
  RRDocument,
  RRProgressRecord,
  RRInfrastructureFacility
} from '../types';

export const INITIAL_RR_FAMILIES: AffectedFamily[] = [
  {
    id: 'FAM-KRI-0034',
    projectId: 'PRJ-2025-0101',
    state: 'Tamil Nadu',
    district: 'Krishnagiri',
    village: 'Kamandoddi',
    parcelId: 'PAR-KRI-1003',
    headOfFamily: 'P. Muniswamy Gounder',
    name: 'P. Muniswamy Gounder',
    familyMembersCount: 5,
    landAcquiredAcres: 6.10,
    landAcquired: '6.10 Acres',
    displacementStatus: 'Physically Displaced',
    rrEligibility: 'Eligible',
    contact: '+91 98402 11022',
    currentStatus: 'Resettled',
    category: 'OBC',
    entitlements: {
      housingUnitOrCash: 'Constructed House',
      oneTimeGrant: 50000,
      annuityOrLumpSum: 'Lump-sum ₹5,00,000',
      resettlementSiteName: 'Shoolagiri R&R Modern Township Colony'
    },
    workflowStatus: 'Benefit Delivered',
    housingStatus: 'Possession Given',
    livelihoodStatus: 'Grant Credited',
    resettlementStatus: 'Settled',
    grievanceStatus: 'None',
    resettlementSiteName: 'Shoolagiri R&R Modern Township Colony',
    createdAt: '2024-06-15',
    updatedAt: '2025-01-20'
  },
  {
    id: 'FAM-CHA-0008',
    projectId: 'PRJ-2025-0102',
    state: 'Uttar Pradesh',
    district: 'Chandauli',
    village: 'Alinagar',
    parcelId: 'PAR-CHA-2001',
    headOfFamily: 'Rameshwar Nath Tripathi',
    name: 'Rameshwar Nath Tripathi',
    familyMembersCount: 7,
    landAcquiredAcres: 4.50,
    landAcquired: '4.50 Acres',
    displacementStatus: 'Physically Displaced',
    rrEligibility: 'Eligible',
    contact: '+91 94150 44890',
    currentStatus: 'Benefits In Progress',
    category: 'General',
    entitlements: {
      housingUnitOrCash: 'Cash Assistance ₹1.5L',
      oneTimeGrant: 50000,
      annuityOrLumpSum: '₹2,000/month for 20 yrs'
    },
    workflowStatus: 'Benefit Approved',
    housingStatus: 'Allotted',
    livelihoodStatus: 'Pending',
    resettlementStatus: 'Pending',
    grievanceStatus: 'Active Grievance',
    resettlementSiteName: 'Chandauli EDFC Green Habitat Colony',
    createdAt: '2024-08-01',
    updatedAt: '2025-02-10'
  },
  {
    id: 'FAM-PUN-0012',
    projectId: 'PRJ-2025-0105',
    state: 'Maharashtra',
    district: 'Pune',
    village: 'Khadakwasla',
    parcelId: 'PAR-PUN-5001',
    headOfFamily: 'Gajanan Dnyaneshwar Pawar',
    name: 'Gajanan Dnyaneshwar Pawar',
    familyMembersCount: 4,
    landAcquiredAcres: 3.15,
    landAcquired: '3.15 Acres',
    displacementStatus: 'Economically Displaced',
    rrEligibility: 'Eligible',
    contact: '+91 97640 56614',
    currentStatus: 'Eligibility Verified',
    category: 'Small/Marginal Farmer',
    entitlements: {
      housingUnitOrCash: 'Constructed House',
      oneTimeGrant: 50000,
      annuityOrLumpSum: 'Mandatory Job Offer',
      resettlementSiteName: 'Haveli Green Habitat Layout'
    },
    workflowStatus: 'Registered',
    housingStatus: 'Pending',
    livelihoodStatus: 'Pending',
    resettlementStatus: 'Pending',
    grievanceStatus: 'Active Grievance',
    resettlementSiteName: 'Haveli Green Habitat Layout',
    createdAt: '2024-10-12',
    updatedAt: '2025-02-05'
  },
  {
    id: 'FAM-BAG-0044',
    projectId: 'PRJ-2025-0103',
    state: 'Karnataka',
    district: 'Bagalkote',
    village: 'Terdal',
    parcelId: 'PAR-BAG-3001',
    headOfFamily: 'Basavaraj Channappa Patil',
    name: 'Basavaraj Channappa Patil',
    familyMembersCount: 6,
    landAcquiredAcres: 8.40,
    landAcquired: '8.40 Acres',
    displacementStatus: 'Physically Displaced',
    rrEligibility: 'Eligible',
    contact: '+91 98801 32901',
    currentStatus: 'Closed',
    category: 'Small/Marginal Farmer',
    entitlements: {
      housingUnitOrCash: 'Constructed House',
      oneTimeGrant: 50000,
      annuityOrLumpSum: 'Lump-sum ₹5,00,000',
      resettlementSiteName: 'Krishna Valley Rehabilitation Sector 4'
    },
    workflowStatus: 'Closed',
    housingStatus: 'Possession Given',
    livelihoodStatus: 'Job Appointed',
    resettlementStatus: 'Settled',
    grievanceStatus: 'None',
    resettlementSiteName: 'Krishna Valley Rehabilitation Sector 4',
    createdAt: '2024-04-10',
    updatedAt: '2024-12-15'
  },
  {
    id: 'FAM-KRI-0035',
    projectId: 'PRJ-2025-0101',
    state: 'Tamil Nadu',
    district: 'Krishnagiri',
    village: 'Shoolagiri',
    parcelId: 'PAR-KRI-1004',
    headOfFamily: 'K. Rajavelu',
    name: 'K. Rajavelu',
    familyMembersCount: 4,
    landAcquiredAcres: 2.10,
    landAcquired: '2.10 Acres',
    displacementStatus: 'Economically Displaced',
    rrEligibility: 'Eligible',
    contact: '+91 94432 88129',
    currentStatus: 'Plan Formulated',
    category: 'Small/Marginal Farmer',
    entitlements: {
      housingUnitOrCash: 'Cash Assistance ₹1.5L',
      oneTimeGrant: 50000,
      annuityOrLumpSum: 'Lump-sum ₹5,00,000'
    },
    workflowStatus: 'Assessed',
    housingStatus: 'Pending',
    livelihoodStatus: 'Pending',
    resettlementStatus: 'Pending',
    grievanceStatus: 'None',
    createdAt: '2024-07-20',
    updatedAt: '2025-01-10'
  },
  {
    id: 'FAM-JOD-0019',
    projectId: 'PRJ-2025-0104',
    state: 'Rajasthan',
    district: 'Jodhpur',
    village: 'Bhadla Khurd',
    parcelId: 'PAR-JOD-4002',
    headOfFamily: 'Khemraj Bhati',
    name: 'Khemraj Bhati',
    familyMembersCount: 8,
    landAcquiredAcres: 18.20,
    landAcquired: '18.20 Acres',
    displacementStatus: 'Affected Non-Displaced',
    rrEligibility: 'Under Review',
    contact: '+91 94141 87340',
    currentStatus: 'Surveyed',
    category: 'OBC',
    entitlements: {
      housingUnitOrCash: 'Not Applicable',
      oneTimeGrant: 50000,
      annuityOrLumpSum: 'Lump-sum ₹5,00,000'
    },
    workflowStatus: 'Identified',
    housingStatus: 'Exempted',
    livelihoodStatus: 'Pending',
    resettlementStatus: 'Pending',
    grievanceStatus: 'None',
    createdAt: '2025-01-05',
    updatedAt: '2025-01-15'
  }
];

const SCHEDULE_3_FACILITIES_TEMPLATE: RRInfrastructureFacility[] = [
  { id: 'FAC-01', name: 'All-Weather Pucca Approach & Internal Roads', category: 'Connectivity', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
  { id: 'FAC-02', name: 'Piped Potable Water Supply & Storage Sump', category: 'Water & Sanitation', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
  { id: 'FAC-03', name: '24x7 Electricity Feeder & Street Lighting', category: 'Power', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
  { id: 'FAC-04', name: 'Primary Health Centre (PHC) with Medicine Stock', category: 'Health & Education', status: 'In Progress', mandatorySchedule3: true, completionPercent: 85 },
  { id: 'FAC-05', name: 'Primary School & Integrated Anganwadi Centre', category: 'Health & Education', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
  { id: 'FAC-06', name: 'Community Hall / Gram Panchayat Bhavan', category: 'Community & Culture', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
  { id: 'FAC-07', name: 'Pucca Drainage System & Sewage Treatment Unit', category: 'Water & Sanitation', status: 'In Progress', mandatorySchedule3: true, completionPercent: 70 },
  { id: 'FAC-08', name: 'Cattle Grazing Land & Veterinary Care Booth', category: 'Community & Culture', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 }
];

export const INITIAL_RR_PLANS: RRPlan[] = [
  {
    id: 'RRP-2025-0101',
    projectId: 'PRJ-2025-0101',
    projectName: 'National Highway Expansion (NH-44 6-Laning)',
    state: 'Tamil Nadu',
    district: 'Krishnagiri',
    affectedFamiliesCount: 142,
    housingAssistance: {
      status: 'In Progress',
      unitsPlanned: 110,
      unitsConstructed: 98,
      unitsAllotted: 92,
      details: 'Duplex housing units in Shoolagiri Model Township Colony under Second Schedule Section 31.'
    },
    livelihoodAssistance: {
      status: 'In Progress',
      targetBeneficiaries: 142,
      supportedBeneficiaries: 128,
      details: 'Subsistence allowance ₹3,000/mo DBT and vocational training via Krishnagiri ITI.'
    },
    employmentAssistance: {
      status: 'In Progress',
      targetJobs: 45,
      providedJobs: 38,
      details: 'Toll operations & highway maintenance contracts reserved with NHAI concessionaire.'
    },
    landPlotAssistance: {
      status: 'Completed',
      plotsDeveloped: 120,
      plotsAllotted: 110,
      details: '50 sq. metre residential plots with title deeds (Pattas) distributed.'
    },
    infrastructureFacilities: SCHEDULE_3_FACILITIES_TEMPLATE,
    otherStatutoryBenefits: '₹50,000 shifting grant disbursed to 110 physically displaced families; ₹25,000 cattle shed grant provided.',
    plannedCompletionDate: '2025-08-31',
    status: 'In Progress',
    remarks: 'Approved by State Commissioner for Rehabilitation & Resettlement under RFCTLARR Act, 2013.',
    documents: [
      {
        id: 'DOC-0101-01',
        projectId: 'PRJ-2025-0101',
        title: 'Statutory R&R Scheme Gazette Notification',
        fileName: 'Gazette_RR_Scheme_NH44_Krishnagiri.pdf',
        fileSize: '4.2 MB',
        fileType: 'application/pdf',
        uploadedBy: 'Commissioner (R&R) Tamil Nadu',
        uploadedAt: '2024-06-25',
        documentCategory: 'Approved R&R Plan',
        downloadUrl: 'https://nlams.gov.in/docs/rr/rr-scheme-nh44.pdf'
      },
      {
        id: 'DOC-0101-02',
        projectId: 'PRJ-2025-0101',
        title: 'Shoolagiri Township Masterplan & Civic Layout',
        fileName: 'Shoolagiri_Township_Civil_Layout_Rev3.pdf',
        fileSize: '8.7 MB',
        fileType: 'application/pdf',
        uploadedBy: 'Chief Engineer (Highway Projects)',
        uploadedAt: '2024-07-10',
        documentCategory: 'Township Masterplan',
        downloadUrl: 'https://nlams.gov.in/docs/rr/shoolagiri-layout.pdf'
      }
    ],
    createdAt: '2024-06-15',
    updatedAt: '2025-01-25'
  },
  {
    id: 'RRP-2025-0102',
    projectId: 'PRJ-2025-0102',
    projectName: 'Eastern Dedicated Freight Rail Corridor — Phase III',
    state: 'Uttar Pradesh',
    district: 'Chandauli',
    affectedFamiliesCount: 210,
    housingAssistance: {
      status: 'Delayed',
      unitsPlanned: 160,
      unitsConstructed: 80,
      unitsAllotted: 64,
      details: 'Construction delayed due to site drainage arbitration; remedial work initiated.'
    },
    livelihoodAssistance: {
      status: 'In Progress',
      targetBeneficiaries: 210,
      supportedBeneficiaries: 140,
      details: 'Lump-sum ₹5,00,000 annuity option opted by 115 families; DBT pipeline initiated.'
    },
    employmentAssistance: {
      status: 'In Progress',
      targetJobs: 70,
      providedJobs: 42,
      details: 'Group D railway track maintenance vacancies routed through DFCCIL recruitment board.'
    },
    landPlotAssistance: {
      status: 'In Progress',
      plotsDeveloped: 180,
      plotsAllotted: 120,
      details: 'Plots demarcation in Mughal Sarai tehsil ongoing with Revenue RI.'
    },
    infrastructureFacilities: [
      { id: 'FAC-UP-01', name: 'Access Road from National Highway', category: 'Connectivity', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
      { id: 'FAC-UP-02', name: 'Overhead Water Tank & Distribution', category: 'Water & Sanitation', status: 'Delayed', mandatorySchedule3: true, completionPercent: 45 },
      { id: 'FAC-UP-03', name: 'Power Substation & Domestic Lines', category: 'Power', status: 'In Progress', mandatorySchedule3: true, completionPercent: 75 },
      { id: 'FAC-UP-04', name: 'Dispensary & Community Health Care', category: 'Health & Education', status: 'Delayed', mandatorySchedule3: true, completionPercent: 40 }
    ],
    otherStatutoryBenefits: 'Subsistence allowance partly disbursed; cattle shed grant processing.',
    plannedCompletionDate: '2024-12-31',
    status: 'Delayed',
    remarks: 'Delay alert active: Exceeded planned completion milestone of 31-Dec-2024 by 60+ days.',
    documents: [
      {
        id: 'DOC-0102-01',
        projectId: 'PRJ-2025-0102',
        title: 'DFCCIL Section 31 R&R Master Sanction Order',
        fileName: 'DFCCIL_Chandauli_RR_Plan_Approved.pdf',
        fileSize: '5.1 MB',
        fileType: 'application/pdf',
        uploadedBy: 'Additional District Magistrate (LA)',
        uploadedAt: '2024-08-14',
        documentCategory: 'Approved R&R Plan',
        downloadUrl: 'https://nlams.gov.in/docs/rr/dfccil-rr-plan.pdf'
      }
    ],
    createdAt: '2024-07-20',
    updatedAt: '2025-02-12'
  },
  {
    id: 'RRP-2025-0103',
    projectId: 'PRJ-2025-0103',
    projectName: 'Upper Krishna Multi-Purpose Irrigation Canal',
    state: 'Karnataka',
    district: 'Bagalkote',
    affectedFamiliesCount: 95,
    housingAssistance: {
      status: 'Completed',
      unitsPlanned: 95,
      unitsConstructed: 95,
      unitsAllotted: 95,
      details: 'All eligible displaced families relocated to Krishna Valley Rehabilitation Sector 4.'
    },
    livelihoodAssistance: {
      status: 'Completed',
      targetBeneficiaries: 95,
      supportedBeneficiaries: 95,
      details: 'Subsistence allowance and agricultural rehabilitation cash disbursed 100% via DBT.'
    },
    employmentAssistance: {
      status: 'Completed',
      targetJobs: 30,
      providedJobs: 30,
      details: 'Canal maintenance & cooperative water user society employment fully assigned.'
    },
    landPlotAssistance: {
      status: 'Completed',
      plotsDeveloped: 100,
      plotsAllotted: 95,
      details: '100% completed with registered encumbrance-free title deeds.'
    },
    infrastructureFacilities: SCHEDULE_3_FACILITIES_TEMPLATE.map(f => ({ ...f, status: 'Completed', completionPercent: 100 })),
    otherStatutoryBenefits: 'Full entitlement package disbursed under Karnataka RFCTLARR State Rules.',
    plannedCompletionDate: '2024-11-30',
    actualCompletionDate: '2024-11-20',
    status: 'Completed',
    remarks: 'Model township milestone certified complete by Divisional Commissioner, Belagavi.',
    documents: [
      {
        id: 'DOC-0103-01',
        projectId: 'PRJ-2025-0103',
        title: 'Krishna Valley Rehabilitation Handover Certificate',
        fileName: 'Bagalkote_RR_Completion_Certificate.pdf',
        fileSize: '3.4 MB',
        fileType: 'application/pdf',
        uploadedBy: 'DC & Magistrate, Bagalkote',
        uploadedAt: '2024-11-22',
        documentCategory: 'Allotment Sanction Order',
        downloadUrl: 'https://nlams.gov.in/docs/rr/bagalkote-completion.pdf'
      }
    ],
    createdAt: '2024-03-10',
    updatedAt: '2024-11-25'
  }
];

export const INITIAL_RR_BENEFITS: RRBenefit[] = [
  {
    id: 'BNF-001',
    familyId: 'FAM-KRI-0034',
    beneficiaryName: 'P. Muniswamy Gounder',
    projectId: 'PRJ-2025-0101',
    benefitType: 'Housing Assistance',
    eligibleAmount: 1500000,
    eligibleAmountDisplay: 'Constructed Unit (Plot #42, Shoolagiri)',
    approved: true,
    approvedDate: '2024-08-10',
    approvedAmount: 1500000,
    disbursed: true,
    disbursedDate: '2024-11-15',
    disbursedAmount: 1500000,
    date: '2024-11-15',
    status: 'Completed',
    remarks: 'Possession key handed over by District Collector Krishnagiri.'
  },
  {
    id: 'BNF-002',
    familyId: 'FAM-KRI-0034',
    beneficiaryName: 'P. Muniswamy Gounder',
    projectId: 'PRJ-2025-0101',
    benefitType: 'Subsistence Allowance',
    eligibleAmount: 36000,
    eligibleAmountDisplay: '₹3,000 / month for 12 months',
    approved: true,
    approvedDate: '2024-07-05',
    approvedAmount: 36000,
    disbursed: true,
    disbursedDate: '2024-07-20',
    disbursedAmount: 36000,
    date: '2024-07-20',
    status: 'Disbursed',
    remarks: '12 months advance DBT credited via PFMS Ref PFMS-TN-RR-90412.'
  },
  {
    id: 'BNF-003',
    familyId: 'FAM-KRI-0034',
    beneficiaryName: 'P. Muniswamy Gounder',
    projectId: 'PRJ-2025-0101',
    benefitType: 'Shifting/Transport Allowance',
    eligibleAmount: 50000,
    eligibleAmountDisplay: '₹50,000 one-time transport grant',
    approved: true,
    approvedDate: '2024-07-05',
    approvedAmount: 50000,
    disbursed: true,
    disbursedDate: '2024-07-25',
    disbursedAmount: 50000,
    date: '2024-07-25',
    status: 'Disbursed',
    remarks: 'Transportation and luggage transfer support paid in full.'
  },
  {
    id: 'BNF-004',
    familyId: 'FAM-CHA-0008',
    beneficiaryName: 'Rameshwar Nath Tripathi',
    projectId: 'PRJ-2025-0102',
    benefitType: 'Housing Assistance',
    eligibleAmount: 150000,
    eligibleAmountDisplay: '₹1,50,000 cash grant in lieu of house',
    approved: true,
    approvedDate: '2024-11-12',
    approvedAmount: 150000,
    disbursed: false,
    disbursedAmount: 0,
    date: '2024-11-12',
    status: 'Delayed',
    remarks: 'Approved over 90 days ago but payment pending treasury token clearance. Rule alert triggered.'
  },
  {
    id: 'BNF-005',
    familyId: 'FAM-CHA-0008',
    beneficiaryName: 'Rameshwar Nath Tripathi',
    projectId: 'PRJ-2025-0102',
    benefitType: 'Subsistence Allowance',
    eligibleAmount: 36000,
    eligibleAmountDisplay: '₹3,000 / month (12 months)',
    approved: true,
    approvedDate: '2024-11-12',
    approvedAmount: 36000,
    disbursed: true,
    disbursedDate: '2024-12-05',
    disbursedAmount: 36000,
    date: '2024-12-05',
    status: 'Disbursed',
    remarks: 'First tranche credited to SBI Chandauli account.'
  },
  {
    id: 'BNF-006',
    familyId: 'FAM-PUN-0012',
    beneficiaryName: 'Gajanan Dnyaneshwar Pawar',
    projectId: 'PRJ-2025-0105',
    benefitType: 'Mandatory Job / Annuity',
    eligibleAmount: 500000,
    eligibleAmountDisplay: 'Mandatory Job Offer or ₹5,00,000 Lump-sum',
    approved: false,
    approvedAmount: 0,
    disbursed: false,
    disbursedAmount: 0,
    date: '2025-01-10',
    status: 'Pending',
    remarks: 'Awaiting option selection form submission by beneficiary family.'
  }
];

export const INITIAL_RR_GRIEVANCES: RRGrievance[] = [
  {
    id: 'RRG-2025-001',
    referenceNumber: 'NLAMS-RRG-2025-0001',
    projectId: 'PRJ-2025-0102',
    familyId: 'FAM-CHA-0008',
    complainantName: 'Rameshwar Nath Tripathi',
    contact: '+91 94150 44890',
    category: 'Housing Unit Allotment',
    description: 'Housing financial grant of ₹1.5L approved under Second Schedule on 12-Nov-2024 has not been disbursed into bank account after 90+ days.',
    submissionDate: '2025-01-15',
    hearingDate: '2025-02-28',
    status: 'Open',
    priority: 'Urgent',
    assignedOfficer: 'ADM (LA & R&R), Chandauli',
    officialResolutionNotes: 'Treasury bill re-routed to Priority 1 DBT queue for immediate clearance.'
  },
  {
    id: 'RRG-2025-002',
    referenceNumber: 'NLAMS-RRG-2025-0002',
    projectId: 'PRJ-2025-0105',
    familyId: 'FAM-PUN-0012',
    complainantName: 'Gajanan Dnyaneshwar Pawar',
    contact: '+91 97640 56614',
    category: 'Employment / Annuity Grant',
    description: 'Family requested job entitlement in Pune Metro Rail Corporation under Schedule II; notification of eligible list delayed by authority.',
    submissionDate: '2025-02-01',
    status: 'Under Review',
    priority: 'High',
    assignedOfficer: 'Deputy Collector (R&R Metro), Pune',
    officialResolutionNotes: 'Verification of family educational qualifications underway with MMRDA employment cell.'
  },
  {
    id: 'RRG-2025-003',
    referenceNumber: 'NLAMS-RRG-2025-0003',
    projectId: 'PRJ-2025-0101',
    familyId: 'FAM-KRI-0034',
    complainantName: 'P. Muniswamy Gounder',
    contact: '+91 98402 11022',
    category: 'Infrastructure Deficiency',
    description: 'Street lighting feeder in Shoolagiri Colony Sector B experienced 48-hour blackout during monsoon.',
    submissionDate: '2024-12-10',
    status: 'Resolved',
    priority: 'Medium',
    assignedOfficer: 'Executive Engineer (PWD/EB), Krishnagiri',
    officialResolutionNotes: 'Transformer repaired and 15kVA solar backup system installed. Grievance closed with beneficiary consent.',
    resolvedDate: '2024-12-14'
  }
];

export const INITIAL_RR_DOCUMENTS: RRDocument[] = [
  {
    id: 'DOC-001',
    planId: 'RRP-2025-0101',
    projectId: 'PRJ-2025-0101',
    title: 'Statutory R&R Scheme Gazette Notification',
    fileName: 'Gazette_RR_Scheme_NH44_Krishnagiri.pdf',
    fileSize: '4.2 MB',
    fileType: 'application/pdf',
    uploadedBy: 'Commissioner (R&R) Tamil Nadu',
    uploadedAt: '2024-06-25',
    documentCategory: 'Approved R&R Plan',
    downloadUrl: 'https://nlams.gov.in/docs/rr/rr-scheme-nh44.pdf'
  },
  {
    id: 'DOC-002',
    planId: 'RRP-2025-0101',
    projectId: 'PRJ-2025-0101',
    title: 'Shoolagiri Township Masterplan & Civic Layout',
    fileName: 'Shoolagiri_Township_Civil_Layout_Rev3.pdf',
    fileSize: '8.7 MB',
    fileType: 'application/pdf',
    uploadedBy: 'Chief Engineer (Highway Projects)',
    uploadedAt: '2024-07-10',
    documentCategory: 'Township Masterplan',
    downloadUrl: 'https://nlams.gov.in/docs/rr/shoolagiri-layout.pdf'
  },
  {
    id: 'DOC-003',
    planId: 'RRP-2025-0102',
    projectId: 'PRJ-2025-0102',
    title: 'DFCCIL Section 31 R&R Master Sanction Order',
    fileName: 'DFCCIL_Chandauli_RR_Plan_Approved.pdf',
    fileSize: '5.1 MB',
    fileType: 'application/pdf',
    uploadedBy: 'Additional District Magistrate (LA)',
    uploadedAt: '2024-08-14',
    documentCategory: 'Approved R&R Plan',
    downloadUrl: 'https://nlams.gov.in/docs/rr/dfccil-rr-plan.pdf'
  },
  {
    id: 'DOC-004',
    planId: 'RRP-2025-0103',
    projectId: 'PRJ-2025-0103',
    title: 'Krishna Valley Rehabilitation Handover Certificate',
    fileName: 'Bagalkote_RR_Completion_Certificate.pdf',
    fileSize: '3.4 MB',
    fileType: 'application/pdf',
    uploadedBy: 'DC & Magistrate, Bagalkote',
    uploadedAt: '2024-11-22',
    documentCategory: 'Allotment Sanction Order',
    downloadUrl: 'https://nlams.gov.in/docs/rr/bagalkote-completion.pdf'
  }
];

export const INITIAL_RR_PROGRESS: RRProgressRecord[] = [
  {
    id: 'PRG-KRI-0034',
    familyId: 'FAM-KRI-0034',
    projectId: 'PRJ-2025-0101',
    currentStageIndex: 5,
    stages: [
      { stageNumber: 1, stageKey: 'SURVEY', stageName: 'Affected Family Surveyed', status: 'Completed', updatedAt: '2024-06-15', officer: 'Revenue Inspector (LA)' },
      { stageNumber: 2, stageKey: 'ELIGIBILITY', stageName: 'Eligibility Verified', status: 'Completed', updatedAt: '2024-07-02', officer: 'SDRO Krishnagiri' },
      { stageNumber: 3, stageKey: 'PLAN', stageName: 'R&R Plan Formulated', status: 'Completed', updatedAt: '2024-08-10', officer: 'Administrator (R&R)' },
      { stageNumber: 4, stageKey: 'BENEFITS_APPROVED', stageName: 'Benefits Approved', status: 'Completed', updatedAt: '2024-09-01', officer: 'District Collector' },
      { stageNumber: 5, stageKey: 'BENEFITS_PROVIDED', stageName: 'Benefits Provided', status: 'Completed', updatedAt: '2024-11-15', officer: 'Treasury Officer' },
      { stageNumber: 6, stageKey: 'RESETTLEMENT', stageName: 'Resettlement Completed', status: 'In Progress', updatedAt: '2025-01-20', officer: 'Township Project Officer' },
      { stageNumber: 7, stageKey: 'CLOSED', stageName: 'Case Closed', status: 'Pending' }
    ],
    overallStatus: 'Resettlement In Progress',
    updatedAt: '2025-01-20'
  },
  {
    id: 'PRG-CHA-0008',
    familyId: 'FAM-CHA-0008',
    projectId: 'PRJ-2025-0102',
    currentStageIndex: 3,
    stages: [
      { stageNumber: 1, stageKey: 'SURVEY', stageName: 'Affected Family Surveyed', status: 'Completed', updatedAt: '2024-08-01', officer: 'Patwari / RI Alinagar' },
      { stageNumber: 2, stageKey: 'ELIGIBILITY', stageName: 'Eligibility Verified', status: 'Completed', updatedAt: '2024-09-15', officer: 'SDM Chandauli' },
      { stageNumber: 3, stageKey: 'PLAN', stageName: 'R&R Plan Formulated', status: 'Completed', updatedAt: '2024-10-20', officer: 'Administrator (R&R)' },
      { stageNumber: 4, stageKey: 'BENEFITS_APPROVED', stageName: 'Benefits Approved', status: 'Completed', updatedAt: '2024-11-12', officer: 'District Collector' },
      { stageNumber: 5, stageKey: 'BENEFITS_PROVIDED', stageName: 'Benefits Provided', status: 'Delayed', updatedAt: '2025-02-10', notes: 'Treasury token approval delayed past 60 days' },
      { stageNumber: 6, stageKey: 'RESETTLEMENT', stageName: 'Resettlement Completed', status: 'Pending' },
      { stageNumber: 7, stageKey: 'CLOSED', stageName: 'Case Closed', status: 'Pending' }
    ],
    overallStatus: 'Benefits Delayed',
    updatedAt: '2025-02-10'
  },
  {
    id: 'PRG-PUN-0012',
    familyId: 'FAM-PUN-0012',
    projectId: 'PRJ-2025-0105',
    currentStageIndex: 1,
    stages: [
      { stageNumber: 1, stageKey: 'SURVEY', stageName: 'Affected Family Surveyed', status: 'Completed', updatedAt: '2024-10-12', officer: 'Talathi Khadakwasla' },
      { stageNumber: 2, stageKey: 'ELIGIBILITY', stageName: 'Eligibility Verified', status: 'In Progress', updatedAt: '2025-02-05', officer: 'Deputy Collector Metro' },
      { stageNumber: 3, stageKey: 'PLAN', stageName: 'R&R Plan Formulated', status: 'Pending' },
      { stageNumber: 4, stageKey: 'BENEFITS_APPROVED', stageName: 'Benefits Approved', status: 'Pending' },
      { stageNumber: 5, stageKey: 'BENEFITS_PROVIDED', stageName: 'Benefits Provided', status: 'Pending' },
      { stageNumber: 6, stageKey: 'RESETTLEMENT', stageName: 'Resettlement Completed', status: 'Pending' },
      { stageNumber: 7, stageKey: 'CLOSED', stageName: 'Case Closed', status: 'Pending' }
    ],
    overallStatus: 'Eligibility Under Review',
    updatedAt: '2025-02-05'
  },
  {
    id: 'PRG-BAG-0044',
    familyId: 'FAM-BAG-0044',
    projectId: 'PRJ-2025-0103',
    currentStageIndex: 6,
    stages: [
      { stageNumber: 1, stageKey: 'SURVEY', stageName: 'Affected Family Surveyed', status: 'Completed', updatedAt: '2024-04-10' },
      { stageNumber: 2, stageKey: 'ELIGIBILITY', stageName: 'Eligibility Verified', status: 'Completed', updatedAt: '2024-05-15' },
      { stageNumber: 3, stageKey: 'PLAN', stageName: 'R&R Plan Formulated', status: 'Completed', updatedAt: '2024-06-20' },
      { stageNumber: 4, stageKey: 'BENEFITS_APPROVED', stageName: 'Benefits Approved', status: 'Completed', updatedAt: '2024-07-10' },
      { stageNumber: 5, stageKey: 'BENEFITS_PROVIDED', stageName: 'Benefits Provided', status: 'Completed', updatedAt: '2024-09-05' },
      { stageNumber: 6, stageKey: 'RESETTLEMENT', stageName: 'Resettlement Completed', status: 'Completed', updatedAt: '2024-11-15' },
      { stageNumber: 7, stageKey: 'CLOSED', stageName: 'Case Closed', status: 'Completed', updatedAt: '2024-12-15' }
    ],
    overallStatus: 'Case Successfully Closed',
    updatedAt: '2024-12-15'
  }
];
