export interface RecruiterSignals {
  readability: number;

  impact_density: number;

  technical_depth: number;

  visual_hierarchy: number;
}

export interface RecruiterFeedbackCard {
  title: string;

  description: string;

  confidence: string;

  type: string;
}

export interface RecruiterAttentionZone {
  section: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  attention: number;
  start_second: number;
  end_second: number;
  reason: string;
  priority: "high" | "medium" | "low" | string;
}

export interface RecruiterScanPathPoint {
  section: string;
  x: number;
  y: number;
  second: number;
  label: string;
}

export interface RecruiterDropOffPoint {
  second: number;
  section: string;
  reason: string;
  severity: "low" | "medium" | "high" | string;
}

export interface RecruiterTimelineEvent {
  second: number;
  title: string;
  description: string;
  sentiment: "positive" | "neutral" | "negative" | string;
}

export interface RecruiterViewResponse {
  recruiter_score: number;

  signals: RecruiterSignals;

  strengths: string[];

  weak_spots: string[];

  missing_impact: string[];

  ai_feedback: RecruiterFeedbackCard[];

  attention_zones?: RecruiterAttentionZone[];

  scan_path?: RecruiterScanPathPoint[];

  drop_off_points?: RecruiterDropOffPoint[];

  recruiter_timeline?: RecruiterTimelineEvent[];
}

export interface RecruiterViewRequest {
  language: string;

  resume_content: string;

  target_role?: string;

  resume_id?: number | string;
}

export interface SavedRecruiterViewResponse {
  id: number;

  user_id: number;

  resume_id: number;

  recruiter_score: number | null;

  analysis: RecruiterViewResponse | null;

  analyzed_at: string;
}
