import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  Inbox,
  Lock,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------- Layout */

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-[1.75rem]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({ title, description, actions, children, className, padded = true }) {
  return (
    <section className={cn("surface", className)}>
      {title ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function Grid({ cols = 4, children }) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "sm:grid-cols-2 xl:grid-cols-4",
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ KPI */

export function KpiCard({ label, value, hint, delta, icon: Icon, tone = "primary", to }) {
  const toneCls = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/10 text-destructive",
  }[tone];

  const body = (
    <div className="surface h-full p-5 transition-all hover:shadow-[var(--shadow-pop)] hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon ? (
          <span className={cn("flex size-9 items-center justify-center rounded-xl", toneCls)}>
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {typeof delta === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
              delta >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {delta >= 0 ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(delta)}%
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  );

  return to ? (
    <Link
      to={to}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
    >
      {body}
    </Link>
  ) : (
    body
  );
}

/* --------------------------------------------------------------- Badges */

const priorityStyles = {
  critical: "bg-destructive/10 text-destructive ring-destructive/20",
  high: "bg-warning/15 text-[oklch(0.55_0.14_55)] ring-warning/30",
  medium: "bg-warning/10 text-[oklch(0.58_0.11_80)] ring-warning/25",
  low: "bg-success/10 text-success ring-success/20",
};

const priorityDot = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "🟢",
};

export function PriorityBadge({ priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        priorityStyles[priority],
      )}
    >
      <span aria-hidden>{priorityDot[priority]}</span>
      {priority}
    </span>
  );
}

export function SentimentBadge({ sentiment }) {
  const map = {
    positive: "bg-success/10 text-success ring-success/20",
    neutral: "bg-warning/12 text-[oklch(0.58_0.11_80)] ring-warning/25",
    negative: "bg-destructive/10 text-destructive ring-destructive/20",
    mixed: "bg-primary/10 text-primary ring-primary/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        map[sentiment],
      )}
    >
      {sentiment}
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = status.toLowerCase();
  const tone =
    s.includes("complete") ||
    s.includes("resolved") ||
    s.includes("collected") ||
    s === "running" ||
    s === "success" ||
    s === "given" ||
    s === "available"
      ? "bg-success/10 text-success ring-success/20"
      : s.includes("overdue") ||
          s.includes("failed") ||
          s.includes("declined") ||
          s.includes("denied") ||
          s.includes("escalat")
        ? "bg-destructive/10 text-destructive ring-destructive/20"
        : s.includes("progress") ||
            s.includes("review") ||
            s.includes("scheduled") ||
            s.includes("assigned")
          ? "bg-primary/10 text-primary ring-primary/20"
          : s.includes("pending") ||
              s.includes("await") ||
              s.includes("paused") ||
              s.includes("callback") ||
              s.includes("open") ||
              s.includes("reported")
            ? "bg-warning/12 text-[oklch(0.55_0.13_65)] ring-warning/25"
            : "bg-muted text-muted-foreground ring-border";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        tone,
      )}
    >
      {status}
    </span>
  );
}

export function TrendBadge({ trend }) {
  const up = trend.toLowerCase().startsWith("incr");
  const down = trend.toLowerCase().startsWith("decr");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        up ? "text-destructive" : down ? "text-success" : "text-muted-foreground",
      )}
    >
      {up ? (
        <ArrowUpRight className="size-3.5" />
      ) : down ? (
        <ArrowDownRight className="size-3.5" />
      ) : null}
      {trend}
    </span>
  );
}

/* ------------------------------------------------------------ Utilities */

export function Progress({ value, tone = "primary" }) {
  const bg = {
    primary: "bg-primary",
    success: "bg-success",
    danger: "bg-destructive",
    warning: "bg-warning",
  }[tone];
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full transition-all", bg)}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

export function AiInsight({ title = "AI Insight", children }) {
  return (
    <div className="gradient-soft rounded-xl border border-primary/15 p-5">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-foreground/85">{children}</div>
      <p className="mt-3 text-xs text-muted-foreground">
        Generated from authorised parent feedback data only
      </p>
    </div>
  );
}

export function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-background text-muted-foreground shadow-[var(--shadow-card)]">
        <Icon className="size-5" />
      </span>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

export function NoPermission({ what = "this data" }) {
  return (
    <EmptyState
      icon={Lock}
      title="You don't have permission to view this"
      description={`Your current role is not authorised to access ${what}. Contact the Super Administrator if you need access.`}
    />
  );
}

export function PrivacyNote({ children }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-accent/25 bg-accent/8 px-4 py-3 text-xs text-foreground/80">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
      <span>{children}</span>
    </div>
  );
}

export function WarningNote({ children }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-xs text-foreground/85">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
      <span>{children}</span>
    </div>
  );
}

export function DemoTag() {
  return (
    <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      Demo data
    </span>
  );
}

export function Rating({ value }) {
  const tone = value >= 4.2 ? "text-success" : value >= 3.8 ? "text-warning" : "text-destructive";
  return (
    <span className={cn("font-semibold", tone)}>
      {value.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">/ 5</span>
    </span>
  );
}

export function TableWrap({ children }) {
  return <div className="w-full overflow-x-auto">{children}</div>;
}

export function Th({ children, className }) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }) {
  return (
    <td className={cn("whitespace-nowrap px-4 py-3 text-sm text-foreground/90", className)}>
      {children}
    </td>
  );
}

export function DataTable({ head, children }) {
  return (
    <TableWrap>
      <table className="w-full border-collapse">
        <thead className="border-b border-border bg-muted/50">
          {head}
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </TableWrap>
  );
}
