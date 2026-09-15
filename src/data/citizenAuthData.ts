export interface RegisteredLandownerRecord {
  phone: string; // 10-digit normalized phone number
  displayPhone: string;
  familyId: string;
  parcelId: string;
  surveyNumber: string;
  landownerName: string;
  village: string;
  district: string;
  state: string;
  projectId: string;
  projectName: string;
  landAcres: number;
}

export const MOCK_REGISTERED_LANDOWNERS: RegisteredLandownerRecord[] = [
  {
    phone: '9876543210',
    displayPhone: '+91 98765 43210',
    familyId: 'FAM-SAL-0001',
    parcelId: 'LP-001',
    surveyNumber: 'SN-101/2A',
    landownerName: 'Ravi Kumar',
    village: 'Omalur',
    district: 'Salem',
    state: 'Tamil Nadu',
    projectId: 'PRJ-2025-0101',
    projectName: 'National Highway Expansion (NH-44 6-Laning)',
    landAcres: 2.50
  },
  {
    phone: '9876541022',
    displayPhone: '+91 98765 41022',
    familyId: 'FAM-KRI-0034',
    parcelId: 'PAR-KRI-1003',
    surveyNumber: '158/2',
    landownerName: 'P. Muniswamy Gounder',
    village: 'Kamandoddi',
    district: 'Krishnagiri',
    state: 'Tamil Nadu',
    projectId: 'PRJ-2025-0101',
    projectName: 'National Highway Expansion (NH-44 6-Laning)',
    landAcres: 6.10
  },
  {
    phone: '9840211022',
    displayPhone: '+91 98402 11022',
    familyId: 'FAM-KRI-0034',
    parcelId: 'PAR-KRI-1003',
    surveyNumber: '158/2',
    landownerName: 'P. Muniswamy Gounder',
    village: 'Kamandoddi',
    district: 'Krishnagiri',
    state: 'Tamil Nadu',
    projectId: 'PRJ-2025-0101',
    projectName: 'National Highway Expansion (NH-44 6-Laning)',
    landAcres: 6.10
  },
  {
    phone: '9415044890',
    displayPhone: '+91 94150 44890',
    familyId: 'FAM-CHA-0008',
    parcelId: 'PAR-CHA-2001',
    surveyNumber: '284/1',
    landownerName: 'Rameshwar Nath Tripathi',
    village: 'Alinagar',
    district: 'Chandauli',
    state: 'Uttar Pradesh',
    projectId: 'PRJ-2025-0102',
    projectName: 'Eastern Dedicated Freight Rail Corridor — Phase III',
    landAcres: 4.50
  },
  {
    phone: '9880132901',
    displayPhone: '+91 98801 32901',
    familyId: 'FAM-BAG-0044',
    parcelId: 'PAR-BAG-3001',
    surveyNumber: '92/1A',
    landownerName: 'Basavaraj Channappa Patil',
    village: 'Terdal',
    district: 'Bagalkote',
    state: 'Karnataka',
    projectId: 'PRJ-2025-0103',
    projectName: 'Upper Krishna Irrigation Modernization Project',
    landAcres: 8.40
  },
  {
    phone: '9764056614',
    displayPhone: '+91 97640 56614',
    familyId: 'FAM-PUN-0012',
    parcelId: 'PAR-PUN-5001',
    surveyNumber: '318/2',
    landownerName: 'Gajanan Dnyaneshwar Pawar',
    village: 'Khadakwasla',
    district: 'Pune',
    state: 'Maharashtra',
    projectId: 'PRJ-2025-0105',
    projectName: 'Pune Western High-Speed Outer Ring Road',
    landAcres: 3.15
  },
  {
    phone: '9443288129',
    displayPhone: '+91 94432 88129',
    familyId: 'FAM-KRI-0035',
    parcelId: 'PAR-KRI-1004',
    surveyNumber: '162/4',
    landownerName: 'K. Rajavelu',
    village: 'Kamandoddi',
    district: 'Krishnagiri',
    state: 'Tamil Nadu',
    projectId: 'PRJ-2025-0101',
    projectName: 'National Highway Expansion (NH-44 6-Laning)',
    landAcres: 2.10
  },
  {
    phone: '9414187340',
    displayPhone: '+91 94141 87340',
    familyId: 'FAM-JOD-0019',
    parcelId: 'PAR-JOD-4002',
    surveyNumber: '128/1',
    landownerName: 'Khemraj Bhati',
    village: 'Bhadla Khurd',
    district: 'Jodhpur',
    state: 'Rajasthan',
    projectId: 'PRJ-2025-0104',
    projectName: 'Bhadla Ultra Mega Solar Energy Park Corridor',
    landAcres: 18.20
  },
  {
    phone: '9840012345',
    displayPhone: '+91 98400 12345',
    familyId: 'FAM-KRI-0001',
    parcelId: 'PAR-KRI-1001',
    surveyNumber: '142/3A',
    landownerName: 'M. S. Venkataraman & Brothers',
    village: 'Zuzuvadi',
    district: 'Krishnagiri',
    state: 'Tamil Nadu',
    projectId: 'PRJ-2025-0101',
    projectName: 'National Highway Expansion (NH-44 6-Laning)',
    landAcres: 4.85
  }
];

