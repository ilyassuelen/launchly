import { useEffect, useState } from "react";

import {
  getResumes,
} from "@/features/resume/api/resumeApi";

export function useResumes() {

  const [resumes, setResumes] =
    useState<any[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {

    async function loadResumes() {

      try {

        const data =
          await getResumes();

        setResumes(data || []);

      } catch (error) {

        console.error(error);

      } finally {

        setIsLoading(false);

      }
    }

    loadResumes();

  }, []);

  return {
    resumes,
    isLoading,
  };
}
