"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function adminRequest(url, { body, ...options } = {}) {
  const response = await fetch(url, {
    ...options, credentials: "same-origin", cache: "no-store",
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...options.headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") window.dispatchEvent(new Event("admin:session-expired"));
    throw new ApiError(response.status === 401 ? "Your session has expired. Please sign in again." : data?.error || "The request could not be completed. Please try again.", response.status);
  }
  if (!data) throw new ApiError("The server returned an invalid response. Please try again.", response.status);
  return data;
}

export function useAdminQuery(resource, path, params = {}) {
  const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== "" && value != null));
  return useQuery({
    queryKey: ["admin", resource, params],
    queryFn: ({ signal }) => adminRequest(`${path}${search.size ? `?${search}` : ""}`, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminMutation(resource) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ url, method, body }) => adminRequest(url, { method, body }),
    onSuccess: async () => {
      const affected = new Set([resource, "stats"]);
      if (resource === "products" || resource === "categories") { affected.add("products"); affected.add("categories"); }
      await Promise.all([...affected].map((key) => client.invalidateQueries({ queryKey: ["admin", key] })));
    },
  });
}
