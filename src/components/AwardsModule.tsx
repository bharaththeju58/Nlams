import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Award, LandParcel } from '../types';
import {
  Award as AwardIcon,
  IndianRupee,
  Plus,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Search,
  Calculator,
  ShieldCheck,
  Building,
  Lock
} from 'lucide-react';
import { canPerformAction } from '../utils/rbacPermissions';

export const AwardsModule: React.FC = () => {
  const { t } = useTranslation();
  const {
    awards,
    parcels,
    projects,
    declareAward,
    setActiveTab,
    role,
    portalUserType
  } = useApp();

  const canDeclare = canPerformAction(role, portalUserType, 'canDeclareAwards');

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeclareModal, setShowDeclareModal] = useState(false);

  // New Award form state
  const [selectedParcelId, setSelectedParcelId] = useState<string>(parcels[2]?.id || parcels[0]?.id);
  const [multiplier, setMultiplier] = useState<number>(1.25);
  const [assetValuation, setAssetValuation] = useState<number>(500000);
  const [interestPercent, setInterestPercent] = useState<number>(12);

  const selectedParcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];
  const targetProject = projects.find(p => p.id === selectedParcel?.projectId) || projects[0];

  // Mathematical Calculation per RFCTLARR Act 2013 First Schedule:
  // Base Market Value = Land Area * Circle Rate
  // Multiplied Market Value = Base * Multiplier (1.0 to 2.0)
  // 100% Solatium = Multiplied Market Value
  // 12% Additional Interest = 12% on base market value
  // Total Award = Multiplied Market Value + 100% Solatium + 12% Interest + Asset Valuation
  const calculatedBase = selectedParcel ? Math.round(selectedParcel.areaAcres * selectedParcel.marketValuePerAcre) : 10000000;
  const calculatedMultiplied = Math.round(calculatedBase * multiplier);
  const calculatedSolatium = calculatedMultiplied; // 100% Solatium
  const calculatedInterest = Math.round(calculatedBase * 0.12);
  const totalCalculatedAward = calculatedMultiplied + calculatedSolatium + calculatedInterest + Number(assetValuation);

  const filteredAwards = awards.filter(a => {
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    const matchSearch =
      a.awardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.landownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.parcelId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleDeclareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcel) return;

    declareAward({
      awardNumber: `LARR/AWD/2025/${Math.floor(1000 + Math.random() * 9000)}`,
      projectId: selectedParcel.projectId,
      parcelId: selectedParcel.id,
      landownerName: selectedParcel.ownerName,
      landAreaAcres: selectedParcel.areaAcres,
      marketValueBase: calculatedBase,
      multiplierFactor: multiplier,
      solatium100Percent: calculatedSolatium,
      additionalInterest12Percent: calculatedInterest,
      assetValuation: Number(assetValuation) || 0,
      totalAwardAmount: totalCalculatedAward,
      declarationAuthority: `${role} / Land Acquisition Officer`
    });

    setShowDeclareModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-purple-100 text-purple-900 border border-purple-200">
              Sections 23, 26-30 RFCTLARR
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('awards.determination', 'Statutory Award Determination')}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            {t('awards.title', 'Section 23/30 Land Acquisition Awards & Solatium')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('awards.subtitle', 'Rule-based computation of Market Value, Rural Multiplier, 100% Solatium, and 12% Additional Interest')}
          </p>
        </div>

        {canDeclare ? (
          <button
            onClick={() => setShowDeclareModal(true)}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-black uppercase tracking-wider text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t('awards.computeDeclare', 'Compute & Declare Award (Sec 23)')}
          </button>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Award Formulation: District CALA Only</span>
          </div>
        )}
      </div>

      {/* National Read-Only Monitoring Banner */}
      {role === 'Central Sponsoring Ministry' && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 text-xs text-sky-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0" />
            <span>
              <strong>National Read-Only Monitoring Mode:</strong> Active oversight session for Central Sponsoring Ministry. Statutory award formulation under Section 23/26-30 and 100% Solatium determinations are statutorily reserved for District CALA.
            </span>
          </div>
          <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-black text-[10px] uppercase tracking-wider whitespace-nowrap">
            Read-Only
          </span>
        </div>
      )}

      {/* Summary KPI Strip with left-accent borders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border-l-4 border-slate-900 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Total Awards Declared</span>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{awards.length}</div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">Across active corridors</span>
        </div>

        <div className="bg-white border-l-4 border-purple-600 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 block mb-1">Total Award Amount</span>
          <div className="text-2xl font-black text-purple-950 tracking-tight">
            ₹{(awards.reduce((acc, a) => acc + a.totalAwardAmount, 0) / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-purple-700 font-black uppercase tracking-wider mt-1 block">Includes 100% Solatium</span>
        </div>

        <div className="bg-white border-l-4 border-emerald-600 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block mb-1">Disbursed / Paid</span>
          <div className="text-2xl font-black text-emerald-800 tracking-tight">
            {awards.filter(a => a.status === 'Paid').length} Awards
          </div>
          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider mt-1 block">Settled via PFMS</span>
        </div>

        <div className="bg-white border-l-4 border-amber-500 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block mb-1">In Payment Pipeline</span>
          <div className="text-2xl font-black text-amber-800 tracking-tight">
            {awards.filter(a => a.status !== 'Paid').length} Awards
          </div>
          <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider mt-1 block">Awaiting Treasury clearance</span>
        </div>
      </div>

      {/* Awards Table & Controls */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Statutory Awards Ledger</h2>
            <span className="bg-slate-100 text-slate-800 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              {filteredAwards.length} Records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search award no. or landowner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1 text-slate-800 font-bold focus:outline-blue-600 shadow-2xs"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold shadow-2xs"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Verified">Verified</option>
              <option value="Declared">Declared</option>
              <option value="Payment Initiated">Payment Initiated</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Award Number</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Parcel & Project</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Landowner / Family</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Area</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Base Market Value</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Solatium (100%)</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Total Award</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAwards.map(award => (
                <tr key={award.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-black text-blue-900">
                    {award.awardNumber}
                    <span className="block text-[10px] text-slate-400 font-bold">{award.awardDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-800 block">{award.parcelId}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{award.projectId}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    {award.landownerName}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-bold">
                    {award.landAreaAcres} ac
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <span className="font-bold">₹{(award.marketValueBase / 100000).toFixed(2)} L</span>
                    <span className="block text-[10px] text-slate-400 font-bold">Factor: {award.multiplierFactor}x</span>
                  </td>
                  <td className="px-4 py-3 font-black text-purple-900">
                    ₹{(award.solatium100Percent / 100000).toFixed(2)} L
                  </td>
                  <td className="px-4 py-3 font-black text-slate-900">
                    ₹{(award.totalAwardAmount / 10000000).toFixed(2)} Cr
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      award.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : award.status === 'Declared'
                        ? 'bg-blue-100 text-blue-800'
                        : award.status === 'Payment Initiated'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {award.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => setActiveTab('Compensation')}
                      className="text-blue-900 hover:text-blue-700 font-black uppercase tracking-wider text-[10px]"
                    >
                      Disburse →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Formula Info Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 space-y-1.5">
        <h3 className="font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-blue-700" />
          Statutory Calculation Rules under RFCTLARR Act, 2013 (First Schedule)
        </h3>
        <p className="text-[11px] text-slate-600 font-medium">
          • <strong>Market Value (Sec 26):</strong> Determined by circle rate or average sale price of top 50% transactions, whichever is higher.<br />
          • <strong>Multiplier Factor (Sec 26(2)):</strong> 1.0 (urban) to 2.0 (rural based on distance from nearest urban boundary).<br />
          • <strong>Solatium (Sec 30(1)):</strong> Mandatory 100% solatium imposed on the multiplied market value.<br />
          • <strong>Additional Interest (Sec 30(3)):</strong> 12% per annum from preliminary notification date to award date.
        </p>
      </div>

      {/* Modal: Declare Award */}
      {showDeclareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 text-xs">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Declare Section 23/30 Statutory Award
            </h3>

            <form onSubmit={handleDeclareSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Target Land Parcel</label>
                <select
                  value={selectedParcelId}
                  onChange={(e) => setSelectedParcelId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold"
                >
                  {parcels.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} — Survey {p.surveyNumber} ({p.village}, {p.areaAcres} ac)
                    </option>
                  ))}
                </select>
              </div>

              {selectedParcel && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="font-bold text-slate-800">Landowner: {selectedParcel.ownerName}</span>
                  <p className="text-slate-500 font-medium">
                    Area: {selectedParcel.areaAcres} ac | Circle Rate: ₹{(selectedParcel.marketValuePerAcre / 100000).toFixed(1)} L/ac
                  </p>
                  <p className="font-mono text-blue-900 font-black">
                    Base Market Value: ₹{(calculatedBase / 100000).toFixed(2)} Lakhs
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Rural Multiplier (1.0 - 2.0)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="2.0"
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Asset Valuation (Trees/Wells ₹)</label>
                  <input
                    type="number"
                    value={assetValuation}
                    onChange={(e) => setAssetValuation(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              {/* Live Calculation Preview */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-950 space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold">Multiplied Land Value ({multiplier}x):</span>
                  <span className="font-black">₹{(calculatedMultiplied / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Mandatory 100% Solatium:</span>
                  <span className="font-black">₹{(calculatedSolatium / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">12% Additional Interest:</span>
                  <span className="font-black">₹{(calculatedInterest / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between border-t border-purple-200 pt-1 text-sm font-black">
                  <span>Total Statutory Award:</span>
                  <span className="text-purple-950 font-black">₹{(totalCalculatedAward / 10000000).toFixed(2)} Cr</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeclareModal(false)}
                  className="px-3 py-1.5 text-slate-600 font-bold uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-black uppercase tracking-wider text-[11px] rounded-lg shadow-sm hover:bg-blue-800"
                >
                  Declare Award in Gazette
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
