import {
  AffectedFamily,
  RRPlan,
  RRBenefit,
  RRGrievance,
  RRDocument,
  RRProgressRecord,
  RRRuleAlert
} from '../types';
import {
  INITIAL_RR_FAMILIES,
  INITIAL_RR_PLANS,
  INITIAL_RR_BENEFITS,
  INITIAL_RR_GRIEVANCES,
  INITIAL_RR_DOCUMENTS,
  INITIAL_RR_PROGRESS
} from '../data/rrInitialData';

const STORAGE_KEYS = {
  FAMILIES: 'nlams_rr_families_v2',
  PLANS: 'nlams_rr_plans_v2',
  BENEFITS: 'nlams_rr_benefits_v2',
  GRIEVANCES: 'nlams_rr_grievances_v2',
  DOCUMENTS: 'nlams_rr_documents_v2',
  PROGRESS: 'nlams_rr_progress_v2'
};

// Safe localStorage helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('Local storage write error:', err);
  }
}

export const rrApiService = {
  // 1. STATS
  async getStats(projectId?: string): Promise<{
    totalAffectedFamilies: number;
    totalPlans: number;
    activePlans: number;
    completedCases: number;
    pendingCases: number;
    delayedCases: number;
    totalBenefitsApproved: number;
    totalBenefitsDisbursed: number;
    pendingGrievances: number;
    rrCompletionPercent: number;
  }> {
    try {
      const res = await fetch(`/api/rr/stats${projectId ? `?projectId=${projectId}` : ''}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const families = await this.getFamilies(projectId);
    const plans = await this.getPlans(projectId);
    const benefits = await this.getBenefits(projectId);
    const grievances = await this.getGrievances(projectId);

    const totalAffectedFamilies = families.length;
    const completedCases = families.filter(f => f.currentStatus === 'Resettled' || f.currentStatus === 'Closed' || f.workflowStatus === 'Closed').length;
    const pendingCases = totalAffectedFamilies - completedCases;
    
    // Delayed rule: plan marked Delayed or past due date, or benefit delayed
    const delayedPlans = plans.filter(p => p.status === 'Delayed').length;
    const delayedBenefits = benefits.filter(b => b.status === 'Delayed').length;
    const delayedCases = delayedPlans + delayedBenefits;

    const totalBenefitsApproved = benefits.reduce((sum, b) => sum + (b.approved ? b.approvedAmount || b.eligibleAmount : 0), 0);
    const totalBenefitsDisbursed = benefits.reduce((sum, b) => sum + (b.disbursed ? b.disbursedAmount : 0), 0);
    const pendingGrievances = grievances.filter(g => g.status === 'Open' || g.status === 'Under Review').length;
    const rrCompletionPercent = totalAffectedFamilies > 0 ? Math.round((completedCases / totalAffectedFamilies) * 100) : 0;

    return {
      totalAffectedFamilies,
      totalPlans: plans.length,
      activePlans: plans.filter(p => p.status === 'In Progress').length,
      completedCases,
      pendingCases,
      delayedCases,
      totalBenefitsApproved,
      totalBenefitsDisbursed,
      pendingGrievances,
      rrCompletionPercent
    };
  },

  // 2. FAMILIES
  async getFamilies(projectId?: string): Promise<AffectedFamily[]> {
    try {
      const res = await fetch(`/api/rr/families${projectId ? `?projectId=${projectId}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.FAMILIES, data);
        return data;
      }
    } catch {
      // Fallback
    }
    const local = getLocal<AffectedFamily[]>(STORAGE_KEYS.FAMILIES, INITIAL_RR_FAMILIES);
    return projectId ? local.filter(f => f.projectId === projectId) : local;
  },

  async addFamily(familyData: Omit<AffectedFamily, 'id'>): Promise<AffectedFamily> {
    const id = `FAM-${familyData.district ? familyData.district.slice(0, 3).toUpperCase() : 'IND'}-${String(Date.now()).slice(-4)}`;
    const newFamily: AffectedFamily = {
      ...familyData,
      id,
      name: familyData.name || familyData.headOfFamily,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch('/api/rr/families', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFamily)
      });
      if (res.ok) {
        const saved = await res.json();
        const current = getLocal<AffectedFamily[]>(STORAGE_KEYS.FAMILIES, INITIAL_RR_FAMILIES);
        setLocal(STORAGE_KEYS.FAMILIES, [saved, ...current]);
        return saved;
      }
    } catch {
      // Local fallback
    }

    const current = getLocal<AffectedFamily[]>(STORAGE_KEYS.FAMILIES, INITIAL_RR_FAMILIES);
    const updated = [newFamily, ...current];
    setLocal(STORAGE_KEYS.FAMILIES, updated);
    return newFamily;
  },

  async updateFamily(id: string, updates: Partial<AffectedFamily>): Promise<AffectedFamily> {
    try {
      const res = await fetch(`/api/rr/families/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocal<AffectedFamily[]>(STORAGE_KEYS.FAMILIES, INITIAL_RR_FAMILIES);
        setLocal(STORAGE_KEYS.FAMILIES, current.map(f => f.id === id ? updated : f));
        return updated;
      }
    } catch {
      // Local fallback
    }

    const current = getLocal<AffectedFamily[]>(STORAGE_KEYS.FAMILIES, INITIAL_RR_FAMILIES);
    let updatedItem: AffectedFamily = current.find(f => f.id === id)!;
    const nextList = current.map(f => {
      if (f.id === id) {
        updatedItem = { ...f, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
        return updatedItem;
      }
      return f;
    });
    setLocal(STORAGE_KEYS.FAMILIES, nextList);
    return updatedItem;
  },

  async deleteFamily(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/rr/families/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const current = getLocal<AffectedFamily[]>(STORAGE_KEYS.FAMILIES, INITIAL_RR_FAMILIES);
        setLocal(STORAGE_KEYS.FAMILIES, current.filter(f => f.id !== id));
        return true;
      }
    } catch {
      // Local fallback
    }

    const current = getLocal<AffectedFamily[]>(STORAGE_KEYS.FAMILIES, INITIAL_RR_FAMILIES);
    setLocal(STORAGE_KEYS.FAMILIES, current.filter(f => f.id !== id));
    return true;
  },

  // 3. PLANS
  async getPlans(projectId?: string): Promise<RRPlan[]> {
    try {
      const res = await fetch(`/api/rr/plans${projectId ? `?projectId=${projectId}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.PLANS, data);
        return data;
      }
    } catch {
      // Fallback
    }
    const local = getLocal<RRPlan[]>(STORAGE_KEYS.PLANS, INITIAL_RR_PLANS);
    return projectId ? local.filter(p => p.projectId === projectId) : local;
  },

  async createPlan(planData: Omit<RRPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<RRPlan> {
    const id = `RRP-${new Date().getFullYear()}-0${Math.floor(100 + Math.random() * 900)}`;
    const newPlan: RRPlan = {
      ...planData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch('/api/rr/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlan)
      });
      if (res.ok) {
        const saved = await res.json();
        const current = getLocal<RRPlan[]>(STORAGE_KEYS.PLANS, INITIAL_RR_PLANS);
        setLocal(STORAGE_KEYS.PLANS, [saved, ...current]);
        return saved;
      }
    } catch {
      // Local fallback
    }

    const current = getLocal<RRPlan[]>(STORAGE_KEYS.PLANS, INITIAL_RR_PLANS);
    setLocal(STORAGE_KEYS.PLANS, [newPlan, ...current]);
    return newPlan;
  },

  async updatePlan(id: string, updates: Partial<RRPlan>): Promise<RRPlan> {
    try {
      const res = await fetch(`/api/rr/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocal<RRPlan[]>(STORAGE_KEYS.PLANS, INITIAL_RR_PLANS);
        setLocal(STORAGE_KEYS.PLANS, current.map(p => p.id === id ? updated : p));
        return updated;
      }
    } catch {
      // Local fallback
    }

    const current = getLocal<RRPlan[]>(STORAGE_KEYS.PLANS, INITIAL_RR_PLANS);
    let updatedPlan: RRPlan = current.find(p => p.id === id)!;
    const nextList = current.map(p => {
      if (p.id === id) {
        updatedPlan = { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
        return updatedPlan;
      }
      return p;
    });
    setLocal(STORAGE_KEYS.PLANS, nextList);
    return updatedPlan;
  },

  async deletePlan(id: string): Promise<boolean> {
    try {
      await fetch(`/api/rr/plans/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    const current = getLocal<RRPlan[]>(STORAGE_KEYS.PLANS, INITIAL_RR_PLANS);
    setLocal(STORAGE_KEYS.PLANS, current.filter(p => p.id !== id));
    return true;
  },

  // 4. BENEFITS
  async getBenefits(projectId?: string, familyId?: string): Promise<RRBenefit[]> {
    try {
      let url = '/api/rr/benefits';
      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      if (familyId) params.append('familyId', familyId);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.BENEFITS, data);
        return data;
      }
    } catch {
      // Fallback
    }

    let local = getLocal<RRBenefit[]>(STORAGE_KEYS.BENEFITS, INITIAL_RR_BENEFITS);
    if (projectId) local = local.filter(b => b.projectId === projectId);
    if (familyId) local = local.filter(b => b.familyId === familyId);
    return local;
  },

  async addBenefit(benefitData: Omit<RRBenefit, 'id'>): Promise<RRBenefit> {
    const id = `BNF-${String(Date.now()).slice(-4)}`;
    const newBenefit: RRBenefit = {
      ...benefitData,
      id
    };

    try {
      const res = await fetch('/api/rr/benefits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBenefit)
      });
      if (res.ok) {
        const saved = await res.json();
        const current = getLocal<RRBenefit[]>(STORAGE_KEYS.BENEFITS, INITIAL_RR_BENEFITS);
        setLocal(STORAGE_KEYS.BENEFITS, [saved, ...current]);
        return saved;
      }
    } catch {
      // Local fallback
    }

    const current = getLocal<RRBenefit[]>(STORAGE_KEYS.BENEFITS, INITIAL_RR_BENEFITS);
    setLocal(STORAGE_KEYS.BENEFITS, [newBenefit, ...current]);
    return newBenefit;
  },

  async updateBenefit(id: string, updates: Partial<RRBenefit>): Promise<RRBenefit> {
    try {
      const res = await fetch(`/api/rr/benefits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocal<RRBenefit[]>(STORAGE_KEYS.BENEFITS, INITIAL_RR_BENEFITS);
        setLocal(STORAGE_KEYS.BENEFITS, current.map(b => b.id === id ? updated : b));
        return updated;
      }
    } catch {
      // Local fallback
    }

    const current = getLocal<RRBenefit[]>(STORAGE_KEYS.BENEFITS, INITIAL_RR_BENEFITS);
    let updatedItem: RRBenefit = current.find(b => b.id === id)!;
    const nextList = current.map(b => {
      if (b.id === id) {
        updatedItem = { ...b, ...updates };
        return updatedItem;
      }
      return b;
    });
    setLocal(STORAGE_KEYS.BENEFITS, nextList);
    return updatedItem;
  },

  async deleteBenefit(id: string): Promise<boolean> {
    try {
      await fetch(`/api/rr/benefits/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    const current = getLocal<RRBenefit[]>(STORAGE_KEYS.BENEFITS, INITIAL_RR_BENEFITS);
    setLocal(STORAGE_KEYS.BENEFITS, current.filter(b => b.id !== id));
    return true;
  },

  // 5. PROGRESS
  async getProgress(familyId: string): Promise<RRProgressRecord | null> {
    try {
      const res = await fetch(`/api/rr/progress/${familyId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const list = getLocal<RRProgressRecord[]>(STORAGE_KEYS.PROGRESS, INITIAL_RR_PROGRESS);
    return list.find(p => p.familyId === familyId) || null;
  },

  async updateProgress(familyId: string, stageIndex: number, stageUpdates?: Partial<RRProgressRecord>): Promise<RRProgressRecord> {
    try {
      const res = await fetch(`/api/rr/progress/${familyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageIndex, ...stageUpdates })
      });
      if (res.ok) {
        const updated = await res.json();
        const list = getLocal<RRProgressRecord[]>(STORAGE_KEYS.PROGRESS, INITIAL_RR_PROGRESS);
        setLocal(STORAGE_KEYS.PROGRESS, list.map(p => p.familyId === familyId ? updated : p));
        return updated;
      }
    } catch {
      // Fallback
    }

    const list = getLocal<RRProgressRecord[]>(STORAGE_KEYS.PROGRESS, INITIAL_RR_PROGRESS);
    let existing = list.find(p => p.familyId === familyId);
    const now = new Date().toISOString().split('T')[0];

    if (!existing) {
      existing = {
        id: `PRG-${familyId}`,
        familyId,
        projectId: 'PRJ-2025-0101',
        currentStageIndex: stageIndex,
        stages: [
          { stageNumber: 1, stageKey: 'SURVEY', stageName: 'Affected Family Surveyed', status: 'Completed', updatedAt: now },
          { stageNumber: 2, stageKey: 'ELIGIBILITY', stageName: 'Eligibility Verified', status: stageIndex >= 1 ? 'Completed' : 'Pending', updatedAt: now },
          { stageNumber: 3, stageKey: 'PLAN', stageName: 'R&R Plan Formulated', status: stageIndex >= 2 ? 'Completed' : 'Pending' },
          { stageNumber: 4, stageKey: 'BENEFITS_APPROVED', stageName: 'Benefits Approved', status: stageIndex >= 3 ? 'Completed' : 'Pending' },
          { stageNumber: 5, stageKey: 'BENEFITS_PROVIDED', stageName: 'Benefits Provided', status: stageIndex >= 4 ? 'Completed' : 'Pending' },
          { stageNumber: 6, stageKey: 'RESETTLEMENT', stageName: 'Resettlement Completed', status: stageIndex >= 5 ? 'Completed' : 'Pending' },
          { stageNumber: 7, stageKey: 'CLOSED', stageName: 'Case Closed', status: stageIndex >= 6 ? 'Completed' : 'Pending' }
        ],
        overallStatus: 'Stage ' + (stageIndex + 1),
        updatedAt: now
      };
      setLocal(STORAGE_KEYS.PROGRESS, [existing, ...list]);
      return existing;
    }

    const updatedStages = existing.stages.map((stage, idx) => {
      if (idx < stageIndex) return { ...stage, status: 'Completed' as const };
      if (idx === stageIndex) return { ...stage, status: 'In Progress' as const, updatedAt: now };
      return { ...stage, status: 'Pending' as const };
    });

    const updatedRecord: RRProgressRecord = {
      ...existing,
      currentStageIndex: stageIndex,
      stages: updatedStages,
      overallStatus: updatedStages[stageIndex]?.stageName || 'In Progress',
      updatedAt: now
    };

    setLocal(STORAGE_KEYS.PROGRESS, list.map(p => p.familyId === familyId ? updatedRecord : p));
    return updatedRecord;
  },

  // 6. GRIEVANCES
  async getGrievances(projectId?: string): Promise<RRGrievance[]> {
    try {
      const res = await fetch(`/api/rr/grievances${projectId ? `?projectId=${projectId}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.GRIEVANCES, data);
        return data;
      }
    } catch {
      // Fallback
    }
    const local = getLocal<RRGrievance[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_RR_GRIEVANCES);
    return projectId ? local.filter(g => g.projectId === projectId) : local;
  },

  async addGrievance(data: Omit<RRGrievance, 'id' | 'referenceNumber' | 'submissionDate'>): Promise<RRGrievance> {
    const refNum = `NLAMS-RRG-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newGrievance: RRGrievance = {
      ...data,
      id: `RRG-${Date.now()}`,
      referenceNumber: refNum,
      submissionDate: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch('/api/rr/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGrievance)
      });
      if (res.ok) {
        const saved = await res.json();
        const current = getLocal<RRGrievance[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_RR_GRIEVANCES);
        setLocal(STORAGE_KEYS.GRIEVANCES, [saved, ...current]);
        return saved;
      }
    } catch {
      // Fallback
    }

    const current = getLocal<RRGrievance[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_RR_GRIEVANCES);
    setLocal(STORAGE_KEYS.GRIEVANCES, [newGrievance, ...current]);
    return newGrievance;
  },

  async updateGrievance(id: string, updates: Partial<RRGrievance>): Promise<RRGrievance> {
    try {
      const res = await fetch(`/api/rr/grievances/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocal<RRGrievance[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_RR_GRIEVANCES);
        setLocal(STORAGE_KEYS.GRIEVANCES, current.map(g => g.id === id ? updated : g));
        return updated;
      }
    } catch {
      // Fallback
    }

    const current = getLocal<RRGrievance[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_RR_GRIEVANCES);
    let updatedItem: RRGrievance = current.find(g => g.id === id)!;
    const nextList = current.map(g => {
      if (g.id === id) {
        updatedItem = { ...g, ...updates };
        if (updates.status === 'Resolved' || updates.status === 'Closed') {
          updatedItem.resolvedDate = new Date().toISOString().split('T')[0];
        }
        return updatedItem;
      }
      return g;
    });
    setLocal(STORAGE_KEYS.GRIEVANCES, nextList);
    return updatedItem;
  },

  // 7. DOCUMENTS
  async getDocuments(projectId?: string): Promise<RRDocument[]> {
    try {
      const res = await fetch(`/api/rr/documents${projectId ? `?projectId=${projectId}` : ''}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const local = getLocal<RRDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_RR_DOCUMENTS);
    return projectId ? local.filter(d => d.projectId === projectId) : local;
  },

  async addDocument(doc: Omit<RRDocument, 'id' | 'uploadedAt'>): Promise<RRDocument> {
    const newDoc: RRDocument = {
      ...doc,
      id: `DOC-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    try {
      const res = await fetch('/api/rr/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const current = getLocal<RRDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_RR_DOCUMENTS);
    setLocal(STORAGE_KEYS.DOCUMENTS, [newDoc, ...current]);
    return newDoc;
  },

  // 8. RULE ALERTS (No predictive AI - purely deterministic conditions)
  async getAlerts(projectId?: string): Promise<RRRuleAlert[]> {
    const plans = await this.getPlans(projectId);
    const benefits = await this.getBenefits(projectId);
    const grievances = await this.getGrievances(projectId);
    const alerts: RRRuleAlert[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Rule 1: R&R Plan past planned completion date
    plans.forEach(plan => {
      if (plan.status !== 'Completed' && plan.plannedCompletionDate && plan.plannedCompletionDate < today) {
        alerts.push({
          id: `ALT-PLAN-${plan.id}`,
          ruleType: 'PLAN_DELAYED',
          severity: 'Critical',
          title: `R&R Plan Delayed: ${plan.id}`,
          description: `Planned completion milestone (${plan.plannedCompletionDate}) has lapsed for ${plan.projectName || plan.projectId}. Immediate review mandated.`,
          entityId: plan.id,
          entityType: 'Plan',
          projectId: plan.projectId,
          triggerDate: plan.plannedCompletionDate
        });
      }
    });

    // Rule 2: Benefit approved but not disbursed
    benefits.forEach(b => {
      if (b.approved && !b.disbursed) {
        alerts.push({
          id: `ALT-BNF-${b.id}`,
          ruleType: 'BENEFIT_PENDING',
          severity: 'Warning',
          title: `Statutory Benefit Pending Disbursement: ${b.benefitType}`,
          description: `Approved amount ₹${(b.approvedAmount || b.eligibleAmount).toLocaleString('en-IN')} for beneficiary ${b.beneficiaryName} (${b.familyId}) has not been settled via DBT.`,
          entityId: b.id,
          entityType: 'Benefit',
          projectId: b.projectId,
          triggerDate: b.approvedDate || b.date
        });
      }
    });

    // Rule 3: Grievance open beyond 15 days
    grievances.forEach(g => {
      if (g.status === 'Open' || g.status === 'Under Review') {
        const subDate = new Date(g.submissionDate).getTime();
        const diffDays = Math.floor((Date.now() - subDate) / (1000 * 60 * 60 * 24));
        if (diffDays > 15) {
          alerts.push({
            id: `ALT-GRV-${g.id}`,
            ruleType: 'GRIEVANCE_OVERDUE',
            severity: 'Warning',
            title: `Grievance Overdue (${diffDays} days): ${g.referenceNumber}`,
            description: `Citizen complaint filed by ${g.complainantName} regarding "${g.category}" has remained unresolved beyond the 15-day statutory citizen charter limit.`,
            entityId: g.id,
            entityType: 'Grievance',
            projectId: g.projectId,
            triggerDate: g.submissionDate
          });
        }
      }
    });

    return alerts;
  }
};
