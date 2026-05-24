import { useState } from "react";

import {
  analyzeRecruiterView,
  getSavedRecruiterViewAnalysis,
} from "@/features/recruiter/api/recruiterApi";

import type {
  RecruiterViewRequest,
  RecruiterViewResponse,
  SavedRecruiterViewResponse,
} from "@/features/recruiter/types/recruiterView";

export function useRecruiterView() {
  const [
    analysis,
    setAnalysis,
  ] = useState<RecruiterViewResponse | null>(
    null,
  );

  const [
    savedAnalysis,
    setSavedAnalysis,
  ] = useState<SavedRecruiterViewResponse | null>(
    null,
  );

  const [
    isAnalyzing,
    setIsAnalyzing,
  ] = useState(false);

  const [
    isLoadingSavedAnalysis,
    setIsLoadingSavedAnalysis,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const analyze = async (
    payload: RecruiterViewRequest,
  ) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const response =
        await analyzeRecruiterView(payload);

      setAnalysis(response);

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to analyze recruiter view",
      );

      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSavedAnalysis = async (
    resumeId: number | string,
  ) => {
    try {
      setIsLoadingSavedAnalysis(true);
      setError(null);

      const response =
        await getSavedRecruiterViewAnalysis(
          resumeId,
        );

      setSavedAnalysis(response);
      setAnalysis(response?.analysis || null);

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load saved recruiter analysis",
      );

      return null;
    } finally {
      setIsLoadingSavedAnalysis(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setSavedAnalysis(null);
    setError(null);
  };

  return {
    analysis,
    savedAnalysis,
    isAnalyzing,
    isLoadingSavedAnalysis,
    error,
    analyze,
    loadSavedAnalysis,
    resetAnalysis,
    setAnalysis,
  };
}
