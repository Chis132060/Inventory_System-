import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
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
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do NOT run any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could lead to hard-to-debug
  // session refresh issues.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/auth/callback"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If not authenticated and not on a public route → redirect to login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If authenticated, check role-based redirects
  if (user) {
    // Get the user's role from the profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "UNASSIGNED";

    // If on login page and authenticated → redirect based on role
    if (pathname === "/login") {
      const url = request.nextUrl.clone();
      if (role === "ADMIN") {
        url.pathname = "/admin/dashboard";
      } else if (role === "UNASSIGNED") {
        url.pathname = "/waiting-approval";
      } else {
        // Future: redirect other roles to their dashboards
        url.pathname = "/waiting-approval";
      }
      return NextResponse.redirect(url);
    }

    // UNASSIGNED users can only access /waiting-approval
    if (role === "UNASSIGNED" && !pathname.startsWith("/waiting-approval")) {
      const url = request.nextUrl.clone();
      url.pathname = "/waiting-approval";
      return NextResponse.redirect(url);
    }

    // Non-admin users cannot access /admin routes
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/waiting-approval";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
