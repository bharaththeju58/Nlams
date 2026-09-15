import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Popup,
  Tooltip,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { LandParcel, ParcelStatus, Project } from '../types';
import { geocodingService } from '../services/geocodingService';
import {
  Layers,
  Search,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Maximize2,
  Minimize2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass,
  MapPin,
  X,
  Info,
  Eye
} from 'lucide-react';

// Status styling configuration
const STATUS_STYLES: Record<ParcelStatus, {
  color: string;
  fillColor: string;
  fillOpacity: number;
  label: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
}> = {
  Proposed: {
    color: '#1d4ed8',
    fillColor: '#2563eb',
    fillOpacity: 0.55,
    label: 'Proposed',
    bgClass: 'bg-blue-600',
    textClass: 'text-blue-900',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  Notified: {
    color: '#b45309',
    fillColor: '#eab308',
    fillOpacity: 0.55,
    label: 'Notified (Sec 11/19)',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-900',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  Acquired: {
    color: '#047857',
    fillColor: '#16a34a',
    fillOpacity: 0.55,
    label: 'Acquired & Vested',
    bgClass: 'bg-emerald-600',
    textClass: 'text-emerald-900',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  Disputed: {
    color: '#b91c1c',
    fillColor: '#dc2626',
    fillOpacity: 0.65,
    label: 'Disputed / Litigated',
    bgClass: 'bg-red-600',
    textClass: 'text-red-900',
    badgeClass: 'bg-red-100 text-red-800 border-red-200'
  },
  Excluded: {
    color: '#334155',
    fillColor: '#64748b',
    fillOpacity: 0.45,
    label: 'Excluded / Dropped',
    bgClass: 'bg-slate-500',
    textClass: 'text-slate-900',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200'
  }
};

// Base map layer providers
const BASE_MAPS = {
  osm: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  cartoLight: {
    name: 'CartoDB Positron (Clean Light)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

// National view default
const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
const INDIA_ZOOM = 5;

// Helper component to control map viewport smoothly
const MapViewportController: React.FC<{
  center: [number, number];
  zoom: number;
  bounds?: [number, number][];
}> = ({ center, zoom, bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    } else {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, bounds, map]);

  return null;
};

// Invalidate container size on layout changes
const MapInvalidateController: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

export const GISParcelViewer: React.FC = () => {
  const {
    parcels,
    selectedParcelId,
    setSelectedParcelId,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    setActiveTab,
    role
  } = useApp();

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>(INDIA_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(INDIA_ZOOM);
  const [mapBounds, setMapBounds] = useState<[number, number][] | undefined>(undefined);
  const [baseMapKey, setBaseMapKey] = useState<'osm' | 'cartoLight'>('osm');

  // Layer Visibility
  const [showParcelsLayer, setShowParcelsLayer] = useState(true);
  const [showAlignmentLayer, setShowAlignmentLayer] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterState, setFilterState] = useState<string>('All');
  const [filterDistrict, setFilterDistrict] = useState<string>('All');
  const [filterProject, setFilterProject] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterSector, setFilterSector] = useState<string>('All');

  // Geolocation state
  const [locatingUser, setLocatingUser] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Derive unique states, districts, and sectors from current database
  const availableStates = useMemo(() => {
    return ['All', ...Array.from(new Set(projects.map(p => p.state)))];
  }, [projects]);

  const availableDistricts = useMemo(() => {
    let list = projects;
    if (filterState !== 'All') {
      list = list.filter(p => p.state === filterState);
    }
    return ['All', ...Array.from(new Set(list.map(p => p.district)))];
  }, [projects, filterState]);

  const availableSectors = useMemo(() => {
    return ['All', ...Array.from(new Set(projects.map(p => p.sector)))];
  }, [projects]);

  // Active selected parcel object
  const activeParcel = useMemo(() => {
    if (selectedParcelId) {
      const found = parcels.find(p => p.id === selectedParcelId);
      if (found) return found;
    }
    return parcels[0];
  }, [parcels, selectedParcelId]);

  // Project associated with active parcel
  const activeProject = useMemo(() => {
    return projects.find(p => p.id === activeParcel?.projectId) || projects[0];
  }, [projects, activeParcel]);

  // Filtered parcels displayed on map
  const visibleParcels = useMemo(() => {
    return parcels.filter(p => {
      const matchState = filterState === 'All' || p.state === filterState;
      const matchDistrict = filterDistrict === 'All' || p.district === filterDistrict;
      const matchProject = filterProject === 'All' || p.projectId === filterProject;
      const matchStatus = filterStatus === 'All' || p.status === filterStatus;
      const matchSector = filterSector === 'All' || projects.find(prj => prj.id === p.projectId)?.sector === filterSector;
      return matchState && matchDistrict && matchProject && matchStatus;
    });
  }, [parcels, filterState, filterDistrict, filterProject, filterStatus, filterSector, projects]);

  // Filtered projects for alignment polylines
  const visibleProjects = useMemo(() => {
    return projects.filter(p => {
      const matchState = filterState === 'All' || p.state === filterState;
      const matchDistrict = filterDistrict === 'All' || p.district === filterDistrict;
      const matchProject = filterProject === 'All' || p.id === filterProject;
      const matchSector = filterSector === 'All' || p.sector === filterSector;
      return matchState && matchDistrict && matchProject && matchSector;
    });
  }, [projects, filterState, filterDistrict, filterProject, filterSector]);

  // Debounced search handling with geocoding fallback
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      // 1. Check local demo parcels
      const parcelMatches = parcels
        .filter(p =>
          p.surveyNumber.toLowerCase().includes(trimmed.toLowerCase()) ||
          p.id.toLowerCase().includes(trimmed.toLowerCase()) ||
          p.village.toLowerCase().includes(trimmed.toLowerCase()) ||
          p.district.toLowerCase().includes(trimmed.toLowerCase())
        )
        .slice(0, 4)
        .map(p => ({
          type: 'parcel',
          title: `Survey ${p.surveyNumber} (${p.id})`,
          subtitle: `${p.village}, ${p.district}, ${p.state} • ${p.status}`,
          data: p
        }));

      // 2. Check local demo projects
      const projectMatches = projects
        .filter(p =>
          p.name.toLowerCase().includes(trimmed.toLowerCase()) ||
          p.id.toLowerCase().includes(trimmed.toLowerCase()) ||
          p.district.toLowerCase().includes(trimmed.toLowerCase())
        )
        .slice(0, 3)
        .map(p => ({
          type: 'project',
          title: p.name,
          subtitle: `${p.district}, ${p.state} • ${p.sector}`,
          data: p
        }));

      // 3. Check real geocoder
      const geocoded = await geocodingService.searchLocation(trimmed);
      const geoMatches = geocoded.slice(0, 3).map(g => ({
        type: 'location',
        title: g.displayName.split(',')[0],
        subtitle: g.displayName,
        data: g
      }));

      setSearchResults([...parcelMatches, ...projectMatches, ...geoMatches]);
      setIsSearching(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery, parcels, projects]);

  // Handle Search Result Selection
  const handleSelectSearchResult = (result: any) => {
    if (result.type === 'parcel') {
      const p: LandParcel = result.data;
      setSelectedParcelId(p.id);
      setSelectedProjectId(p.projectId);
      setMapBounds(undefined);
      setMapCenter([p.latitude, p.longitude]);
      setMapZoom(16);
    } else if (result.type === 'project') {
      const prj: Project = result.data;
      setSelectedProjectId(prj.id);
      setFilterProject(prj.id);
      if (prj.centerCoordinates) {
        setMapBounds(undefined);
        setMapCenter(prj.centerCoordinates);
        setMapZoom(prj.zoomLevel || 13);
      }
    } else if (result.type === 'location') {
      setMapBounds(undefined);
      setMapCenter([result.data.latitude, result.data.longitude]);
      setMapZoom(11);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle State Filter Change with Auto-Pan
  const handleStateChange = async (stateName: string) => {
    setFilterState(stateName);
    setFilterDistrict('All');
    setFilterProject('All');

    if (stateName === 'All') {
      setMapBounds(undefined);
      setMapCenter(INDIA_CENTER);
      setMapZoom(INDIA_ZOOM);
      return;
    }

    // Geocode or match known state center
    const stateGeo = await geocodingService.searchState(stateName);
    if (stateGeo) {
      setMapBounds(undefined);
      setMapCenter([stateGeo.latitude, stateGeo.longitude]);
      setMapZoom(7);
    }
  };

  // Handle District Filter Change with Auto-Pan
  const handleDistrictChange = async (distName: string) => {
    setFilterDistrict(distName);
    setFilterProject('All');

    if (distName === 'All') {
      if (filterState !== 'All') {
        handleStateChange(filterState);
      }
      return;
    }

    const distGeo = await geocodingService.searchDistrict(distName, filterState !== 'All' ? filterState : undefined);
    if (distGeo) {
      setMapBounds(undefined);
      setMapCenter([distGeo.latitude, distGeo.longitude]);
      setMapZoom(11);
    }
  };

  // Handle Project Selection with Auto-Pan
  const handleProjectChange = (projId: string) => {
    setFilterProject(projId);
    if (projId === 'All') return;

    const prj = projects.find(p => p.id === projId);
    if (prj) {
      setSelectedProjectId(prj.id);
      if (prj.centerCoordinates) {
        setMapBounds(undefined);
        setMapCenter(prj.centerCoordinates);
        setMapZoom(prj.zoomLevel || 13);
      }
    }
  };

  // Locate User
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocatingUser(false);
        setMapBounds(undefined);
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        setMapZoom(13);
      },
      (err) => {
        setLocatingUser(false);
        setLocationError(`Location error: ${err.message}`);
        setTimeout(() => setLocationError(null), 4000);
      },
      { timeout: 8000 }
    );
  };

  // Quick State Demo Jump
  const handleQuickJump = (stateName: string, coords: [number, number], zoom = 12) => {
    setFilterState(stateName);
    setFilterDistrict('All');
    setFilterProject('All');
    setMapBounds(undefined);
    setMapCenter(coords);
    setMapZoom(zoom);
  };

  // Reset to national view
  const handleResetToIndia = () => {
    setFilterState('All');
    setFilterDistrict('All');
    setFilterProject('All');
    setFilterStatus('All');
    setFilterSector('All');
    setMapBounds(undefined);
    setMapCenter(INDIA_CENTER);
    setMapZoom(INDIA_ZOOM);
  };

  // Calculate stats for active selection
  const totalParcelsCount = visibleParcels.length;
  const acquiredCount = visibleParcels.filter(p => p.status === 'Acquired').length;
  const notifiedCount = visibleParcels.filter(p => p.status === 'Notified').length;
  const totalAreaAcres = visibleParcels.reduce((acc, p) => acc + p.areaAcres, 0).toFixed(1);

  return (
    <div className="space-y-4 pb-12 font-sans" ref={mapContainerRef}>
      {/* Top Banner: Real OSM + Demo Disclaimer */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                Cadastral GIS Land Acquisition Viewer
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-900 border border-blue-200">
                Live OpenStreetMap
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Geographically accurate OpenStreetMap base layer with overlaid cadastral survey parcels and infrastructure project corridors.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {role === 'Central Sponsoring Ministry' && (
            <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-300 px-3 py-1.5 rounded-lg text-purple-900 text-xs font-black tracking-tight shadow-2xs">
              <Eye className="w-4 h-4 text-purple-700 flex-shrink-0" />
              <span>National Read-Only Monitoring Mode</span>
            </div>
          )}

          {/* Demo Notice Pill */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-amber-900 text-xs font-semibold">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>DEMO GIS DATA — NOT OFFICIAL LAND RECORDS</span>
          </div>
        </div>
      </div>

      {/* Search Bar & Quick Jump Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Main Autocomplete Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search survey number (e.g. 142/3A, 284/1), parcel ID, village, district, or Indian city..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-900 font-bold focus:outline-blue-600 focus:bg-white transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Live Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50/70 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-black text-slate-900 group-hover:text-blue-900">
                        {res.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {res.subtitle}
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-800">
                      {res.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Reset to India */}
          <button
            onClick={handleResetToIndia}
            className="w-full md:w-auto px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-slate-300"
            title="Reset to All-India Extent"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            All-India
          </button>
        </div>

        {/* Quick Demo Locations Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs text-slate-500">
          <span className="font-black text-[11px] text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Demo Corridors:
          </span>
          <button
            onClick={() => handleQuickJump('Tamil Nadu', [12.6850, 77.9250], 13)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border ${
              filterState === 'Tamil Nadu'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            TN: NH-44 Hosur/Krishnagiri
          </button>
          <button
            onClick={() => handleQuickJump('Uttar Pradesh', [25.2750, 83.1400], 13)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border ${
              filterState === 'Uttar Pradesh'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            UP: Freight Corridor Chandauli
          </button>
          <button
            onClick={() => handleQuickJump('Karnataka', [16.5100, 75.3200], 13)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border ${
              filterState === 'Karnataka'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            KA: Krishna Canal Bagalkote
          </button>
          <button
            onClick={() => handleQuickJump('Rajasthan', [27.5380, 71.9250], 13)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border ${
              filterState === 'Rajasthan'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            RJ: Bhadla Solar Jodhpur
          </button>
          <button
            onClick={() => handleQuickJump('Maharashtra', [18.4420, 73.7680], 13)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border ${
              filterState === 'Maharashtra'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            MH: Ring Road Pune
          </button>
          <button
            onClick={() => handleQuickJump('Gujarat', [22.2550, 72.1950], 13)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border ${
              filterState === 'Gujarat'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            GJ: Dholera SIR Expressway
          </button>
        </div>
      </div>

      {/* Main 3-Column GIS Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Spatial Filters & Layer Controls */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-700" />
                Spatial Filters
              </h2>
              <span className="text-[10px] font-bold text-slate-400">
                {visibleParcels.length} Parcels
              </span>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                State
              </label>
              <select
                value={filterState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-blue-600"
              >
                {availableStates.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                District
              </label>
              <select
                value={filterDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-blue-600"
              >
                {availableDistricts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Project Filter */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                Project Corridor
              </label>
              <select
                value={filterProject}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-blue-600"
              >
                <option value="All">All Projects ({projects.length})</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>

            {/* Acquisition Status Filter */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                Acquisition Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-blue-600"
              >
                <option value="All">All Statuses</option>
                <option value="Proposed">Proposed (Section 4 Requisition)</option>
                <option value="Notified">Notified (Section 11/19)</option>
                <option value="Acquired">Acquired & Vested</option>
                <option value="Disputed">Disputed / Section 64</option>
                <option value="Excluded">Excluded / De-notified</option>
              </select>
            </div>

            {/* Infrastructure Sector Filter */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                Infrastructure Sector
              </label>
              <select
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-blue-600"
              >
                {availableSectors.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Layer Management Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              GIS Map Layers
            </h2>

            {/* Base Map Selector */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Base Map Provider
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setBaseMapKey('osm')}
                  className={`px-2 py-1.5 rounded text-[11px] font-bold border transition-colors ${
                    baseMapKey === 'osm'
                      ? 'bg-blue-50 text-blue-800 border-blue-400 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  OSM Standard
                </button>
                <button
                  type="button"
                  onClick={() => setBaseMapKey('cartoLight')}
                  className={`px-2 py-1.5 rounded text-[11px] font-bold border transition-colors ${
                    baseMapKey === 'cartoLight'
                      ? 'bg-blue-50 text-blue-800 border-blue-400 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Clean Light OSM
                </button>
              </div>
            </div>

            {/* Layer Toggles */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-slate-700">Land Parcels (Polygons)</span>
                <input
                  type="checkbox"
                  checked={showParcelsLayer}
                  onChange={(e) => setShowParcelsLayer(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-slate-700">Project Alignments</span>
                <input
                  type="checkbox"
                  checked={showAlignmentLayer}
                  onChange={(e) => setShowAlignmentLayer(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-slate-700">Survey No. Markers</span>
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Center Column: Interactive Real Leaflet Map */}
        <div className="lg:col-span-6 space-y-2">
          <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Map Container */}
            <div className="h-[620px] w-full relative z-0">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                scrollWheelZoom={true}
                className="h-full w-full"
                zoomControl={false}
              >
                <MapViewportController center={mapCenter} zoom={mapZoom} bounds={mapBounds} />
                <MapInvalidateController />

                {/* Base Tile Layer */}
                <TileLayer
                  url={BASE_MAPS[baseMapKey].url}
                  attribution={BASE_MAPS[baseMapKey].attribution}
                  maxZoom={19}
                />

                {/* Project Alignment Polylines */}
                {showAlignmentLayer && visibleProjects.map(proj => {
                  if (!proj.alignmentGeometry || !proj.alignmentGeometry.coordinates) return null;
                  const isSelectedProj = proj.id === activeParcel?.projectId || proj.id === filterProject;

                  return (
                    <React.Fragment key={`alignment-${proj.id}`}>
                      {/* Corridor Buffer Glow Outline */}
                      <Polyline
                        positions={proj.alignmentGeometry.coordinates}
                        pathOptions={{
                          color: '#2563eb',
                          weight: isSelectedProj ? 8 : 5,
                          opacity: 0.35,
                          lineCap: 'round',
                          lineJoin: 'round'
                        }}
                      />
                      {/* Core Alignment Line */}
                      <Polyline
                        positions={proj.alignmentGeometry.coordinates}
                        pathOptions={{
                          color: isSelectedProj ? '#1d4ed8' : '#3b82f6',
                          weight: isSelectedProj ? 4 : 3,
                          opacity: 0.95,
                          dashArray: isSelectedProj ? undefined : '6, 6',
                          lineCap: 'round',
                          lineJoin: 'round'
                        }}
                        eventHandlers={{
                          click: () => {
                            setSelectedProjectId(proj.id);
                            setFilterProject(proj.id);
                          }
                        }}
                      >
                        <Tooltip sticky>
                          <div className="font-sans text-xs">
                            <span className="font-black text-blue-900 block">{proj.name}</span>
                            <span className="text-[10px] text-slate-500 font-bold block">{proj.sector} • {proj.district}, {proj.state}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">Click to focus corridor</span>
                          </div>
                        </Tooltip>
                      </Polyline>
                    </React.Fragment>
                  );
                })}

                {/* Land Acquisition Parcels Polygons */}
                {showParcelsLayer && visibleParcels.map(parcel => {
                  const style = STATUS_STYLES[parcel.status] || STATUS_STYLES.Proposed;
                  const isSelected = parcel.id === activeParcel?.id;

                  // Leaflet polygon expects [latitude, longitude] pairs
                  // GeoJSON geometry has [longitude, latitude]
                  const polygonPositions: [number, number][] = parcel.geometry?.coordinates[0]
                    ? parcel.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])
                    : [
                        [parcel.latitude - 0.0012, parcel.longitude - 0.0015],
                        [parcel.latitude - 0.0010, parcel.longitude + 0.0018],
                        [parcel.latitude + 0.0014, parcel.longitude + 0.0016],
                        [parcel.latitude + 0.0015, parcel.longitude - 0.0014],
                        [parcel.latitude - 0.0012, parcel.longitude - 0.0015]
                      ];

                  return (
                    <Polygon
                      key={`parcel-poly-${parcel.id}`}
                      positions={polygonPositions}
                      pathOptions={{
                        color: isSelected ? '#0f172a' : style.color,
                        weight: isSelected ? 3.5 : 2,
                        fillColor: style.fillColor,
                        fillOpacity: isSelected ? 0.8 : style.fillOpacity,
                        dashArray: parcel.status === 'Proposed' ? '4, 4' : undefined
                      }}
                      eventHandlers={{
                        click: () => {
                          setSelectedParcelId(parcel.id);
                          setSelectedProjectId(parcel.projectId);
                        }
                      }}
                    >
                      <Tooltip sticky>
                        <div className="font-sans text-xs space-y-0.5">
                          <div className="font-black text-slate-900">Survey No. {parcel.surveyNumber}</div>
                          <div className="text-[11px] text-slate-600 font-semibold">{parcel.village}, {parcel.district}</div>
                          <div className="text-[10px] font-black uppercase tracking-wider" style={{ color: style.color }}>
                            {parcel.status} • {parcel.areaAcres} Acres
                          </div>
                        </div>
                      </Tooltip>
                    </Polygon>
                  );
                })}

                {/* Survey Number Center Markers */}
                {showLabels && visibleParcels.map(parcel => {
                  const style = STATUS_STYLES[parcel.status] || STATUS_STYLES.Proposed;
                  const isSelected = parcel.id === activeParcel?.id;

                  const customIcon = L.divIcon({
                    className: 'custom-parcel-marker',
                    html: `
                      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
                        <div style="background-color: ${style.fillColor}; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 800; font-family: system-ui, sans-serif; white-space: nowrap; border: ${isSelected ? '2px solid #0f172a' : '1px solid #ffffff'}; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
                          ${parcel.surveyNumber}
                        </div>
                        <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid ${style.fillColor};"></div>
                      </div>
                    `,
                    iconSize: [0, 0],
                    iconAnchor: [0, 0]
                  });

                  return (
                    <Marker
                      key={`marker-${parcel.id}`}
                      position={[parcel.latitude, parcel.longitude]}
                      icon={customIcon}
                      eventHandlers={{
                        click: () => {
                          setSelectedParcelId(parcel.id);
                          setSelectedProjectId(parcel.projectId);
                        }
                      }}
                    >
                      <Popup>
                        <div className="p-3 max-w-xs font-sans text-xs space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                            <span className="font-mono font-black text-blue-900">{parcel.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${style.badgeClass}`}>
                              {parcel.status}
                            </span>
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-sm">
                              Survey Number: {parcel.surveyNumber}
                            </div>
                            <div className="text-slate-500 font-medium text-[11px] mt-0.5">
                              {parcel.village}, {parcel.tehsil}, {parcel.district}, {parcel.state}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded border border-slate-100 text-[11px]">
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Area</span>
                              <span className="font-bold text-slate-800">{parcel.areaAcres} Acres</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Land Type</span>
                              <span className="font-bold text-slate-800 truncate block">{parcel.landType}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedParcelId(parcel.id);
                              setActiveTab('Parcels');
                            }}
                            className="w-full mt-1 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1"
                          >
                            View Full Record <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* In-Map Custom Floating Controls (Top Right) */}
              <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-1 shadow-md">
                <button
                  type="button"
                  onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                  className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMapZoom(prev => Math.max(prev - 1, 4))}
                  className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleLocateMe}
                  disabled={locatingUser}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                    locatingUser
                      ? 'text-blue-600 animate-spin bg-blue-50'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                  }`}
                  title="Locate Current Position"
                >
                  <Crosshair className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetToIndia}
                  className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                  title="Reset to All-India"
                >
                  <Compass className="w-4 h-4" />
                </button>
              </div>

              {/* In-Map Coordinate & Scale Overlay (Bottom Left) */}
              <div className="absolute bottom-2.5 left-2.5 z-[1000] bg-white/90 backdrop-blur-xs border border-slate-200 rounded-md px-2 py-1 text-[10px] text-slate-600 font-mono font-bold shadow-2xs">
                Center: {mapCenter[0].toFixed(4)}° N, {mapCenter[1].toFixed(4)}° E • Zoom {mapZoom}
              </div>

              {locationError && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {locationError}
                </div>
              )}
            </div>

            {/* Bottom Color-Coded Legend Bar */}
            <div className="bg-slate-50 border-t border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-[10px] text-slate-400 uppercase tracking-widest">
                  Cadastral Legend:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-blue-600 border border-blue-800"></span>
                  <span className="text-slate-700 font-bold text-[11px]">Proposed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-amber-500 border border-amber-700"></span>
                  <span className="text-slate-700 font-bold text-[11px]">Notified (Sec 11/19)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-600 border border-emerald-800"></span>
                  <span className="text-slate-700 font-bold text-[11px]">Acquired & Vested</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-red-600 border border-red-800"></span>
                  <span className="text-slate-700 font-bold text-[11px]">Disputed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-500 border border-slate-700"></span>
                  <span className="text-slate-700 font-bold text-[11px]">Excluded</span>
                </div>
                <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                  <span className="w-4 h-1 bg-blue-600 border-t-2 border-dashed border-blue-900 inline-block"></span>
                  <span className="text-slate-700 font-bold text-[11px]">Project Alignment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Parcel & Project Detailed Inspector */}
        <div className="lg:col-span-3 space-y-4">
          {activeParcel ? (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
              {/* Header */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {activeParcel.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    STATUS_STYLES[activeParcel.status]?.badgeClass || 'bg-slate-100 text-slate-800'
                  }`}>
                    {activeParcel.status}
                  </span>
                </div>
                <h2 className="text-base font-black text-slate-900 tracking-tight mt-1.5">
                  Survey No. {activeParcel.surveyNumber}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {activeParcel.village}, {activeParcel.tehsil}, {activeParcel.district}, {activeParcel.state}
                </p>
              </div>

              {/* Geographic Coordinates Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs space-y-1">
                <div className="flex justify-between text-slate-500 font-bold text-[10px] uppercase">
                  <span>Geographic Point</span>
                  <span>OpenStreetMap WGS84</span>
                </div>
                <div className="font-mono font-bold text-slate-800 text-[11px]">
                  Lat: {activeParcel.latitude.toFixed(5)}° N, Lng: {activeParcel.longitude.toFixed(5)}° E
                </div>
              </div>

              {/* Key Cadastral Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                    Cadastral Area
                  </span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 block">
                    {activeParcel.areaAcres} Acres
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                    Land Type
                  </span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                    {activeParcel.landType}
                  </span>
                </div>
              </div>

              {/* Landowner Record */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
                  Notified Landowner
                </span>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-black text-slate-900">{activeParcel.ownerName}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Ref: {activeParcel.ownerReferenceMasked}
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold mt-1">
                    Ownership: {activeParcel.ownershipType}
                  </div>
                </div>
              </div>

              {/* Statutory Stage Checkpoints */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block mb-1">
                  Statutory Progression
                </span>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Notification:</span>
                  <span className="font-bold text-slate-900">{activeParcel.notificationStatus || 'Section 11 Notified'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Award Status:</span>
                  <span className="font-bold text-slate-900">{activeParcel.awardStatus || 'Award Declared'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Compensation:</span>
                  <span className="font-bold text-slate-900">{activeParcel.compensationStatus}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Physical Possession:</span>
                  <span className="font-bold text-slate-900">{activeParcel.possessionStatus}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">R&R Entitlement:</span>
                  <span className="font-bold text-slate-900">{activeParcel.rrStatus || 'Survey Pending'}</span>
                </div>
              </div>

              {/* Linked Infrastructure Project */}
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs space-y-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-blue-800 block">
                  Project Corridor
                </span>
                <div className="font-black text-slate-900">{activeProject.name}</div>
                <div className="text-[10px] text-slate-600 font-medium">
                  Requiring Body: {activeProject.requiringBody}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {role === 'Central Sponsoring Ministry' ? (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-[11px] font-medium text-center">
                    <span className="font-bold text-purple-900 block text-xs">National Read-Only Monitoring</span>
                    Survey boundary demarcations and parcel modifications are restricted to District CALA under RFCTLARR.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedParcelId(activeParcel.id);
                      setActiveTab('Parcels');
                    }}
                    className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Full Parcel Record
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProjectId(activeProject.id);
                    setActiveTab('Projects');
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-black uppercase tracking-wider border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Building className="w-3.5 h-3.5" />
                  Inspect Project Corridor
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
              Select a parcel polygon on the map to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
