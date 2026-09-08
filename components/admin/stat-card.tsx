import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text-secondary">{title}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold tracking-tight text-text-primary tabular-nums sm:text-3xl">
          {value}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-text-muted">{description}</p>
        )}
      </div>
    </div>
  );
}
