// Xeni Sidebar Script

// DOM Elements
const runBtn = document.getElementById("runBtn");
const runBtnText = document.getElementById("runBtnText");
const workflowStatus = document.getElementById("workflowStatus");
const workflowSubtitle = document.getElementById("workflowSubtitle");
const activityStatus = document.getElementById("activityStatus");
const activityProgress = document.getElementById("activityProgress");
const activitiesToggle = document.getElementById("activitiesToggle");
const activitiesContent = document.getElementById("activitiesContent");
const activitiesIcon = document.getElementById("activitiesIcon");

// State
let currentState = {
  isActive: false,
  currentPage: 0,
  totalPages: 11,
  status: "idle",
};

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  // Get current state from background
  const response = await chrome.runtime.sendMessage({ type: "GET_STATE" });
  if (response?.state) {
    updateUI(response.state);
  }

  // Set up activities toggle
  activitiesToggle.addEventListener("click", () => {
    activitiesContent.classList.toggle("open");
    activitiesIcon.style.transform = activitiesContent.classList.contains("open")
      ? "rotate(180deg)"
      : "rotate(0deg)";
  });
});

// Run button click handler
runBtn.addEventListener("click", async () => {
  if (currentState.status === "filling") {
    // Already running, do nothing
    return;
  }

  // Reset state first if completed
  if (currentState.status === "completed") {
    await chrome.runtime.sendMessage({ type: "RESET_STATE" });
  }

  // Update UI immediately
  updateUI({
    isActive: true,
    currentPage: 0,
    totalPages: 11,
    status: "filling",
  });

  // Get active tab and send message to content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    try {
      // Use scripting API to execute in the page context
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          window.postMessage({ type: "FORM_PILOT_START_FILL" }, "*");
        },
      });
    } catch (e) {
      console.error("[Sidebar] Failed to start fill:", e);
      updateUI({ status: "error" });
    }
  }
});

// Listen for state updates from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STATE_UPDATE") {
    updateUI(message.state);
  }
});

// Update UI based on state
function updateUI(state) {
  currentState = { ...currentState, ...state };

  // Update run button
  switch (state.status) {
    case "idle":
      runBtn.disabled = false;
      runBtn.className = "run-btn";
      runBtnText.textContent = "Run";
      workflowStatus.className = "workflow-status";
      workflowSubtitle.textContent = "Ready to start";
      activityStatus.textContent = "Waiting to start";
      activityStatus.className = "activity-status";
      activityProgress.textContent = "";
      break;

    case "filling":
      runBtn.disabled = true;
      runBtn.className = "run-btn running";
      runBtnText.textContent = "Running...";
      workflowStatus.className = "workflow-status active pulsing";
      workflowSubtitle.textContent = `Filling page ${state.currentPage || 1} of ${state.totalPages || 11}`;
      activityStatus.textContent = "Auto-filling in progress";
      activityStatus.className = "activity-status filling";
      activityProgress.textContent = `${state.currentPage || 0}/${state.totalPages || 11}`;
      // Open activities section
      activitiesContent.classList.add("open");
      activitiesIcon.style.transform = "rotate(180deg)";
      break;

    case "completed":
      runBtn.disabled = false;
      runBtn.className = "run-btn completed";
      runBtnText.textContent = "Completed";
      workflowStatus.className = "workflow-status completed";
      workflowSubtitle.textContent = `Completed at ${new Date().toLocaleTimeString()}`;
      activityStatus.textContent = "Successfully filled all fields";
      activityStatus.className = "activity-status completed";
      activityProgress.textContent = `${state.totalPages}/${state.totalPages}`;
      break;

    case "error":
      runBtn.disabled = false;
      runBtn.className = "run-btn";
      runBtnText.textContent = "Retry";
      workflowStatus.className = "workflow-status";
      workflowSubtitle.textContent = "Error occurred";
      activityStatus.textContent = "Failed to fill form";
      activityStatus.className = "activity-status";
      activityProgress.textContent = "";
      break;
  }
}
