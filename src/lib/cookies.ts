export function setCookie(name: string, value: string, days?: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  let domain = "";
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // Scoping to .localhost for local dev subdomain sharing
    if (hostname.endsWith("localhost")) {
      domain = "; domain=.localhost";
    } else if (!hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      // Production domain sharing (e.g. sub.vendornest.com -> .vendornest.com)
      const parts = hostname.split(".");
      if (parts.length > 2) {
        const domainSuffix = parts.slice(-2).join(".");
        // Do not set wildcard cookies on public suffixes like vercel.app
        if (domainSuffix !== "vercel.app" && domainSuffix !== "herokuapp.com" && domainSuffix !== "github.io") {
          domain = `; domain=.${domainSuffix}`;
        }
      }
    }
  }

  document.cookie = `${name}=${value || ""}${expires}; path=/${domain}`;
}

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  if (typeof document === "undefined") return null;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name: string) {
  let domain = "";
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname.endsWith("localhost")) {
      domain = "; domain=.localhost";
    } else if (!hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      const parts = hostname.split(".");
      if (parts.length > 2) {
        const domainSuffix = parts.slice(-2).join(".");
        if (domainSuffix !== "vercel.app" && domainSuffix !== "herokuapp.com" && domainSuffix !== "github.io") {
          domain = `; domain=.${domainSuffix}`;
        }
      }
    }
  }
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;${domain}`;
}
