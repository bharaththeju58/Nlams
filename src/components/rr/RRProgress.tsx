import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Circle,
  Search,
  ChevronRight,
  User,
  ShieldCheck,
  Building,
  Calendar,
  ArrowRight
} from 'lucide-react';

interface RRProgressProps {
  selectedProjectId: string;
}

const STAGES = [
  { stageIndex: 0, number: 1, title: 'Affected Family Surveyed', desc: 'SIA and socioeconomic baseline survey conducted and entered into register.' },
  { stageIndex: 1, number: 2, title: 'Eligibility Verified', desc: 'Revenue Inspector and LARR officer verified titles, tenancy, and displacement qualification.' },
  { stageIndex: 2, number: 3, title: 'R&R Plan Formulated', desc: 'Draft scheme published with specific entitlement options (House, Land, Annuity, Grants).' },
  { stageIndex: 3, number: 4, title: 'Benefits Approved', desc: 'Statutory approval sanction letter issued by Administrator (R&R) and District Collector.' },
  { stageIndex: 4, number: 5, title: 'Benefits Provided', desc: 'Direct Benefit Transfer (DBT) and plot possession letters disbursed to beneficiary.' },
  { stageIndex: 5, number: 6, title: 'Resettlement Completed', desc: 'Family physically relocated to new habitat township or self-resettled with certificate.' },
  { stageIndex: 6, number: 7, title: 'Case Closed', desc: 'Full compliance verified under Section 38 RFCTLARR Act; statutory case closed.' }
];

export const RRProgress: React.FC<RRProgressProps> = ({ selectedProjectId }) => {
  const {
    families,
    projects,
    updateFamilyWorkflowStage,
    role
  } = useApp();

  const filteredFamilies = useMemo(() => {
    if (selectedProjectId === 'ALL') return families;
    return families.filter(f => f.projectId === selectedProjectId);
  }, [families, selectedProjectId]);

  const [selectedFamilyId, setSelectedFamilyId] = useState<string>(
    filteredFamilies[0]?.id || families[0]?.id || ''
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [stageNotes, setStageNotes] = useState('');

  // Selected family
  const currentFamily = useMemo(() => {
    return families.find(f => f.id === selectedFamilyId) || filteredFamilies[0] || families[0];
  }, [families, filteredFamilies, selectedFamilyId]);

  // Derive stage index from family's currentStatus
  const currentStageIndex = useMemo(() => {
    if (!currentFamily) return 0;
    const status = currentFamily.currentStatus;
    if (status === 'Surveyed') return 0;
    if (status === 'Eligibility Verified') return 1;
    if (status === 'Plan Formulated') return 2;
    if (status === 'Benefits In Progress') return 3;
    if (status === 'Benefits Delivered') return 4;
    if (status === 'Resettled') return 5;
    if (status === 'Closed') return 6;
    return 0;
  }, [currentFamily]);

  const handleAdvanceStage = async (targetIndex: number) => {
    if (!currentFamily) return;
    const targetStage = STAGES[targetIndex];
    if (targetStage) {
      await updateFamilyWorkflowStage(currentFamily.id, targetIndex, targetStage.title, stageNotes || undefined);
      setStageNotes('');
    }
  };

  return (
    <div className="space-y-6" id="rr-progress-section">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
            Statutory R&R Lifecycle Progress Tracker
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Monitor and advance individual family cases across all 7 statutory stages under RFCTLARR Act 2013
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Select Family:</span>
          <select
            value={currentFamily?.id || ''}
            onChange={e => setSelectedFamilyId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-blue-600 shadow-2xs"
          >
            {filteredFamilies.map(f => (
              <option key={f.id} value={f.id}>
                {f.id} — {f.headOfFamily || f.name} ({f.village})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentFamily ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Family Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 font-mono">
                  {currentFamily.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {currentFamily.headOfFamily || currentFamily.name}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                {currentFamily.currentStatus}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Project ID:</span>
                <strong className="text-slate-800">{currentFamily.projectId}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Location:</span>
                <strong className="text-slate-800">{currentFamily.village}, {currentFamily.district}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Family Members:</span>
                <strong className="text-slate-800">{currentFamily.familyMembersCount} persons</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Land Acquired:</span>
                <strong className="text-slate-800">{currentFamily.landAcquiredAcres ? `${currentFamily.landAcquiredAcres} Acres` : currentFamily.landAcquired}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Displacement Type:</span>
                <strong className="text-purple-700">{currentFamily.displacementStatus}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Statutory Eligibility:</span>
                <strong className="text-emerald-700">{currentFamily.rrEligibility}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Contact Number:</span>
                <strong className="text-slate-800">{currentFamily.contact}</strong>
              </div>
            </div>

            {/* Quick Action to advance */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Official Transition Notes:</label>
              <input
                type="text"
                value={stageNotes}
                onChange={e => setStageNotes(e.target.value)}
                placeholder="e.g. Verification completed by ADM (LA)"
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs"
              />
              <button
                disabled={currentStageIndex >= 6}
                onClick={() => handleAdvanceStage(currentStageIndex + 1)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Advance to Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: 7-Stage Timeline */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Statutory Progression Timeline
                </h3>
                <p className="text-xs text-slate-500">
                  Current Stage: <strong>Stage {currentStageIndex + 1} of 7 ({STAGES[currentStageIndex]?.title})</strong>
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {Math.round(((currentStageIndex + 1) / 7) * 100)}% Completed
              </span>
            </div>

            {/* Timeline Steps List */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {STAGES.map((st, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isPending = idx > currentStageIndex;

                return (
                  <div key={st.number} className="relative group">
                    {/* Milestone Icon */}
                    <div
                      className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : st.number}
                    </div>

                    {/* Step Card */}
                    <div
                      className={`p-3.5 border rounded-lg transition ${
                        isCurrent
                          ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                          : isCompleted
                          ? 'bg-slate-50/80 border-slate-200'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isCurrent
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {isCompleted ? 'Completed' : isCurrent ? 'Active Stage' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1">{st.desc}</p>
                        </div>

                        {/* Interactive Click to Jump/Set Stage */}
                        {!isCurrent && (
                          <button
                            onClick={() => handleAdvanceStage(idx)}
                            className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-white border border-slate-300 rounded hover:bg-blue-50 transition shrink-0 cursor-pointer shadow-2xs"
                          >
                            Set Active
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-400">
          No affected family records available to track.
        </div>
      )}
    </div>
  );
};
