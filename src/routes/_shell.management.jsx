import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Star, TrendingDown, TrendingUp } from "lucide-react";
import {
  AiInsight,

  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PriorityBadge,
  Progress,
  StatusBadge,
} from "@/components/app/kit";
import { DonutChart, Legend, TrendLine, VerticalBars } from "@/components/app/charts";
import {
  actions,
  feedbackTrend,
  interventions,
  issues,
  topConcerns,
  topStrengths,
} from "@/data/mock";
import { useKpis } from "@/hooks/use-kpis";

export const Route = createFileRoute("/_shell/management")({
  head: () => ({
    meta: [
      { title: "Management Dashboard · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Executive management view of parent satisfaction, recurring issues, intervention outcomes and decisions required.",
      },
      { property: "og:title", content: "Management Dashboard · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Outcome-focused executive view of parent experience at Vignan School.",
      },
    ],
  }),
  component: ManagementPage,
});

function ManagementPage() {
  const schoolKpis = useKpis();
  const transport = interventions[0] ?? null;
  const decisions = issues.filter(
    (i) => i.assignedTo === "Unassigned" || i.priority === "critical",
  );
  const sentimentSplit = [
    { name: "Positive", value: schoolKpis.sentimentPositive || 0, color: "var(--color-success)" },
    { name: "Neutral", value: schoolKpis.sentimentNeutral || 0, color: "var(--color-muted-foreground)" },
    { name: "Negative", value: schoolKpis.sentimentNegative || 0, color: "var(--color-destructive)" },
    { name: "Mixed", value: schoolKpis.sentimentMixed || 0, color: "var(--color-accent)" },
  ].filter((s) => s.value > 0);

  return (
    <>
      <PageHeader
        title="Management Dashboard"
        subtitle="Outcomes, not operations — parent satisfaction, recurring themes and the effect of interventions."
        actions={null}
      />

      <Grid cols={4}>
        <KpiCard
          label="Overall Parent Satisfaction"
          value={schoolKpis.loading ? "..." : `${schoolKpis.avgSatisfaction || 0} / 5`}
          delta={schoolKpis.avgSatisfactionDelta}
          icon={Star}
          tone="success"
        />
        <KpiCard
          label="Positive Sentiment"
          value={schoolKpis.loading ? "..." : `${schoolKpis.sentimentPositive || 0}%`}
          delta={schoolKpis.sentimentPositiveDelta}
          icon={TrendingUp}
          tone="success"
        />
        <KpiCard
          label="Resolution Rate"
          value={schoolKpis.loading ? "..." : `${schoolKpis.resolutionRate || 0}%`}
          delta={schoolKpis.resolutionRateDelta}
          icon={CheckCircle2}
          tone="accent"
          to="/actions"
        />
        <KpiCard
          label="Transport Complaints"
          value={schoolKpis.loading ? "..." : `${schoolKpis.transportComplaintsTrend || 0}%`}
          hint="following corrective action"
          icon={TrendingDown}
          tone="primary"
          to="/impact"
        />
      </Grid>

      <AiInsight title="Executive AI Insight — what management should know">
        <ul className="space-y-2">
          <li>• Communication is the most recurring concern, driven by late examination scheduling.</li>
          <li>• Transport complaints are declining following the route intervention.</li>
          <li>• Academic support requests remain concentrated in Grades 7–9.</li>
          <li>• Overall parent sentiment is stable and improving across the last three periods.</li>
        </ul>
      </AiInsight>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Sentiment mix">
          {sentimentSplit.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No sentiment data yet.</p>
          ) : (
            <>
              <DonutChart data={sentimentSplit} centerValue={schoolKpis.loading ? "..." : `${schoolKpis.avgSatisfaction || 0}`} centerLabel="avg rating" />
              <Legend data={sentimentSplit} />
            </>
          )}
        </Panel>
        <Panel
          title="Sentiment trend"
          description="Satisfaction, last three periods"
          className="lg:col-span-2"
        >
          {feedbackTrend.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No trend data yet.</p>
          ) : (
            <TrendLine data={feedbackTrend} dataKey="satisfaction" domain={[3.5, 4.6]} />
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {transport ? (
          <Panel
            title="Before & after — transport intervention"
            description={transport.action}
            actions={
              <Link to="/impact" className="text-xs font-semibold text-primary hover:underline">
                All interventions
              </Link>
            }
          >
            <VerticalBars data={transport.series} dataKey="value" />
            <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              {transport.insight}
            </p>
          </Panel>
        ) : (
          <Panel title="Before & after — intervention" description="No intervention data yet">
            <p className="py-8 text-center text-sm text-muted-foreground">
              No interventions recorded. Add data in Firebase to see results here.
            </p>
          </Panel>
        )}

        <Panel
          title="Major recurring issues"
          description="Themes appearing across multiple periods"
        >
          {issues.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No issues recorded yet. Add data in Firebase to see results here.
            </p>
          ) : (
            <ul className="space-y-3">
              {issues.slice(0, 4).map((i) => (
                <li key={i.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{i.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.mentions} mentions · {i.classesAffected} classes · {i.trend}
                      </p>
                    </div>
                    <PriorityBadge priority={i.priority} />
                  </div>
                  <div className="mt-2">
                    <Progress
                      value={(i.mentions / 126) * 100}
                      tone={i.trend === "Decreasing" ? "success" : "warning"}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="School-wide strengths">
          {topStrengths.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {topStrengths.map((s) => (
                <li
                  key={s.name}
                  className="rounded-xl border border-success/20 bg-success/6 px-3 py-2.5 text-sm text-foreground"
                >
                  {s.name}
                  <span className="ml-1 text-xs text-muted-foreground">({s.mentions})</span>
                </li>
              ))}
            </ul>
          )}
          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Concern mix
          </h3>
          {topConcerns.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {topConcerns.map((c) => (
                <li key={c.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{c.name}</span>
                  <span className="font-semibold text-foreground">{c.mentions}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Areas requiring management decisions">
          {decisions.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">No items need a decision right now.</p>
          ) : (
            <ul className="space-y-3">
              {decisions.map((i) => (
                <li key={i.id} className="rounded-xl border border-warning/30 bg-warning/8 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{i.title}</p>
                    <PriorityBadge priority={i.priority} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{i.summary}</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <StatusBadge status={i.status} />
                    <Link
                      to="/issues/$id"
                      params={{ id: i.id }}
                      className="ml-auto text-xs font-semibold text-primary hover:underline"
                    >
                      Review
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Improvement actions
          </h3>
          {actions.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No actions recorded yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {actions.slice(0, 4).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0 truncate text-sm text-foreground">{a.action}</span>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
