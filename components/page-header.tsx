import { cn } from "@/lib/utils";
import { Container } from "@/components/container";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <section
      className={cn(
        "bg-primary-soft pt-28 pb-12 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20",
        className
      )}
    >
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
