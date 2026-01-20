import { Briefcase, Shield, Plane, Heart } from "lucide-react";
import type { VisaType } from "@/types";

// Visa Type Icons - centralized icon mapping
export const VISA_TYPE_ICONS: Record<VisaType, React.ElementType> = {
  "skilled-worker": Briefcase,
  "naturalisation": Shield,
  "visitor": Plane,
  "partner-spouse": Heart,
};
