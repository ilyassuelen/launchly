import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";

import logo from "../../static/logo.png";

import {
  login,
  register,
} from "@/services/auth";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const {
    user,
    loading: authLoading,
    refreshUser,
  } = useAuth();

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, authLoading, navigate]);

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await register({
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
      });

      await login({
        username,
        password,
      });

      await refreshUser();

    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <Loader2 className="size-8 animate-spin text-cyan-300" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.145_0.02_270)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.18),transparent_30%)]" />

      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:80px_80px]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="px-4 pt-5">
          <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/6 bg-[rgba(7,10,18,0.72)] px-6 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <img
                src={logo}
                alt="Launchly logo"
                className="h-9 w-auto object-contain"
              />
            </Link>

            <Link
              to="/login"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Already have an account?
            </Link>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-6">
          <div className="w-full max-w-md">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-400/5" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
                  <Sparkles className="size-3.5 text-cyan-300" />
                  Start your career growth
                  journey
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-tight">
                  Create your account
                </h1>

                <p className="mt-3 text-sm leading-6 text-white/55">
                  Build stronger resumes,
                  optimize your positioning
                  and improve your chances of
                  landing interviews.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm text-white/60">
                        First name
                      </label>

                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) =>
                          setFirstName(
                            e.target.value,
                          )
                        }
                        placeholder="John"
                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-violet-400/40 focus:bg-white/[0.05]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/60">
                        Last name
                      </label>

                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) =>
                          setLastName(
                            e.target.value,
                          )
                        }
                        placeholder="Doe"
                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-violet-400/40 focus:bg-white/[0.05]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/60">
                      Username
                    </label>

                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value,
                        )
                      }
                      placeholder="johndoe"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-violet-400/40 focus:bg-white/[0.05]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/60">
                      Email
                    </label>

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value,
                        )
                      }
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-violet-400/40 focus:bg-white/[0.05]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/60">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) =>
                          setPassword(
                            e.target.value,
                          )
                        }
                        placeholder="Create a password"
                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 pr-12 text-sm text-white outline-none transition focus:border-violet-400/40 focus:bg-white/[0.05]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword,
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 text-sm font-semibold text-white shadow-2xl shadow-violet-500/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-white/45">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
