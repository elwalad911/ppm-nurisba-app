import { DonorSidebar } from "@/components/donor/sidebar";

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DonorSidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">{children}</main>
    </div>
  );
}
