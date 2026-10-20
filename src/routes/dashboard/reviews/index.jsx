import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Stars } from "@/components/common";
import { avg, slug, useStore } from "@/lib/store";
import { ExternalReviewLinks } from "@/components/ExternalReviewLinks";

export const Route = createFileRoute("/dashboard/reviews/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Company Reviews — OpportUnity" },
      { name: "description", content: "Real student reviews of internship hiring processes." },
      { property: "og:title", content: "Company Reviews — OpportUnity" },
      { property: "og:description", content: "Real student reviews of internship hiring processes." },
    ],
  }),
  component: Reviews,
});

function Reviews() {
  const { reviews, applications } = useStore();
  const [q, setQ] = useState("");

  const companies = useMemo(() => {
    const groups = {};
    applications.forEach((a) => { groups[a.company] ??= []; });
    reviews.forEach((r) => (groups[r.company] ??= []).push(r));
    return Object.entries(groups)
      .map(([name, list]) => ({
        name,
        count: list.length,
        overall: (avg(list, "culture") + avg(list, "speed") + (6 - avg(list, "difficulty"))) / 3,
        difficulty: avg(list, "difficulty"),
      }))
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => b.count - a.count);
  }, [reviews, applications, q]);

  return (
    <>
      <PageHeader title="Company reviews" subtitle="Community experiences and external company reviews.">
        <Button asChild><Link to="/dashboard/reviews/submit"><Plus /> Submit review</Link></Button>
      </PageHeader>
      <Input placeholder="Search companies…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-6 max-w-sm bg-card" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((c) => (
          <article key={c.name} className="surface grid content-start gap-3 p-5">
            <Link to="/dashboard/reviews/$company" params={{ company: slug(c.name) }} className="hover:text-accent"><h3 className="text-2xl font-semibold break-words">{c.name}</h3></Link>
            {c.count > 0 && <>
            <div className="mt-2 flex items-center gap-2">
              <Stars value={c.overall} />
              <span className="text-sm font-semibold">{c.overall.toFixed(1)}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {c.count} review{c.count === 1 ? "" : "s"} · Interview difficulty {c.difficulty.toFixed(1)}/5
            </p>
            </>}
            {c.count === 0 && <p className="text-sm text-muted-foreground">No community reviews yet.</p>}
            <ExternalReviewLinks company={c.name} />
          </article>
        ))}
        {companies.length === 0 && <p className="text-muted-foreground">No companies found.</p>}
      </div>
    </>
  );
}
