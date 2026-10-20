import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stars, StatusBadge } from "@/components/common";
import { actions, avg, formatDate, slug, useStore } from "@/lib/store";
import { ExternalReviewLinks } from "@/components/ExternalReviewLinks";

export const Route = createFileRoute("/dashboard/reviews/$company")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Company Interview Experiences — OpportUnity" },
      { name: "description", content: "Interview process, culture and feedback speed ratings from students." },
      { property: "og:title", content: "Company Interview Experiences — OpportUnity" },
      { property: "og:description", content: "Interview process, culture and feedback speed ratings." },
    ],
  }),
  component: CompanyReviews,
});

function CompanyReviews() {
  const { company } = Route.useParams();
  const { reviews, applications } = useStore();
  const [level, setLevel] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState("recent");

  const all = reviews.filter((r) => slug(r.company) === company);
  const name = all[0]?.company ?? applications.find((a) => slug(a.company) === company)?.company ?? company;
  const years = [...new Set(all.map((r) => r.year))].sort().reverse();

  const list = useMemo(
    () =>
      all
        .filter((r) => (level === "all" || r.roleLevel === level) && (year === "all" || r.year === year))
        .sort((a, b) => (sort === "helpful" ? b.votes - a.votes : b.createdAt.localeCompare(a.createdAt))),
    [all, level, year, sort],
  );

  const ratings = [
    ["Interview difficulty", avg(all, "difficulty")],
    ["Company culture", avg(all, "culture")],
    ["Feedback speed", avg(all, "speed")],
  ];

  return (
    <>
      <Link to="/dashboard/reviews" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All companies
      </Link>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold capitalize">{name}</h1>
          <p className="mt-1 text-muted-foreground">{all.length} review{all.length === 1 ? "" : "s"}</p>
        </div>
        <Button asChild><Link to="/dashboard/reviews/submit" search={{ company: name }}>Submit review</Link></Button>
      </div>

      <div className="mb-6"><ExternalReviewLinks company={name} /></div>

      {all.length === 0 ? (
        <p className="surface p-6 text-muted-foreground">No reviews for this company yet. Be the first!</p>
      ) : (
        <>
          <section className="surface grid gap-4 p-6 md:grid-cols-3">
            {ratings.map(([label, v]) => (
              <div key={label}>
                <p className="field-label">{label}</p>
                <div className="flex items-center gap-2"><Stars value={v} size={18} /><span className="font-semibold">{v.toFixed(1)}</span></div>
              </div>
            ))}
          </section>

          <div className="mt-6 flex flex-wrap gap-3">
            <select className="native-select" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="all">Role: All</option>
              <option value="Intern">Intern</option>
              <option value="Placement">Placement</option>
              <option value="Graduate">Graduate</option>
            </select>
            <select className="native-select" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="all">Year: All</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className="native-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recent">Sort: Recent</option>
              <option value="helpful">Sort: Most helpful</option>
            </select>
          </div>

          <div className="mt-6 grid gap-4">
            {list.map((r) => (
              <article key={r.id} className="surface p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{r.role}</h3>
                    <p className="text-xs text-muted-foreground">
                      {r.anonymous ? "Anonymous" : r.author || "Student"} · {r.roleLevel} · {r.year} · {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={r.outcome} />
                </div>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <span className="flex items-center gap-2">Difficulty <Stars value={r.difficulty} /></span>
                  <span className="flex items-center gap-2">Culture <Stars value={r.culture} /></span>
                  <span className="flex items-center gap-2">Speed <Stars value={r.speed} /></span>
                </div>
                <p className="field-label mt-4">Interview process</p>
                <p className="text-sm">{r.process}</p>
                {r.timeline && <p className="mt-2 text-sm text-muted-foreground">Timeline: {r.timeline}</p>}
                {r.comments && <p className="mt-2 text-sm italic text-muted-foreground">"{r.comments}"</p>}
                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => actions.voteReview(r.id, 1)}><ThumbsUp /> Helpful</Button>
                  <Button size="sm" variant="ghost" onClick={() => actions.voteReview(r.id, -1)}><ThumbsDown /></Button>
                  <span className="text-sm font-semibold">{r.votes}</span>
                </div>
              </article>
            ))}
            {list.length === 0 && <p className="text-muted-foreground">No reviews match these filters.</p>}
          </div>
        </>
      )}
    </>
  );
}
