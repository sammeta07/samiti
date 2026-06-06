// ── Login Feature Models ───────────────────────────────────────────────

export interface LoginPayload {
  mobile: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  status: number;
  data: {
    id: number;
    email: string;
    mobile: string;
    name: string;
    groupRoles: Array<{
      groupId: number;
      groupCode: string;
      groupName: string;
      role: string;
    }>;
    eventRoles: Array<{
      eventId: number;
      eventTitle: string;
      groupId: number;
      groupCode: string;
      groupName: string;
      role: string;
    }>;
    token: string;
  };
}
