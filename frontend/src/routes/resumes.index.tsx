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
  MoreHorizontal,
  Copy,
  Trash2,
} from "lucide-react";

import {
  AppShell,
  Card,
} from "@/components/launchly/AppShell";

import { useI18n } from "@/i18n/I18nContext";

import { ResumeThumbnail } from "@/features/resume/components/ResumeThumbnail";

import {
  getResumes,
  createResume,
  duplicateResume,
  deleteResume,
} from "@/features/resume/api/resumeApi";

import { mockResume } from "@/data/mockResume";

export const Route =
  createFileRoute("/resumes/")({
    component: ResumesPage,
  });

function ResumesPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [resumes, setResumes] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadResumes() {
    try {
      const data =
        await getResumes();

      setResumes(
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
    loadResumes();
  }, []);

  const truncateTitle = (
    title: string,
    maxLength = 45,
  ) => {
    if (!title) {
      return "";
    }

    return title.length > maxLength
      ? `${title.slice(0, maxLength)}...`
      : title;
  };

  const handleCreateResume =
    async () => {
      try {
        const response =
          await createResume({
            title: t("resume.newResume"),
            template: "aurora",
            data: mockResume,
          });

        const resume = response;

        console.log("Created resume:", resume);

        await new Promise((resolve) =>
            setTimeout(resolve, 150),
        );

        navigate({
          to: `/resumes/${resume.id}`,
        });
      } catch (error) {
        console.error(error);
      }
    };

  const handleDuplicate =
    async (id: number) => {
      try {
        await duplicateResume(id);

        loadResumes();
      } catch (error) {
        console.error(error);
      }
    };

  const handleDelete =
    async (id: number) => {
      try {
        await deleteResume(id);

        setResumes((prev) =>
          prev.filter(
            (resume) =>
              resume.id !== id,
          ),
        );
      } catch (error) {
        console.error(error);
      }
    };

  if (loading) {
    return (
      <div className="p-10 text-white">
        {t("resume.loadingResumes")}
      </div>
    );
  }

  return (
    <AppShell
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <button
          onClick={
            handleCreateResume
          }
          className="group flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] transition hover:border-violet-400/30 hover:bg-violet-500/[0.03]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition group-hover:scale-105">
            <Plus className="size-7 text-white/70" />
          </div>

          <div className="mt-5 text-lg font-semibold">
            {t("resume.createResume")}
          </div>

          <div className="mt-1 text-sm text-muted-foreground">
            {t("resume.createNewVariant")}
          </div>
        </button>

        {resumes.map((resume) => (
          <Card
            key={resume.id}
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
                  to: `/resumes/${resume.id}`,
                })
              }
              className="w-full text-left"
            >
              <div className="aspect-[0.75] overflow-hidden border-b border-white/5 bg-[#0b1020] p-2">
                <ResumeThumbnail
                  resume={resume.data}
                />
              </div>

              <div className="p-4">
                <div className="line-clamp-2 min-h-[48px] text-[15px] font-semibold leading-5 tracking-tight">
                  {truncateTitle(resume.title)}
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {resume.template}
                </div>
              </div>
            </button>

            <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">

              <button
                onClick={() =>
                  handleDuplicate(
                    resume.id,
                  )
                }
                className="rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur"
              >
                <Copy className="size-4" />
              </button>

              <button
                onClick={() =>
                  handleDelete(
                    resume.id,
                  )
                }
                className="rounded-xl border border-red-400/10 bg-red-500/10 p-2 text-red-300 backdrop-blur"
              >
                <Trash2 className="size-4" />
              </button>

            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}