import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "text-center md:text-left space-y-4 max-w-3xl",
        className
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center justify-center md:justify-start gap-2 text-on-surface-variant text-xs mb-4">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && (
                <ChevronRight className="h-4 w-4 text-outline-variant" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-primary transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-primary font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <h1 className="text-[36px] md:text-[48px] font-extrabold leading-[1.2] md:leading-[1.1] tracking-[-0.02em] text-primary-strong">
        {title}
      </h1>

      {description && (
        <p className="text-lg leading-[1.6] text-on-surface-variant max-w-2xl">
          {description}
        </p>
      )}
    </section>
  );
}
