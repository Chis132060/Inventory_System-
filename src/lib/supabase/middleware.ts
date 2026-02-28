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

    // Map each role to its dashboard home
    const roleDashboard: Record<string, string> = {
      ADMIN: "/admin/dashboard",
      SUPERVISOR: "/supervisor/dashboard",
      INVENTORY_MANAGER: "/inventory-manager/dashboard",
      SALESMAN: "/salesman/dashboard",
      BUYER: "/buyer/dashboard",
    };

    // Map each role to the route prefix it is allowed to access
    const rolePrefix: Record<string, string> = {
      ADMIN: "/admin",
      SUPERVISOR: "/supervisor",
      INVENTORY_MANAGER: "/inventory-manager",
      SALESMAN: "/salesman",
      BUYER: "/buyer",
    };

    const dashboard = roleDashboard[role] || "/waiting-approval";

    // If on login page and authenticated → redirect based on role
    if (pathname === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = dashboard;
      return NextResponse.redirect(url);
    }

    // UNASSIGNED users can only access /waiting-approval
    if (role === "UNASSIGNED" && !pathname.startsWith("/waiting-approval")) {
      const url = request.nextUrl.clone();
      url.pathname = "/waiting-approval";
      return NextResponse.redirect(url);
    }

    // Approved users should not access /waiting-approval
    if (role !== "UNASSIGNED" && pathname.startsWith("/waiting-approval")) {
      const url = request.nextUrl.clone();
      url.pathname = dashboard;
      return NextResponse.redirect(url);
    }

    // Route-level protection: each role can only access its own prefix
    // ADMIN can access all routes
    if (role !== "ADMIN" && role !== "UNASSIGNED") {
      const allowedPrefix = rolePrefix[role];
      const protectedPrefixes = Object.values(rolePrefix);
      const isProtectedRoute = protectedPrefixes.some((prefix) =>
        pathname.startsWith(prefix),
      );

      if (isProtectedRoute && !pathname.startsWith(allowedPrefix)) {
        const url = request.nextUrl.clone();
        url.pathname = dashboard;
        return NextResponse.redirect(url);
      }
    }

    // Non-admin users cannot access /admin routes
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = dashboard;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
