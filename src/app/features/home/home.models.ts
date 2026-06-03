// ── Domain types for the Home feature ─────────────────────────────────────────

export type ItemCategory = 'group' | 'event' | 'program';

export interface SamitiItem {
  id:          number;
  name:        string;
  category:    ItemCategory;
  description: string;
  distanceKm:  number;
  location:    string;
  icon:        string;
  tags:        string[];
  members?:    number;   // groups only
  date?:       string;   // events only
  type?:       string;   // programs & events only — e.g. 'Yoga', 'Bhandara', 'Cricket'
}
