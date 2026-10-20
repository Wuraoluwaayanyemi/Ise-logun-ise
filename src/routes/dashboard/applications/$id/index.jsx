import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Linkedin, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common";
import { actions, formatDate, slug, useStore, STATUSES } from "@/lib/store";
import { ExternalReviewLinks } from "@/components/ExternalReviewLinks";
import { safeWebUrl } from "@/lib/links";

export const Route = createFileRoute("/dashboard/applications/$id/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Application Details — OpportUnity" },
      { name: "description", content: "Details and status of an internship application." },
      { property: "og:title", content: "Application Details — OpportUnity" },
      { property: "og:description", content: "Details and status of an internship application." },
    ],
  }),
  component: ApplicationDetail,
});

function ApplicationDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const app = useStore().applications.find((a) => a.id === id);

  if (!app) return <p>Application not found. <Link to="/dashboard/applications" className="text-accent">Back</Link></p>;

  const info = [
    ["Applied", formatDate(app.dateApplied)],
    ["Deadline", formatDate(app.deadline)],
    ["Salary", app.salary || "—"],
    ["Location", app.location || "—"],
  ];

  return (
    <>
      <Link to="/dashboard/applications" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All applications
      </Link>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold">{app.company}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{app.title}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/dashboard/applications/$id/edit" params={{ id }}><Pencil /> Edit</Link></Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (!window.confirm("Delete this application?")) return;
              actions.deleteApplication(id);
              toast.success("Application deleted");
              navigate({ to: "/dashboard/applications" });
            }}
          >
            <Trash2 /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="surface space-y-5 p-6">
          <div>
            <p className="field-label">Status</p>
            <div className="flex items-center gap-3">
              <StatusBadge status={app.status} />
              <select
                className="native-select"
                value={app.status}
                onChange={(e) => {
                  actions.updateApplication(id, { status: e.target.value });
                  toast.success("Status updated");
                }}
              >
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          {info.map(([k, v]) => (
            <div key={k}>
              <p className="field-label">{k}</p>
              <p className="font-medium">{v}</p>
            </div>
          ))}
          {app.url && (
            <a href={app.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
              Job posting <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <Link to="/dashboard/reviews/$company" params={{ company: slug(app.company) }} className="block text-sm font-medium text-accent">
            Read {app.company} reviews →
          </Link>
          <ExternalReviewLinks company={app.company} />
        </div>

        <div className="space-y-6 md:col-span-2">
          <section className="border-b pb-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold"><Linkedin className="h-5 w-5" /> LinkedIn connections</h2>
            {(app.connections || []).length === 0 && <p className="mt-3 text-sm text-muted-foreground">No connections added.</p>}
            <ul className="mt-3 divide-y">
              {(app.connections || []).map((contact, index) => (
                <li key={index} className="py-3">
                  <p className="font-semibold break-words">{contact.name}</p>
                  {contact.role && <p className="text-sm text-muted-foreground break-words">{contact.role}</p>}
                  {safeWebUrl(contact.url) && <Button asChild variant="link" size="sm" className="px-0"><a href={safeWebUrl(contact.url)} target="_blank" rel="noopener noreferrer">LinkedIn profile <ExternalLink /></a></Button>}
                  {contact.notes && <p className="mt-2 whitespace-pre-wrap break-words text-sm">{contact.notes}</p>}
                </li>
              ))}
            </ul>
          </section>
          <section className="surface p-6">
            <h2 className="text-xl font-semibold">Job description</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{app.description || "No description added."}</p>
          </section>
          <section className="surface p-6">
            <h2 className="text-xl font-semibold">Notes</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{app.notes || "No notes yet."}</p>
          </section>
        </div>
      </div>
    </>
  );
}
