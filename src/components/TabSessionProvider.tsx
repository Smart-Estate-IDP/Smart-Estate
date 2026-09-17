"use client";

import { useEffect } from "react";

export default function TabSessionProvider() {
  useEffect(() => {
    // 1. Hydrate sessionStorage from localStorage if this tab is freshly opened or reloaded
    try {
      if (!sessionStorage.getItem("smartestate_token")) {
        const localToken = localStorage.getItem("smartestate_token");
        const localUser = localStorage.getItem("smartestate_user");
        if (localToken && localUser) {
          sessionStorage.setItem("smartestate_token", localToken);
          sessionStorage.setItem("smartestate_user", localUser);
        }
      }
    } catch {
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
