import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RRPlan } from '../../types';
import { RRPlanModal } from './RRPlanModal';
import {
  FileCheck,
  Plus,
  Building,
  Home,
  Briefcase,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Upload,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface RRPlansProps {
  selectedProjectId: string;
}

export const RRPlans: React.FC<RRPlansProps> = ({ selectedProjectId }) => {
  const {
    projects,
    rrPlans,
    createRRPlan,
    updateRRPlan,
    deleteRRPlan,
    togglePlanFacility,
    addRRDocument,
    role
  } = useApp();

  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(rrPlans[0]?.id || null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit' | 'view';
    data: RRPlan | null;
  }>({
    isOpen: false,
    mode: 'add',
    data: null
  });

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filtered plans
  const filteredPlans = useMemo(() => {
    if (selectedProjectId === 'ALL') return rrPlans;
    return rrPlans.filter(p => p.projectId === selectedProjectId);
  }, [rrPlans, selectedProjectId]);

  const handleSavePlan = async (payload: any) => {
    if (modalState.mode === 'add') {
      await createRRPlan(payload);
    } else if (modalState.mode === 'edit' && modalState.data) {
      await updateRRPlan(modalState.data.id, payload);
    }
    setModalState({ isOpen: false, mode: 'add', data: null });
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      await deleteRRPlan(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const handleFacilityStatusCycle = (planId: string, facilityId: string, currentStatus: string) => {
    const nextStatus: 'Completed' | 'In Progress' | 'Pending' | 'Delayed' =
      currentStatus === 'Pending'
        ? 'In Progress'
        : currentStatus === 'In Progress'
        ? 'Completed'
        : currentStatus === 'Completed'
        ? 'Delayed'
        : 'Pending';
    togglePlanFacility(planId, facilityId, nextStatus);
  };

  return (
    <div className="space-y-6" id="rr-plans-section">
      {/* Header & New Plan Action */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
            Statutory R&R Schemes & Township Plans
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Formulation, review, infrastructure development, and progress tracking under Sections 31 & 32 of RFCTLARR Act
          </p>
        </div>

        <button
          onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          id="btn-formulate-rr-plan"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Formulate New R&R Plan</span>
        </button>
      </div>

      {/* Plans List Cards */}
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-400 font-medium">
            No R&R schemes found for the selected project filter. Click &quot;Formulate New R&R Plan&quot; to initiate one.
          </div>
        ) : (
          filteredPlans.map(plan => {
            const isExpanded = expandedPlanId === plan.id;
            const today = new Date().toISOString().split('T')[0];
            const isDelayed = plan.status === 'Delayed' || (plan.status !== 'Completed' && plan.plannedCompletionDate && plan.plannedCompletionDate < today);

            // Compute facility statistics
            const completedFacilities = plan.infrastructureFacilities.filter(f => f.status === 'Completed').length;
            const totalFacilities = plan.infrastructureFacilities.length;

            return (
              <div
                key={plan.id}
                className={`bg-white border rounded-xl shadow-xs transition overflow-hidden ${
                  isDelayed ? 'border-rose-300' : 'border-slate-200'
                }`}
              >
                {/* Plan Header Bar */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isDelayed ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-white border border-slate-300 px-2 py-0.5 rounded shadow-2xs">
                          {plan.id}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {plan.projectId} • {plan.district}, {plan.state}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isDelayed
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : plan.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isDelayed ? 'Delayed (Milestone Lapsed)' : plan.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {plan.projectName || plan.projectId}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Target Beneficiaries: <strong className="text-slate-800">{plan.affectedFamiliesCount} Affected Families</strong> • Target Milestone:{' '}
                        <strong className={isDelayed ? 'text-rose-700 font-bold' : 'text-slate-800'}>
                          {plan.plannedCompletionDate}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => setModalState({ isOpen: true, mode: 'view', data: plan })}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
                      title="View Plan Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setModalState({ isOpen: true, mode: 'edit', data: plan })}
                      className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
                      title="Edit Plan"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(plan.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1 transition cursor-pointer shadow-2xs"
                    >
                      <span>{isExpanded ? 'Collapse Details' : 'View Schedule III Amenities'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-b border-slate-100 divide-x divide-slate-100 bg-white text-xs">
                  <div className="p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Housing Units</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {plan.housingAssistance.unitsAllotted} / {plan.housingAssistance.unitsPlanned} Allotted
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium">
                      {plan.housingAssistance.unitsConstructed} Constructed
                    </span>
                  </div>

                  <div className="p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Livelihood Assistance</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {plan.livelihoodAssistance.supportedBeneficiaries} / {plan.livelihoodAssistance.targetBeneficiaries} Beneficiaries
                    </span>
                    <span className="text-[10px] text-teal-600 font-medium">
                      {Math.round((plan.livelihoodAssistance.supportedBeneficiaries / Math.max(1, plan.livelihoodAssistance.targetBeneficiaries)) * 100)}% Covered
                    </span>
                  </div>

                  <div className="p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Employment Provision</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {plan.employmentAssistance.providedJobs} / {plan.employmentAssistance.targetJobs} Jobs
                    </span>
                    <span className="text-[10px] text-purple-600 font-medium">
                      {plan.employmentAssistance.status}
                    </span>
                  </div>

                  <div className="p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Schedule III Amenities</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {completedFacilities} / {totalFacilities} Ready
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      {totalFacilities > 0 ? Math.round((completedFacilities / totalFacilities) * 100) : 0}% Statutory Complete
                    </span>
                  </div>
                </div>

                {/* Expanded Section: Schedule III Amenities & Details */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50/70 border-t border-slate-200 space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                          Third Schedule: Civic Infrastructure & Basic Amenities Checklist
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Click any amenity status pill to cycle status (Pending → In Progress → Completed → Delayed)
                        </p>
                      </div>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded border border-purple-200">
                        Section 32 Mandatory
                      </span>
                    </div>

                    {/* Interactive Amenities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {plan.infrastructureFacilities.map(fac => (
                        <div
                          key={fac.id}
                          className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              <span>{fac.category}</span>
                              {fac.mandatorySchedule3 && (
                                <span className="text-amber-700 bg-amber-50 px-1 py-0.2 rounded">Mandatory</span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-slate-900 mt-1">{fac.name}</h5>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={() => handleFacilityStatusCycle(plan.id, fac.id, fac.status)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                                fac.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : fac.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                  : fac.status === 'Delayed'
                                  ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                              title="Click to toggle status"
                            >
                              {fac.status === 'Completed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                              {fac.status === 'In Progress' && <Clock className="w-3 h-3 text-blue-600" />}
                              {fac.status === 'Delayed' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                              <span>{fac.status} (Click to toggle)</span>
                            </button>
                            <span className="text-[11px] font-bold text-slate-700">
                              {fac.completionPercent}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Plan Details & Remarks */}
                    <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1.5">
                      <div className="font-bold text-slate-800">Statutory Welfare & Special Packages:</div>
                      <div className="text-slate-600">{plan.otherStatutoryBenefits || 'Standard Schedule II packages applicable.'}</div>
                      {plan.remarks && (
                        <div className="text-slate-500 italic pt-1 border-t border-slate-100 text-[11px]">
                          Collector Remarks: {plan.remarks}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Plan Modal */}
      <RRPlanModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.data}
        projects={projects}
        onClose={() => setModalState({ isOpen: false, mode: 'add', data: null })}
        onSave={handleSavePlan}
      />

      {/* Delete Confirmation */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete R&R Scheme</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete scheme <strong>{deleteTargetId}</strong>? All associated statutory milestone records will be purged.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
