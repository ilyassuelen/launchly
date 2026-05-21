import type { CoverLetter } from "@/features/cover-letter/types/coverLetter";

import { ClassicCoverLetter } from "./templates/ClassicCoverLetter";
import { ModernCoverLetter } from "./templates/ModernCoverLetter";
import { MinimalCoverLetter } from "./templates/MinimalCoverLetter";
import { StartupCoverLetter } from "./templates/StartupCoverLetter";

interface Props {
  coverLetter: CoverLetter;
}

export function CoverLetterRenderer({
  coverLetter,
}: Props) {
  switch (coverLetter.template) {
    case "modern":
      return (
        <ModernCoverLetter
          coverLetter={coverLetter}
        />
      );

    case "minimal":
      return (
        <MinimalCoverLetter
          coverLetter={coverLetter}
        />
      );

    case "startup":
      return (
        <StartupCoverLetter
          coverLetter={coverLetter}
        />
      );

    default:
      return (
        <ClassicCoverLetter
          coverLetter={coverLetter}
        />
      );
  }
}
