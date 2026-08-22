/**
 * @file src/data/mock.jsx
 *
 * Firestore data layer — Vignan Voice AI.
 *
 * ⚠️  Firebase Client SDK is browser-only.
 *     On the server (SSR) every export starts as an empty array/object.
 *     Components must use the `useCollection` / `useDocument` hooks
 *     (or React Query) to subscribe to live data after hydration.
 */

// ─── ROLES (static config — no DB needed) ────────────────────────────────────

export const ROLES = [
  {
    id: "super_admin",
    label: "Super Administrator",
    description: "Full platform access including settings and audit logs",
    home: "/dashboard",
    nav: ["*"],
    canSeeParentContacts: true,
    canPlayRecordings: true,
  },
  {
    id: "principal",
    label: "Principal",
    description: "School-wide strategic view",
    home: "/principal",
    nav: [
      "/dashboard", "/principal", "/campaigns", "/parents", "/feedback",
      "/faculty", "/hod", "/classes", "/issues", "/actions", "/impact",
      "/reports", "/weekly-report", "/assistant", "/notifications",
      "/escalations", "/settings",
    ],
    canSeeParentContacts: true,
    canPlayRecordings: true,
  },
  {
    id: "hod",
    label: "HOD / Academic Coordinator",
    description: "Grade and department level oversight",
    home: "/hod",
    nav: [
      "/dashboard", "/hod", "/faculty", "/classes", "/feedback",
      "/issues", "/actions", "/reports", "/assistant", "/notifications",
    ],
    canSeeParentContacts: false,
    canPlayRecordings: false,
  },
  {
    id: "faculty",
    label: "Faculty",
    description: "Anonymised feedback for own classes only",
    home: "/faculty",
    nav: ["/faculty", "/faculty/trend", "/actions", "/notifications", "/assistant"],
    canSeeParentContacts: false,
    canPlayRecordings: false,
  },
  {
    id: "management",
    label: "Management",
    description: "Executive outcomes and interventions",
    home: "/management",
    nav: [
      "/management", "/impact", "/issues", "/actions",
      "/reports", "/weekly-report", "/assistant", "/notifications",
    ],
    canSeeParentContacts: false,
    canPlayRecordings: false,
  },
  {
    id: "coordinator",
    label: "Feedback / Call Coordinator",
    description: "Day-to-day calling operations",
    home: "/campaigns",
    nav: [
      "/dashboard", "/campaigns", "/live-calls", "/parents", "/feedback",
      "/callbacks", "/call-failures", "/escalations", "/notifications", "/assistant",
    ],
    canSeeParentContacts: true,
    canPlayRecordings: true,
  },
];

export const roleById = (id) => ROLES.find((r) => r.id === id) ?? ROLES[1];
export const PERIODS = ["August 2026", "Last 30 Days", "Academic Year 2026–27"];

// ─── Firestore loader (browser only) ─────────────────────────────────────────

const isBrowser = typeof window !== "undefined";

let _db = null;
let _fsLoaded = false;

async function getDb() {
  if (!isBrowser) return null;
  if (_db) return _db;
  const { getFirestore } = await import("firebase/firestore");
  const { default: app } = await import("@/lib/firebase");
  _db = getFirestore(app);
  _fsLoaded = true;
  return _db;
}

async function fsCol(name) {
  const db = await getDb();
  if (!db) return null;
  const { collection } = await import("firebase/firestore");
  return collection(db, name);
}

async function fsDoc(colName, id) {
  const db = await getDb();
  if (!db) return null;
  const { doc } = await import("firebase/firestore");
  return doc(db, colName, id);
}

