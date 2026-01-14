import { cn } from "@/lib/utils";

interface XeniLogoProps {
  size?: "sm" | "md";
  className?: string;
}

const sizes = {
  sm: "size-5", // 20px
  md: "size-7", // 28px
};

export function XeniLogo({ size = "md", className }: XeniLogoProps) {
  return (
    <svg
      viewBox="0 0 81 89"
      fill="currentColor"
      className={cn(sizes[size], "text-[#0E1B20]", className)}
      aria-label="Xeni logo"
    >
      <path d="M19.1198 0L80.6572 88.5071H62.9303L40.3923 54.7001L17.7269 88.5071H0L30.6422 43.4311L1.26638 0H19.1202L80.6577 88.5071M44.924 26.8063L61.7905 0H79.3909L53.606 39.2935L44.924 26.8063Z" />
    </svg>
  );
}
