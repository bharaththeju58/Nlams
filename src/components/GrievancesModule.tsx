import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Grievance } from '../types';
import {
  MessageSquareWarning,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Building,
  ShieldAlert,
  ArrowUpRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { canPerformAction } from '../utils/rbacPermissions';

export const GrievancesModule: React.FC = () => {
  const { t } = useTranslation();
  const {
    grievances,
    projects,
    addGrievance,
    resolveGrievance,
    role,
    portalUserType
  } = useApp();

  const canAdjudicate = canPerformAction(role, portalUserType, 'canAdjudicateGrievance');
  const isReadOnlyMonitoring = role === 'Central Sponsoring Ministry';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add grievance state
  const [citizenName, setCitizenName] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [category, setCategory] = useState<Grievance['category']>('Compensation Dispute');
  const [priority, setPriority] = useState<Grievance['priority']>('High');
  const [description, setDescription] = useState('');

  // Resolution modal state
  const [selectedGrievanceForAction, setSelectedGrievanceForAction] = useState<Grievance | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState<'Resolved' | 'Hearing Scheduled' | 'Escalated to Authority'>('Resolved');

  const filteredGrievances = grievances.filter(g => {
    const matchCategory = filterCategory === 'All' || g.category === filterCategory;
    const matchStatus = filterStatus === 'All' || g.status === filterStatus;
    const matchSearch =
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !description.trim()) return;

    addGrievance({
      citizenName,
      projectId,
      category,
      priority,
      description
    });

    setShowAddModal(false);
    setCitizenName('');
    setDescription('');
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievanceForAction || !resolutionNotes.trim()) return;

    resolveGrievance(selectedGrievanceForAction.id, resolutionNotes, resolutionStatus);
    setSelectedGrievanceForAction(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-900 border border-amber-200">
              Sections 51 & 64 RFCTLARR
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('grievances.subtitle', 'Public Grievance Redressal')}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            {t('grievances.title', 'Grievance Redressal & LARR Authority Referrals')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('grievances.description', 'Citizen representations, compensation hearings, joint re-survey requests, and formal authority references')}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-black uppercase tracking-wider text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t('grievances.lodgeNew', 'Lodge New Grievance')}
        </button>
      </div>

      {/* National Read-Only Monitoring Banner */}
      {isReadOnlyMonitoring && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 text-xs text-sky-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0" />
            <span>
              <strong>National Read-Only Monitoring Mode:</strong> Active oversight session for Central Sponsoring Ministry. Adjudication of citizen compensation objections and Section 64 tribunal references are statutorily exercised by District Revenue Collectors and the R&R Authority.
            </span>
          </div>
          <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-black text-[10px] uppercase tracking-wider whitespace-nowrap">
            Read-Only
          </span>
        </div>
      )}

      {/* Grievance Ledger */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">{t('grievances.registered', 'Registered Citizen Grievances')}</h2>
            <span className="bg-slate-100 text-slate-800 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              {filteredGrievances.length} Active Matters
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder={t('grievances.searchPlaceholder', 'Search citizen or grievance...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1 text-slate-800 font-bold focus:outline-blue-600 shadow-2xs"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold shadow-2xs"
            >
              <option value="All">{t('grievances.allCategories', 'All Categories')}</option>
              <option value="Compensation Dispute">Compensation Dispute</option>
              <option value="Survey / Demarcation Error">Survey / Demarcation Error</option>
              <option value="R&R Entitlement Exclusion">R&R Entitlement Exclusion</option>
              <option value="Tree / Asset Omission">Tree / Asset Omission</option>
              <option value="Procedural Delay">Procedural Delay</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold shadow-2xs"
            >
              <option value="All">{t('grievances.allStatuses', 'All Statuses')}</option>
              <option value="Submitted">Submitted</option>
              <option value="In Review">In Review</option>
              <option value="Hearing Scheduled">Hearing Scheduled</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated to Authority">Escalated to Authority</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredGrievances.map(g => (
            <div key={g.id} className="p-4 hover:bg-slate-50 transition-colors text-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-blue-900">{g.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-black text-slate-900 text-sm">{g.citizenName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      g.priority === 'Urgent'
                        ? 'bg-red-100 text-red-800'
                        : g.priority === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {g.priority} Priority
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      g.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : g.status === 'Escalated to Authority'
                        ? 'bg-purple-100 text-purple-800'
                        : g.status === 'Hearing Scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {g.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Category: <strong className="text-slate-700">{g.category}</strong></span>
                    <span>•</span>
                    <span>Project: <strong className="text-slate-700 font-mono">{g.projectId}</strong></span>
                    <span>•</span>
                    <span>Submitted: {g.submissionDate}</span>
                    {g.hearingDate && (
                      <>
                        <span>•</span>
                        <span className="text-blue-900 font-black">Hearing: {g.hearingDate}</span>
                      </>
                    )}
                  </div>

                  <p className="mt-1.5 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
                    "{g.description}"
                  </p>

                  {g.resolutionNotes && (
                    <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-slate-800">
                      <span className="font-black text-emerald-900 uppercase tracking-wide text-[10px] block mb-0.5">Order / Resolution:</span>
                      <p className="text-slate-700 italic font-medium">{g.resolutionNotes}</p>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 self-end sm:self-start">
                  {canAdjudicate ? (
                    <button
                      onClick={() => {
                        setSelectedGrievanceForAction(g);
                        setResolutionNotes(g.resolutionNotes || '');
                      }}
                      className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-black uppercase tracking-wider text-[10px] shadow-sm transition-colors cursor-pointer"
                    >
                      Take Official Action
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      CALA / R&R Jurisdiction
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: Lodge Grievance */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 text-xs">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Lodge Citizen Representation / Grievance</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Citizen / Landowner Name</label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Smt. Manjula Patel"
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="Compensation Dispute">Compensation Dispute</option>
                    <option value="Survey / Demarcation Error">Survey / Demarcation Error</option>
                    <option value="R&R Entitlement Exclusion">R&R Entitlement Exclusion</option>
                    <option value="Tree / Asset Omission">Tree / Asset Omission</option>
                    <option value="Procedural Delay">Procedural Delay</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="Urgent">Urgent (Eviction / Possession dispute)</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Grievance Narrative / Evidence</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail grounds, discrepancy in revenue survey number, or omitted fruit trees..."
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
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
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Take Official Action / Hearing Notice / Resolve */}
      {selectedGrievanceForAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 text-xs">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Official Grievance Disposal ({selectedGrievanceForAction.id})
            </h3>
            <p className="text-slate-500 font-medium">
              Complainant: <strong className="text-slate-900 font-bold">{selectedGrievanceForAction.citizenName}</strong> | Category: <span className="font-bold text-slate-700">{selectedGrievanceForAction.category}</span>
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Administrative Order</label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold"
                >
                  <option value="Resolved">Resolve with Supplementary Award / Re-survey</option>
                  <option value="Hearing Scheduled">Summon Parties & Issue Hearing Notice</option>
                  <option value="Escalated to Authority">Escalate to LARR Authority (Section 64)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Official Findings & Speaking Order</label>
                <textarea
                  rows={4}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record verification report by Revenue Inspector, supplementary award calculation, or hearing notice dates..."
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGrievanceForAction(null)}
                  className="px-3 py-1.5 text-slate-600 font-bold uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-black uppercase tracking-wider text-[11px] rounded-lg shadow-sm"
                >
                  Issue Formal Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
