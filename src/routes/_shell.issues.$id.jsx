import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  AiInsight,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PriorityBadge,
  StatusBadge,
  TrendBadge,
} from "@/components/app/kit";
import { VerticalBars } from "@/components/app/charts";
import { actions, issues } from "@/data/mock";

export const Route = createFileRoute("/_shell/issues/$id")({
  loader: ({ params }) => {
    const issue = issues.find((i) => i.id === params.id);
    if (!issue) throw notFound();
    return { issue };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Issue unavailable · VIGNAN PARENT VOICE AI" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `${loaderData.issue.title} · Issue Detail` },
        { name: "description", content: loaderData.issue.summary.slice(0, 155) },
        { property: "og:title", content: `${loaderData.issue.title} · Issue Detail` },
        { property: "og:description", content: loaderData.issue.summary.slice(0, 155) },
      ],
    };
  },
  component: IssueDetail,
});

function IssueDetail() {
  const { issue } = Route.useLoaderData();
  const linked = actions.filter((a) => a.issueId === issue.id);

  return (
    <div className="space-y-6">
      <Link
        to="/issues"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="size-3.5" /> Back to issue register
      </Link>

      <PageHeader
        title={issue.title}
        subtitle={`${issue.id} · ${issue.category} · Last updated ${issue.updated}`}
        actions={
          <div className="flex items-center gap-2">
            <PriorityBadge priority={issue.priority} />
            <StatusBadge status={issue.status} />
            <TrendBadge trend={issue.trend} />
          </div>
        }
      />

      <Grid>
        <KpiCard label="Parent mentions" value={String(issue.mentions)} />
        <KpiCard label="Classes affected" value={String(issue.classesAffected)} tone="warning" />
        <KpiCard label="Linked actions" value={String(linked.length)} tone="accent" />
        <KpiCard
          label="Change after action"
          value={`${issue.after - issue.before >= 0 ? "+" : ""}${issue.after - issue.before}`}
          tone={issue.after < issue.before ? "success" : "danger"}
        />
      </Grid>

      <AiInsight title="AI summary">{issue.summary}</AiInsight>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Evidence from parent feedback" description="Representative anonymised quotes">
          <ul className="space-y-3">
            {issue.evidence.map((e) => (
              <li
                key={e}
                className="rounded-xl border border-border bg-muted/40 p-3 text-sm text-foreground/85"
              >
                {e}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Before & after"
          description="Mentions measured before and after corrective action"
        >
          <VerticalBars
            data={[
              { period: "Before", value: issue.before },
              { period: "After", value: issue.after },
            ]}
            dataKey="value"
          />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Issue timeline">
          <ol className="space-y-3">
            {issue.history.map((h) => (
              <li key={h.date + h.text} className="border-l-2 border-primary/30 pl-3">
                <p className="text-xs font-semibold text-muted-foreground">{h.date}</p>
                <p className="text-sm text-foreground/85">{h.text}</p>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel
          title="Linked improvement actions"
          actions={
            <Link to="/actions" className="text-xs font-semibold text-primary hover:underline">
              All actions
            </Link>
          }
        >
          {linked.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No actions have been created for this issue yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {linked.map((a) => (
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
          )}
        </Panel>
      </div>
    </div>
  );
}
