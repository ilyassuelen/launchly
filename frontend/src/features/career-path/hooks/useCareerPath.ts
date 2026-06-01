import { useCallback, useMemo, useState } from "react";

import {
  deleteCareerPath,
  fetchCareerPaths,
  fetchLatestCareerPath,
  generateCareerPath,
} from "../api/careerPathApi";

import type {
  CareerPath,
  CareerPathGenerateRequest,
} from "../types/careerPath";

type UseCareerPathResult = {
  careerPaths: CareerPath[];
  latestCareerPath: CareerPath | null;
  selectedCareerPath: CareerPath | null;

  isLoading: boolean;
  isGenerating: boolean;
  isDeleting: boolean;
  error: string | null;

  hasCareerPaths: boolean;

  loadCareerPaths: () => Promise<void>;
  loadLatestCareerPath: () => Promise<void>;
  createCareerPath: (payload: CareerPathGenerateRequest) => Promise<CareerPath | null>;
  removeCareerPath: (careerPathId: number) => Promise<boolean>;

  selectCareerPath: (careerPath: CareerPath | null) => void;
  clearError: () => void;
};

export function useCareerPath(): UseCareerPathResult {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [latestCareerPath, setLatestCareerPath] = useState<CareerPath | null>(null);
  const [selectedCareerPath, setSelectedCareerPath] = useState<CareerPath | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasCareerPaths = useMemo(() => careerPaths.length > 0, [careerPaths]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadCareerPaths = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCareerPaths();
      setCareerPaths(data);

      const latest = data[0] ?? null;
      setLatestCareerPath(latest);

      setSelectedCareerPath((current) => {
        if (!current) {
          return latest;
        }

        return data.find((item) => item.id === current.id) ?? latest;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load career paths.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadLatestCareerPath = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const latest = await fetchLatestCareerPath();

      setLatestCareerPath(latest);
      setSelectedCareerPath(latest);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load latest career path.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCareerPath = useCallback(
    async (payload: CareerPathGenerateRequest): Promise<CareerPath | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const created = await generateCareerPath(payload);

        setCareerPaths((current) => [created, ...current]);
        setLatestCareerPath(created);
        setSelectedCareerPath(created);

        return created;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not generate career path.",
        );

        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [],
  );

  const removeCareerPath = useCallback(
    async (careerPathId: number): Promise<boolean> => {
      setIsDeleting(true);
      setError(null);

      try {
        await deleteCareerPath(careerPathId);

        setCareerPaths((current) => {
          const updated = current.filter((item) => item.id !== careerPathId);
          const nextLatest = updated[0] ?? null;

          setLatestCareerPath(nextLatest);
          setSelectedCareerPath((selected) => {
            if (selected?.id === careerPathId) {
              return nextLatest;
            }

            return selected;
          });

          return updated;
        });

        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not delete career path.",
        );

        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [],
  );

  const selectCareerPath = useCallback((careerPath: CareerPath | null) => {
    setSelectedCareerPath(careerPath);
  }, []);

  return {
    careerPaths,
    latestCareerPath,
    selectedCareerPath,

    isLoading,
    isGenerating,
    isDeleting,
    error,

    hasCareerPaths,

    loadCareerPaths,
    loadLatestCareerPath,
    createCareerPath,
    removeCareerPath,

    selectCareerPath,
    clearError,
  };
}
