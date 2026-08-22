import { createFileRoute } from "@tanstack/react-router";
import {
  DataTable,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PriorityBadge,
  PrivacyNote,
  StatusBadge,
  Td,
  Th,
  WarningNote,
} from "@/components/app/kit";
import { escalations } from "@/data/mock";

export const Route = createFileRoute("/_shell/escalations")({
  head: () => ({
    meta: [
      { title: "Escalations · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Safety and high-severity parent concerns routed for immediate authorised human follow-up.",
      },
      { property: "og:title", content: "Escalations · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Critical parent concerns that must never be handled by AI alone.",
      },
    ],
  }),
  component: EscalationsPage,
});

function EscalationsPage() {
  if (!escalations || escalations.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Escalations" subtitle="Safety, welfare and high-severity concerns requiring a human owner" />
        <Panel title="No Escalations">
          <p className="py-8 text-center text-sm text-muted-foreground">There are no open escalations at this time.</p>
        </Panel>
      </div>
    );
  }

  const critical = escalations.filter((e) => e.priority === "critical").length;
  const unassigned = escalations.filter((e) => e.assigned === "Unassigned").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Escalations"
        subtitle="Safety, welfare and high-severity concerns requiring a human owner"
      />

      <Grid cols={3}>
        <KpiCard label="Open escalations" value={String(escalations.length)} tone="warning" />
        <KpiCard label="Critical" value={String(critical)} tone="danger" />
        <KpiCard label="Unassigned" value={String(unassigned)} tone="accent" />
      </Grid>

      <WarningNote>
        Escalated conversations are never closed automatically. A named staff member must record the
        follow-up outcome before an escalation can be resolved.
      </WarningNote>

      <div className="space-y-4">
        {escalations.map((e) => (
          <Panel key={e.id} title={`${e.id} · ${e.category}`} description={`Raised ${e.created}`}>
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={e.priority} />
              <StatusBadge status={e.status} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{e.summary}</p>
            <dl className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
              <div>
                <dt className="font-semibold uppercase tracking-wide">Student</dt>
                <dd>{e.studentRef}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-wide">Parent</dt>
                <dd>{e.parentRef}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-wide">Assigned to</dt>
                <dd>{e.assigned}</dd>
              </div>
            </dl>
          </Panel>
        ))}
      </div>

      <Panel padded={false} title="Escalation log">
        <DataTable
          head={
            <tr>
              <Th>ID</Th>
              <Th>Category</Th>
              <Th>Priority</Th>
              <Th>Assigned</Th>
              <Th>Status</Th>
              <Th>Created</Th>
            </tr>
          }
        >
          {escalations.map((e) => (
            <tr key={e.id} className="transition-colors hover:bg-muted/50">
              <Td className="font-medium text-primary">{e.id}</Td>
              <Td className="text-muted-foreground">{e.category}</Td>
              <Td>
                <PriorityBadge priority={e.priority} />
              </Td>
              <Td className="text-muted-foreground">{e.assigned}</Td>
              <Td>
                <StatusBadge status={e.status} />
              </Td>
              <Td className="text-muted-foreground">{e.created}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <PrivacyNote>
        Parent contact details are hidden by role policy and revealed only to authorised staff.
      </PrivacyNote>
    </div>
  );
}
