"use client";

import { useEffect } from "react";

export default function TabSessionProvider() {
  useEffect(() => {
    // 1. Clean up legacy shared localStorage tokens to prevent cross-tab bleeding
    try {
      localStorage.removeItem("smartestate_user");
      localStorage.removeItem("smartestate_token");
      // Clear legacy global cookie if present
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (e) {
      // ignore in environments where storage is restricted
    }

    // 2. Ensure window.fetch is intercepted to auto-inject the tab's Bearer token
    if (typeof window !== "undefined" && !(window as any).__tab_fetch_interceptor_active) {
      (window as any).__tab_fetch_interceptor_active = true;
      const originalFetch = window.fetch;

      window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
        try {
          const token = sessionStorage.getItem("smartestate_token");
          if (token) {
            const urlStr =
              typeof input === "string"
                ? input
                : input instanceof URL
                ? input.toString()
                : (input as Request).url;

            if (
              urlStr.startsWith("/api/") ||
              urlStr.startsWith(window.location.origin + "/api/")
            ) {
              init = init || {};
              const headers = new Headers(init.headers || {});
              if (!headers.has("Authorization")) {
                headers.set("Authorization", `Bearer ${token}`);
              }
              init.headers = headers;
            }
          }
        } catch (err) {
          console.error("Tab auth fetch error:", err);
        }
        return originalFetch.call(this, input, init);
      };
    }
  }, []);

  return null;
}
