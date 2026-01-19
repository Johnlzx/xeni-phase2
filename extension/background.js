// Xeni Form Pilot Background Service Worker

// Track filling state
let fillingState = {
  isActive: false,
  currentPage: 0,
  totalPages: 0,
  status: "idle", // idle, filling, completed, error
};

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ tabId: tab.id });
});

// Enable side panel for localhost:3000 tabs
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;

  if (tab.url.includes("localhost:3000/mock-form")) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: "sidebar.html",
      enabled: true,
    });
  } else {
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    });
  }
});

// Listen for messages from content script and sidebar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[Background] Received message:", message);

  switch (message.type) {
    case "START_FILL":
      // Forward to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "START_FILL" });
          fillingState = {
            isActive: true,
            currentPage: 0,
            totalPages: 11,
            status: "filling",
          };
          sendResponse({ success: true });
        }
      });
      return true; // Async response

    case "FILL_STARTED":
      fillingState.status = "filling";
      fillingState.isActive = true;
      // Broadcast to sidebar
      chrome.runtime.sendMessage({ type: "STATE_UPDATE", state: fillingState });
      break;

    case "FILL_PROGRESS":
      fillingState.currentPage = message.currentPage;
      fillingState.totalPages = message.totalPages;
      // Broadcast to sidebar
      chrome.runtime.sendMessage({ type: "STATE_UPDATE", state: fillingState });
      break;

    case "FILL_COMPLETED":
      fillingState = {
        isActive: false,
        currentPage: message.totalPages || 11,
        totalPages: message.totalPages || 11,
        status: "completed",
      };
      // Broadcast to sidebar
      chrome.runtime.sendMessage({ type: "STATE_UPDATE", state: fillingState });
      break;

    case "FILL_ERROR":
      fillingState.status = "error";
      fillingState.isActive = false;
      // Broadcast to sidebar
      chrome.runtime.sendMessage({ type: "STATE_UPDATE", state: fillingState });
      break;

    case "GET_STATE":
      sendResponse({ state: fillingState });
      return true;

    case "RESET_STATE":
      fillingState = {
        isActive: false,
        currentPage: 0,
        totalPages: 0,
        status: "idle",
      };
      sendResponse({ success: true });
      return true;
  }
});

// Log when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("[Xeni] Extension installed");
});
