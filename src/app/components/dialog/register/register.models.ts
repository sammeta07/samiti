// ── Register Feature Models ───────────────────────────────────────────────

export interface RegisterPayload {
    name: string;
    email: string;
    mobile: string;
    password: string;
}

export interface RegisterResponse {
  id: number;
  message: string;
  data?: {
    id: number;
    email: string;
    mobile: string;
    name: string;
    groupRoles: string[];
    eventRoles: string[];
  };
}


