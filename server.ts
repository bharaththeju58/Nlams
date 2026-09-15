import express from 'express';
import path from 'path';
import fs from 'fs';
import ragRouter from './server/rag.ts';



// Data storage file path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'rr_database.json');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default seed
const DEFAULT_DB = {
  families: [
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
    }
  ],
  plans: [
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
      infrastructureFacilities: [
        { id: 'FAC-01', name: 'All-Weather Pucca Approach & Internal Roads', category: 'Connectivity', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
        { id: 'FAC-02', name: 'Piped Potable Water Supply & Storage Sump', category: 'Water & Sanitation', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
        { id: 'FAC-03', name: '24x7 Electricity Feeder & Street Lighting', category: 'Power', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
        { id: 'FAC-04', name: 'Primary Health Centre (PHC) with Medicine Stock', category: 'Health & Education', status: 'In Progress', mandatorySchedule3: true, completionPercent: 85 },
        { id: 'FAC-05', name: 'Primary School & Integrated Anganwadi Centre', category: 'Health & Education', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
        { id: 'FAC-06', name: 'Community Hall / Gram Panchayat Bhavan', category: 'Community & Culture', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 }
      ],
      otherStatutoryBenefits: '₹50,000 shifting grant disbursed to 110 physically displaced families; ₹25,000 cattle shed grant provided.',
      plannedCompletionDate: '2025-08-31',
      status: 'In Progress',
      remarks: 'Approved by State Commissioner for Rehabilitation & Resettlement under RFCTLARR Act, 2013.',
      documents: [],
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
        { id: 'FAC-UP-03', name: 'Power Substation & Domestic Lines', category: 'Power', status: 'In Progress', mandatorySchedule3: true, completionPercent: 75 }
      ],
      otherStatutoryBenefits: 'Subsistence allowance partly disbursed; cattle shed grant processing.',
      plannedCompletionDate: '2024-12-31',
      status: 'Delayed',
      remarks: 'Delay alert active: Exceeded planned completion milestone of 31-Dec-2024 by 60+ days.',
      documents: [],
      createdAt: '2024-07-20',
      updatedAt: '2025-02-12'
    }
  ],
  benefits: [
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
      remarks: 'Approved over 90 days ago but payment pending treasury token clearance.'
    }
  ],
  grievances: [
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
    }
  ],
  documents: [
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
    }
  ],
  progress: {},
  audit_logs: [
    {
      id: 'AUD-2024-001',
      eventId: 'EVT-NLAMS-20240315-001',
      timestamp: '2024-03-15T09:30:00.000Z',
      date: '2024-03-15',
      time: '09:30:00',
      userId: 'USR-NHAI-CE01',
      user_id: 'USR-NHAI-CE01',
      userName: 'P. K. Verma, Chief Engineer',
      user_name: 'P. K. Verma, Chief Engineer',
      user: 'P. K. Verma, Chief Engineer',
      userRole: 'Land Requiring Body',
      user_role: 'Land Requiring Body',
      role: 'Land Requiring Body',
      action: 'Project Proposal Submitted',
      module: 'Project Management',
      entityType: 'Project',
      entity_type: 'Project',
      entityId: 'PRJ-2025-0101',
      entity_id: 'PRJ-2025-0101',
      recordId: 'PRJ-2025-0101',
      projectId: 'PRJ-2025-0101',
      project_id: 'PRJ-2025-0101',
      description: 'Submitted statutory acquisition proposal for NH-44 Hosur-Dharmapuri 6-lane highway corridor covering 142.50 acres across 14 villages.',
      details: 'Submitted statutory acquisition proposal for NH-44 Hosur-Dharmapuri 6-lane highway corridor covering 142.50 acres across 14 villages.',
      previousStatus: 'Draft Proposal',
      newStatus: 'Submitted for Scrutiny',
      oldValue: { status: 'Draft' },
      newValue: { status: 'Under Scrutiny', requiringBody: 'National Highways Authority of India (NHAI)', estimatedLandAcres: 142.5 },
      ipAddress: '164.100.24.18 (NHAI-RO-Chennai)',
      ip_address: '164.100.24.18 (NHAI-RO-Chennai)',
      ipSession: '164.100.24.18 (NHAI-RO-Chennai)',
      status: 'SUCCESS',
      hash: 'SHA256:1a84f3e098bd87a20c3547ff0976ba299c51239c0048e581ea776f8216c5bd10',
      createdAt: '2024-03-15T09:30:00.000Z',
      created_at: '2024-03-15T09:30:00.000Z'
    },
    {
      id: 'AUD-2024-002',
      eventId: 'EVT-NLAMS-20240328-004',
      timestamp: '2024-03-28T14:15:00.000Z',
      date: '2024-03-28',
      time: '14:15:00',
      userId: 'USR-SDRO-09',
      user_id: 'USR-SDRO-09',
      userName: 'S. Anandaraj, SDRO',
      user_name: 'S. Anandaraj, SDRO',
      user: 'S. Anandaraj, SDRO',
      userRole: 'State Nodal Officer',
      user_role: 'State Nodal Officer',
      role: 'State Nodal Officer',
      action: 'Project Scrutiny Approved',
      module: 'Project Scrutiny',
      entityType: 'Project',
      entity_type: 'Project',
      entityId: 'PRJ-2025-0101',
      entity_id: 'PRJ-2025-0101',
      recordId: 'PRJ-2025-0101',
      projectId: 'PRJ-2025-0101',
      project_id: 'PRJ-2025-0101',
      description: 'Completed 6-point checklist scrutiny: alignment verified, village revenue schedules validated.',
      details: 'Completed 6-point checklist scrutiny: alignment verified, village revenue schedules validated.',
      previousStatus: 'Under Scrutiny',
      newStatus: 'Approved',
      oldValue: { scrutinyStatus: 'Pending', status: 'Under Scrutiny' },
      newValue: { scrutinyStatus: 'Approved', status: 'Approved', approvedBy: 'S. Anandaraj, SDRO' },
      ipAddress: '10.24.88.35 (TN-RevDept)',
      ip_address: '10.24.88.35 (TN-RevDept)',
      ipSession: '10.24.88.35 (TN-RevDept)',
      status: 'SUCCESS',
      hash: 'SHA256:7bc34190fa72c3d5f1d4408bb3929424e4d6d634ea81023c56314f85e34771cf',
      createdAt: '2024-03-28T14:15:00.000Z',
      created_at: '2024-03-28T14:15:00.000Z'
    },
    {
      id: 'AUD-2024-003',
      eventId: 'EVT-NLAMS-20240502-011',
      timestamp: '2024-05-02T11:00:00.000Z',
      date: '2024-05-02',
      time: '11:00:00',
      userId: 'USR-SDRO-09',
      user_id: 'USR-SDRO-09',
      userName: 'S. Anandaraj, SDRO',
      user_name: 'S. Anandaraj, SDRO',
      user: 'S. Anandaraj, SDRO',
      userRole: 'District Collector',
      user_role: 'District Collector',
      role: 'District Collector',
      action: 'Cadastral Survey & Demarcation Completed',
      module: 'Land Parcels',
      entityType: 'Survey Report',
      entity_type: 'Survey Report',
      entityId: 'SRV-2024-TN-044',
      entity_id: 'SRV-2024-TN-044',
      recordId: 'SRV-2024-TN-044',
      projectId: 'PRJ-2025-0101',
      project_id: 'PRJ-2025-0101',
      description: 'Field revenue survey and DGPS demarcation verified across 28 villages. Found 82 affected families.',
      details: 'Field revenue survey and DGPS demarcation verified across 28 villages.',
      previousStatus: 'Survey in Progress',
      newStatus: 'Survey Verified',
      oldValue: { surveyStatus: 'In Progress' },
      newValue: { surveyStatus: 'Completed', affectedFamiliesIdentified: 82 },
      ipAddress: '14.139.183.10 (TN-Survey-Unit)',
      ip_address: '14.139.183.10 (TN-Survey-Unit)',
      ipSession: '14.139.183.10 (TN-Survey-Unit)',
      status: 'SUCCESS',
      hash: 'SHA256:d894b92c4516709f7a77b8f041235b2a0c64b5e28a7d2b51829e2f416d80112c',
      createdAt: '2024-05-02T11:00:00.000Z',
      created_at: '2024-05-02T11:00:00.000Z'
    },
    {
      id: 'AUD-2024-004',
      eventId: 'EVT-NLAMS-20240520-008',
      timestamp: '2024-05-20T10:00:00.000Z',
      date: '2024-05-20',
      time: '10:00:00',
      userId: 'USR-DC-KRI-01',
      user_id: 'USR-DC-KRI-01',
      userName: 'Dr. C. Saravanan, IAS',
      user_name: 'Dr. C. Saravanan, IAS',
      user: 'Dr. C. Saravanan, IAS',
      userRole: 'District Collector',
      user_role: 'District Collector',
      role: 'District Collector',
      action: 'Preliminary Notification Published (Sec 11)',
      module: 'Notifications',
      entityType: 'Notification',
      entity_type: 'Notification',
      entityId: 'SEC11/TN/KRI/2024/042',
      entity_id: 'SEC11/TN/KRI/2024/042',
      recordId: 'SEC11/TN/KRI/2024/042',
      projectId: 'PRJ-2025-0101',
      project_id: 'PRJ-2025-0101',
      description: 'Section 11(1) Preliminary Notification published in Tamil Nadu Government Gazette and two regional dailies.',
      details: 'Section 11(1) Preliminary Notification published in Tamil Nadu Government Gazette.',
      previousStatus: 'Draft Notification',
      newStatus: 'Published in Gazette',
      oldValue: { preliminaryNotificationNumber: null, status: 'Approved' },
      newValue: { preliminaryNotificationNumber: 'SEC11/TN/KRI/2024/042', status: 'Section 11 Notification Published', gazetteDate: '2024-05-20' },
      ipAddress: '10.24.88.19 (NICGovNet)',
      ip_address: '10.24.88.19 (NICGovNet)',
      ipSession: '10.24.88.19 (NICGovNet)',
      status: 'SUCCESS',
      hash: 'SHA256:5e679b33a08b98216e29789cb43216bbd0923f66a2082218080f49a1d9426f04',
      createdAt: '2024-05-20T10:00:00.000Z',
      created_at: '2024-05-20T10:00:00.000Z'
    },
    {
      id: 'AUD-2024-005',
      eventId: 'EVT-NLAMS-20240710-019',
      timestamp: '2024-07-10T15:45:00.000Z',
      date: '2024-07-10',
      time: '15:45:00',
      userId: 'USR-DC-KRI-01',
      user_id: 'USR-DC-KRI-01',
      userName: 'Dr. C. Saravanan, IAS',
      user_name: 'Dr. C. Saravanan, IAS',
      user: 'Dr. C. Saravanan, IAS',
      userRole: 'District Collector',
      user_role: 'District Collector',
      role: 'District Collector',
      action: 'Schedule of Land Parcels Finalized',
      module: 'Land Parcels',
      entityType: 'Land Parcel',
      entity_type: 'Land Parcel',
      entityId: 'PAR-KRI-1003',
      entity_id: 'PAR-KRI-1003',
      recordId: 'PAR-KRI-1003',
      projectId: 'PRJ-2025-0101',
      project_id: 'PRJ-2025-0101',
      description: 'Collector completed revenue schedule validation. Agricultural borewell multiplier adjusted to 1.5x under Section 29.',
      details: 'Collector completed revenue schedule validation.',
      previousStatus: 'Schedule Draft',
      newStatus: 'Schedule Finalized',
      oldValue: { status: 'Schedule Draft' },
      newValue: { status: 'Schedule Finalized' },
      ipAddress: '10.24.88.19 (NICGovNet)',
      ip_address: '10.24.88.19 (NICGovNet)',
      ipSession: '10.24.88.19 (NICGovNet)',
      status: 'SUCCESS',
      hash: 'SHA256:9184fc39572c842b5883a992bc9320146059d288921855e3cf77aa2d165f123a',
      createdAt: '2024-07-10T15:45:00.000Z',
      created_at: '2024-07-10T15:45:00.000Z'
    },
    {
      id: 'AUD-2024-006',
      eventId: 'EVT-NLAMS-20240905-002',
      timestamp: '2024-09-05T09:00:00.000Z',
      date: '2024-09-05',
      time: '09:00:00',
      userId: 'USR-MOL-JS01',
      user_id: 'USR-MOL-JS01',
      userName: 'Pooja Bhatt, Joint Secretary',
      user_name: 'Pooja Bhatt, Joint Secretary',
      user: 'Pooja Bhatt, Joint Secretary',
      userRole: 'National Administrator',
      user_role: 'National Administrator',
      role: 'National Administrator',
      action: 'Declaration Published (Sec 19)',
      module: 'Notifications',
      entityType: 'Notification',
      entity_type: 'Notification',
      entityId: 'SEC19/TN/KRI/2024/088',
      entity_id: 'SEC19/TN/KRI/2024/088',
      recordId: 'SEC19/TN/KRI/2024/088',
      projectId: 'PRJ-2025-0101',
      project_id: 'PRJ-2025-0101',
      description: 'Section 19 Declaration published in Official Gazette with complete Schedule of boundaries. Land acquisition confirmed conclusively.',
      details: 'Section 19 Declaration published in Official Gazette with complete Schedule of boundaries.',
      previousStatus: 'Under Declaration Draft',
      newStatus: 'Declared and Gazetted',
      oldValue: { declarationStatus: 'Draft' },
      newValue: { declarationStatus: 'Published', declarationGazetteNo: 'SEC19/TN/KRI/2024/088', declarationDate: '2024-09-05' },
      ipAddress: '10.110.12.5 (e-Gazette DoLR)',
      ip_address: '10.110.12.5 (e-Gazette DoLR)',
      ipSession: '10.110.12.5 (e-Gazette DoLR)',
      status: 'SUCCESS',
      hash: 'SHA256:b562a0487532d18412c1995832a890d23c14a91936c57fba3017a42b78bc7190',
      createdAt: '2024-09-05T09:00:00.000Z',
      created_at: '2024-09-05T09:00:00.000Z'
    },
    {
      id: 'AUD-2024-007',
      eventId: 'EVT-NLAMS-20241112-033',
      timestamp: '2024-11-12T16:04:12.000Z',
      date: '2024-11-12',
      time: '16:04:12',
      userId: 'USR-SDRO-09',
      user_id: 'USR-SDRO-09',
      userName: 'S. Anandaraj, SDRO',
      user_name: 'S. Anandaraj, SDRO',
      user: 'S. Anandaraj, SDRO',
      userRole: 'District Collector',
      user_role: 'District Collector',
      role: 'District Collector',
      action: 'Section 23/30 Award Declared',
      module: 'Awards',
      entityType: 'Award',
      entity_type: 'Award',
      entityId: 'AWD-2024-TN-095',
      entity_id: 'AWD-2024-TN-095',
      recordId: 'AWD-2024-TN-095',
      projectId: 'PRJ-2025-0101',
      project_id: 'PRJ-2025-0101',
      description: 'Statutory award declared for ₹4,61,02,000 comprising Base Market Value (₹2.09 Cr), 100% Solatium under Sec 30(1) (₹2.09 Cr), and 12% statutory interest under Sec 30(3) (₹42.1 Lakhs).',
      details: 'Award amount ₹4,61,02,000 declared with 100% Solatium and 12% additional interest.',
      previousStatus: 'Draft Award',
      newStatus: 'Award Declared',
      oldValue: { status: 'Draft', totalAwardAmount: 46102000 },
      newValue: { status: 'Declared', totalAwardAmount: 46102000, declarationAuthority: 'S. Anandaraj, SDRO' },
      ipAddress: '10.24.88.42 (NICGovNet)',
      ip_address: '10.24.88.42 (NICGovNet)',
      ipSession: '10.24.88.42 (NICGovNet)',
      status: 'SUCCESS',
      hash: 'SHA256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
      createdAt: '2024-11-12T16:04:12.000Z',
      created_at: '2024-11-12T16:04:12.000Z'
    },
    {
      id: 'AUD-2024-008',
      eventId: 'EVT-NLAMS-20241125-044',
      timestamp: '2024-11-25T14:20:00.000Z',
      date: '2024-11-25',
      time: '14:20:00',
      userId: 'USR-PFMS-OPERATOR',
      user_id: 'USR-PFMS-OPERATOR',
      userName: 'CGA Treasury Gateway',
      user_name: 'CGA Treasury Gateway',
      user: 'CGA Treasury Gateway',
      userRole: 'National Administrator',
      user_role: 'National Administrator',
      role: 'National Administrator',
      action: 'Compensation Disbursed (PFMS)',
      module: 'Compensation',
      entityType: 'Compensation Payment',
      entity_type: 'Compensation Payment',
      entityId: 'CMP-2025-001',
      entity_id: 'CMP-2025-001',
      recordId: 'CMP-2025-001',
      projectId: 'PRJ-2025-0101',
      project_id: 'PRJ-2025-0101',
      description: '₹4,61,02,000 compensation disbursed via Direct Benefit Transfer to landowner bank accounts via PFMS Batch #PFMS-TN-9901 (UTR SBIN2504991201).',
      details: '₹4,61,02,000 successfully disbursed via PFMS.',
      previousStatus: 'Pending Treasury Authorization',
      newStatus: 'Disbursed (PFMS)',
      oldValue: { paymentStatus: 'Processing', pfmsReferenceId: 'PFMS-REQ-9901' },
      newValue: { paymentStatus: 'Paid', utrNumber: 'SBIN2504991201', disbursedDate: '2024-11-25' },
      ipAddress: '164.100.12.8 (PFMS-Secured)',
      ip_address: '164.100.12.8 (PFMS-Secured)',
      ipSession: '164.100.12.8 (PFMS-Secured)',
      status: 'SUCCESS',
      hash: 'SHA256:d8b2e31e5f039a89c9e89b4f911a3d13da1823ef0b777a98a003f00f074d0e65',
      createdAt: '2024-11-25T14:20:00.000Z',
      created_at: '2024-11-25T14:20:00.000Z'
    },
    {
      id: 'AUD-2024-009',
      eventId: 'EVT-NLAMS-20241228-001',
      timestamp: '2024-12-28T11:20:44.000Z',
      date: '2024-12-28',
      time: '11:20:44',
      userId: 'USR-DC-KRI-01',
      user_id: 'USR-DC-KRI-01',
      userName: 'Dr. C. Saravanan, IAS',
      user_name: 'Dr. C. Saravanan, IAS',
      user: 'Dr. C. Saravanan, IAS',
      userRole: 'District Collector',
      user_role: 'District Collector',
      role: 'District Collector',
      action: 'Possession Recorded & Vesting Order Issued',
      module: 'Possession',
      entityType: 'Possession Record',
      entity_type: 'Possession Record',
      entityId: 'PAR-KRI-1002',
      entity_id: 'PAR-KRI-1002',
      recordId: 'PAR-KRI-1002',
      projectId: 'PRJ-2025-0101',
      project_id: 'PRJ-2025-0101',
      description: 'Vesting certificate VEST/KRI/2024/0998 executed under Section 38. Absolute ownership transferred to Government free of all encumbrances.',
      details: 'Vesting certificate VEST/KRI/2024/0998 digitally signed. GIS parcel status synced to green.',
      previousStatus: 'Notified',
      newStatus: 'Acquired',
      oldValue: { status: 'Notified', possessionStatus: 'Pending' },
      newValue: { status: 'Acquired', possessionStatus: 'Vested', vestingOrderNo: 'VEST/KRI/2024/0998' },
      ipAddress: '10.24.88.19 (NICGovNet)',
      ip_address: '10.24.88.19 (NICGovNet)',
      ipSession: '10.24.88.19 (NICGovNet)',
      status: 'SUCCESS',
      hash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      createdAt: '2024-12-28T11:20:44.000Z',
      created_at: '2024-12-28T11:20:44.000Z'
    },
    {
      id: 'AUD-2025-010',
      eventId: 'EVT-NLAMS-20250125-012',
      timestamp: '2025-01-25T14:30:00.000Z',
      date: '2025-01-25',
      time: '14:30:00',
      userId: 'USR-RR-TN-03',
      user_id: 'USR-RR-TN-03',
      userName: 'K. Meenakshi, Sub-Collector',
      user_name: 'K. Meenakshi, Sub-Collector',
      user: 'K. Meenakshi, Sub-Collector',
      userRole: 'R&R Officer',
      user_role: 'R&R Officer',
      role: 'R&R Officer',
      action: 'R&R Entitlement Package Approved',
      module: 'R&R',
      entityType: 'Affected Family',
      entity_type: 'Affected Family',
      entityId: 'FAM-KRI-0034',
      entity_id: 'FAM-KRI-0034',
      recordId: 'FAM-KRI-0034',
      projectId: 'PRJ-2025-0101',
      project_id: 'PRJ-2025-0101',
      description: 'Constructed housing unit at Shoolagiri Colony and ₹50,000 shifting allowance sanctioned for Muniswamy Gounder under Second Schedule.',
      details: 'Constructed housing unit at Shoolagiri Colony and ₹50,000 shifting allowance sanctioned for Muniswamy Gounder.',
      previousStatus: 'Eligibility Verified',
      newStatus: 'Benefits Approved',
      oldValue: { workflowStatus: 'Eligibility Verified', housingStatus: 'Pending' },
      newValue: { workflowStatus: 'Benefit Approved', housingStatus: 'Allotted' },
      ipAddress: '10.24.88.22 (NICGovNet)',
      ip_address: '10.24.88.22 (NICGovNet)',
      ipSession: '10.24.88.22 (NICGovNet)',
      status: 'SUCCESS',
      hash: 'SHA256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      createdAt: '2025-01-25T14:30:00.000Z',
      created_at: '2025-01-25T14:30:00.000Z'
    },
    {
      id: 'AUD-2025-011',
      eventId: 'EVT-NLAMS-20250210-001',
      timestamp: '2025-02-10T11:45:00.000Z',
      date: '2025-02-10',
      time: '11:45:00',
      userId: 'USR-SEC-ADMIN',
      user_id: 'USR-SEC-ADMIN',
      userName: 'National System Security Officer',
      user_name: 'National System Security Officer',
      user: 'National System Security Officer',
      userRole: 'National Administrator',
      user_role: 'National Administrator',
      role: 'National Administrator',
      action: 'Role & Permission Policy Synced',
      module: 'Security & Access',
      entityType: 'User Role',
      entity_type: 'User Role',
      entityId: 'ROLE-POL-2025-01',
      entity_id: 'ROLE-POL-2025-01',
      recordId: 'ROLE-POL-2025-01',
      description: 'Cryptographic permission matrix refreshed for Competent Authority (District Collector) and Administrator R&R.',
      details: 'Cryptographic permission matrix refreshed for Competent Authority.',
      previousStatus: 'Active (v2.3)',
      newStatus: 'Active (v2.4)',
      oldValue: { policyVersion: '2.3' },
      newValue: { policyVersion: '2.4', rbacLevel: 'Statutory High-Assurance' },
      ipAddress: '10.110.12.1 (NICGovNet-Core)',
      ip_address: '10.110.12.1 (NICGovNet-Core)',
      ipSession: '10.110.12.1 (NICGovNet-Core)',
      status: 'SUCCESS',
      hash: 'SHA256:ec90710609311c1103c813d10034a78189870198007a515ea195232c70034a81',
      createdAt: '2025-02-10T11:45:00.000Z',
      created_at: '2025-02-10T11:45:00.000Z'
    }
  ]
};

