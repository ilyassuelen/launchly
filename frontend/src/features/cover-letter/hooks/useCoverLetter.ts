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
): CoverLetter {
  return (
    response?.data?.data ||
    response?.data?.coverLetter ||
    response?.data ||
    response?.coverLetter ||
    response
  );
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
        const response =
          await updateCoverLetter(
            coverLetterId,
            {
              title:
                currentCoverLetter.title,

              template:
                currentCoverLetter.template,

              data: currentCoverLetter,
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