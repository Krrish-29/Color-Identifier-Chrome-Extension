chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "color-picked") {
    chrome.storage.local.get("colorHistory", (data) => {
      const colors = data.colorHistory || [];
      colors.push(msg.hex);
      chrome.storage.local.set({ colorHistory: colors }, () => {
        sendResponse({ success: true });
      });
    });
    return true; 
  }
});
