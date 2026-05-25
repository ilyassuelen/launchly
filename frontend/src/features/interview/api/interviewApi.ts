import { apiFetch } from "@/lib/api";

import type {
  InterviewAnswerRequest,
  InterviewAnswerResponse,
  InterviewSession,
  InterviewSessionDetailResponse,
  InterviewStartRequest,
  InterviewStartResponse,
  InterviewStatsResponse,
} from "@/features/interview/types/interview";

export async function startInterviewSession(
  payload: InterviewStartRequest,
): Promise<InterviewStartResponse> {
  return apiFetch<InterviewStartResponse>(
    "/interview/sessions",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function submitInterviewAnswer(
  sessionId: number,
  payload: InterviewAnswerRequest,
): Promise<InterviewAnswerResponse> {
  return apiFetch<InterviewAnswerResponse>(
    `/interview/sessions/${sessionId}/answer`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function getInterviewSession(
  sessionId: number,
): Promise<InterviewSessionDetailResponse> {
  return apiFetch<InterviewSessionDetailResponse>(
    `/interview/sessions/${sessionId}`,
  );
}

export async function getInterviewSessions(): Promise<
  InterviewSession[]
> {
  return apiFetch<InterviewSession[]>(
    "/interview/sessions",
  );
}

export async function getInterviewStats(): Promise<InterviewStatsResponse> {
  return apiFetch<InterviewStatsResponse>(
    "/interview/stats",
  );
}

export async function resetInterviewSessions(): Promise<{
  success: boolean;
  deleted_sessions: number;
}> {
  return apiFetch<{
    success: boolean;
    deleted_sessions: number;
  }>(
    "/interview/sessions",
    {
      method: "DELETE",
    },
  );
}
