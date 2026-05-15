import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card } from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  Sparkles,
  Loader2,
} from "lucide-react";

async function updateProfile(
  token: string,
  data: {
    first_name: string;
    last_name: string;
    email: string;
  },
) {
  const response = await fetch(
    "http://127.0.0.1:8000/users/me",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.detail ||
        "Failed to update profile.",
    );
  }

  return result;
}

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Launchly" }] }),
  component: Settings,
});

function Settings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { refreshUser } = useAuth();

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] = useState("");

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem(
          "access_token",
        );

      if (!token) {
        throw new Error(
          "Authentication expired.",
        );
      }

      await updateProfile(token, {
        first_name: firstName,
        last_name: lastName,
        email,
      });

      await refreshUser();

      setSuccess(
        "Profile updated successfully.",
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to save changes.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          Loading settings...
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
    <AppShell title="Settings" subtitle="Account, plan and preferences.">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><User className="size-4"/> Profile</div>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <Field
              label="First name"
              value={firstName}
              onChange={setFirstName}
            />

            <Field
              label="Last name"
              value={lastName}
              onChange={setLastName}
            />

            <Field
              label="Email"
              value={email}
              onChange={setEmail}
            />
            <Field label="Target role" value="placeholder"/>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 p-3 ring-1 ring-white/10 text-sm">
            <Sparkles className="size-4 text-[oklch(0.85_0.14_250)]"/> AI persona: <strong>Confident & specific</strong> — adjust tone in Coach.
          </div>
          {error && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
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

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-muted-foreground">
        {label}
      </div>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-[oklch(0.72_0.20_295)]/60"
      />
    </label>
  );
}
