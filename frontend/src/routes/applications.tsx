import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, Card, StatCard } from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Plus, Bell, CheckCircle2, Clock, XCircle, Send } from "lucide-react";

export const Route = createFileRoute("/applications")({
  head: () => ({ meta: [{ title: "Applications — Launchly" }, { name: "description", content: "Track applications, stages, recruiter responses and follow-ups." }] }),
  component: Applications,
});

const cols = [
  { t: "Applied", icon: Send, items: [
    { c: "Vercel", r: "DX Engineer", d: "2d ago" },
    { c: "Notion", r: "Product Eng", d: "4d ago" },
    { c: "Replit", r: "Frontend Eng", d: "1w ago" },
  ]},
  { t: "Phone screen", icon: Clock, items: [
    { c: "Linear", r: "Junior Eng", d: "Fri 10a" },
    { c: "Shopify", r: "SDE I", d: "Wed 2p" },
  ]},
  { t: "Onsite", icon: Briefcase, items: [
    { c: "Stripe", r: "Frontend Intern", d: "Tomorrow 9a" },
  ]},
  { t: "Offer", icon: CheckCircle2, items: [
    { c: "Cal.com", r: "Engineer Intern", d: "Pending decision" },
  ]},
  { t: "Closed", icon: XCircle, items: [
    { c: "Figma", r: "Product Eng Intern", d: "Rejected · 2w" },
  ]},
];

function Applications() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          Loading applications...
        </div>
      </div>
    );
  }

  useEffect(() => {
      if (!loading && !user) {
          navigate({ to: "/login" });
      }
  }, [user, loading, navigate]);

  if (loading || !user) {
      return null;
  }

  return (
    <AppShell title="Applications" subtitle="A calm, modern board for the chaos of job hunting."
      action={<button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow"><Plus className="size-4"/> Add application</button>}>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Active" value="9" delta="+3 this wk" icon={Briefcase} tone="violet" />
        <StatCard label="Response rate" value="38%" delta="vs 22% avg" icon={Send} tone="cyan" />
        <StatCard label="Offers" value="1" delta="🎉" icon={CheckCircle2} tone="green" />
        <StatCard label="Follow-ups due" value="4" icon={Bell} tone="pink" />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        {cols.map(col => (
          <div key={col.t} className="rounded-2xl glass p-3 shadow-card">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold"><col.icon className="size-4"/>{col.t}</div>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">{col.items.length}</span>
            </div>
            <div className="space-y-2">
              {col.items.map(it => (
                <div key={it.c} className="rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10 transition hover:bg-white/[0.08]">
                  <div className="text-sm font-semibold">{it.c}</div>
                  <div className="text-xs text-muted-foreground">{it.r}</div>
                  <div className="mt-2 text-[11px] text-muted-foreground">{it.d}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Card>
          <div className="mb-3 text-sm font-semibold">Pipeline analytics</div>
          <div className="grid gap-3 md:grid-cols-5 text-center text-xs">
            {[["Applied","12"],["Screen","5"],["Onsite","2"],["Offer","1"],["Hire rate","8%"]].map(([k,v]) => (
              <div key={k as string} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-muted-foreground">{k as string}</div>
                <div className="mt-1 text-2xl font-semibold">{v as string}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
