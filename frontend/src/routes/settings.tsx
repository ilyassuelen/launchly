import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card } from "@/components/launchly/AppShell";
import { User, CreditCard, Bell, Shield, Sparkles } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Launchly" }] }),
  component: Settings,
});

function Settings() {
  return (
    <AppShell title="Settings" subtitle="Account, plan and preferences.">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><User className="size-4"/> Profile</div>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <Field label="Full name" value="Maya Reyes"/>
            <Field label="Email" value="maya.reyes@launchly.app"/>
            <Field label="Target role" value="Frontend Engineer"/>
            <Field label="Location" value="Brooklyn, NY"/>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 p-3 ring-1 ring-white/10 text-sm">
            <Sparkles className="size-4 text-[oklch(0.85_0.14_250)]"/> AI persona: <strong>Confident & specific</strong> — adjust tone in Coach.
          </div>
          <button className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow">Save changes</button>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><CreditCard className="size-4"/> Plan</div>
            <div className="text-2xl font-semibold">Launch <span className="text-sm text-muted-foreground">$19/mo</span></div>
            <div className="mt-1 text-xs text-muted-foreground">12 days left in trial</div>
            <button className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gradient-brand px-3 py-2 text-sm font-semibold text-primary-foreground glow">Upgrade to Pro</button>
          </Card>
          <Card>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Bell className="size-4"/> Notifications</div>
            {["Recruiter signal alerts","Weekly career digest","Interview reminders"].map(n => (
              <label key={n} className="flex items-center justify-between py-2 text-sm">
                <span>{n}</span>
                <span className="relative inline-block h-5 w-9 rounded-full bg-gradient-brand"><span className="absolute right-0.5 top-0.5 size-4 rounded-full bg-white"/></span>
              </label>
            ))}
          </Card>
          <Card>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Shield className="size-4"/> Privacy</div>
            <p className="text-sm text-muted-foreground">Your data is yours. Export or delete any time.</p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-muted-foreground">{label}</div>
      <input defaultValue={value} className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-[oklch(0.72_0.20_295)]/60"/>
    </label>
  );
}
