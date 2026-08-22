import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Activity, PhoneCall } from "lucide-react";
import {

  EmptyState,
  Grid,
  KpiCard,
  PageHeader,
  Panel,
  PrivacyNote,
  Progress,
  StatusBadge,
} from "@/components/app/kit";
import { DonutChart, Legend, VerticalBars } from "@/components/app/charts";
import { campaigns, liveActivity, sentimentSplit } from "@/data/mock";

export const Route = createFileRoute("/_shell/campaigns/$id")({
  loader: ({ params }) => {
    const campaign = campaigns.find((c) => c.id === params.id);
    if (!campaign) throw notFound();
    return { campaign };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Campaign unavailable · VIGNAN PARENT VOICE AI" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `${loaderData.campaign.name} · Campaign · VIGNAN PARENT VOICE AI` },
        {
          name: "description",
          content: `Live operational metrics for the ${loaderData.campaign.name} parent-calling campaign at Vignan School.`,
        },
        { property: "og:title", content: `${loaderData.campaign.name} · Campaign` },
        {
          property: "og:description",
          content: "Live calling metrics, queue status and activity feed.",
        },
      ],
    };
  },
  component: CampaignDetail,
  notFoundComponent: () => (
    <EmptyState
      title="Campaign not found"
      description="This campaign may have been deleted or the link is incorrect."
    />
  ),
});

function CampaignDetail() {
  const { campaign } = Route.useLoaderData();
  const ops = campaign.ops;
  const opsData = [
    { period: "Queued", value: ops.queued },
    { period: "Calling", value: ops.calling },
    { period: "Completed", value: ops.completed },
    { period: "Failed", value: ops.failed },
    { period: "Callback", value: ops.callback },
    { period: "No answer", value: ops.noAnswer },
    { period: "Declined", value: ops.declined },
    { period: "Language", value: ops.language },
  ];

  return (
    <>
      <PageHeader
        title={campaign.name}
        subtitle={`${campaign.id} · ${campaign.audience} · ${campaign.start} → ${campaign.end}`}
        actions={
          <>

            <StatusBadge status={campaign.status} />
            <Link
              to="/live-calls"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110"
            >
              <Activity className="size-3.5" /> Open calling console
            </Link>
          </>
        }
      />

      <Grid cols={4}>
        <KpiCard label="Parents targeted" value={campaign.parents.toLocaleString()} />
        <KpiCard
          label="Completed"
          value={ops.completed.toLocaleString()}
          tone="success"
          icon={PhoneCall}
        />
        <KpiCard label="Response rate" value={`${campaign.responseRate}%`} tone="accent" />
        <KpiCard
          label="Callback requested"
          value={String(ops.callback)}
          tone="warning"
          to="/callbacks"
        />
      </Grid>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Operational breakdown"
          description="Live call disposition for this campaign"
          className="lg:col-span-2"
        >
          <VerticalBars data={opsData} dataKey="value" xKey="period" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {opsData.map((o) => (
              <div key={o.period} className="rounded-xl border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">{o.period}</p>
                <p className="text-lg font-semibold text-foreground">{o.value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Live activity feed" description="Most recent events">
          {campaign.status === "Draft" ? (
            <EmptyState
              title="Campaign not started"
              description="Launch the campaign to begin collecting live activity."
            />
          ) : (
            <ul className="space-y-3">
              {liveActivity.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm text-foreground">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Sentiment collected so far">
          <DonutChart
            data={sentimentSplit}
            centerValue={`${campaign.completed}`}
            centerLabel="responses"
          />
          <Legend data={sentimentSplit} />
        </Panel>
        <Panel title="Progress" className="lg:col-span-2">
          <div className="space-y-5">
            {[
              {
                label: "Calls dialled",
                value: ((ops.completed + ops.failed) / campaign.parents) * 100,
              },
              { label: "Responses collected", value: campaign.responseRate },
              { label: "Consent captured", value: 92 },
              { label: "Analysis completed", value: 98 },
            ].map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{p.label}</span>
                  <span className="font-semibold text-foreground">{Math.round(p.value)}%</span>
                </div>
                <div className="mt-1.5">
                  <Progress value={p.value} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <PrivacyNote>
              Consent script is played at the start of each call. Recordings are stored for 90 days
              and can be accessed only by roles authorised in Settings → Privacy & Retention.
            </PrivacyNote>
          </div>
        </Panel>
      </div>
    </>
  );
}
