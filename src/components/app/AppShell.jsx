import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CalendarClock,
  ChevronDown,
  ClipboardCheck,
  FileBarChart,
  GraduationCap,
  AudioLines,
  LayoutDashboard,
  LineChart,
  ListChecks,
  LogOut,
  Menu,
  MessageSquareQuote,
  PhoneCall,
  PhoneOff,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
  UserSquare2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PERIODS } from "@/data/mock";
import { useKpis } from "@/hooks/use-kpis";
import { useRole } from "./role-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const NAV = [
  {
    group: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/principal", label: "Principal View", icon: GraduationCap },
      { to: "/management", label: "Management View", icon: Building2 },
    ],
  },
  {
    group: "Listen",
    items: [
      { to: "/import", label: "Import Parents", icon: Upload },
      { to: "/campaigns", label: "Call Campaigns", icon: PhoneCall },
      { to: "/live-calls", label: "AI Calling Console", icon: Activity },
      { to: "/parents", label: "Parents & Students", icon: Users },
      { to: "/feedback", label: "Feedback", icon: MessageSquareQuote },
    ],
  },
  {
    group: "Understand",
    items: [
      { to: "/faculty", label: "Faculty", icon: UserSquare2 },
      { to: "/hod", label: "HOD / Coordinators", icon: ClipboardCheck },
      { to: "/classes", label: "Class Analytics", icon: BarChart3 },
    ],
  },
  {
    group: "Act & Measure",
    items: [
      { to: "/issues", label: "Issues", icon: ShieldAlert },
      { to: "/actions", label: "Actions", icon: ListChecks },
      { to: "/impact", label: "Before & After", icon: TrendingUp },
      { to: "/escalations", label: "Escalations", icon: ShieldAlert },
    ],
  },
  {
    group: "Operations",
    items: [
      { to: "/callbacks", label: "Callbacks", icon: CalendarClock },
      { to: "/call-failures", label: "Call Failures", icon: PhoneOff },
    ],
  },
  {
    group: "Insights",
    items: [
      { to: "/reports", label: "Reports", icon: FileBarChart },
      { to: "/weekly-report", label: "Weekly AI Report", icon: LineChart },
      { to: "/assistant", label: "AI Assistant", icon: Sparkles },
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const LABELS = {
  dashboard: "Dashboard",
  principal: "Principal View",
  management: "Management View",
  campaigns: "Call Campaigns",
  "live-calls": "AI Calling Console",
  parents: "Parents & Students",
  feedback: "Feedback",
  faculty: "Faculty",
  trend: "Trend",
  hod: "HOD / Coordinators",
  classes: "Class Analytics",
  issues: "Issues",
  actions: "Actions",
  impact: "Before & After",
  escalations: "Escalations",
  callbacks: "Callbacks",
  "call-failures": "Call Failures",
  reports: "Reports",
  "weekly-report": "Weekly AI Report",
  assistant: "AI Assistant",
  notifications: "Notifications",
  settings: "Settings",
  audit: "Audit Logs",
};

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-sidebar-primary/20">
        <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-sidebar-primary-foreground">
          Vignan School
        </p>
        <p className="truncate text-[11px] font-medium tracking-wide text-sidebar-foreground/70">
          VIGNAN PARENT VOICE AI
        </p>
      </div>
    </div>
  );
}

function SidebarNav({ onNavigate }) {
  const { can, role, userName, setRoleId, roles, roleId } = useRole();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-4 py-5">
        <Brand />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV.map((group) => {
          const items = group.items.filter((i) => can(i.to));
          if (!items.length) return null;
          return (
            <div key={group.group} className="mb-4">
              <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/45">
                {group.group}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = pathname === item.to || pathname.startsWith(item.to + "/");
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-inner"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <item.icon
                          className={cn("size-4 shrink-0", active && "text-sidebar-primary")}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-xl bg-sidebar-accent/50 p-3">
          <p className="truncate text-[13px] font-semibold text-sidebar-primary-foreground">
            {userName}
          </p>
          <p className="truncate text-[11px] text-sidebar-foreground/70">{role.label}</p>
          <label className="mt-2.5 block text-[10px] uppercase tracking-wide text-sidebar-foreground/50">
            Switch demo role
          </label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-sidebar-border bg-sidebar px-2 py-1.5 text-xs text-sidebar-foreground outline-none focus:ring-2 focus:ring-sidebar-ring"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <div className="mt-2.5 flex items-center gap-2">
            <Link
              to="/settings"
              onClick={onNavigate}
              className="flex-1 rounded-lg border border-sidebar-border px-2 py-1.5 text-center text-[11px] text-sidebar-foreground/85 hover:bg-sidebar-accent"
            >
              Profile
            </Link>
            <Link
              to="/"
              onClick={async (e) => {
                e.preventDefault();
                await signOut(auth);
                setRoleId(null);
                if (onNavigate) onNavigate();
              }}
              className="flex items-center gap-1 rounded-lg border border-sidebar-border px-2 py-1.5 text-[11px] text-sidebar-foreground/85 hover:bg-sidebar-accent"
            >
              <LogOut className="size-3.5" /> Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const parts = pathname.split("/").filter(Boolean);
  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex"
    >
      <Link to="/dashboard" className="hover:text-foreground">
        Home
      </Link>
      {parts.map((p, i) => (
        <span key={p + i} className="flex items-center gap-1.5">
          <span className="text-border">/</span>
          <span className={cn(i === parts.length - 1 && "font-medium text-foreground")}>
            {LABELS[p] ?? p.toUpperCase()}
          </span>
        </span>
      ))}
    </nav>
  );
}

export function AppShell({ children }) {
  const schoolKpis = useKpis();
  const { period, setPeriod, userName, role } = useRole();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] border-r border-sidebar-border lg:block">
        <SidebarNav />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 w-[278px] shadow-[var(--shadow-pop)]">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg border border-border bg-card p-2 text-foreground lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-4" />
            </button>
            <Breadcrumbs />
            <div className="ml-auto flex items-center gap-2">
              <label className="relative hidden md:block">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search students, faculty, issues…"
                  className="h-9 w-56 rounded-lg border border-border bg-card pl-8 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:w-72 focus:ring-2 focus:ring-ring/40 xl:w-72"
                />
              </label>
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="h-9 appearance-none rounded-lg border border-border bg-card pl-3 pr-8 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                >
                  {PERIODS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <Link
                to="/notifications"
                className="relative rounded-lg border border-border bg-card p-2 text-foreground hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                {!schoolKpis.loading && schoolKpis.unreadAlerts > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-destructive-foreground">
                    {schoolKpis.unreadAlerts}
                  </span>
                )}
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5 hover:bg-muted"
              >
                <span className="flex size-8 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-border">
                  <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
                </span>
                <span className="hidden text-xs font-medium text-foreground sm:block">
                  {role.label}
                </span>
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
