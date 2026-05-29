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
  const backendResume =
    response?.data?.resume ||
    response?.resume ||
    response;

  if (!backendResume) {
    throw new Error(
      "Invalid resume response",
    );
  }

  const resumeData =
    backendResume.data &&
    typeof backendResume.data === "object"
      ? backendResume.data
      : {};

  return {
    ...resumeData,

    id: backendResume.id,
    title: backendResume.title,
    template: backendResume.template,

    latest_ats_score:
      backendResume.latest_ats_score,
    latest_resume_analysis:
      backendResume.latest_resume_analysis,
    analyzed_at:
      backendResume.analyzed_at,

    created_at:
      backendResume.created_at,
    updated_at:
      backendResume.updated_at,
  };
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
      const {
        id,
        latest_ats_score,
        latest_resume_analysis,
        analyzed_at,
        created_at,
        updated_at,
        ...resumeData
      } = currentResume;

      const response =
        await updateResume(
          resumeId,
          {
            title:
              currentResume.title,
            template:
              currentResume.template,

            data: resumeData,

            latest_ats_score:
                currentResume.latest_ats_score,
            latest_resume_analysis:
                currentResume.latest_resume_analysis,
            analyzed_at:
                currentResume.analyzed_at,
          },
        );

      const normalizedResume =
        normalizeResumeResponse(
          response,
        );

      const mergedResume = {
          ...normalizedResume,

          latest_ats_score:
            normalizedResume.latest_ats_score &&
            normalizedResume.latest_ats_score > 0
                ? normalizedResume.latest_ats_score
                : currentResume.latest_ats_score,

          latest_resume_analysis:
            normalizedResume.latest_resume_analysis ||
            currentResume.latest_resume_analysis,

          analyzed_at:
            normalizedResume.analyzed_at ||
            currentResume.analyzed_at,
      };

      setResume(mergedResume);

      return mergedResume;
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
