// ============================================================================
// 1. Core Request Payload Interface
// ============================================================================
export interface LoginPayload {
  email: string;
  password: string;
}

// ============================================================================
// 2. Hierarchical Nested Core Tree Interfaces
// ============================================================================

export interface ProgramData {
  program_id: number;
  program_name: string;
  type: string;
  latitude: number;
  longitude: number;
  photos: string[] | string | null; // Backends json array wrapper handling
  status: string;
}

export interface ChildTaskData {
  child_task_id: number;
  title: string;
  owner_id: number;
  owner_name: string;
  status: string;
}

export interface TaskData {
  task_id: number;
  task_title: string;
  task_owner_id: number;
  task_owner_name: string;
  status: string;
  child_tasks: ChildTaskData[];
}

export interface EventData {
  event_id: number;
  event_name: string;
  designation: 'ADHYAKSH' | 'UPADYAKSH' | 'CASHIER' | 'SACHIV' | string | null;
  programs: ProgramData[];
  tasks: TaskData[];
}

export interface CommitteeData {
  committee_id: number;
  committee_name: string;
  is_committee_admin: boolean;
  events: EventData[];
}

// ============================================================================
// 3. Final Standardized Response Interface
// ============================================================================
export interface LoginResponse {
  statusCode: number;      // Matches 200 HTTP wrapper architecture
  status: 'success';       // Strict layout status tracking string
  message: string;
  token: string;           // Direct string token extraction
  data: {
    user_id: number;       // Synced database ID wrapper
    name: string;
    email: string;
    base_role: 'AUTH_USER' | string;
    committees: CommitteeData[]; // Complete operational tree hierarchy mapping
  };
}