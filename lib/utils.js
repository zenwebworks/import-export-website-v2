import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function refCode(id, prefix = "MGT") {
  if (!id) return "";
  return `${prefix}-${String(id).slice(-6).toUpperCase()}`;
}
