import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DonorProfileClient } from "./donor-profile-client";

export const metadata: Metadata = {
  title: "Profil Donatur — Portal Donatur",
};

export const revalidate = 0;

export default async function DonorProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return <DonorProfileClient profile={profile || { name: "", email: user.email }} />;
}