export const DEMO_PRESET_USERS = [
  {
    type: 'landowner' as const,
    label: 'Affected Landowner — Ravi Kumar (Salem)',
    phone: '9876543210',
    displayPhone: '+91 98765 43210',
    name: 'Ravi Kumar',
    detail: 'Survey SN-101/2A (2.50 Acres) • Omalur, Salem',
    parcelId: 'LP-001',
    familyId: 'FAM-SAL-0001'
  },
  {
    type: 'landowner' as const,
    label: 'Affected Landowner (Tamil Nadu)',
    phone: '9876541022',
    displayPhone: '+91 98765 41022',
    name: 'P. Muniswamy Gounder',
    detail: 'Survey 158/2 (6.10 Acres) • Kamandoddi, Krishnagiri',
    parcelId: 'PAR-KRI-1003',
    familyId: 'FAM-KRI-0034'
  },
  {
    type: 'landowner' as const,
    label: 'Affected Landowner (Uttar Pradesh)',
    phone: '9415044890',
    displayPhone: '+91 94150 44890',
    name: 'Rameshwar Nath Tripathi',
    detail: 'Survey 284/1 (4.50 Acres) • Alinagar, Chandauli',
    parcelId: 'PAR-CHA-2001',
    familyId: 'FAM-CHA-0008'
  },
  {
    type: 'landowner' as const,
    label: 'Affected Landowner (Karnataka)',
    phone: '9880132901',
    displayPhone: '+91 98801 32901',
    name: 'Basavaraj C. Patil',
    detail: 'Survey 92/1A (8.40 Acres) • Terdal, Bagalkote',
    parcelId: 'PAR-BAG-3001',
    familyId: 'FAM-BAG-0044'
  }
];

/**
 * Normalizes input string to 10-digit standard Indian phone format
 */
export function normalizePhoneNumber(input: string): string {
  if (!input) return '';
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, '');
  // If starts with 91 and has 12 digits, strip 91
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  // If starts with 0 and has 11 digits, strip 0
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

/**
 * Searches for a registered landowner record by normalized phone or ID
 */
export function findRegisteredLandowner(phoneOrId: string): RegisteredLandownerRecord | undefined {
  if (!phoneOrId) return undefined;
  const trimmed = phoneOrId.trim();
  const normalizedDigits = normalizePhoneNumber(trimmed);

  return MOCK_REGISTERED_LANDOWNERS.find(r => {
    // Match 10-digit normalized phone
    if (normalizedDigits && r.phone === normalizedDigits) return true;
    // Match Family ID (e.g. FAM-KRI-0034)
    if (r.familyId.toLowerCase() === trimmed.toLowerCase()) return true;
    // Match Parcel ID (e.g. PAR-KRI-1003)
    if (r.parcelId.toLowerCase() === trimmed.toLowerCase()) return true;
    // Match raw phone string
    if (r.phone === trimmed || r.displayPhone === trimmed) return true;
    return false;
  });
}
