import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-6 lg:p-10 md:pt-6 lg:pt-10">
        {children}
      </main>
    </div>
  );
}