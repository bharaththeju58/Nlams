import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  IndianRupee,
  MessageSquareWarning,
  TrendingUp,
  Building2,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

interface RRDashboardProps {
  selectedProjectId: string;
  onNavigateTab: (tab: string) => void;
}

export const RRDashboard: React.FC<RRDashboardProps> = ({ selectedProjectId, onNavigateTab }) => {
  const {
    projects,
    families,
    rrPlans,
    rrBenefits,
    rrGrievances,
    rrAlerts,
    resettlementSites
  } = useApp();

  // Filtered dataset according to selected project or all
  const filteredFamilies = useMemo(() => {
    return selectedProjectId === 'ALL'
      ? families
      : families.filter(f => f.projectId === selectedProjectId);
  }, [families, selectedProjectId]);

  const filteredPlans = useMemo(() => {
    return selectedProjectId === 'ALL'
      ? rrPlans
      : rrPlans.filter(p => p.projectId === selectedProjectId);
  }, [rrPlans, selectedProjectId]);

  const filteredBenefits = useMemo(() => {
    return selectedProjectId === 'ALL'
      ? rrBenefits
      : rrBenefits.filter(b => b.projectId === selectedProjectId);
  }, [rrBenefits, selectedProjectId]);

  const filteredGrievances = useMemo(() => {
    return selectedProjectId === 'ALL'
      ? rrGrievances
      : rrGrievances.filter(g => g.projectId === selectedProjectId);
  }, [rrGrievances, selectedProjectId]);

  const filteredAlerts = useMemo(() => {
    return selectedProjectId === 'ALL'
      ? rrAlerts
      : rrAlerts.filter(a => a.projectId === selectedProjectId);
  }, [rrAlerts, selectedProjectId]);

  // Real-time calculation from actual state
  const stats = useMemo(() => {
    const totalAffectedFamilies = filteredFamilies.length;
    const completedCases = filteredFamilies.filter(
      f => f.currentStatus === 'Resettled' || f.currentStatus === 'Closed' || f.workflowStatus === 'Closed'
    ).length;
    const pendingCases = totalAffectedFamilies - completedCases;

    const today = new Date().toISOString().split('T')[0];
    const delayedPlans = filteredPlans.filter(
      p => p.status === 'Delayed' || (p.status !== 'Completed' && p.plannedCompletionDate && p.plannedCompletionDate < today)
    ).length;
    const delayedBenefits = filteredBenefits.filter(b => b.status === 'Delayed').length;
    const delayedCases = delayedPlans + delayedBenefits;

    const totalBenefitsApproved = filteredBenefits.reduce(
      (sum, b) => sum + (b.approved ? (b.approvedAmount || b.eligibleAmount) : 0),
      0
    );
    const totalBenefitsDisbursed = filteredBenefits.reduce(
      (sum, b) => sum + (b.disbursed ? b.disbursedAmount : 0),
      0
    );

    const pendingGrievances = filteredGrievances.filter(
      g => g.status === 'Open' || g.status === 'Under Review'
    ).length;

    const rrCompletionPercent = totalAffectedFamilies > 0
      ? Math.round((completedCases / totalAffectedFamilies) * 100)
      : 0;

    const physicallyDisplaced = filteredFamilies.filter(
      f => f.displacementStatus === 'Physically Displaced' || f.displacementStatus === 'Both'
    ).length;

    const economicallyDisplaced = filteredFamilies.filter(
      f => f.displacementStatus === 'Economically Displaced' || f.displacementStatus === 'Both'
    ).length;

    return {
      totalAffectedFamilies,
      totalPlans: filteredPlans.length,
      activePlans: filteredPlans.filter(p => p.status === 'In Progress').length,
      completedCases,
      pendingCases,
      delayedCases,
      totalBenefitsApproved,
      totalBenefitsDisbursed,
      pendingGrievances,
      rrCompletionPercent,
      physicallyDisplaced,
      economicallyDisplaced
    };
  }, [filteredFamilies, filteredPlans, filteredBenefits, filteredGrievances]);

  const activeProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="space-y-6" id="rr-dashboard-root">
      {/* Statutory Rule Alerts Banner (if any) */}
      {filteredAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-xs" id="rr-statutory-alerts-banner">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Statutory Rule Alerts ({filteredAlerts.length} Actionable Conditions)
                </h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                  Section 31 & 38 RFCTLARR Act 2013
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Deterministic alerts generated from statutory timelines, milestone due dates, and grievance citizen charter thresholds.
              </p>
              <div className="mt-2.5 space-y-1.5">
                {filteredAlerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className="flex items-center justify-between bg-white/80 border border-amber-200/80 rounded px-3 py-1.5 text-xs text-amber-950">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span className="font-bold">{alert.title}</span>
                      <span className="text-slate-500 text-[11px] hidden sm:inline">— {alert.description}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                      {alert.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8 Primary KPI Cards Required by User Prompt */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="rr-kpi-grid">
        {/* 1. Total Affected Families */}
        <div
          onClick={() => onNavigateTab('families')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-blue-400 hover:shadow-sm transition cursor-pointer group"
          id="kpi-total-families"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Total Affected Families</span>
            <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {stats.totalAffectedFamilies.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-medium">
            <span>Physically Displaced: <strong className="text-slate-800">{stats.physicallyDisplaced}</strong></span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
          </div>
        </div>

        {/* 2. R&R Plans */}
        <div
          onClick={() => onNavigateTab('plans')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-indigo-400 hover:shadow-sm transition cursor-pointer group"
          id="kpi-rr-plans"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">R&R Plans</span>
            <FileCheck className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {stats.totalPlans}
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-medium">
            <span>Active In Progress: <strong className="text-indigo-700">{stats.activePlans}</strong></span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
          </div>
        </div>

        {/* 3. Completed Cases */}
        <div
          onClick={() => onNavigateTab('progress')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-emerald-400 hover:shadow-sm transition cursor-pointer group"
          id="kpi-completed-cases"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Completed Cases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-900 tracking-tight mt-2">
            {stats.completedCases}
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-emerald-700 font-medium">
            <span>Fully Resettled / Closed</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-700" />
          </div>
        </div>

        {/* 4. Pending Cases */}
        <div
          onClick={() => onNavigateTab('families')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-amber-400 hover:shadow-sm transition cursor-pointer group"
          id="kpi-pending-cases"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Pending Cases</span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-900 tracking-tight mt-2">
            {stats.pendingCases}
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-amber-700 font-medium">
            <span>In Process / Benefits Due</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-700" />
          </div>
        </div>

        {/* 5. Delayed Cases */}
        <div
          onClick={() => onNavigateTab('plans')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-rose-400 hover:shadow-sm transition cursor-pointer group"
          id="kpi-delayed-cases"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Delayed Cases</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-rose-900 tracking-tight mt-2">
            {stats.delayedCases}
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-rose-700 font-medium">
            <span>Milestone Lapsed</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400 group-hover:text-rose-700" />
          </div>
        </div>

        {/* 6. Compensation / R&R Benefits Status */}
        <div
          onClick={() => onNavigateTab('benefits')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-teal-400 hover:shadow-sm transition cursor-pointer group"
          id="kpi-benefits-status"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">R&R Benefits Disbursed</span>
            <IndianRupee className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-teal-900 tracking-tight mt-2">
            ₹{(stats.totalBenefitsDisbursed / 100000).toFixed(2)} L
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-teal-700 font-medium">
            <span>Approved: ₹{(stats.totalBenefitsApproved / 100000).toFixed(2)} L</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-teal-400 group-hover:text-teal-700" />
          </div>
        </div>

        {/* 7. Grievances Pending */}
        <div
          onClick={() => onNavigateTab('grievances')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-orange-400 hover:shadow-sm transition cursor-pointer group"
          id="kpi-grievances-pending"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800">Pending Grievances</span>
            <MessageSquareWarning className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-orange-900 tracking-tight mt-2">
            {stats.pendingGrievances}
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-orange-700 font-medium">
            <span>Total Logged: {filteredGrievances.length}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-orange-400 group-hover:text-orange-700" />
          </div>
        </div>

        {/* 8. R&R Completion Percentage */}
        <div
          onClick={() => onNavigateTab('progress')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-blue-400 hover:shadow-sm transition cursor-pointer group"
          id="kpi-rr-completion-percent"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">R&R Completion %</span>
            <TrendingUp className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-blue-900 tracking-tight mt-2">
            {stats.rrCompletionPercent}%
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, stats.rrCompletionPercent))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Progress Pipeline & Statutory Schedule Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 7-Stage Pipeline Overview */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Statutory R&R Lifecycle Status
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Seven-stage statutory workflow progression under RFCTLARR Act 2013
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('progress')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View Family Timelines</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {[
              { label: 'Surveyed', count: filteredFamilies.filter(f => f.currentStatus === 'Surveyed').length, color: 'bg-slate-100 text-slate-800 border-slate-200' },
              { label: 'Verified', count: filteredFamilies.filter(f => f.currentStatus === 'Eligibility Verified').length, color: 'bg-blue-50 text-blue-800 border-blue-200' },
              { label: 'Plan Formulated', count: filteredFamilies.filter(f => f.currentStatus === 'Plan Formulated').length, color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
              { label: 'Benefits in Progress', count: filteredFamilies.filter(f => f.currentStatus === 'Benefits In Progress').length, color: 'bg-amber-50 text-amber-800 border-amber-200' },
              { label: 'Benefits Delivered', count: filteredFamilies.filter(f => f.currentStatus === 'Benefits Delivered').length, color: 'bg-teal-50 text-teal-800 border-teal-200' },
              { label: 'Resettled', count: filteredFamilies.filter(f => f.currentStatus === 'Resettled').length, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
              { label: 'Case Closed', count: filteredFamilies.filter(f => f.currentStatus === 'Closed').length, color: 'bg-purple-50 text-purple-800 border-purple-200' }
            ].map(stage => (
              <div key={stage.label} className={`border rounded-lg p-3 ${stage.color}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider block">{stage.label}</span>
                <span className="text-xl font-black mt-1 block">{stage.count}</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {stats.totalAffectedFamilies > 0 ? Math.round((stage.count / stats.totalAffectedFamilies) * 100) : 0}% of families
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Statutory Mandate: No physical possession can be executed without complete housing & shifting package disbursement under Section 38(1).
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('benefits')}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 font-bold hover:bg-slate-50 shrink-0 cursor-pointer"
            >
              Verify Disbursements
            </button>
          </div>
        </div>

        {/* Right: Resettlement Colonies & Civic Infrastructure Quick View */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Resettlement Colonies
              </h2>
              <p className="text-xs text-slate-500 font-medium">Schedule III Civic Infrastructure</p>
            </div>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {resettlementSites.slice(0, 3).map(site => (
              <div key={site.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{site.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{site.location}</p>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    {site.plotsAllotted} / {site.plotsDeveloped} Plots
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${site.plotsDeveloped > 0 ? (site.plotsAllotted / site.plotsDeveloped) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('plans')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Open Schedule III Amenities Tracker →
          </button>
        </div>
      </div>
    </div>
  );
};
