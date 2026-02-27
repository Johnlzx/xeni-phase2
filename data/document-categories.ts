export interface DocumentCategorySuggestion {
  name: string;
  group: string;
}

export const DOCUMENT_CATEGORY_SUGGESTIONS: DocumentCategorySuggestion[] = [
  // Personal
  { name: "Passport", group: "Personal" },
  { name: "Identity Documents", group: "Personal" },
  { name: "Relationship Evidence", group: "Personal" },
  { name: "Birth & Name Records", group: "Personal" },

  // Financial & Employment
  { name: "Bank Statements", group: "Financial & Employment" },
  { name: "Tax Evidence", group: "Financial & Employment" },
  { name: "Payslips", group: "Financial & Employment" },
  { name: "Employment Evidence", group: "Financial & Employment" },
  { name: "Sponsorship Documents", group: "Financial & Employment" },
  { name: "Business & Investment", group: "Financial & Employment" },
  { name: "Maintenance Funds", group: "Financial & Employment" },

  // Qualifications & Skills
  { name: "Education Credentials", group: "Qualifications & Skills" },
  { name: "English Language", group: "Qualifications & Skills" },
  { name: "Professional Qualifications", group: "Qualifications & Skills" },

  // Supporting
  { name: "Housing Evidence", group: "Supporting" },
  { name: "Medical Evidence", group: "Supporting" },
  { name: "Travel History", group: "Supporting" },
  { name: "Police & Character", group: "Supporting" },
  { name: "Legal Correspondence", group: "Supporting" },
  { name: "Cover Letter", group: "Supporting" },
  { name: "Supporting Statement", group: "Supporting" },
  { name: "Case Notes", group: "Supporting" },
  { name: "Email Correspondence", group: "Supporting" },
  { name: "Other Documents", group: "Supporting" },
];

// Get unique group names in order
export const DOCUMENT_CATEGORY_GROUPS = [
  "Personal",
  "Financial & Employment",
  "Qualifications & Skills",
  "Supporting",
];
