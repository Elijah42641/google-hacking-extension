let toggleHTML = false;

function toggleRequestBuilderUI() {
  const existing = document.getElementById("request-builder");
  if (existing) {
    existing.remove();
    return;
  }

  const container = document.createElement("div");
  container.id = "request-builder";

  Object.assign(container.style, {
    position: "fixed",
    top: "30px",
    right: "30px",
    width: "400px",
    maxHeight: "85vh",
    overflowY: "auto",
    backgroundColor: "#1e293b",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    zIndex: "999999",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#f1f5f9",
    padding: "20px",
    boxSizing: "border-box",
    resize: "both",
    overflow: "auto",
  });

  container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h2 style="margin: 0; font-weight: 700; font-size: 1.4rem;">Create Custom Request</h2>
        <button id="close-request-builder" title="Close" style="
          background: transparent;
          border: none;
          color: #cbd5e1;
          font-size: 1.5rem;
          cursor: pointer;
          font-weight: 700;
          line-height: 1;
          padding: 0;
        ">×</button>
      </div>
  
      <div style="margin-bottom: 12px;">
        <label style="font-weight: 600; display: block; margin-bottom: 6px;">Request URL</label>
        <div style="padding: 10px; background: #334155; border-radius: 6px; user-select: text; font-size: 0.9rem; overflow-wrap: anywhere;">${window.location.href}</div>
      </div>
  
      <div style="margin-bottom: 15px;">
        <label for="request-method" style="font-weight: 600; margin-bottom: 6px; display: block;">Method</label>
        <select id="request-method" style="width: 100%; padding: 8px; border-radius: 6px; border: none; font-size: 1rem; background: #475569; color: #f1f5f9;">
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
          <option>PATCH</option>
          <option>OPTIONS</option>
          <option>HEAD</option>
        </select>
      </div>
  
      <div style="margin-bottom: 15px;">
        <label for="request-headers" style="font-weight: 600; margin-bottom: 6px; display: block;">Headers (JSON)</label>
        <textarea
          id="request-headers"
          placeholder='{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'
          style="width: 100%; height: 90px; padding: 10px; border-radius: 6px; border: none; font-family: monospace; background: #334155; color: #cbd5e1; resize: vertical; font-size: 0.9rem;"
        ></textarea>
      </div>
  
      <div style="margin-bottom: 20px;">
        <label for="request-body" style="font-weight: 600; margin-bottom: 6px; display: block;">Body (for POST/PUT/PATCH)</label>
        <textarea
          id="request-body"
          placeholder='{\n  "key": "value"\n}'
          style="width: 100%; height: 120px; padding: 10px; border-radius: 6px; border: none; font-family: monospace; background: #334155; color: #cbd5e1; resize: vertical; font-size: 0.9rem;"
          disabled
        ></textarea>
      </div>
  
      <button
        id="send-request"
        style="
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.2s ease;
        "
        onmouseover="this.style.backgroundColor='#2563eb';"
        onmouseout="this.style.backgroundColor='#3b82f6';"
      >
        Send Request
      </button>
  
      <pre
        id="response-output"
        style="
          margin-top: 20px;
          background-color: #0f172a;
          padding: 15px;
          border-radius: 8px;
          font-size: 0.85rem;
          max-height: 180px;
          overflow-y: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
          color: #d1d5db;
        "
      ></pre>
    `;

  document.body.appendChild(container);

  // Close button event
  container
    .querySelector("#close-request-builder")
    .addEventListener("click", () => {
      container.remove();
    });

  // Enable or disable body textarea based on method
  const methodSelect = container.querySelector("#request-method");
  const bodyTextarea = container.querySelector("#request-body");

  function toggleBodyField() {
    const method = methodSelect.value.toUpperCase();
    if (["POST", "PUT", "PATCH"].includes(method)) {
      bodyTextarea.disabled = false;
      bodyTextarea.style.backgroundColor = "#334155";
      bodyTextarea.placeholder = '{\n  "key": "value"\n}';
    } else {
      bodyTextarea.disabled = true;
      bodyTextarea.value = "";
      bodyTextarea.style.backgroundColor = "#475569";
      bodyTextarea.placeholder = "Request body not allowed for this method";
    }
  }

  methodSelect.addEventListener("change", toggleBodyField);
  toggleBodyField(); // initialize on load
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "Create custom request") {
    toggleRequestBuilderUI();
    sendResponse({});
  }
  return true;
});
