import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  getResume,
  updateResume,
} from "@/features/resume/api/resumeApi";

import type { Resume } from "@/features/resume/types/resume";

function normalizeResumeResponse(
  response: any,
): Resume {
  return (
    response?.data?.data ||
    response?.data?.resume ||
    response?.data ||
    response?.resume ||
    response
  );
}

export function useResume(
  resumeId: string,
) {
  const [resume, setResumeState] =
    useState<Resume | null>(null);

  const resumeRef =
    useRef<Resume | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const setResume = (
    updater:
      | Resume
      | null
      | ((
          prev: Resume | null,
        ) => Resume | null),
  ) => {
    const nextResume =
      typeof updater === "function"
        ? updater(resumeRef.current)
        : updater;

    resumeRef.current = nextResume;

    setResumeState(nextResume);
  };

  useEffect(() => {
    async function load() {
      try {
        const response =
          await getResume(
            resumeId,
          );

        const data =
          normalizeResumeResponse(
            response,
          );

        setResume(data);
      } catch (error) {
        console.error(
          "Resume loading failed:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [resumeId]);

  const saveResume = async () => {
    const currentResume =
      resumeRef.current;

    if (!currentResume) {
      throw new Error(
        "Resume missing",
      );
    }

    try {
      const response =
        await updateResume(
          resumeId,
          {
            title:
              currentResume.title,
            template:
              currentResume.template,
            data: currentResume,
          },
        );

      const normalizedResume =
        normalizeResumeResponse(
          response,
        );

      setResume(normalizedResume);

      return normalizedResume;
    } catch (error) {
      console.error(
        "Resume save failed:",
        error,
      );

      throw error;
    }
  };

  return {
    resume,
    setResume,
    isLoading,
    saveResume,
  };
}