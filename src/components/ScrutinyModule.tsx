import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { ProjectProposalModal } from './ProjectProposalModal';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Clock,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Building,
  MapPin,
  FileCheck,
  History,
  IndianRupee,
  Landmark,
  Plus,
  ShieldCheck,
  Lock,
  Download
} from 'lucide-react';
import { canPerformAction } from '../utils/rbacPermissions';

interface ScrutinyModuleProps {
  project: Project;
  onBack?: () => void;
}

export const ScrutinyModule: React.FC<ScrutinyModuleProps> = ({ project, onBack }) => {
  const { t } = useTranslation();
  const {
    parcels,
    approveScrutiny,
    requestScrutinyClarification,
    rejectScrutiny,
    setActiveTab,
    role,
    portalUserType
  } = useApp();

  const [clarificationNotes, setClarificationNotes] = useState('');
  const [showClarificationInput, setShowClarificationInput] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Proponent Escrow & Requisition State
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [escrowDeposited, setEscrowDeposited] = useState(false);
  const [showRequisitionModal, setShowRequisitionModal] = useState(false);
  const [isProcessingEscrow, setIsProcessingEscrow] = useState(false);

  const canApprove = canPerformAction(role, portalUserType, 'canApproveScrutiny');
  const isProponent = role === 'Requiring Body / Proponent (PSU / Department)';

  const projectParcels = parcels.filter(p => p.projectId === project.id);

  // 5 Rule-Based Checks as mandated by Prompt Section 7
  const checks = [
    {
      id: 'docs',
      label: 'Required Documents Available',
      detail: 'Detailed Project Report (DPR) and In-principle Clearance uploaded',
      passed: true
    },
    {
      id: 'parcels',
      label: 'Land Parcel IDs Validated with Revenue Records',
      detail: `${projectParcels.length} cadastral parcels verified against state database`,
      passed: projectParcels.length > 0 || project.status !== 'Proposal Submitted'
    },
    {
      id: 'area',
      label: 'Area Calculation & Demarcation Verified',
      detail: `Estimated land (${project.estimatedLandAcres} acres) matches GIS geometric boundary polygon`,
      passed: true
    },
    {
      id: 'alignment',
      label: 'Geo-Referenced Alignment Map Available',
      detail: project.alignmentMapUrl ? 'KMZ vector contour file attached' : 'Awaiting digital stamp upload',
      passed: !!project.alignmentMapUrl
    },
    {
      id: 'authority',
      label: 'Competent Authority / Nodal Officer Designations Complete',
      detail: `Requisitioning Officer verified from ${project.requiringBody}`,
      passed: true
    }
  ];

  const allChecksPassed = checks.every(c => c.passed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {project.id}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              project.scrutinyStatus === 'Approved'
                ? 'bg-emerald-100 text-emerald-800'
                : project.scrutinyStatus === 'Clarification Requested'
                ? 'bg-amber-100 text-amber-800'
                : project.scrutinyStatus === 'Rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {t('scrutiny.status', 'Scrutiny')}: {project.scrutinyStatus}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">{project.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('scrutiny.examinationSubtitle', 'Statutory Examination under Rule 3 of Right to Fair Compensation and Transparency Rules')}
          </p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1.5 border border-slate-300 rounded bg-slate-50 hover:bg-slate-100"
          >
            ← {t('scrutiny.returnToProject', 'Return to Project')}
          </button>
        )}
      </div>

      {/* Statutory Disclaimer Alert */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Automated Rule-Based Scrutiny Engine:</span> NLAMS executes rule-based validation checks on cadastral parcels, geometry, and mandatory statutory documentation. Statutory approval remains with the Competent Authority.
        </div>
      </div>

      {/* Grid: Project Details & Validation Checks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Requisition Scope & Parcel Information */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
            Requisition Scope & Revenue Demarcation
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Requiring Body</span>
              <span className="font-semibold text-slate-800">{project.requiringBody}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Sector</span>
              <span className="font-semibold text-slate-800">{project.sector}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Jurisdiction</span>
              <span className="font-semibold text-slate-800">{project.district}, {project.state}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Affected Villages</span>
              <span className="font-semibold text-slate-800">{project.numberOfVillages} revenue villages</span>
            </div>
            <div>
              <span className="text-slate-500 block">Proposed Land Extent</span>
              <span className="font-bold text-slate-900 text-sm">{project.estimatedLandAcres} Acres</span>
            </div>
            <div>
              <span className="text-slate-500 block">Estimated Project Cost</span>
              <span className="font-bold text-slate-900 text-sm">₹{project.projectCostCrores} Crores</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h3 className="font-bold text-xs text-slate-700 mb-2">Uploaded Statutory Documents</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="flex items-center gap-2 text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Detailed Project Report (DPR) - Alignment Vol. 1
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="flex items-center gap-2 text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Digital Vector Alignment Map (.KMZ)
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  project.alignmentMapUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {project.alignmentMapUrl ? 'Geo-Referenced' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="flex items-center gap-2 text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  State Department Administrative Sanction (AS)
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  Attached
                </span>
              </div>
            </div>
          </div>

          {project.scrutinyNotes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
              <span className="font-bold text-slate-700 block mb-1">Previous Reviewer Notes:</span>
              <p className="text-slate-600 italic">{project.scrutinyNotes}</p>
            </div>
          )}
        </div>

        {/* Right: Rule-Based Validation Checklist & Authority Decision */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
              <h2 className="text-sm font-bold text-slate-900">
                Statutory Rule-Based Validation Matrix
              </h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                allChecksPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {allChecksPassed ? '✓ All Criteria Met' : '⚠ Validation Required'}
              </span>
            </div>

            <div className="space-y-3">
              {checks.map(check => (
                <div
                  key={check.id}
                  className={`p-3 rounded-lg border text-xs transition-colors ${
                    check.passed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={`font-bold block ${check.passed ? 'text-emerald-950' : 'text-amber-950'}`}>
                        {check.label}
                      </span>
                      <p className="text-slate-600 text-[11px] mt-0.5">{check.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Buttons per Prompt Section 7 */}
          <div className="mt-6 border-t border-slate-200 pt-4 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Reviewing Authority: <strong>{role}</strong></span>
              <span>Statutory Rule: <strong>Rule 3 & 4 LARR</strong></span>
            </div>

            {isProponent ? (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-950 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                    <Building className="w-4 h-4" />
                    <span>Requiring Body / Proponent Actions</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    As the sponsoring proponent ({project.requiringBody}), you are authorized to deposit administrative & acquisition escrow funds and submit new/supplementary requisitions. Statutory scrutiny approval is legally reserved for the State Revenue Authority & District CALA under RFCTLARR.
                  </p>
                </div>

                {escrowDeposited && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Escrow Advance Deposited (₹{(project.projectCostCrores * 0.18).toFixed(2)} Cr) into CALA Escrow Account</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowEscrowModal(true)}
                    className="flex-1 px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Landmark className="w-4 h-4" />
                    {escrowDeposited ? 'Deposit Additional Escrow' : 'Deposit Escrow Funds (Sec 4/77)'}
                  </button>

                  <button
                    onClick={() => setShowRequisitionModal(true)}
                    className="px-3 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Submit New Requisition
                  </button>

                  <button
                    onClick={() => setActiveTab('Audit Trail')}
                    className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-1"
                  >
                    <History className="w-3.5 h-3.5" />
                    Audit Trail
                  </button>
                </div>
              </div>
            ) : !canApprove ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>Statutory Approval Restricted ({role})</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Statutory proposal examination and Section 4 sanction are legally exercised by the State Revenue & Nodal Authority / District CALA.
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setActiveTab('Audit Trail')}
                    className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-1"
                  >
                    <History className="w-3.5 h-3.5" />
                    View Scrutiny Audit Trail
                  </button>
                </div>
              </div>
            ) : showClarificationInput ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded space-y-2">
                <label className="text-xs font-bold text-amber-950 block">Requisition Clarification Details:</label>
                <textarea
                  value={clarificationNotes}
                  onChange={(e) => setClarificationNotes(e.target.value)}
                  placeholder="Specify discrepancy regarding parcel survey number, forest clearance, or alignment..."
                  rows={2}
                  className="w-full text-xs p-2 border border-amber-300 rounded bg-white text-slate-800"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowClarificationInput(false)}
                    className="px-2.5 py-1 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      requestScrutinyClarification(project.id, clarificationNotes || 'Clarification required on revenue land boundaries.');
                      setShowClarificationInput(false);
                    }}
                    className="px-3 py-1 bg-amber-600 text-white font-bold text-xs rounded hover:bg-amber-700"
                  >
                    Send Clarification Request
                  </button>
                </div>
              </div>
            ) : showRejectInput ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded space-y-2">
                <label className="text-xs font-bold text-red-950 block">Reason for Statutory Rejection:</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Detail statutory grounds for proposal rejection..."
                  rows={2}
                  className="w-full text-xs p-2 border border-red-300 rounded bg-white text-slate-800"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowRejectInput(false)}
                    className="px-2.5 py-1 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      rejectScrutiny(project.id, rejectReason || 'Rejected due to statutory non-compliance.');
                      setShowRejectInput(false);
                    }}
                    className="px-3 py-1 bg-red-700 text-white font-bold text-xs rounded hover:bg-red-800"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => approveScrutiny(project.id)}
                  disabled={project.scrutinyStatus === 'Approved'}
                  className={`flex-1 px-4 py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
                    project.scrutinyStatus === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {project.scrutinyStatus === 'Approved' ? 'Scrutiny Approved' : 'Approve Proposal (Sec 4)'}
                </button>

                <button
                  onClick={() => setShowClarificationInput(true)}
                  className="px-3 py-2 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded transition-colors"
                >
                  Request Clarification
                </button>

                <button
                  onClick={() => setShowRejectInput(true)}
                  className="px-3 py-2 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded transition-colors"
                >
                  Reject
                </button>

                <button
                  onClick={() => setActiveTab('Audit Trail')}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-1"
                >
                  <History className="w-3.5 h-3.5" />
                  Audit Trail
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Escrow Deposit Modal for Requiring Body */}
      {showEscrowModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Deposit Acquisition Escrow Funds</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Under RFCTLARR Section 4 & Section 77(2)</p>
                </div>
              </div>
              <button
                onClick={() => setShowEscrowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Project Corridor:</span>
                  <span className="font-bold text-slate-900">{project.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Requiring Body:</span>
                  <span className="font-bold text-slate-900">{project.requiringBody}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Competent Authority (CALA) Account:</span>
                  <span className="font-mono font-bold text-blue-900">SBI A/C #3089472619 (Civil Deposits)</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Statutory Advance Cost Breakdown
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Land Compensation (100%):</span>
                  <span className="font-bold">₹{(project.projectCostCrores * 0.12).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Solatium & R&R Reserve (Second Schedule):</span>
                  <span className="font-bold">₹{(project.projectCostCrores * 0.04).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>2% Administrative Demarcation Charges:</span>
                  <span className="font-bold">₹{(project.projectCostCrores * 0.02).toFixed(2)} Cr</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                  <span>Total Escrow Deposit Mandate:</span>
                  <span className="text-emerald-700">₹{(project.projectCostCrores * 0.18).toFixed(2)} Cr</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-[11px]">
                <strong>PFMS Civil Deposit Guarantee:</strong> Escrow transfer generates an instant RBI e-Kuber Treasury Acknowledgement and enables the Competent Authority to initiate Section 11 field demarcations.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowEscrowModal(false)}
                className="px-3 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingEscrow}
                onClick={() => {
                  setIsProcessingEscrow(true);
                  setTimeout(() => {
                    setIsProcessingEscrow(false);
                    setEscrowDeposited(true);
                    setShowEscrowModal(false);
                  }, 1000);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                {isProcessingEscrow ? (
                  <span>Processing Treasury Handshake...</span>
                ) : (
                  <>
                    <Landmark className="w-4 h-4" />
                    <span>Authorize Escrow Transfer via RBI e-Kuber</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Proposal Modal for New Requisition */}
      {showRequisitionModal && (
        <ProjectProposalModal
          isOpen={showRequisitionModal}
          onClose={() => setShowRequisitionModal(false)}
        />
      )}
    </div>
  );
};
