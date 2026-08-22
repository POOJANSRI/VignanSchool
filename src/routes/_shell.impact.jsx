import { createFileRoute } from "@tanstack/react-router";
import { AiInsight, Grid, KpiCard, PageHeader, Panel, WarningNote } from "@/components/app/kit";
import { VerticalBars } from "@/components/app/charts";
import { interventions } from "@/data/mock";

export const Route = createFileRoute("/_shell/impact")({
  head: () => ({
    meta: [
      { title: "Before & After Impact · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Measure parent-reported change before and after each improvement action taken by the school.",
      },
      { property: "og:title", content: "Before & After Impact · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Close the loop: measure whether interventions actually worked.",
      },
    ],
  }),
  component: ImpactPage,
});

function ImpactPage() {
  if (!interventions || interventions.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Before & After Impact" subtitle="Did the actions we took actually reduce what parents were complaining about?" />
        <Panel title="No Interventions">
          <p className="py-8 text-center text-sm text-muted-foreground">No interventions recorded in Firebase.</p>
        </Panel>
      </div>
    );
  }

  const improved = interventions.filter((i) => i.change < 0).length;
  const avg = Math.round(interventions.reduce((a, i) => a + i.change, 0) / interventions.length);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Before & After Impact"
        subtitle="Did the actions we took actually reduce what parents were complaining about?"
      />

      <Grid cols={3}>
        <KpiCard label="Interventions measured" value={String(interventions.length)} />
        <KpiCard
          label="Showing improvement"
          value={`${improved}/${interventions.length}`}
          tone="success"
        />
        <KpiCard label="Average change in mentions" value={`${avg}%`} tone="accent" delta={avg} />
      </Grid>

      <WarningNote>
        These are observed changes over time, measured from parent feedback volume. They indicate
        correlation, not proof of causation — other factors such as term workload may also
        contribute.
      </WarningNote>

      <div className="grid gap-4 lg:grid-cols-2">
        {interventions.map((i) => (
          <Panel key={i.id} title={i.title} description={i.action}>
            <VerticalBars data={i.series} dataKey="value" />
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2">
              <span className="text-xs text-muted-foreground">Change in mentions</span>
              <span
                className={`text-sm font-semibold ${i.change < 0 ? "text-success" : "text-destructive"}`}
              >
                {i.change}%
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{i.insight}</p>
          </Panel>
        ))}
      </div>

      <AiInsight title="Improvement loop summary">
        {improved} of {interventions.length} measured interventions show a reduction in
        parent-reported mentions. The transport route re-sequencing produced the strongest change;
        examination communication needs another period of measurement before conclusions can be
        drawn.
      </AiInsight>
    </div>
  );
}
