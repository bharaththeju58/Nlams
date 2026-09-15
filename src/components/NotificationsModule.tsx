import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import {
  BellRing,
  FileText,
  Download,
  MapPin,
  CheckCircle2,
  Calendar,
  Building,
  Printer,
  Shield,
  Layers,
  ArrowRight,
  Lock
} from 'lucide-react';
import { canPerformAction } from '../utils/rbacPermissions';

export const NotificationsModule: React.FC = () => {
  const { t } = useTranslation();
  const {
    projects,
    parcels,
    publishSection11Notification,
    publishSection19Declaration,
    setActiveTab,
    setSelectedProjectId,
    role,
    portalUserType
  } = useApp();

  const canSign = canPerformAction(role, portalUserType, 'canSignSec11Sec19');

  const [selectedProjectIdLocal, setSelectedProjectIdLocal] = useState(projects[0]?.id || '');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [notificationType, setNotificationType] = useState<'Sec11' | 'Sec19'>('Sec11');
  const [notificationNumber, setNotificationNumber] = useState('SEC11/GOI/2025/088');
  const [activeGazetteModal, setActiveGazetteModal] = useState<any | null>(null);

  const activeProject = projects.find(p => p.id === selectedProjectIdLocal) || projects[0];
  const projectParcels = parcels.filter(p => p.projectId === activeProject.id);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (notificationType === 'Sec11') {
      publishSection11Notification(activeProject.id, notificationNumber);
    } else {
      publishSection19Declaration(activeProject.id, notificationNumber);
    }
    setShowPublishModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Gazette Notifications
            </span>
            <span className="text-xs text-slate-500 font-medium">RFCTLARR Statutory Publishing</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {t('notifications.title', 'Preliminary Notification (Sec 11) & Final Declaration (Sec 19)')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('notifications.subtitle', 'Publish official Gazette notifications under Sections 11 and 19 of RFCTLARR Act 2013')}
          </p>
        </div>

        {canSign ? (
          <button
            onClick={() => {
              setNotificationNumber(
                notificationType === 'Sec11'
                  ? `SEC11/${activeProject.state.slice(0, 2).toUpperCase()}/${Date.now().toString().slice(-4)}`
                  : `SEC19/${activeProject.state.slice(0, 2).toUpperCase()}/${Date.now().toString().slice(-4)}`
              );
              setShowPublishModal(true);
            }}
            className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <BellRing className="w-4 h-4" />
            {t('notifications.draftPublish', 'Draft / Publish Gazette Notification')}
          </button>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Gazette Publication: State Revenue / CALA Authority Only</span>
          </div>
        )}
      </div>

      {/* National Read-Only Monitoring Banner */}
      {role === 'Central Sponsoring Ministry' && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 text-xs text-sky-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-sky-700 flex-shrink-0" />
            <span>
              <strong>National Read-Only Monitoring Mode:</strong> Active oversight session for Central Sponsoring Ministry. Gazette issuance under Section 11 (Preliminary Notification) and Section 19 (Declaration) is exercised by State Revenue & District CALA Authorities.
            </span>
          </div>
          <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-black text-[10px] uppercase tracking-wider whitespace-nowrap">
            Read-Only
          </span>
        </div>
      )}

      {/* Project Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600">Select Project:</span>
          <select
            value={activeProject.id}
            onChange={(e) => setSelectedProjectIdLocal(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-blue-600"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500 hidden sm:block">
          Total Parcels under Demarcation: <strong>{projectParcels.length}</strong>
        </span>
      </div>

      {/* Two Notification Cards: Section 11 & Section 19 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 11 Preliminary Notification Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Initial Requisition Notice
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Section 11 Preliminary Notification
                </h2>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                activeProject.preliminaryNotificationNumber
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {activeProject.preliminaryNotificationNumber ? 'Published in Gazette' : 'Draft / Pending'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mt-3">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Gazette Ref No.</span>
                <span className="font-mono font-bold text-blue-900">
                  {activeProject.preliminaryNotificationNumber || 'SEC11/DRAFT/PENDING'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Notification Date</span>
                <span className="font-bold text-slate-800">
                  {activeProject.preliminaryNotificationDate || 'Pending Approval'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Declaration Window</span>
                <span className="font-bold text-blue-900">
                  {activeProject.objectionDeadlineDate || '12 Months (Sec 19(7))'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Jurisdiction Scope</span>
                <span className="font-bold text-slate-800">
                  {activeProject.numberOfVillages} Villages ({activeProject.estimatedLandAcres} ac)
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-600 border border-slate-200">
              <p className="line-clamp-2">
                <strong>Statutory Notice:</strong> "Notice is hereby given under Section 11(1) of the RFCTLARR Act, 2013 that land is likely to be needed for public purpose, namely for {activeProject.name} in {activeProject.district}, {activeProject.state}."
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => setActiveGazetteModal({
                title: 'Section 11 Preliminary Gazette Notification',
                refNo: activeProject.preliminaryNotificationNumber || 'SEC11/PROVISIONAL/2025',
                date: activeProject.preliminaryNotificationDate || '2025-01-15',
                project: activeProject
              })}
              className="px-3 py-1.5 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Official Gazette PDF
            </button>

            <button
              onClick={() => {
                setSelectedProjectId(activeProject.id);
                setActiveTab('GIS Map');
              }}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-700" />
              View GIS Parcels
            </button>
          </div>
        </div>

        {/* Section 19 Final Declaration Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Conclusive Declaration
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Section 19 Final Declaration
                </h2>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                activeProject.finalDeclarationNumber
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {activeProject.finalDeclarationNumber ? 'Declared & In Force' : 'Awaiting R&R Summary'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mt-3">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Declaration Gazette No.</span>
                <span className="font-mono font-bold text-blue-900">
                  {activeProject.finalDeclarationNumber || 'Awaiting Section 19 Approval'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Declaration Date</span>
                <span className="font-bold text-slate-800">
                  {activeProject.finalDeclarationDate || 'Scheduled Q3'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">R&R Summary Publication</span>
                <span className="font-bold text-slate-800">
                  Schedule I & II Form VI
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Statutory Time Limit</span>
                <span className="font-bold text-emerald-800">
                  Within 12 months of Sec 11
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-600 border border-slate-200">
              <p className="line-clamp-2">
                <strong>Statutory Declaration:</strong> "Declaration under Section 19(1) that land is required for a public purpose and the Rehabilitation and Resettlement Scheme summary has been published."
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => setActiveGazetteModal({
                title: 'Section 19 Final Declaration Gazette',
                refNo: activeProject.finalDeclarationNumber || 'SEC19/PROVISIONAL/2025',
                date: activeProject.finalDeclarationDate || '2025-02-20',
                project: activeProject
              })}
              className="px-3 py-1.5 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Declaration PDF
            </button>

            <button
              onClick={() => setActiveTab('Awards')}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1.5 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
              Proceed to Awards (Sec 23)
            </button>
          </div>
        </div>
      </div>

      {/* Gazette Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Publish Statutory Notification in Official Gazette</h3>
            <form onSubmit={handlePublish} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Notification Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input
                      type="radio"
                      checked={notificationType === 'Sec11'}
                      onChange={() => setNotificationType('Sec11')}
                    />
                    <span>Section 11 (Preliminary)</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input
                      type="radio"
                      checked={notificationType === 'Sec19'}
                      onChange={() => setNotificationType('Sec19')}
                    />
                    <span>Section 19 (Declaration)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Gazette Notification Number</label>
                <input
                  type="text"
                  required
                  value={notificationNumber}
                  onChange={(e) => setNotificationNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 text-[11px]">
                <strong>Rule-Based Statutory Trigger:</strong> Publishing Section 11 automatically updates parcel statuses from Proposed (🔵) to Notified (🟡) on the GIS cadastral map and initiates the statutory 12-month timeline for Final Declaration.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-3 py-1.5 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-800 text-white font-bold rounded shadow-xs"
                >
                  Publish in e-Gazette
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gazette PDF Printable Preview Modal */}
      {activeGazetteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-slate-300 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-900" />
                <h3 className="font-bold text-slate-900 text-sm">Official Gazette Copy</h3>
              </div>
              <button
                onClick={() => setActiveGazetteModal(null)}
                className="text-slate-500 hover:text-slate-800 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Printable Gazette Mock Template */}
            <div className="border border-slate-300 p-6 bg-slate-50/50 rounded space-y-4 font-serif text-slate-800">
              <div className="text-center border-b border-slate-300 pb-4">
                <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-slate-500">
                  Government of {activeGazetteModal.project.state}
                </p>
                <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 mt-1">
                  The Gazette of India: Extraordinary
                </h2>
                <p className="text-xs font-sans text-slate-500 mt-0.5">
                  PART II — Section 3 — Sub-section (ii) • PUBLISHED BY AUTHORITY
                </p>
                <div className="mt-2 text-xs font-mono font-bold text-blue-950">
                  Notification Ref: {activeGazetteModal.refNo} | Dated: {activeGazetteModal.date}
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed">
                <p className="font-bold text-center underline uppercase">
                  {activeGazetteModal.title}
                </p>
                <p>
                  WHEREAS it appears to the Government of {activeGazetteModal.project.state} that land is likely to be needed for a public purpose, namely the execution of <strong>"{activeGazetteModal.project.name}"</strong> by the Requisitioning Body <strong>{activeGazetteModal.project.requiringBody}</strong>;
                </p>
                <p>
                  AND WHEREAS the Social Impact Assessment Study has been scrutinized and evaluated by the independent multi-disciplinary Expert Group under Section 7 of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013;
                </p>
                <p>
                  NOW, THEREFORE, notice is hereby given that the land measuring approximately <strong>{activeGazetteModal.project.estimatedLandAcres} acres</strong> situated in {activeGazetteModal.project.numberOfVillages} villages of {activeGazetteModal.project.district} District is required for the said infrastructure project.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-300 flex justify-between items-end font-sans text-[11px]">
                <div>
                  <span className="block font-bold">Seal of Competent Authority</span>
                  <span className="text-slate-500">Revenue & Disaster Management Dept</span>
                </div>
                <div className="text-right">
                  <span className="font-bold block">By Order of the Governor</span>
                  <span className="text-slate-500">Principal Secretary to Government</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Gazette
              </button>
              <button
                onClick={() => setActiveGazetteModal(null)}
                className="px-4 py-1.5 bg-blue-800 text-white font-bold rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
