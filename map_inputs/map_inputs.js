let inputs = [];

function displayInputs() {
  // Remove existing panel if any
  const existing = document.getElementById("input-panel");
  if (existing) existing.remove();

  const panel = document.createElement("div");
  panel.id = "input-panel";
  panel.innerHTML = `<h4 style="margin-top:0;">Inputs Found</h4>`;
  document.body.appendChild(panel);

  inputs.forEach((inputEl, index) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(inputEl, "text/html");
    const input = doc.body.firstElementChild;

    if (!input || !input.id) return;

    const label =
      input.name || input.placeholder || input.id || `Input ${index}`;
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.className = "input-btn";

    btn.addEventListener("click", () => {
      const realElement = document.getElementById(input.id);
      if (!realElement) return;

      // Remove any existing overlay
      const existingOverlay = document.getElementById("red-overlay");
      if (existingOverlay) existingOverlay.remove();

      // Scroll to input and focus it
      realElement.scrollIntoView({ behavior: "smooth", block: "center" });
      realElement.focus({ preventScroll: true });

      // Create the full-page red overlay
      const overlay = document.createElement("div");
      overlay.id = "red-overlay";
      Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255,0,0,0.8)",
        zIndex: "99999999",
        transition: "all 1s ease",
        pointerEvents: "none",
      });
      document.body.appendChild(overlay);

      // Get input bounding rect relative to viewport
      const rect = realElement.getBoundingClientRect();

      // Force a reflow so transition will work
      overlay.getBoundingClientRect();

      // Animate overlay to shrink to input position and size
      Object.assign(overlay.style, {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: "6px",
      });

      // After transition ends, remove overlay
      overlay.addEventListener(
        "transitionend",
        () => {
          overlay.remove();
        },
        { once: true }
      );
    });

    panel.appendChild(btn);
  });

  makeResizable(panel);
}

function mapInputs() {
  console.log("mapping inputs");
  const rawHTML = document.documentElement.outerHTML;
  const encodedHTML = btoa(unescape(encodeURIComponent(rawHTML)));

  fetch("http://localhost:6969/map-input-elements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html: encodedHTML }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (!data.inputs || data.inputs.length === 0) {
        window.alert("No inputs found");
      } else {
        inputs = data.inputs;
        console.log("Inputs detected:", inputs);
        displayInputs();
      }
    })
    .catch((err) => {
      console.error("Error sending to Python:", err);
      window.alert(
        "Failed to fetch input elements. Check console for details."
      );
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "map out all inputs") {
    mapInputs();
  }
});

// Inject styles
const style = document.createElement("style");
style.textContent = `
  #input-panel {
    position: fixed;
    top: 10px;
    right: 10px;
    width: 300px;
    height: 400px;
    min-width: 200px;
    min-height: 150px;
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    border-radius: 6px;
    padding: 10px;
    overflow: auto;
    z-index: 9999;
    box-sizing: border-box;
  }

  .input-btn {
    display: block;
    margin: 5px 0;
    cursor: pointer;
    background: #007bff;
    color: #fff;
    border: none;
    padding: 6px 10px;
    border-radius: 4px;
  }

  .highlighted-input {
    outline: 3px solid red !important;
    outline-offset: 2px;
    background-color: yellow !important;
    box-shadow: 0 0 8px 3px rgba(255, 0, 0, 0.7);
    transition: outline 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    position: relative;
    z-index: 999999 !important;
  }

  .resizer {
    position: absolute;
    background: transparent;
    z-index: 10000;
  }

  .resizer.right { 
    right: -5px; 
    top: 0; 
    width: 10px; 
    height: 100%; 
    cursor: ew-resize; 
  }
  .resizer.left { 
    left: -5px; 
    top: 0; 
    width: 10px; 
    height: 100%; 
    cursor: ew-resize; 
  }
  .resizer.bottom { 
    bottom: -5px; 
    left: 0; 
    height: 10px; 
    width: 100%; 
    cursor: ns-resize; 
  }
  .resizer.top { 
    top: -5px; 
    left: 0; 
    height: 10px; 
    width: 100%; 
    cursor: ns-resize; 
  }

  .resizer.corner {
    width: 12px;
    height: 12px;
    background: transparent;
    position: absolute;
  }

  .resizer.bottom-right { 
    right: -6px; 
    bottom: -6px; 
    cursor: nwse-resize; 
  }
  .resizer.bottom-left { 
    left: -6px; 
    bottom: -6px; 
    cursor: nesw-resize; 
  }
  .resizer.top-right { 
    right: -6px; 
    top: -6px; 
    cursor: nesw-resize; 
  }
  .resizer.top-left { 
    left: -6px; 
    top: -6px; 
    cursor: nwse-resize; 
  }
`;
document.head.appendChild(style);

