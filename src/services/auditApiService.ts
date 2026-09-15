import { AuditLog, AuditStats, AuditQueryParams } from '../types';

export interface PaginatedAuditResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export const auditApiService = {
  /**
   * Fetch audit logs with filtering, search, and pagination
   */
  async getAuditLogs(params: AuditQueryParams = {}): Promise<PaginatedAuditResponse> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.user) query.set('user', params.user);
    if (params.role) query.set('role', params.role);
    if (params.module) query.set('module', params.module);
    if (params.action) query.set('action', params.action);
    if (params.status) query.set('status', params.status);
    if (params.entityType) query.set('entityType', params.entityType);
    if (params.entityId) query.set('entityId', params.entityId);
    if (params.projectId) query.set('projectId', params.projectId);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.sort) query.set('sort', params.sort);

    const res = await fetch(`/api/audit-logs?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch audit logs: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetch aggregate audit statistics for dashboards
   */
  async getAuditStats(): Promise<AuditStats> {
    const res = await fetch('/api/audit-logs/stats');
    if (!res.ok) {
      throw new Error(`Failed to fetch audit stats: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetch chronological statutory audit timeline for a specific project
   */
  async getProjectTimeline(projectId: string): Promise<AuditLog[]> {
    const res = await fetch(`/api/audit-logs/timeline/${encodeURIComponent(projectId)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch project audit timeline: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Get single audit record with complete diff
   */
  async getAuditLogById(id: string): Promise<AuditLog> {
    const res = await fetch(`/api/audit-logs/${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch audit record: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Post a new audit log event from successful backend / client-authorized operations
   */
  async recordAuditEvent(eventData: {
    action: string;
    module: string;
    entityType?: string;
    entityId?: string;
    projectId?: string;
    userId?: string;
    userName?: string;
    userRole?: string;
    description: string;
    oldValue?: any;
    newValue?: any;
    status?: 'SUCCESS' | 'FAILURE';
    ipAddress?: string;
  }): Promise<AuditLog> {
    const res = await fetch('/api/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    if (!res.ok) {
      throw new Error(`Failed to record audit event: ${res.statusText}`);
    }
    return res.json();
  }
};
