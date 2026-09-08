"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart, Lock, Mail, User, Loader2 } from "lucide-react";

export function DonorRegisterClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (authError || !authData.user) {
      setError(authError?.message || "Gagal mendaftarkan akun.");
      setIsLoading(false);
      return;
    }

    // Ensure profile row with role='donor' (hardcoded) is created
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: authData.user.id,
      name,
      email,
      role: "donor", // Hardcoded 'donor' — client cannot set 'admin'
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
    }

    router.push("/donor/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary mb-3">
            <Heart className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Daftar Donatur</h1>
          <p className="text-sm text-text-secondary mt-1">
            Buat akun untuk mengelola riwayat wakaf dan donasi Anda
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-danger-soft p-4 text-sm text-danger font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="flex h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="flex h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-strong text-white h-11 font-semibold mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Daftar Akun"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-text-secondary">
          Sudah punya akun?{" "}
          <Link href="/donor/login" className="font-semibold text-primary hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
