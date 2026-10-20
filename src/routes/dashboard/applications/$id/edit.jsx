import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ApplicationForm } from "@/components/ApplicationForm";
import { PageHeader } from "@/components/common";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard/applications/$id/edit")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Edit Application — OpportUnity" },
      { name: "description", content: "Edit an internship application." },
      { property: "og:title", content: "Edit Application — OpportUnity" },
      { property: "og:description", content: "Edit an internship application." },
    ],
  }),
  component: EditApplication,
});

function EditApplication() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const app = useStore().applications.find((a) => a.id === id);

  if (!app) return <p>Application not found. <Link to="/dashboard/applications" className="text-accent">Back</Link></p>;

  return (
    <>
      <PageHeader title={`Edit: ${app.company}`} />
      <ApplicationForm
        key={app.id}
        initial={app}
        submitLabel="Save changes"
        onCancel={() => navigate({ to: "/dashboard/applications/$id", params: { id } })}
        onSubmit={(form) => {
          actions.updateApplication(id, form);
          toast.success("Changes saved");
          navigate({ to: "/dashboard/applications/$id", params: { id } });
        }}
      />
    </>
  );
}
