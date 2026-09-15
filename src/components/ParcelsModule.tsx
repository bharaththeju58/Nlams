import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { LandParcel, ParcelStatus } from '../types';
import {
  Layers,
  Search,
  Filter,
  MapPin,
  Plus,
  Eye,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building,
  Lock
} from 'lucide-react';
import { canPerformAction } from '../utils/rbacPermissions';

export const ParcelsModule: React.FC = () => {
  const { t } = useTranslation();
  const {
    parcels,
    projects,
    addParcel,
    setSelectedParcelId,
    setActiveTab,
    role,
    portalUserType
  } = useApp();

  const canEdit = canPerformAction(role, portalUserType, 'canEditParcels');
  const isReadOnlyMonitoring = role === 'Central Sponsoring Ministry';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New parcel state
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [surveyNumber, setSurveyNumber] = useState('');
  const [village, setVillage] = useState('Nirala Nagar');
  const [tehsil, setTehsil] = useState('Huzur');
  const [district, setDistrict] = useState('Bhopal');
  const [state, setState] = useState('Madhya Pradesh');
  const [areaAcres, setAreaAcres] = useState('3.5');
  const [landType, setLandType] = useState<LandParcel['landType']>('Private Agricultural');
  const [ownerName, setOwnerName] = useState('Sh. Mohan Lal & Brothers');
  const [circleRate, setCircleRate] = useState('2200000');

  const filteredParcels = parcels.filter(p => {
    const matchProject = filterProject === 'All' || p.projectId === filterProject;
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchProject && matchStatus && matchSearch;
  });

  const totalAcres = parcels.reduce((acc, p) => acc + p.areaAcres, 0);
  const acquiredAcres = parcels
    .filter(p => p.status === 'Acquired')
    .reduce((acc, p) => acc + p.areaAcres, 0);

  const handleCreateParcel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyNumber.trim()) return;

    addParcel({
      projectId,
      surveyNumber,
      village,
      tehsil,
      district,
      state,
      areaAcres: Number(areaAcres) || 1.0,
      landType,
      status: 'Proposed',
      ownerName,
      ownerReferenceMasked: `${ownerName.slice(0, 4)}*** (Cadastral)`,
      ownershipType: 'Individual Freehold',
      marketValuePerAcre: Number(circleRate) || 2000000,
      compensationStatus: 'Under Determination',
      possessionStatus: 'Pending',
      externalLandRecordSource: 'State Revenue Portal (Bhulekh)',
      coordinates: {
        x: Math.floor(100 + Math.random() * 400),
        y: Math.floor(100 + Math.random() * 250),
        width: 80,
        height: 60
      }
    });

    setShowAddModal(false);
    setSurveyNumber('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-900 border border-blue-200">
              Cadastral Records
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('parcels.demarcation', 'Revenue Survey Demarcation')}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            {t('parcels.title', 'Land Parcels & Cadastral Registry')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('parcels.subtitle', 'Cadastral parcel tracking linked to state Land Record portals (Bhulekh, Bhoomi, Tamil Nilam)')}
          </p>
        </div>

        {canEdit ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-black uppercase tracking-wider text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t('parcels.addParcel', 'Add Cadastral Parcel')}
          </button>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Cadastral Demarcation: CALA / Proponent Requisition Only</span>
          </div>
        )}
      </div>

      {/* National Read-Only Monitoring Banner */}
      {isReadOnlyMonitoring && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 text-xs text-sky-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0" />
            <span>
              <strong>National Read-Only Monitoring Mode:</strong> Active oversight session for Central Sponsoring Ministry. Cadastral parcel creation, survey updates, and land type classifications are administered by District CALA and State Revenue Authorities.
            </span>
          </div>
          <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-black text-[10px] uppercase tracking-wider whitespace-nowrap">
            Read-Only
          </span>
        </div>
      )}

      {/* KPI Stats with left-accent borders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border-l-4 border-slate-900 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Total Parcels</span>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{parcels.length}</div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">{totalAcres.toFixed(1)} Total Acres</span>
        </div>

        <div className="bg-white border-l-4 border-emerald-600 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block mb-1">Acquired & Mutated</span>
          <div className="text-2xl font-black text-emerald-800 tracking-tight">
            {parcels.filter(p => p.status === 'Acquired').length} Parcels
          </div>
          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider mt-1 block">{acquiredAcres.toFixed(1)} Acres</span>
        </div>

        <div className="bg-white border-l-4 border-amber-500 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block mb-1">Notified / In Award</span>
          <div className="text-2xl font-black text-amber-800 tracking-tight">
            {parcels.filter(p => p.status === 'Notified').length} Parcels
          </div>
          <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider mt-1 block">Awaiting disbursement</span>
        </div>

        <div className="bg-white border-l-4 border-red-600 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-700 block mb-1">Disputed / In Court</span>
          <div className="text-2xl font-black text-red-800 tracking-tight">
            {parcels.filter(p => p.status === 'Disputed').length} Parcels
          </div>
          <span className="text-[10px] text-red-600 font-black uppercase tracking-wider mt-1 block">Subject to LARR Reference</span>
        </div>
      </div>

      {/* Parcels Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Cadastral Survey Ledger</h2>
            <span className="bg-slate-100 text-slate-800 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              {filteredParcels.length} Parcels
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search parcel, survey, village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1 text-slate-800 font-bold focus:outline-blue-600 shadow-2xs"
              />
            </div>

            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold shadow-2xs"
            >
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.id} - {p.name.slice(0, 24)}...</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold shadow-2xs"
            >
              <option value="All">All Statuses</option>
              <option value="Acquired">Acquired (🟢)</option>
              <option value="Notified">Notified (🟡)</option>
              <option value="Proposed">Proposed (🔵)</option>
              <option value="Disputed">Disputed (🔴)</option>
              <option value="Excluded">Excluded (⚫)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Parcel ID</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Survey & Village</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Area</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Land Classification</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Owner (Masked)</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Circle Rate</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Acquisition Status</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Compensation</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-black text-blue-900">
                    {p.id}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">Survey #{p.surveyNumber}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{p.village}, {p.district}</span>
                  </td>
                  <td className="px-4 py-3 font-black text-slate-800">
                    {p.areaAcres} ac
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {p.landType}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {p.ownerReferenceMasked}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-700">
                    ₹{(p.marketValuePerAcre / 100000).toFixed(1)} L/ac
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      p.status === 'Acquired'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'Notified'
                        ? 'bg-amber-100 text-amber-800'
                        : p.status === 'Disputed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    {p.compensationStatus}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedParcelId(p.id);
                        setActiveTab('GIS Map');
                      }}
                      className="text-xs font-black uppercase tracking-wider text-blue-900 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-700" />
                      GIS Map
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Cadastral Parcel */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 text-xs">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Add Cadastral Parcel to Project Alignment</h3>
            <form onSubmit={handleCreateParcel} className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Target Project</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Cadastral Survey Number</label>
                  <input
                    type="text"
                    required
                    value={surveyNumber}
                    onChange={(e) => setSurveyNumber(e.target.value)}
                    placeholder="e.g., 412/1B"
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Tehsil</label>
                  <input
                    type="text"
                    value={tehsil}
                    onChange={(e) => setTehsil(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Land Classification</label>
                  <select
                    value={landType}
                    onChange={(e) => setLandType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="Private Agricultural">Private Agricultural</option>
                    <option value="Private Non-Agricultural">Private Non-Agricultural</option>
                    <option value="Government Revenue Land">Government Revenue Land</option>
                    <option value="Forest Land">Forest Land</option>
                    <option value="Gram Panchayat Land">Gram Panchayat Land</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Circle Rate / Acre (₹)</label>
                  <input
                    type="number"
                    value={circleRate}
                    onChange={(e) => setCircleRate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Landowner / Occupant (Khatedar)</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 font-bold uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-black uppercase tracking-wider text-[11px] rounded-lg shadow-sm"
                >
                  Save Parcel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
