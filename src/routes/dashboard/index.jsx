import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge } from "@/components/common";
import { useStore, getStats, formatDate, STATUSES } from "@/lib/store";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Dashboard — OpportUnity" },
      { name: "description", content: "Your internship application overview." },
      { property: "og:title", content: "Dashboard — OpportUnity" },
      { property: "og:description", content: "Your internship application overview." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { profile, applications } = useStore();
  const stats = getStats(applications);
  const [tab, setTab] = useState("pending");
  const tabbed = applications.filter((a) => a.status === tab);

  return (
    <>
      <PageHeader title={`Welcome back, ${profile.name}!`} subtitle="Here's where your applications stand.">
        <Button asChild>
          <Link to="/dashboard/applications/new"><Plus /> New application</Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Total applied", stats.total],
          ["In progress", stats.inProgress],
          ["Offers", stats.offer],
        ].map(([label, value]) => (
          <div key={label} className="surface p-5">
            <p className="field-label">{label}</p>
            <p className="font-display text-4xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <section className="surface mt-8 p-5">
        <h2 className="text-xl font-semibold">Status breakdown</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Button
              key={s.value}
              onClick={() => setTab(s.value)}
              variant={tab === s.value ? "default" : "outline"}
              aria-pressed={tab === s.value}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${tab === s.value ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {s.label} ({stats[s.value]})
            </Button>
          ))}
        </div>
        <ul className="mt-4 divide-y">
          {tabbed.length === 0 && <li className="py-4 text-sm text-muted-foreground">Nothing here yet.</li>}
          {tabbed.map((a) => (
            <li key={a.id} className="py-3">
              <Link to="/dashboard/applications/$id" params={{ id: a.id }} className="font-medium hover:text-accent">
                {a.company} — {a.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent applications</h2>
          <Link to="/dashboard/applications" className="text-sm font-medium text-accent">View all</Link>
        </div>
        <div className="grid gap-3">
          {applications.slice(0, 5).map((a) => (
            <div key={a.id} className="surface flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold">{a.company} — {a.title}</p>
                <p className="text-sm text-muted-foreground">
                  Applied: {formatDate(a.dateApplied)} · Deadline: {formatDate(a.deadline)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={a.status} />
                <Button asChild size="sm" variant="outline">
                  <Link to="/dashboard/applications/$id" params={{ id: a.id }}>View</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/dashboard/applications/$id/edit" params={{ id: a.id }}>Edit</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
