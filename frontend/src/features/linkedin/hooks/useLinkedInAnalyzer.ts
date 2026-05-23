import { useState } from "react";

import {
  analyzeLinkedInProfile,
  getLinkedInProfile,
  saveLinkedInProfile,
} from "@/features/linkedin/api/linkedinApi";

import type {
  LinkedInAnalyzerRequest,
  LinkedInAnalyzerResponse,
  LinkedInProfileData,
} from "@/features/linkedin/types/linkedinAnalyzer";

export function useLinkedInAnalyzer() {
  const [
    analysis,
    setAnalysis,
  ] = useState<LinkedInAnalyzerResponse | null>(
    null,
  );

  const [
    isAnalyzing,
    setIsAnalyzing,
  ] = useState(false);

  const [
    isLoadingProfile,
    setIsLoadingProfile,
  ] = useState(false);

  const [
    isSavingProfile,
    setIsSavingProfile,
  ] = useState(false);

  const [
    profile,
    setProfile,
  ] = useState<LinkedInProfileData | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const analyze = async (
    payload: LinkedInAnalyzerRequest,
  ) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const response =
        await analyzeLinkedInProfile(
          payload,
        );

      setAnalysis(response);

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to analyze LinkedIn profile",
      );

      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      setError(null);

      const response =
        await getLinkedInProfile();

      setProfile(response);

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load LinkedIn profile",
      );

      return null;
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const saveProfile = async (
    payload: LinkedInProfileData,
  ) => {
    try {
      setIsSavingProfile(true);
      setError(null);

      const response =
        await saveLinkedInProfile(
          payload,
        );

      setProfile(response);

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save LinkedIn profile",
      );

      throw error;
    } finally {
      setIsSavingProfile(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };
  return {
    analysis,
    profile,
    isAnalyzing,
    isLoadingProfile,
    isSavingProfile,
    error,
    analyze,
    loadProfile,
    saveProfile,
    resetAnalysis,
    setAnalysis,
  };
}
