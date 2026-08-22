import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Phone,
  Upload,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { PageHeader, Panel, Td, Th, DataTable } from "@/components/app/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/import")({
  head: () => ({
    meta: [
      { title: "Import Parents · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Import student and parent data from CSV or Excel into Vignan Parent Voice AI to begin AI-powered feedback calling campaigns.",
      },
    ],
  }),
  component: ImportPage,
});

// ─── Required columns ─────────────────────────────────────────────────────────
const REQUIRED_COLS = [
  "Student ID",
  "Student Name",
  "Class",
  "Section",
  "Parent Name",
  "Mobile Number",
];

const ALL_COLS = [
  { key: "studentId",        label: "Student ID",        required: true },
  { key: "name",             label: "Student Name",      required: true },
  { key: "grade",            label: "Class",             required: true },
  { key: "section",          label: "Section",           required: true },
  { key: "parent",           label: "Parent Name",       required: true },
  { key: "mobile",           label: "Mobile Number",     required: true },
  { key: "altMobile",        label: "Alternate Number",  required: false },
  { key: "relationship",     label: "Relationship",      required: false },
  { key: "language",         label: "Preferred Language",required: false },
  { key: "faculty",          label: "Faculty / Teacher", required: false },
  { key: "subject",          label: "Subject",           required: false },
];

// Column aliases — maps common spreadsheet headers → our internal keys
const COL_ALIASES = {
  "student id":         "studentId",
  "student_id":         "studentId",
  "id":                 "studentId",
  "student name":       "name",
  "name":               "name",
  "student":            "name",
  "class":              "grade",
  "grade":              "grade",
  "section":            "section",
  "parent name":        "parent",
  "parent":             "parent",
  "guardian":           "parent",
  "mobile":             "mobile",
  "mobile number":      "mobile",
  "phone":              "mobile",
  "contact":            "mobile",
  "alternate number":   "altMobile",
  "alternate":          "altMobile",
  "alt number":         "altMobile",
  "relationship":       "relationship",
  "preferred language": "language",
  "language":           "language",
  "faculty":            "faculty",
  "teacher":            "faculty",
  "subject":            "subject",
};

function normalizeHeader(h) {
  return (h || "").toString().trim().toLowerCase();
}

function parseRows(rawRows, headerRow) {
  const keyMap = {};
  headerRow.forEach((h, i) => {
    const mapped = COL_ALIASES[normalizeHeader(h)];
    if (mapped) keyMap[i] = mapped;
  });

  return rawRows.map((row, rowIdx) => {
    const obj = { _rowIdx: rowIdx + 2 };
    Object.entries(keyMap).forEach(([colIdx, key]) => {
      obj[key] = (row[colIdx] ?? "").toString().trim();
    });

    // Validation
    const errors = [];
    REQUIRED_COLS.forEach((col) => {
      const key = COL_ALIASES[col.toLowerCase()];
      if (!obj[key]) errors.push(`${col} is required`);
    });

    // Phone validation
    if (obj.mobile && !/^\+?[\d\s\-()]{7,15}$/.test(obj.mobile)) {
      errors.push("Invalid mobile number format");
    }

    obj._errors = errors;
    obj._valid = errors.length === 0;
    obj.callStatus = "Pending";
    obj.feedbackStatus = "Not Collected";
    return obj;
  });
}

