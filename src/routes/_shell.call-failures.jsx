import { createFileRoute } from "@tanstack/react-router";
import {
  AiInsight,
  DataTable,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  Progress,
  Td,
  Th,
} from "@/components/app/kit";
import { HorizontalBars } from "@/components/app/charts";
import { callFailures } from "@/data/mock";

export const Route = createFileRoute("/_shell/call-failures")({
  head: () => ({
    meta: [
      { title: "Call Failure Analysis · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Understand why calls did not connect — no answer, busy, invalid numbers — and how retries performed.",
      },
      { property: "og:title", content: "Call Failure Analysis · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Fix reachability to raise the parent response rate.",
      },
    ],
  }),
  component: CallFailuresPage,
});

function CallFailuresPage() {
  if (!callFailures || callFailures.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Call Failure Analysis" subtitle="Why calls did not result in collected feedback" />
        <Panel title="No Failures Logged">
          <p className="py-8 text-center text-sm text-muted-foreground">No call failures have been recorded yet.</p>
        </Panel>
      </div>
    );
  }

  const total = callFailures.reduce((a, f) => a + f.count, 0);
  const top = [...callFailures].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Call Failure Analysis"
        subtitle="Why calls did not result in collected feedback"
      />

      <Grid>
        <KpiCard label="Unsuccessful attempts" value={String(total)} tone="warning" />
        <KpiCard
          label="Largest reason"
          value={top.reason}
          hint={`${top.count} attempts`}
          tone="danger"
        />
        <KpiCard
          label="Average retries"
          value={(callFailures.reduce((a, f) => a + f.retry, 0) / callFailures.length).toFixed(1)}
        />

        <KpiCard
          label="Invalid numbers"
          value={String(callFailures.find((f) => f.reason === "Invalid Number")?.count ?? 0)}
          hint="Needs data cleanup"
          tone="accent"
        />
      </Grid>

      <Panel title="Failure reasons" description="Attempts by reason">
        <HorizontalBars
          data={callFailures.map((f) => ({ name: f.reason, mentions: f.count }))}
          color="var(--color-destructive)"
        />
      </Panel>

      <AiInsight title="Reachability recommendation">
        {top.reason} accounts for {Math.round((top.count / total) * 100)}% of unsuccessful attempts.
        Shifting the calling window to 6:30–8:30 PM and cleaning the{" "}
        {callFailures.find((f) => f.reason === "Invalid Number")?.count ?? 0} invalid numbers should
        recover a meaningful share of these parents.
      </AiInsight>

      <Panel padded={false} title="Detail">
        <DataTable
          head={
            <tr>
              <Th>Reason</Th>
              <Th>Attempts</Th>
              <Th>Share</Th>
              <Th>Average retries</Th>
            </tr>
          }
        >
          {callFailures.map((f) => (
            <tr key={f.reason} className="transition-colors hover:bg-muted/50">
              <Td className="font-medium">{f.reason}</Td>
              <Td>{f.count}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <span className="w-10 text-xs text-muted-foreground">
                    {Math.round((f.count / total) * 100)}%
                  </span>
                  <div className="w-28">
                    <Progress value={(f.count / total) * 100} tone="danger" />
                  </div>
                </div>
              </Td>
              <Td className="text-muted-foreground">{f.retry}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </div>
  );
}
