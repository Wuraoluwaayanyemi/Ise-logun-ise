import { useState } from "react";
import { Linkedin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { STATUSES } from "@/lib/store";

const empty = {
  company: "", title: "", url: "", location: "", salary: "", status: "pending",
  dateApplied: "", deadline: "", description: "", notes: "", connections: [],
};

export function ApplicationForm({ initial, onSubmit, onCancel, submitLabel = "Save" }) {
  const [form, setForm] = useState({ ...empty, ...initial });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setConnection = (index, key, value) => setForm((f) => ({
    ...f, connections: f.connections.map((contact, i) => i === index ? { ...contact, [key]: value } : contact),
  }));

  return (
    <form
      className="surface grid gap-6 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <fieldset className="grid gap-4 md:grid-cols-2">
        <legend className="mb-2 text-lg font-semibold">Company details</legend>
        <label><span className="field-label">Company name *</span><Input required value={form.company} onChange={set("company")} /></label>
        <label><span className="field-label">Job title *</span><Input required value={form.title} onChange={set("title")} /></label>
        <label><span className="field-label">Job URL</span><Input type="url" value={form.url} onChange={set("url")} /></label>
        <label><span className="field-label">Location</span><Input value={form.location} onChange={set("location")} /></label>
      </fieldset>

      <label>
        <span className="field-label">Job description</span>
        <Textarea rows={6} value={form.description} onChange={set("description")} placeholder="Paste the job description…" />
        <span className="mt-1 block text-xs text-muted-foreground">{form.description.length} characters</span>
      </label>

      <fieldset className="grid gap-4 md:grid-cols-2">
        <legend className="mb-2 text-lg font-semibold">Application info</legend>
        <label><span className="field-label">Date applied</span><Input type="date" value={form.dateApplied} onChange={set("dateApplied")} /></label>
        <label><span className="field-label">Deadline</span><Input type="date" value={form.deadline} onChange={set("deadline")} /></label>
        <label>
          <span className="field-label">Status</span>
          <select className="native-select w-full" value={form.status} onChange={set("status")}>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label><span className="field-label">Salary</span><Input value={form.salary} onChange={set("salary")} placeholder="e.g. €2,500/month" /></label>
      </fieldset>

      <fieldset className="grid gap-4 border-t pt-6">
        <legend className="flex items-center gap-2 text-lg font-semibold"><Linkedin className="h-5 w-5" /> LinkedIn connections</legend>
        {form.connections.map((contact, index) => (
          <div key={index} className="grid gap-4 border-b pb-4 md:grid-cols-2">
            <label><span className="field-label">Connection name *</span><Input required value={contact.name} onChange={(e) => setConnection(index, "name", e.target.value)} /></label>
            <label><span className="field-label">Role / relationship</span><Input value={contact.role} onChange={(e) => setConnection(index, "role", e.target.value)} placeholder="Recruiter, alumni, employee…" /></label>
            <label className="md:col-span-2"><span className="field-label">LinkedIn profile URL</span><Input type="url" pattern="https://([a-zA-Z0-9-]+\.)?linkedin\.com/.*" title="Enter a LinkedIn URL beginning with https://" value={contact.url} onChange={(e) => setConnection(index, "url", e.target.value)} placeholder="https://www.linkedin.com/in/…" /></label>
            <label className="md:col-span-2"><span className="field-label">Connection notes</span><Textarea rows={2} value={contact.notes} onChange={(e) => setConnection(index, "notes", e.target.value)} /></label>
            <Button type="button" variant="ghost" size="sm" className="justify-self-start" onClick={() => setForm((f) => ({ ...f, connections: f.connections.filter((_, i) => i !== index) }))}><Trash2 /> Remove connection</Button>
          </div>
        ))}
        <Button type="button" variant="outline" className="justify-self-start" onClick={() => setForm((f) => ({ ...f, connections: [...f.connections, { name: "", role: "", url: "", notes: "" }] }))}><Plus /> Add connection</Button>
      </fieldset>

      <label>
        <span className="field-label">Notes</span>
        <Textarea rows={3} value={form.notes} onChange={set("notes")} />
      </label>

      <div className="flex gap-3">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
