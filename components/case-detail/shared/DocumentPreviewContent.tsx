import { cn } from "@/lib/utils";

export const DocumentPreviewContent = ({
  variant = "default",
  size = "sm",
}: {
  variant?: "default" | "passport" | "bank" | "letter";
  size?: "sm" | "md" | "lg";
}) => {
  const lineHeight = size === "sm" ? "h-0.5" : size === "md" ? "h-1" : "h-1.5";
  const spacing =
    size === "sm" ? "space-y-0.5" : size === "md" ? "space-y-1.5" : "space-y-2";
  const marginTop = size === "sm" ? "mt-1" : size === "md" ? "mt-3" : "mt-4";

  return (
    <div className={spacing}>
      {/* Header area - like letterhead */}
      <div className={cn(lineHeight, "bg-stone-300 rounded w-1/3")} />
      <div
        className={cn(lineHeight, "bg-stone-200 rounded w-1/4", marginTop)}
      />

      {/* Body text simulation */}
      <div
        className={cn(lineHeight, "bg-stone-200 rounded w-full", marginTop)}
      />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-5/6")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-3/4")} />

      {/* Another paragraph */}
      <div
        className={cn(lineHeight, "bg-stone-200 rounded w-full", marginTop)}
      />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-4/5")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-2/3")} />

      {/* Signature area */}
      <div
        className={cn(lineHeight, "bg-stone-300 rounded w-1/4", marginTop)}
      />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-1/3")} />
    </div>
  );
};
