import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, StatusBadge } from "@/components/common";
import { useStore, formatDate, STATUSES } from "@/lib/store";

export const Route = createFileRoute("/dashboard/applications/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "My Applications — OpportUnity" },
      { name: "description", content: "Search, filter and sort your internship applications." },
      { property: "og:title", content: "My Applications — OpportUnity" },
      { property: "og:description", content: "Search, filter and sort your internship applications." },
    ],
  }),
  component: Applications,
});

function Applications() {
  const { applications } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");

  const list = useMemo(() => {
    let l = applications.filter(
      (a) =>
        (status === "all" || a.status === status) &&
        `${a.company} ${a.title}`.toLowerCase().includes(q.toLowerCase()),
    );
    l = [...l].sort((a, b) => {
      if (sort === "company") return a.company.localeCompare(b.company);
      if (sort === "deadline") return (a.deadline || "9999").localeCompare(b.deadline || "9999");
      return (b.dateApplied || "").localeCompare(a.dateApplied || "");
    });
    return l;
  }, [applications, q, status, sort]);

  return (
    <>
      <PageHeader title="My applications">
        <Button asChild>
          <Link to="/dashboard/applications/new"><Plus /> New application</Link>
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search company or role…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs bg-card" />
        <select className="native-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="native-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recent">Most recent</option>
          <option value="deadline">Deadline</option>
          <option value="company">Company A–Z</option>
        </select>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Showing {list.length} results</p>

      <div className="surface mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              {["Company", "Role", "Status", "Applied", "Deadline", ""].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map((a) => (
              <tr key={a.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-semibold">{a.company}</td>
                <td className="px-4 py-3">{a.title}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">{formatDate(a.dateApplied)}</td>
                <td className="px-4 py-3">{formatDate(a.deadline)}</td>
                <td className="px-4 py-3 text-right">
                  <Link to="/dashboard/applications/$id" params={{ id: a.id }} className="font-medium text-accent">View</Link>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No applications match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