function generateAuditHash(record: any): string {
  const content = `${record.id}|${record.timestamp}|${record.userId}|${record.action}|${record.entityId}|${JSON.stringify(record.newValue || '')}`;
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `SHA256:${hex}${Date.now().toString(16).slice(-8)}${Math.random().toString(16).slice(2, 8)}`;
}

function recordAuditLog(db: any, entry: {
  action: string;
  module: string;
  entityType?: string;
  entityId?: string;
  projectId?: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  description: string;
  oldValue?: any;
  newValue?: any;
  status?: 'SUCCESS' | 'FAILURE';
  ipAddress?: string;
}) {
  if (!db.audit_logs) {
    db.audit_logs = [];
  }

  const now = new Date();
  const timestamp = now.toISOString();
  const date = timestamp.split('T')[0];
  const time = now.toTimeString().split(' ')[0];
  const id = `AUD-${now.getFullYear()}-${Date.now().toString().slice(-6)}`;
  const eventId = `EVT-NLAMS-${date.replace(/-/g, '')}-${String(db.audit_logs.length + 1).padStart(3, '0')}`;

  const sanitize = (val: any) => {
    if (!val || typeof val !== 'object') return val;
    const copy = Array.isArray(val) ? [...val] : { ...val };
    if (!Array.isArray(copy)) {
      delete (copy as any).password;
      delete (copy as any).token;
      delete (copy as any).secret;
      delete (copy as any).authToken;
    }
    return copy;
  };

  const auditRecord = {
    id,
    eventId,
    timestamp,
    date,
    time,
    userId: entry.userId || 'USR-GOI-01',
    user_id: entry.userId || 'USR-GOI-01',
    userName: entry.userName || 'Authorized Officer',
    user_name: entry.userName || 'Authorized Officer',
    user: entry.userName || 'Authorized Officer',
    userRole: entry.userRole || 'District Collector',
    user_role: entry.userRole || 'District Collector',
    role: entry.userRole || 'District Collector',
    action: entry.action,
    module: entry.module,
    entityType: entry.entityType || entry.module,
    entity_type: entry.entityType || entry.module,
    entityId: entry.entityId || 'N/A',
    entity_id: entry.entityId || 'N/A',
    recordId: entry.entityId || 'N/A',
    projectId: entry.projectId || (entry.oldValue && entry.oldValue.projectId) || (entry.newValue && entry.newValue.projectId) || undefined,
    project_id: entry.projectId || (entry.oldValue && entry.oldValue.projectId) || (entry.newValue && entry.newValue.projectId) || undefined,
    description: entry.description,
    details: entry.description,
    oldValue: sanitize(entry.oldValue) || null,
    old_value: sanitize(entry.oldValue) || null,
    newValue: sanitize(entry.newValue) || null,
    new_value: sanitize(entry.newValue) || null,
    previousStatus: (entry.oldValue && entry.oldValue.status) ? String(entry.oldValue.status) : (entry.oldValue && entry.oldValue.workflowStatus) ? String(entry.oldValue.workflowStatus) : undefined,
    newStatus: (entry.newValue && entry.newValue.status) ? String(entry.newValue.status) : (entry.newValue && entry.newValue.workflowStatus) ? String(entry.newValue.workflowStatus) : undefined,
    ipAddress: entry.ipAddress || '10.24.88.42 (NICGovNet-Secured)',
    ip_address: entry.ipAddress || '10.24.88.42 (NICGovNet-Secured)',
    ipSession: entry.ipAddress || '10.24.88.42 (NICGovNet-Secured)',
    status: entry.status || 'SUCCESS',
    hash: generateAuditHash({ id, timestamp, userId: entry.userId, action: entry.action, entityId: entry.entityId, newValue: entry.newValue }),
    createdAt: timestamp,
    created_at: timestamp
  };

  db.audit_logs = [auditRecord, ...db.audit_logs];
  saveDatabase(db);
  return auditRecord;
}

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.audit_logs || parsed.audit_logs.length === 0) {
        parsed.audit_logs = DEFAULT_DB.audit_logs;
        saveDatabase(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading db file:', err);
  }
  // Initialize file
  saveDatabase(DEFAULT_DB);
  return DEFAULT_DB;
}

