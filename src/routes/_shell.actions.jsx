import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  DataTable,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PriorityBadge,
  StatusBadge,
  Td,
  Th,
} from "@/components/app/kit";
import { actions } from "@/data/mock";

export const Route = createFileRoute("/_shell/actions")({
  head: () => ({
    meta: [
      { title: "Improvement Actions · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Track improvement actions created from parent feedback, with owners, target dates and outcomes.",
      },
      { property: "og:title", content: "Improvement Actions · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Own, schedule and close the loop on every improvement action.",
      },
    ],
  }),
  component: ActionsPage,
});

const COLUMNS = ["Open", "In Progress", "Completed", "Overdue"];

function ActionsPage() {
  const [view, setView] = useState("board");
  const open = actions.filter((a) => a.status === "Open" || a.status === "In Progress").length;
  const done = actions.filter((a) => a.status === "Completed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Improvement Actions"
        subtitle="Every action is linked to a parent-reported issue and measured after implementation"
        actions={
          <div className="flex rounded-lg border border-border bg-card p-0.5">
            {["board", "table"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${
                  view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />

      <Grid>
        <KpiCard label="Total actions" value={String(actions.length)} />
        <KpiCard label="In flight" value={String(open)} tone="warning" />
        <KpiCard label="Completed" value={String(done)} tone="success" delta={9} />
        <KpiCard
          label="Overdue"
          value={String(actions.filter((a) => a.status === "Overdue").length)}
          tone="danger"
        />
      </Grid>

      {view === "board" ? (
        <div className="grid gap-4 lg:grid-cols-4">
          {COLUMNS.map((col) => {
            const items = actions.filter((a) => a.status === col);
            return (
              <Panel key={col} title={col} description={`${items.length} action(s)`}>
                <ul className="space-y-3">
                  {items.map((a) => (
                    <li key={a.id} className="rounded-xl border border-border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug text-foreground">
                          {a.action}
                        </p>
                        <PriorityBadge priority={a.priority} />
                      </div>
                      <Link
                        to="/issues/$id"
                        params={{ id: a.issueId }}
                        className="mt-1.5 block text-xs font-medium text-primary hover:underline"
                      >
                        {a.issue}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.owner} · target {a.target}
                      </p>
                    </li>
                  ))}
                  {items.length === 0 ? (
                    <li className="text-xs text-muted-foreground">Nothing here.</li>
                  ) : null}
                </ul>
              </Panel>
            );
          })}
        </div>
      ) : (
        <Panel padded={false}>
          <DataTable
            head={
              <tr>
                <Th>Action</Th>
                <Th>Issue</Th>
                <Th>Owner</Th>
                <Th>Priority</Th>
                <Th>Target</Th>
                <Th>Status</Th>
                <Th>Outcome</Th>
              </tr>
            }
          >
            {actions.map((a) => (
              <tr key={a.id} className="transition-colors hover:bg-muted/50">
                <Td>
                  {a.action}
                  <span className="block text-xs text-muted-foreground">{a.id}</span>
                </Td>
                <Td>
                  <Link
                    to="/issues/$id"
                    params={{ id: a.issueId }}
                    className="text-primary hover:underline"
                  >
                    {a.issue}
                  </Link>
                </Td>
                <Td className="text-muted-foreground">{a.owner}</Td>
                <Td>
                  <PriorityBadge priority={a.priority} />
                </Td>
                <Td className="text-muted-foreground">{a.target}</Td>
                <Td>
                  <StatusBadge status={a.status} />
                </Td>
                <Td className="text-muted-foreground">{a.outcome}</Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      )}
    </div>
  );
}
