import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  DataTable,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PriorityBadge,
  Progress,
  StatusBadge,
  Td,
  Th,
  TrendBadge,
} from "@/components/app/kit";
import { HorizontalBars } from "@/components/app/charts";
import { issues } from "@/data/mock";

export const Route = createFileRoute("/_shell/issues/")({
  head: () => ({
    meta: [
      { title: "Issue Register · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "AI-identified recurring parent concerns with mentions, affected classes, owners and resolution status.",
      },
      { property: "og:title", content: "Issue Register · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Track every recurring parent concern from detection to resolution.",
      },
    ],
  }),
  component: IssuesPage,
});

function IssuesPage() {
  const [status, setStatus] = useState("All");
  const rows = issues.filter((i) => status === "All" || i.status === status);
  const open = issues.filter((i) => i.status !== "Resolved").length;
  const critical = issues.filter((i) => i.priority === "critical" || i.priority === "high").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issue Register"
        subtitle="Recurring themes identified from parent feedback, grouped and prioritised automatically"
      />

      <Grid>
        <KpiCard label="Total issues" value={String(issues.length)} />
        <KpiCard label="Open issues" value={String(open)} tone="warning" />
        <KpiCard label="High / critical" value={String(critical)} tone="danger" />
        <KpiCard label="Resolved" value={String(issues.length - open)} tone="success" delta={12} />
      </Grid>

      <Panel title="Mentions by issue" description="Volume of parent mentions this academic year">
        <HorizontalBars data={issues.map((i) => ({ name: i.title, mentions: i.mentions }))} />
      </Panel>

      <Panel padded={false}>
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </span>
          {["All", "Identified", "Under Review", "Action Assigned", "In Progress", "Resolved"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  status === s
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ),
          )}
        </div>
        <DataTable
          head={
            <tr>
              <Th>Issue</Th>
              <Th>Category</Th>
              <Th>Mentions</Th>
              <Th>Classes</Th>
              <Th>Priority</Th>
              <Th>Trend</Th>
              <Th>Owner</Th>
              <Th>Status</Th>
            </tr>
          }
        >
          {rows.map((i) => (
            <tr key={i.id} className="transition-colors hover:bg-muted/50">
              <Td>
                <Link
                  to="/issues/$id"
                  params={{ id: i.id }}
                  className="font-medium text-primary hover:underline"
                >
                  {i.title}
                </Link>
                <span className="block text-xs text-muted-foreground">{i.id}</span>
              </Td>
              <Td className="text-muted-foreground">{i.category}</Td>
              <Td>
                <span className="font-medium">{i.mentions}</span>
                <div className="mt-1 w-20">
                  <Progress
                    value={(i.mentions / 126) * 100}
                    tone={i.trend === "Decreasing" ? "success" : "warning"}
                  />
                </div>
              </Td>
              <Td className="text-muted-foreground">{i.classesAffected}</Td>
              <Td>
                <PriorityBadge priority={i.priority} />
              </Td>
              <Td>
                <TrendBadge trend={i.trend} />
              </Td>
              <Td className="text-muted-foreground">{i.assignedTo}</Td>
              <Td>
                <StatusBadge status={i.status} />
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </div>
  );
}
