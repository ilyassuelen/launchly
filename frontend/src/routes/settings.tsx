import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card } from "@/components/launchly/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CreditCard,
  Globe2,
  Loader2,
  Lock,
  Shield,
  Trash2,
  User,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

async function updateProfile(
  token: string,
  data: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    ai_response_language: string;
  },
) {
  const response = await fetch(
    `${API_BASE_URL}/users/me`,
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
  head: () => ({
    meta: [
      {
        title: "Settings — Launchly",
      },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { user, loading, refreshUser, logoutUser } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [language, setLanguage] =
    useState("english");

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [savingPreferences, setSavingPreferences] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [deleteConfirmation, setDeleteConfirmation] =
    useState("");

  const [isDeletingAccount, setIsDeletingAccount] =
    useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setUsername(user.username || "");
      setLanguage(user.ai_response_language || "english");
    }
  }, [user]);

  async function handleSaveProfile() {
    try {
      setSavingProfile(true);
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
        username,
        email,
        ai_response_language: language,
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
      setSavingProfile(false);
    }
  }

  async function handleSavePreferences() {
    try {
      setSavingPreferences(true);
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
        username,
        email,
        ai_response_language: language,
      });

      await refreshUser();

      setSuccess(
        t("settings.preferencesSaved"),
      );
    } catch (err: any) {
      setError(
        err?.message ||
          t("settings.failedToSave"),
      );
    } finally {
      setSavingPreferences(false);
    }
  }

  async function handleChangePassword() {
    try {
      setError("");
      setSuccess("");

      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Please fill out all password fields.");
      }

      if (newPassword.length < 8) {
        throw new Error(
          "New password must contain at least 8 characters.",
        );
      }

      if (newPassword !== confirmPassword) {
        throw new Error(
          "New passwords do not match.",
        );
      }

      const token =
        localStorage.getItem(
          "access_token",
        );

      if (!token) {
        throw new Error(
          "Authentication expired.",
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/users/me/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            "Failed to update password.",
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess(
        "Password updated successfully.",
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to update password.",
      );
    }
  }

  async function handleDeleteAccount() {
    try {
      setIsDeletingAccount(true);
      setError("");
      setSuccess("");

      if (deleteConfirmation !== "DELETE") {
        throw new Error(
          "Please type DELETE to confirm account deletion.",
        );
      }

      const token =
        localStorage.getItem(
          "access_token",
        );

      if (!token) {
        throw new Error(
          "Authentication expired.",
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/users/me`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete account.",
        );
      }

      logoutUser();
      navigate({ to: "/" });
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to delete account.",
      );
    } finally {
      setIsDeletingAccount(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Loader2 className="size-4 animate-spin text-cyan-300" />
          {t("common.loading")}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // username state is now managed above and editable

  return (
    <AppShell
      title={t("settings.title")}
      subtitle={t("settings.subtitle")}
    >
      <div className="space-y-4">
        {(error || success) && (
          <div
            className={`flex items-start gap-3 rounded-3xl border px-5 py-4 text-sm ${
              error
                ? "border-red-400/20 bg-red-400/10 text-red-100"
                : "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
            }`}
          >
            {error ? (
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            ) : (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            )}

            <div>
              {error || success}
            </div>
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-4">
            <Card className="relative overflow-hidden p-6">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />

              <SectionHeader
                icon={User}
                title="Profile"
                description="Update the core identity details used across Launchly."
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2">
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
                  label="Username"
                  value={username}
                  onChange={setUsername}
                />

                <Field
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  type="email"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save profile"
                  )}
                </button>

                <p className="text-xs text-muted-foreground">
                  Your email is used for login and account recovery.
                </p>
              </div>
            </Card>

            <Card className="relative overflow-hidden p-6">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-400/[0.08] blur-3xl" />

              <SectionHeader
                icon={Lock}
                title="Security"
                description="Update your account password securely."
              />

              <div className="relative mt-6 grid gap-4 md:grid-cols-3">
                <Field
                  label="Current password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  type="password"
                />

                <Field
                  label="New password"
                  value={newPassword}
                  onChange={setNewPassword}
                  type="password"
                />

                <Field
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  type="password"
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm text-white/55">
                  Use a secure password with at least 8 characters.
                </div>

                <button
                  onClick={handleChangePassword}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Update password
                </button>
              </div>
            </Card>

            <Card className="relative overflow-hidden p-6">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent" />

              <SectionHeader
                icon={Globe2}
                title={t("settings.preferencesTitle")}
                description={t("settings.preferencesDescription")}
              />

              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <SelectField
                  label={t("settings.globalLanguage")}
                  value={language}
                  onChange={setLanguage}
                  options={[
                    {
                      label: t("settings.english"),
                      value: "english",
                    },
                    {
                      label: t("settings.german"),
                      value: "german",
                    },
                  ]}
                />

                <button
                  onClick={handleSavePreferences}
                  disabled={savingPreferences}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingPreferences ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t("common.saving")}
                    </>
                  ) : (
                    t("settings.savePreferences")
                  )}
                </button>
              </div>

            </Card>
          </div>

          <div className="space-y-4">
            <Card className="relative overflow-hidden p-6">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/[0.08] blur-3xl" />

              <SectionHeader
                icon={CreditCard}
                title="Plan"
                description="Current workspace plan."
              />

              <div className="relative mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-2xl font-semibold text-white">
                      Launch
                    </div>

                    <div className="mt-1 text-sm text-muted-foreground">
                      Early access plan
                    </div>
                  </div>

                  <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                    Active
                  </div>
                </div>

                <button className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-brand px-3 py-2 text-sm font-semibold text-primary-foreground glow">
                  Upgrade options coming soon
                </button>
              </div>
            </Card>

            <Card className="p-6">
              <SectionHeader
                icon={Bell}
                title="Notifications"
                description="Notification controls are prepared for a future release."
              />

              <div className="mt-5 space-y-3">
                {[
                  "Recruiter signal alerts",
                  "Weekly career digest",
                  "Interview reminders",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm"
                  >
                    <span className="text-white/75">
                      {item}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/40">
                      Soon
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <SectionHeader
                icon={Shield}
                title="Privacy"
                description="Your data remains connected to your authenticated account."
              />

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/50">
                Prepared for a future release.
              </div>
            </Card>

            <Card className="border-red-400/15 bg-red-400/[0.045] p-6">
              <SectionHeader
                icon={Trash2}
                title="Danger zone"
                description="Permanently delete your account and all connected Launchly data."
              />

              <div className="mt-5 rounded-2xl border border-red-400/15 bg-red-400/[0.06] p-4">
                <p className="text-sm leading-6 text-red-100/70">
                  This action cannot be undone. Type{" "}
                  <span className="font-mono font-semibold text-red-100">
                    DELETE
                  </span>{" "}
                  to confirm.
                </p>

                <div className="mt-4">
                  <Field
                    label="Confirmation"
                    value={deleteConfirmation}
                    onChange={setDeleteConfirmation}
                  />
                </div>

                <button
                  onClick={handleDeleteAccount}
                  disabled={
                    isDeletingAccount ||
                    deleteConfirmation !== "DELETE"
                  }
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-400/15 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeletingAccount ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Deleting account...
                    </>
                  ) : (
                    "Delete account permanently"
                  )}
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-200">
        <Icon className="size-4" />
      </div>

      <div>
        <h2 className="text-base font-semibold text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  helper,
}: {
  label: string;
  value: string;
  onChange?: (
    value: string,
  ) => void;
  type?: string;
  disabled?: boolean;
  helper?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">
        {label}
      </div>

      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
        className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/30 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-55"
      />

      {helper && (
        <p className="mt-1.5 text-xs leading-5 text-white/35">
          {helper}
        </p>
      )}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  options: {
    label: string;
    value: string;
  }[];
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">
        {label}
      </div>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-cyan-300/30 focus:bg-white/[0.06]"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#0b1020] text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}