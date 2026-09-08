import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1280px] px-4 md:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}
