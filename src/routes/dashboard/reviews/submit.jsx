import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, StarInput } from "@/components/common";
import { actions, slug, useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard/reviews/submit")({
  validateSearch: (s) => ({ company: typeof s.company === "string" ? s.company : "" }),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Submit a Review — OpportUnity" },
      { name: "description", content: "Share your internship interview experience." },
      { property: "og:title", content: "Submit a Review — OpportUnity" },
      { property: "og:description", content: "Share your internship interview experience." },
    ],
  }),
  component: SubmitReview,
});

function SubmitReview() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { reviews, applications, profile } = useStore();
  const companies = [...new Set([...reviews, ...applications].map((x) => x.company))];
  const [f, setF] = useState({
    company: search.company, role: "", roleLevel: "Intern", outcome: "pending",
    difficulty: 3, culture: 0, speed: 0, process: "", timeline: "", year: "2026",
    comments: "", anonymous: true,
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <PageHeader title="Submit a review" subtitle="Help other students know what to expect." />
      <form
        className="surface grid gap-6 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!f.culture || !f.speed) return toast.error("Please rate culture and feedback speed");
          actions.addReview({ ...f, company: f.company.trim(), difficulty: Number(f.difficulty), author: profile.name });
          toast.success("Thanks for your review!");
          navigate({ to: "/dashboard/reviews/$company", params: { company: slug(f.company) } });
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="field-label">Company *</span>
            <Input required list="companies" value={f.company} onChange={set("company")} />
            <datalist id="companies">{companies.map((c) => <option key={c} value={c} />)}</datalist>
          </label>
          <label><span className="field-label">Role title *</span><Input required value={f.role} onChange={set("role")} /></label>
          <label>
            <span className="field-label">Role level</span>
            <select className="native-select w-full" value={f.roleLevel} onChange={set("roleLevel")}>
              <option>Intern</option><option>Placement</option><option>Graduate</option>
            </select>
          </label>
          <label>
            <span className="field-label">Outcome</span>
            <select className="native-select w-full" value={f.outcome} onChange={set("outcome")}>
              <option value="offer">Offer</option><option value="rejected">Rejected</option><option value="pending">Pending</option>
            </select>
          </label>
          <label>
            <span className="field-label">Year</span>
            <select className="native-select w-full" value={f.year} onChange={set("year")}>
              {["2026", "2025", "2024", "2023"].map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>
          <label><span className="field-label">Timeline</span><Input placeholder="e.g. 3 weeks" value={f.timeline} onChange={set("timeline")} /></label>
        </div>

        <label>
          <span className="field-label">Interview difficulty: {f.difficulty}/5</span>
          <input type="range" min={1} max={5} value={f.difficulty} onChange={set("difficulty")} className="w-full max-w-sm accent-primary" />
        </label>

        <div className="flex flex-wrap gap-8">
          <StarInput label="Company culture" value={f.culture} onChange={(v) => setF((p) => ({ ...p, culture: v }))} />
          <StarInput label="Feedback speed" value={f.speed} onChange={(v) => setF((p) => ({ ...p, speed: v }))} />
        </div>

        <label>
          <span className="field-label">Interview process *</span>
          <Textarea required rows={4} value={f.process} onChange={set("process")} placeholder="Describe each stage…" />
        </label>
        <label>
          <span className="field-label">Additional comments</span>
          <Textarea rows={3} maxLength={500} value={f.comments} onChange={set("comments")} />
          <span className="mt-1 block text-xs text-muted-foreground">{f.comments.length}/500</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.anonymous} onChange={(e) => setF((p) => ({ ...p, anonymous: e.target.checked }))} className="accent-primary" />
          Submit anonymously
        </label>
        <div className="flex gap-3">
          <Button type="submit">Submit review</Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/dashboard/reviews" })}>Cancel</Button>
        </div>
      </form>
    </>
  );
}
