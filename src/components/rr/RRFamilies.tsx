import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AffectedFamily } from '../../types';
import { RRFamilyModal } from './RRFamilyModal';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Phone,
  Home,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface RRFamiliesProps {
  selectedProjectId: string;
}

export const RRFamilies: React.FC<RRFamiliesProps> = ({ selectedProjectId }) => {
  const {
    projects,
    families,
    addAffectedFamily,
    updateAffectedFamily,
    deleteAffectedFamily,
    role
  } = useApp();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [displacementFilter, setDisplacementFilter] = useState('ALL');
  const [eligibilityFilter, setEligibilityFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal states
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit' | 'view';
    data: AffectedFamily | null;
  }>({
    isOpen: false,
    mode: 'add',
    data: null
  });

  // Delete confirmation
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filtered dataset
  const filteredList = useMemo(() => {
    let result = [...families];

    // Project filter
    if (selectedProjectId !== 'ALL') {
      result = result.filter(f => f.projectId === selectedProjectId);
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(f => f.currentStatus === statusFilter);
    }

    // Displacement filter
    if (displacementFilter !== 'ALL') {
      result = result.filter(f => f.displacementStatus === displacementFilter);
    }

    // Eligibility filter
    if (eligibilityFilter !== 'ALL') {
      result = result.filter(f => f.rrEligibility === eligibilityFilter);
    }

    // Text search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(f =>
        (f.headOfFamily && f.headOfFamily.toLowerCase().includes(q)) ||
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.id && f.id.toLowerCase().includes(q)) ||
        (f.village && f.village.toLowerCase().includes(q)) ||
        (f.district && f.district.toLowerCase().includes(q)) ||
        (f.contact && f.contact.includes(q))
      );
    }

    return result;
  }, [families, selectedProjectId, statusFilter, displacementFilter, eligibilityFilter, searchTerm]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Family ID',
      'Project ID',
      'State',
      'District',
      'Village',
      'Head of Family',
      'Members Count',
      'Land Acquired (Acres)',
      'Displacement Status',
      'Eligibility',
      'Contact',
      'Current Status'
    ];
    const rows = filteredList.map(f => [
      f.id,
      f.projectId,
      f.state,
      f.district,
      f.village,
      f.headOfFamily || f.name,
      f.familyMembersCount,
      f.landAcquiredAcres,
      f.displacementStatus,
      f.rrEligibility,
      f.contact,
      f.currentStatus
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NLAMS_RR_Affected_Families_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveFamily = async (payload: any) => {
    if (modalState.mode === 'add') {
      await addAffectedFamily(payload);
    } else if (modalState.mode === 'edit' && modalState.data) {
      await updateAffectedFamily(modalState.data.id, payload);
    }
    setModalState({ isOpen: false, mode: 'add', data: null });
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      await deleteAffectedFamily(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-4" id="rr-families-section">
      {/* Action & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, ID, village..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:outline-blue-600"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="Surveyed">Surveyed</option>
            <option value="Eligibility Verified">Eligibility Verified</option>
            <option value="Plan Formulated">Plan Formulated</option>
            <option value="Benefits In Progress">Benefits In Progress</option>
            <option value="Benefits Delivered">Benefits Delivered</option>
            <option value="Resettled">Resettled</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Displacement Filter */}
          <select
            value={displacementFilter}
            onChange={e => {
              setDisplacementFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600"
          >
            <option value="ALL">All Displacements</option>
            <option value="Physically Displaced">Physically Displaced</option>
            <option value="Economically Displaced">Economically Displaced</option>
            <option value="Both">Both (Physical & Economic)</option>
          </select>

          {/* Eligibility Filter */}
          <select
            value={eligibilityFilter}
            onChange={e => {
              setEligibilityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600"
          >
            <option value="ALL">All Eligibility</option>
            <option value="Eligible">Eligible</option>
            <option value="Under Review">Under Review</option>
            <option value="Ineligible">Ineligible</option>
          </select>
        </div>

        {/* Buttons */}
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
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            id="btn-add-affected-family"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Affected Family</span>
          </button>
        </div>
      </div>

      {/* Families Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Family ID</th>
                <th className="py-3 px-4">Head of Family</th>
                <th className="py-3 px-4">Geography</th>
                <th className="py-3 px-4">Members</th>
                <th className="py-3 px-4">Land Acquired</th>
                <th className="py-3 px-4">Displacement</th>
                <th className="py-3 px-4">Eligibility</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                    No affected families found matching the current search & filters.
                  </td>
                </tr>
              ) : (
                paginatedList.map(fam => (
                  <tr key={fam.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {fam.id}
                      <span className="block text-[10px] font-sans font-medium text-slate-400">
                        {fam.projectId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {fam.headOfFamily || fam.name}
                      <span className="block text-[10px] font-medium text-slate-500">
                        {fam.contact}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {fam.village}
                      <span className="block text-[10px] text-slate-400">
                        {fam.district}, {fam.state}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {fam.familyMembersCount} persons
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {fam.landAcquiredAcres > 0 ? `${fam.landAcquiredAcres.toFixed(2)} Ac.` : fam.landAcquired || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          fam.displacementStatus === 'Physically Displaced'
                            ? 'bg-purple-100 text-purple-800'
                            : fam.displacementStatus === 'Economically Displaced'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {fam.displacementStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          fam.rrEligibility === 'Eligible'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fam.rrEligibility === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {fam.rrEligibility}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          fam.currentStatus === 'Resettled' || fam.currentStatus === 'Closed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fam.currentStatus === 'Benefits Delivered'
                            ? 'bg-teal-100 text-teal-800'
                            : fam.currentStatus === 'Benefits In Progress' || fam.currentStatus === 'Plan Formulated'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {fam.currentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setModalState({ isOpen: true, mode: 'view', data: fam })}
                          title="View Details"
                          className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setModalState({ isOpen: true, mode: 'edit', data: fam })}
                          title="Edit Family"
                          className="p-1 text-slate-500 hover:text-amber-600 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(fam.id)}
                          title="Delete Family"
                          className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-800">{filteredList.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-slate-800">
              {Math.min(currentPage * itemsPerPage, filteredList.length)}
            </strong> of <strong className="text-slate-800">{filteredList.length}</strong> families
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-bold transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-1 font-bold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-bold transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CRUD Modal */}
      <RRFamilyModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.data}
        projects={projects}
        onClose={() => setModalState({ isOpen: false, mode: 'add', data: null })}
        onSave={handleSaveFamily}
      />

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Family Record</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to remove family record <strong>{deleteTargetId}</strong> from the R&R register? This action is logged to the statutory audit trail.
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
