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
  StatCard,
} from "@/components/launchly/AppShell";

import { useAuth } from "@/context/AuthContext";

import {
  Briefcase,
  Plus,
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  Loader2,
  CalendarDays,
  Pencil,
  Trash2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import {
  useApplications,
} from "@/features/applications/hooks/useApplications";

import {
  ApplicationModal,
} from "@/features/applications/modals/ApplicationModal";

import type {
  ApplicationItem,
  ApplicationStatus,
  ApplicationPayload,
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

function isFollowUpDue(application: ApplicationItem) {
  return getFollowUpState(application) !== null;
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
      description: "Keep applying! Responses will appear here.",
    };
  }

  if (status === "onsite") {
    return {
      title: "No onsite rounds yet.",
      description: "Strong matches will move here as your pipeline warms up.",
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

function Applications() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const {
    applications,
    isLoadingApplications,
    isSavingApplication,
    error,
    loadApplications,
    createApplication,
    updateApplication,
    updateApplicationStatus,
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

  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter(
      (application) => application.status !== "rejected",
    ).length;
    const responded = applications.filter(
      (application) =>
        application.status === "phone_screen" ||
        application.status === "onsite" ||
        application.status === "offer" ||
        application.status === "rejected",
    ).length;
    const offers = applications.filter(
      (application) => application.status === "offer",
    ).length;
    const followUpsDue = applications.filter(isFollowUpDue).length;

    return {
      active,
      responseRate:
        total > 0
          ? Math.round((responded / total) * 100)
          : 0,
      offers,
      followUpsDue,
      total,
    };
  }, [applications]);

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
    const payload: ApplicationPayload = {
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

      const today = getTodayDateString();

      const payload: ApplicationPayload = {
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

      await updateApplication(application.id, payload);
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
      subtitle="Track every application, interview stage, offer and follow-up in one calm board."
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
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Active"
            value={String(stats.active)}
            delta={`${stats.total} total`}
            icon={Briefcase}
            tone="violet"
          />

          <StatCard
            label="Response rate"
            value={`${stats.responseRate}%`}
            delta="includes rejections"
            icon={Send}
            tone="cyan"
          />

          <StatCard
            label="Offers"
            value={String(stats.offers)}
            delta={stats.offers > 0 ? "🎉" : "Keep going"}
            icon={CheckCircle2}
            tone="green"
          />

          <StatCard
            label="Follow-ups due"
            value={String(stats.followUpsDue)}
            delta="applied only"
            icon={Bell}
            tone="pink"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.06] p-4 text-sm text-orange-200">
            {error}
          </div>
        )}

        {isLoadingApplications ? (
          <Card>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <Loader2 className="size-4 animate-spin text-cyan-300" />
              Loading your application board...
            </div>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {columns.map((column) => {
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
                  className={`rounded-2xl border border-white/10 glass p-3 shadow-card transition hover:bg-white/[0.035] ${
                    activeDropStatus === column.status
                      ? columnDropClassNames[column.status]
                      : ""
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Icon className="size-4 text-cyan-300" />
                        {column.title}
                      </div>

                      <div className="mt-1 text-[11px] leading-5 text-muted-foreground">
                        {column.helper}
                      </div>
                    </div>

                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                      {items.length}
                    </span>
                  </div>

                  <div className="h-[70vh] min-h-[420px] space-y-2 overflow-y-auto pr-1">
                    {items.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.025] p-4 text-xs leading-6 text-white/40">
                        <div className="font-semibold text-white/60">
                          {getEmptyColumnMessage(column.status).title}
                        </div>

                        <div className="mt-1">
                          {getEmptyColumnMessage(column.status).description}
                        </div>
                      </div>
                    ) : (
                      items.map((application) => (
                        <div
                          key={application.id}
                          draggable
                          onDragStart={() =>
                            setDraggedApplicationId(application.id)
                          }
                          onDragEnd={() =>
                            setDraggedApplicationId(null)
                          }
                          className="group relative cursor-grab overflow-hidden rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10 transition duration-200 hover:-translate-y-[1px] hover:bg-white/[0.08] hover:ring-white/20 hover:shadow-[0_14px_40px_rgba(34,211,238,0.08)] active:cursor-grabbing active:scale-[0.99]"
                        >
                          <div
                            className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${statusAccentClassNames[application.status]}`}
                          />
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-white">
                                {application.company_name}
                              </div>

                              <div className="mt-1 truncate text-xs text-muted-foreground">
                                {application.job_title}
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenEditModal(application)
                                }
                                className="grid size-7 place-items-center rounded-lg bg-white/[0.05] text-white/55 transition hover:bg-white/[0.10] hover:text-white"
                              >
                                <Pencil className="size-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteApplication(application.id)
                                }
                                className="grid size-7 place-items-center rounded-lg bg-red-400/[0.06] text-red-200/70 transition hover:bg-red-400/[0.12] hover:text-red-200"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <CalendarDays className="size-3.5" />
                            {formatDate(getStatusDate(application))}
                          </div>

                          {getFollowUpState(application) && (
                            <div
                              className={`mt-3 rounded-lg border px-2 py-1.5 text-[11px] font-medium ${
                                getFollowUpState(application)?.tone === "overdue"
                                  ? "border-red-400/15 bg-red-400/[0.08] text-red-200"
                                  : "border-yellow-400/15 bg-yellow-400/[0.08] text-yellow-200"
                              }`}
                            >
                              {getFollowUpState(application)?.label}
                            </div>
                          )}

                          {application.notes && (
                            <div className="mt-3 line-clamp-2 text-[11px] leading-5 text-white/45">
                              {application.notes}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Card>
          <div className="mb-3 text-sm font-semibold">
            Pipeline analytics
          </div>

          <div className="grid gap-3 md:grid-cols-5 text-center text-xs">
            {columns.map((column) => (
              <div
                key={column.status}
                className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10"
              >
                <div className="text-muted-foreground">
                  {column.title}
                </div>

                <div className="mt-1 text-2xl font-semibold">
                  {groupedApplications[column.status].length}
                </div>
              </div>
            ))}
          </div>
        </Card>
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

const emptyDraft = {
  company_name: "",
  job_title: "",
  applied_date: new Date().toISOString().slice(0, 10),
  notes: "",
};