import { cn } from "@/lib/utils";

export const DocumentPreviewContent = ({
  variant = "default",
  size = "sm",
}: {
  variant?: "default" | "passport" | "bank" | "letter" | "email";
  size?: "sm" | "md" | "lg";
}) => {
  const lineHeight = size === "sm" ? "h-0.5" : size === "md" ? "h-1" : "h-1.5";
  const spacing =
    size === "sm" ? "space-y-0.5" : size === "md" ? "space-y-1.5" : "space-y-2";
  const marginTop = size === "sm" ? "mt-1" : size === "md" ? "mt-3" : "mt-4";

  if (variant === "email") {
    const labelWidth = size === "sm" ? "w-6" : size === "md" ? "w-8" : "w-10";
    const valueWidth1 = "w-2/3";
    const valueWidth2 = "w-1/2";
    const dividerMt = size === "sm" ? "mt-1.5" : size === "md" ? "mt-2.5" : "mt-3";
    const dividerHeight = size === "sm" ? "h-px" : "h-px";

    return (
      <div className={spacing}>
        {/* From row */}
        <div className="flex items-center gap-1">
          <div className={cn(lineHeight, "bg-stone-400 rounded", labelWidth)} />
          <div className={cn(lineHeight, "bg-stone-200 rounded", valueWidth1)} />
        </div>
        {/* To row */}
        <div className="flex items-center gap-1">
          <div className={cn(lineHeight, "bg-stone-400 rounded", labelWidth)} />
          <div className={cn(lineHeight, "bg-stone-200 rounded", valueWidth2)} />
        </div>
        {/* Date row */}
        <div className="flex items-center gap-1">
          <div className={cn(lineHeight, "bg-stone-400 rounded", labelWidth)} />
          <div className={cn(lineHeight, "bg-stone-200 rounded w-1/3")} />
        </div>

        {/* Subject line - thicker/darker */}
        <div className={cn(
          size === "sm" ? "h-1" : size === "md" ? "h-1.5" : "h-2",
          "bg-stone-400 rounded w-3/4",
          marginTop,
        )} />

        {/* Divider */}
        <div className={cn(dividerHeight, "bg-stone-300 w-full", dividerMt)} />

        {/* Body text */}
        <div className={cn(lineHeight, "bg-stone-200 rounded w-full", marginTop)} />
        <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
        <div className={cn(lineHeight, "bg-stone-200 rounded w-5/6")} />
        <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
        <div className={cn(lineHeight, "bg-stone-200 rounded w-3/4")} />
        <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
        <div className={cn(lineHeight, "bg-stone-200 rounded w-2/3")} />
      </div>
    );
  }

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
