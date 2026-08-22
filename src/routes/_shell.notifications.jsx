import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell } from "lucide-react";
import { EmptyState, Grid, KpiCard, PageHeader, Panel, PriorityBadge } from "@/components/app/kit";
import { notifications } from "@/data/mock";
import { useKpis } from "@/hooks/use-kpis";

export const Route = createFileRoute("/_shell/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications & Alerts · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Critical alerts, recurring-issue warnings, overdue actions and report-ready notifications in one place.",
      },
      { property: "og:title", content: "Notifications & Alerts · VIGNAN PARENT VOICE AI" },
      { property: "og:description", content: "Know the moment something needs a decision." },
    ],
  }),
  component: NotificationsPage,
});

const FILTERS = ["All", "critical", "high", "medium", "low"];

function NotificationsPage() {
  const schoolKpis = useKpis();
  const [filter, setFilter] = useState("All");
  const rows = notifications.filter((n) => filter === "All" || n.severity === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Alerts"
        subtitle="Automatically raised from parent feedback as it arrives"
      />

      <Grid cols={3}>
        <KpiCard label="Unread alerts" value={schoolKpis.loading ? "..." : String(schoolKpis.unreadAlerts || "0")} tone="danger" icon={Bell} />
        <KpiCard
          label="Critical / high"
          value={String(
            notifications.filter((n) => n.severity === "critical" || n.severity === "high").length,
          )}
          tone="warning"
        />
        <KpiCard label="Total this week" value={String(notifications.length)} tone="accent" />
      </Grid>

      <Panel padded={false}>
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="Nothing to review"
              description="There are no alerts at this severity right now."
            />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((n) => (
              <li
                key={n.id}
                className="flex flex-wrap items-start justify-between gap-3 p-4 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={n.severity} />
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {n.type}
                    </span>
                    <span className="text-[11px] text-muted-foreground">· {n.time}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                </div>
                <Link
                  to={n.link}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5"
                >
                  Review
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
