import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, Plus, Search, Upload, X } from "lucide-react";
import {
  DataTable,

  EmptyState,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PrivacyNote,
  StatusBadge,
  Td,
  Th,
} from "@/components/app/kit";
import { students } from "@/data/mock";
import { useKpis } from "@/hooks/use-kpis";
import { useRole } from "@/components/app/role-context";

export const Route = createFileRoute("/_shell/parents")({
  head: () => ({
    meta: [
      { title: "Parents & Students · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Searchable parent and student database with grade, section, language and call-status filters, import/export and privacy controls.",
      },
      { property: "og:title", content: "Parents & Students · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Manage the parent contact base powering feedback campaigns.",
      },
    ],
  }),
  component: ParentsPage,
});

const GRADES = ["All", ...Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`)];
const SECTIONS = ["All", "A", "B", "C"];
const LANGS = ["All", "Telugu", "English", "Hindi"];
const CALL = ["All", "Completed", "Pending", "Callback", "No Answer", "Failed"];
const FEEDBACK = ["All", "Collected", "Awaited", "Declined"];

function ParentsPage() {
  const schoolKpis = useKpis();
  const { role } = useRole();
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("All");
  const [section, setSection] = useState("All");
  const [lang, setLang] = useState("All");
  const [call, setCall] = useState("All");
  const [fb, setFb] = useState("All");
  const [selected, setSelected] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  const rows = useMemo(
    () =>
      students.filter(
        (s) =>
          (grade === "All" || s.grade === grade) &&
          (section === "All" || s.section === section) &&
          (lang === "All" || s.language === lang) &&
          (call === "All" || s.callStatus === call) &&
          (fb === "All" || s.feedbackStatus === fb) &&
          (q === "" ||
            s.name.toLowerCase().includes(q.toLowerCase()) ||
            s.id.toLowerCase().includes(q.toLowerCase()) ||
            s.faculty.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, grade, section, lang, call, fb],
  );

  return (
    <>
      <PageHeader
        title="Parents & Students"
        subtitle="Single source of truth for the parent contact base used by calling campaigns."
        actions={
          <>

            <button
              onClick={() => setImportOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <Upload className="size-3.5" /> Import Excel/CSV
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted">
              <FileSpreadsheet className="size-3.5" /> Download template
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted">
              <Download className="size-3.5" /> Export
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110">
              <Plus className="size-3.5" /> Add student
            </button>
          </>
        }
      />

      <Grid cols={4}>
        <KpiCard label="Students on record" value={schoolKpis.loading ? "..." : String(schoolKpis.studentsOnRecord || "0")} />
        <KpiCard label="Parents contacted" value={schoolKpis.loading ? "..." : String(schoolKpis.parentsContacted || "0")} tone="accent" />
        <KpiCard label="Feedback collected" value={schoolKpis.loading ? "..." : String(schoolKpis.responses || "0")} tone="success" />
        <KpiCard label="Awaiting response" value={schoolKpis.loading ? "..." : String(schoolKpis.awaitingResponse || "0")} tone="warning" />
      </Grid>

      {!role.canSeeParentContacts ? (
        <PrivacyNote>
          Parent phone numbers and personal contact details are hidden for your role. You can see
          aggregated status only.
        </PrivacyNote>
      ) : (
        <PrivacyNote>
          Parent contact details are visible to your role. Every view or export of contact data is
          written to the audit log.
        </PrivacyNote>
      )}

      <Panel
        title="Directory"
        description={`${rows.length} record${rows.length === 1 ? "" : "s"} match your filters`}
        padded={false}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, ID, faculty"
                className="h-9 w-52 rounded-lg border border-border bg-background pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-ring/40"
              />
            </label>
            {[
              { v: grade, s: setGrade, o: GRADES },
              { v: section, s: setSection, o: SECTIONS },
              { v: lang, s: setLang, o: LANGS },
              { v: call, s: setCall, o: CALL },
              { v: fb, s: setFb, o: FEEDBACK },
            ].map((f, i) => (
              <select
                key={i}
                value={f.v}
                onChange={(e) => f.s(e.target.value)}
                className="h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring/40"
              >
                {f.o.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ))}
          </div>
        }
      >
        {rows.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Search}
              title="No matching students"
              description="No records match this combination of search text and filters. Clear a filter and try again."
              action={
                <button
                  onClick={() => {
                    setQ("");
                    setGrade("All");
                    setSection("All");
                    setLang("All");
                    setCall("All");
                    setFb("All");
                  }}
                  className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Reset filters
                </button>
              }
            />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
              Bulk actions:
              <button className="rounded-lg border border-border bg-card px-2 py-1 font-medium text-foreground hover:bg-muted">
                Add to campaign
              </button>
              <button className="rounded-lg border border-border bg-card px-2 py-1 font-medium text-foreground hover:bg-muted">
                Set language
              </button>
              <button className="rounded-lg border border-border bg-card px-2 py-1 font-medium text-foreground hover:bg-muted">
                Schedule callback
              </button>
            </div>
            <DataTable
              head={
                <tr>
                  <Th>Student ID</Th>
                  <Th>Student</Th>
                  <Th>Grade</Th>
                  <Th>Section</Th>
                  <Th>Parent</Th>
                  <Th>Relationship</Th>
                  <Th>Language</Th>
                  <Th>Faculty</Th>
                  <Th>Call status</Th>
                  <Th>Feedback</Th>
                  <Th>Last call</Th>
                  <Th>Actions</Th>
                </tr>
              }
            >
              {rows.slice(0, 40).map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-muted/40">
                  <Td className="font-mono text-xs text-muted-foreground">{s.id}</Td>
                  <Td className="font-medium">{s.name}</Td>
                  <Td className="text-muted-foreground">{s.grade}</Td>
                  <Td className="text-muted-foreground">{s.section}</Td>
                  <Td>{role.canSeeParentContacts ? s.parent : "Hidden by policy"}</Td>
                  <Td className="text-muted-foreground">{s.relationship}</Td>
                  <Td className="text-muted-foreground">{s.language}</Td>
                  <Td className="text-muted-foreground">{s.faculty}</Td>
                  <Td>
                    <StatusBadge status={s.callStatus} />
                  </Td>
                  <Td>
                    <StatusBadge status={s.feedbackStatus} />
                  </Td>
                  <Td className="text-muted-foreground">{s.lastCall}</Td>
                  <Td>
                    <button
                      onClick={() => setSelected(s)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View
                    </button>
                  </Td>
                </tr>
              ))}
            </DataTable>
            {rows.length > 40 ? (
              <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                Showing 40 of {rows.length} records · refine filters to narrow the list
              </p>
            ) : null}
          </>
        )}
      </Panel>

      {selected ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40 backdrop-blur-sm">
          <button className="flex-1" aria-label="Close drawer" onClick={() => setSelected(null)} />
          <aside className="h-full w-full max-w-md overflow-y-auto bg-card shadow-[var(--shadow-pop)]">
            <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">{selected.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {selected.id} · {selected.grade}-{selected.section}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </header>
            <div className="space-y-5 p-5">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <Detail label="Class teacher" value={selected.faculty} />
                <Detail label="Preferred language" value={selected.language} />
                <Detail label="Relationship" value={selected.relationship} />
                <Detail
                  label="Parent"
                  value={role.canSeeParentContacts ? selected.parent : "Hidden by role policy"}
                />
              </div>
              <PrivacyNote>
                Contact numbers are never displayed in this drawer. Calling is performed by the
                platform without exposing numbers to staff.
              </PrivacyNote>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Call history
                </h3>
                <ul className="mt-2 space-y-2">
                  {[
                    "21 Aug 2026 · Completed · Positive",
                    "18 Jul 2026 · Completed · Neutral",
                    "22 Jun 2026 · No answer",
                  ].map((h) => (
                    <li
                      key={h}
                      className="rounded-xl border border-border px-3 py-2 text-sm text-foreground/85"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Feedback themes
                </h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {["Academic support", "Communication", "Transport"].map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-foreground/85"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {importOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-[var(--shadow-pop)]">
            <h2 className="text-base font-semibold text-foreground">Import students & parents</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload an Excel or CSV file using the school template. Records are validated before
              import.
            </p>
            <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-10 text-center">
              <Upload className="mx-auto size-6 text-muted-foreground" />
              <p className="mt-2 text-sm text-foreground">Drop your file here or click to browse</p>
              <p className="text-xs text-muted-foreground">.xlsx or .csv · max 5 MB</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setImportOpen(false)}
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => setImportOpen(false)}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                Validate & import
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium text-foreground">{value}</p>
    </div>
  );
}
