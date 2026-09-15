import { OfficerCredential } from '../types';

export const SECTOR_AGNOSTIC_OFFICER_ROLES: OfficerCredential[] = [
  {
    role: 'Central Sponsoring Ministry',
    name: 'Dr. V. Sundaram, Joint Secretary',
    officialId: 'v.sundaram@nic.in',
    email: 'v.sundaram@nic.in',
    departmentOrAgency: 'Infrastructure & Project Appraisal Division',
    clearance: 'National Cross-Sector Project Review',
    designationLabel: 'Central Sponsoring Ministry',
    employeeBadgeId: 'GOI-NIC-JS-8821',
    jurisdictionOrEntity: 'Union Ministries (National Level)'
  },
  {
    role: 'Requiring Body / Proponent (PSU / Department)',
    name: 'S. Mukherjee, Executive Director (Land & Infra)',
    officialId: 'smukherjee@landproponent.gov.in',
    email: 'smukherjee@landproponent.gov.in',
    departmentOrAgency: 'National Infrastructure Sponsoring Agency',
    clearance: 'Project Proposal Submission & Gazette Requisition',
    designationLabel: 'Requiring Body / Proponent',
    employeeBadgeId: 'PROP-ED-4402',
    jurisdictionOrEntity: 'Public Sector Undertakings & Executing Departments'
  },
  {
    role: 'State Revenue & Nodal Authority',
    name: 'K. Anandhi, Principal Secretary (Revenue)',
    officialId: 'anandhi.k@state.gov.in',
    email: 'anandhi.k@state.gov.in',
    departmentOrAgency: 'State Land Administration',
    clearance: 'State Notifications & Cadastral Database Approvals',
    designationLabel: 'State Revenue & Nodal Authority',
    employeeBadgeId: 'REV-SEC-1092',
    jurisdictionOrEntity: 'State Revenue Secretariat'
  },
  {
    role: 'Competent Authority (District Collector / CALA)',
    name: 'R. Rajesh, IAS (District Collector & Magistrate)',
    officialId: 'collector.office@tn.gov.in',
    email: 'collector.office@tn.gov.in',
    departmentOrAgency: 'District Revenue Office',
    clearance: 'Sec 11/19 Declarations, Award Determinations & Solatium',
    designationLabel: 'Competent Authority (Collector/CALA)',
    employeeBadgeId: 'IAS-TN-2012-781',
    jurisdictionOrEntity: 'District Collectorate'
  },
  {
    role: 'Rehabilitation & Resettlement (R&R) Authority',
    name: 'P. Meenakshi, Commissioner (R&R - Sec 43)',
    officialId: 'commissioner.rr@state.gov.in',
    email: 'commissioner.rr@state.gov.in',
    departmentOrAgency: 'Social Impact & Resettlement Division',
    clearance: 'Displaced Family Census & Entitlement Disbursement',
    designationLabel: 'Administrator (R&R - Sec 43)',
    employeeBadgeId: 'RR-COMM-5120',
    jurisdictionOrEntity: 'Statutory R&R Authority'
  },
  {
    role: 'Project Implementing Agency (PIA / Concessionaire)',
    name: 'Amitav Ghosh, Chief Project Officer',
    officialId: 'amitav.ghosh@pia-infra.org',
    email: 'amitav.ghosh@pia-infra.org',
    departmentOrAgency: 'Special Purpose Vehicle (SPV) / Concessionaire',
    clearance: 'Possession Handover & Right-of-Way (RoW) Execution',
    designationLabel: 'Project Implementing Agency (PIA)',
    employeeBadgeId: 'PIA-CPO-9031',
    jurisdictionOrEntity: 'Project Implementation Unit'
  }
];

export const getOfficerCredentialByRole = (role: string): OfficerCredential => {
  const match = SECTOR_AGNOSTIC_OFFICER_ROLES.find(o => o.role === role);
  return match || SECTOR_AGNOSTIC_OFFICER_ROLES[3]; // Default to Competent Authority
};

export const MOCK_SYSTEM_ADMIN_CREDENTIALS = {
  email: 'admin@nic.landmgmt.gov.in',
  name: 'Platform SuperAdmin (Infrastructure Controller)',
  passwordDemo: 'NLAMS@Secured#2026',
  totpCode: '849201',
  serverNode: 'NIC MeghRaj Tier-IV Cloud Node (New Delhi & Hyderabad DR)',
  latency: '14ms',
  securityLevel: 'MeitY Level-4 Enterprise Security Hardened',
  clearance: 'API Gateway Registry, State Interoperability (Bhulekh/Bhoomi), RBAC Provisioning'
};

export const MOCK_AUDITOR_CREDENTIALS = {
  role: 'Auditor',
  name: 'S. Venkatachalam, Principal Director of Audit',
  email: 'pda.infrastructure@cag.gov.in',
  organization: 'Office of the Comptroller & Auditor General (CAG) of India',
  dscDevice: 'ePass2003 FIPS 140-2 Level 3 Crypto USB Token',
  tokenSerial: 'ePass-IND-9942-8812-7A',
  issuingCA: 'CCA India / NIC-CA 2014 v3',
  shaFingerprint: '9E:B2:71:A4:58:19:D0:3C:FE:42:8B:11:A6:49:72:0D:33:55:E1:9F',
  validUntil: '2027-12-31 (Active & Validated via Online OCSP)',
  handshakeProtocol: 'PKCS#11 Hardware Security Module Handshake',
  clearance: 'Enforced Read-Only Forensic Access (Zero Write Privileges)'
};

export const generateMockParichayJwt = (officer: OfficerCredential): string => {
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'nic-parichay-2026-key' }));
  const payload = btoa(
    JSON.stringify({
      iss: 'https://parichay.nic.in',
      sub: officer.employeeBadgeId,
      name: officer.name,
      email: officer.email,
      role: officer.role,
      aud: 'nlams.dolr.gov.in',
      loa: 'LOA-3',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 28800,
      scope: ['read:records', 'write:workflow', 'action:statutory']
    })
  );
  return `Bearer ${header}.${payload}.eG9pU3NvVmVyaWZpZWQyMDI2U0hBMjU2SGFzaFRva2VuU3RhdHV0b3J5QXBwcm92ZWQ=`;
};
