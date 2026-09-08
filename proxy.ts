import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

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

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl;
  const isLoginPage = url.pathname === "/admin/login";
  const isAdminRoute = url.pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Check if user has admin role in public.profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      // Not an admin, sign out and redirect to login with error
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
    }
  }

  if (isLoginPage && user) {
    // If already logged in as admin, redirect to admin dashboard
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile && profile.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

// For backwards compatibility during transition
export async function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
