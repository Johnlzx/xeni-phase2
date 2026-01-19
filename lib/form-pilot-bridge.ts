/**
 * Form Pilot Bridge
 * Handles communication between Xeni app and Form Pilot extension/mock form
 */

import type { ClientProfile } from "@/types/case-detail";

// Field mapping type
interface FormField {
  selector: string;
  value: string;
  type: "text" | "date" | "select" | "radio" | "email" | "tel";
}

// Form Pilot data payload
interface FormPilotPayload {
  timestamp: string;
  source: "xeni-app";
  caseId?: string;
  visaType?: string;
  fields: FormField[];
}

// Completion callback type
type CompletionCallback = (result: {
  status: "success" | "error" | "cancelled";
  filledFields?: number;
  error?: string;
}) => void;

/**
 * Map client profile to form fields
 */
function mapToFormFields(
  clientProfile?: ClientProfile | null
): FormField[] {
  const fields: FormField[] = [];

  // Helper to add field if value exists
  const addField = (
    selector: string,
    value: string | undefined | null,
    type: FormField["type"] = "text"
  ) => {
    if (value) {
      fields.push({ selector, value, type });
    }
  };

  // Map from client profile passport data
  if (clientProfile?.passport) {
    const passport = clientProfile.passport;
    addField("#givenNames", passport.givenNames);
    addField("#surname", passport.surname);
    addField("#dateOfBirth", passport.dateOfBirth, "date");
    addField("#nationality", passport.nationality, "select");
    addField('input[name="sex"]', passport.sex, "radio");
    addField("#passportNumber", passport.passportNumber);
    addField("#dateOfIssue", passport.dateOfIssue, "date");
    addField("#dateOfExpiry", passport.dateOfExpiry, "date");
  }

  // Map from client profile contact info
  if (clientProfile?.contactInfo) {
    const contact = clientProfile.contactInfo;
    addField("#email", contact.email, "email");
    addField("#phone", contact.phone, "tel");
    addField("#ukAddress", contact.address);
  }

  return fields;
}

/**
 * Prepare and store form pilot data in localStorage
 */
export function prepareFormPilotData(
  clientProfile?: ClientProfile | null,
  caseId?: string,
  visaType?: string
): FormPilotPayload {
  const fields = mapToFormFields(clientProfile);

  const payload: FormPilotPayload = {
    timestamp: new Date().toISOString(),
    source: "xeni-app",
    caseId,
    visaType,
    fields,
  };

  // Store in localStorage for extension/form to read
  localStorage.setItem("form-pilot-data", JSON.stringify(payload));

  return payload;
}

/**
 * Clear form pilot data
 */
export function clearFormPilotData(): void {
  localStorage.removeItem("form-pilot-data");
}

/**
 * Listen for completion message from form/extension
 */
export function listenForCompletion(callback: CompletionCallback): () => void {
  const handler = (event: MessageEvent) => {
    if (event.data?.type === "FORM_PILOT_COMPLETE") {
      callback({
        status: event.data.status || "success",
        filledFields: event.data.filledFields,
        error: event.data.error,
      });
    }
  };

  window.addEventListener("message", handler);

  // Return cleanup function
  return () => {
    window.removeEventListener("message", handler);
  };
}

/**
 * Launch form pilot - open mock form and prepare data
 */
export function launchFormPilot(
  clientProfile?: ClientProfile | null,
  caseId?: string,
  visaType?: string
): {
  window: Window | null;
  cleanup: () => void;
} {
  // Prepare data
  const payload = prepareFormPilotData(
    clientProfile,
    caseId,
    visaType
  );

  console.log("[Form Pilot Bridge] Prepared data:", payload);

  // Open mock form in new tab
  const formWindow = window.open("/mock-form", "_blank");

  // Return window reference and cleanup function
  return {
    window: formWindow,
    cleanup: () => {
      clearFormPilotData();
    },
  };
}

/**
 * Get mock data for demo purposes
 */
export function getMockFormData(): FormPilotPayload {
  return {
    timestamp: new Date().toISOString(),
    source: "xeni-app",
    caseId: "CASE-001",
    visaType: "UK Spouse Visa",
    fields: [
      { selector: "#givenNames", value: "ZHANG WEI", type: "text" },
      { selector: "#surname", value: "ZHANG", type: "text" },
      { selector: "#dateOfBirth", value: "1990-05-15", type: "date" },
      { selector: "#nationality", value: "Chinese", type: "select" },
      { selector: 'input[name="sex"]', value: "Male", type: "radio" },
      { selector: "#passportNumber", value: "E12345678", type: "text" },
      { selector: "#dateOfIssue", value: "2020-01-10", type: "date" },
      { selector: "#dateOfExpiry", value: "2030-01-09", type: "date" },
      { selector: "#email", value: "zhang.wei@example.com", type: "email" },
      { selector: "#phone", value: "+86 138 0000 1234", type: "tel" },
      { selector: "#ukAddress", value: "123 Baker Street, London, NW1 6XE", type: "text" },
    ],
  };
}

/**
 * Launch form pilot with mock data (for demo)
 */
export function launchFormPilotDemo(): {
  window: Window | null;
  cleanup: () => void;
} {
  const mockData = getMockFormData();

  // Store mock data
  localStorage.setItem("form-pilot-data", JSON.stringify(mockData));

  console.log("[Form Pilot Bridge] Demo mode - prepared mock data:", mockData);

  // Open mock form in new tab
  const formWindow = window.open("/mock-form", "_blank");

  return {
    window: formWindow,
    cleanup: () => {
      clearFormPilotData();
    },
  };
}
