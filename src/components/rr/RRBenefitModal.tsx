import React, { useState, useEffect } from 'react';
import { RRBenefit, AffectedFamily, Project } from '../../types';
import { X, Save, IndianRupee, ShieldCheck } from 'lucide-react';

interface RRBenefitModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: RRBenefit | null;
  families: AffectedFamily[];
  projects: Project[];
  onClose: () => void;
  onSave: (benefitData: any) => Promise<void>;
}

export const RRBenefitModal: React.FC<RRBenefitModalProps> = ({
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
    beneficiaryName: families[0]?.headOfFamily || families[0]?.name || '',
    projectId: projects[0]?.id || 'PRJ-2025-0101',
    benefitType: 'Subsistence Allowance' as RRBenefit['benefitType'],
    eligibleAmount: 36000,
    eligibleAmountDisplay: '₹3,000 / month for 12 months',
    approved: false,
    approvedAmount: 36000,
    status: 'Pending' as RRBenefit['status'],
    remarks: ''
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        familyId: initialData.familyId,
        beneficiaryName: initialData.beneficiaryName,
        projectId: initialData.projectId,
        benefitType: initialData.benefitType,
        eligibleAmount: initialData.eligibleAmount,
        eligibleAmountDisplay: initialData.eligibleAmountDisplay,
        approved: initialData.approved,
        approvedAmount: initialData.approvedAmount || initialData.eligibleAmount,
        status: initialData.status,
        remarks: initialData.remarks || ''
      });
    } else {
      const fam = families[0];
      setFormData({
        familyId: fam?.id || '',
        beneficiaryName: fam?.headOfFamily || fam?.name || '',
        projectId: fam?.projectId || projects[0]?.id || 'PRJ-2025-0101',
        benefitType: 'Subsistence Allowance',
        eligibleAmount: 36000,
        eligibleAmountDisplay: '₹3,000 / month for 12 months',
        approved: false,
        approvedAmount: 36000,
        status: 'Pending',
        remarks: 'RFCTLARR Second Schedule mandate'
      });
    }
  }, [initialData, mode, families, projects]);

  if (!isOpen) return null;

  const handleBenefitTypeChange = (type: RRBenefit['benefitType']) => {
    let amount = 36000;
    let display = '₹3,000 / month for 12 months';
    if (type === 'Shifting Grant') {
      amount = 50000;
      display = 'One-time Shifting Allowance ₹50,000';
    } else if (type === 'Cattle Shed / Petty Shop Grant') {
      amount = 25000;
      display = 'One-time Assistance ₹25,000';
    } else if (type === 'Resettlement Allowance') {
      amount = 500000;
      display = 'One-time Resettlement Grant ₹5,00,000';
    } else if (type === 'Housing Assistance') {
      amount = 150000;
      display = 'Financial Grant ₹1,50,000 in lieu of housing unit';
    } else if (type === 'Employment / Annuity Grant') {
      amount = 500000;
      display = 'Lump-sum ₹5,00,000 or ₹2,000/mo for 20 years';
    } else if (type === 'One-time Grant for SC/ST') {
      amount = 50000;
      display = 'Special SC/ST Grant ₹50,000';
    }

    setFormData({
      ...formData,
      benefitType: type,
      eligibleAmount: amount,
      approvedAmount: amount,
      eligibleAmountDisplay: display
    });
  };

  const handleFamilySelect = (famId: string) => {
    const fam = families.find(f => f.id === famId);
    setFormData({
      ...formData,
      familyId: famId,
      beneficiaryName: fam?.headOfFamily || fam?.name || '',
      projectId: fam?.projectId || formData.projectId
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...formData,
      date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
              Statutory DBT & Entitlement Workflow
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {mode === 'add' ? 'Record Statutory R&R Benefit' : 'Edit Benefit Record'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Beneficiary Family</label>
            <select
              value={formData.familyId}
              onChange={e => handleFamilySelect(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800"
            >
              {families.map(f => (
                <option key={f.id} value={f.id}>
                  {f.id} — {f.headOfFamily || f.name} ({f.village})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Statutory Benefit Type</label>
            <select
              value={formData.benefitType}
              onChange={e => handleBenefitTypeChange(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800"
            >
              <option value="Housing Assistance">Housing Assistance (Unit / Cash Grant)</option>
              <option value="Subsistence Allowance">Subsistence Allowance (₹3,000/mo for 12 mos)</option>
              <option value="Shifting Grant">Shifting Grant (₹50,000 one-time)</option>
              <option value="Resettlement Allowance">Resettlement Allowance (₹5,00,000 lump sum)</option>
              <option value="Employment / Annuity Grant">Employment / Annuity Grant</option>
              <option value="Cattle Shed / Petty Shop Grant">Cattle Shed / Petty Shop Grant (₹25,000)</option>
              <option value="One-time Grant for SC/ST">One-time Grant for SC/ST (₹50,000 additional)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Eligible Amount (₹)</label>
              <input
                type="number"
                value={formData.eligibleAmount}
                onChange={e => setFormData({ ...formData, eligibleAmount: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Disbursed">Disbursed (DBT)</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Remarks / PFMS Reference</label>
            <input
              type="text"
              value={formData.remarks}
              onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="e.g. Approved under District Collector sanction order #104"
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Benefit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