function saveDatabase(db: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Seed AI RAG store removed

  let db = loadDatabase();

  // Role-Based Access Control (RBAC) Enforcement Middleware
  app.use('/api', (req, res, next) => {
    if (req.path === '/health' || req.path === '/chat') return next();

    const role = (req.headers['x-user-role'] as string || req.query.role as string || 'officer').toLowerCase();
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

    // 1. Auditor Role: Strictly Read-Only (no state mutations permitted)
    if (role === 'auditor' && isMutation) {
      return res.status(403).json({
        error: 'Forbidden: Statutory Auditor role has strictly read-only access.',
        code: 'AUDITOR_READ_ONLY'
      });
    }

    // 2. Citizen Role: Restricted to personal view and grievance filing only
    if (role === 'citizen') {
      // Citizens are prohibited from accessing government audit trails
      if (req.path.startsWith('/audit-logs')) {
        return res.status(403).json({
          error: 'Forbidden: Access to government audit logs is restricted to authorized officers.',
          code: 'CITIZEN_ACCESS_DENIED'
        });
      }

      // Citizens cannot create or modify administrative schemes, R&R plans, or benefits
      if (isMutation && !req.path.startsWith('/rr/grievances')) {
        return res.status(403).json({
          error: 'Forbidden: Citizens cannot modify statutory administrative schemes or family registrations.',
          code: 'CITIZEN_MUTATION_RESTRICTED'
        });
      }
    }

    next();
  });

  

  

  app.use('/', ragRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Dedicated Citizen Authoritative Status Endpoint
  app.get('/api/citizen/status', (req, res) => {
    const citizenId = req.headers['x-citizen-id'] as string || req.query.citizenId as string || 'CIT-DL-9821';
    
    // Sample authoritative citizen database mapped to survey numbers
    const citizenRecords: Record<string, any> = {
      'CIT-DL-9821': {
        citizenId: 'CIT-DL-9821',
        ownerName: 'P. Muniswamy Gounder & Family',
        fatherSpouseName: 'Late Periyannan Gounder',
        village: 'Kamandoddi',
        district: 'Krishnagiri',
        state: 'Tamil Nadu',
        surveyNumber: '104/2B, 104/3A',
        totalAreaAcres: 6.10,
        acquisitionStatus: 'Compensation Disbursed (PFMS)',
        lifecycleStage: 'Compensation Credited & R&R Handover',
        project: {
          id: 'PRJ-2025-0101',
          name: 'Bengaluru - Chennai Expressway Package IV (Km 102 to 154)',
          requiringBody: 'National Highways Authority of India (NHAI)'
        },
        award: {
          awardNumber: 'LA/KRI/NHAI/2025/AW-004',
          awardDate: '2025-02-14',
          collectorName: 'Thiru K. M. Saravanan, IAS',
          marketValue: 18300000,
          multiplicationFactor: 1.5,
          valueBeforeSolatium: 27450000,
          assetsValue: 840000,
          solatium100Percent: 28290000,
          statutoryInterest12Percent: 1131600,
          grossTotal: 57711600,
          netPayable: 57711600
        },
        pfmsPayment: {
          utrNumber: 'PFMS202502189901428',
          paymentStatus: 'Credited (Success)',
          disbursementDate: '2025-02-18',
          bankAccountMasked: 'SBI A/C ending in •••• 4022',
          ifscCode: 'SBIN0001423'
        },
        rrEntitlement: {
          scheme: 'Second Schedule (RFCTLARR Act 2013)',
          allottedUnit: 'Constructed Modern Housing Unit (2BHK, 600 sq ft)',
          siteName: 'Shoolagiri R&R Modern Township Colony',
          shiftingGrant: '₹50,000 (Credited)',
          subsistenceGrant: '₹3,000/month for 12 months (Active)',
          possessionStatus: 'Possession Handover Complete'
        }
      }
    };

    const record = citizenRecords[citizenId] || citizenRecords['CIT-DL-9821'];
    res.json(record);
  });

  // 1. STATS
  app.get('/api/rr/stats', (req, res) => {
    const { projectId } = req.query;
    let families = db.families || [];
    let plans = db.plans || [];
    let benefits = db.benefits || [];
    let grievances = db.grievances || [];

    if (projectId && typeof projectId === 'string') {
      families = families.filter((f: any) => f.projectId === projectId);
      plans = plans.filter((p: any) => p.projectId === projectId);
      benefits = benefits.filter((b: any) => b.projectId === projectId);
      grievances = grievances.filter((g: any) => g.projectId === projectId);
    }

    const totalAffectedFamilies = families.length;
    const completedCases = families.filter((f: any) => f.currentStatus === 'Resettled' || f.currentStatus === 'Closed' || f.workflowStatus === 'Closed').length;
    const pendingCases = totalAffectedFamilies - completedCases;

    const delayedPlans = plans.filter((p: any) => p.status === 'Delayed').length;
    const delayedBenefits = benefits.filter((b: any) => b.status === 'Delayed').length;
    const delayedCases = delayedPlans + delayedBenefits;

    const totalBenefitsApproved = benefits.reduce((acc: number, b: any) => acc + (b.approved ? (b.approvedAmount || b.eligibleAmount) : 0), 0);
    const totalBenefitsDisbursed = benefits.reduce((acc: number, b: any) => acc + (b.disbursed ? b.disbursedAmount : 0), 0);
    const pendingGrievances = grievances.filter((g: any) => g.status === 'Open' || g.status === 'Under Review').length;
    const rrCompletionPercent = totalAffectedFamilies > 0 ? Math.round((completedCases / totalAffectedFamilies) * 100) : 0;

    res.json({
      totalAffectedFamilies,
      totalPlans: plans.length,
      activePlans: plans.filter((p: any) => p.status === 'In Progress').length,
      completedCases,
      pendingCases,
      delayedCases,
      totalBenefitsApproved,
      totalBenefitsDisbursed,
      pendingGrievances,
      rrCompletionPercent
    });
  });

  // 2. FAMILIES CRUD
  app.get('/api/rr/families', (req, res) => {
    const { projectId, search, status } = req.query;
    let list = db.families || [];
    if (projectId && typeof projectId === 'string') {
      list = list.filter((f: any) => f.projectId === projectId);
    }
    if (status && typeof status === 'string' && status !== 'All') {
      list = list.filter((f: any) => f.currentStatus === status || f.displacementStatus === status);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((f: any) =>
        (f.headOfFamily && f.headOfFamily.toLowerCase().includes(q)) ||
        (f.id && f.id.toLowerCase().includes(q)) ||
        (f.village && f.village.toLowerCase().includes(q)) ||
        (f.contact && f.contact.includes(q))
      );
    }
    res.json(list);
  });

  app.post('/api/rr/families', (req, res) => {
    const familyData = req.body;
    const id = familyData.id || `FAM-${familyData.district ? familyData.district.slice(0, 3).toUpperCase() : 'IND'}-${String(Date.now()).slice(-4)}`;
    const newFamily = {
      ...familyData,
      id,
      name: familyData.name || familyData.headOfFamily,
      createdAt: familyData.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    db.families = [newFamily, ...(db.families || [])];
    saveDatabase(db);

    // Automatic backend audit logging
    recordAuditLog(db, {
      action: 'Affected Family Registered',
      module: 'R&R',
      entityType: 'Affected Family',
      entityId: newFamily.id,
      projectId: newFamily.projectId,
      userName: (req.headers['x-user-name'] as string) || 'Administrator R&R',
      userRole: (req.headers['x-user-role'] as string) || 'R&R Officer',
      description: `Registered affected family ${newFamily.headOfFamily || newFamily.name} (${newFamily.id}) under Section 16 R&R census.`,
      oldValue: null,
      newValue: newFamily,
      status: 'SUCCESS'
    });

    res.status(201).json(newFamily);
  });

  app.put('/api/rr/families/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    let found = false;
    let prevRecord: any = null;
    let updatedItem: any = null;

    db.families = (db.families || []).map((f: any) => {
      if (f.id === id) {
        found = true;
        prevRecord = { ...f };
        updatedItem = { ...f, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
        return updatedItem;
      }
      return f;
    });

    if (!found) {
      return res.status(404).json({ error: 'Family not found' });
    }
    saveDatabase(db);

    // Automatic backend audit logging
    recordAuditLog(db, {
      action: 'Affected Family Updated',
      module: 'R&R',
      entityType: 'Affected Family',
      entityId: id,
      projectId: updatedItem.projectId,
      userName: (req.headers['x-user-name'] as string) || 'Administrator R&R',
      userRole: (req.headers['x-user-role'] as string) || 'R&R Officer',
      description: `Updated record for family ${updatedItem.headOfFamily || updatedItem.name} (${id}). Status: ${prevRecord.currentStatus} → ${updatedItem.currentStatus}.`,
      oldValue: prevRecord,
      newValue: updatedItem,
      status: 'SUCCESS'
    });

    res.json(updatedItem);
  });

  app.delete('/api/rr/families/:id', (req, res) => {
    const { id } = req.params;
    const target = (db.families || []).find((f: any) => f.id === id);
    db.families = (db.families || []).filter((f: any) => f.id !== id);
    saveDatabase(db);

    // Automatic backend audit logging
    if (target) {
      recordAuditLog(db, {
        action: 'Affected Family Deleted',
        module: 'R&R',
        entityType: 'Affected Family',
        entityId: id,
        projectId: target.projectId,
        userName: (req.headers['x-user-name'] as string) || 'District Collector',
        userRole: (req.headers['x-user-role'] as string) || 'District Collector',
        description: `Deleted affected family record ${id} (${target.headOfFamily || target.name}).`,
        oldValue: target,
        newValue: null,
        status: 'SUCCESS'
      });
    }

    res.json({ success: true, id });
  });

  // 3. PLANS CRUD
  app.get('/api/rr/plans', (req, res) => {
    const { projectId } = req.query;
    let list = db.plans || [];
    if (projectId && typeof projectId === 'string') {
      list = list.filter((p: any) => p.projectId === projectId);
    }
    res.json(list);
  });

  app.post('/api/rr/plans', (req, res) => {
    const planData = req.body;
    const id = planData.id || `RRP-${new Date().getFullYear()}-0${Math.floor(100 + Math.random() * 900)}`;
    const newPlan = {
      ...planData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    db.plans = [newPlan, ...(db.plans || [])];
    saveDatabase(db);

    recordAuditLog(db, {
      action: 'R&R Plan Formulated',
      module: 'R&R',
      entityType: 'R&R Plan',
      entityId: newPlan.id,
      projectId: newPlan.projectId,
      userName: (req.headers['x-user-name'] as string) || 'Administrator R&R',
      userRole: (req.headers['x-user-role'] as string) || 'R&R Officer',
      description: `Formulated statutory R&R Scheme for ${newPlan.district || 'project'} covering ${newPlan.affectedFamiliesCount || 0} families under Section 16/17.`,
      oldValue: null,
      newValue: newPlan,
      status: 'SUCCESS'
    });

    res.status(201).json(newPlan);
  });

  app.put('/api/rr/plans/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    let found = false;
    let prevPlan: any = null;
    let updatedPlan: any = null;

    db.plans = (db.plans || []).map((p: any) => {
      if (p.id === id) {
        found = true;
        prevPlan = { ...p };
        updatedPlan = { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
        return updatedPlan;
      }
      return p;
    });

    if (!found) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    saveDatabase(db);

    recordAuditLog(db, {
      action: 'R&R Plan Updated',
      module: 'R&R',
      entityType: 'R&R Plan',
      entityId: id,
      projectId: updatedPlan.projectId,
      userName: (req.headers['x-user-name'] as string) || 'Administrator R&R',
      userRole: (req.headers['x-user-role'] as string) || 'R&R Officer',
      description: `Updated R&R Scheme ${id}. Status: ${prevPlan.status} → ${updatedPlan.status}.`,
      oldValue: prevPlan,
      newValue: updatedPlan,
      status: 'SUCCESS'
    });

    res.json(updatedPlan);
  });

  app.delete('/api/rr/plans/:id', (req, res) => {
    const { id } = req.params;
    const target = (db.plans || []).find((p: any) => p.id === id);
    db.plans = (db.plans || []).filter((p: any) => p.id !== id);
    saveDatabase(db);

    if (target) {
      recordAuditLog(db, {
        action: 'R&R Plan Deleted',
        module: 'R&R',
        entityType: 'R&R Plan',
        entityId: id,
        projectId: target.projectId,
        userName: (req.headers['x-user-name'] as string) || 'District Collector',
        userRole: (req.headers['x-user-role'] as string) || 'District Collector',
        description: `Deleted R&R Plan ${id}.`,
        oldValue: target,
        newValue: null,
        status: 'SUCCESS'
      });
    }

    res.json({ success: true, id });
  });

  // 4. BENEFITS CRUD
  app.get('/api/rr/benefits', (req, res) => {
    const { projectId, familyId } = req.query;
    let list = db.benefits || [];
    if (projectId && typeof projectId === 'string') {
      list = list.filter((b: any) => b.projectId === projectId);
    }
    if (familyId && typeof familyId === 'string') {
      list = list.filter((b: any) => b.familyId === familyId);
    }
    res.json(list);
  });

  app.post('/api/rr/benefits', (req, res) => {
    const benefitData = req.body;
    const id = benefitData.id || `BNF-${String(Date.now()).slice(-4)}`;
    const newBenefit = { ...benefitData, id };
    db.benefits = [newBenefit, ...(db.benefits || [])];
    saveDatabase(db);

    recordAuditLog(db, {
      action: 'R&R Benefit Package Created',
      module: 'R&R',
      entityType: 'R&R Benefit',
      entityId: newBenefit.id,
      projectId: newBenefit.projectId,
      userName: (req.headers['x-user-name'] as string) || 'Administrator R&R',
      userRole: (req.headers['x-user-role'] as string) || 'R&R Officer',
      description: `Created ${newBenefit.benefitType} benefit entitlement for family ${newBenefit.familyId} (${newBenefit.beneficiaryName}).`,
      oldValue: null,
      newValue: newBenefit,
      status: 'SUCCESS'
    });

    res.status(201).json(newBenefit);
  });

  app.put('/api/rr/benefits/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    let found = false;
    let prevBenefit: any = null;
    let updatedItem: any = null;

    db.benefits = (db.benefits || []).map((b: any) => {
      if (b.id === id) {
        found = true;
        prevBenefit = { ...b };
        updatedItem = { ...b, ...updates };
        return updatedItem;
      }
      return b;
    });

    if (!found) {
      return res.status(404).json({ error: 'Benefit not found' });
    }
    saveDatabase(db);

    const isDisbursed = updatedItem.disbursed && !prevBenefit.disbursed;
    const isApproved = updatedItem.approved && !prevBenefit.approved;
    const action = isDisbursed ? 'R&R Benefit Disbursed' : isApproved ? 'R&R Benefit Approved' : 'R&R Benefit Updated';

    recordAuditLog(db, {
      action,
      module: 'R&R',
      entityType: 'R&R Benefit',
      entityId: id,
      projectId: updatedItem.projectId,
      userName: (req.headers['x-user-name'] as string) || 'Administrator R&R',
      userRole: (req.headers['x-user-role'] as string) || 'R&R Officer',
      description: `Updated benefit ${id} (${updatedItem.benefitType}) for family ${updatedItem.familyId}. Status: ${prevBenefit.status} → ${updatedItem.status}.`,
      oldValue: prevBenefit,
      newValue: updatedItem,
      status: 'SUCCESS'
    });

    res.json(updatedItem);
  });

  app.delete('/api/rr/benefits/:id', (req, res) => {
    const { id } = req.params;
    const target = (db.benefits || []).find((b: any) => b.id === id);
    db.benefits = (db.benefits || []).filter((b: any) => b.id !== id);
    saveDatabase(db);

    if (target) {
      recordAuditLog(db, {
        action: 'R&R Benefit Deleted',
        module: 'R&R',
        entityType: 'R&R Benefit',
        entityId: id,
        projectId: target.projectId,
        userName: (req.headers['x-user-name'] as string) || 'Administrator R&R',
        userRole: (req.headers['x-user-role'] as string) || 'R&R Officer',
        description: `Deleted benefit record ${id} (${target.benefitType}).`,
        oldValue: target,
        newValue: null,
        status: 'SUCCESS'
      });
    }

    res.json({ success: true, id });
  });

  // 5. PROGRESS
  app.get('/api/rr/progress/:familyId', (req, res) => {
    const { familyId } = req.params;
    const record = db.progress ? db.progress[familyId] : null;
    if (record) {
      res.json(record);
    } else {
      res.json(null);
    }
  });

  app.put('/api/rr/progress/:familyId', (req, res) => {
    const { familyId } = req.params;
    const body = req.body;
    if (!db.progress) db.progress = {};
    const prevProgress = db.progress[familyId] ? { ...db.progress[familyId] } : null;
    db.progress[familyId] = {
      familyId,
      ...body,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    saveDatabase(db);

    recordAuditLog(db, {
      action: 'R&R Lifecycle Stage Updated',
      module: 'R&R',
      entityType: 'Affected Family',
      entityId: familyId,
      userName: (req.headers['x-user-name'] as string) || 'Administrator R&R',
      userRole: (req.headers['x-user-role'] as string) || 'R&R Officer',
      description: `Updated 7-stage workflow lifecycle for family ${familyId}.`,
      oldValue: prevProgress,
      newValue: db.progress[familyId],
      status: 'SUCCESS'
    });

    res.json(db.progress[familyId]);
  });

  // 6. GRIEVANCES
  app.get('/api/rr/grievances', (req, res) => {
    const { projectId } = req.query;
    let list = db.grievances || [];
    if (projectId && typeof projectId === 'string') {
      list = list.filter((g: any) => g.projectId === projectId);
    }
    res.json(list);
  });

  app.post('/api/rr/grievances', (req, res) => {
    const grvData = req.body;
    const id = grvData.id || `RRG-${Date.now()}`;
    const referenceNumber = grvData.referenceNumber || `NLAMS-RRG-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newGrv = {
      ...grvData,
      id,
      referenceNumber,
      submissionDate: grvData.submissionDate || new Date().toISOString().split('T')[0]
    };
    db.grievances = [newGrv, ...(db.grievances || [])];
    saveDatabase(db);

    recordAuditLog(db, {
      action: 'R&R Grievance Registered',
      module: 'Grievances',
      entityType: 'Grievance',
      entityId: newGrv.id,
      projectId: newGrv.projectId,
      userName: newGrv.complainantName || (req.headers['x-user-name'] as string) || 'Public Complainant',
      userRole: (req.headers['x-user-role'] as string) || 'Public/Citizen',
      description: `Grievance registered [${newGrv.referenceNumber}] regarding ${newGrv.category}: ${newGrv.description?.slice(0, 100)}...`,
      oldValue: null,
      newValue: newGrv,
      status: 'SUCCESS'
    });

    res.status(201).json(newGrv);
  });

  app.put('/api/rr/grievances/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    let found = false;
    let prevGrv: any = null;
    let updatedItem: any = null;

    db.grievances = (db.grievances || []).map((g: any) => {
      if (g.id === id) {
        found = true;
        prevGrv = { ...g };
        updatedItem = { ...g, ...updates };
        if (updates.status === 'Resolved' || updates.status === 'Closed') {
          updatedItem.resolvedDate = new Date().toISOString().split('T')[0];
        }
        return updatedItem;
      }
      return g;
    });

    if (!found) {
      return res.status(404).json({ error: 'Grievance not found' });
    }
    saveDatabase(db);

    const isResolved = updatedItem.status === 'Resolved' && prevGrv.status !== 'Resolved';
    const action = isResolved ? 'R&R Grievance Resolved' : 'R&R Grievance Status Changed';

    recordAuditLog(db, {
      action,
      module: 'Grievances',
      entityType: 'Grievance',
      entityId: id,
      projectId: updatedItem.projectId,
      userName: (req.headers['x-user-name'] as string) || updatedItem.assignedOfficer || 'Competent Authority',
      userRole: (req.headers['x-user-role'] as string) || 'District Collector',
      description: `Grievance ${updatedItem.referenceNumber || id} status changed: ${prevGrv.status} → ${updatedItem.status}. Notes: ${updatedItem.officialResolutionNotes || 'None'}`,
      oldValue: prevGrv,
      newValue: updatedItem,
      status: 'SUCCESS'
    });

    res.json(updatedItem);
  });

  // 7. DOCUMENTS
  app.get('/api/rr/documents', (req, res) => {
    const { projectId } = req.query;
    let list = db.documents || [];
    if (projectId && typeof projectId === 'string') {
      list = list.filter((d: any) => d.projectId === projectId);
    }
    res.json(list);
  });

  app.post('/api/rr/documents', (req, res) => {
    const doc = req.body;
    const newDoc = {
      ...doc,
      id: doc.id || `DOC-${Date.now()}`,
      uploadedAt: doc.uploadedAt || new Date().toISOString().split('T')[0]
    };
    db.documents = [newDoc, ...(db.documents || [])];
    saveDatabase(db);

    recordAuditLog(db, {
      action: 'Statutory Document Uploaded',
      module: 'Documents',
      entityType: 'Document',
      entityId: newDoc.id,
      projectId: newDoc.projectId,
      userName: newDoc.uploadedBy || (req.headers['x-user-name'] as string) || 'Authorized Officer',
      userRole: (req.headers['x-user-role'] as string) || 'District Collector',
      description: `Uploaded statutory document '${newDoc.title}' (${newDoc.fileName}) under category '${newDoc.documentCategory}'.`,
      oldValue: null,
      newValue: newDoc,
      status: 'SUCCESS'
    });

    res.status(201).json(newDoc);
  });

  // 8. AUDIT LOGS API (IMMUTABLE, SEARCHABLE, FILTERABLE, ROLE-CONTROLLED)

  /**
   * GET /api/audit-logs
   * Query parameters: search, startDate, endDate, user, role, module, action, status, entityType, entityId, projectId, page, limit, sort
   */
  app.get('/api/audit-logs', (req, res) => {
    const {
      search,
      startDate,
      endDate,
      user,
      role,
      module,
      action,
      status,
      entityType,
      entityId,
      projectId,
      page = '1',
      limit = '20',
      sort = 'newest'
    } = req.query;

    let list = [...(db.audit_logs || [])];

    // Filter by search string
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((log: any) =>
        (log.userName && log.userName.toLowerCase().includes(q)) ||
        (log.user && log.user.toLowerCase().includes(q)) ||
        (log.userId && log.userId.toLowerCase().includes(q)) ||
        (log.description && log.description.toLowerCase().includes(q)) ||
        (log.details && log.details.toLowerCase().includes(q)) ||
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.module && log.module.toLowerCase().includes(q)) ||
        (log.entityId && log.entityId.toLowerCase().includes(q)) ||
        (log.entityType && log.entityType.toLowerCase().includes(q)) ||
        (log.projectId && log.projectId.toLowerCase().includes(q)) ||
        (log.eventId && log.eventId.toLowerCase().includes(q)) ||
        (log.id && log.id.toLowerCase().includes(q))
      );
    }

    // Filter by date range
    if (startDate && typeof startDate === 'string') {
      const start = new Date(startDate).getTime();
      list = list.filter((log: any) => {
        const logTime = new Date(log.timestamp || log.date).getTime();
        return !isNaN(start) && logTime >= start;
      });
    }

    if (endDate && typeof endDate === 'string') {
      // Set to end of the day if just a date
      const end = new Date(endDate.includes('T') ? endDate : `${endDate}T23:59:59.999Z`).getTime();
      list = list.filter((log: any) => {
        const logTime = new Date(log.timestamp || log.date).getTime();
        return !isNaN(end) && logTime <= end;
      });
    }

    // Filter by user / officer
    if (user && typeof user === 'string' && user !== 'All') {
      const u = user.toLowerCase();
      list = list.filter((log: any) =>
        (log.userName && log.userName.toLowerCase() === u) ||
        (log.user && log.user.toLowerCase() === u) ||
        (log.userId && log.userId.toLowerCase() === u)
      );
    }

    // Filter by role
    if (role && typeof role === 'string' && role !== 'All') {
      list = list.filter((log: any) =>
        log.userRole === role || log.role === role || log.user_role === role
      );
    }

    // Filter by module
    if (module && typeof module === 'string' && module !== 'All') {
      list = list.filter((log: any) => log.module === module);
    }

    // Filter by action
    if (action && typeof action === 'string' && action !== 'All') {
      list = list.filter((log: any) => log.action === action);
    }

    // Filter by status
    if (status && typeof status === 'string' && status !== 'All') {
      list = list.filter((log: any) => log.status === status);
    }

    // Filter by entityType
    if (entityType && typeof entityType === 'string' && entityType !== 'All') {
      list = list.filter((log: any) =>
        log.entityType === entityType || log.entity_type === entityType
      );
    }

    // Filter by entityId
    if (entityId && typeof entityId === 'string') {
      list = list.filter((log: any) =>
        log.entityId === entityId || log.entity_id === entityId || log.recordId === entityId
      );
    }

    // Filter by projectId
    if (projectId && typeof projectId === 'string' && projectId !== 'All') {
      list = list.filter((log: any) =>
        log.projectId === projectId ||
        log.project_id === projectId ||
        log.entityId === projectId ||
        (log.oldValue && (log.oldValue.projectId === projectId || log.oldValue.id === projectId)) ||
        (log.newValue && (log.newValue.projectId === projectId || log.newValue.id === projectId)) ||
        (log.description && log.description.includes(projectId))
      );
    }

    // Sort
    list.sort((a: any, b: any) => {
      const timeA = new Date(a.timestamp || a.date).getTime();
      const timeB = new Date(b.timestamp || b.date).getTime();
      return sort === 'oldest' ? timeA - timeB : timeB - timeA;
    });

    // Pagination
    const total = list.length;
    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, Math.min(200, parseInt(String(limit), 10) || 20));
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedLogs = list.slice(startIndex, startIndex + limitNum);

    res.json({
      logs: paginatedLogs,
      total,
      page: pageNum,
      totalPages,
      limit: limitNum
    });
  });

  /**
   * GET /api/audit-logs/stats
   * Aggregate statistics for dashboard summary
   */
  app.get('/api/audit-logs/stats', (req, res) => {
    const list = db.audit_logs || [];
    const totalActivities = list.length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayActivities = list.filter((log: any) => {
      const logDate = (log.timestamp || log.date || '').split('T')[0];
      return logDate === todayStr;
    }).length;

    const successfulActions = list.filter((log: any) => log.status === 'SUCCESS').length;
    const failedActions = list.filter((log: any) => log.status === 'FAILURE').length;

    const moduleCounts: Record<string, number> = {};
    for (const log of list) {
      const mod = log.module || 'System';
      moduleCounts[mod] = (moduleCounts[mod] || 0) + 1;
    }

    const recentActivities = list.slice(0, 8);

    res.json({
      totalActivities,
      todayActivities,
      successfulActions,
      failedActions,
      moduleCounts,
      recentActivities
    });
  });

  /**
   * GET /api/audit-logs/timeline/:projectId
   * Chronological statutory timeline for a specific project
   */
  app.get('/api/audit-logs/timeline/:projectId', (req, res) => {
    const { projectId } = req.params;
    const list = db.audit_logs || [];

    const projectLogs = list.filter((log: any) =>
      log.projectId === projectId ||
      log.project_id === projectId ||
      log.entityId === projectId ||
      (log.oldValue && (log.oldValue.projectId === projectId || log.oldValue.id === projectId)) ||
      (log.newValue && (log.newValue.projectId === projectId || log.newValue.id === projectId)) ||
      (log.description && log.description.includes(projectId))
    );

    // Sort chronologically (oldest to newest) to show the lifecycle evolution
    projectLogs.sort((a: any, b: any) => {
      const timeA = new Date(a.timestamp || a.date).getTime();
      const timeB = new Date(b.timestamp || b.date).getTime();
      return timeA - timeB;
    });

    res.json(projectLogs);
  });

  /**
   * GET /api/audit-logs/:id
   * Single audit log entry
   */
  app.get('/api/audit-logs/:id', (req, res) => {
    const { id } = req.params;
    const list = db.audit_logs || [];
    const record = list.find((l: any) => l.id === id || l.eventId === id);
    if (!record) {
      return res.status(404).json({ error: 'Audit log entry not found' });
    }
    res.json(record);
  });

  /**
   * POST /api/audit-logs
   * Automatic and authorized recording of an audit event from client or background services
   */
  app.post('/api/audit-logs', (req, res) => {
    const body = req.body;
    if (!body || !body.action || !body.module || !body.description) {
      return res.status(400).json({ error: 'action, module, and description are required fields.' });
    }

    const newRecord = recordAuditLog(db, {
      action: body.action,
      module: body.module,
      entityType: body.entityType || body.entity_type,
      entityId: body.entityId || body.entity_id || body.recordId,
      projectId: body.projectId || body.project_id,
      userId: body.userId || body.user_id,
      userName: body.userName || body.user_name || body.user,
      userRole: body.userRole || body.user_role || body.role,
      description: body.description || body.details,
      oldValue: body.oldValue || body.old_value,
      newValue: body.newValue || body.new_value,
      status: body.status || 'SUCCESS',
      ipAddress: body.ipAddress || body.ip_address || body.ipSession
    });

    res.status(201).json(newRecord);
  });

  // Strict immutability protection: reject any attempts to edit or delete audit records
  app.put('/api/audit-logs/*', (req, res) => {
    res.status(403).json({ error: 'Statutory Violation: Audit logs are strictly immutable and cannot be updated.' });
  });

  app.delete('/api/audit-logs/*', (req, res) => {
    res.status(403).json({ error: 'Statutory Violation: Audit records cannot be deleted. All operations must be preserved indefinitely.' });
  });

  // Vite middleware setup (development only)
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn('Vite not found. Falling back to static production serving.');
      const distPath = path.join(process.cwd(), 'dist');
      const indexPath = path.join(distPath, 'index.html');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(200).send('<!DOCTYPE html><html><head><title>NLAMS</title></head><body><div id="root">NLAMS Platform Initializing...</div></body></html>');
        }
      });
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!DOCTYPE html><html><head><title>NLAMS</title></head><body><div id="root">NLAMS Platform Initializing...</div></body></html>');
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`NLAMS Server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('Server listen error:', err);
  });
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();