function makeResizable(el) {
  const edges = ["top", "right", "bottom", "left"];
  const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];

  edges.forEach((edge) => {
    const resizer = document.createElement("div");
    resizer.className = `resizer edge ${edge}`;
    el.appendChild(resizer);
  });

  corners.forEach((corner) => {
    const resizer = document.createElement("div");
    resizer.className = `resizer corner ${corner}`;
    el.appendChild(resizer);
  });

  let startX, startY, startWidth, startHeight, startTop, startLeft;

  el.querySelectorAll(".resizer").forEach((resizer) => {
    resizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();

      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(getComputedStyle(el, null).width, 10);
      startHeight = parseInt(getComputedStyle(el, null).height, 10);
      startTop = el.offsetTop;
      startLeft = el.offsetLeft;

      const classList = e.target.classList;

      function doDrag(ev) {
        if (classList.contains("right")) {
          el.style.width = `${startWidth + ev.clientX - startX}px`;
        }
        if (classList.contains("left")) {
          const newWidth = startWidth - (ev.clientX - startX);
          if (newWidth > 150) {
            el.style.width = `${newWidth}px`;
            el.style.left = `${startLeft + (ev.clientX - startX)}px`;
          }
        }
        if (classList.contains("bottom")) {
          el.style.height = `${startHeight + ev.clientY - startY}px`;
        }
        if (classList.contains("top")) {
          const newHeight = startHeight - (ev.clientY - startY);
          if (newHeight > 100) {
            el.style.height = `${newHeight}px`;
            el.style.top = `${startTop + (ev.clientY - startY)}px`;
          }
        }
        if (classList.contains("bottom-right")) {
          el.style.width = `${startWidth + ev.clientX - startX}px`;
          el.style.height = `${startHeight + ev.clientY - startY}px`;
        }
        if (classList.contains("bottom-left")) {
          const newWidth = startWidth - (ev.clientX - startX);
          if (newWidth > 150) {
            el.style.width = `${newWidth}px`;
            el.style.left = `${startLeft + (ev.clientX - startX)}px`;
          }
          el.style.height = `${startHeight + ev.clientY - startY}px`;
        }
        if (classList.contains("top-right")) {
          el.style.width = `${startWidth + ev.clientX - startX}px`;
          const newHeight = startHeight - (ev.clientY - startY);
          if (newHeight > 100) {
            el.style.height = `${newHeight}px`;
            el.style.top = `${startTop + (ev.clientY - startY)}px`;
          }
        }
        if (classList.contains("top-left")) {
          const newWidth = startWidth - (ev.clientX - startX);
          if (newWidth > 150) {
            el.style.width = `${newWidth}px`;
            el.style.left = `${startLeft + (ev.clientX - startX)}px`;
          }
          const newHeight = startHeight - (ev.clientY - startY);
          if (newHeight > 100) {
            el.style.height = `${newHeight}px`;
            el.style.top = `${startTop + (ev.clientY - startY)}px`;
          }
        }
      }

      function stopDrag() {
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
      }

      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
    });
  });
}
