export interface DashboardMetric {
  value: number;
  label?: string | null;
  delta?: string | null;
}

export interface CareerGrowthPoint {
  d: string;
  v: number;
}

export interface DashboardInsight {
  title: string;
  description: string;
  action_label: string;
  target_path: string;
  type: string;
}

export interface DashboardApplicationItem {
  company_name: string;
  job_title: string;
  status: string;
  date_label?: string | null;
}

export interface DashboardMissingSkill {
  skill: string;
  priority: "high" | "medium" | "low" | string;
}

export interface DashboardActivity {
  streak_days: number;
  heatmap: number[];
}

export interface DashboardMarketFit {
  score?: number;
  label?: string;
  best_role_match?: string;
  recruiter_confidence?: number;
  positioning?: number;
  portfolio_match?: number;
  skills?: number;
  demand?: string;
  visibility?: string;
  hiring_readiness?: string;
  market_competitiveness?: string;
}

export interface DashboardActionItem {
  title: string;
  description: string;
  action_label: string;
  target_path: string;
  priority: "high" | "medium" | "low" | string;
  type: string;
}

export interface DashboardSystemHealth {
  resume: number;
  recruiter_view: number;
  linkedin: number;
  portfolio: number;
  applications: number;
  interview: number;
}

export interface DashboardWeeklyPlanItem {
  day: string;
  title: string;
  description: string;
  target_path?: string | null;
}

export interface DashboardSummaryResponse {
  id?: number | null;

  career_score: DashboardMetric;
  recruiter_impression: DashboardMetric;
  resume_health: DashboardMetric;
  interview_readiness: DashboardMetric;

  market_fit: DashboardMarketFit;
  profile_strength: Record<string, number>;
  career_growth: CareerGrowthPoint[];
  application_pipeline: DashboardApplicationItem[];
  insights: DashboardInsight[];
  missing_skills: DashboardMissingSkill[];
  activity: DashboardActivity;

  next_best_actions: DashboardActionItem[];
  system_health: DashboardSystemHealth;
  weekly_plan: DashboardWeeklyPlanItem[];
  review_payload: Record<string, unknown>;

  created_at?: string | null;
  updated_at?: string | null;
}
