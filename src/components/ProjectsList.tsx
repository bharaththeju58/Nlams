import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Project, ProjectSector, ProjectStatus } from '../types';
import { ProjectProposalModal } from './ProjectProposalModal';
import { ScrutinyModule } from './ScrutinyModule';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MapPin,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  Eye,
  FileCheck2,
  Calendar
} from 'lucide-react';

export const ProjectsList: React.FC = () => {
  const { t } = useTranslation();
  const {
    projects,
    setActiveTab,
    setSelectedProjectId,
    role
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [scrutinyProject, setScrutinyProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.requiringBody.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSector = sectorFilter === 'All' || p.sector === sectorFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchState = stateFilter === 'All' || p.state === stateFilter;
    return matchSearch && matchSector && matchStatus && matchState;
  });

  const states = Array.from(new Set(projects.map(p => p.state)));

  // If currently examining scrutiny for a project, show ScrutinyModule
  if (scrutinyProject) {
    return (
      <ScrutinyModule
        project={scrutinyProject}
        onBack={() => setScrutinyProject(null)}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-200 uppercase tracking-widest">
              {t('projects.nationalPortfolio', 'National Infrastructure Portfolio')}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('projects.lifecycleMonitoring', 'Lifecycle Monitoring')}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            {t('projects.title', 'Infrastructure Projects & Requisitions')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('projects.subtitle', 'Monitor Section 4 proposals, statutory scrutiny, cadastral surveys, Gazette notifications, and land possession')}
          </p>
        </div>

        <button
          onClick={() => setShowProposalModal(true)}
          className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-black text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors uppercase tracking-wider self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t('projects.addProject', 'Submit Project Proposal (Sec 4)')}
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t('projects.searchPlaceholder', 'Search by project name, requiring body, ID, district...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 font-bold text-xs focus:outline-blue-600 focus:bg-white shadow-2xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-700 text-xs shadow-2xs"
          >
            <option value="All">{t('projects.allSectors', 'All Sectors')}</option>
            <option value="Highways">{t('projects.highways', 'Highways')}</option>
            <option value="Railways">{t('projects.railways', 'Railways')}</option>
            <option value="Irrigation">{t('projects.irrigation', 'Irrigation')}</option>
            <option value="Urban Infrastructure">{t('projects.urban', 'Urban Infrastructure')}</option>
            <option value="Renewable Energy">{t('projects.energy', 'Renewable Energy')}</option>
            <option value="Other Infrastructure">{t('projects.other', 'Other Infrastructure')}</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-700 text-xs shadow-2xs"
          >
            <option value="All">{t('projects.allStates', 'All States')}</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-700 text-xs shadow-2xs"
          >
            <option value="All">{t('projects.allStages', 'All Lifecycle Stages')}</option>
            <option value="Proposal Submitted">{t('stages.proposal', 'Proposal Submitted')}</option>
            <option value="Under Scrutiny">{t('stages.scrutiny', 'Under Scrutiny')}</option>
            <option value="Preliminary Notification Published">{t('stages.sec11', 'Preliminary Notification')}</option>
            <option value="Final Declaration Published">{t('stages.sec19', 'Final Declaration')}</option>
            <option value="Award Declared">{t('stages.award', 'Award Declared')}</option>
            <option value="Compensation Disbursement">{t('stages.compensation', 'Compensation Disbursement')}</option>
            <option value="Possession Handover">{t('stages.possession', 'Possession Handover')}</option>
            <option value="R&R Implementation">{t('stages.rr', 'R&R Implementation')}</option>
          </select>
        </div>
      </div>

      {/* Projects List View */}
      <div className="space-y-4">
        {filteredProjects.map(project => {
          const acquisitionPercent = project.estimatedLandAcres > 0
            ? Math.round((project.acquiredLandAcres / project.estimatedLandAcres) * 100)
            : 0;

          return (
            <div
              key={project.id}
              className="bg-white border-l-4 border-blue-600 p-5 shadow-sm rounded-lg border-y border-r border-slate-200 hover:shadow-md transition-all text-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Project Identifiers */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {project.id}
                    </span>
                    <span className="bg-slate-100 text-slate-800 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                      {project.sector}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      project.scrutinyStatus === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : project.scrutinyStatus === 'Clarification Requested'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {t('stages.scrutiny', 'Scrutiny')}: {project.scrutinyStatus}
                    </span>
                    {project.delayed && (
                      <span className="bg-red-100 text-red-800 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {t('common.delayAlert', 'Statutory Delay')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    {project.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-slate-600 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {t('projects.requiringBody', 'Requiring Body')}: <strong className="text-slate-900 font-bold">{project.requiringBody}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {t('projects.location', 'Location')}: <strong className="text-slate-900 font-bold">{project.district}, {project.state}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {t('projects.villages', 'Villages')}: <strong className="text-slate-900 font-bold">{project.numberOfVillages}</strong>
                    </span>
                  </div>
                </div>

                {/* Progress & Financials Box */}
                <div className="flex flex-col sm:flex-row lg:flex-col justify-between gap-3 lg:w-72 lg:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div>
                    <div className="flex justify-between lg:justify-end gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      <span>{t('projects.progress', 'Land Possession')}:</span>
                      <span className="font-black text-slate-900">
                        {project.acquiredLandAcres} / {project.estimatedLandAcres} {t('common.acres', 'Acres')} ({acquisitionPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${acquisitionPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600">
                    <div>{t('projects.cost', 'Project Cost')}: <strong className="text-slate-900 font-black">₹{project.projectCostCrores} Cr</strong></div>
                    <div>{t('projects.compensationBudget', 'Compensation Budget')}: <strong className="text-slate-900 font-black">₹{project.compensationBudgetCrores} Cr</strong></div>
                  </div>
                </div>
              </div>

              {/* Lifecycle Stage Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">{t('projects.activeStage', 'Active Stage')}:</span>
                  <span className="font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider text-[10px]">
                    {project.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setScrutinyProject(project)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg font-black uppercase tracking-wider text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    {t('projects.scrutiny', 'Examine Scrutiny')}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setActiveTab('GIS Map');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-black uppercase tracking-wider text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {t('nav.gisMap', 'GIS Parcels')}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setActiveTab('Notifications');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-black uppercase tracking-wider text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {t('nav.notifications', 'Notifications (Sec 11/19)')}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setActiveTab('Awards');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-black uppercase tracking-wider text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {t('nav.awards', 'Awards')} &rarr;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Proposal Modal */}
      <ProjectProposalModal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
      />
    </div>
  );
};
