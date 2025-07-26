function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}

let picking = false;

function pickColorOnce() {
  if (picking) return;
  picking = true;

  function onClick(e) {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "A") return;

    const x = e.clientX;
    const y = e.clientY;

    html2canvas(document.body).then((canvas) => {
      const ctx = canvas.getContext("2d");
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

      showColorOverlay(hex);
      navigator.clipboard.writeText(hex);
      chrome.runtime.sendMessage({ type: "color-picked", hex, rgb });

      setTimeout(() => {
        document.removeEventListener("click", onClick, true);
        picking = false;
      }, 100);
    });
    e.preventDefault();
    e.stopPropagation();
  }
  document.addEventListener("click", onClick, true);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg === "start-pick") {
    pickColorOnce();
  }
});

function showColorOverlay(hex) {
  const box = document.createElement("div");
  box.style.position = "fixed";
  box.style.top = "10px";
  box.style.right = "10px";
  box.style.backgroundColor = hex;
  if (parseInt(hex.slice(1), 16) > 0xffffff / 2) { 
    box.style.color = "#000"; 
  }
  else{
    box.style.color = "#fff";
  }
  box.style.padding = "12px 18px";
  box.style.fontWeight = "bold";
  box.style.fontFamily = "monospace";
  box.style.fontSize = "16px";
  box.style.borderRadius = "8px";
  box.style.boxShadow = "0 2px 16px rgba(0,0,0,0.35)";
  box.style.zIndex = 9;
  box.textContent = `Copied: ${hex}`;
  document.body.appendChild(box);
  setTimeout(() => {
  box.style.transition = "opacity 0.6s ease";
  box.style.opacity = "0";
  setTimeout(() => box.remove(), 600);
  }, 1600);
}
