"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          if (process.env.NODE_ENV !== "production") {
            console.log("[ExpenseIQ SW] Service Worker registered with scope:", registration.scope);
          }
        } catch (error) {
          console.error("[ExpenseIQ SW] Service Worker registration failed:", error);
        }
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW, { once: true });
      }
    }
  }, []);

  return null;
}
