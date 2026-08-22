import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  DataTable,

  EmptyState,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  Progress,
  StatusBadge,
  Td,
  Th,
} from "@/components/app/kit";
import { campaigns } from "@/data/mock";
import { useKpis } from "@/hooks/use-kpis";

export const Route = createFileRoute("/_shell/campaigns/")({
  head: () => ({
    meta: [
      { title: "Call Campaigns · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Create, schedule and monitor AI parent-calling campaigns with audience filters, questionnaires and consent policy.",
      },
      { property: "og:title", content: "Call Campaigns · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Campaign management for AI parent feedback calling at Vignan School.",
      },
    ],
  }),
  component: CampaignsPage,
});

const STATUSES = ["All", "Draft", "Scheduled", "Running", "Paused", "Completed"];

const WIZARD = [
  {
    title: "Campaign details",
    body: "Name, academic year, description and owner. Choose whether this is a pulse survey or a term review.",
    fields: ["Campaign name", "Academic year", "Owner", "Description"],
  },
  {
    title: "Select audience",
    body: "Filter the parent base by grade, section, faculty, subject and preferred language.",
    fields: ["Grade", "Section", "Faculty", "Subject", "Parent language"],
  },
  {
    title: "Questionnaire",
    body: "Configure the questions the AI agent asks, their order and follow-up probes.",
    fields: ["Question bank", "Order", "Probing rules", "Rating scale"],
  },
  {
    title: "Calling schedule",
    body: "Calling window, days, retry limits and callback handling.",
    fields: ["Start date", "End date", "Calling hours", "Retry limit"],
  },
  {
    title: "Consent & recording policy",
    body: "Consent script, recording opt-in, retention period and who may access recordings.",
    fields: ["Consent script", "Recording", "Retention", "Access roles"],
  },
  {
    title: "Review & launch",
    body: "Verify audience size, cost estimate and policy compliance before launching.",
    fields: ["Audience size", "Estimated duration", "Policy check"],
  },
];

function CampaignsPage() {
  const schoolKpis = useKpis();
  const [filter, setFilter] = useState("All");
  const [wizard, setWizard] = useState(false);
  const [step, setStep] = useState(0);

  const rows = campaigns.filter((c) => filter === "All" || c.status === filter);
  const running = campaigns.filter((c) => c.status === "Running");

  return (
    <>
      <PageHeader
        title="Call Campaigns"
        subtitle="Plan, launch and monitor AI parent-feedback calling campaigns."
        actions={
          <>

            <button
              onClick={() => {
                setWizard(true);
                setStep(0);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110"
            >
              <Plus className="size-3.5" /> New campaign
            </button>
          </>
        }
      />

      <Grid cols={4}>
        <KpiCard
          label="Active campaigns"
          value={String(running.length)}
          hint="currently dialling"
        />
        <KpiCard label="Parents in queue" value={schoolKpis.loading ? "..." : String(schoolKpis.parentsInQueue || "0")} hint="August Parent Pulse" tone="warning" />
        <KpiCard label="Completed calls today" value={schoolKpis.loading ? "..." : String(schoolKpis.completedCallsToday || "0")} delta={schoolKpis.completedCallsTodayDelta} tone="success" />
        <KpiCard label="Avg response rate" value={schoolKpis.loading ? "..." : `${schoolKpis.avgResponseRateAcrossCampaigns || 0}%`} hint="across campaigns" tone="accent" />
      </Grid>

      <Panel
        title="All campaigns"
        description="Click a campaign to open live operational metrics"
        actions={
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  filter === s
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        }
        padded={false}
      >
        {rows.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No campaigns match this filter"
              description="Try a different status filter or create a new campaign to start collecting parent feedback."
            />
          </div>
        ) : (
          <DataTable
            head={
              <>
                <Th>Campaign</Th>
                <Th>Year</Th>
                <Th>Target audience</Th>
                <Th>Parents</Th>
                <Th>Completed</Th>
                <Th className="w-40">Response rate</Th>
                <Th>Status</Th>
                <Th>Start</Th>
                <Th>End</Th>
                <Th>Actions</Th>
              </>
            }
          >
            {rows.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-muted/40">
                <Td>
                  <Link
                    to="/campaigns/$id"
                    params={{ id: c.id }}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {c.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{c.id}</p>
                </Td>
                <Td className="text-muted-foreground">{c.year}</Td>
                <Td className="text-muted-foreground">{c.audience}</Td>
                <Td>{c.parents.toLocaleString()}</Td>
                <Td>{c.completed.toLocaleString()}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={c.responseRate}
                      tone={c.responseRate > 80 ? "success" : "warning"}
                    />
                    <span className="w-12 text-xs text-muted-foreground">{c.responseRate}%</span>
                  </div>
                </Td>
                <Td>
                  <StatusBadge status={c.status} />
                </Td>
                <Td className="text-muted-foreground">{c.start}</Td>
                <Td className="text-muted-foreground">{c.end}</Td>
                <Td>
                  <Link
                    to="/campaigns/$id"
                    params={{ id: c.id }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Open
                  </Link>
                </Td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>

      {wizard ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="w-full max-w-3xl overflow-hidden rounded-t-2xl bg-card shadow-[var(--shadow-pop)] sm:rounded-2xl">
            <header className="flex items-start justify-between gap-3 border-b border-border px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Create call campaign</h2>
                <p className="text-xs text-muted-foreground">
                  Step {step + 1} of {WIZARD.length} — {WIZARD[step].title}
                </p>
              </div>
              <button
                onClick={() => setWizard(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </header>

            <div className="px-6 pt-4">
              <div className="flex gap-1.5">
                {WIZARD.map((w, i) => (
                  <div
                    key={w.title}
                    className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
              <p className="text-sm text-muted-foreground">{WIZARD[step].body}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {WIZARD[step].fields.map((f) => (
                  <label key={f} className="block">
                    <span className="text-xs font-medium text-foreground">{f}</span>
                    <input
                      className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                      placeholder={f}
                    />
                  </label>
                ))}
              </div>
              {step === 5 ? (
                <div className="mt-4 rounded-xl border border-success/25 bg-success/8 px-4 py-3 text-xs text-foreground/85">
                  Audience: 1,250 parents · estimated 6 calling days · consent script configured ·
                  recording access limited to Principal, Super Admin and Coordinators.
                </div>
              ) : null}
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground disabled:opacity-40"
              >
                Back
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setWizard(false)}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground"
                >
                  Save as draft
                </button>
                <button
                  onClick={() =>
                    step === WIZARD.length - 1 ? setWizard(false) : setStep((s) => s + 1)
                  }
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110"
                >
                  {step === WIZARD.length - 1 ? "Launch campaign" : "Continue"}
                </button>
              </div>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}
