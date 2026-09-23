"use client";

import { useEffect } from "react";

/** Registers the PWA service worker in production builds. */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal: the site works fully without the service worker.
      });
    }
  }, []);
  return null;
}
