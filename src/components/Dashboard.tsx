import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { formatNumber, formatCurrency } from '../i18n';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  Briefcase,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  IndianRupee,
  Home,
  MessageSquareWarning,
  Filter,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  FileText
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const {
    projects,
    parcels,
    compensations,
    grievances,
    filterState,
    setFilterState,
    filterSector,
    setFilterSector,
    filterStatus,
    setFilterStatus,
    setActiveTab,
    setSelectedProjectId,
    role
  } = useApp();

  // Distinct states and sectors for filter dropdowns
  const availableStates = useMemo(() => {
    const set = new Set(projects.map(p => p.state));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const availableSectors = useMemo(() => {
    const set = new Set(projects.map(p => p.sector));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const availableStatuses = useMemo(() => {
    const set = new Set(projects.map(p => p.status));
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchState = filterState === 'All' || p.state === filterState;
      const matchSector = filterSector === 'All' || p.sector === filterSector;
      const matchStatus = filterStatus === 'All' || p.status === filterStatus;
      return matchState && matchSector && matchStatus;
    });
  }, [projects, filterState, filterSector, filterStatus]);

  // Aggregate KPIs
  const totalProjects = filteredProjects.length;
  const landProposedAcres = filteredProjects.reduce((acc, p) => acc + p.estimatedLandAcres, 0);
  const landNotifiedAcres = filteredProjects.reduce((acc, p) => {
    // If project is at least at Preliminary Notification or later
    const hasNotification = p.preliminaryNotificationNumber || p.status.includes('Notification') || p.status.includes('Award') || p.status.includes('Compensation') || p.status.includes('Possession') || p.status.includes('R&R');
    return acc + (hasNotification ? Math.round(p.estimatedLandAcres * 0.88) : 0);
  }, 0);
  const landAcquiredAcres = filteredProjects.reduce((acc, p) => acc + p.acquiredLandAcres, 0);
  const compensationPaidCrores = filteredProjects.reduce((acc, p) => acc + p.compensationDisbursedCrores, 0);
  const avgRRCompletion = totalProjects > 0
    ? Math.round(filteredProjects.reduce((acc, p) => acc + p.rrCompletionPercent, 0) / totalProjects)
    : 0;
  const delayedCases = filteredProjects.filter(p => p.delayed).length;
  const activeGrievances = grievances.filter(g => g.status === 'Submitted' || g.status === 'Action Required').length;

  // Chart 1: Land Proposed vs Notified vs Acquired by Sector
  const sectorLandData = useMemo(() => {
    const sectorMap: Record<string, { sector: string; proposed: number; notified: number; acquired: number }> = {};
    filteredProjects.forEach(p => {
      if (!sectorMap[p.sector]) {
        sectorMap[p.sector] = { sector: p.sector, proposed: 0, notified: 0, acquired: 0 };
      }
      sectorMap[p.sector].proposed += p.estimatedLandAcres;
      sectorMap[p.sector].notified += p.preliminaryNotificationNumber ? Math.round(p.estimatedLandAcres * 0.85) : 0;
      sectorMap[p.sector].acquired += p.acquiredLandAcres;
    });
    return Object.values(sectorMap);
  }, [filteredProjects]);

  // Chart 2: Compensation Paid by State (₹ Crores)
  const compensationByStateData = useMemo(() => {
    const stateMap: Record<string, { state: string; budget: number; disbursed: number }> = {};
    filteredProjects.forEach(p => {
      if (!stateMap[p.state]) {
        stateMap[p.state] = { state: p.state, budget: 0, disbursed: 0 };
      }
      stateMap[p.state].budget += p.compensationBudgetCrores;
      stateMap[p.state].disbursed += p.compensationDisbursedCrores;
    });
    return Object.values(stateMap);
  }, [filteredProjects]);

  // Chart 3: R&R Completion by State (%)
  const rrByStateData = useMemo(() => {
    const stateMap: Record<string, { state: string; totalRR: number; count: number }> = {};
    filteredProjects.forEach(p => {
      if (!stateMap[p.state]) {
        stateMap[p.state] = { state: p.state, totalRR: 0, count: 0 };
      }
      stateMap[p.state].totalRR += p.rrCompletionPercent;
      stateMap[p.state].count += 1;
    });
    return Object.values(stateMap).map(item => ({
      state: item.state,
      rrPercent: Math.round(item.totalRR / (item.count || 1))
    }));
  }, [filteredProjects]);

  // Chart 4: Timeline Adherence
  const timelineData = [
    { name: 'On Track', value: Math.max(1, totalProjects - delayedCases), color: '#10b981' },
    { name: 'Delayed / Flagged', value: delayedCases, color: '#ef4444' }
  ];

  // Chart 5: Monthly Acquisition Trend (Simulation data points)
  const monthlyProgressData = [
    { month: 'Oct 2024', proposed: 12400, acquired: 8200 },
    { month: 'Nov 2024', proposed: 14800, acquired: 10400 },
    { month: 'Dec 2024', proposed: 16500, acquired: 12900 },
    { month: 'Jan 2025', proposed: 19100, acquired: 14700 },
    { month: 'Feb 2025', proposed: 21800, acquired: 16900 },
    { month: 'Mar 2025 (Curr)', proposed: landProposedAcres, acquired: landAcquiredAcres }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Filter Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {t('dashboard.title', 'National Land Acquisition Macro Analytics')}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
                {t('common.status', 'Live Status')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {t('dashboard.subtitle', 'Real-time RFCTLARR 2013 Statutory Compliance & Acquisition Monitoring Engine')}
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" />
              <span>{t('dashboard.filters', 'Filters')}:</span>
            </div>

            {/* State Filter */}
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-blue-600 focus:bg-white shadow-2xs"
              title={t('dashboard.allStates', 'Filter by State')}
            >
              {availableStates.map(s => (
                <option key={s} value={s}>{s === 'All' ? t('dashboard.allStates', 'All States') : s}</option>
              ))}
            </select>

            {/* Sector Filter */}
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-blue-600 focus:bg-white shadow-2xs"
              title={t('dashboard.allSectors', 'Filter by Sector')}
            >
              {availableSectors.map(s => (
                <option key={s} value={s}>{s === 'All' ? t('dashboard.allSectors', 'All Sectors') : s}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-blue-600 focus:bg-white shadow-2xs"
              title={t('dashboard.allStatuses', 'Filter by Status')}
            >
              {availableStatuses.map(s => (
                <option key={s} value={s}>{s === 'All' ? t('dashboard.allStatuses', 'All Statuses') : s}</option>
              ))}
            </select>

            {(filterState !== 'All' || filterSector !== 'All' || filterStatus !== 'All') && (
              <button
                onClick={() => {
                  setFilterState('All');
                  setFilterSector('All');
                  setFilterStatus('All');
                }}
                className="text-xs text-blue-700 hover:text-blue-900 font-black uppercase tracking-wider underline px-1"
              >
                {t('dashboard.reset', 'Reset')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* National Read-Only Oversight Banner */}
      {role === 'Central Sponsoring Ministry' && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 text-xs text-sky-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0" />
            <span>
              <strong>National Read-Only Monitoring Mode:</strong> Active oversight session for Central Sponsoring Ministry. Cross-sector national macro indicators, PFMS disbursements, and corridor milestone trajectories are displayed in read-only telemetry under the RFCTLARR statutory framework.
            </span>
          </div>
          <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-black text-[10px] uppercase tracking-wider whitespace-nowrap">
            National Oversight
          </span>
        </div>
      )}

      {/* 8 Primary KPI Cards styled with Bold Typography left-accent border pattern */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Total Projects */}
        <div
          onClick={() => setActiveTab('Projects')}
          className="bg-white border-l-4 border-blue-600 p-4 shadow-sm rounded-lg border-y border-r border-slate-200 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.totalProjects', 'Total Projects')}</p>
            <Briefcase className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatNumber(totalProjects)}
          </div>
          <div className="mt-2 h-1 bg-slate-100 rounded overflow-hidden">
            <div className="w-3/4 h-full bg-blue-600" />
          </div>
          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider mt-1.5">
            +4 {t('common.status', 'Active')}
          </p>
        </div>

        {/* KPI 2: Land Proposed */}
        <div className="bg-white border-l-4 border-indigo-600 p-4 shadow-sm rounded-lg border-y border-r border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.landProposed', 'Land Proposed')}</p>
            <MapPin className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatNumber(landProposedAcres)}
            <span className="text-xs font-bold text-slate-400 ml-1">{t('common.acres', 'ACRES')}</span>
          </div>
          <div className="mt-2 h-1 bg-slate-100 rounded overflow-hidden">
            <div className="w-full h-full bg-indigo-600" />
          </div>
          <p className="text-[10px] text-indigo-600 font-black uppercase tracking-wider mt-1.5">
            100% {t('dashboard.proposed', 'Requisition Area')}
          </p>
        </div>

        {/* KPI 3: Land Notified */}
        <div
          onClick={() => setActiveTab('Notifications')}
          className="bg-white border-l-4 border-amber-500 p-4 shadow-sm rounded-lg border-y border-r border-slate-200 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.landNotified', 'Land Notified')}</p>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 tracking-tight">
            {formatNumber(landNotifiedAcres)}
            <span className="text-xs font-bold text-amber-600/70 ml-1">{t('common.acres', 'ACRES')}</span>
          </div>
          <div className="mt-2 h-1 bg-slate-100 rounded overflow-hidden">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${landProposedAcres > 0 ? Math.round((landNotifiedAcres / landProposedAcres) * 100) : 0}%` }}
            />
          </div>
          <p className="text-[10px] text-amber-700 font-black uppercase tracking-wider mt-1.5">
            {landProposedAcres > 0 ? Math.round((landNotifiedAcres / landProposedAcres) * 100) : 0}% Sec 11/19 Gazetted
          </p>
        </div>

        {/* KPI 4: Land Acquired */}
        <div
          onClick={() => setActiveTab('Possession')}
          className="bg-white border-l-4 border-emerald-600 p-4 shadow-sm rounded-lg border-y border-r border-slate-200 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.landAcquired', 'Land Acquired')}</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900 tracking-tight">
            {formatNumber(landAcquiredAcres)}
            <span className="text-xs font-bold text-emerald-600/70 ml-1">{t('common.acres', 'ACRES')}</span>
          </div>
          <div className="mt-2 h-1 bg-slate-100 rounded overflow-hidden">
            <div
              className="h-full bg-emerald-600"
              style={{ width: `${landProposedAcres > 0 ? Math.round((landAcquiredAcres / landProposedAcres) * 100) : 0}%` }}
            />
          </div>
          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider mt-1.5">
            {landProposedAcres > 0 ? Math.round((landAcquiredAcres / landProposedAcres) * 100) : 0}% {t('possession.title', 'Possession Transferred')}
          </p>
        </div>

        {/* KPI 5: Compensation Paid */}
        <div
          onClick={() => setActiveTab('Compensation')}
          className="bg-white border-l-4 border-cyan-600 p-4 shadow-sm rounded-lg border-y border-r border-slate-200 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.compensationPaid', 'Compensation Paid')}</p>
            <IndianRupee className="w-4 h-4 text-cyan-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{formatNumber(compensationPaidCrores)}
            <span className="text-xs font-bold text-slate-400 ml-1">{t('common.crores', 'CR')}</span>
          </div>
          <div className="mt-2 h-1 bg-slate-100 rounded overflow-hidden">
            <div className="w-4/5 h-full bg-cyan-600" />
          </div>
          <p className="text-[10px] text-cyan-700 font-black uppercase tracking-wider mt-1.5">
            PFMS Rails • Aadhaar DBT
          </p>
        </div>

        {/* KPI 6: R&R Completion */}
        <div
          onClick={() => setActiveTab('Rehabilitation & Resettlement')}
          className="bg-white border-l-4 border-purple-600 p-4 shadow-sm rounded-lg border-y border-r border-slate-200 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.avgRRCompletion', 'R&R Completion')}</p>
            <Home className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-950 tracking-tight">
            {avgRRCompletion}%
          </div>
          <div className="mt-2 h-1 bg-slate-100 rounded overflow-hidden">
            <div className="h-full bg-purple-600" style={{ width: `${avgRRCompletion}%` }} />
          </div>
          <p className="text-[10px] text-purple-700 font-black uppercase tracking-wider mt-1.5">
            Schedule II & III Packages
          </p>
        </div>

        {/* KPI 7: Delayed Cases */}
        <div
          onClick={() => setActiveTab('Reports')}
          className="bg-white border-l-4 border-red-600 p-4 shadow-sm rounded-lg border-y border-r border-slate-200 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.delayedCases', 'Delayed Cases')}</p>
            <Clock className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700 tracking-tight">
            {delayedCases}
          </div>
          <div className="mt-2 h-1 bg-slate-100 rounded overflow-hidden">
            <div className="w-2/5 h-full bg-red-600" />
          </div>
          <p className="text-[10px] text-red-700 font-black uppercase tracking-wider mt-1.5">
            {t('dashboard.delayed', 'Statutory Milestone Breach')}
          </p>
        </div>

        {/* KPI 8: Active Grievances */}
        <div
          onClick={() => setActiveTab('Grievances')}
          className="bg-white border-l-4 border-orange-500 p-4 shadow-sm rounded-lg border-y border-r border-slate-200 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.activeGrievances', 'Active Grievances')}</p>
            <MessageSquareWarning className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-orange-950 tracking-tight">
            {activeGrievances}
          </div>
          <div className="mt-2 h-1 bg-slate-100 rounded overflow-hidden">
            <div className="w-1/2 h-full bg-orange-500" />
          </div>
          <p className="text-[10px] text-orange-700 font-black uppercase tracking-wider mt-1.5">
            Sec 51 Collector Review
          </p>
        </div>
      </div>

      {/* Statutory Rule-Based Alert Card matching Bold Typography design */}
      <div className="bg-slate-900 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between text-white gap-4 shadow-sm border border-slate-800">
        <div>
          <p className="text-amber-400 text-[10px] font-black uppercase mb-1 tracking-widest">
            ⚠️ {t('notifications.statutoryAlert', 'Rule-Based Statutory Alert')}
          </p>
          <p className="text-sm leading-snug font-medium">
            Section 19 Final Declaration deadline for Project <strong className="text-white font-black underline decoration-amber-400">E-COR-UP</strong> is approaching within 12 months under Section 19(7).
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('Notifications')}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-colors uppercase tracking-wider shadow-sm cursor-pointer"
          >
            {t('nav.notifications', 'Review Notifications')}
          </button>
          <button
            onClick={() => setActiveTab('Awards')}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-wider cursor-pointer"
          >
            {t('nav.awards', 'Inspect Awards')}
          </button>
        </div>
      </div>

      {/* Row of Charts (1 & 2): Land Acquisition by Sector & Compensation Paid by State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Land Proposed vs Notified vs Acquired */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                1. {t('dashboard.sectorBreakdown', 'Land Proposed vs Notified vs Acquired by Sector')}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t('common.acres', 'Area comparison in Acres')}</p>
            </div>
            <button
              onClick={() => setActiveTab('GIS Map')}
              className="text-xs text-blue-700 hover:text-blue-900 font-black uppercase tracking-wider flex items-center gap-1"
            >
              {t('nav.gisMap', 'Open GIS Map')} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorLandData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="sector" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontWeight: 700 }} />
                <Bar dataKey="proposed" name={`${t('dashboard.proposed', 'Proposed')} (${t('common.acres', 'Acres')})`} fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="notified" name={`${t('dashboard.notified', 'Notified')} (${t('common.acres', 'Acres')})`} fill="#f59e0b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="acquired" name={`${t('dashboard.acquired', 'Acquired')} (${t('common.acres', 'Acres')})`} fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Compensation Paid by State */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                2. {t('dashboard.compensationByState', 'Compensation Budget vs Disbursed by State')}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Statutory awards in ₹ Crores via PFMS</p>
            </div>
            <button
              onClick={() => setActiveTab('Compensation')}
              className="text-xs text-blue-700 hover:text-blue-900 font-black uppercase tracking-wider flex items-center gap-1"
            >
              {t('nav.compensation', 'PFMS Ledger')} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compensationByStateData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="state" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                <Tooltip
                  formatter={(value: any) => [`₹${value} Cr`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontWeight: 700 }} />
                <Bar dataKey="budget" name={`${t('compensation.totalCompensation', 'Total Award')} (₹ Cr)`} fill="#94a3b8" radius={[2, 2, 0, 0]} />
                <Bar dataKey="disbursed" name={`${t('compensation.disbursed', 'Disbursed')} (₹ Cr)`} fill="#059669" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row of Charts (3, 4, 5): R&R Completion, Timeline Adherence, Monthly Acquisition Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 3: R&R Completion by State */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-0.5">
            3. {t('dashboard.rrCompletionByState', 'R&R Progress by State')}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Schedule II & III Rehabilitation %</p>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={rrByStateData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 600 }} />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} width={80} />
                <Tooltip formatter={(v: any) => [`${v}%`, 'R&R Completed']} />
                <Bar dataKey="rrPercent" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Project Timeline Adherence */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-0.5">
              4. {t('dashboard.timelineAdherence', 'Project Timeline Adherence')}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Statutory milestone adherence ratio</p>
          </div>
          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {timelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {totalProjects > 0 ? Math.round(((totalProjects - delayedCases) / totalProjects) * 100) : 100}%
              </span>
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">{t('dashboard.onTrack', 'On Schedule')}</span>
            </div>
          </div>
          <div className="flex items-center justify-around text-xs pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-700 font-bold">{t('dashboard.onTrack', 'On Track')} ({totalProjects - delayedCases})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-700 font-bold">{t('dashboard.delayed', 'Delayed')} ({delayedCases})</span>
            </div>
          </div>
        </div>

        {/* Chart 5: Monthly Acquisition Progress */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-0.5">
            5. {t('dashboard.monthlyVelocity', 'Monthly Acquisition Progress')}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Cumulative Acquired vs Proposed Trend</p>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAcq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 9, fontWeight: 600 }} />
                <Tooltip />
                <Area type="monotone" dataKey="acquired" name={`${t('dashboard.acquired', 'Acquired')} (${t('common.acres', 'Acres')})`} stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAcq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Major Projects Quick Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {t('dashboard.recentProjects', 'National Priority Projects in Acquisition Phase')}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Select any project to inspect statutory lifecycle, parcels, and awards
            </p>
          </div>
          <button
            onClick={() => setActiveTab('Projects')}
            className="text-xs text-blue-700 hover:text-blue-900 font-black uppercase tracking-wider flex items-center gap-1"
          >
            {t('common.viewDetails', 'View All Projects')} ({projects.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">{t('projects.id', 'Project ID')}</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">{t('projects.title', 'Project Name')}</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">{t('projects.sector', 'Sector')}</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">{t('projects.location', 'Location')}</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">{t('projects.landRequired', 'Land Progress')}</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">{t('nav.compensation', 'Compensation')}</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">{t('common.status', 'Lifecycle Status')}</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right">{t('common.actions', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.slice(0, 5).map(project => {
                const percent = Math.round((project.acquiredLandAcres / project.estimatedLandAcres) * 100);
                return (
                  <tr
                    key={project.id}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setActiveTab('Projects');
                    }}
                  >
                    <td className="px-4 py-3 font-mono font-black text-blue-900">
                      {project.id}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 group-hover:text-blue-900">
                      {project.name}
                      <span className="block text-[10px] text-slate-400 font-medium">{project.requiringBody}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-bold text-[11px]">
                        {project.sector}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-semibold">
                      {project.district}, {project.state}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-28">
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                          <span>{project.acquiredLandAcres} ac</span>
                          <span className="text-slate-900">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      ₹{project.compensationDisbursedCrores} / ₹{project.compensationBudgetCrores} {t('common.crores', 'Cr')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        project.status === 'Possession Handover' || project.status === 'R&R Implementation'
                          ? 'bg-emerald-100 text-emerald-800'
                          : project.status.includes('Notification')
                          ? 'bg-amber-100 text-amber-800'
                          : project.status === 'Under Scrutiny'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-blue-700 font-black uppercase tracking-wider text-[11px] group-hover:underline flex items-center justify-end gap-0.5">
                        {t('common.viewDetails', 'Inspect')} <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
