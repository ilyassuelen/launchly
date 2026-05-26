export type CareerPathPriority = "high" | "medium" | "low";

export type CareerPathDifficulty = "easy" | "medium" | "hard";

export type CareerPathGenerateRequest = {
  language?: string;
  target_role: string;
  current_level?: string | null;
  timeframe_months?: number | null;
};

export type CareerPathMilestone = {
  title: string;
  description: string;
  timeframe: string;
  priority: CareerPathPriority | string;
  tasks: string[];
};

export type CareerPathSkillGap = {
  skill: string;
  current_level: string;
  target_level: string;
  reason: string;
  priority: CareerPathPriority | string;
};

export type CareerPathLearningItem = {
  title: string;
  description: string;
  type: string;
  estimated_time: string;
  priority: CareerPathPriority | string;
};

export type CareerPathProjectItem = {
  title: string;
  description: string;
  skills_practiced: string[];
  portfolio_value: string;
  difficulty: CareerPathDifficulty | string;
};

export type CareerPathApplicationStrategyItem = {
  title: string;
  description: string;
  action_items: string[];
};

export type CareerPathInputSnapshot = {
  target_role?: string;
  current_level?: string | null;
  timeframe_months?: number | null;
};

export type CareerPath = {
  id: number;
  user_id: number;

  target_role: string;
  current_level?: string | null;
  timeframe_months?: number | null;

  input_snapshot?: CareerPathInputSnapshot | null;

  roadmap: CareerPathMilestone[];
  skill_gaps: CareerPathSkillGap[];
  learning_plan: CareerPathLearningItem[];
  project_plan: CareerPathProjectItem[];
  application_strategy: CareerPathApplicationStrategyItem[];

  summary?: string | null;
  confidence_score?: number | null;
  role_fit?: "high" | "medium" | "low" | "very_low" | string | null;
  role_fit_summary?: string | null;
  status: string;

  created_at: string;
  updated_at: string;
};
