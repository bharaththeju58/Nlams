import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RRBenefit } from '../../types';
import { RRBenefitModal } from './RRBenefitModal';
import {
  IndianRupee,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Download,
  Trash2,
  Edit2
} from 'lucide-react';

interface RRBenefitsProps {
  selectedProjectId: string;
}

export const RRBenefits: React.FC<RRBenefitsProps> = ({ selectedProjectId }) => {
  const {
    projects,
    families,
    rrBenefits,
    recordRRBenefit,
    approveRRBenefit,
    disburseRRBenefit,
    updateRRBenefit,
    deleteRRBenefit,
    role
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    data: RRBenefit | null;
  }>({
    isOpen: false,
    mode: 'add',
    data: null
  });

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filtered benefits
  const filteredBenefits = useMemo(() => {
    let result = [...rrBenefits];
    if (selectedProjectId !== 'ALL') {
      result = result.filter(b => b.projectId === selectedProjectId);
    }
    if (statusFilter !== 'ALL') {
      result = result.filter(b => b.status === statusFilter);
    }
    if (typeFilter !== 'ALL') {
      result = result.filter(b => b.benefitType === typeFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(b =>
        b.beneficiaryName.toLowerCase().includes(q) ||
        b.familyId.toLowerCase().includes(q) ||
        b.benefitType.toLowerCase().includes(q) ||
        (b.pfmsTransactionId && b.pfmsTransactionId.toLowerCase().includes(q))
      );
    }
    return result;
  }, [rrBenefits, selectedProjectId, statusFilter, typeFilter, searchTerm]);

  // Aggregate stats
  const totals = useMemo(() => {
    const totalCount = filteredBenefits.length;
    const approvedCount = filteredBenefits.filter(b => b.approved).length;
    const disbursedCount = filteredBenefits.filter(b => b.disbursed).length;
    const delayedCount = filteredBenefits.filter(b => b.status === 'Delayed').length;

    const totalEligible = filteredBenefits.reduce((sum, b) => sum + (b.eligibleAmount || 0), 0);
    const totalDisbursed = filteredBenefits.reduce((sum, b) => sum + (b.disbursedAmount || 0), 0);

    return { totalCount, approvedCount, disbursedCount, delayedCount, totalEligible, totalDisbursed };
  }, [filteredBenefits]);

  const handleSaveBenefit = async (payload: any) => {
    if (modalState.mode === 'add') {
      await recordRRBenefit(payload);
    } else if (modalState.mode === 'edit' && modalState.data) {
      await updateRRBenefit(modalState.data.id, payload);
    }
    setModalState({ isOpen: false, mode: 'add', data: null });
  };

  const handleExportCSV = () => {
    const headers = [
      'Benefit ID',
      'Family ID',
      'Beneficiary Name',
      'Project ID',
      'Benefit Type',
      'Eligible Amount (₹)',
      'Approved Amount (₹)',
      'Disbursed Amount (₹)',
      'Status',
      'PFMS Ref',
      'Date'
    ];
    const rows = filteredBenefits.map(b => [
      b.id,
      b.familyId,
      b.beneficiaryName,
      b.projectId,
      b.benefitType,
      b.eligibleAmount,
      b.approvedAmount || 0,
      b.disbursedAmount || 0,
      b.status,
      b.pfmsTransactionId || '—',
      b.date
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NLAMS_RR_Statutory_Benefits_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4" id="rr-benefits-section">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Entitlements</span>
          <div className="text-xl font-black text-slate-900 mt-1">₹{(totals.totalEligible / 100000).toFixed(2)} Lakhs</div>
          <span className="text-[10px] text-slate-500 font-medium">{totals.totalCount} packages registered</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">Total Disbursed (DBT)</span>
          <div className="text-xl font-black text-teal-800 mt-1">₹{(totals.totalDisbursed / 100000).toFixed(2)} Lakhs</div>
          <span className="text-[10px] text-teal-600 font-bold">{totals.disbursedCount} disbursements completed</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Approved / In Pipeline</span>
          <div className="text-xl font-black text-blue-800 mt-1">{totals.approvedCount}</div>
          <span className="text-[10px] text-blue-600 font-medium">Ready for PFMS batch payout</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Delayed Packages</span>
          <div className="text-xl font-black text-rose-800 mt-1">{totals.delayedCount}</div>
          <span className="text-[10px] text-rose-600 font-medium">Statutory payment backlog</span>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search beneficiary, family, PFMS ID..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:outline-blue-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Disbursed">Disbursed (DBT)</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium"
          >
            <option value="ALL">All Benefit Types</option>
            <option value="Subsistence Allowance">Subsistence Allowance</option>
            <option value="Shifting Grant">Shifting Grant</option>
            <option value="Resettlement Allowance">Resettlement Allowance</option>
            <option value="Housing Assistance">Housing Assistance</option>
            <option value="Employment / Annuity Grant">Employment / Annuity Grant</option>
            <option value="Cattle Shed / Petty Shop Grant">Cattle Shed / Petty Shop Grant</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            id="btn-record-rr-benefit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record New Benefit</span>
          </button>
        </div>
      </div>

      {/* Benefits Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Benefit ID</th>
                <th className="py-3 px-4">Beneficiary Family</th>
                <th className="py-3 px-4">Statutory Entitlement Type</th>
                <th className="py-3 px-4">Eligible Amount</th>
                <th className="py-3 px-4">Disbursed (DBT)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">PFMS Reference</th>
                <th className="py-3 px-4 text-right">Statutory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBenefits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                    No statutory benefit packages found. Click &quot;Record New Benefit&quot; to assign one.
                  </td>
                </tr>
              ) : (
                filteredBenefits.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {b.id}
                      <span className="block text-[10px] font-sans font-medium text-slate-400">
                        {b.projectId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {b.beneficiaryName}
                      <span className="block text-[10px] font-mono font-medium text-slate-500">
                        {b.familyId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {b.benefitType}
                      <span className="block text-[10px] text-slate-400">
                        {b.eligibleAmountDisplay}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ₹{b.eligibleAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">
                      {b.disbursed ? `₹${b.disbursedAmount.toLocaleString('en-IN')}` : '₹0'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'Disbursed' || b.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'Approved'
                            ? 'bg-blue-100 text-blue-800'
                            : b.status === 'Delayed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {b.pfmsTransactionId || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!b.approved && (
                          <button
                            onClick={() => approveRRBenefit(b.id, b.eligibleAmount)}
                            title="Approve Benefit Package"
                            className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {b.approved && !b.disbursed && (
                          <button
                            onClick={() => disburseRRBenefit(b.id, b.approvedAmount || b.eligibleAmount)}
                            title="Disburse DBT via PFMS"
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>Disburse DBT</span>
                          </button>
                        )}
                        <button
                          onClick={() => setModalState({ isOpen: true, mode: 'edit', data: b })}
                          title="Edit Record"
                          className="p-1 text-slate-400 hover:text-amber-600 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(b.id)}
                          title="Delete Record"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <RRBenefitModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.data}
        families={families}
        projects={projects}
        onClose={() => setModalState({ isOpen: false, mode: 'add', data: null })}
        onSave={handleSaveBenefit}
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
                <h3 className="text-sm font-bold text-slate-900">Delete Benefit Entry</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to remove statutory benefit entry <strong>{deleteTargetId}</strong>?
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
                onClick={async () => {
                  await deleteRRBenefit(deleteTargetId);
                  setDeleteTargetId(null);
                }}
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
