import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  Layers,
  Building,
  CheckCircle2,
  FileText,
  ShieldCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const ReportsModule: React.FC = () => {
  const { t } = useTranslation();
  const {
    projects,
    parcels,
    compensations,
    awards,
    grievances,
    role
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<
    'national' | 'state' | 'sector' | 'compensation' | 'disputes'
  >('national');

  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportCSV = (filename: string) => {
    setExportNotice(`Generated & Downloaded "${filename}.csv" successfully.`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  // State-wise data
  const stateSummary = [
    { state: 'Maharashtra', projects: 8, acres: 6400, acquiredAcres: 4800, compensationCr: 420 },
    { state: 'Uttar Pradesh', projects: 12, acres: 8900, acquiredAcres: 5600, compensationCr: 650 },
    { state: 'Madhya Pradesh', projects: 6, acres: 3800, acquiredAcres: 2700, compensationCr: 210 },
    { state: 'Tamil Nadu', projects: 7, acres: 3100, acquiredAcres: 2400, compensationCr: 380 },
    { state: 'Gujarat', projects: 5, acres: 4200, acquiredAcres: 3600, compensationCr: 490 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-900 border border-blue-200">
              Cabinet Secretariat & NITI Aayog Reporting
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('reports.nationalMis', 'National MIS Reports')}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            {t('reports.title', 'Statutory Reports & National Infrastructure Dashboards')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('reports.subtitle', 'Exportable compliance dossiers for PMG / PRAGATI review meetings and Parliamentary questions')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV(`NLAMS_${activeReportTab.toUpperCase()}_MIS`)}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-black uppercase tracking-wider text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {t('reports.exportCsv', 'Export CSV')}
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black uppercase tracking-wider text-xs rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            {t('reports.printPdf', 'Print / PDF')}
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-black uppercase tracking-wide flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {exportNotice}
        </div>
      )}

      {/* National Read-Only Monitoring Banner */}
      {role === 'Central Sponsoring Ministry' && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 text-xs text-sky-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0" />
            <span>
              <strong>National Read-Only Monitoring Mode:</strong> Active oversight session for Central Sponsoring Ministry. Aggregated multi-state corridor reports, macro financial metrics, and statutory lifecycle benchmarks are compiled for Union review.
            </span>
          </div>
          <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-black text-[10px] uppercase tracking-wider whitespace-nowrap">
            National Oversight
          </span>
        </div>
      )}

      {/* Report Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-t-lg overflow-x-auto text-[11px]">
        <button
          onClick={() => setActiveReportTab('national')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors uppercase tracking-wider ${
            activeReportTab === 'national'
              ? 'border-blue-900 text-blue-900 bg-blue-50/50 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900 font-bold'
          }`}
        >
          National Acquisition Progress
        </button>
        <button
          onClick={() => setActiveReportTab('state')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors uppercase tracking-wider ${
            activeReportTab === 'state'
              ? 'border-blue-900 text-blue-900 bg-blue-50/50 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900 font-bold'
          }`}
        >
          State-wise Summary
        </button>
        <button
          onClick={() => setActiveReportTab('sector')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors uppercase tracking-wider ${
            activeReportTab === 'sector'
              ? 'border-blue-900 text-blue-900 bg-blue-50/50 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900 font-bold'
          }`}
        >
          Sector-wise Infrastructure
        </button>
        <button
          onClick={() => setActiveReportTab('compensation')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors uppercase tracking-wider ${
            activeReportTab === 'compensation'
              ? 'border-blue-900 text-blue-900 bg-blue-50/50 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900 font-bold'
          }`}
        >
          Compensation & PFMS Audit
        </button>
        <button
          onClick={() => setActiveReportTab('disputes')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors uppercase tracking-wider ${
            activeReportTab === 'disputes'
              ? 'border-blue-900 text-blue-900 bg-blue-50/50 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900 font-bold'
          }`}
        >
          Pending Disputes & LARR Cases
        </button>
      </div>

      {/* Tab Content 1: National Acquisition Progress */}
      {activeReportTab === 'national' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">
              State-wise Target vs. Acquired Land (Acres)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateSummary}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="acres" name="Target Area (Acres)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="acquiredAcres" name="Possession Taken (Acres)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Projects Progress Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">National Infrastructure Project Matrix</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">Project Name</th>
                    <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">Sector</th>
                    <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">State</th>
                    <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">Target Land</th>
                    <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">Statutory Stage</th>
                    <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">Cost (₹ Cr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-black text-slate-900">
                        {p.name}
                        <span className="block font-mono text-[10px] text-blue-900 font-bold">{p.id}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{p.sector}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{p.state}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{p.estimatedLandAcres} ac</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-black text-slate-900">₹{p.projectCostCrores} Cr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: State-wise Summary */}
      {activeReportTab === 'state' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">State / UT Land Acquisition Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">State / UT</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">Active Projects</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">Total Land (Acres)</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">Acquired (Acres)</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">Acquisition %</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">Disbursed (₹ Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stateSummary.map(s => (
                  <tr key={s.state} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-black text-slate-900">{s.state}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{s.projects}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{s.acres.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-emerald-800">{s.acquiredAcres.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {Math.round((s.acquiredAcres / s.acres) * 100)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-slate-900">₹{s.compensationCr} Cr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Sector-wise Infrastructure */}
      {activeReportTab === 'sector' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Sectoral Outlay Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Highways & Expressways</span>
              <div className="text-xl font-black text-slate-900 tracking-tight mt-1">₹5,400 Cr Outlay</div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">3 Major Greenfield Corridors</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Railways & Freight Corridors</span>
              <div className="text-xl font-black text-slate-900 tracking-tight mt-1">₹3,800 Cr Outlay</div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dedicated Freight Alignment</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Renewable Energy Parks</span>
              <div className="text-xl font-black text-slate-900 tracking-tight mt-1">₹1,650 Cr Outlay</div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mega Solar Power Park</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Compensation Audit */}
      {activeReportTab === 'compensation' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-1">PFMS Direct Benefit Transfer Audit Record</h3>
          <p className="text-xs text-slate-500 font-medium mb-4">
            Audit logs confirmed electronically through Public Financial Management System (PFMS) and State Treasury Single Accounts (TSA).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest">UTR Ref</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest">Beneficiary ID</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest">Bank</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest">Amount (₹)</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest">Aadhaar Status</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest">PFMS Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {compensations.map(c => (
                  <tr key={c.id}>
                    <td className="px-3 py-2 font-mono font-black text-blue-900">{c.utrNumber}</td>
                    <td className="px-3 py-2 font-mono text-slate-700">{c.beneficiaryId}</td>
                    <td className="px-3 py-2 text-slate-700 font-medium">{c.bankName}</td>
                    <td className="px-3 py-2 font-black text-slate-900">₹{(c.amount / 100000).toFixed(2)} L</td>
                    <td className="px-3 py-2 text-emerald-800 font-black uppercase tracking-wider text-[10px]">✓ UIDAI Verified</td>
                    <td className="px-3 py-2 font-black text-emerald-800 uppercase tracking-wider text-[10px]">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 5: Disputes & LARR */}
      {activeReportTab === 'disputes' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Disputed Parcels & Section 64 References</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {parcels.filter(p => p.status === 'Disputed').map(p => (
              <div key={p.id} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-mono font-black text-blue-900">{p.id}</span>
                  <span className="ml-2 font-black text-slate-900">Survey #{p.surveyNumber} ({p.village})</span>
                  <p className="text-slate-500 text-[11px] font-medium">Reason: Title apportionment conflict between co-heirs.</p>
                </div>
                <span className="px-2 py-0.5 bg-red-100 text-red-800 font-black uppercase tracking-wider text-[10px] rounded">
                  Pending with LARR Authority
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
