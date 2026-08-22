import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AiInsight,
  DataTable,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  Rating,
  Td,
  Th,
} from "@/components/app/kit";
import { VerticalBars } from "@/components/app/charts";
import { classAnalytics } from "@/data/mock";

export const Route = createFileRoute("/_shell/classes")({
  head: () => ({
    meta: [
      { title: "Class Analytics · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Grade and section level parent satisfaction, response coverage and the top concerns per class.",
      },
      { property: "og:title", content: "Class Analytics · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Spot the classes that need attention before the term ends.",
      },
    ],
  }),
  component: ClassesPage,
});

function ClassesPage() {
  const [selected, setSelected] = useState(classAnalytics[0]?.id);
  const cls = classAnalytics.find((c) => c.id === selected) ?? classAnalytics[0];
  const lowest = [...classAnalytics].sort((a, b) => a.satisfaction - b.satisfaction)[0];

  if (!classAnalytics || classAnalytics.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Class Analytics" subtitle="Feedback health for every grade and section" />
        <Panel title="No Class Data">
          <p className="py-8 text-center text-sm text-muted-foreground">
            No class analytics recorded yet. Add data in Firebase to see results here.
          </p>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Class Analytics" subtitle="Feedback health for every grade and section" />

      <Grid>
        <KpiCard label="Classes covered" value={String(classAnalytics.length)} />
        <KpiCard
          label="Average satisfaction"
          value={`${(classAnalytics.reduce((a, c) => a + c.satisfaction, 0) / classAnalytics.length).toFixed(1)}/5`}
          tone="success"
        />

        <KpiCard
          label="Needs attention"
          value={lowest.label}
          tone="danger"
          hint={`${lowest.satisfaction}/5`}
        />
        <KpiCard
          label="Total responses"
          value={String(classAnalytics.reduce((a, c) => a + c.responses, 0))}
          tone="accent"
        />
      </Grid>

      <AiInsight title="Class insight">
        {lowest.label} has the lowest satisfaction at {lowest.satisfaction}/5, with{" "}
        {lowest.negative}% negative feedback concentrated around {lowest.concerns[0]}. A targeted
        parent meeting and a remedial plan for this section are recommended this week.
      </AiInsight>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Satisfaction by class" description="Out of 5" className="lg:col-span-2">
          <VerticalBars
            data={classAnalytics.map((c) => ({ period: c.id, value: c.satisfaction }))}
            dataKey="value"
          />
        </Panel>

        <Panel
          title={`${cls.label} detail`}
          description="Select a row in the table to change class"
        >
          <dl className="space-y-2.5 text-sm">
            {[
              ["Parents contacted", String(cls.contacted)],
              ["Responses", String(cls.responses)],
              ["Satisfaction", `${cls.satisfaction}/5`],
              ["Positive", `${cls.positive}%`],
              ["Neutral", `${cls.neutral}%`],
              ["Negative", `${cls.negative}%`],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between gap-3 border-b border-border pb-2"
              >
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Top concerns: {cls.concerns.filter(Boolean).join(", ")}
          </p>
        </Panel>
      </div>

      <Panel padded={false} title="All classes">
        <DataTable
          head={
            <tr>
              <Th>Class</Th>
              <Th>Contacted</Th>
              <Th>Responses</Th>
              <Th>Satisfaction</Th>
              <Th>Positive</Th>
              <Th>Negative</Th>
              <Th>Top concern</Th>
            </tr>
          }
        >
          {classAnalytics.map((c) => (
            <tr
              key={c.id}
              onClick={() => setSelected(c.id)}
              className="cursor-pointer transition-colors hover:bg-muted/50"
            >
              <Td className="font-medium">{c.label}</Td>
              <Td className="text-muted-foreground">{c.contacted}</Td>
              <Td className="text-muted-foreground">{c.responses}</Td>
              <Td>
                <Rating value={c.satisfaction} />
              </Td>
              <Td className="text-success">{c.positive}%</Td>
              <Td className="text-destructive">{c.negative}%</Td>
              <Td className="text-muted-foreground">{c.concerns[0]}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </div>
  );
}
