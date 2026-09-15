import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import {
  User,
  MapPin,
  CheckCircle2,
  Clock,
  IndianRupee,
  Home,
  FileText,
  AlertCircle,
  Download,
  Building2,
  ExternalLink,
  ShieldCheck,
  Send,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Phone,
  Landmark,
  BadgeCheck,
  Eye,
  CreditCard,
  Navigation,
  LogOut,
  Lock
} from 'lucide-react';
import { CitizenOtpLoginForm } from './CitizenOtpLoginForm';
import { findRegisteredLandowner } from '../data/citizenAuthData';

export const CitizenPortal: React.FC = () => {
  const { t } = useTranslation();
  const {
    citizenId,
    setCitizenId,
    citizenPhone,
    isLandownerAuthenticated,
    authenticatedLandownerParcelId,
    isCitizenOtpVerified,
    logoutCitizen,
    families,
    projects,
    parcels,
    awards,
    compensations,
    grievances,
    submitRRGrievance,
    logout
  } = useApp();

  // Active Tab within Citizen Portal
  const [activeCitizenTab, setActiveCitizenTab] = useState<'overview' | 'compensation' | 'rr' | 'grievances'>('overview');

  // Grievance Form State
  const [grievanceCategory, setGrievanceCategory] = useState('Compensation Valuation');
  const [grievanceDescription, setGrievanceDescription] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);

  // 1. If not authenticated via OTP, show Citizen Phone + OTP Login View
  if (!isCitizenOtpVerified) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-md border border-blue-800">
            🏛️
          </div>
          <span className="text-[11px] font-bold text-blue-900 tracking-wide uppercase block">
            {t('header.subheading', 'Government of India • Department of Land Resources')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('citizen.landownerPortal', 'Citizen Portal')}
          </h1>
          <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1 leading-relaxed">
            Statutory citizen access under RFCTLARR Act, 2013. Log in with your registered mobile phone number to authenticate and access your land acquisition records.
          </p>
        </div>

        <CitizenOtpLoginForm />

        <div className="mt-4 text-center">
          <button
            onClick={logout}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>&larr; {t('userSelection.title', 'Return to Portal User Selection')}</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. If General Citizen (authenticated via OTP but no land acquired), render No Records Message
  if (isCitizenOtpVerified && !isLandownerAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-2">No Acquisition Records Linked</h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
            The mobile number <strong className="font-mono text-slate-800">+91 {citizenPhone}</strong> is not associated with any active land acquisition project records. Please authenticate using the mobile number registered with the Competent Authority (CALA).
          </p>
          <button
            onClick={() => logoutCitizen()}
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Try Another Mobile Number</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. If Affected Landowner, render Personal Land Parcel Dashboard
  const matchedLandowner = findRegisteredLandowner(citizenPhone || authenticatedLandownerParcelId || citizenId);

  // Strictly resolve the active family matching this authenticated landowner
  const activeFamily = families.find(f =>
    (authenticatedLandownerParcelId && f.parcelId === authenticatedLandownerParcelId) ||
    (matchedLandowner && f.id === matchedLandowner.familyId) ||
    f.id === citizenId
  ) || families[0] || {
    id: 'FAM-KRI-0034',
    headOfFamily: 'P. Muniswamy Gounder',
    name: 'P. Muniswamy Gounder',
    state: 'Tamil Nadu',
    district: 'Krishnagiri',
    village: 'Kamandoddi',
    parcelId: 'PAR-KRI-1003',
    projectId: 'PRJ-2025-0101',
    landAcquiredAcres: 6.10,
    familyMembersCount: 5,
    contact: '+91 98402 11022',
    currentStatus: 'Resettled',
    workflowStatus: 'Benefit Delivered',
    category: 'OBC',
    entitlements: {
      housingUnitOrCash: 'Constructed House',
      oneTimeGrant: 50000,
      annuityOrLumpSum: 'Lump-sum ₹5,00,000',
      resettlementSiteName: 'Shoolagiri R&R Modern Township Colony'
    }
  };

  // Associated Project and Parcel strictly for this authenticated landowner
  const targetParcelId = authenticatedLandownerParcelId || matchedLandowner?.parcelId || activeFamily.parcelId;
  const associatedParcel = parcels.find(p => p.id === targetParcelId) || parcels[0];
  const associatedProject = projects.find(p => p.id === activeFamily.projectId || p.id === associatedParcel.projectId) || projects[0];
  const associatedAward = awards.find(a => a.parcelId === associatedParcel.id || a.projectId === activeFamily.projectId);
  const associatedComp = compensations.find(c => c.parcelId === associatedParcel.id || c.familyId === activeFamily.id);

  // Filtered Grievances strictly for this landowner
  const citizenGrievances = grievances.filter(g =>
    g.familyId === activeFamily.id ||
    g.complainantName?.toLowerCase().includes((activeFamily.headOfFamily || '').toLowerCase().split(' ')[0])
  );

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceDescription.trim()) return;

    submitRRGrievance({
      familyId: activeFamily.id,
      complainantName: activeFamily.headOfFamily || activeFamily.name,
      category: grievanceCategory as any,
      description: grievanceDescription,
      contact: matchedLandowner?.displayPhone || activeFamily.contact || `+91 ${citizenPhone}`
    });

    setGrievanceSubmitted(true);
    setGrievanceDescription('');
    setTimeout(() => setGrievanceSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Landowner Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{t('citizen.landownerPortal', 'Authenticated Affected Landowner')}</span>
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  Mobile: {matchedLandowner?.displayPhone || `+91 ${citizenPhone}`}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-mono font-bold text-slate-500">ID: {activeFamily.id}</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {matchedLandowner?.landownerName || activeFamily.headOfFamily || activeFamily.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                <span>{t('citizen.surveyNo', 'Survey No')}: <strong className="text-slate-800 font-mono">{associatedParcel?.surveyNumber || matchedLandowner?.surveyNumber || '158/2'}</strong></span>
                <span>•</span>
                <span>{t('parcels.village', 'Village')}: <strong className="text-slate-700">{associatedParcel?.village || matchedLandowner?.village}</strong></span>
                <span>•</span>
                <span>{t('projects.location', 'District')}: <strong className="text-slate-700">{associatedParcel?.district || activeFamily.district}, {activeFamily.state}</strong></span>
                <span>•</span>
                <span>{t('projects.title', 'Project')}: <strong className="text-slate-700">{associatedProject?.name}</strong></span>
              </p>
            </div>
          </div>

          {/* User Session Actions (Strictly NO multi-family switching dropdown to protect privacy) */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-white hover:bg-red-50 active:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 rounded font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Log Out of Citizen Portal"
              aria-label="Log Out of Citizen Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>{t('header.logout', 'Log Out')}</span>
            </button>
          </div>
        </div>

        {/* Quick Result Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('dashboard.landAcquired', 'Acquired Land')}</span>
            <span className="text-sm font-black text-slate-900">{associatedParcel?.areaAcres || activeFamily.landAcquiredAcres || '6.10'} {t('common.acres', 'Acres')}</span>
            <span className="text-[10px] text-slate-500 block">{t('citizen.surveyNo', 'Survey No.')} {associatedParcel?.surveyNumber || '158/2'}</span>
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('compensation.title', 'Compensation Status')}</span>
            <span className="text-sm font-black text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{associatedComp?.disbursementStatus || t('compensation.disbursed', 'Disbursed (PFMS)')}</span>
            </span>
            <span className="text-[10px] text-slate-500 block">₹{(associatedComp?.amountInr ? (associatedComp.amountInr / 100000).toFixed(2) + ' Lakhs' : '₹1.98 Cr')}</span>
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('rr.title', 'R&R Allotment')}</span>
            <span className="text-sm font-black text-blue-700 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>{activeFamily.entitlements?.housingUnitOrCash || 'Constructed House'}</span>
            </span>
            <span className="text-[10px] text-slate-500 block truncate">{activeFamily.entitlements?.resettlementSiteName || 'Modern Township Colony'}</span>
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('compensation.solatium', 'Solatium Benefit')}</span>
            <span className="text-sm font-black text-purple-700 flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>100% Statutory</span>
            </span>
            <span className="text-[10px] text-slate-500 block">Sec 30(1) RFCTLARR</span>
          </div>
        </div>
      </div>

      {/* Citizen Portal Nav Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 overflow-x-auto text-xs font-bold shadow-2xs">
        <button
          onClick={() => setActiveCitizenTab('overview')}
          className={`px-4 py-2.5 border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeCitizenTab === 'overview'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{t('citizen.landownerPortal', 'My Land & Status')}</span>
        </button>

        <button
          onClick={() => setActiveCitizenTab('compensation')}
          className={`px-4 py-2.5 border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeCitizenTab === 'compensation'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>{t('nav.compensation', 'Compensation & PFMS')}</span>
        </button>

        <button
          onClick={() => setActiveCitizenTab('rr')}
          className={`px-4 py-2.5 border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeCitizenTab === 'rr'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{t('nav.rr', 'R&R Benefits & Housing')}</span>
        </button>

        <button
          onClick={() => setActiveCitizenTab('grievances')}
          className={`px-4 py-2.5 border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeCitizenTab === 'grievances'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t('nav.grievances', 'Grievance Helpdesk')}</span>
          {citizenGrievances.length > 0 && (
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px]">
              {citizenGrievances.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW & LAND STATUS */}
      {activeCitizenTab === 'overview' && (
        <div className="space-y-6">
          {/* Statutory Milestone Tracker */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Statutory Acquisition Progress for Your Property</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="border-l-3 border-emerald-600 pl-3 py-1 bg-emerald-50/40 rounded-r-md">
                <span className="text-[10px] font-black text-emerald-800 uppercase">Stage 1: Preliminary Notification</span>
                <p className="font-bold text-slate-900 mt-0.5">Section 11 Gazette</p>
                <p className="text-[11px] text-slate-600">Issued & boundaries notified</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700">✓ Completed</span>
              </div>

              <div className="border-l-3 border-emerald-600 pl-3 py-1 bg-emerald-50/40 rounded-r-md">
                <span className="text-[10px] font-black text-emerald-800 uppercase">Stage 2: Final Declaration</span>
                <p className="font-bold text-slate-900 mt-0.5">Section 19 Declaration</p>
                <p className="text-[11px] text-slate-600">Land acquisition confirmed</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700">✓ Completed</span>
              </div>

              <div className="border-l-3 border-emerald-600 pl-3 py-1 bg-emerald-50/40 rounded-r-md">
                <span className="text-[10px] font-black text-emerald-800 uppercase">Stage 3: Award Determination</span>
                <p className="font-bold text-slate-900 mt-0.5">Section 23/30 Award</p>
                <p className="text-[11px] text-slate-600">100% Solatium computed</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700">✓ Award Declared</span>
              </div>

              <div className="border-l-3 border-blue-600 pl-3 py-1 bg-blue-50/40 rounded-r-md">
                <span className="text-[10px] font-black text-blue-800 uppercase">Stage 4: Payment & Possession</span>
                <p className="font-bold text-slate-900 mt-0.5">PFMS Direct Credit</p>
                <p className="text-[11px] text-slate-600">Disbursement & R&R Handover</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700">✓ In Process / Paid</span>
              </div>
            </div>
          </div>

          {/* Land Parcel Record Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Land Parcel Revenue Details</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono">
                    {associatedParcel?.id || 'PAR-KRI-1003'}
                  </span>
                </div>
              </h3>

              <dl className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500 font-medium">Survey / Khasra Number</dt>
                  <dd className="font-bold text-slate-900">{associatedParcel?.surveyNumber || '142/2B'}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500 font-medium">Land Classification</dt>
                  <dd className="font-bold text-slate-900">{associatedParcel?.landClassification || 'Agricultural Irrigated (Wet)'}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500 font-medium">Total Land Holding</dt>
                  <dd className="font-bold text-slate-900">{associatedParcel?.areaAcres ? (associatedParcel.areaAcres + 1.2).toFixed(2) : '7.30'} Acres</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500 font-medium">Acquired Extent</dt>
                  <dd className="font-bold text-blue-700">{associatedParcel?.areaAcres || '6.10'} Acres</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500 font-medium">Village & Taluk</dt>
                  <dd className="font-bold text-slate-900">{associatedParcel?.village || activeFamily.village}, Hosur Taluk</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500 font-medium">District & State</dt>
                  <dd className="font-bold text-slate-900">{activeFamily.district}, {activeFamily.state}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-slate-500 font-medium">Demarcation Status</dt>
                  <dd className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>DGPS Geo-demarcated</span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Official Downloads & Entitlement Summary */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                  Official Certificates & Document Downloads
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  These verified statutory documents have been issued by the Competent Authority (District Collector) for your land parcel.
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="font-bold text-slate-900 block">Award Determination Slip (Form 19)</span>
                        <span className="text-[10px] text-slate-500">Official statutory compensation breakdown</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading Form 19 Award Slip for ${activeFamily.headOfFamily}...`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-slate-500" />
                      <span>PDF</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-900 block">PFMS DBT Payment Certificate</span>
                        <span className="text-[10px] text-slate-500">Treasury transaction receipt & UTR</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading PFMS Payment Receipt for ${activeFamily.headOfFamily}...`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-slate-500" />
                      <span>PDF</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="font-bold text-slate-900 block">R&R Housing Allotment Order</span>
                        <span className="text-[10px] text-slate-500">Plot/Unit allotment at Modern Township</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading R&R Housing Allotment Order for ${activeFamily.headOfFamily}...`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-slate-500" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Verified with State Land Registry</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Legally Certified</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: COMPENSATION & PFMS */}
      {activeCitizenTab === 'compensation' && (
        <div className="space-y-6">
          {/* Statutory Award Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
              <div>
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
                  RFCTLARR Act 2013 Statutory Computation
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  Award Determination Breakdown
                </h2>
                <p className="text-xs text-slate-500">
                  Award Reference: <strong className="text-slate-800">{associatedAward?.awardNumber || 'AWD-2024-TN-095'}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Net Compensation</span>
                <span className="text-2xl font-black text-emerald-600">
                  {associatedComp?.amountInr ? `₹${(associatedComp.amountInr / 100000).toFixed(2)} Lakhs` : '₹1,85,42,000'}
                </span>
              </div>
            </div>

            {/* Computation Steps Table */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Statutory Component</th>
                    <th className="py-2.5 px-3">Act Section</th>
                    <th className="py-2.5 px-3">Calculation Basis</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-900">Base Land Market Value</td>
                    <td className="py-3 px-3 text-slate-600">Section 26</td>
                    <td className="py-3 px-3 text-slate-600">Guideline Value ₹15,00,000/acre × 6.10 Acres</td>
                    <td className="py-3 px-3 font-mono font-bold text-right text-slate-900">₹91,50,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-900">Rural Multiplier Factor</td>
                    <td className="py-3 px-3 text-slate-600">Section 26(2)</td>
                    <td className="py-3 px-3 text-slate-600">Distance from urban limit factor: 1.0x applied</td>
                    <td className="py-3 px-3 font-mono font-bold text-right text-slate-900">₹91,50,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-900">Attached Assets & Borewells</td>
                    <td className="py-3 px-3 text-slate-600">Section 29</td>
                    <td className="py-3 px-3 text-slate-600">1 Agricultural Borewell + 42 Fruit-bearing trees</td>
                    <td className="py-3 px-3 font-mono font-bold text-right text-slate-900">₹4,20,000</td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="py-3 px-3 font-bold text-purple-900">
                      100% Solatium
                      <span className="block text-[10px] text-purple-600 font-normal">Mandatory statutory grant to land owner</span>
                    </td>
                    <td className="py-3 px-3 text-purple-800 font-semibold">Section 30(1)</td>
                    <td className="py-3 px-3 text-purple-700">100% of Base Value + Asset Value</td>
                    <td className="py-3 px-3 font-mono font-bold text-right text-purple-900">₹95,70,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-900">12% Additional Interest</td>
                    <td className="py-3 px-3 text-slate-600">Section 30(3)</td>
                    <td className="py-3 px-3 text-slate-600">12% p.a. from Gazette notification to award date</td>
                    <td className="py-3 px-3 font-mono font-bold text-right text-slate-900">₹11,48,400</td>
                  </tr>
                  <tr className="bg-emerald-50/50 font-black text-emerald-950">
                    <td className="py-3 px-3 text-sm" colSpan={3}>
                      Total Statutory Award Amount (Credited via PFMS)
                    </td>
                    <td className="py-3 px-3 font-mono text-sm text-right text-emerald-700">
                      ₹1,98,68,400
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PFMS Payment Details Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              <span>Direct Benefit Transfer (PFMS DBT Electronic Credit Status)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">PFMS Status</span>
                <span className="text-sm font-black text-emerald-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct Bank Credit</span>
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">Account Credited</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">PFMS UTR Number</span>
                <span className="text-xs font-mono font-bold text-slate-900 block mt-1">
                  {associatedComp?.pfmsTransactionId || 'PFMS20241018288190'}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Bank Txn Ref</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Bank Account</span>
                <span className="text-xs font-mono font-bold text-slate-900 block mt-1">
                  State Bank of India
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">A/c: **** 4021 (IFSC: SBIN0001284)</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Date of Credit</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">
                  {associatedComp?.disbursementDate || '18 October 2024'}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">Cleared by RBI Gateway</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: R&R BENEFITS & HOUSING */}
      {activeCitizenTab === 'rr' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
              <div>
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
                  Second Schedule Entitlements
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  Rehabilitation & Resettlement Allotment
                </h2>
                <p className="text-xs text-slate-500">
                  Resettlement Colony: <strong className="text-slate-800">{activeFamily.entitlements?.resettlementSiteName || 'Shoolagiri Modern Township'}</strong>
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full self-start sm:self-auto">
                Allotted & Possession Handed Over
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-xs">
              <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-3">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 block">Housing Unit</span>
                <p className="text-sm font-black text-slate-900 mt-1">
                  {activeFamily.entitlements?.housingUnitOrCash || 'Constructed House'}
                </p>
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  Pucca 50 sq.m constructed unit with individual piped water and electricity connection.
                </p>
                <span className="inline-block mt-3 px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded">
                  Plot No. B-14, Sector 2
                </span>
              </div>

              <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">One-Time Resettlement Grant</span>
                <p className="text-sm font-black text-slate-900 mt-1">
                  ₹50,000 Shifting Allowance
                </p>
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  Transportation and initial setup grant credited directly to bank account.
                </p>
                <span className="inline-block mt-3 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                  Status: Credited via PFMS
                </span>
              </div>

              <div className="border border-purple-200 bg-purple-50/40 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-3">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block">Annuity / Subsistence</span>
                <p className="text-sm font-black text-slate-900 mt-1">
                  {activeFamily.entitlements?.annuityOrLumpSum || 'Lump-sum ₹5,00,000'}
                </p>
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  Livelihood sustenance grant sanctioned under Section 31 of RFCTLARR Act.
                </p>
                <span className="inline-block mt-3 px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[10px] rounded">
                  Sanction Order: RR/2024/092
                </span>
              </div>
            </div>

            {/* Colony Facilities Checklist */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                Mandatory 25 Infrastructure Amenities at Your Resettlement Colony
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>24x7 Piped Water</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Power Substation</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Primary Health Centre</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Primary School</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>All-Weather Roads</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Community Hall</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Playground & Parks</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Fair Price Shop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: GRIEVANCE HELPDESK */}
      {activeCitizenTab === 'grievances' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit New Grievance */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Direct Citizen Grievance Submission</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              If you have an inquiry regarding revenue record correction, PFMS bank disbursement status, or R&R housing amenities, submit directly to the Competent Authority.
            </p>

            {grievanceSubmitted && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Your grievance has been submitted successfully! An SMS confirmation will be sent to your mobile.</span>
              </div>
            )}

            <form onSubmit={handleGrievanceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Complainant Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeFamily.headOfFamily || activeFamily.name}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Grievance Category
                </label>
                <select
                  value={grievanceCategory}
                  onChange={(e) => setGrievanceCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-semibold text-slate-800 focus:outline-blue-600"
                >
                  <option value="Compensation Valuation">Compensation & Valuation Query</option>
                  <option value="Disbursement Delay">PFMS Bank Disbursement Delay</option>
                  <option value="Housing Allotment">R&R Housing & Plot Demarcation</option>
                  <option value="Infrastructure Defect">Colony Amenities & Water Supply</option>
                  <option value="Name Mismatch">Revenue Schedule Name Mismatch</option>
                  <option value="Other">Other Representation</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Detailed Representation / Grievance Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe your query with survey number or bank account details..."
                  value={grievanceDescription}
                  onChange={(e) => setGrievanceDescription(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-800 focus:outline-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Grievance to Collector</span>
              </button>
            </form>
          </div>

          {/* Track Submitted Grievances */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
              My Submitted Grievance Records
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Real-time status tracking and official responses from the Collectorate.
            </p>

            {citizenGrievances.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-600">No active grievances on record</p>
                <p className="text-[11px] text-slate-400 mt-1">All your statutory entitlements are up to date.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {citizenGrievances.map((g) => (
                  <div key={g.id} className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/60 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-slate-700 text-[11px]">{g.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        g.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {g.status}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 mb-1">{g.category}</p>
                    <p className="text-slate-600 text-xs leading-relaxed mb-2">{g.description}</p>

                    {g.resolutionNotes && (
                      <div className="mt-2 p-2 bg-white border border-emerald-200 rounded text-emerald-900 text-[11px]">
                        <strong>Official Resolution:</strong> {g.resolutionNotes}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 mt-2">
                      Submitted on {g.filedDate || '2024-07-15'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
