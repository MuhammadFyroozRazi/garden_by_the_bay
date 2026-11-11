export type CategoryType = 
  | 'all'
  | 'attraction'
  | 'conservatory'
  | 'supertree'
  | 'garden'
  | 'dining'
  | 'facility'
  | 'others';

export type TimeOfDayMode = 'day' | 'sunset' | 'night';

export interface POIItem {
  id: string;
  numberKey?: string; // e.g. "1", "3", "a", "33"
  name: string;
  category: CategoryType;
  categoryLabel: string;
  subtitle: string;
  description: string;
  highlights: string[];
  admission: 'Free Outdoor Access' | 'Ticketed Attraction' | 'Food & Beverage' | 'Visitor Facility';
  hours: string;
  climate: 'Air-Conditioned (23-25°C)' | 'Outdoor Sheltered' | 'Outdoor Tropical' | 'Indoor Dining';
  accessibility: 'Wheelchair / Barrier-Free' | 'Stairs Available' | 'Shuttle Accessible';
  // Normalized 2D coordinates on map plane [0..1]
  // x: 0 (left) to 1 (right)
  // y: 0 (top) to 1 (bottom)
  mapCoord: { x: number; y: number };
  // 3D camera target when inspecting
  cameraTarget?: { x: number; y: number; z: number };
  cameraPosition?: { x: number; y: number; z: number };
  bannerGradient: string; // Tailwind gradient for presentation card
  iconName?: string;
  tags: string[];
}

export interface RouteOption {
  fromId: string;
  toId: string;
  distanceMeters: number;
  walkMinutes: number;
  barrierFree: boolean;
  waypoints: { x: number; y: number }[];
}
