import { useState } from "react";

import {
  getInterviewSession,
  getInterviewSessions,
  getInterviewStats,
  resetInterviewSessions,
  startInterviewSession,
  submitInterviewAnswer,
} from "@/features/interview/api/interviewApi";

import type {
  InterviewAnswerResponse,
  InterviewDifficulty,
  InterviewMessage,
  InterviewMode,
  InterviewResult,
  InterviewSession,
  InterviewStartRequest,
  InterviewStatsResponse,
} from "@/features/interview/types/interview";

export function useInterview() {
  const [mode, setMode] = useState<InterviewMode>("behavioral");
  const [role, setRole] = useState("AI Engineer");
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("Junior");
  const [maxQuestions, setMaxQuestions] = useState(5);

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [answer, setAnswer] = useState("");

  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [stats, setStats] = useState<InterviewStatsResponse | null>(null);

  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      setIsLoadingSessions(true);
      setError(null);

      const response = await getInterviewSessions();

      setSessions(response);

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load interview sessions",
      );

      return [];
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      setError(null);

      const response = await getInterviewStats();

      setStats(response);

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load interview stats",
      );

      return null;
    } finally {
      setIsLoadingStats(false);
    }
  };

  const startInterview = async () => {
    const cleanRole = role.trim();

    if (!cleanRole) {
      setError("Please enter a target role before starting the interview.");
      return null;
    }

    try {
      setIsStarting(true);
      setError(null);
      setResult(null);
      setMessages([]);
      setAnswer("");

      const payload: InterviewStartRequest = {
        mode,
        role: cleanRole,
        difficulty,
        max_questions: maxQuestions,
      };

      const response = await startInterviewSession(payload);

      setSession(response.session);
      setMessages([response.first_message]);

      await loadSessions();

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to start interview",
      );

      return null;
    } finally {
      setIsStarting(false);
    }
  };

  const submitAnswer = async () => {
    if (!session) {
      setError("Start an interview before submitting an answer.");
      return null;
    }

    const cleanAnswer = answer.trim();

    if (!cleanAnswer) {
      setError("Please write an answer before submitting.");
      return null;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response: InterviewAnswerResponse = await submitInterviewAnswer(
        session.id,
        {
          answer: cleanAnswer,
        },
      );

      setSession(response.session);
      setAnswer("");
      setMessages((currentMessages) => [
        ...currentMessages,
        response.user_message,
        ...(response.ai_message ? [response.ai_message] : []),
      ]);

      if (response.result) {
        setResult(response.result);
        await loadStats();
        await loadSessions();
      }

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit answer",
      );

      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadSessionDetail = async (sessionId: number) => {
    try {
      setIsLoadingSessions(true);
      setError(null);
      setAnswer("");

      const response = await getInterviewSession(sessionId);

      setSession(response.session);
      setMessages(response.messages || []);
      setResult(response.result || null);

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load interview session",
      );

      return null;
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const clearInterviewHistory = async () => {
      try {
        setIsLoadingSessions(true);
        setIsLoadingStats(true);
        setError(null);

        const response = await resetInterviewSessions();

        setSessions([]);
        setStats(null);
        setSession(null);
        setMessages([]);
        setResult(null);
        setAnswer("");

        return response;
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to reset interview history",
        );

        return null;
      } finally {
        setIsLoadingSessions(false);
        setIsLoadingStats(false);
      }
  };

  const resetInterview = () => {
    setSession(null);
    setMessages([]);
    setResult(null);
    setAnswer("");
    setError(null);
  };

  return {
    mode,
    role,
    difficulty,
    maxQuestions,

    session,
    messages,
    result,
    answer,

    sessions,
    stats,

    isStarting,
    isSubmitting,
    isLoadingSessions,
    isLoadingStats,
    error,

    setMode,
    setRole,
    setDifficulty,
    setMaxQuestions,
    setAnswer,

    startInterview,
    submitAnswer,
    loadSessions,
    loadStats,
    loadSessionDetail,
    resetInterview,
    clearInterviewHistory,
  };
}
