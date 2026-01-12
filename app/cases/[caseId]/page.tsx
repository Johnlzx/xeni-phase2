"use client";

import { notFound, useParams } from "next/navigation";
import { getCaseById } from "@/data/cases";
import { CaseDetailLayout } from "@/components/case-detail";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.caseId as string;

  // Validate case exists (for non-new cases)
  const caseData = getCaseById(caseId);
  if (!caseData && !caseId.startsWith("case-new-")) {
    notFound();
  }

  return <CaseDetailLayout caseId={caseId} />;
}
