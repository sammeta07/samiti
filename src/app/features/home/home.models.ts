// ── Domain types for the Home feature ─────────────────────────────────────────

import { LocationCoords } from "../../components/header/header.models";

export type ItemCategory = 'committee' | 'event' | 'program';


// Backend expects flat lat/long format
export interface CommitteeListRequestBackend {
  lat: number;
  long: number;
  rangeKm: number;
}


// ── Backend Committee List Response Models ──────────────────────────────────────

export interface CommitteeAdmin {
  email: string;
  contactNumber: string;
}

export interface CommitteeListResponse {
  id: number;
  committee_id: string;
  name: string;
  since: number;
  description: string | null;
  area: string;
  district_id: number;
  state_id: number;
  location_cords: LocationCoords;
  contact_numbers: string[];
  admins: CommitteeAdmin[];
  created_at: string;
  logo: string | null;
  distance: number; // Distance from user in meters
}

export interface CommitteeListApiResponse {
  statusCode: number;
  status: string;
  message: string;
  data: any[]; // Links array directly to committeeList template binding loop
}


