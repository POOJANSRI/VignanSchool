import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Gauge, ShieldAlert, Star } from "lucide-react";
import {
  AiInsight,

  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PriorityBadge,
  Progress,
  Rating,
  StatusBadge,
  TrendBadge,
} from "@/components/app/kit";
import { DonutChart, Legend, MultiLine, TrendLine } from "@/components/app/charts";
import {
  facultyList,
  feedbackTrend,
  issues,
  services,
  topConcerns,
  topStrengths,
} from "@/data/mock";
import { useKpis } from "@/hooks/use-kpis";

export const Route = createFileRoute("/_shell/principal")({
  head: () => ({
    meta: [
      { title: "Principal Dashboard · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "One-page executive summary of parent feedback for the Principal: statistics, strengths, concerns, immediate attention and resolution performance.",
      },
      { property: "og:title", content: "Principal Dashboard · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Strategic view of parent sentiment, issues and improvement outcomes.",
      },
    ],
  }),
  component: PrincipalPage,
});

function PrincipalPage() {
  const schoolKpis = useKpis();
  const sentimentSplit = [
    { name: "Positive", value: schoolKpis.sentimentPositive || 0, color: "var(--color-success)" },
    { name: "Neutral", value: schoolKpis.sentimentNeutral || 0, color: "var(--color-muted-foreground)" },
    { name: "Negative", value: schoolKpis.sentimentNegative || 0, color: "var(--color-destructive)" },
    { name: "Mixed", value: schoolKpis.sentimentMixed || 0, color: "var(--color-accent)" },
  ].filter((s) => s.value > 0);
  const immediate = issues.filter((i) => i.priority === "critical" || i.priority === "high");
  const grades = services.getClasses().slice(0, 6);

  return (
    <>
      <PageHeader
        title="Principal Dashboard"
        subtitle="A one-page strategic view of what parents are saying, what is being done and whether it is working."
        actions={
          <>

            <Link
              to="/reports"
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Export principal report
            </Link>
          </>
        }
      />

      <AiInsight title="Executive summary">
        <p>
          1,250 parents were contacted this period and 1,040 responded (83.2%). Average satisfaction
          rose to
          <strong> 4.2/5</strong> from 3.9 in June, with 68% positive sentiment. Parents
          consistently praise teacher subject knowledge and discipline.
        </p>
        <p className="mt-2">
          Communication — specifically advance notice of examination schedules — remains the single
          largest improvement theme (186 mentions, 7 classes). Transport complaints are declining
          following the route intervention. One critical safety concern in the primary block has
          been routed to authorised school personnel and requires your attention this week.
        </p>
      </AiInsight>

      <Grid cols={4}>
        <KpiCard
          label="Calls / Responses"
          value={`${schoolKpis.callsMade || 0} / ${schoolKpis.responses || 0}`}
          hint={`${schoolKpis.callCompletion || 0}% call completion`}
          icon={Gauge}
        />
        <KpiCard label="Response Rate" value={`${schoolKpis.responseRate || 0}%`} delta={schoolKpis.responseRateDelta} icon={Gauge} tone="accent" />
        <KpiCard label="Average Rating" value={`${schoolKpis.avgSatisfaction || 0} / 5`} delta={schoolKpis.avgSatisfactionDelta} icon={Star} tone="success" />
        <KpiCard
          label="Resolution Rate"
          value={`${schoolKpis.resolutionRate || 0}%`}
          delta={schoolKpis.resolutionRateDelta}
          icon={CheckCircle2}
          tone="success"
          to="/impact"
        />
      </Grid>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Sentiment" description="Positive · Neutral · Negative · Mixed">
          <DonutChart data={sentimentSplit} centerValue={`${schoolKpis.sentimentPositive || 0}%`} centerLabel="positive" />
          <Legend data={sentimentSplit} />
          <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            A further 4% of responses were classified <strong>mixed</strong> (positive on academics,
            negative on a specific service area).
          </p>
        </Panel>
        <Panel
          title="Improvement trends"
          description="Satisfaction and positive share by period"
          className="lg:col-span-2"
        >
          <MultiLine
            data={feedbackTrend}
            series={[
              { key: "positive", label: "Positive %", color: "var(--color-success)" },
              { key: "negative", label: "Negative %", color: "var(--color-destructive)" },
            ]}
          />

          <div className="mt-2">
            <TrendLine
              data={feedbackTrend}
              dataKey="satisfaction"
              domain={[3.5, 4.6]}
              height={140}
            />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Top strengths" description="Where the school is clearly working">
          <ul className="space-y-4">
            {topStrengths.map((s) => (
              <li key={s.name}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className="text-muted-foreground">{s.mentions}</span>
                </div>
                <div className="mt-1.5">
                  <Progress value={(s.mentions / 264) * 100} tone="success" />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Top concerns" description="Where improvement effort should focus">
          <ul className="space-y-4">
            {topConcerns.map((c) => (
              <li key={c.name}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="flex items-center gap-3 text-muted-foreground">
                    <TrendBadge trend={c.trend} />
                    {c.mentions}
                  </span>
                </div>
                <div className="mt-1.5">
                  <Progress
                    value={(c.mentions / 186) * 100}
                    tone={c.trend === "increasing" ? "danger" : "warning"}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Immediate attention"
        description="Critical and high-priority issues requiring a decision"
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {immediate.map((i) => (
            <li key={i.id}>
              <Link
                to="/issues/$id"
                params={{ id: i.id }}
                className="flex h-full flex-col rounded-xl border border-destructive/20 bg-destructive/5 p-4 transition-all hover:shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{i.title}</p>
                  <PriorityBadge priority={i.priority} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{i.summary}</p>
                <div className="mt-3 flex items-center gap-2">
                  <StatusBadge status={i.status} />
                  <span className="text-xs text-muted-foreground">{i.assignedTo}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Faculty highlights"
          description="Support-oriented view — not a punitive ranking"
        >
          <ul className="divide-y divide-border">
            {[...facultyList]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((f) => (
                <li key={f.id} className="flex items-center justify-between py-3 first:pt-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.subject} · {f.grades} · {f.positive}% positive
                    </p>
                  </div>
                  <Rating value={f.rating} />
                </li>
              ))}
          </ul>
        </Panel>
        <Panel title="Grade highlights" description="Sections needing attention appear first">
          <ul className="divide-y divide-border">
            {[...grades]
              .sort((a, b) => a.satisfaction - b.satisfaction)
              .map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3 first:pt-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.responses}/{c.contacted} responses · top concern {c.concerns[0]}
                    </p>
                  </div>
                  <Rating value={c.satisfaction} />
                </li>
              ))}
          </ul>
        </Panel>
      </div>

      <div className="surface flex flex-wrap items-center gap-3 p-5">
        <ShieldAlert className="size-5 text-accent" />
        <p className="text-sm text-muted-foreground">
          Serious complaints are never closed by AI. They are escalated to authorised school
          personnel and tracked to resolution.
        </p>
        <Link
          to="/escalations"
          className="ml-auto text-xs font-semibold text-primary hover:underline"
        >
          Open escalation queue
        </Link>
      </div>
    </>
  );
}