// ─── Download sample template ─────────────────────────────────────────────────
function downloadTemplate() {
  const headers = ALL_COLS.map((c) => c.label);
  const sampleRow = [
    "VGN2026001", "Aarav Reddy", "Grade 8", "A",
    "Mr. Reddy", "+91 9876543210", "+91 9876543211",
    "Father", "Telugu", "Mrs. Lakshmi Prasanna", "Mathematics",
  ];
  const csv = [headers.join(","), sampleRow.join(",")].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vignan_parent_import_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main page ────────────────────────────────────────────────────────────────
function ImportPage() {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [rows, setRows] = useState([]);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(0);
  const [step, setStep] = useState("idle"); // idle | preview | importing | done | error
  const [globalError, setGlobalError] = useState(null);
  const [filter, setFilter] = useState("all");

  const validRows   = rows.filter((r) => r._valid);
  const invalidRows = rows.filter((r) => !r._valid);

  async function processFile(file) {
    setGlobalError(null);
    setFileName(file.name);
    setRows([]);
    setStep("idle");

    try {
      const { read, utils } = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb  = read(buf, { type: "array" });
      const ws  = wb.Sheets[wb.SheetNames[0]];
      const raw = utils.sheet_to_json(ws, { header: 1, defval: "" });

      if (raw.length < 2) {
        setGlobalError("The file appears to be empty. Please add at least one data row.");
        return;
      }

      const [headerRow, ...dataRows] = raw;
      const parsed = parseRows(dataRows.filter((r) => r.some((c) => c !== "")), headerRow);
      setRows(parsed);
      setStep("preview");
    } catch (e) {
      setGlobalError("Could not read the file. Please upload a valid .csv or .xlsx file.");
    }
  }

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  async function handleImport() {
    if (validRows.length === 0) return;
    setImporting(true);
    setStep("importing");
    setImported(0);

    try {
      const { getFirestore, collection, addDoc, serverTimestamp } = await import("firebase/firestore");
      const { default: app } = await import("@/lib/firebase");
      const db  = getFirestore(app);
      const col = collection(db, "students");

      for (let i = 0; i < validRows.length; i++) {
        const { _rowIdx, _errors, _valid, ...data } = validRows[i];
        await addDoc(col, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        setImported(i + 1);
      }

      setStep("done");
    } catch (e) {
      setGlobalError(`Import failed: ${e.message}`);
      setStep("error");
    } finally {
      setImporting(false);
    }
  }

  function reset() {
    setStep("idle");
    setRows([]);
    setFileName(null);
    setGlobalError(null);
    setImported(0);
    if (fileRef.current) fileRef.current.value = "";
  }

  const displayRows =
    filter === "valid"
      ? validRows
      : filter === "invalid"
        ? invalidRows
        : rows;

  return (
    <>
      <PageHeader
        title="Import Parent Database"
        subtitle="Upload a CSV or Excel file to import student and parent records for AI calling campaigns."
        actions={
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Download className="size-3.5" />
            Download template
          </button>
        }
      />

      {/* ── Step indicators ── */}
      <div className="flex items-center gap-0">
        {[
          { label: "Upload file", step: "idle" },
          { label: "Review & validate", step: "preview" },
          { label: "Import to database", step: "importing" },
          { label: "Complete", step: "done" },
        ].map(({ label, step: s }, idx, arr) => {
          const steps = ["idle", "preview", "importing", "done"];
          const current = steps.indexOf(step);
          const thisIdx = steps.indexOf(s);
          const done    = current > thisIdx;
          const active  = current === thisIdx;
          return (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    done   ? "bg-success text-white"
                           : active ? "bg-primary text-white"
                                    : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <CheckCircle2 className="size-4" /> : idx + 1}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={cn(
                    "mx-3 h-px w-8 sm:w-16 transition-all",
                    done ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Error banner ── */}
      {globalError && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3">
          <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{globalError}</p>
          <button onClick={reset} className="ml-auto text-destructive hover:opacity-70">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* ── STEP: Upload ── */}
      {step === "idle" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Drop zone */}
          <div className="lg:col-span-2">
            <Panel title="Upload file" description="Drag & drop or click to choose a CSV or Excel file">
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={onFileChange}
                className="sr-only"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 text-center transition-all",
                  dragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border hover:border-primary/50 hover:bg-muted/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-16 items-center justify-center rounded-2xl transition-all",
                    dragging ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {dragging
                    ? <Download className="size-7 animate-bounce" />
                    : <Upload className="size-7" />
                  }
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {dragging ? "Drop your file here" : "Drop your file here or click to browse"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Supports .csv, .xlsx, .xls · Max 10 MB
                  </p>
                </div>
                <span className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:brightness-110 transition-all">
                  Choose file
                </span>
              </label>
            </Panel>
          </div>

          {/* Required columns */}
          <Panel title="Required columns">
            <ul className="space-y-2.5">
              {ALL_COLS.map((col) => (
                <li key={col.key} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{col.label}</span>
                  {col.required
                    ? <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">Required</span>
                    : <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">Optional</span>
                  }
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      {/* ── STEP: Preview ── */}
      {step === "preview" && rows.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="surface p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Total records</p>
                  <p className="text-2xl font-semibold text-foreground">{rows.length}</p>
                </div>
              </div>
            </div>
            <div className="surface p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <CheckCircle2 className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Valid records</p>
                  <p className="text-2xl font-semibold text-foreground">{validRows.length}</p>
                </div>
              </div>
            </div>
            <div className="surface p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <AlertTriangle className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Rows with errors</p>
                  <p className="text-2xl font-semibold text-foreground">{invalidRows.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* File info + actions */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileSpreadsheet className="size-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{fileName}</p>
              <p className="text-xs text-muted-foreground">
                {rows.length} rows detected · {validRows.length} ready to import
              </p>
            </div>
            <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-4" />
            </button>
          </div>

          {/* Table */}
          <Panel
            title="Record preview"
            description="Review your data before importing. Rows with errors will be skipped."
            padded={false}
            actions={
              <div className="flex gap-1.5">
                {["all", "valid", "invalid"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                      filter === f
                        ? "bg-primary text-white"
                        : "border border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {f === "all" ? `All (${rows.length})`
                      : f === "valid" ? `✓ Valid (${validRows.length})`
                      : `✗ Errors (${invalidRows.length})`}
                  </button>
                ))}
              </div>
            }
          >
            <DataTable
              head={
                <tr>
                  <Th>Row</Th>
                  <Th>Student ID</Th>
                  <Th>Student Name</Th>
                  <Th>Class</Th>
                  <Th>Section</Th>
                  <Th>Parent Name</Th>
                  <Th>Mobile</Th>
                  <Th>Language</Th>
                  <Th>Status</Th>
                </tr>
              }
            >
              {displayRows.map((row) => (
                <tr
                  key={row._rowIdx}
                  className={cn(
                    "transition-colors",
                    row._valid
                      ? "hover:bg-muted/40"
                      : "bg-destructive/4 hover:bg-destructive/8",
                  )}
                >
                  <Td className="text-muted-foreground">{row._rowIdx}</Td>
                  <Td>{row.studentId || <span className="text-destructive">—</span>}</Td>
                  <Td className="font-medium">{row.name || <span className="text-destructive">Missing</span>}</Td>
                  <Td>{row.grade || "—"}</Td>
                  <Td>{row.section || "—"}</Td>
                  <Td>{row.parent || <span className="text-destructive">Missing</span>}</Td>
                  <Td>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3 text-muted-foreground" />
                      {row.mobile || <span className="text-destructive">Missing</span>}
                    </span>
                  </Td>
                  <Td>{row.language || <span className="text-muted-foreground">—</span>}</Td>
                  <Td>
                    {row._valid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                        <CheckCircle2 className="size-3" /> Ready
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive cursor-default"
                        title={row._errors.join(", ")}
                      >
                        <XCircle className="size-3" />
                        {row._errors.length} error{row._errors.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </Td>
                </tr>
              ))}
            </DataTable>
          </Panel>

          {/* Footer actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Ready to import {validRows.length} valid record{validRows.length !== 1 ? "s" : ""}
                {invalidRows.length > 0 && (
                  <span className="ml-2 text-destructive">
                    ({invalidRows.length} row{invalidRows.length > 1 ? "s" : ""} will be skipped)
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Records will be saved to your Firestore database and ready for campaign assignment.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Start over
              </button>
              <button
                onClick={handleImport}
                disabled={validRows.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Upload className="size-3.5" />
                Import {validRows.length} record{validRows.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── STEP: Importing ── */}
      {step === "importing" && (
        <div className="surface flex flex-col items-center justify-center gap-6 py-20 text-center">
          <div className="relative flex size-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <span className="relative flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Loader2 className="size-8 animate-spin" />
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Importing records…</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {imported} of {validRows.length} records imported
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full max-w-sm">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${Math.round((imported / validRows.length) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-right text-xs text-muted-foreground">
              {Math.round((imported / validRows.length) * 100)}%
            </p>
          </div>
        </div>
      )}

      {/* ── STEP: Done ── */}
      {step === "done" && (
        <div className="surface flex flex-col items-center justify-center gap-6 py-20 text-center">
          <div className="relative flex size-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-success/15" />
            <span className="relative flex size-16 items-center justify-center rounded-2xl bg-success/15 text-success">
              <CheckCircle2 className="size-9" />
            </span>
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground">Import complete!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{imported}</span> parent records imported successfully.
              {invalidRows.length > 0 && (
                <span className="ml-1 text-destructive">{invalidRows.length} rows were skipped due to errors.</span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Import another file
            </button>
            <a
              href="/parents"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white hover:brightness-110 transition-all"
            >
              <Users className="size-3.5" />
              View parent database
            </a>
          </div>
        </div>
      )}
    </>
  );
}
