import { cn } from "@/lib/utils";

export function Checkbox({ className, ...props }) {
  return (
    <input
      type="checkbox"
      className={cn("mt-0.5 h-4 w-4 rounded border-input accent-ocean", className)}
      {...props}
    />
  );
}
