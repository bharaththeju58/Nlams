/**
 * OpenStreetMap Nominatim Geocoding Service Abstraction
 * Complies with OSM Nominatim usage policy (debouncing, caching, custom user-agent)
 * Provides instant fallback to official Indian state and district coordinates.
 */

export interface GeocodeResult {
  displayName: string;
  latitude: number;
  longitude: number;
  type: 'state' | 'district' | 'city' | 'village' | 'address';
  boundingBox?: [number, number, number, number]; // [minLat, maxLat, minLng, maxLng]
}

// Pre-seeded geographic coordinates for Indian States & Key Districts (Fallback & Instant Search)
const KNOWN_INDIAN_LOCATIONS: Record<string, GeocodeResult> = {
  // States
  'tamil nadu': { displayName: 'Tamil Nadu, India', latitude: 11.1271, longitude: 78.6569, type: 'state' },
  'karnataka': { displayName: 'Karnataka, India', latitude: 15.3173, longitude: 75.7139, type: 'state' },
  'uttar pradesh': { displayName: 'Uttar Pradesh, India', latitude: 26.8467, longitude: 80.9462, type: 'state' },
  'rajasthan': { displayName: 'Rajasthan, India', latitude: 27.0238, longitude: 74.2179, type: 'state' },
  'maharashtra': { displayName: 'Maharashtra, India', latitude: 19.7515, longitude: 75.7139, type: 'state' },
  'gujarat': { displayName: 'Gujarat, India', latitude: 22.2587, longitude: 71.1924, type: 'state' },
  'andhra pradesh': { displayName: 'Andhra Pradesh, India', latitude: 15.9129, longitude: 79.7400, type: 'state' },
  'telangana': { displayName: 'Telangana, India', latitude: 18.1124, longitude: 79.0193, type: 'state' },
  'madhya pradesh': { displayName: 'Madhya Pradesh, India', latitude: 22.9734, longitude: 78.6569, type: 'state' },
  'bihar': { displayName: 'Bihar, India', latitude: 25.0961, longitude: 85.3131, type: 'state' },
  'west bengal': { displayName: 'West Bengal, India', latitude: 22.9868, longitude: 87.8550, type: 'state' },
  'odisha': { displayName: 'Odisha, India', latitude: 20.9517, longitude: 85.0985, type: 'state' },
  'punjab': { displayName: 'Punjab, India', latitude: 31.1471, longitude: 75.3412, type: 'state' },
  'haryana': { displayName: 'Haryana, India', latitude: 29.0588, longitude: 76.0856, type: 'state' },
  'kerala': { displayName: 'Kerala, India', latitude: 10.8505, longitude: 76.2711, type: 'state' },
  'delhi': { displayName: 'National Capital Territory of Delhi, India', latitude: 28.7041, longitude: 77.1025, type: 'state' },

  // Key Districts & Cities
  'krishnagiri': { displayName: 'Krishnagiri District, Tamil Nadu, India', latitude: 12.5186, longitude: 78.2137, type: 'district' },
  'hosur': { displayName: 'Hosur, Krishnagiri, Tamil Nadu, India', latitude: 12.7409, longitude: 77.8253, type: 'city' },
  'chandauli': { displayName: 'Chandauli District, Uttar Pradesh, India', latitude: 25.2600, longitude: 83.2700, type: 'district' },
  'mughal sarai': { displayName: 'Pt. Deen Dayal Upadhyaya Nagar (Mughal Sarai), Chandauli, Uttar Pradesh', latitude: 25.2818, longitude: 83.1167, type: 'city' },
  'bagalkote': { displayName: 'Bagalkote District, Karnataka, India', latitude: 16.1856, longitude: 75.6968, type: 'district' },
  'jamkhandi': { displayName: 'Jamkhandi, Bagalkote, Karnataka, India', latitude: 16.5100, longitude: 75.3100, type: 'city' },
  'jodhpur': { displayName: 'Jodhpur District, Rajasthan, India', latitude: 26.2389, longitude: 73.0243, type: 'district' },
  'phalodi': { displayName: 'Phalodi, Jodhpur, Rajasthan, India', latitude: 27.1333, longitude: 72.3667, type: 'city' },
  'bhadla': { displayName: 'Bhadla, Phalodi, Jodhpur, Rajasthan, India', latitude: 27.5380, longitude: 71.9250, type: 'village' },
  'pune': { displayName: 'Pune District, Maharashtra, India', latitude: 18.5204, longitude: 73.8567, type: 'district' },
  'haveli': { displayName: 'Haveli Taluka, Pune, Maharashtra, India', latitude: 18.4420, longitude: 73.7680, type: 'district' },
  'ahmedabad': { displayName: 'Ahmedabad District, Gujarat, India', latitude: 23.0225, longitude: 72.5714, type: 'district' },
  'dholera': { displayName: 'Dholera SIR, Ahmedabad, Gujarat, India', latitude: 22.2500, longitude: 72.1900, type: 'city' },
  'coimbatore': { displayName: 'Coimbatore, Tamil Nadu, India', latitude: 11.0168, longitude: 76.9558, type: 'city' },
};

