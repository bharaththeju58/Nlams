import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectSector } from '../types';
import {
  X,
  Upload,
  FileCheck,
  Building,
  Calendar,
  Layers,
  MapPin,
  IndianRupee,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ProjectProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTORS: ProjectSector[] = [
  'Highways',
  'Railways',
  'Irrigation',
  'Urban Infrastructure',
  'Renewable Energy',
  'Other Infrastructure'
];

export const ProjectProposalModal: React.FC<ProjectProposalModalProps> = ({ isOpen, onClose }) => {
  const { addProject, role } = useApp();

  const [name, setName] = useState('');
  const [sector, setSector] = useState<ProjectSector>('Highways');
  const [requiringBody, setRequiringBody] = useState('National Highways Authority of India (NHAI)');
  const [state, setState] = useState('Madhya Pradesh');
  const [district, setDistrict] = useState('Indore');
  const [estimatedLandAcres, setEstimatedLandAcres] = useState('1850');
  const [numberOfVillages, setNumberOfVillages] = useState('12');
  const [projectCostCrores, setProjectCostCrores] = useState('2400');
  const [compensationBudgetCrores, setCompensationBudgetCrores] = useState('420');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [expectedCompletionDate, setExpectedCompletionDate] = useState('2028-12-31');
  const [uploadedAlignmentMap, setUploadedAlignmentMap] = useState<string | null>('alignment-map-indore-bypass-geo.kmz');
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([
    'Detailed_Project_Report_V1.pdf',
    'State_In_Principle_Clearance.pdf'
  ]);

  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (isDraft: boolean) => {
    if (!name.trim()) {
      setValidationError('Please enter the official project name.');
      return;
    }
    if (!estimatedLandAcres || Number(estimatedLandAcres) <= 0) {
      setValidationError('Please specify a valid estimated land area in acres.');
      return;
    }

    addProject({
      name,
      sector,
      requiringBody,
      state,
      district,
      estimatedLandAcres: Number(estimatedLandAcres),
      numberOfVillages: Number(numberOfVillages) || 1,
      projectCostCrores: Number(projectCostCrores) || 100,
      compensationBudgetCrores: Number(compensationBudgetCrores) || 20,
      startDate,
      expectedCompletionDate,
      status: isDraft ? 'Proposal Submitted' : 'Under Scrutiny',
      scrutinyStatus: 'Pending',
      alignmentMapUrl: uploadedAlignmentMap ? `https://nlams.gov.in/gis/docs/${uploadedAlignmentMap}` : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-800 text-blue-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                Section 4 Requisition
              </span>
              <span className="text-xs text-blue-200">Form I - LARR Rules</span>
            </div>
            <h2 className="text-lg font-bold mt-1">Submit New Infrastructure Project Proposal</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Lifecycle Preview Bar */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 text-xs text-slate-600 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">1. Proposal Submission</span>
          <span>→</span>
          <span className="text-slate-500">2. Scrutiny</span>
          <span>→</span>
          <span className="text-slate-500">3. Cadastral Survey</span>
          <span>→</span>
          <span className="text-slate-500">4. Sec 11 Notice</span>
          <span>→</span>
          <span className="text-slate-500">5. Sec 19 Notice</span>
          <span>→</span>
          <span className="text-slate-500">6. Award</span>
          <span>→</span>
          <span className="text-slate-500">7. Compensation</span>
          <span>→</span>
          <span className="text-slate-500">8. Possession</span>
          <span>→</span>
          <span className="text-slate-500">9. R&R</span>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 1: Basic Identifiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Project Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Indore-Bhopal Greenfield Economic Highway Corridor"
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Requiring Body / Dept</label>
              <input
                type="text"
                value={requiringBody}
                onChange={(e) => setRequiringBody(e.target.value)}
                placeholder="e.g., NHAI / DFCCIL / State PWD"
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Infrastructure Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as ProjectSector)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-blue-600"
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-blue-600"
              />
            </div>
          </div>

          {/* Section 2: Land Scope & Financials */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-700" />
              Land Scope & Financial Outlay
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Land (Acres)</label>
                <input
                  type="number"
                  value={estimatedLandAcres}
                  onChange={(e) => setEstimatedLandAcres(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Affected Villages</label>
                <input
                  type="number"
                  value={numberOfVillages}
                  onChange={(e) => setNumberOfVillages(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Cost (₹ Cr)</label>
                <input
                  type="number"
                  value={projectCostCrores}
                  onChange={(e) => setProjectCostCrores(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Compensation Budget (₹ Cr)</label>
                <input
                  type="number"
                  value={compensationBudgetCrores}
                  onChange={(e) => setCompensationBudgetCrores(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Schedule */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-700" />
              Proposed Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expected Commencement Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Completion Date</label>
                <input
                  type="date"
                  value={expectedCompletionDate}
                  onChange={(e) => setExpectedCompletionDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Map & Document Uploads */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-blue-700" />
              Alignment Map & Supporting Documents
            </h3>

            {/* Alignment Map */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-3.5 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-7 h-7 text-blue-700 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Geo-Referenced Alignment Map (KML / Shapefile)</p>
                  <p className="text-[11px] text-slate-500">
                    {uploadedAlignmentMap || 'No file selected. Supported: .kml, .kmz, .shp, .geojson'}
                  </p>
                </div>
              </div>
              <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded font-bold text-xs flex-shrink-0 transition-colors">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadedAlignmentMap(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>

            {/* Uploaded Documents List */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Mandatory Statutory Documents</label>
              {uploadedDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1.5 rounded text-xs">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {doc}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Uploaded & Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-5 py-2 text-xs font-bold bg-blue-800 hover:bg-blue-900 text-white rounded-md shadow-xs transition-colors"
            >
              Submit Proposal for Scrutiny
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
