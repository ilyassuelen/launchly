import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  AppShell,
  Card,
} from "@/components/launchly/AppShell";

import { useAuth } from "@/context/AuthContext";

import {
  Bell,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock,
  KanbanSquare,
  Loader2,
  Pencil,
  Plus,
  Send,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  useApplications,
} from "@/features/applications/hooks/useApplications";

import {
  ApplicationModal,
} from "@/features/applications/modals/ApplicationModal";

import type {
  ApplicationCreatePayload,
  ApplicationItem,
  ApplicationStatus,
  ApplicationUpdatePayload,
} from "@/features/applications/types/application";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      {
        title: "Applications — Launchly",
      },
      {
        name: "description",
        content:
          "Track applications, stages, recruiter responses and follow-ups.",
      },
    ],
  }),
  component: Applications,
});

const columns: Array<{
  title: string;
  status: ApplicationStatus;
  icon: typeof Send;
  helper: string;
}> = [
  {
    title: "Applied",
    status: "applied",
    icon: Send,
    helper: "Recently sent applications",
  },
  {
    title: "Phone screen",
    status: "phone_screen",
    icon: Clock,
    helper: "First recruiter or team calls",
  },
  {
    title: "Onsite",
    status: "onsite",
    icon: Briefcase,
    helper: "Technical interviews or final rounds",
  },
  {
    title: "Offer",
    status: "offer",
    icon: CheckCircle2,
    helper: "Offers and decisions",
  },
  {
    title: "Rejected",
    status: "rejected",
    icon: XCircle,
    helper: "Closed opportunities",
  },
];

const statusAccentClassNames: Record<ApplicationStatus, string> = {
  applied: "from-cyan-300/80 to-cyan-500/40",
  phone_screen: "from-yellow-300/80 to-orange-400/40",
  onsite: "from-violet-300/80 to-violet-500/40",
  offer: "from-emerald-300/80 to-emerald-500/40",
  rejected: "from-red-300/80 to-red-500/40",
};

const statusChipClassNames: Record<ApplicationStatus, string> = {
  applied: "border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-100",
  phone_screen: "border-yellow-400/15 bg-yellow-400/[0.08] text-yellow-100",
  onsite: "border-violet-400/15 bg-violet-400/[0.08] text-violet-100",
  offer: "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-100",
  rejected: "border-red-400/15 bg-red-400/[0.08] text-red-100",
};

const columnDropClassNames: Record<ApplicationStatus, string> = {
  applied: "border-cyan-400/30 bg-cyan-400/[0.04]",
  phone_screen: "border-yellow-400/30 bg-yellow-400/[0.04]",
  onsite: "border-violet-400/30 bg-violet-400/[0.04]",
  offer: "border-emerald-400/30 bg-emerald-400/[0.04]",
  rejected: "border-red-400/30 bg-red-400/[0.04]",
};

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function getFollowUpState(application: ApplicationItem) {
  if (application.status !== "applied") return null;

  const baseDate = application.follow_up_date || application.applied_date;
  if (!baseDate) return null;

  const dueDate = new Date(baseDate);

  if (!application.follow_up_date) {
    dueDate.setDate(dueDate.getDate() + 7);
  }

  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff < 0) return { label: "Follow-up overdue", tone: "overdue" as const };
  if (diff <= 1) return { label: "Follow-up due soon", tone: "soon" as const };

  return null;
}