// In-memory cache to prevent duplicate external requests
const geocodeCache = new Map<string, GeocodeResult[]>();
let lastRequestTimestamp = 0;
const MIN_REQUEST_INTERVAL_MS = 1100; // Nominatim policy: max 1 req/sec

export const geocodingService = {
  /**
   * Search an address or query with Nominatim with fallback to cached database
   */
  async searchLocation(query: string): Promise<GeocodeResult[]> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    // Check in-memory cache first
    if (geocodeCache.has(trimmed)) {
      return geocodeCache.get(trimmed)!;
    }

    // Check direct known locations
    if (KNOWN_INDIAN_LOCATIONS[trimmed]) {
      const result = [KNOWN_INDIAN_LOCATIONS[trimmed]];
      geocodeCache.set(trimmed, result);
      return result;
    }

    // Partial match in known locations
    const localMatches = Object.entries(KNOWN_INDIAN_LOCATIONS)
      .filter(([key]) => key.includes(trimmed) || trimmed.includes(key))
      .map(([_, val]) => val);

    if (localMatches.length > 0) {
      geocodeCache.set(trimmed, localMatches);
      return localMatches;
    }

    // Rate-limited remote call to OpenStreetMap Nominatim
    try {
      const now = Date.now();
      const timeSinceLast = now - lastRequestTimestamp;
      if (timeSinceLast < MIN_REQUEST_INTERVAL_MS) {
        await new Promise(res => setTimeout(res, MIN_REQUEST_INTERVAL_MS - timeSinceLast));
      }
      lastRequestTimestamp = Date.now();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query + ', India'
      )}&countrycodes=in&limit=5`;

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NLAMS-NationalLandAcquisitionSystem/2.1'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const results: GeocodeResult[] = data.map((item: any) => ({
            displayName: item.display_name,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            type: item.type === 'state' ? 'state' : item.type === 'administrative' ? 'district' : 'address',
            boundingBox: item.boundingbox ? [
              parseFloat(item.boundingbox[0]),
              parseFloat(item.boundingbox[1]),
              parseFloat(item.boundingbox[2]),
              parseFloat(item.boundingbox[3])
            ] : undefined
          }));
          geocodeCache.set(trimmed, results);
          return results;
        }
      }
    } catch {
      // Graceful fallback to default India center if remote is unavailable
    }

    return [];
  },

  /**
   * Search specifically for an Indian State
   */
  async searchState(stateName: string): Promise<GeocodeResult | null> {
    const key = stateName.toLowerCase().trim();
    if (KNOWN_INDIAN_LOCATIONS[key]) {
      return KNOWN_INDIAN_LOCATIONS[key];
    }
    const results = await this.searchLocation(stateName);
    return results[0] || null;
  },

  /**
   * Search specifically for an Indian District
   */
  async searchDistrict(districtName: string, stateName?: string): Promise<GeocodeResult | null> {
    const query = stateName ? `${districtName}, ${stateName}` : districtName;
    const key = districtName.toLowerCase().trim();
    if (KNOWN_INDIAN_LOCATIONS[key]) {
      return KNOWN_INDIAN_LOCATIONS[key];
    }
    const results = await this.searchLocation(query);
    return results[0] || null;
  }
};
