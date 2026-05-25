export type InterviewMode =
  | "behavioral"
  | "technical"
  | "system-design";

export type InterviewDifficulty =
  | "Junior"
  | "Mid"
  | "Senior";

export type InterviewLanguage =
  | "en"
  | "de";

export type InterviewInsightImpact =
  | "low"
  | "medium"
  | "high";

export type InterviewStatus =
  | "active"
  | "completed";

export interface InterviewStartRequest {
  mode: string;
  role: string;
  difficulty: string;
  language: string;
  max_questions: number;
}

export interface InterviewAnswerRequest {
  answer: string;
}

export interface InterviewMessage {
  id?: number;

  session_id: number;

  role: string;
  content: string;

  question_index?: number | null;

  message_type: string;

  meta: Record<string, unknown>;

  created_at?: string | null;
}

export interface InterviewSession {
  id: number;

  user_id: number;

  mode: string;
  role: string;
  difficulty: string;
  language: string;

  status: InterviewStatus;

  current_question_index: number;
  max_questions: number;

  resume_context: Record<string, unknown>;
  session_context: Record<string, unknown>;

  started_at?: string | null;
  ended_at?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
}

export interface InterviewInsight {
  title: string;
  description: string;
  impact: InterviewInsightImpact;
}

export interface InterviewResult {
  id?: number;

  session_id: number;
  user_id: number;

  mode: string;
  role: string;
  difficulty: string;
  language: string;

  overall_score: number;

  confidence_score: number;
  communication_score: number;
  structure_score: number;
  specificity_score: number;

  recruiter_engagement?: string | null;
  filler_words?: string | null;
  estimated_confidence?: string | null;

  strengths: string[];
  weaknesses: string[];

  recruiter_insights: InterviewInsight[];

  coaching_tips: string[];

  raw_evaluation: Record<string, unknown>;

  created_at?: string | null;
}

export interface InterviewStartResponse {
  session: InterviewSession;
  first_message: InterviewMessage;
}

export interface InterviewAnswerResponse {
  session: InterviewSession;

  user_message: InterviewMessage;

  ai_message?: InterviewMessage | null;

  result?: InterviewResult | null;
}

export interface InterviewSessionDetailResponse {
  session: InterviewSession;

  messages: InterviewMessage[];

  result?: InterviewResult | null;
}

export interface InterviewStatsBucket {
  difficulty: string;

  sessions: number;

  average_score: number;

  best_score: number;
}

export interface InterviewStatsResponse {
  total_sessions: number;

  average_score: number;

  best_score: number;

  by_difficulty: InterviewStatsBucket[];

  recent_results: InterviewResult[];
}
