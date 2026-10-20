import { Star } from "lucide-react";
import { STATUSES } from "@/lib/store";

const statusStyles = {
  pending: "bg-status-pending/15 text-foreground border-status-pending/40",
  interview: "bg-status-interview/15 text-status-interview border-status-interview/40",
  offer: "bg-status-offer/15 text-status-offer border-status-offer/40",
  rejected: "bg-status-rejected/15 text-status-rejected border-status-rejected/40",
};

export function StatusBadge({ status }) {
  const label = STATUSES.find((s) => s.value === status)?.label ?? status;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status] ?? ""}`}>
      {label}
    </span>
  );
}

export function Stars({ value, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= Math.round(value) ? "fill-star text-star" : "text-border"}
        />
      ))}
    </span>
  );
}

export function StarInput({ value, onChange, label }) {
  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button type="button" key={i} onClick={() => onChange(i)} aria-label={`${label} ${i}`}>
            <Star className={`h-6 w-6 transition ${i <= value ? "fill-star text-star" : "text-border hover:text-star"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
