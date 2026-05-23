import { useState } from "react";

import {
  createApplication,
  deleteApplication,
  fetchApplications,
  updateApplication,
} from "@/features/applications/api/applicationsApi";

import type {
  ApplicationCreatePayload,
  ApplicationItem,
  ApplicationListResponse,
  ApplicationStats,
  ApplicationStatus,
  ApplicationUpdatePayload,
} from "@/features/applications/types/application";

const emptyStats: ApplicationStats = {
  active: 0,
  response_rate: 0,
  offers: 0,
  follow_ups_due: 0,
};

export function useApplications() {
  const [
    applications,
    setApplications,
  ] = useState<ApplicationItem[]>([]);

  const [
    stats,
    setStats,
  ] = useState<ApplicationStats>(
    emptyStats,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const applyListResponse = (
    response: ApplicationListResponse,
  ) => {
    setApplications(response.applications);
    setStats(response.stats);
  };

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response =
        await fetchApplications();

      applyListResponse(response);

      return response;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load applications",
      );

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createNewApplication = async (
    payload: ApplicationCreatePayload,
  ) => {
    try {
      setIsSaving(true);
      setError(null);

      await createApplication(payload);

      await loadApplications();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create application",
      );

      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const updateExistingApplication = async (
    applicationId: number,
    payload: ApplicationUpdatePayload,
  ) => {
    try {
      setIsSaving(true);
      setError(null);

      await updateApplication(
        applicationId,
        payload,
      );

      await loadApplications();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update application",
      );

      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteExistingApplication = async (
    applicationId: number,
  ) => {
    try {
      setIsSaving(true);
      setError(null);

      await deleteApplication(
        applicationId,
      );

      await loadApplications();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete application",
      );

      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    applications,
    stats,
    isLoadingApplications: isLoading,
    isSavingApplication: isSaving,
    error,
    loadApplications,
    createApplication: createNewApplication,
    updateApplication: updateExistingApplication,

    updateApplicationStatus: async (
        applicationId: number,
        status: ApplicationStatus,
    ) => {
        await updateExistingApplication(applicationId, {
            status,
        });
    },
    deleteApplication: deleteExistingApplication,
    setApplications,
    setStats,
  };
}
