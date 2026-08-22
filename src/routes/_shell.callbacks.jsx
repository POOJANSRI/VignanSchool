import { createFileRoute } from "@tanstack/react-router";
import {
  DataTable,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PrivacyNote,
  StatusBadge,
  Td,
  Th,
} from "@/components/app/kit";
import { callbacks } from "@/data/mock";

export const Route = createFileRoute("/_shell/callbacks")({
  head: () => ({
    meta: [
      { title: "Callback Queue · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Parents who requested a callback, with preferred time slots, reasons, attempts and assigned coordinator.",
      },
      { property: "og:title", content: "Callback Queue · VIGNAN PARENT VOICE AI" },
      { property: "og:description", content: "Never lose a parent who asked to be called back." },
    ],
  }),
  component: CallbacksPage,
});

function CallbacksPage() {
  if (!callbacks || callbacks.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Callback Queue" subtitle="Parents who asked to be contacted at a different time" />
        <Panel title="No Callbacks">
          <p className="py-8 text-center text-sm text-muted-foreground">No callbacks are currently in the queue.</p>
        </Panel>
      </div>
    );
  }

  const pending = callbacks.filter((c) => c.status === "Pending").length;
  const scheduled = callbacks.filter((c) => c.status === "Scheduled").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Callback Queue"
        subtitle="Parents who asked to be contacted at a different time"
      />

      <Grid>
        <KpiCard label="Callbacks requested" value={String(callbacks.length)} />
        <KpiCard label="Pending" value={String(pending)} tone="warning" />
        <KpiCard label="Scheduled" value={String(scheduled)} tone="accent" />
        <KpiCard
          label="Completed"
          value={String(callbacks.filter((c) => c.status === "Completed").length)}
          tone="success"
        />
      </Grid>

      <Panel padded={false} title="Queue" description="Ordered by preferred slot">
        <DataTable
          head={
            <tr>
              <Th>ID</Th>
              <Th>Student</Th>
              <Th>Preferred slot</Th>
              <Th>Reason</Th>
              <Th>Attempts</Th>
              <Th>Coordinator</Th>
              <Th>Status</Th>
            </tr>
          }
        >
          {callbacks.map((c) => (
            <tr key={c.id} className="transition-colors hover:bg-muted/50">
              <Td className="font-medium text-primary">{c.id}</Td>
              <Td>
                {c.student}
                <span className="block text-xs text-muted-foreground">
                  {c.grade} · {c.parentRef}
                </span>
              </Td>
              <Td className="text-muted-foreground">{c.preferred}</Td>
              <Td className="text-muted-foreground">{c.reason}</Td>
              <Td>{c.attempts}</Td>
              <Td className="text-muted-foreground">{c.coordinator}</Td>
              <Td>
                <StatusBadge status={c.status} />
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <PrivacyNote>
        Parent phone numbers are masked in this view. Coordinators dial through the platform so
        every attempt is logged.
      </PrivacyNote>
    </div>
  );
}
