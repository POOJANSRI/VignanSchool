import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AiInsight,
  DataTable,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PriorityBadge,
  Progress,
  Rating,
  StatusBadge,
  Td,
  Th,
} from "@/components/app/kit";
import { TrendLine } from "@/components/app/charts";
import {
  facultyActionPoints,
  facultyImprovements,
  facultyList,
  facultyStrengths,
} from "@/data/mock";
import { useRole } from "@/components/app/role-context";

export const Route = createFileRoute("/_shell/faculty")({
  head: () => ({
    meta: [
      { title: "Faculty Feedback · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Faculty-level parent feedback with ratings, sentiment split, key concerns and personal action points.",
      },
      { property: "og:title", content: "Faculty Feedback · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Constructive, evidence-based feedback for every teacher.",
      },
    ],
  }),
  component: FacultyPage,
});

function FacultyPage() {
  const { roleId } = useRole();
  const isTeacher = roleId === "faculty";
  const [selectedId, setSelectedId] = useState(facultyList[0]?.id ?? null);
  const selected = facultyList.find((f) => f.id === selectedId) ?? null;
  const me = isTeacher ? (facultyList[0] ?? null) : selected;

  if (!me) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={isTeacher ? "My Parent Feedback" : "Faculty Feedback"}
          subtitle="No faculty data has been added yet."
        />
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          <p className="text-sm">No faculty records found in the database.</p>
          <p className="mt-1 text-xs">Add faculty data in Firebase to see feedback here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isTeacher ? "My Parent Feedback" : "Faculty Feedback"}
        subtitle={
          isTeacher
            ? "Your feedback is shown to you first, in a constructive and confidential format"
            : "Compare parent feedback across faculty and identify coaching needs"
        }
        actions={
          isTeacher ? null : (
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="h-9 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            >
              {facultyList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          )
        }
      />

      <Grid>
        <KpiCard
          label="My rating"
          value={`${me.rating}/5`}
          tone="success"
          delta={5}
          hint={me.subject}
        />
        <KpiCard
          label="Responses"
          value={String(me.responses)}
          hint={`${me.contacted} parents contacted`}
        />
        <KpiCard label="Positive feedback" value={`${me.positive}%`} tone="accent" />
        <KpiCard label="Open action points" value={String(me.openActions)} tone="warning" />
      </Grid>

      <AiInsight title="Constructive summary">
        Parents consistently appreciate {me.name}&rsquo;s subject clarity and approachability. The
        most frequently repeated improvement area is <strong>{me.keyConcern}</strong>. A short
        weekly update to parents and a brief doubt-clearing window are likely to address most of the
        mentions.
      </AiInsight>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Rating trend"
          description="Last three reporting periods"
          className="lg:col-span-2"
        >
          <TrendLine data={me.trend} dataKey="rating" domain={[3.2, 5]} />
        </Panel>

        <Panel title="What parents appreciate">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {facultyStrengths.map((s) => (
              <li key={s} className="rounded-lg bg-success/8 px-3 py-2 text-foreground/85">
                {s}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Improvement areas" description="Grouped by number of parent mentions">
          <ul className="space-y-3">
            {facultyImprovements.map((f) => (
              <li key={f.area}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{f.area}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{f.mentions} mentions</span>
                    <PriorityBadge priority={f.priority} />
                  </div>
                </div>
                <div className="mt-1.5">
                  <Progress value={(f.mentions / 10) * 100} tone="warning" />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="My action points" description="Agreed with the HOD / coordinator">
          <ul className="space-y-3">
            {facultyActionPoints.map((a) => (
              <li key={a.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{a.action}</p>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.reason}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">Target: {a.target}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {isTeacher ? null : (
        <Panel
          padded={false}
          title="All faculty"
          description="Ratings and sentiment split across the department"
        >
          <DataTable
            head={
              <tr>
                <Th>Faculty</Th>
                <Th>Subject</Th>
                <Th>Grades</Th>
                <Th>Rating</Th>
                <Th>Positive</Th>
                <Th>Negative</Th>
                <Th>Key concern</Th>
                <Th>Open actions</Th>
              </tr>
            }
          >
            {facultyList.map((f) => (
              <tr
                key={f.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => setSelectedId(f.id)}
              >
                <Td className="font-medium">{f.name}</Td>
                <Td className="text-muted-foreground">{f.subject}</Td>
                <Td className="text-muted-foreground">{f.grades}</Td>
                <Td>
                  <Rating value={f.rating} />
                </Td>
                <Td className="text-success">{f.positive}%</Td>
                <Td className="text-destructive">{f.negative}%</Td>
                <Td className="text-muted-foreground">{f.keyConcern}</Td>
                <Td>{f.openActions}</Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      )}
    </div>
  );
}
