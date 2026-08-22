import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Headphones, Mic, PhoneForwarded, Radio, ShieldCheck, UserCog } from "lucide-react";
import {

  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PriorityBadge,
  PrivacyNote,
  StatusBadge,
  WarningNote,
} from "@/components/app/kit";
import { feedbackItems, liveActivity } from "@/data/mock";
import { useKpis } from "@/hooks/use-kpis";
import { useRole } from "@/components/app/role-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/live-calls")({
  head: () => ({
    meta: [
      { title: "AI Calling Console · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Professional AI call-operations console: live call state, consent and recording status, real-time transcript and AI-detected insights.",
      },
      { property: "og:title", content: "AI Calling Console · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Monitor live AI parent calls, transcripts and escalations in real time.",
      },
    ],
  }),
  component: CallingConsole,
});

const CALL = feedbackItems[1];

function CallingConsole() {
  const schoolKpis = useKpis();
  const { role } = useRole();
  const [visible, setVisible] = useState(4);
  const [seconds, setSeconds] = useState(184);

  useEffect(() => {
    if (!CALL) return;
    const t = setInterval(() => {
      setVisible((v) => (v < CALL.transcript.length ? v + 1 : v));
      setSeconds((s) => s + 3);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  if (!CALL) {
    return (
      <div className="space-y-6">
        <PageHeader title="AI Calling Console" subtitle="Live operations view of the AI feedback agent." />
        <Panel title="No Active Calls">
          <p className="py-8 text-center text-sm text-muted-foreground">No live calls are currently in progress.</p>
        </Panel>
      </div>
    );
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <>
      <PageHeader
        title="AI Calling Console"
        subtitle="Live operations view of the AI feedback agent. Serious concerns are handed to a human coordinator."
        actions={
          <>

            <span className="inline-flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
              <Radio className="size-3.5 animate-pulse" /> Agent online
            </span>
          </>
        }
      />

      <Grid cols={4}>
        <KpiCard label="Calls in progress" value={schoolKpis.loading ? "..." : String(schoolKpis.liveCallsInProgress || "0")} icon={Headphones} />
        <KpiCard label="Queued" value={schoolKpis.loading ? "..." : String(schoolKpis.liveCallsQueued || "0")} tone="warning" />
        <KpiCard label="Completed today" value={schoolKpis.loading ? "..." : String(schoolKpis.liveCallsCompletedToday || "0")} tone="success" />
        <KpiCard label="Escalations today" value={schoolKpis.loading ? "..." : String(schoolKpis.liveCallsEscalationsToday || "0")} tone="danger" to="/escalations" />
      </Grid>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel
          title="Live transcript · Call CL-77218"
          description="Streaming speech-to-text with speaker separation"
          actions={<StatusBadge status="In Progress" />}
        >
          <div className="mb-4 grid gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-3">
            <Field label="Parent reference" value="PRN-8142" />
            <Field label="Student reference" value={`VGN2026013 · ${CALL.grade}-${CALL.section}`} />
            <Field label="Preferred language" value="Telugu" />
            <Field label="Call duration" value={`${mm}:${ss}`} />
            <Field label="Consent" value="Captured (verbal)" tone="success" />
            <Field label="Recording" value="Recording · 90-day retention" tone="success" />
          </div>

          <ul className="space-y-3">
            {CALL.transcript.slice(0, visible).map((t, i) => (
              <li
                key={i}
                className={cn("flex", t.speaker === "AI Agent" ? "justify-start" : "justify-end")}
              >
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-[var(--shadow-card)]",
                    t.speaker === "AI Agent"
                      ? "rounded-tl-sm border border-border bg-card text-foreground"
                      : "rounded-tr-sm bg-primary/10 text-foreground",
                  )}
                >
                  <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.speaker}
                  </p>
                  {t.text}
                </div>
              </li>
            ))}
            {visible < CALL.transcript.length ? (
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mic className="size-3.5 animate-pulse text-primary" /> Listening…
              </li>
            ) : null}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110">
              <UserCog className="size-3.5" /> Escalate to human coordinator
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted">
              <PhoneForwarded className="size-3.5" /> Schedule callback
            </button>
            <button className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted">
              Flag for review
            </button>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="AI-detected insights" description="Updated continuously during the call">
            <dl className="space-y-3 text-sm">
              <Row label="Sentiment" value={<StatusBadge status="Mixed" />} />
              <Row
                label="Category"
                value={<span className="text-foreground">Communication · Transportation</span>}
              />
              <Row label="Priority" value={<PriorityBadge priority="medium" />} />
              <Row
                label="Detected issue"
                value={
                  <span className="text-foreground">Examination schedule communicated late</span>
                }
              />

              <Row label="Follow-up required" value={<StatusBadge status="Pending" />} />
              <Row label="Human escalation" value={<StatusBadge status="Not required" />} />
            </dl>
          </Panel>

          <Panel title="Queue activity">
            <ul className="space-y-3">
              {liveActivity.slice(0, 5).map((a, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-10 shrink-0 text-xs text-muted-foreground">{a.time}</span>
                  <span className="text-foreground/85">{a.text}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {role.canPlayRecordings ? (
            <PrivacyNote>
              Your role may access recordings. Each playback is recorded in the audit log with your
              user, time and device.
            </PrivacyNote>
          ) : (
            <WarningNote>
              Recording playback is not permitted for your role. You can review AI summaries and
              anonymised transcripts only.
            </WarningNote>
          )}
          <WarningNote>
            The AI agent never promises resolution. Safety, disciplinary and grievance topics are
            auto-routed to authorised school personnel.
          </WarningNote>
        </div>
      </div>
    </>
  );
}

function Field({ label, value, tone }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-0.5 text-sm font-medium",
          tone === "success" ? "text-success" : "text-foreground",
        )}
      >
        {tone === "success" ? <ShieldCheck className="mr-1 inline size-3.5" /> : null}
        {value}
      </p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-2.5 last:border-0 last:pb-0">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
