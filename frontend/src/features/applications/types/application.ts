export type ApplicationStatus =
  | "applied"
  | "phone_screen"
  | "onsite"
  | "offer"
  | "rejected";

export interface ApplicationItem {
  id: number;

  user_id: number;

  company_name: string;

  job_title: string;

  status: ApplicationStatus;

  applied_date: string;

  phone_screen_date?: string | null;

  onsite_date?: string | null;

  offer_date?: string | null;

  rejected_date?: string | null;

  follow_up_date?: string | null;

  notes: string;

  created_at: string;

  updated_at: string;
}

export interface ApplicationCreatePayload {
  company_name: string;

  job_title: string;

  status: ApplicationStatus;

  applied_date: string;

  phone_screen_date?: string | null;

  onsite_date?: string | null;

  offer_date?: string | null;

  rejected_date?: string | null;

  follow_up_date?: string | null;

  notes: string;
}

export type ApplicationUpdatePayload =
  Partial<ApplicationCreatePayload>;

export interface ApplicationStats {
  active: number;

  response_rate: number;

  offers: number;

  follow_ups_due: number;
}

export interface ApplicationListResponse {
  applications: ApplicationItem[];

  stats: ApplicationStats;
}
