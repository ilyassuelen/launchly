import {
  Type,
  Upload,
} from "lucide-react";
import type { Resume } from "@/features/resume/types/resume";

import { uploadResumePhoto } from "@/features/resume/api/uploadResumePhoto";
import type React from "react";

interface Props {
  resume: Resume;
  setResume: React.Dispatch<
    React.SetStateAction<any>
  >;
  updateBasics: (
    field: keyof NonNullable<Resume["basics"]>,
    value: string,
  ) => void;
  activeSection: string;
  setActiveSection: (value: string) => void;
}

export function PersonalInfoEditor({
  resume,
  setResume,
  updateBasics,
  activeSection,
  setActiveSection,
}: Props) {
  const basics = resume.basics || {};

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const response =
        await uploadResumePhoto(file);

      setResume((prev: any) => ({
        ...prev,
        basics: {
          ...(prev.basics || {}),
          photo: response.url,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Personal informations
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
          <img
            src={
              basics.photo
                ? basics.photo.startsWith("http")
                  ? basics.photo
                  : `${
                      import.meta.env.VITE_API_URL ||
                      "http://127.0.0.1:8000"
                    }${basics.photo}`
                : "https://ui-avatars.com/api/?name=User"
            }
            alt="Profile"
            className="size-24 rounded-full border border-white/10 object-cover"
          />

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08]">
            <Upload className="size-4" />

            Upload photo

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        <div>
          <div className="mb-1 text-[11px] text-muted-foreground">
            Full name
          </div>

          <input
            value={basics.fullName || ""}
            onChange={(e) =>
              updateBasics("fullName", e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/40"
          />
        </div>

        <div>
          <div className="mb-1 text-[11px] text-muted-foreground">
            Target role
          </div>

          <input
            value={basics.title || ""}
            onChange={(e) =>
              updateBasics("title", e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/40"
          />
        </div>

        <div>
          <div className="mb-1 text-[11px] text-muted-foreground">
            Email
          </div>

          <input
            value={basics.email || ""}
            onChange={(e) =>
              updateBasics("email", e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/40"
          />
        </div>

        {basics.website && (
          <div>
            <div className="mb-1 text-[11px] text-muted-foreground">
              Website
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  value={basics.website || ""}
                  onChange={(e) =>
                    updateBasics("website", e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-cyan-200 outline-none transition focus:border-violet-400/40"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveSection(
                    activeSection === "website-label"
                      ? ""
                      : "website-label",
                  )
                }
                className={`shrink-0 grid size-10 place-items-center rounded-xl border transition ${
                  activeSection === "website-label"
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-white/10 bg-black/20 text-cyan-300 hover:border-cyan-400/30 hover:bg-cyan-400/10"
                }`}
              >
                <Type className="size-4" />
              </button>
            </div>

            {activeSection === "website-label" && (
              <div className="mt-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.03] p-3">
                <div className="mb-2 text-[11px] text-muted-foreground">
                  Website label
                </div>

                <input
                  value={basics.websiteLabel || ""}
                  onChange={(e) =>
                    updateBasics(
                      "websiteLabel",
                      e.target.value,
                    )
                  }
                  placeholder="e.g. Portfolio"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-cyan-200 outline-none transition focus:border-violet-400/40"
                />
              </div>
            )}
          </div>
        )}

        {basics.location && (
          <div>
            <div className="mb-1 text-[11px] text-muted-foreground">
              Location
            </div>

            <input
              value={basics.location || ""}
              onChange={(e) =>
                updateBasics("location", e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/40"
            />
          </div>
        )}
      </div>
    </div>
  );
}