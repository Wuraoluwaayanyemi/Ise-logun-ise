import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ApplicationForm } from "@/components/ApplicationForm";
import { PageHeader } from "@/components/common";
import { actions } from "@/lib/store";

export const Route = createFileRoute("/dashboard/applications/new")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Add Application — OpportUnity" },
      { name: "description", content: "Add a new internship application." },
      { property: "og:title", content: "Add Application — OpportUnity" },
      { property: "og:description", content: "Add a new internship application." },
    ],
  }),
  component: NewApplication,
});

function NewApplication() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Add new application" />
      <ApplicationForm
        submitLabel="Add application"
        onCancel={() => navigate({ to: "/dashboard/applications" })}
        onSubmit={(form) => {
          const id = actions.addApplication(form);
          toast.success("Application added");
          navigate({ to: "/dashboard/applications/$id", params: { id } });
        }}
      />
    </>
  );
}
