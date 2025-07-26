let lastColor = "#ffffff";

document.getElementById("start-picker").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, "start-pick");
    window.close();
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "color-picked") {
    updateHistory();
  }
});

document.getElementById("copy").addEventListener("click", () => {
  navigator.clipboard.writeText(lastColor).then(() => {
    alert("Copied to clipboard: " + lastColor);
  });
});
document.getElementById("clear-history").addEventListener("click", () => {
      chrome.storage.local.set({ colorHistory: [] }, () => {
          updateHistory();
          alert("Color history cleared.");
      });
});
function updateHistory() {
  chrome.storage.local.get("colorHistory", (data) => {
    lastColor = data.colorHistory?.slice(-1)[0] || "#ffffff";   
    document.getElementById("picked-color").textContent = `Picked: ${lastColor}`;
    const history = data.colorHistory || [];
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";
    history.slice(-10).reverse().forEach((hex) => {
      const div = document.createElement("div");
      div.className = "color-item";
      div.innerHTML = `<div class="box" style="background:${hex}"></div> ${hex}`;
      historyDiv.appendChild(div);
    });
  });
}

updateHistory();
