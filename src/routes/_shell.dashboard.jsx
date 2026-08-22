import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Gauge,
  ListChecks,
  MessageSquareQuote,
  PhoneCall,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react";
import {
  AiInsight,

  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PriorityBadge,
  Progress,
  StatusBadge,
  TrendBadge,
} from "@/components/app/kit";
import { DonutChart, HorizontalBars, Legend, TrendLine } from "@/components/app/charts";
import { useRole } from "@/components/app/role-context";
import { actions, aiInsight, issues, services } from "@/data/mock";
import { useKpis } from "@/hooks/use-kpis";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "School-wide parent feedback dashboard: response rate, satisfaction, sentiment distribution, top concerns and critical issues.",
      },
      { property: "og:title", content: "Executive Dashboard · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "What parents are saying about Vignan School — measured, tracked and acted upon.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const schoolKpis = useKpis();
  const { period, userName, role } = useRole();
  const navigate = useNavigate();
  const sentiment = services.getSentiment();
  const concerns = services.getConcerns();
  const strengths = services.getStrengths();
  const trend = services.getTrend();
  const criticals = issues.filter((i) => i.priority === "critical" || i.priority === "high");

  // Compute KPIs from live data; fall back to 0 / "—" when DB is empty
  const criticalCount = issues.filter((i) => i.priority === "critical").length;
  const openActionCount = actions.filter((a) => ["Open", "In Progress", "Overdue"].includes(a.status)).length;

  return (
    <>
      <PageHeader
        title={`Good afternoon, ${role.id === "principal" ? "Principal" : userName.split(" ")[0]}`}
        subtitle="Here's what parents are saying about Vignan School."
        actions={
          <>

            <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {period}
            </span>
            <Link
              to="/weekly-report"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110"
            >
              Weekly AI report
            </Link>
          </>
        }
      />

      <Grid cols={4}>
        <KpiCard
          label="Parents Contacted"
          value={schoolKpis.loading ? "..." : schoolKpis.parentsContacted || "0"}
          hint="of 1,382 enrolled"
          icon={Users}
          to="/parents"
        />
        <KpiCard
          label="Completed Calls"
          value={schoolKpis.loading ? "..." : schoolKpis.callsMade || "0"}
          hint={`${schoolKpis.callCompletion || 0}% of dialled`}
          icon={PhoneCall}
          to="/campaigns"
        />
        <KpiCard
          label="Feedback Collected"
          value={schoolKpis.loading ? "..." : schoolKpis.responses || "0"}
          hint="AI analysed"
          icon={MessageSquareQuote}
          tone="accent"
          to="/feedback"
        />

        <KpiCard
          label="Response Rate"
          value={schoolKpis.loading ? "..." : `${schoolKpis.responseRate || 0}%`}
          delta={schoolKpis.responseRateDelta}
          hint="vs last period"
          icon={Gauge}
          tone="accent"
        />
      </Grid>

      <Grid cols={4}>
        <KpiCard
          label="Average Satisfaction"
          value={schoolKpis.loading ? "..." : `${schoolKpis.avgSatisfaction || 0} / 5`}
          delta={schoolKpis.avgSatisfactionDelta}
          hint="3.9 → 4.2"
          icon={Star}
          tone="success"
        />
        <KpiCard
          label="Critical Issues"
          value={String(criticalCount)}
          hint={criticalCount > 0 ? "human follow-up in progress" : "No critical issues"}
          icon={ShieldAlert}
          tone="danger"
          to="/issues"
        />

        <KpiCard
          label="Open Actions"
          value={String(openActionCount)}
          hint={openActionCount > 0 ? "pending completion" : "All clear"}
          icon={ListChecks}
          tone="warning"
          to="/actions"
        />
        <KpiCard
          label="Resolution Rate"
          value={schoolKpis.loading ? "..." : `${schoolKpis.resolutionRate || 0}%`}
          delta={schoolKpis.resolutionRateDelta}
          hint="issues closed in period"
          icon={CheckCircle2}
          tone="success"
          to="/impact"
        />
      </Grid>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Sentiment distribution" description="Click a segment to filter feedback">
          {sentiment.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No sentiment data yet.</p>
          ) : (
            <>
              <DonutChart
                data={sentiment}
                centerValue={String(concerns.reduce((s, c) => s + (c.mentions ?? 0), 0) || "—")}
                centerLabel="responses"
                onSelect={(name) =>
                  navigate({ to: "/feedback", search: { sentiment: name.toLowerCase() } })
                }
              />
              <Legend data={sentiment} />
            </>
          )}
        </Panel>

        <Panel
          title="Feedback trend"
          description="Satisfaction across the last three reporting periods"
          className="lg:col-span-2"
        >
          {trend.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No trend data yet.</p>
          ) : (
            <>
              <TrendLine data={trend} dataKey="satisfaction" domain={[3.5, 4.6]} />
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {trend.map((t) => (
                  <div key={t.period} className="rounded-xl border border-border bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">{t.period} 2026</p>
                    <p className="text-lg font-semibold text-foreground">
                      {t.satisfaction?.toFixed(1)} / 5
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.responses} responses · {t.positive}% positive
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Top concerns" description="Click a bar to open filtered issues">
          {concerns.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No concern data yet. Add feedback in Firebase.</p>
          ) : (
            <>
              <HorizontalBars data={concerns} onSelect={() => navigate({ to: "/issues" })} />
              <ul className="mt-2 space-y-2">
                {concerns.map((c) => (
                  <li key={c.name} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="flex items-center gap-3">
                      <TrendBadge trend={c.trend} />
                      <span className="font-semibold text-foreground">{c.mentions}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>

        <Panel title="Top strengths" description="What parents appreciate most">
          {strengths.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No strength data yet. Add feedback in Firebase.</p>
          ) : (
            <ul className="space-y-4">
              {strengths.map((s) => (
                <li key={s.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <span className="text-muted-foreground">{s.mentions} mentions</span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={(s.mentions / 264) * 100} tone="success" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <AiInsight>{aiInsight}</AiInsight>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Critical & high-priority issues"
          description="Serious concerns are routed to authorised school personnel"
          actions={
            <Link to="/issues" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          }
        >
          {criticals.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No critical issues right now.</p>
          ) : (
            <ul className="space-y-3">
              {criticals.map((i) => (
                <li key={i.id}>
                  <Link
                    to="/issues/$id"
                    params={{ id: i.id }}
                    className="block rounded-xl border border-border p-4 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{i.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {i.mentions} mentions · {i.classesAffected} classes affected · {i.category}
                        </p>
                      </div>
                      <PriorityBadge priority={i.priority} />
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <StatusBadge status={i.status} />
                      <TrendBadge trend={i.trend} />
                      <span className="ml-auto text-xs text-muted-foreground">
                        Updated {i.updated}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Recent actions"
          description="Improvement actions created from parent feedback"
          actions={
            <Link to="/actions" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          }
        >
          {actions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No actions recorded yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {actions.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{a.action}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {a.owner} · target {a.target}
                    </p>
                  </div>
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
