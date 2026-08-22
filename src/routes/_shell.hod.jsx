import { createFileRoute } from "@tanstack/react-router";
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
  TrendBadge,
} from "@/components/app/kit";
import { HorizontalBars } from "@/components/app/charts";
import { classAnalytics, facultyList, topConcerns } from "@/data/mock";

export const Route = createFileRoute("/_shell/hod")({
  head: () => ({
    meta: [
      { title: "HOD & Coordinator View · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Department-level parent feedback: faculty comparison, class coverage and coaching priorities.",
      },
      { property: "og:title", content: "HOD & Coordinator View · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Department oversight of parent feedback and faculty support.",
      },
    ],
  }),
  component: HodPage,
});

function HodPage() {
  if (!facultyList || facultyList.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="HOD / Coordinator View" subtitle="Department feedback health, faculty support needs and class-level coverage" />
        <Panel title="No Data">
          <p className="py-8 text-center text-sm text-muted-foreground">No faculty data available in Firebase.</p>
        </Panel>
      </div>
    );
  }

  const avg = (facultyList.reduce((a, f) => a + f.rating, 0) / facultyList.length).toFixed(1);
  const needsSupport = facultyList.filter((f) => f.rating < 4).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="HOD / Coordinator View"
        subtitle="Department feedback health, faculty support needs and class-level coverage"
      />

      <Grid>
        <KpiCard label="Department rating" value={`${avg}/5`} tone="success" delta={3} />
        <KpiCard label="Faculty in department" value={String(facultyList.length)} />
        <KpiCard label="Need coaching support" value={String(needsSupport)} tone="warning" />
        <KpiCard
          label="Open action points"
          value={String(facultyList.reduce((a, f) => a + f.openActions, 0))}
          tone="accent"
        />
      </Grid>

      <AiInsight title="Department insight">
        Parent satisfaction across the department is stable at {avg}/5. {needsSupport} faculty
        members are below the 4.0 threshold, driven mainly by parent communication and individual
        attention. Peer-observation pairing with the two highest-rated teachers is the recommended
        next step.
      </AiInsight>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Top concerns in department" description="Mentions this period">
          <HorizontalBars data={topConcerns.slice(0, 6)} />
        </Panel>

        <Panel title="Class coverage" description="Responses versus parents contacted">
          <ul className="space-y-2.5">
            {classAnalytics.slice(0, 7).map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
              >
                <span className="text-sm font-medium text-foreground">{c.label}</span>
                <span className="text-xs text-muted-foreground">
                  {c.responses}/{c.contacted} responses · {c.satisfaction}/5
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel padded={false} title="Faculty comparison" description="Sorted by parent rating">
        <DataTable
          head={
            <tr>
              <Th>Faculty</Th>
              <Th>Subject</Th>
              <Th>Rating</Th>
              <Th>Responses</Th>
              <Th>Positive</Th>
              <Th>Key concern</Th>
              <Th>Trend</Th>
            </tr>
          }
        >
          {[...facultyList]
            .sort((a, b) => b.rating - a.rating)
            .map((f) => {
              const first = f.trend[0].rating;
              const last = f.trend[f.trend.length - 1].rating;
              return (
                <tr key={f.id} className="transition-colors hover:bg-muted/50">
                  <Td className="font-medium">{f.name}</Td>
                  <Td className="text-muted-foreground">{f.subject}</Td>
                  <Td>
                    <Rating value={f.rating} />
                  </Td>
                  <Td className="text-muted-foreground">{f.responses}</Td>
                  <Td className="text-success">{f.positive}%</Td>
                  <Td className="text-muted-foreground">{f.keyConcern}</Td>
                  <Td>
                    <TrendBadge trend={last >= first ? "Improving" : "Declining"} />
                  </Td>
                </tr>
              );
            })}
        </DataTable>
      </Panel>
    </div>
  );
}
