import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Copy,
  Trash2,
} from "lucide-react";

import {
  AppShell,
  Card,
} from "@/components/launchly/AppShell";

import {
  getCoverLetters,
  createCoverLetter,
  duplicateCoverLetter,
  deleteCoverLetter,
} from "@/features/cover-letter/api/coverLetterApi";

import { CoverLetterThumbnail } from "@/features/cover-letter/components/CoverLetterThumbnail";

import { mockCoverLetter } from "@/data/mockCoverLetter";

export const Route =
  createFileRoute(
    "/cover-letters/",
  )({
    component:
      CoverLettersPage,
  });

function CoverLettersPage() {
  const navigate =
    useNavigate();

  const [
    coverLetters,
    setCoverLetters,
  ] = useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadCoverLetters() {
    try {
      const data =
        await getCoverLetters();

      setCoverLetters(
        data?.data ||
          data ||
          [],
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoverLetters();
  }, []);

  const truncateTitle = (
    title: string,
    maxLength = 45,
  ) => {
    if (!title) {
      return "";
    }

    return title.length >
      maxLength
      ? `${title.slice(
          0,
          maxLength,
        )}...`
      : title;
  };

  const getCoverLetterDisplayTitle = (
      coverLetter: any,
    ) => {
      const data =
        coverLetter.data ||
        coverLetter;

      return (
        data.content?.subject ||
        coverLetter.title ||
        "Untitled Cover Letter"
      );
  };

  const handleCreateCoverLetter =
    async () => {
      try {
        const response =
          await createCoverLetter(
            {
              title:
                "New Cover Letter",

              template:
                "classic",

              data: mockCoverLetter,
            },
          );

        const coverLetter =
          response;

        console.log(
          "Created cover letter:",
          coverLetter,
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              150,
            ),
        );

        navigate({
          to: `/cover-letters/${coverLetter.id}`,
        });
      } catch (error) {
        console.error(error);
      }
    };

  const handleDuplicate =
    async (id: number) => {
      try {
        await duplicateCoverLetter(
          id,
        );

        loadCoverLetters();
      } catch (error) {
        console.error(error);
      }
    };

  const handleDelete =
    async (id: number) => {
      try {
        await deleteCoverLetter(
          id,
        );

        setCoverLetters(
          (prev) =>
            prev.filter(
              (
                coverLetter,
              ) =>
                coverLetter.id !==
                id,
            ),
        );
      } catch (error) {
        console.error(error);
      }
    };

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading cover letters...
      </div>
    );
  }

  return (
    <AppShell
      title="Cover Letters"
      subtitle="Manage your cover letter variants."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <button
          onClick={
            handleCreateCoverLetter
          }
          className="group flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] transition hover:border-violet-400/30 hover:bg-violet-500/[0.03]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition group-hover:scale-105">
            <Plus className="size-7 text-white/70" />
          </div>

          <div className="mt-5 text-lg font-semibold">
            Create Cover Letter
          </div>

          <div className="mt-1 text-sm text-muted-foreground">
            Create a new variant
          </div>
        </button>

        {coverLetters.map(
          (coverLetter) => (
            <Card
              key={
                coverLetter.id
              }
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/5
                bg-white/[0.02]
                p-0
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-violet-400/20
                hover:shadow-[0_20px_60px_rgba(139,92,246,0.12)]
              "
            >
              <button
                onClick={() =>
                  navigate({
                    to: `/cover-letters/${coverLetter.id}`,
                  })
                }
                className="w-full text-left"
              >
                <div className="aspect-[0.75] overflow-hidden border-b border-white/5 bg-[#0b1020] p-2">
                  <CoverLetterThumbnail
                    coverLetter={
                      coverLetter.data || coverLetter
                    }
                  />
                </div>

                <div className="p-4">
                  <div className="line-clamp-2 min-h-[48px] text-[15px] font-semibold leading-5 tracking-tight">
                    {truncateTitle(
                        getCoverLetterDisplayTitle(
                            coverLetter,
                        ),
                    )}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">

                      Template · {
                          coverLetter.template
                              ? coverLetter.template.charAt(0).toUpperCase() +
                                  coverLetter.template.slice(1)
                              : "Classic"
                      }
                  </div>
                </div>
              </button>

              <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">

                <button
                  onClick={() =>
                    handleDuplicate(
                      coverLetter.id,
                    )
                  }
                  className="rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur"
                >
                  <Copy className="size-4" />
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      coverLetter.id,
                    )
                  }
                  className="rounded-xl border border-red-400/10 bg-red-500/10 p-2 text-red-300 backdrop-blur"
                >
                  <Trash2 className="size-4" />
                </button>

              </div>
            </Card>
          ),
        )}
      </div>
    </AppShell>
  );
}