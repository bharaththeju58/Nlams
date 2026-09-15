import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RRGrievance } from '../../types';
import { RRGrievanceModal } from './RRGrievanceModal';
import {
  MessageSquareWarning,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Gavel,
  Calendar
} from 'lucide-react';

interface RRGrievancesProps {
  selectedProjectId: string;
}

export const RRGrievances: React.FC<RRGrievancesProps> = ({ selectedProjectId }) => {
  const {
    projects,
    families,
    rrGrievances,
    submitRRGrievance,
    updateRRGrievanceStatus,
    role
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'resolve' | 'view';
    data: RRGrievance | null;
  }>({
    isOpen: false,
    mode: 'add',
    data: null
  });

  const filteredGrievances = useMemo(() => {
    let result = [...rrGrievances];
    if (selectedProjectId !== 'ALL') {
      result = result.filter(g => g.projectId === selectedProjectId);
    }
    if (statusFilter !== 'ALL') {
      result = result.filter(g => g.status === statusFilter);
    }
    if (categoryFilter !== 'ALL') {
      result = result.filter(g => g.category === categoryFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(g =>
        g.complainantName.toLowerCase().includes(q) ||
        g.subject.toLowerCase().includes(q) ||
        g.familyId.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rrGrievances, selectedProjectId, statusFilter, categoryFilter, searchTerm]);

  // Check overdue (> 15 days from submission)
  const isGrievanceOverdue = (g: RRGrievance) => {
    if (g.status === 'Resolved' || g.status === 'Closed') return false;
    const filingDate = new Date(g.dateFiled).getTime();
    const now = Date.now();
    const diffDays = (now - filingDate) / (1000 * 3600 * 24);
    return diffDays > 15;
  };

  const overdueCount = useMemo(() => {
    return filteredGrievances.filter(isGrievanceOverdue).length;
  }, [filteredGrievances]);

  const handleSaveGrievance = async (formData: any) => {
    if (modalState.mode === 'add') {
      await submitRRGrievance(formData);
    } else if (modalState.mode === 'resolve' && modalState.data) {
      await updateRRGrievanceStatus(
        modalState.data.id,
        formData.status,
        formData.resolutionNotes,
        formData.hearingDate
      );
    }
    setModalState({ isOpen: false, mode: 'add', data: null });
  };

  const handleExportCSV = () => {
    const headers = [
      'Grievance ID',
      'Family ID',
      'Complainant Name',
      'Project ID',
      'Category',
      'Subject',
      'Date Filed',
      'Status',
      'Overdue',
      'Resolution Notes'
    ];
    const rows = filteredGrievances.map(g => [
      g.id,
      g.familyId,
      g.complainantName,
      g.projectId,
      g.category,
      `"${g.subject.replace(/"/g, '""')}"`,
      g.dateFiled,
      g.status,
      isGrievanceOverdue(g) ? 'YES' : 'NO',
      `"${(g.resolutionNotes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NLAMS_RR_Grievances_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4" id="rr-grievances-section">
      {/* Overdue alert banner */}
      {overdueCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-900 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>{overdueCount} Grievance(s) Overdue:</strong> Statutory citizen charter mandates resolution or hearing listing within 15 days of filing under Section 51.
            </span>
          </div>
          <span className="font-bold uppercase tracking-wider text-[10px] bg-rose-200/80 px-2 py-0.5 rounded text-rose-800 shrink-0">
            Escalation Flagged
          </span>
        </div>
      )}

      {/* Action & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search complainant, subject, ID..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:outline-blue-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="Hearing Scheduled">Hearing Scheduled</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="Housing Allotment">Housing Allotment</option>
            <option value="Compensation Amount">Compensation Amount</option>
            <option value="Delayed Disbursement">Delayed Disbursement</option>
            <option value="Civic Amenities">Civic Amenities</option>
            <option value="Eligibility Rejection">Eligibility Rejection</option>
            <option value="Other">Other</option>
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
            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            id="btn-file-rr-grievance"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>File Grievance</span>
          </button>
        </div>
      </div>

      {/* Grievances List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Grievance ID</th>
                <th className="py-3 px-4">Complainant</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Date Filed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Adjudication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrievances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No statutory grievances registered matching current filters.
                  </td>
                </tr>
              ) : (
                filteredGrievances.map(g => {
                  const overdue = isGrievanceOverdue(g);
                  return (
                    <tr key={g.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {g.id}
                        {overdue && (
                          <span className="block text-[9px] font-bold text-rose-600 uppercase tracking-wider">
                            Overdue (&gt;15 days)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {g.complainantName}
                        <span className="block text-[10px] font-mono font-medium text-slate-400">
                          {g.familyId}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {g.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium max-w-xs truncate">
                        {g.subject}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {g.dateFiled}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            g.status === 'Resolved' || g.status === 'Closed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : g.status === 'Hearing Scheduled'
                              ? 'bg-purple-100 text-purple-800'
                              : g.status === 'Under Review'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {g.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setModalState({ isOpen: true, mode: 'view', data: g })}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setModalState({ isOpen: true, mode: 'resolve', data: g })}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                            title="Adjudicate / Hearing"
                          >
                            <Gavel className="w-3 h-3 text-slate-600" />
                            <span>Adjudicate</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <RRGrievanceModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.data}
        families={families}
        projects={projects}
        onClose={() => setModalState({ isOpen: false, mode: 'add', data: null })}
        onSave={handleSaveGrievance}
      />
    </div>
  );
};
