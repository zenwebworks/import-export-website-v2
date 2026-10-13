"use client";

import { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function AdminProvider({ children }) {
  const redirecting = useRef(false);
  const [client] = useState(() => new QueryClient({ defaultOptions: {
    queries: { staleTime: 30_000, gcTime: 5 * 60_000, retry: (attempt, error) => attempt < 1 && (!error.status || error.status >= 500), refetchOnWindowFocus: true, refetchOnReconnect: true },
    mutations: { retry: false },
  } }));
  useEffect(() => {
    function expireSession() {
      if (redirecting.current) return;
      redirecting.current = true;
      const callback = window.location.pathname + window.location.search;
      client.cancelQueries().finally(() => {
        client.clear();
        window.location.replace(`/admin/login?callbackUrl=${encodeURIComponent(callback)}`);
      });
    }
    window.addEventListener("admin:session-expired", expireSession);
    return () => window.removeEventListener("admin:session-expired", expireSession);
  }, [client]);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
