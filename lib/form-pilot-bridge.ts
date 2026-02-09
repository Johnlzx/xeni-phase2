/**
 * Form Pilot Bridge
 * Handles communication between Xeni app and Form Pilot extension/mock form
 */

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
