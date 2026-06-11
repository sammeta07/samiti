// ── Domain types for the Dashboard feature ─────────────────────────────────────

export interface DashboardUser {
  id: number;
  email: string;
  name: string;
  // Add more user properties as needed
}

export interface DashboardStats {
  totalGroups: number;
  totalEvents: number;
  totalMembers: number;
}
