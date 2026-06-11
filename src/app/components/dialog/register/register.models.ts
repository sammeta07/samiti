// ── Register Feature Models ───────────────────────────────────────────────

export interface RegisterPayload {
    name: string;
    email: string;
    mobile: string;
    gender: string;
    dateOfBirth: string;
    password: string;
}

export interface RegisterResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    email: string;
    name: string;
    mobile: string;
    dateOfBirth: string;
    gender: string;
  };
}


