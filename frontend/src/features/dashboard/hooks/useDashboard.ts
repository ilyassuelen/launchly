import { useState } from "react";

import {
  fetchDashboardSummary,
  runDashboardReview,
} from "@/features/dashboard/api/dashboardApi";

import type {
  DashboardSummaryResponse,
} from "@/features/dashboard/types/dashboard";

export function useDashboard() {
  const [
    summary,
    setSummary,
  ] = useState<DashboardSummaryResponse | null>(
    null,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    isReviewing,
    setIsReviewing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const loadSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response =
        await fetchDashboardSummary();

      setSummary(response);

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard summary",
      );

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reviewDashboard = async () => {
    try {
      setIsReviewing(true);
      setError(null);

      const response =
        await runDashboardReview();

      setSummary(response);

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to run dashboard review",
      );

      throw error;
    } finally {
      setIsReviewing(false);
    }
  };

  return {
    summary,
    isLoadingDashboard: isLoading,
    isReviewingDashboard: isReviewing,
    error,
    loadSummary,
    reviewDashboard,
    setSummary,
  };
}
