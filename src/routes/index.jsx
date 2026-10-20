import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ListChecks, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ise l'ogun Ise — Internship Application Tracker" },
      { name: "description", content: "Track every internship application in one place and read real company reviews about hiring." },
      { property: "og:title", content: "Ise l'ogun Ise — Internship Application Tracker" },
      { property: "og:description", content: "Track every internship application and read real company reviews." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="hero-bg min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl font-semibold">Ise l'ogun Ise</span>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-28">
        <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-accent">Internship Application Tracker</p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] md:text-7xl">
          Every application. <em className="text-primary">In one place</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Track all your internship applications and read real reviews from students about hiring processes and daily life at each company.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/dashboard">
              Get started <ArrowRight />
            </Link>
          </Button>
         
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 md:grid-cols-3">
        {[
          { icon: ListChecks, title: "Track all applications", text: "Statuses, deadlines and notes for every role you apply to." },
          { icon: MessageSquareText, title: "Company reviews", text: "Interview difficulty, culture and feedback speed from real students." },
          { icon: CheckCircle2, title: "See your progress", text: "Your applications, interviews and offers at a glance." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="surface p-6">
            <Icon className="h-6 w-6 text-accent" />
            <h3 className="mt-4 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-6 py-6 text-sm text-muted-foreground">
          <span>© 2026 Ise l'ogun Ise</span>
          <div className="flex gap-6">
          </div>
        </div>
      </footer>
    </div>
  );
}