async function getAll(colName) {
  const db = await getDb();
  if (!db) return [];
  const { collection, getDocs } = await import("firebase/firestore");
  const snap = await getDocs(collection(db, colName));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function getOneDoc(colName, id) {
  const db = await getDb();
  if (!db) return null;
  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, colName, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ─── Live reactive arrays (start empty, filled client-side via useEffect) ─────
// Routes that read these synchronously will get [] on first render.
// Use the `services.*` async functions inside useEffect / React Query instead.

export let campaigns      = [];
export let students       = [];
export let feedbackItems  = [];
export let facultyList    = [];
export let facultyImprovements = [];
export let facultyStrengths = [];
export let facultyActionPoints = [];
export let myFaculty      = null;
export let issues         = [];
export let actions        = [];
export let notifications  = [];
export let callbacks      = [];
export let callFailures   = [];
export let escalations    = [];
export let interventions  = [];
export let classAnalytics = [];
export let auditLog       = [];
export let liveActivity   = [];
export let schoolKpis     = {};
export let sentimentSplit = [];
export let feedbackTrend  = [];
export let topConcerns    = [];
export let topStrengths   = [];
export let aiInsight      = "";


// ─── Services (async — use inside useEffect / React Query) ───────────────────

export const services = {
  getKpis: () => schoolKpis,
  getSentiment: () => sentimentSplit,
  getTrend: () => feedbackTrend,
  getConcerns: () => topConcerns,
  getStrengths: () => topStrengths,
  getCampaigns: () => campaigns,
  getCampaign: (id) => campaigns.find(c => c.id === id),
  getStudents: () => students,
  getFeedback: () => feedbackItems,
  getFeedbackById: (id) => feedbackItems.find(f => f.id === id),
  getFaculty: () => facultyList,
  getIssues: () => issues,
  getIssue: (id) => issues.find(i => i.id === id),
  getActions: () => actions,
  getClasses: () => classAnalytics,
  getNotifications: () => notifications,
  getCallbacks: () => callbacks,
  getCallFailures: () => callFailures,
  getEscalations: () => escalations,
  getAuditLog: () => auditLog,
  getInterventions: () => interventions,
};

// ─── Write helpers ────────────────────────────────────────────────────────────

export const db_write = {
  addCampaign:    async (data) => {
    const { addDoc, serverTimestamp } = await import("firebase/firestore");
    const col = await fsCol("campaigns");
    return addDoc(col, { ...data, createdAt: serverTimestamp() });
  },
  updateCampaign: async (id, data) => {
    const { updateDoc, serverTimestamp } = await import("firebase/firestore");
    const ref = await fsDoc("campaigns", id);
    return updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  },
  updateIssue: async (id, data) => {
    const { updateDoc, serverTimestamp } = await import("firebase/firestore");
    const ref = await fsDoc("issues", id);
    return updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  },
  updateAction: async (id, data) => {
    const { updateDoc, serverTimestamp } = await import("firebase/firestore");
    const ref = await fsDoc("actions", id);
    return updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  },
  markNotifRead: async (id) => {
    const { updateDoc } = await import("firebase/firestore");
    const ref = await fsDoc("notifications", id);
    return updateDoc(ref, { read: true });
  },
  logAudit: async (data) => {
    const { addDoc, serverTimestamp } = await import("firebase/firestore");
    const col = await fsCol("auditLogs");
    return addDoc(col, { ...data, createdAt: serverTimestamp() });
  },
};

// ─── Real-time subscriptions (browser only) ───────────────────────────────────

export async function subscribeLiveCalls(callback) {
  if (!isBrowser) return () => {};
  const db = await getDb();
  const { collection, query, orderBy, limit, onSnapshot } = await import("firebase/firestore");
  const q = query(collection(db, "liveCalls"), orderBy("time", "desc"), limit(20));
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

export async function subscribeNotifications(uid, callback) {
  if (!isBrowser) return () => {};
  const db = await getDb();
  const { collection, query, where, orderBy, limit, onSnapshot } = await import("firebase/firestore");
  const q = query(
    collection(db, "notifications"),
    where("recipientUid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

// ─── AI Assistant ─────────────────────────────────────────────────────────────

export const suggestedPrompts = [
  "What are the top five concerns raised by parents this month?",
  "Which classes have the highest negative feedback?",
  "What are parents most satisfied with?",
  "Show me all transport-related concerns.",
  "Which issues are still unresolved?",
  "Summarize feedback for Grade 10.",
  "What improvement actions were taken this month?",
  "Did parent satisfaction improve after the transport intervention?",
];

export async function askAssistant(question) {
  const q = question.toLowerCase();
  const [allIssues, allActions, allFeedback] = await Promise.all([
    getAll("issues"),
    getAll("actions"),
    getAll("feedback"),
  ]);

  const openIssues  = allIssues.filter((i) => i.status !== "Resolved");
  const openActions = allActions.filter(
    (a) => ["Open", "In Progress", "Overdue"].includes(a.status)
  );

  const categoryCounts = {};
  allFeedback.forEach((f) =>
    (f.categories || []).forEach((cat) => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    })
  );
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (q.includes("transport")) {
    const t = allIssues.find((i) =>
      i.category?.toLowerCase().includes("transport")
    );
    return {
      answer: t
        ? `Transport: ${t.mentions} mentions across ${t.classesAffected} classes. Status: ${t.status}. Trend: ${t.trend}.`
        : "No transport issues in the database yet.",
      evidence: t?.evidence ?? [],
      metrics: [{ label: "Mentions", value: String(t?.mentions ?? 0) }],
      period: "Current period",
      filters: "Category = Transportation",
      links: t ? [{ label: `Open ${t.id}`, to: `/issues/${t.id}` }] : [],
    };
  }

  if (q.includes("unresolved") || q.includes("open")) {
    return {
      answer: `${openIssues.length} unresolved issues and ${openActions.length} open actions.`,
      evidence: openIssues.slice(0, 3).map((i) => `${i.id}: ${i.title} — ${i.status}`),
      metrics: [
        { label: "Unresolved issues", value: String(openIssues.length) },
        { label: "Open actions", value: String(openActions.length) },
      ],
      period: "Current period",
      filters: "Status ≠ Resolved",
      links: [
        { label: "Open issues", to: "/issues" },
        { label: "Open actions", to: "/actions" },
      ],
    };
  }

  return {
    answer:
      topCategories.length > 0
        ? `Top concerns from ${allFeedback.length} records: ${topCategories
            .map(([c, n]) => `${c} (${n})`)
            .join(", ")}.`
        : "No feedback data in Firestore yet. Add records to see insights.",
    evidence: topCategories.map(([c, n]) => `${n} mentions — "${c}"`),
    metrics: [
      { label: "Responses", value: String(allFeedback.length) },
      { label: "Open issues", value: String(openIssues.length) },
    ],
    period: "Current period",
    filters: "All grades · All campaigns",
    links: [
      { label: "Open issues", to: "/issues" },
      { label: "Feedback explorer", to: "/feedback" },
    ],
  };
}
