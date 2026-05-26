import type { Resume } from "@/features/resume/types/resume";

import { AuroraTemplate } from "./templates/AuroraTemplate";
import { MonoTemplate } from "./templates/MonoTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { GradientTemplate } from "./templates/GradientTemplate";

interface Props {
  resume: Resume;
}

function resolvePhotoUrl(photo?: string | null) {
  if (!photo) {
    return "";
  }

  if (photo.startsWith("http")) {
    return photo;
  }

  return `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${photo}`;
}

export function ResumePreview({
  resume,
}: Props) {
  const sidebarSectionOrder =
    resume.sidebarSectionOrder || [];

  const mainSectionOrder =
    resume.mainSectionOrder || [];

  const websiteLabel =
    resume?.basics?.websiteLabel || "Website";

  const linkedinLabel =
    resume?.basics?.linkedinLabel || "LinkedIn";

  const githubLabel =
    resume?.basics?.githubLabel || "GitHub";

  const hiddenProfiles =
    resume.hiddenProfiles || [];

  const typography =
    resume.typography || {
      fontFamily: "Inter",
      fontSize: 13,
      lineHeight: 1.7,
    };

  const photoUrl = resolvePhotoUrl(
    resume.basics?.photo,
  );

  const templateProps = {
    resume,
    sidebarSectionOrder,
    mainSectionOrder,
    websiteLabel,
    linkedinLabel,
    githubLabel,
    hiddenProfiles,
    typography,
    photoUrl,
  };

  switch (resume.template) {
    case "mono":
      return <MonoTemplate {...templateProps} />;

    case "executive":
      return <ExecutiveTemplate {...templateProps} />;

    case "gradient":
      return <GradientTemplate {...templateProps} />;

    default:
      return <AuroraTemplate {...templateProps} />;
  }
}