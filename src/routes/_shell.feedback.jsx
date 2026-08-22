import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import {
  DataTable,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PrivacyNote,
  Rating,
  SentimentBadge,
  PriorityBadge,
  Td,
  Th,
  EmptyState,
} from "@/components/app/kit";
import { feedbackItems } from "@/data/mock";

export const Route = createFileRoute("/_shell/feedback")({
  validateSearch: (search) => ({
    sentiment: typeof search["sentiment"] === "string" ? search["sentiment"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Feedback Explorer · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Explore AI-summarised parent feedback with sentiment, priority, categories, transcripts and suggested actions.",
      },
      { property: "og:title", content: "Feedback Explorer · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Search and analyse every parent feedback conversation.",
      },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const { sentiment } = Route.useSearch();
  const [q, setQ] = useState("");
  const [sent, setSent] = useState(sentiment ?? "all");
  const [selected, setSelected] = useState(null);

  const rows = useMemo(
    () =>
      feedbackItems.filter(
        (f) =>
          (sent === "all" || f.sentiment === sent) &&
          (q === "" ||
            [f.student, f.faculty, f.subject, f.id]
              .join(" ")
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [q, sent],
  );

  const avg = (feedbackItems.reduce((a, f) => a + f.rating, 0) / feedbackItems.length).toFixed(1);
  const negative = feedbackItems.filter((f) => f.sentiment === "negative").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feedback Explorer"
        subtitle="AI-summarised parent conversations with sentiment, themes and recommended actions"
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted">
            <Download className="size-3.5" /> Export CSV
          </button>
        }
      />

      <Grid>
        <KpiCard
          label="Feedback collected"
          value={String(feedbackItems.length)}
          hint="This period"
        />
        <KpiCard label="Average rating" value={`${avg}/5`} tone="success" delta={4} />
        <KpiCard
          label="Negative feedback"
          value={String(negative)}
          tone="danger"
          hint="Requires action"
        />
        <KpiCard
          label="Consent given"
          value={`${feedbackItems.filter((f) => f.consent === "Given").length}`}
          tone="accent"
        />
      </Grid>

      <Panel padded={false}>
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <label className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search student, faculty, subject or ID…"
              className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </label>
          <select
            value={sent}
            onChange={(e) => setSent(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          >
            {["all", "positive", "neutral", "negative", "mixed"].map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All sentiment" : s}
              </option>
            ))}
          </select>
        </div>

        {rows.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No feedback matches your filters"
              description="Try clearing the search or sentiment filter."
            />
          </div>
        ) : (
          <DataTable
            head={
              <tr>
                <Th>ID</Th>
                <Th>Student</Th>
                <Th>Faculty / Subject</Th>
                <Th>Sentiment</Th>
                <Th>Rating</Th>
                <Th>Priority</Th>
                <Th>Date</Th>
              </tr>
            }
          >
            {rows.map((f) => (
              <tr
                key={f.id}
                onClick={() => setSelected(f)}
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                <Td className="font-medium text-primary">{f.id}</Td>
                <Td>
                  {f.student}
                  <span className="block text-xs text-muted-foreground">
                    {f.grade}-{f.section}
                  </span>
                </Td>
                <Td>
                  {f.faculty}
                  <span className="block text-xs text-muted-foreground">{f.subject}</span>
                </Td>
                <Td>
                  <SentimentBadge sentiment={f.sentiment} />
                </Td>
                <Td>
                  <Rating value={f.rating} />
                </Td>
                <Td>
                  <PriorityBadge priority={f.priority} />
                </Td>
                <Td className="text-muted-foreground">{f.date}</Td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>

      <PrivacyNote>
        Recordings and contact details are shown only to authorised roles. Every playback and export
        is written to the audit log.
      </PrivacyNote>

      {selected ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40 backdrop-blur-sm">
          <button aria-label="Close" className="flex-1" onClick={() => setSelected(null)} />
          <aside className="h-full w-full max-w-xl overflow-y-auto bg-card p-6 shadow-[var(--shadow-pop)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selected.student}</h2>
                <p className="text-xs text-muted-foreground">
                  {selected.id} · {selected.grade}-{selected.section} · {selected.faculty} ·{" "}
                  {selected.date} · {selected.duration}
                </p>
              </div>
              <SentimentBadge sentiment={selected.sentiment} />
            </div>

            <p className="mt-4 rounded-xl bg-muted/50 p-4 text-sm text-foreground/85">
              {selected.summary}
            </p>

            <h3 className="mt-5 text-sm font-semibold text-foreground">What parents appreciated</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {selected.positives.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>

            <h3 className="mt-5 text-sm font-semibold text-foreground">Concerns raised</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {selected.issues.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>

            <h3 className="mt-5 text-sm font-semibold text-foreground">Suggested action</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{selected.suggestedAction}</p>

            <h3 className="mt-5 text-sm font-semibold text-foreground">Transcript</h3>
            <div className="mt-2 space-y-2">
              {selected.transcript.map((t, i) => (
                <div
                  key={i}
                  className={
                    t.speaker === "Parent"
                      ? "rounded-xl bg-accent/10 px-3 py-2 text-sm text-foreground/85"
                      : "rounded-xl bg-muted px-3 py-2 text-sm text-foreground/85"
                  }
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.speaker}
                  </span>
                  {t.text}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              Close
            </button>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
