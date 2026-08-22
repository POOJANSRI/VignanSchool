import { Link, createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import {
  AiInsight,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PriorityBadge,
  StatusBadge,
} from "@/components/app/kit";
import { DonutChart, Legend, TrendLine } from "@/components/app/charts";
import {
  actions,
  escalations,
  feedbackTrend,
  issues,
  topConcerns,
  topStrengths,
} from "@/data/mock";
import { useKpis } from "@/hooks/use-kpis";

export const Route = createFileRoute("/_shell/weekly-report")({
  head: () => ({
    meta: [
      { title: "Weekly AI Report · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Automated weekly narrative of parent sentiment, new issues, escalations and recommended next actions.",
      },
      { property: "og:title", content: "Weekly AI Report · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "One page that tells the Principal what changed this week.",
      },
    ],
  }),
  component: WeeklyReportPage,
});

function WeeklyReportPage() {
  const schoolKpis = useKpis();
  const newIssues = issues.slice(0, 3);
  const dueActions = actions.filter((a) => a.status !== "Completed" && true).slice(0, 4);
  const sentimentSplit = [
    { name: "Positive", value: schoolKpis.sentimentPositive || 0, color: "var(--color-success)" },
    { name: "Neutral", value: schoolKpis.sentimentNeutral || 0, color: "var(--color-muted-foreground)" },
    { name: "Negative", value: schoolKpis.sentimentNegative || 0, color: "var(--color-destructive)" },
    { name: "Mixed", value: schoolKpis.sentimentMixed || 0, color: "var(--color-accent)" },
  ].filter((s) => s.value > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly AI Report"
        subtitle="15–21 August 2026 · Generated automatically from parent feedback collected this week"
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted">
            <Download className="size-3.5" /> Download PDF
          </button>
        }
      />

      <Grid>
        <KpiCard
          label="Responses this week"
          value={schoolKpis.loading ? "..." : schoolKpis.responsesThisWeek || "0"}
          delta={schoolKpis.responsesThisWeekDelta}
          hint="Parents who shared feedback"
        />
        <KpiCard
          label="Response rate"
          value={schoolKpis.loading ? "..." : `${schoolKpis.responseRate || 0}%`}
          delta={schoolKpis.responseRateDelta}
          tone="accent"
        />
        <KpiCard
          label="Average satisfaction"
          value={schoolKpis.loading ? "..." : `${schoolKpis.avgSatisfaction || 0}/5`}
          delta={schoolKpis.avgSatisfactionDelta}
          tone="success"
        />
        <KpiCard
          label="Critical issues"
          value={schoolKpis.loading ? "..." : String(schoolKpis.criticalIssues || 0)}
          tone="danger"
          hint="Escalated for follow-up"
        />
      </Grid>

      <AiInsight title="Executive narrative">
        Parent satisfaction held steady this week with a small improvement in positive sentiment.
        Examination communication remains the most repeated concern, while transport mentions
        continued to fall following the route re-sequencing. {escalations.length} escalations were
        raised, of which {escalations.filter((e) => e.priority === "critical").length} required
        immediate human follow-up.
      </AiInsight>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Sentiment this week">
          <DonutChart data={sentimentSplit} centerValue={schoolKpis.loading ? "..." : schoolKpis.responses || "0"} centerLabel="responses" />
          <Legend data={sentimentSplit} />
        </Panel>

        <Panel
          title="Satisfaction trend"
          description="Last three periods"
          className="lg:col-span-2"
        >
          <TrendLine data={feedbackTrend} dataKey="satisfaction" domain={[3.5, 4.6]} />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="What parents raised most" description="Top concerns by mentions">
          <ul className="space-y-2">
            {topConcerns.slice(0, 5).map((c) => (
              <li
                key={c.name}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span className="text-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.mentions} mentions</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="What parents appreciated" description="Top strengths by mentions">
          <ul className="space-y-2">
            {topStrengths.slice(0, 5).map((c) => (
              <li
                key={c.name}
                className="flex items-center justify-between gap-3 rounded-lg bg-success/8 px-3 py-2 text-sm"
              >
                <span className="text-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.mentions} mentions</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Issues needing decisions"
          actions={
            <Link to="/issues" className="text-xs font-semibold text-primary hover:underline">
              Issue register
            </Link>
          }
        >
          <ul className="space-y-3">
            {newIssues.map((i) => (
              <li key={i.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to="/issues/$id"
                    params={{ id: i.id }}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {i.title}
                  </Link>
                  <PriorityBadge priority={i.priority} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {i.mentions} mentions · {i.classesAffected} classes · {i.status}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Actions due"
          actions={
            <Link to="/actions" className="text-xs font-semibold text-primary hover:underline">
              All actions
            </Link>
          }
        >
          <ul className="space-y-3">
            {dueActions.map((a) => (
              <li key={a.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{a.action}</p>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {a.owner} · target {a.target}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
