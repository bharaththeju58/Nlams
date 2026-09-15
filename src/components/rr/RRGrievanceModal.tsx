import React, { useState } from 'react';
import { RRGrievance, AffectedFamily, Project } from '../../types';
import { X, Save, MessageSquareWarning, ShieldAlert } from 'lucide-react';

interface RRGrievanceModalProps {
  isOpen: boolean;
  mode: 'add' | 'resolve' | 'view';
  initialData?: RRGrievance | null;
  families: AffectedFamily[];
  projects: Project[];
  onClose: () => void;
  onSave: (grievanceData: any) => Promise<void>;
}

export const RRGrievanceModal: React.FC<RRGrievanceModalProps> = ({
  isOpen,
  mode,
  initialData,
  families,
  projects,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    familyId: families[0]?.id || '',
    complainantName: families[0]?.headOfFamily || families[0]?.name || '',
    projectId: projects[0]?.id || 'PRJ-2025-0101',
    category: 'Housing Allotment' as RRGrievance['category'],
    subject: '',
    description: '',
    status: 'Open' as RRGrievance['status'],
    resolutionNotes: '',
    hearingDate: ''
  });

  React.useEffect(() => {
    if (initialData && (mode === 'resolve' || mode === 'view')) {
      setFormData({
        familyId: initialData.familyId,
        complainantName: initialData.complainantName,
        projectId: initialData.projectId,
        category: initialData.category,
        subject: initialData.subject,
        description: initialData.description,
        status: initialData.status,
        resolutionNotes: initialData.resolutionNotes || '',
        hearingDate: initialData.hearingDate || ''
      });
    } else {
      const fam = families[0];
      setFormData({
        familyId: fam?.id || '',
        complainantName: fam?.headOfFamily || fam?.name || '',
        projectId: fam?.projectId || projects[0]?.id || 'PRJ-2025-0101',
        category: 'Housing Allotment',
        subject: '',
        description: '',
        status: 'Open',
        resolutionNotes: '',
        hearingDate: ''
      });
    }
  }, [initialData, mode, families, projects]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700">
              Statutory Grievance Redressal Mechanism • Section 51
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {mode === 'add' && 'File New R&R Grievance'}
              {mode === 'resolve' && `Adjudicate Grievance: ${initialData?.id}`}
              {mode === 'view' && `Grievance Record: ${initialData?.id}`}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {mode === 'add' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Complainant Family</label>
              <select
                value={formData.familyId}
                onChange={e => {
                  const fam = families.find(f => f.id === e.target.value);
                  setFormData({
                    ...formData,
                    familyId: e.target.value,
                    complainantName: fam?.headOfFamily || fam?.name || '',
                    projectId: fam?.projectId || formData.projectId
                  });
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800"
              >
                {families.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.id} — {f.headOfFamily || f.name} ({f.village})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Grievance Category</label>
            <select
              disabled={isReadOnly || mode === 'resolve'}
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium"
            >
              <option value="Housing Allotment">Housing Allotment / Quality Defect</option>
              <option value="Compensation Amount">Compensation / Grant Discrepancy</option>
              <option value="Delayed Disbursement">Delayed Disbursement (PFMS / DBT)</option>
              <option value="Civic Amenities">Civic Amenities / Infrastructure Gap</option>
              <option value="Eligibility Rejection">Eligibility Rejection Appeal</option>
              <option value="Other">Other Statutory Dispute</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Subject / Summary</label>
            <input
              type="text"
              disabled={isReadOnly || mode === 'resolve'}
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Subsistence allowance installment #2 delayed"
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description / Grounds of Appeal</label>
            <textarea
              rows={3}
              disabled={isReadOnly || mode === 'resolve'}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Specific details of the grievance..."
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
            />
          </div>

          {(mode === 'resolve' || mode === 'view') && (
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Adjudication Status</label>
                  <select
                    disabled={isReadOnly}
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-800"
                  >
                    <option value="Open">Open</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Hearing Scheduled">Hearing Scheduled</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hearing Date</label>
                  <input
                    type="date"
                    disabled={isReadOnly}
                    value={formData.hearingDate}
                    onChange={e => setFormData({ ...formData, hearingDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Resolution Order Notes</label>
                <textarea
                  rows={2}
                  disabled={isReadOnly}
                  value={formData.resolutionNotes}
                  onChange={e => setFormData({ ...formData, resolutionNotes: e.target.value })}
                  placeholder="Record magistrate / officer order and instructions to project authority..."
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{mode === 'add' ? 'File Grievance' : 'Update Resolution'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
