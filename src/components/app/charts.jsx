import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axis = {
  stroke: "var(--color-border)",
  tick: { fill: "var(--color-muted-foreground)", fontSize: 12 },
};

const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid var(--color-border)",
    background: "var(--color-card)",
    boxShadow: "var(--shadow-pop)",
    fontSize: 12,
  },
};

export function DonutChart({ data, onSelect, centerLabel, centerValue }) {
  return (
    <div className="relative h-[248px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="86%"
            paddingAngle={3}
            strokeWidth={0}
            onClick={(entry) => entry?.name && onSelect?.(entry.name)}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} className={onSelect ? "cursor-pointer" : ""} />
            ))}
          </Pie>
          <Tooltip formatter={(v, n) => [`${v}%`, n]} {...tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      {centerValue ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-foreground">{centerValue}</span>
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      ) : null}
    </div>
  );
}

export function Legend({ data }) {
  return (
    <ul className="mt-2 grid gap-2 sm:grid-cols-3">
      {data.map((d) => (
        <li key={d.name} className="flex items-center gap-2 text-sm">
          <span className="size-2.5 rounded-full" style={{ background: d.color }} />
          <span className="text-muted-foreground">{d.name}</span>
          <span className="ml-auto font-semibold text-foreground">{d.value}%</span>
        </li>
      ))}
    </ul>
  );
}

export function TrendLine({
  data,
  dataKey = "satisfaction",
  domain = [3, 5],
  height = 248,
  color = "var(--color-primary)",
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="period" {...axis} />
          <YAxis domain={domain} {...axis} />
          <Tooltip {...tooltipStyle} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#g-${dataKey})`}
            dot={{ r: 4, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MultiLine({ data, series, height = 260 }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="period" {...axis} />
          <YAxis {...axis} />
          <Tooltip {...tooltipStyle} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2.5}
              dot={{ r: 3.5, strokeWidth: 0, fill: s.color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HorizontalBars({ data, onSelect, height = 260, color = "var(--color-primary)" }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" horizontal={false} />
          <XAxis type="number" {...axis} />
          <YAxis type="category" dataKey="name" width={122} {...axis} />
          <Tooltip {...tooltipStyle} />
          <Bar
            dataKey="mentions"
            radius={[0, 8, 8, 0]}
            barSize={18}
            fill={color}
            onClick={(entry) => entry?.name && onSelect?.(entry.name)}
            className={onSelect ? "cursor-pointer" : ""}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VerticalBars({
  data,
  dataKey,
  xKey = "period",
  height = 260,
  color = "var(--color-accent)",
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey={xKey} {...axis} />
          <YAxis {...axis} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} barSize={38} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
