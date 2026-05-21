import {
  Sparkles,
  TrendingUp,
  BadgeCheck,
  TriangleAlert,
  Brain,
} from "lucide-react";

import { Card } from "@/components/launchly/AppShell";

export function CoverLetterInsightsPanel() {
  return (
    <div className="mx-auto w-full max-w-[1700px]">

      <div className="flex flex-col gap-4">

        {/* SMART SUGGESTIONS */}
        <Card className="overflow-hidden">

          <div className="flex items-center gap-2 border-b border-white/5 pb-4">

            <Sparkles className="size-5 text-cyan-300" />

            <div>

              <div className="text-sm font-semibold">
                Smart suggestions
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                AI-powered recommendations to improve recruiter response
              </div>

            </div>

          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-3">

            <div className="rounded-3xl border border-orange-400/10 bg-orange-400/[0.06] p-6">

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-orange-400/10 p-3">

                  <TriangleAlert className="size-5 text-orange-300" />

                </div>

                <div className="text-mt font-semibold text-white leading-none">
                  More role specificity
                </div>

              </div>

              <div className="mt-6 text-sm leading-relaxed text-white/60">
                Mentioning concrete technologies and business impact can increase recruiter engagement.
              </div>

            </div>

            <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.05] p-6">

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-cyan-400/10 p-3">

                  <TrendingUp className="size-5 text-cyan-300" />

                </div>

                <div className="text-mt font-semibold text-white leading-none">
                  Strong alignment
                </div>

              </div>

              <div className="mt-6 text-sm leading-relaxed text-white/60">
                The tone and structure already feel modern and recruiter-friendly.
              </div>

            </div>

            <div className="rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.05] p-6">

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-emerald-400/10 p-3">

                  <BadgeCheck className="size-5 text-emerald-300" />

                </div>

                <div className="text-mt font-semibold text-white leading-none">
                  Human writing style
                </div>

              </div>

              <div className="mt-6 text-sm leading-relaxed text-white/60">
                The wording feels natural and avoids overly robotic AI phrasing.
              </div>

            </div>

          </div>

        </Card>

        {/* RECRUITER ANALYSIS */}
        <Card className="relative overflow-hidden">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_70%)]" />

          <div className="relative">

            <div className="flex items-center gap-2 border-b border-white/5 pb-4">

              <Brain className="size-5 text-violet-300" />

              <div>

                <div className="text-sm font-semibold">
                  Recruiter analysis
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  Simulated recruiter review
                </div>

              </div>

            </div>

            <div className="mt-5 space-y-4">

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

                <div className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                  Strongest Area
                </div>

                <div className="mt-2 text-sm text-white/80">
                  Professional structure and readable formatting
                </div>

              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

                <div className="text-xs uppercase tracking-[0.18em] text-orange-300">
                  Improvement Opportunity
                </div>

                <div className="mt-2 text-sm text-white/80">
                  Add more measurable achievements and company-specific context.
                </div>

              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

                <div className="text-xs uppercase tracking-[0.18em] text-emerald-300">
                  Recruiter Impression
                </div>

                <div className="mt-2 text-sm text-white/80">
                  Premium, modern and significantly above average compared to generic applications.
                </div>

              </div>

            </div>

          </div>

        </Card>

      </div>

    </div>
  );
}