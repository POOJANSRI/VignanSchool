import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { PageHeader, Panel, PrivacyNote } from "@/components/app/kit";
import { askAssistant, suggestedPrompts } from "@/data/mock";

export const Route = createFileRoute("/_shell/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Ask questions about parent feedback and get grounded answers with evidence, metrics and source links.",
      },
      { property: "og:title", content: "AI Assistant · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Answers grounded strictly in authorised parent feedback data.",
      },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState([]);

  const ask = (q) => {
    const question = q.trim();
    if (!question) return;
    setTurns((t) => [...t, { question, answer: askAssistant(question) }]);
    setInput("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        subtitle="Ask anything about parent feedback — every answer cites the data it used"
      />

      <Panel title="Suggested questions" description="Tap to ask">
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => ask(p)}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {p}
            </button>
          ))}
        </div>
      </Panel>

      <div className="space-y-4">
        {turns.map((t, i) => (
          <div key={i} className="space-y-3">
            <p className="ml-auto w-fit max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
              {t.question}
            </p>
            <Panel>
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Sparkles className="size-4" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t.answer.period} · {t.answer.filters}
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{t.answer.answer}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {t.answer.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-border bg-muted/40 px-3 py-2"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {m.label}
                    </p>
                    <p className="text-lg font-semibold text-foreground">{m.value}</p>
                  </div>
                ))}
              </div>

              <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Evidence
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {t.answer.evidence.map((e) => (
                  <li key={e}>• {e}</li>
                ))}
              </ul>

              {t.answer.links.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {t.answer.links.map((l) => (
                    <Link
                      key={l.to + l.label}
                      to={l.to}
                      className="rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </Panel>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="sticky bottom-4 flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-card)]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about concerns, classes, faculty or interventions…"
          className="h-10 flex-1 rounded-xl bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
        />

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Send className="size-4" /> Ask
        </button>
      </form>

      <PrivacyNote>
        The assistant answers only from authorised, aggregated parent feedback for your role. It
        never invents numbers and never reveals parent contact details.
      </PrivacyNote>
    </div>
  );
}
