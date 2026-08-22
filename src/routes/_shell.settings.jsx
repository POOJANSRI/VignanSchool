import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { ROLES, auditLog } from "@/data/mock";
import { useKpis } from "@/hooks/use-kpis";
import { useRole } from "@/components/app/role-context";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Governance · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Manage roles and permissions, consent and retention policy, call windows, languages and audit logging.",
      },
      { property: "og:title", content: "Settings & Governance · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Privacy, consent and access governance for parent feedback.",
      },
    ],
  }),
  component: SettingsPage,
});

const TABS = ["Profile", "Roles & Access", "Privacy & Consent", "Calling", "Audit Log"];

function SettingsPage() {
  const schoolKpis = useKpis();
  const { role, userName } = useRole();
  const [tab, setTab] = useState("Profile");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Governance"
        subtitle="Access control, consent policy and audit trail"
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Profile" ? (
        <Panel title="My profile" description="Demo profile linked to the selected role">
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              ["Name", userName],
              ["Role", role.label],
              ["School", "Vignan School, Kondapur, Hyderabad"],
              ["Preferred language", "English"],
              ["Alert channel", "In-app + Email"],
              ["Last sign-in", "22 Aug 2026, 08:04"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      ) : null}

      {tab === "Roles & Access" ? (
        <Panel
          padded={false}
          title="Roles & permissions"
          description="Data visibility is enforced per role"
        >
          <DataTable
            head={
              <tr>
                <Th>Role</Th>
                <Th>Description</Th>
                <Th>Sections accessible</Th>
              </tr>
            }
          >
            {ROLES.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-muted/50">
                <Td className="font-medium">{r.label}</Td>
                <Td className="text-muted-foreground">{r.description}</Td>
                <Td className="text-muted-foreground">
                  {r.nav.includes("*") ? "All sections" : r.nav.length}
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      ) : null}

      {tab === "Privacy & Consent" ? (
        <div className="space-y-4">
          <Grid cols={3}>
            <KpiCard label="Consent captured" value={schoolKpis.loading ? "..." : String(schoolKpis.consentCaptured || "0")} tone="success" />
            <KpiCard label="Recording retention" value={schoolKpis.loading ? "..." : String(schoolKpis.recordingRetention || "0")} tone="accent" />
            <KpiCard label="Opt-outs honoured" value={schoolKpis.loading ? "..." : String(schoolKpis.optOutsHonoured || "0")} tone="warning" />
          </Grid>
          <Panel title="Consent & retention policy">
            <ul className="space-y-2.5 text-sm text-foreground/85">
              <li>
                • Every call opens with a recording and purpose disclosure before any question is
                asked.
              </li>
              <li>
                • Parents who decline recording still have their feedback captured as text only.
              </li>
              <li>
                • Recordings are deleted automatically after 90 days; summaries are retained for
                reporting.
              </li>
              <li>• Parent phone numbers are masked for Faculty, HOD and Management roles.</li>
              <li>
                • Safety-related concerns are escalated to a named human owner and never
                auto-closed.
              </li>
            </ul>
          </Panel>
          <PrivacyNote>
            Changes to retention or masking policy require Super Admin approval and are audit
            logged.
          </PrivacyNote>
        </div>
      ) : null}

      {tab === "Calling" ? (
        <Panel title="Calling configuration">
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              ["Calling window", "10:00 AM – 8:30 PM"],
              ["Max retry attempts", "3 per parent"],
              ["Retry gap", "4 hours"],
              ["Languages", "Telugu, English, Hindi"],
              ["Concurrent calls", "25"],
              ["Do-not-disturb days", "Sundays & public holidays"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      ) : null}

      {tab === "Audit Log" ? (
        <Panel padded={false} title="Audit log" description="Every sensitive action is recorded">
          <DataTable
            head={
              <tr>
                <Th>User</Th>
                <Th>Action</Th>
                <Th>Resource</Th>
                <Th>Time</Th>
                <Th>Device</Th>
                <Th>Result</Th>
              </tr>
            }
          >
            {auditLog.map((a) => (
              <tr key={a.id} className="transition-colors hover:bg-muted/50">
                <Td className="font-medium">{a.user}</Td>
                <Td className="text-muted-foreground">{a.action}</Td>
                <Td className="text-muted-foreground">{a.resource}</Td>
                <Td className="text-muted-foreground">{a.time}</Td>
                <Td className="text-muted-foreground">{a.device}</Td>
                <Td>
                  <StatusBadge status={a.result} />
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      ) : null}
    </div>
  );
}
