import React, { useState, useEffect } from 'react';
import { RRPlan, Project } from '../../types';
import { X, Save, Building, Home, Briefcase, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface RRPlanModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'view';
  initialData?: RRPlan | null;
  projects: Project[];
  onClose: () => void;
  onSave: (planData: any) => Promise<void>;
}

export const RRPlanModal: React.FC<RRPlanModalProps> = ({
  isOpen,
  mode,
  initialData,
  projects,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || 'PRJ-2025-0101',
    projectName: projects[0]?.name || '',
    state: 'Tamil Nadu',
    district: 'Krishnagiri',
    affectedFamiliesCount: 100,
    housingUnitsPlanned: 80,
    housingUnitsConstructed: 60,
    housingUnitsAllotted: 50,
    housingDetails: '2BHK Pucca Units under Section 31 Schedule II',
    livelihoodTarget: 100,
    livelihoodSupported: 75,
    livelihoodDetails: 'Vocational training and DBT subsistence allowance ₹3,000/mo',
    employmentTarget: 40,
    employmentProvided: 25,
    employmentDetails: 'Reserved project maintenance & housekeeping positions',
    plotsDeveloped: 100,
    plotsAllotted: 85,
    plannedCompletionDate: '2025-09-30',
    status: 'In Progress' as RRPlan['status'],
    otherStatutoryBenefits: '₹50,000 shifting grant and ₹25,000 cattle shed subsidy to eligible agrarians',
    remarks: 'Approved by State Commissioner for Rehabilitation & Resettlement'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && (mode === 'edit' || mode === 'view')) {
      setFormData({
        projectId: initialData.projectId,
        projectName: initialData.projectName,
        state: initialData.state,
        district: initialData.district,
        affectedFamiliesCount: initialData.affectedFamiliesCount,
        housingUnitsPlanned: initialData.housingAssistance.unitsPlanned,
        housingUnitsConstructed: initialData.housingAssistance.unitsConstructed,
        housingUnitsAllotted: initialData.housingAssistance.unitsAllotted,
        housingDetails: initialData.housingAssistance.details,
        livelihoodTarget: initialData.livelihoodAssistance.targetBeneficiaries,
        livelihoodSupported: initialData.livelihoodAssistance.supportedBeneficiaries,
        livelihoodDetails: initialData.livelihoodAssistance.details,
        employmentTarget: initialData.employmentAssistance.targetJobs,
        employmentProvided: initialData.employmentAssistance.providedJobs,
        employmentDetails: initialData.employmentAssistance.details,
        plotsDeveloped: initialData.landPlotAssistance?.plotsDeveloped || 0,
        plotsAllotted: initialData.landPlotAssistance?.plotsAllotted || 0,
        plannedCompletionDate: initialData.plannedCompletionDate,
        status: initialData.status,
        otherStatutoryBenefits: initialData.otherStatutoryBenefits || '',
        remarks: initialData.remarks || ''
      });
    } else {
      const proj = projects[0];
      setFormData({
        projectId: proj?.id || 'PRJ-2025-0101',
        projectName: proj?.name || '',
        state: proj?.state || 'Tamil Nadu',
        district: proj?.district || '',
        affectedFamiliesCount: 100,
        housingUnitsPlanned: 80,
        housingUnitsConstructed: 0,
        housingUnitsAllotted: 0,
        housingDetails: 'Model township housing units under Schedule II',
        livelihoodTarget: 100,
        livelihoodSupported: 0,
        livelihoodDetails: 'Subsistence allowance DBT pipeline',
        employmentTarget: 30,
        employmentProvided: 0,
        employmentDetails: 'Mandatory job offers under Section 31',
        plotsDeveloped: 100,
        plotsAllotted: 0,
        plannedCompletionDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
        status: 'In Progress',
        otherStatutoryBenefits: 'Shifting grant ₹50,000 + cattle shed grant ₹25,000',
        remarks: ''
      });
    }
    setErrors({});
  }, [initialData, mode, projects]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.district.trim()) errs.district = 'District is required';
    if (formData.affectedFamiliesCount < 1) errs.affectedFamiliesCount = 'Affected families count must be > 0';
    if (!formData.plannedCompletionDate) errs.plannedCompletionDate = 'Target completion date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const targetProj = projects.find(p => p.id === formData.projectId);
      const payload: Partial<RRPlan> = {
        projectId: formData.projectId,
        projectName: targetProj?.name || formData.projectName,
        state: formData.state,
        district: formData.district,
        affectedFamiliesCount: formData.affectedFamiliesCount,
        housingAssistance: {
          status: formData.housingUnitsAllotted >= formData.housingUnitsPlanned ? 'Completed' : formData.status === 'Delayed' ? 'Delayed' : 'In Progress',
          unitsPlanned: formData.housingUnitsPlanned,
          unitsConstructed: formData.housingUnitsConstructed,
          unitsAllotted: formData.housingUnitsAllotted,
          details: formData.housingDetails
        },
        livelihoodAssistance: {
          status: formData.livelihoodSupported >= formData.livelihoodTarget ? 'Completed' : 'In Progress',
          targetBeneficiaries: formData.livelihoodTarget,
          supportedBeneficiaries: formData.livelihoodSupported,
          details: formData.livelihoodDetails
        },
        employmentAssistance: {
          status: formData.employmentProvided >= formData.employmentTarget ? 'Completed' : 'In Progress',
          targetJobs: formData.employmentTarget,
          providedJobs: formData.employmentProvided,
          details: formData.employmentDetails
        },
        landPlotAssistance: {
          status: formData.plotsAllotted >= formData.plotsDeveloped ? 'Completed' : 'In Progress',
          plotsDeveloped: formData.plotsDeveloped,
          plotsAllotted: formData.plotsAllotted,
          details: 'Demarcated plots with title deeds'
        },
        infrastructureFacilities: initialData?.infrastructureFacilities || [
          { id: 'FAC-01', name: 'Pucca Approach Road & Internal Street Network', category: 'Connectivity', status: 'In Progress', mandatorySchedule3: true, completionPercent: 60 },
          { id: 'FAC-02', name: 'Potable Drinking Water Supply & Storage Sump', category: 'Water & Sanitation', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
          { id: 'FAC-03', name: '24x7 Electric Feeder & Street Lighting', category: 'Power', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
          { id: 'FAC-04', name: 'Primary Health Centre (PHC)', category: 'Health & Education', status: 'In Progress', mandatorySchedule3: true, completionPercent: 75 },
          { id: 'FAC-05', name: 'Primary School & Anganwadi Centre', category: 'Health & Education', status: 'Completed', mandatorySchedule3: true, completionPercent: 100 },
          { id: 'FAC-06', name: 'Panchayat Community Hall', category: 'Community & Culture', status: 'Pending', mandatorySchedule3: true, completionPercent: 0 }
        ],
        otherStatutoryBenefits: formData.otherStatutoryBenefits,
        plannedCompletionDate: formData.plannedCompletionDate,
        status: formData.status,
        remarks: formData.remarks,
        documents: initialData?.documents || []
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              RFCTLARR Second & Third Schedule Framework
            </span>
            <h2 className="text-base font-black text-slate-900">
              {mode === 'add' && 'Formulate Statutory R&R Scheme'}
              {mode === 'edit' && `Edit R&R Scheme: ${initialData?.id}`}
              {mode === 'view' && `R&R Scheme Dossier: ${initialData?.id}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Project & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Project</label>
              <select
                disabled={isReadOnly}
                value={formData.projectId}
                onChange={e => {
                  const p = projects.find(proj => proj.id === e.target.value);
                  setFormData({
                    ...formData,
                    projectId: e.target.value,
                    projectName: p?.name || '',
                    state: p?.state || formData.state,
                    district: p?.district || formData.district
                  });
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">District</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className={`w-full bg-slate-50 border rounded px-2.5 py-1.5 font-medium ${errors.district ? 'border-rose-500' : 'border-slate-300'}`}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Affected Families Count</label>
              <input
                type="number"
                min={1}
                disabled={isReadOnly}
                value={formData.affectedFamiliesCount}
                onChange={e => setFormData({ ...formData, affectedFamiliesCount: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium"
              />
            </div>
          </div>

          {/* Housing Assistance */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-blue-600" />
              Housing Assistance Provision (Schedule II)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Units Planned</label>
                <input
                  type="number"
                  disabled={isReadOnly}
                  value={formData.housingUnitsPlanned}
                  onChange={e => setFormData({ ...formData, housingUnitsPlanned: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Units Constructed</label>
                <input
                  type="number"
                  disabled={isReadOnly}
                  value={formData.housingUnitsConstructed}
                  onChange={e => setFormData({ ...formData, housingUnitsConstructed: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Units Allotted</label>
                <input
                  type="number"
                  disabled={isReadOnly}
                  value={formData.housingUnitsAllotted}
                  onChange={e => setFormData({ ...formData, housingUnitsAllotted: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Housing Details & Colony Location</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.housingDetails}
                onChange={e => setFormData({ ...formData, housingDetails: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1"
              />
            </div>
          </div>

          {/* Livelihood & Employment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                Livelihood Assistance
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Target</label>
                  <input
                    type="number"
                    disabled={isReadOnly}
                    value={formData.livelihoodTarget}
                    onChange={e => setFormData({ ...formData, livelihoodTarget: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Supported</label>
                  <input
                    type="number"
                    disabled={isReadOnly}
                    value={formData.livelihoodSupported}
                    onChange={e => setFormData({ ...formData, livelihoodSupported: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                  />
                </div>
              </div>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.livelihoodDetails}
                onChange={e => setFormData({ ...formData, livelihoodDetails: e.target.value })}
                placeholder="Details of subsistence/DBT"
                className="w-full bg-white border border-slate-300 rounded px-2 py-1"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-purple-600" />
                Employment Assistance
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Target Jobs</label>
                  <input
                    type="number"
                    disabled={isReadOnly}
                    value={formData.employmentTarget}
                    onChange={e => setFormData({ ...formData, employmentTarget: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Provided</label>
                  <input
                    type="number"
                    disabled={isReadOnly}
                    value={formData.employmentProvided}
                    onChange={e => setFormData({ ...formData, employmentProvided: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                  />
                </div>
              </div>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.employmentDetails}
                onChange={e => setFormData({ ...formData, employmentDetails: e.target.value })}
                placeholder="Details of job provisions"
                className="w-full bg-white border border-slate-300 rounded px-2 py-1"
              />
            </div>
          </div>

          {/* Timeline & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Planned Completion Date</label>
              <input
                type="date"
                disabled={isReadOnly}
                value={formData.plannedCompletionDate}
                onChange={e => setFormData({ ...formData, plannedCompletionDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Scheme Implementation Status</label>
              <select
                disabled={isReadOnly}
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
              >
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed (Milestone Lapsed)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Other Statutory Benefits</label>
            <input
              type="text"
              disabled={isReadOnly}
              value={formData.otherStatutoryBenefits}
              onChange={e => setFormData({ ...formData, otherStatutoryBenefits: e.target.value })}
              placeholder="e.g. Shifting grant ₹50k, cattle shed grant ₹25k, stamp duty exemption"
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Remarks & Statutory Approvals</label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={formData.remarks}
              onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Statutory order numbers, gazette reference, or collector observations"
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
            />
          </div>
        </form>

        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-[11px] text-slate-500 font-medium">
            RFCTLARR Act 2013 Statutory Scheme Administration
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : mode === 'add' ? 'Formulate Plan' : 'Update Plan'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
