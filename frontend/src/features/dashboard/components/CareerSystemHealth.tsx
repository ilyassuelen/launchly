import {
  Activity,
  Briefcase,
  Eye,
  FileText,
  Github,
  Linkedin,
} from "lucide-react";

import {
  Card,
  Progress,
} from "@/components/launchly/AppShell";

type CareerSystemHealthProps = {
  profileStrength: Record<string, number>;
  interviewReadiness: number;
};

function getScore(
  profileStrength: Record<string, number>,
  key: string,
) {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(profileStrength?.[key] || 0),
    ),
  );
}

export function CareerSystemHealth({
  profileStrength,
  interviewReadiness,
}: CareerSystemHealthProps) {
  const resumeScore = getScore(profileStrength, "Resume");
  const recruiterScore = getScore(profileStrength, "Recruiter View");
  const linkedInScore = getScore(profileStrength, "LinkedIn");
  const portfolioScore = getScore(profileStrength, "Portfolio");
  const applicationsScore = getScore(profileStrength, "Applications");

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.08),transparent_38%)]" />

      <div className="relative mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Activity className="size-4 text-violet-300" />
          Career system health
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          Your core career assets based on saved analyses.
        </div>
      </div>

      <div className="relative space-y-3">
        <Progress
          label="Resume"
          value={resumeScore}
          color={resumeScore >= 75 ? "green" : undefined}
        />

        <Progress
          label="Recruiter View"
          value={recruiterScore}
        />

        <Progress
          label="LinkedIn"
          value={linkedInScore}
        />

        <Progress
          label="Portfolio"
          value={portfolioScore}
          color={portfolioScore < 70 ? "pink" : undefined}
        />

        <Progress
          label="Applications"
          value={applicationsScore}
        />

        <Progress
          label="Interviewing"
          value={interviewReadiness}
        />
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2 text-center">
        {[
          {
            label: "Resume",
            value: resumeScore,
            icon: FileText,
          },
          {
            label: "Recruiter",
            value: recruiterScore,
            icon: Eye,
          },
          {
            label: "LinkedIn",
            value: linkedInScore,
            icon: Linkedin,
          },
          {
            label: "Portfolio",
            value: portfolioScore,
            icon: Github,
          },
          {
            label: "Apps",
            value: applicationsScore,
            icon: Briefcase,
          },
          {
            label: "Practice",
            value: interviewReadiness,
            icon: Activity,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/5 bg-white/[0.03] p-3"
          >
            <item.icon className="mx-auto size-3.5 text-cyan-200" />

            <div className="mt-2 text-sm font-semibold text-white/85">
              {item.value}%
            </div>

            <div className="mt-1 text-[10px] text-muted-foreground">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
