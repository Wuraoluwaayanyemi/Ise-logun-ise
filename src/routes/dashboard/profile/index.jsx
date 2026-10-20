import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Github, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common";
import { actions, useStore } from "@/lib/store";
import { safeWebUrl } from "@/lib/links";

export const Route = createFileRoute("/dashboard/profile/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Profile — OpportUnity" },
      { name: "description", content: "Your education, resume and skills." },
      { property: "og:title", content: "Profile — OpportUnity" },
      { property: "og:description", content: "Your education, resume and skills." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { profile } = useStore();
  const [skill, setSkill] = useState("");
  const update = (k) => (e) => actions.updateProfile({ [k]: e.target.value });

  const addSkill = () => {
    const s = skill.trim();
    if (!s || profile.skills.includes(s)) return;
    actions.updateProfile({ skills: [...profile.skills, s] });
    setSkill("");
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Changes save automatically." />
      <div className="grid gap-6 md:grid-cols-2">
        <section className="surface grid gap-4 p-6">
          <h2 className="text-xl font-semibold">Education</h2>
          <label><span className="field-label">Name</span><Input value={profile.name} onChange={update("name")} /></label>
          <label><span className="field-label">Major</span><Input value={profile.major} onChange={update("major")} /></label>
          <label>
            <span className="field-label">Graduation year</span>
            <select className="native-select w-full" value={profile.gradYear} onChange={update("gradYear")}>
              {["2026", "2027", "2028", "2029", "2030"].map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>
        </section>

        <section className="grid content-start gap-4 border-t pt-6 md:border-t-0 md:border-l md:pl-6 md:pt-0">
          <h2 className="flex items-center gap-2 text-xl font-semibold"><Github className="h-5 w-5" /> Resume link</h2>
          <label>
            <span className="field-label">GitHub resume URL</span>
            <Input type="url" value={profile.resumeUrl} onChange={update("resumeUrl")} placeholder="https://github.com/username/resume/blob/main/resume.pdf" aria-invalid={Boolean(profile.resumeUrl && !safeWebUrl(profile.resumeUrl))} />
          </label>
          {profile.resumeUrl && !safeWebUrl(profile.resumeUrl) && <p className="text-sm text-destructive">Enter a complete http:// or https:// link.</p>}
          {safeWebUrl(profile.resumeUrl) && <Button asChild variant="outline" className="justify-self-start"><a href={safeWebUrl(profile.resumeUrl)} target="_blank" rel="noopener noreferrer">Open resume <ExternalLink /></a></Button>}
          {profile.resumeUrl && <Button variant="ghost" size="sm" className="justify-self-start" onClick={() => actions.updateProfile({ resumeUrl: "" })}><X /> Remove link</Button>}
        </section>

        <section className="grid gap-4 border-t pt-6 md:col-span-2">
          <h2 className="text-xl font-semibold">Resume content</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["resumeSummary", "Professional summary", "A short summary of your background and goals…", 4],
              ["resumeEducation", "Education", "University, degree, dates and achievements…", 4],
              ["resumeExperience", "Work experience", "Roles, organisations, dates and accomplishments…", 6],
              ["resumeProjects", "Projects", "Project names, links, technologies and contributions…", 6],
              ["resumeCertification", "Certification", "Certification names, issuing organisations and dates…", 4],
              ["resumeReferences", "References", "Names, roles, contact details and your professional relationship…", 4],
            ].map(([key, label, placeholder, rows]) => (
              <label key={key}><span className="field-label">{label}</span><Textarea rows={rows} value={profile[key]} onChange={update(key)} placeholder={placeholder} /></label>
            ))}
          </div>
        </section>

        <section className="surface grid content-start gap-4 p-6 md:col-span-2">
          <h2 className="text-xl font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                {s}
                 <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => actions.updateProfile({ skills: profile.skills.filter((x) => x !== s) })} aria-label={`Remove ${s}`}>
                  <X className="h-3.5 w-3.5" />
                 </Button>
              </span>
            ))}
          </div>
          <div className="flex max-w-sm gap-2">
            <Input value={skill} placeholder="Add a skill" onChange={(e) => setSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} />
            <Button onClick={addSkill}>Add</Button>
          </div>
        </section>
      </div>
    </>
  );
}