function getStatusDate(
  application: ApplicationItem,
) {
  if (application.status === "phone_screen") {
    return application.phone_screen_date;
  }

  if (application.status === "onsite") {
    return application.onsite_date;
  }

  if (application.status === "offer") {
    return application.offer_date;
  }

  if (application.status === "rejected") {
    return application.rejected_date;
  }

  return application.applied_date;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "No date set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getSortableDateValue(value?: string | null) {
  if (!value) {
    return 0;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  return date.getTime();
}

function sortApplicationsForStatus(
  items: ApplicationItem[],
  status: ApplicationStatus,
) {
  return [...items].sort((a, b) => {
    if (status === "phone_screen") {
      return (
        getSortableDateValue(a.phone_screen_date) -
        getSortableDateValue(b.phone_screen_date)
      );
    }

    if (status === "onsite") {
      return (
        getSortableDateValue(a.onsite_date) -
        getSortableDateValue(b.onsite_date)
      );
    }

    if (status === "offer") {
      return (
        getSortableDateValue(b.offer_date) -
        getSortableDateValue(a.offer_date)
      );
    }

    if (status === "rejected") {
      return (
        getSortableDateValue(b.rejected_date) -
        getSortableDateValue(a.rejected_date)
      );
    }

    return (
      getSortableDateValue(b.applied_date) -
      getSortableDateValue(a.applied_date)
    );
  });
}

function getEmptyColumnMessage(status: ApplicationStatus) {
  if (status === "phone_screen") {
    return {
      title: "No interviews yet.",
      description: "Responses will appear here once your pipeline warms up.",
    };
  }

  if (status === "onsite") {
    return {
      title: "No onsite rounds yet.",
      description: "Strong matches will move here as conversations progress.",
    };
  }

  if (status === "offer") {
    return {
      title: "No offers yet.",
      description: "Your pipeline is still building momentum.",
    };
  }

  if (status === "rejected") {
    return {
      title: "No rejections yet.",
      description: "Closed applications will appear here when needed.",
    };
  }

  return {
    title: "No applications yet.",
    description: "Add your first application to start tracking your search.",
  };
}

function getStatusLabel(status: ApplicationStatus) {
  return columns.find((column) => column.status === status)?.title || status;
}

function getPipelineProgress(status: ApplicationStatus) {
  if (status === "applied") return 20;
  if (status === "phone_screen") return 45;
  if (status === "onsite") return 70;
  if (status === "offer") return 100;
  return 100;
}

function buildStatusUpdatePayload(
  application: ApplicationItem,
  status: ApplicationStatus,
): ApplicationUpdatePayload {
  const today = getTodayDateString();

  return {
    company_name: application.company_name,
    job_title: application.job_title,
    status,
    applied_date: application.applied_date,
    phone_screen_date:
      status === "phone_screen"
        ? application.phone_screen_date || today
        : application.phone_screen_date || null,
    onsite_date:
      status === "onsite"
        ? application.onsite_date || today
        : application.onsite_date || null,
    offer_date:
      status === "offer"
        ? application.offer_date || today
        : application.offer_date || null,
    rejected_date:
      status === "rejected"
        ? application.rejected_date || today
        : application.rejected_date || null,
    follow_up_date: application.follow_up_date || null,
    notes: application.notes || "",
  };
}

function Applications() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const {
    applications,
    stats: applicationStats,
    isLoadingApplications,
    isSavingApplication,
    error,
    loadApplications,
    createApplication,
    updateApplication,
    deleteApplication,
  } = useApplications();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<ApplicationItem | null>(null);
  const [draggedApplicationId, setDraggedApplicationId] =
    useState<number | null>(null);

  const [activeDropStatus, setActiveDropStatus] =
    useState<ApplicationStatus | null>(null);

  const [draft, setDraft] = useState(emptyDraft);
  const [showRejected, setShowRejected] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user) {
      loadApplications();
    }
  }, [user, loading]);

  const groupedApplications = useMemo(() => {
    return columns.reduce<Record<ApplicationStatus, ApplicationItem[]>>(
      (acc, column) => {
        const filteredApplications = applications.filter(
          (application) => application.status === column.status,
        );

        acc[column.status] = sortApplicationsForStatus(
          filteredApplications,
          column.status,
        );

        return acc;
      },
      {
        applied: [],
        phone_screen: [],
        onsite: [],
        offer: [],
        rejected: [],
      },
    );
  }, [applications]);

  const visibleColumns = showRejected
    ? columns
    : columns.filter(
        (column) => column.status !== "rejected",
      );

  const focusApplications = useMemo(() => {
    return applications
      .filter((application) => getFollowUpState(application))
      .slice(0, 3);
  }, [applications]);

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort(
        (a, b) =>
          getSortableDateValue(getStatusDate(b)) -
          getSortableDateValue(getStatusDate(a)),
      )
      .slice(0, 4);
  }, [applications]);

  const totalApplications = applications.length;
  const interviewCount =
    groupedApplications.phone_screen.length + groupedApplications.onsite.length;

  const handleOpenCreateModal = () => {
    setEditingApplication(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  };

  const handleOpenEditModal = (
    application: ApplicationItem,
  ) => {
    setEditingApplication(application);

    setDraft({
      company_name: application.company_name || "",
      job_title: application.job_title || "",
      applied_date: application.applied_date || "",
      notes: application.notes || "",
    });

    setModalOpen(true);
  };

  const handleDraftChange = (
    field: keyof typeof emptyDraft,
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveApplication = async () => {
    const payload: ApplicationCreatePayload = {
      company_name: draft.company_name,
      job_title: draft.job_title,
      status: editingApplication ? editingApplication.status : "applied",
      applied_date: draft.applied_date,
      phone_screen_date: editingApplication?.phone_screen_date || null,
      onsite_date: editingApplication?.onsite_date || null,
      offer_date: editingApplication?.offer_date || null,
      rejected_date: editingApplication?.rejected_date || null,
      follow_up_date: editingApplication?.follow_up_date || null,
      notes: draft.notes,
    };

    if (editingApplication) {
      await updateApplication(editingApplication.id, payload);
    } else {
      await createApplication(payload);
    }
    setModalOpen(false);
    setEditingApplication(null);
    setDraft(emptyDraft);
  };

  const handleMoveApplication = async (
    application: ApplicationItem,
    status: ApplicationStatus,
  ) => {
    if (application.status === status) return;

    await updateApplication(
      application.id,
      buildStatusUpdatePayload(application, status),
    );
  };

  const handleDropApplication = async (status: ApplicationStatus) => {
    if (!draggedApplicationId) {
      setActiveDropStatus(null);
      return;
    }

    const application = applications.find(
      (item) => item.id === draggedApplicationId,
    );

    setDraggedApplicationId(null);
    setActiveDropStatus(null);

    if (!application || application.status === status) return;

    await handleMoveApplication(application, status);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.145_0.02_270)] text-white">
        <div className="text-sm text-white/60">
          Loading applications...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell
      title="Applications"
      subtitle="Track every application, stage, response and follow-up in one calm pipeline."
      action={
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow transition hover:scale-[1.02]"
        >
          <Plus className="size-4" />
          Add application
        </button>
      }
    >
      <div className="space-y-5">
        <Card className="relative overflow-hidden border-cyan-300/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(8,13,24,0.98)_52%,rgba(18,24,46,0.88))] p-0 shadow-[0_24px_80px_rgba(6,182,212,0.06)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_86%_8%,rgba(168,85,247,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_40%)]" />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/65 to-transparent" />

          <div className="relative p-6 lg:p-8">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-400/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/70">
                <KanbanSquare className="size-3.5 text-cyan-300" />
                Application Pipeline
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                Manage every application from first send to final decision.
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58 lg:text-[15px]">
                Keep your job search organized with a focused board for applications, recruiter responses, interviews, offers and follow-ups.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/7 bg-black/20 px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                    Active
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    {applicationStats.active}
                  </div>
                  <div className="mt-1 text-xs text-emerald-100/55">
                    {totalApplications} total
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-300/10 bg-cyan-400/[0.045] px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100/45">
                    Interviews
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-cyan-50">
                    {interviewCount}
                  </div>
                  <div className="mt-1 text-xs text-cyan-100/50">
                    phone + onsite
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-300/10 bg-emerald-400/[0.045] px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-100/45">
                    Offers
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-emerald-50">
                    {applicationStats.offers}
                  </div>
                  <div className="mt-1 text-xs text-emerald-100/50">
                    keep going
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-300/10 bg-orange-400/[0.045] px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-100/45">
                    Follow-ups
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-orange-50">
                    {applicationStats.follow_ups_due}
                  </div>
                  <div className="mt-1 text-xs text-orange-100/50">
                    need attention
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Card>

        {error && (
          <div className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.06] p-4 text-sm text-orange-200">
            {error}
          </div>
        )}

        <Card className="relative overflow-hidden border-white/7 bg-[linear-gradient(145deg,rgba(15,23,42,0.94),rgba(8,13,24,0.98)_50%,rgba(20,18,48,0.70))] p-0 shadow-[0_24px_80px_rgba(6,182,212,0.05)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_38%)]" />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent" />

          <div className="relative p-5 lg:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-400/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/70">
                  <KanbanSquare className="size-3.5 text-cyan-300" />
                  Pipeline Board
                </div>

                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                  Move opportunities through your hiring pipeline
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/52">
                  Drag cards between stages on desktop. On smaller screens, use the status menu inside each card.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowRejected((current) => !current)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/[0.08]"
                >
                  {showRejected
                    ? `Hide rejected (${groupedApplications.rejected.length})`
                    : `Show rejected (${groupedApplications.rejected.length})`}
                </button>

                <button
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01]"
                >
                  <Plus className="size-4" />
                  Add application
                </button>
              </div>
            </div>

            {isLoadingApplications ? (
              <div className="flex min-h-[260px] items-center gap-3 rounded-[2rem] border border-white/7 bg-black/20 p-6 text-sm text-white/60">
                <Loader2 className="size-4 animate-spin text-cyan-300" />
                Loading your application board...
              </div>
            ) : (
              <div
                className={`grid gap-4 md:grid-cols-2 ${
                  showRejected
                    ? "xl:grid-cols-5"
                    : "xl:grid-cols-4"
                }`}
              >
                {visibleColumns.map((column) => {
                  const Icon = column.icon;
                  const items = groupedApplications[column.status];

                  return (
                    <div
                      key={column.status}
                      onDragEnter={() => setActiveDropStatus(column.status)}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setActiveDropStatus(column.status);
                      }}
                      onDragLeave={() => setActiveDropStatus(null)}
                      onDrop={() => handleDropApplication(column.status)}
                      className={`rounded-[1.75rem] border border-white/10 bg-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:bg-white/[0.035] ${
                        activeDropStatus === column.status
                          ? columnDropClassNames[column.status]
                          : ""
                      }`}
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-base font-semibold text-white">
                            <Icon className="size-4 text-cyan-300" />
                            {column.title}
                          </div>

                          <div className="mt-1 text-xs leading-5 text-white/45">
                            {column.helper}
                          </div>
                        </div>

                        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/45">
                          {items.length}
                        </span>
                      </div>

                      <div className="h-[68vh] min-h-[520px] space-y-3 overflow-y-auto pr-1">
                        {items.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-4 text-xs leading-6 text-white/40">
                            <div className="font-semibold text-white/60">
                              {getEmptyColumnMessage(column.status).title}
                            </div>

                            <div className="mt-1">
                              {getEmptyColumnMessage(column.status).description}
                            </div>
                          </div>
                        ) : (
                          items.map((application) => (
                            <ApplicationBoardCard
                              key={application.id}
                              application={application}
                              onDragStart={() =>
                                setDraggedApplicationId(application.id)
                              }
                              onDragEnd={() =>
                                setDraggedApplicationId(null)
                              }
                              onEdit={() => handleOpenEditModal(application)}
                              onDelete={() => deleteApplication(application.id)}
                              onMove={(status) =>
                                handleMoveApplication(application, status)
                              }
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card className="relative overflow-hidden border-orange-300/10 bg-orange-400/[0.035]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.10),transparent_42%)]" />

            <div className="relative">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Bell className="size-4 text-orange-300" />
                    Follow-up center
                  </div>
                  <div className="mt-1 text-xs leading-5 text-white/45">
                    Applications that need your attention.
                  </div>
                </div>

                <div className="rounded-full border border-orange-300/10 bg-orange-400/[0.08] px-2.5 py-1 text-[11px] text-orange-100/75">
                  {applicationStats.follow_ups_due} due
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-3">
                {focusApplications.length ? (
                  focusApplications.map((application) => (
                    <button
                      key={application.id}
                      type="button"
                      onClick={() => handleOpenEditModal(application)}
                      className="rounded-2xl border border-white/7 bg-black/20 p-3 text-left transition hover:bg-white/[0.04]"
                    >
                      <div className="truncate text-sm font-semibold text-white/85">
                        {application.company_name}
                      </div>
                      <div className="mt-1 truncate text-xs text-white/45">
                        {application.job_title}
                      </div>
                      <div className="mt-2 inline-flex rounded-full border border-orange-300/15 bg-orange-400/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-orange-100/75">
                        {getFollowUpState(application)?.label}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/7 bg-black/20 p-4 text-sm leading-6 text-white/45 md:col-span-3">
                    No urgent follow-ups right now. Keep your pipeline moving.
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-cyan-300/10 bg-white/[0.025]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_38%)]" />

            <div className="relative">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="size-4 text-cyan-300" />
                Recent pipeline activity
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {recentApplications.length ? (
                  recentApplications.map((application) => (
                    <div
                      key={application.id}
                      className="rounded-2xl border border-white/7 bg-white/[0.03] p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-white/85">
                            {application.company_name}
                          </div>
                          <div className="mt-1 truncate text-xs text-white/45">
                            {application.job_title}
                          </div>
                        </div>

                        <div className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusChipClassNames[application.status]}`}>
                          {getStatusLabel(application.status)}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/42">
                        <CalendarDays className="size-3.5" />
                        {formatDate(getStatusDate(application))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/7 bg-black/20 p-4 text-sm text-white/45 md:col-span-2">
                    Recent application activity will appear here.
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ApplicationModal
        open={modalOpen}
        mode={editingApplication ? "edit" : "create"}
        draft={draft}
        application={editingApplication}
        isSaving={isSavingApplication}
        onChange={handleDraftChange}
        onClose={() => {
          setModalOpen(false);
          setEditingApplication(null);
          setDraft(emptyDraft);
        }}
        onSave={handleSaveApplication}
        onDelete={
          editingApplication
            ? async () => {
                await deleteApplication(editingApplication.id);
                setModalOpen(false);
                setEditingApplication(null);
                setDraft(emptyDraft);
              }
            : undefined
        }
      />
    </AppShell>
  );
}

type ApplicationBoardCardProps = {
  application: ApplicationItem;
  onDragStart: () => void;
  onDragEnd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (status: ApplicationStatus) => void;
};

function ApplicationBoardCard({
  application,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
  onMove,
}: ApplicationBoardCardProps) {
  const followUpState = getFollowUpState(application);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="group relative cursor-grab overflow-hidden rounded-2xl bg-white/[0.045] p-4 ring-1 ring-white/10 transition duration-200 hover:-translate-y-[1px] hover:bg-white/[0.08] hover:ring-white/20 hover:shadow-[0_14px_40px_rgba(34,211,238,0.08)] active:cursor-grabbing active:scale-[0.99]"
    >
      <div
        className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${statusAccentClassNames[application.status]}`}
      />

      <div className="flex items-start justify-between gap-0">
        <div className="min-w-0">
          <div className="line-clamp-3 text-sm font-medium leading-5 text-white">
            {application.company_name}
          </div>

          <div className="line-clamp-2 text-xs text-white/48">
            {application.job_title}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={onEdit}
            className="grid size-7 place-items-center rounded-lg bg-white/[0.05] text-white/55 transition hover:bg-white/[0.10] hover:text-white"
          >
            <Pencil className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="grid size-7 place-items-center rounded-lg bg-red-400/[0.06] text-red-200/70 transition hover:bg-red-400/[0.12] hover:text-red-200"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/42">
        <CalendarDays className="size-3.5" />
        {formatDate(getStatusDate(application))}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${statusAccentClassNames[application.status]}`}
          style={{ width: `${getPipelineProgress(application.status)}%` }}
        />
      </div>

      <div className="mt-3 sm:hidden">
        <select
          value={application.status}
          onChange={(event) => onMove(event.target.value as ApplicationStatus)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/75 outline-none focus:border-cyan-300/30"
        >
          {columns.map((column) => (
            <option
              key={column.status}
              value={column.status}
            >
              Move to {column.title}
            </option>
          ))}
        </select>
      </div>

      {followUpState && (
        <div
          className={`mt-3 rounded-xl border px-2 py-1.5 text-[11px] font-medium ${
            followUpState.tone === "overdue"
              ? "border-red-400/15 bg-red-400/[0.08] text-red-200"
              : "border-yellow-400/15 bg-yellow-400/[0.08] text-yellow-200"
          }`}
        >
          {followUpState.label}
        </div>
      )}

      {application.notes && (
        <div className="mt-3 line-clamp-2 text-[11px] leading-5 text-white/45">
          {application.notes}
        </div>
      )}
    </div>
  );
}

const emptyDraft = {
  company_name: "",
  job_title: "",
  applied_date: new Date().toISOString().slice(0, 10),
  notes: "",
};