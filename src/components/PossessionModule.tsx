import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { LandParcel } from '../types';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  MapPin,
  Building,
  Search,
  Filter,
  Printer,
  ShieldCheck,
  Compass,
  Lock,
  Shield,
  Eye
} from 'lucide-react';

export const PossessionModule: React.FC = () => {
  const { t } = useTranslation();
  const {
    parcels,
    projects,
    recordPossession,
    setActiveTab,
    role,
    portalUserType
  } = useApp();

  const isReadOnlyMonitoring = role === 'Central Sponsoring Ministry';
  const canExecuteHandover = role === 'Competent Authority (District Collector / CALA)';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPossession, setFilterPossession] = useState<string>('All');
  const [selectedParcelForPossession, setSelectedParcelForPossession] = useState<LandParcel | null>(null);
  const [panchnamaWitnesses, setPanchnamaWitnesses] = useState('Sh. Ramesh Kumar (Patwari), Sh. Sunil Verma (RI)');
  const [encroachmentCheck, setEncroachmentCheck] = useState<'Clear' | 'Minor Encroachment' | 'Court Stay'>('Clear');
  const [viewCertificateParcel, setViewCertificateParcel] = useState<LandParcel | null>(null);

  const filteredParcels = parcels.filter(p => {
    const matchPossession = filterPossession === 'All' || p.possessionStatus === filterPossession;
    const matchSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase());
    return matchPossession && matchSearch;
  });

  const takenCount = parcels.filter(p => p.possessionStatus === 'Possession Taken').length;
  const inspectionDoneCount = parcels.filter(p => p.possessionStatus === 'Joint Inspection Done').length;
  const pendingCount = parcels.filter(p => p.possessionStatus === 'Pending').length;

  const handlePossessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcelForPossession) return;

    recordPossession(
      selectedParcelForPossession.id,
      `PAN/SEC38/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`
    );

    setSelectedParcelForPossession(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-900 border border-emerald-200">
              Sections 38 & 40 RFCTLARR
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('possession.physical', 'Physical Handover & Panchnama')}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            {t('possession.title', 'Land Possession & Handover to Requiring Body')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('possession.subtitle', 'Digital Panchnama, physical site demarcation, encroachment monitoring, and revenue RoR mutation')}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{takenCount} {t('possession.taken', 'Taken')}</span>
          </div>
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{inspectionDoneCount} {t('possession.inspection', 'Inspection')}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-black uppercase tracking-wider text-[10px]">
            <span>{pendingCount} {t('possession.pending', 'Pending')}</span>
          </div>
        </div>
      </div>

      {/* National Read-Only Monitoring Banner */}
      {isReadOnlyMonitoring && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 text-xs text-sky-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0" />
            <span>
              <strong>National Read-Only Monitoring Mode:</strong> Active oversight session for Central Sponsoring Ministry. Physical possession execution, Panchnama certification, and revenue RoR mutations are exercised by District CALA under Section 38.
            </span>
          </div>
          <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-black text-[10px] uppercase tracking-wider whitespace-nowrap">
            Read-Only
          </span>
        </div>
      )}

      {/* Possession Ledger */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Cadastral Handover Ledger</h2>
            <span className="bg-slate-100 text-slate-800 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              {filteredParcels.length} Records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search survey no. or parcel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1 text-slate-800 font-bold focus:outline-blue-600 shadow-2xs"
              />
            </div>

            <select
              value={filterPossession}
              onChange={(e) => setFilterPossession(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold shadow-2xs"
            >
              <option value="All">All Possession States</option>
              <option value="Possession Taken">Possession Taken</option>
              <option value="Joint Inspection Done">Joint Inspection Done</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Parcel ID</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Survey & Village</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Area (Acres)</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Landowner (Masked)</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Compensation Status</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Possession Status</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Mutation / RoR</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right">Certificate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.map(parcel => (
                <tr key={parcel.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-black text-blue-900">
                    {parcel.id}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">Survey #{parcel.surveyNumber}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{parcel.village}, {parcel.district}</span>
                  </td>
                  <td className="px-4 py-3 font-black text-slate-800">
                    {parcel.areaAcres} ac
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {parcel.ownerReferenceMasked}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      parcel.compensationStatus === 'Disbursed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {parcel.compensationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      parcel.possessionStatus === 'Possession Taken'
                        ? 'bg-emerald-100 text-emerald-800'
                        : parcel.possessionStatus === 'Joint Inspection Done'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {parcel.possessionStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-emerald-800 font-black uppercase tracking-wider text-[10px]">
                    ✓ {parcel.mutationStatus || 'Mutated to Govt'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {parcel.possessionStatus === 'Possession Taken' ? (
                      <button
                        onClick={() => setViewCertificateParcel(parcel)}
                        className="text-xs font-black uppercase tracking-wider text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-blue-700" />
                        Panchnama
                      </button>
                    ) : canExecuteHandover ? (
                      <button
                        onClick={() => setSelectedParcelForPossession(parcel)}
                        className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-black uppercase tracking-wider text-[10px] rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        Record Handover
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded inline-flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        CALA Handover Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Record Physical Possession & Issue Panchnama */}
      {selectedParcelForPossession && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 text-xs">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Record Physical Possession (Section 38 RFCTLARR)
            </h3>
            <p className="text-slate-500 font-medium">
              Execute Panchnama for Parcel <strong className="text-slate-900">{selectedParcelForPossession.id}</strong> (Survey #{selectedParcelForPossession.surveyNumber}, {selectedParcelForPossession.areaAcres} Acres).
            </p>

            <form onSubmit={handlePossessionSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Encroachment Status on Spot</label>
                <select
                  value={encroachmentCheck}
                  onChange={(e) => setEncroachmentCheck(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold"
                >
                  <option value="Clear">Clear • Vacant Possession Available</option>
                  <option value="Minor Encroachment">Minor Encroachment (Crops/Fencing)</option>
                  <option value="Court Stay">Court Stay • Cannot Take Possession</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Panchnama Witnesses / Revenue Officials</label>
                <textarea
                  rows={2}
                  required
                  value={panchnamaWitnesses}
                  onChange={(e) => setPanchnamaWitnesses(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-950 text-[11px] font-medium">
                <strong>Statutory Pre-condition:</strong> Under Section 38, physical possession can only be enforced after full payment of compensation under Section 31 or deposit with the Authority.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedParcelForPossession(null)}
                  className="px-3 py-1.5 text-slate-600 font-bold uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={encroachmentCheck === 'Court Stay'}
                  className="px-4 py-2 bg-blue-900 disabled:opacity-50 text-white font-black uppercase tracking-wider text-[11px] rounded-lg shadow-sm hover:bg-blue-800"
                >
                  Issue Panchnama & Hand Over Land
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: View Official Panchnama Possession Certificate */}
      {viewCertificateParcel && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 border border-slate-300 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">Panchnama & Possession Certificate</h3>
              </div>
              <button
                onClick={() => setViewCertificateParcel(null)}
                className="text-slate-400 hover:text-slate-800 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="border border-slate-300 p-6 bg-slate-50/50 rounded-lg space-y-4 font-serif text-slate-800">
              <div className="text-center border-b border-slate-300 pb-3">
                <h2 className="text-base font-black uppercase tracking-wider text-slate-900 font-sans">
                  Certificate of Handing Over & Taking Over Physical Possession
                </h2>
                <p className="text-[11px] font-sans text-slate-500 font-bold uppercase tracking-widest mt-1">
                  Form IX • Under Section 38 of the RFCTLARR Act, 2013
                </p>
                <div className="text-xs font-mono font-black text-blue-900 mt-1">
                  Panchnama Certificate Ref: {viewCertificateParcel.possessionCertificateUrl || 'PAN/SEC38/2025/482'}
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed font-sans font-medium">
                <p>
                  This is to certify that peaceful and vacant physical possession of the land measuring <strong>{viewCertificateParcel.areaAcres} Acres</strong> comprised in Survey Number <strong>{viewCertificateParcel.surveyNumber}</strong> of Village <strong>{viewCertificateParcel.village}</strong>, District <strong>{viewCertificateParcel.district}</strong>, State of <strong>{viewCertificateParcel.state}</strong> has been taken over by the Competent Authority on this day.
                </p>
                <p>
                  The full statutory compensation has been satisfied via PFMS Direct Benefit Transfer to the landholder/occupant. Boundary stone demarcation has been erected in the presence of the Revenue Inspector, Patwari, and local panchas.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-300 grid grid-cols-2 font-sans text-[11px]">
                <div>
                  <span className="block font-black uppercase tracking-wider text-[10px] text-slate-500">Handed Over By:</span>
                  <span className="text-slate-900 font-bold">Special Land Acquisition Officer (SLAO)</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">Digital Signature Verified</span>
                </div>
                <div className="text-right">
                  <span className="block font-black uppercase tracking-wider text-[10px] text-slate-500">Taken Over By:</span>
                  <span className="text-slate-900 font-bold">Authorised Representative, Requisitioning Body</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">Seal & Demarcation Stamped</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black uppercase tracking-wider text-[11px] rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Certificate
              </button>
              <button
                onClick={() => setViewCertificateParcel(null)}
                className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-black uppercase tracking-wider text-[11px] rounded-lg shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
