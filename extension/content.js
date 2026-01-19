// Xeni Form Pilot Content Script
// Runs on mock-form pages to coordinate with sidebar

console.log("[Form Pilot] Content script loaded on:", window.location.href);

// Listen for messages from the page (React app)
window.addEventListener("message", (event) => {
  // Only accept messages from our window
  if (event.source !== window) return;

  const { type, ...data } = event.data || {};

  switch (type) {
    case "FORM_PILOT_FILLING_STARTED":
      console.log("[Form Pilot] Filling started");
      chrome.runtime.sendMessage({ type: "FILL_STARTED" });
      break;

    case "FORM_PILOT_PROGRESS":
      console.log("[Form Pilot] Progress:", data);
      chrome.runtime.sendMessage({
        type: "FILL_PROGRESS",
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
      break;

    case "FORM_PILOT_COMPLETE":
      console.log("[Form Pilot] Completed:", data);
      chrome.runtime.sendMessage({
        type: "FILL_COMPLETED",
        totalPages: data.filledFields,
      });
      break;
  }
});

// Listen for messages from extension (sidebar/background)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[Form Pilot] Received message from extension:", message);

  if (message.type === "START_FILL") {
    // Forward to page
    window.postMessage({ type: "FORM_PILOT_START_FILL" }, "*");
    sendResponse({ success: true });
  }

  return true;
});

// Notify that content script is ready
console.log("[Form Pilot] Content script ready");
