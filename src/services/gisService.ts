import { LandParcel, Project, ParcelStatus, ProjectSector } from '../types';

export interface GeoJSONFeature<G = any, P = any> {
  type: 'Feature';
  id: string;
  geometry: G;
  properties: P;
}

export interface GeoJSONFeatureCollection<G = any, P = any> {
  type: 'FeatureCollection';
  features: GeoJSONFeature<G, P>[];
}

export interface ParcelFeatureProperties {
  parcel_id: string;
  project_id: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  survey_number: string;
  area: number;
  latitude: number;
  longitude: number;
  acquisition_status: ParcelStatus;
  award_status: string;
  compensation_status: string;
  possession_status: string;
  notification_status?: string;
  rr_status?: string;
  land_type: string;
  owner_name: string;
  owner_reference_masked: string;
  market_value_per_acre: number;
  external_land_record_source?: string;
  is_demo_data: boolean;
}

export interface ProjectFeatureProperties {
  project_id: string;
  project_name: string;
  sector: ProjectSector;
  requiring_body: string;
  state: string;
  district: string;
  estimated_land_acres: number;
  acquired_land_acres: number;
  status: string;
  compensation_disbursed_crores: number;
  affected_districts?: string[];
  affected_villages?: string[];
  is_demo_data: boolean;
}

export const gisService = {
  /**
   * Generates a GeoJSON FeatureCollection of Land Parcels
   */
  getParcelsGeoJSON(
    parcels: LandParcel[],
    filters?: {
      state?: string;
      district?: string;
      project?: string;
      sector?: string;
      status?: string;
    }
  ): GeoJSONFeatureCollection {
    let list = parcels;

    if (filters) {
      if (filters.state && filters.state !== 'All') {
        list = list.filter(p => p.state.toLowerCase() === filters.state?.toLowerCase());
      }
      if (filters.district && filters.district !== 'All') {
        list = list.filter(p => p.district.toLowerCase() === filters.district?.toLowerCase());
      }
      if (filters.project && filters.project !== 'All') {
        list = list.filter(p => p.projectId === filters.project);
      }
      if (filters.status && filters.status !== 'All') {
        list = list.filter(p => p.status === filters.status);
      }
    }

    const features: GeoJSONFeature[] = list.map(p => {
      // Default to polygon around center if explicit geometry isn't supplied
      const polyCoords = p.geometry?.coordinates || [
        [
          [p.longitude - 0.0015, p.latitude - 0.0012],
          [p.longitude + 0.0018, p.latitude - 0.0010],
          [p.longitude + 0.0016, p.latitude + 0.0014],
          [p.longitude - 0.0014, p.latitude + 0.0015],
          [p.longitude - 0.0015, p.latitude - 0.0012]
        ]
      ];

      return {
        type: 'Feature',
        id: p.id,
        geometry: {
          type: 'Polygon',
          coordinates: polyCoords
        },
        properties: {
          parcel_id: p.id,
          project_id: p.projectId,
          state: p.state,
          district: p.district,
          tehsil: p.tehsil,
          village: p.village,
          survey_number: p.surveyNumber,
          area: p.areaAcres,
          latitude: p.latitude,
          longitude: p.longitude,
          acquisition_status: p.status,
          award_status: p.awardStatus || (p.compensationStatus === 'Award Declared' ? 'Award Declared' : 'Pending'),
          compensation_status: p.compensationStatus,
          possession_status: p.possessionStatus,
          notification_status: p.notificationStatus || 'Section 11 Notified',
          rr_status: p.rrStatus || 'Survey Pending',
          land_type: p.landType,
          owner_name: p.ownerName,
          owner_reference_masked: p.ownerReferenceMasked,
          market_value_per_acre: p.marketValuePerAcre,
          external_land_record_source: p.externalLandRecordSource,
          is_demo_data: true
        } as ParcelFeatureProperties
      };
    });

    return {
      type: 'FeatureCollection',
      features
    };
  },

  /**
   * Generates a GeoJSON FeatureCollection of Projects with alignments
   */
  getProjectsGeoJSON(
    projects: Project[],
    filters?: {
      state?: string;
      sector?: string;
      status?: string;
    }
  ): GeoJSONFeatureCollection {
    let list = projects;

    if (filters) {
      if (filters.state && filters.state !== 'All') {
        list = list.filter(p => p.state.toLowerCase() === filters.state?.toLowerCase());
      }
      if (filters.sector && filters.sector !== 'All') {
        list = list.filter(p => p.sector === filters.sector);
      }
      if (filters.status && filters.status !== 'All') {
        list = list.filter(p => p.status === filters.status);
      }
    }

    const features: GeoJSONFeature[] = list
      .filter(p => p.alignmentGeometry && p.alignmentGeometry.coordinates.length > 0)
      .map(p => ({
        type: 'Feature',
        id: p.id,
        geometry: {
          type: 'LineString',
          // Note: GeoJSON standard is [longitude, latitude]
          coordinates: p.alignmentGeometry!.coordinates.map(([lat, lng]) => [lng, lat])
        },
        properties: {
          project_id: p.id,
          project_name: p.name,
          sector: p.sector,
          requiring_body: p.requiringBody,
          state: p.state,
          district: p.district,
          estimated_land_acres: p.estimatedLandAcres,
          acquired_land_acres: p.acquiredLandAcres,
          status: p.status,
          compensation_disbursed_crores: p.compensationDisbursedCrores,
          affected_districts: p.affectedDistricts,
          affected_villages: p.affectedVillages,
          is_demo_data: true
        } as ProjectFeatureProperties
      }));

    return {
      type: 'FeatureCollection',
      features
    };
  },

  /**
   * Search parcels and projects across survey number, parcel ID, village, district, state
   */
  search(parcels: LandParcel[], projects: Project[], query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return { matchedParcels: [], matchedProjects: [] };

    const matchedParcels = parcels.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.surveyNumber.toLowerCase().includes(q) ||
      p.village.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.projectId.toLowerCase().includes(q)
    );

    const matchedProjects = projects.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q)
    );

    return { matchedParcels, matchedProjects };
  }
};
