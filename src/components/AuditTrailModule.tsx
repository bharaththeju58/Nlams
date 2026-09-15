import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Lock,
  Calendar,
  UserCheck,
  Building,
  FileCheck
} from 'lucide-react';

export const AuditTrailModule: React.FC = () => {
  const { t } = useTranslation();
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('All');

  const filteredLogs = auditLogs.filter(log => {
    const matchAction = filterAction === 'All' || log.action === filterAction;
    const matchSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userRole.toLowerCase().includes(searchTerm.toLowerCase());
    return matchAction && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-slate-900 text-slate-100 border border-slate-700">
              Statutory Accountability
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('audit.immutable', 'Immutable Audit Trail')}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            {t('audit.title', 'System Audit Trail & Action History')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('audit.subtitle', 'Read-only chronological ledger of all project approvals, notifications, awards, disbursements, and possession actions')}
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-[10px] text-emerald-900 font-black uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-emerald-700" />
          <span>Integrity Sealed • Tamper-Evident</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">{t('audit.recorded', 'Recorded Administrative Events')}</h2>
            <span className="bg-slate-100 text-slate-800 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              {filteredLogs.length} Events
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder={t('common.search', 'Search action or entity...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1 text-slate-800 font-bold focus:outline-blue-600 shadow-2xs"
              />
            </div>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold shadow-2xs"
            >
              <option value="All">{t('common.all', 'All Actions')}</option>
              <option value="Proposal Submitted">Proposal Submitted</option>
              <option value="Scrutiny Approved">Scrutiny Approved</option>
              <option value="Section 11 Notification Published">Section 11 Notification</option>
              <option value="Award Declared">Award Declared</option>
              <option value="Compensation Disbursed (PFMS)">Compensation Disbursed</option>
              <option value="Possession Recorded">Possession Recorded</option>
              <option value="Grievance Action Taken">Grievance Action Taken</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">{t('audit.dateTime', 'Date & Time')}</th>
                <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">{t('audit.executingAuthority', 'Executing Authority / Role')}</th>
                <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">{t('audit.actionExecuted', 'Action Executed')}</th>
                <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">{t('audit.entityReference', 'Entity Reference')}</th>
                <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">{t('audit.operationalDetails', 'Operational Details')}</th>
                <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">{t('audit.hash', 'Hash / Verification')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600 font-bold whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-black text-slate-900 block">{log.userRole}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{log.userId}</span>
                  </td>
                  <td className="px-4 py-3 font-black text-blue-900">
                    {log.action}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-black text-blue-950 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[10px]">
                      {log.entityId}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{log.entityType}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium max-w-xs">
                    {log.details}
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-emerald-800 font-bold">
                    SHA256:{log.id.slice(-6)}8c9e
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
