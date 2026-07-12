import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all static files (e.g. favicon.ico, next.svg, images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|sitemap.xml|robots.txt).*)",
  ],
};

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "localhost:3000";

  // Get the pathname (e.g. /products, /cart)
  const path = url.pathname;

  // Normalize host (remove port number if present)
  const currentHost = hostname.replace(/:\d+$/, "");

  let subdomain = "";

  const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(currentHost) || currentHost === '::1';

  if (isIP || currentHost === "localhost") {
    // No subdomain possible for raw IP or pure localhost
    subdomain = "";
  } else if (currentHost.includes("localhost")) {
    // Handling localhost development (e.g. vendor1.localhost:3000)
    const parts = currentHost.split(".");
    if (parts.length > 1 && parts[parts.length - 1] === "localhost") {
      subdomain = parts.slice(0, parts.length - 1).join(".");
    }
  } else {
    // Handling production domain (e.g. vendor1.vendornest.com)
    const parts = currentHost.split(".");
    if (parts.length > 2 && parts[0] !== "www" && !currentHost.endsWith(".vercel.app")) {
      subdomain = parts.slice(0, parts.length - 2).join(".");
    }
  }

  // If a vendor subdomain is found, rewrite the request path
  // to the tenant-specific dynamic path: /_sites/[domain]/...
  if (subdomain && subdomain !== "www") {
    return NextResponse.rewrite(new URL(`/_sites/${subdomain}${path}`, req.url));
  }

  // --- RBAC (Role-Based Access Control) ---
  const userCookie = req.cookies.get("user")?.value;
  let userRole = "";
  if (userCookie) {
    try {
      const userObj = JSON.parse(decodeURIComponent(userCookie));
      userRole = userObj.role || "";
    } catch (e) {
      // Ignore parse errors
    }
  }

  // Protect Admin routes
  if (path.startsWith("/admin") && userRole !== "admin") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "unauthorized_admin");
    return NextResponse.redirect(loginUrl);
  }

  // Protect Seller routes (except public info routes)
  const isPublicSellerRoute = path === "/seller/pricing" || path === "/seller/faq";
  if (path.startsWith("/seller") && !isPublicSellerRoute && userRole !== "seller") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "unauthorized_seller");
    return NextResponse.redirect(loginUrl);
  }

  // Fallback to normal routing for the main platform site
  return NextResponse.next();
}
