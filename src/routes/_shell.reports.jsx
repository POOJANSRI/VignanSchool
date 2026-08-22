import { createFileRoute } from "@tanstack/react-router";
import { Download, FileBarChart, FileText, Inbox } from "lucide-react";
import { Grid, KpiCard, PageHeader, Panel, PrivacyNote, EmptyState } from "@/components/app/kit";
import { MultiLine } from "@/components/app/charts";
import { feedbackTrend } from "@/data/mock";
import { useKpis } from "@/hooks/use-kpis";
import { useReports } from "@/hooks/use-reports";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import app from "@/lib/firebase";
import { useState } from "react";
import html2pdf from "html2pdf.js";
import { PdfReportTemplate } from "@/components/app/PdfReportTemplate";

const db = getFirestore(app);

export const Route = createFileRoute("/_shell/reports")({
  head: () => ({
    meta: [
      { title: "Reports · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Generate management, principal, faculty and class reports from parent feedback in PDF or CSV.",
      },
      { property: "og:title", content: "Reports · VIGNAN PARENT VOICE AI" },
      {
        property: "og:description",
        content: "Board-ready reports built from authorised parent feedback.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const schoolKpis = useKpis();
  const { reports, loading } = useReports();
  const [generating, setGenerating] = useState(false);

  const handleGenerateCustom = async () => {
    setGenerating(true);
    try {
      await addDoc(collection(db, "reports"), {
        title: "Custom Analytical Report",
        description: "Ad-hoc analysis containing sentiment trends and top issues.",
        audience: "Management",
        period: new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = (report) => {
    const element = document.getElementById(`pdf-template-${report.id}`);
    if (!element) return;

    // We temporarily show it to render, but position it offscreen
    element.parentElement.style.display = 'block';
    element.parentElement.style.position = 'absolute';
    element.parentElement.style.left = '-9999px';

    const opt = {
      margin:       0,
      filename:     `Vignan_Report_${report.id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
       element.parentElement.style.display = 'none';
       element.parentElement.style.position = 'static';
       element.parentElement.style.left = '0';
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Every report is generated from authorised parent feedback and logged for audit"
        actions={
          <button
            onClick={handleGenerateCustom}
            disabled={generating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <FileBarChart className="size-3.5" /> {generating ? "Generating..." : "New custom report"}
          </button>
        }
      />

      <Grid cols={3}>
        <KpiCard label="Reports available" value={loading ? "..." : String(reports.length)} />
        <KpiCard label="Generated this month" value={schoolKpis.loading ? "..." : String(schoolKpis.reportsGeneratedThisMonth || "0")} tone="accent" />
        <KpiCard
          label="Scheduled deliveries"
          value={schoolKpis.loading ? "..." : String(schoolKpis.reportsScheduled || "0")}
          tone="success"
          hint="Weekly, every Monday 8 AM"
        />
      </Grid>

      <Panel title="Satisfaction across periods" description="Included in every management report">
        <MultiLine
          data={feedbackTrend}
          series={[{ key: "satisfaction", label: "Satisfaction", color: "var(--color-primary)" }]}
        />
      </Panel>

      {reports.length === 0 && !loading ? (
        <Panel padded={false}>
          <div className="p-12">
            <EmptyState
              icon={FileText}
              title="No reports generated yet"
              description="Click 'New custom report' to generate your first analytical report from the dataset."
            />
          </div>
        </Panel>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {reports.map((r) => (
            <Panel key={r.id} title={r.title} description={r.description}>
              <p className="text-xs text-muted-foreground">
                Audience: {r.audience} · Period: {r.period}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 print:hidden">
                <button
                  onClick={() => handleDownloadPDF(r)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  <FileText className="size-3.5" /> Download PDF
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted">
                  <Download className="size-3.5" /> Export CSV
                </button>
              </div>
              
              {/* Hidden PDF Template Container */}
              <div style={{ display: 'none' }}>
                 <div id={`pdf-template-${r.id}`}>
                   <PdfReportTemplate report={r} />
                 </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <PrivacyNote>
        Reports exclude raw parent contact details by default. Exports containing personal data
        require Principal or Super Admin approval and are recorded in the audit log.
      </PrivacyNote>
    </div>
  );
}
