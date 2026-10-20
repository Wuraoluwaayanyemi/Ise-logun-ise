import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reviewSearchUrl } from "@/lib/links";

export function ExternalReviewLinks({ company }) {
  return (
    <div className="flex flex-wrap gap-2">
      {[["Glassdoor", "glassdoor.com"], ["Reddit", "reddit.com"]].map(([label, site]) => (
        <Button key={site} asChild variant="outline" size="sm">
          <a href={reviewSearchUrl(company, site)} target="_blank" rel="noopener noreferrer" aria-label={site === "reddit.com" ? `Find ${company} conversations on Reddit` : `Find ${company} reviews on ${label}`}>
            {label} <ExternalLink />
          </a>
        </Button>
      ))}
    </div>
  );
}