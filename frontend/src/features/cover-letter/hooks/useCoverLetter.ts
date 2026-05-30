import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  getCoverLetter,
  updateCoverLetter,
} from "@/features/cover-letter/api/coverLetterApi";

import type { CoverLetter } from "@/features/cover-letter/types/coverLetter";

function normalizeCoverLetterResponse(
  response: any,
) {
  const backendCoverLetter =
    response?.data?.cover_letter ||
    response?.cover_letter ||
    response?.data ||
    response;

  if (!backendCoverLetter) {
    throw new Error(
      "Invalid cover letter response",
    );
  }

  const coverLetterData =
    backendCoverLetter.data ||
    backendCoverLetter;

  return {
    ...coverLetterData,

    id:
      backendCoverLetter.id ??
      coverLetterData.id,

    title:
      backendCoverLetter.title ??
      coverLetterData.title,

    template:
      backendCoverLetter.template ??
      coverLetterData.template,

    createdAt:
      backendCoverLetter.created_at ??
      coverLetterData.createdAt,

    updatedAt:
      backendCoverLetter.updated_at ??
      coverLetterData.updatedAt,

    created_at:
      backendCoverLetter.created_at ??
      coverLetterData.created_at,

    updated_at:
      backendCoverLetter.updated_at ??
      coverLetterData.updated_at,

    latest_cover_letter_analysis:
      backendCoverLetter.latest_cover_letter_analysis ??
      coverLetterData.latest_cover_letter_analysis,

    latest_cover_letter_analysis_created_at:
      backendCoverLetter.latest_cover_letter_analysis_created_at ??
      coverLetterData.latest_cover_letter_analysis_created_at,
  };
}

export function useCoverLetter(
  coverLetterId: string,
) {
  const [
    coverLetter,
    setCoverLetterState,
  ] = useState<CoverLetter | null>(
    null,
  );

  const coverLetterRef =
    useRef<CoverLetter | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const setCoverLetter = (
    updater:
      | CoverLetter
      | null
      | ((
          prev: CoverLetter | null,
        ) => CoverLetter | null),
  ) => {
    const nextCoverLetter =
      typeof updater === "function"
        ? updater(
            coverLetterRef.current,
          )
        : updater;

    coverLetterRef.current =
      nextCoverLetter;

    setCoverLetterState(
      nextCoverLetter,
    );
  };

  useEffect(() => {
    async function load() {
      try {
        const response =
          await getCoverLetter(
            coverLetterId,
          );

        const data =
          normalizeCoverLetterResponse(
            response,
          );

        setCoverLetter(data);
      } catch (error) {
        console.error(
          "Cover letter loading failed:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [coverLetterId]);

  const saveCoverLetter =
    async () => {
      const currentCoverLetter =
        coverLetterRef.current;

      if (!currentCoverLetter) {
        throw new Error(
          "Cover letter missing",
        );
      }

      try {
        const {
          id,
          createdAt,
          updatedAt,
          created_at,
          updated_at,
          latest_cover_letter_analysis,
          latest_cover_letter_analysis_created_at,
          ...coverLetterData
        } = currentCoverLetter;

        const response =
          await updateCoverLetter(
            coverLetterId,
            {
              title:
                currentCoverLetter.title,

              template:
                currentCoverLetter.template,

              data: coverLetterData,
            },
          );

        const normalizedCoverLetter =
          normalizeCoverLetterResponse(
            response,
          );

        setCoverLetter(
          normalizedCoverLetter,
        );

        return normalizedCoverLetter;
      } catch (error) {
        console.error(
          "Cover letter save failed:",
          error,
        );

        throw error;
      }
    };

  return {
    coverLetter,
    setCoverLetter,
    isLoading,
    saveCoverLetter,
  };
}