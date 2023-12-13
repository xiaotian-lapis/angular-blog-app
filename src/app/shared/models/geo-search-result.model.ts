/**
 * Represents a geographic search result with coordinates, label, bounds, and raw provider result.
 * https://smeijer.github.io/leaflet-geosearch/usage#results
 * @interface
 */
export interface IGeoSearchResult {
  x: number; // lon
  y: number; // lat
  label: string; // formatted address
  bounds: [
    [number, number], // south, west - lat, lon
    [number, number], // north, east - lat, lon
  ];
  raw: any; // raw provider result
}
