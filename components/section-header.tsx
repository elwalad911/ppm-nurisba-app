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
      <h2 className="text-[24px] md:text-[32px] font-bold leading-[1.3] md:leading-[1.2] tracking-[-0.01em] text-on-surface">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-base leading-[1.6] text-on-surface-variant max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
