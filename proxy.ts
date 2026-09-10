import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Supabase timeout after ${ms}ms`)), ms)
    ),
  ]);
}

async function getProfile(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
) {
  return supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single();
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user: { id: string } | null = null;

  try {
    const {
      data: { user: authUser },
    } = await withTimeout(
      supabase.auth.getUser(),
      SUPABASE_TIMEOUT_MS
    );
    user = authUser;
  } catch {
    console.error("[proxy] supabase.auth.getUser() failed, allowing request through");
  }

  const url = request.nextUrl;
  const pathname = url.pathname;

  // === Admin routes ===
  const isAdminLogin = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !isAdminLogin) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const { data: profile } = await withTimeout(
        getProfile(supabase, user.id) as Promise<{ data: { role: string } | null; error: unknown }>,
        SUPABASE_TIMEOUT_MS
      );

      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login?error=session_error", request.url));
    }
  }

  if (isAdminLogin && user) {
    try {
      const { data: profile } = await withTimeout(
        getProfile(supabase, user.id) as Promise<{ data: { role: string } | null; error: unknown }>,
        SUPABASE_TIMEOUT_MS
      );

      if (profile && profile.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    } catch {
      // Allow login page to load if Supabase is slow
    }
  }

  // === Donor routes ===
  const isDonorLogin = pathname === "/donor/login";
  const isDonorRegister = pathname === "/donor/register";
  const isDonorAuthPage = isDonorLogin || isDonorRegister;
  const isDonorRoute = pathname.startsWith("/donor");

  if (isDonorRoute && !isDonorAuthPage) {
    if (!user) {
      return NextResponse.redirect(new URL("/donor/login", request.url));
    }
  }

  if (isDonorAuthPage && user) {
    return NextResponse.redirect(new URL("/donor/dashboard", request.url));
  }

  return supabaseResponse;
}

// For backwards compatibility during transition
export async function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: ["/admin/:path*", "/donor/:path*"],
};
