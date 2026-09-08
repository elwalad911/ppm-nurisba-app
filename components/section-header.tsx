import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 sm:mb-12 lg:mb-16",
        centered && "text-center",
        className
      )}
    >
      <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-text-secondary sm:text-lg max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
