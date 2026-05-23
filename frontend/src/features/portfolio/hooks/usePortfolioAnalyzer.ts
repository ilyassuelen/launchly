import { useState } from "react";

import {
  analyzePortfolio,
  getPortfolioProfile,
} from "@/features/portfolio/api/portfolioApi";

import type {
  PortfolioAnalyzerRequest,
  PortfolioAnalyzerResponse,
  PortfolioProfileData,
} from "@/features/portfolio/types/portfolioAnalyzer";

export function usePortfolioAnalyzer() {
  const [
    analysis,
    setAnalysis,
  ] = useState<PortfolioAnalyzerResponse | null>(
    null,
  );

  const [
    profile,
    setProfile,
  ] = useState<PortfolioProfileData | null>(
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
    error,
    setError,
  ] = useState<string | null>(null);

  const analyze = async (
    payload: PortfolioAnalyzerRequest,
  ) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const response =
        await analyzePortfolio(payload);

      setAnalysis(response);

      setProfile({
        github_username: payload.github_username,
        language: payload.language,
        analysis: response,
      });

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to analyze GitHub portfolio",
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
        await getPortfolioProfile();

      setProfile(response);

      if (response?.analysis) {
        setAnalysis(response.analysis);
      }

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load saved portfolio analysis",
      );

      return null;
    } finally {
      setIsLoadingProfile(false);
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
    error,
    analyze,
    loadProfile,
    resetAnalysis,
    setAnalysis,
  };
}
