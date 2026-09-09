import type { Metadata } from "next";
import { AdminLoginClient } from "./admin-login-client";

export const metadata: Metadata = {
  title: "Admin Login — PPM Nurisba",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <AdminLoginClient />
  );
}