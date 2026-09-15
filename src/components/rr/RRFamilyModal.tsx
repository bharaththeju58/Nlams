import React, { useState, useEffect } from 'react';
import { AffectedFamily, Project } from '../../types';
import { X, Save, ShieldAlert, User, MapPin, Phone, Home, CheckCircle2 } from 'lucide-react';

interface RRFamilyModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'view';
  initialData?: AffectedFamily | null;
  projects: Project[];
  onClose: () => void;
  onSave: (familyData: any) => Promise<void>;
}

export const RRFamilyModal: React.FC<RRFamilyModalProps> = ({
  isOpen,
  mode,
  initialData,
  projects,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || 'PRJ-2025-0101',
    state: 'Tamil Nadu',
    district: 'Krishnagiri',
    village: '',
    headOfFamily: '',
    familyMembersCount: 4,
    landAcquiredAcres: 2.5,
    displacementStatus: 'Physically Displaced' as AffectedFamily['displacementStatus'],
    rrEligibility: 'Eligible' as AffectedFamily['rrEligibility'],
    contact: '',
    currentStatus: 'Surveyed' as AffectedFamily['currentStatus'],
    category: 'Small/Marginal Farmer' as AffectedFamily['category'],
    housingOption: 'Constructed House',
    oneTimeGrant: 50000,
    annuityOption: 'Lump-sum ₹5,00,000',
    resettlementSiteName: 'Shoolagiri R&R Modern Township Colony'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && (mode === 'edit' || mode === 'view')) {
      setFormData({
        projectId: initialData.projectId || projects[0]?.id || 'PRJ-2025-0101',
        state: initialData.state || 'Tamil Nadu',
        district: initialData.district || '',
        village: initialData.village || '',
        headOfFamily: initialData.headOfFamily || initialData.name || '',
        familyMembersCount: initialData.familyMembersCount || 4,
        landAcquiredAcres: initialData.landAcquiredAcres || 0,
        displacementStatus: initialData.displacementStatus || 'Physically Displaced',
        rrEligibility: initialData.rrEligibility || 'Eligible',
        contact: initialData.contact || '',
        currentStatus: initialData.currentStatus || 'Surveyed',
        category: initialData.category || 'General',
        housingOption: initialData.entitlements?.housingUnitOrCash || 'Constructed House',
        oneTimeGrant: initialData.entitlements?.oneTimeGrant || 50000,
        annuityOption: initialData.entitlements?.annuityOrLumpSum || 'Lump-sum ₹5,00,000',
        resettlementSiteName: initialData.entitlements?.resettlementSiteName || ''
      });
    } else {
      setFormData({
        projectId: projects[0]?.id || 'PRJ-2025-0101',
        state: 'Tamil Nadu',
        district: '',
        village: '',
        headOfFamily: '',
        familyMembersCount: 4,
        landAcquiredAcres: 2.0,
        displacementStatus: 'Physically Displaced',
        rrEligibility: 'Eligible',
        contact: '',
        currentStatus: 'Surveyed',
        category: 'Small/Marginal Farmer',
        housingOption: 'Constructed House',
        oneTimeGrant: 50000,
        annuityOption: 'Lump-sum ₹5,00,000',
        resettlementSiteName: ''
      });
    }
    setErrors({});
  }, [initialData, mode, projects]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.headOfFamily.trim()) {
      errs.headOfFamily = 'Head of Family name is required';
    }
    if (!formData.district.trim()) {
      errs.district = 'District is required';
    }
    if (!formData.village.trim()) {
      errs.village = 'Village / Settlement name is required';
    }
    if (!formData.contact.trim()) {
      errs.contact = 'Contact information is required';
    } else if (formData.contact.replace(/\D/g, '').length < 10) {
      errs.contact = 'Enter a valid 10-digit phone number';
    }
    if (!formData.familyMembersCount || formData.familyMembersCount < 1) {
      errs.familyMembersCount = 'Family members count must be at least 1';
    }
    if (formData.landAcquiredAcres < 0) {
      errs.landAcquiredAcres = 'Land acquired cannot be negative';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        name: formData.headOfFamily,
        landAcquired: `${formData.landAcquiredAcres.toFixed(2)} Acres`,
        entitlements: {
          housingUnitOrCash: formData.housingOption,
          oneTimeGrant: formData.oneTimeGrant,
          annuityOrLumpSum: formData.annuityOption,
          resettlementSiteName: formData.resettlementSiteName
        },
        workflowStatus: (formData.currentStatus === 'Resettled' || formData.currentStatus === 'Closed')
          ? 'Closed'
          : formData.currentStatus === 'Benefits Delivered'
          ? 'Benefit Delivered'
          : formData.currentStatus === 'Benefits In Progress' || formData.currentStatus === 'Plan Formulated'
          ? 'Benefit Approved'
          : 'Registered',
        housingStatus: formData.currentStatus === 'Resettled' || formData.currentStatus === 'Closed' ? 'Possession Given' : 'Allotted',
        livelihoodStatus: formData.currentStatus === 'Resettled' ? 'Grant Credited' : 'Pending',
        resettlementStatus: formData.currentStatus === 'Resettled' ? 'Settled' : 'Pending'
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              RFCTLARR Second Schedule • Section 31
            </span>
            <h2 className="text-base font-black text-slate-900">
              {mode === 'add' && 'Register New Affected Family'}
              {mode === 'edit' && `Edit Affected Family Dossier: ${initialData?.id}`}
              {mode === 'view' && `Family Dossier Details: ${initialData?.id}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Project & Geography */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project <span className="text-rose-500">*</span>
              </label>
              <select
                disabled={isReadOnly}
                value={formData.projectId}
                onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600 disabled:bg-slate-100"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                District <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                placeholder="e.g. Krishnagiri"
                className={`w-full bg-slate-50 border rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600 disabled:bg-slate-100 ${
                  errors.district ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {errors.district && <p className="text-[10px] text-rose-600 mt-0.5">{errors.district}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Village / Tehsil <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.village}
                onChange={e => setFormData({ ...formData, village: e.target.value })}
                placeholder="e.g. Kamandoddi"
                className={`w-full bg-slate-50 border rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600 disabled:bg-slate-100 ${
                  errors.village ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {errors.village && <p className="text-[10px] text-rose-600 mt-0.5">{errors.village}</p>}
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Head of Family (Full Name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.headOfFamily}
                onChange={e => setFormData({ ...formData, headOfFamily: e.target.value })}
                placeholder="e.g. P. Muniswamy Gounder"
                className={`w-full bg-slate-50 border rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600 disabled:bg-slate-100 ${
                  errors.headOfFamily ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {errors.headOfFamily && <p className="text-[10px] text-rose-600 mt-0.5">{errors.headOfFamily}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.contact}
                onChange={e => setFormData({ ...formData, contact: e.target.value })}
                placeholder="+91 98402 11022"
                className={`w-full bg-slate-50 border rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600 disabled:bg-slate-100 ${
                  errors.contact ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {errors.contact && <p className="text-[10px] text-rose-600 mt-0.5">{errors.contact}</p>}
            </div>
          </div>

          {/* Social Category & Family Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Social / Land Category
              </label>
              <select
                disabled={isReadOnly}
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600 disabled:bg-slate-100"
              >
                <option value="Small/Marginal Farmer">Small/Marginal Farmer</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="OBC">Other Backward Class (OBC)</option>
                <option value="General">General Category</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Number of Members <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                disabled={isReadOnly}
                value={formData.familyMembersCount}
                onChange={e => setFormData({ ...formData, familyMembersCount: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600 disabled:bg-slate-100"
              />
              {errors.familyMembersCount && <p className="text-[10px] text-rose-600 mt-0.5">{errors.familyMembersCount}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Land Acquired (Acres)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                disabled={isReadOnly}
                value={formData.landAcquiredAcres}
                onChange={e => setFormData({ ...formData, landAcquiredAcres: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600 disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Displacement & R&R Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Displacement Status
              </label>
              <select
                disabled={isReadOnly}
                value={formData.displacementStatus}
                onChange={e => setFormData({ ...formData, displacementStatus: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600 disabled:bg-slate-100"
              >
                <option value="Physically Displaced">Physically Displaced (House Acquired)</option>
                <option value="Economically Displaced">Economically Displaced (Livelihood Loss)</option>
                <option value="Both">Both (Physical & Economic)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                R&R Eligibility
              </label>
              <select
                disabled={isReadOnly}
                value={formData.rrEligibility}
                onChange={e => setFormData({ ...formData, rrEligibility: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600 disabled:bg-slate-100"
              >
                <option value="Eligible">Eligible (Under 2nd Schedule)</option>
                <option value="Under Review">Under Review (Document Verification)</option>
                <option value="Ineligible">Ineligible (Does Not Qualify)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Status
              </label>
              <select
                disabled={isReadOnly}
                value={formData.currentStatus}
                onChange={e => setFormData({ ...formData, currentStatus: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-blue-600 disabled:bg-slate-100"
              >
                <option value="Surveyed">1. Surveyed</option>
                <option value="Eligibility Verified">2. Eligibility Verified</option>
                <option value="Plan Formulated">3. Plan Formulated</option>
                <option value="Benefits In Progress">4. Benefits In Progress</option>
                <option value="Benefits Delivered">5. Benefits Delivered</option>
                <option value="Resettled">6. Resettled</option>
                <option value="Closed">7. Case Closed</option>
              </select>
            </div>
          </div>

          {/* Statutory Entitlements Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-blue-600" />
              Statutory Entitlements (Second Schedule RFCTLARR)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Housing Assistance</label>
                <select
                  disabled={isReadOnly}
                  value={formData.housingOption}
                  onChange={e => setFormData({ ...formData, housingOption: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800"
                >
                  <option value="Constructed House">Constructed House in Resettlement Colony</option>
                  <option value="Cash Assistance ₹1.5L">Cash Assistance ₹1,50,000 (Self Construction)</option>
                  <option value="Exempt">Not Applicable / Retained Structure</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Resettlement Site</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.resettlementSiteName}
                  onChange={e => setFormData({ ...formData, resettlementSiteName: e.target.value })}
                  placeholder="e.g. Shoolagiri Modern Township Colony"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">One-Time Shifting Grant (₹)</label>
                <input
                  type="number"
                  disabled={isReadOnly}
                  value={formData.oneTimeGrant}
                  onChange={e => setFormData({ ...formData, oneTimeGrant: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Annuity / Employment Option</label>
                <select
                  disabled={isReadOnly}
                  value={formData.annuityOption}
                  onChange={e => setFormData({ ...formData, annuityOption: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800"
                >
                  <option value="Lump-sum ₹5,00,000">Lump-sum Grant ₹5,00,000</option>
                  <option value="₹2,000/month for 20 yrs">Monthly Annuity ₹2,000 / month (20 Years)</option>
                  <option value="Mandatory Job Offer">Mandatory Government / Project Job</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-[11px] text-slate-500 font-medium">
            {isReadOnly ? 'Viewing statutory record' : 'All updates are cryptographically hashed and logged to audit trail'}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : mode === 'add' ? 'Save Family' : 'Update Family'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
