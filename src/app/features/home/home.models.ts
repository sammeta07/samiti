// ── Domain types for the Home feature ─────────────────────────────────────────

import { LocationCoords } from "../../components/header/header.models";

export type ItemCategory = 'group' | 'event' | 'program';


// Backend expects flat lat/long format
export interface GroupListRequestBackend {
  lat: number;
  long: number;
  rangeKm: number;
}


// ── Backend Group List Response Models ──────────────────────────────────────

export interface GroupAdmin {
  email: string;
  contactNumber: string;
}

export interface GroupListResponse {
  id: number;
  group_id: string;
  name: string;
  since: number;
  description: string | null;
  area: string;
  district_id: number;
  state_id: number;
  location_cords: LocationCoords;
  contact_numbers: string[];
  admins: GroupAdmin[];
  created_at: string;
  logo: string | null;
  distance: number; // Distance from user in meters
}

export interface GroupListApiResponse {
  groups: GroupListResponse[];
}


