let toggleHTML = false;

function makeRequest() {
  let method = document.querySelector("#request-method").value;
  let requestHeaders = document.querySelector("#request-headers").value;
  let requestBody = document.querySelector("#request-body").value;
  let url = document.querySelector("#requestUrl").value;

  if (url == "" || !url) {
    url = window.location.href;
  }

  // make sure input is valid for request headers
  try {
    requestHeaders = JSON.parse(requestHeaders);
  } catch (error) {
    window.alert("Please enter valid JSON for request headers", error);
    return "invalid JSON";
  }
  try {
    // validates request body if user decides to include it
    if (requestBody && requestBody.trim().length > 0) {
      // parse request body correctly based on request headers
      if (
        requestHeaders
          .trim()
          .toLowerCase()
          .includes(`"content-type":"application/json"`)
      ) {
        requestBody = JSON.parse(requestBody);
      } else if (
        requestHeaders
          .trim()
          .toLowerCase()
          .includes(`"content-type":"application/x-www-form-urlencoded"`)
      ) {
        requestBody = new URLSearchParams(requestBody);
      } else if (
        requestHeaders
          .trim()
          .toLowerCase()
          .includes(`"content-type":"application/xml"`)
      ) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(requestBody, "application/xml");
      }
    }
  } catch (error) {
    window.alert("Please enter a valid request body");
  }

  toggleRequestBuilderUI();

  fetch("http://localhost:6969/make-custom-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, method, requestBody, requestHeaders }),
  })
    .then((res) => res.json())
    .then((data) => {
      const newWindow = window.open("", "_blank");
      if (!newWindow) {
        alert("Pop-up blocked! Please allow pop-ups for this site.");
        return;
      }

      // Prepare nicely formatted HTML
      const content = `
        <html>
          <head>
            <title>Request Response</title>
            <style>
              body { font-family: monospace; white-space: pre-wrap; padding: 20px; }
              h2 { border-bottom: 1px solid #ccc; padding-bottom: 4px; }
              pre { background: #f4f4f4; padding: 10px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <h2>Request Headers</h2>
            <pre>${escapeHtml(JSON.stringify(data.headers, null, 2))}</pre>
  
            <h2>Response Body</h2>
            <pre>${escapeHtml(formatResponseBody(data.text))}</pre>
  
            <h2>Request URL</h2>
            <pre>${escapeHtml(data.url)}</pre>
          </body>
        </html>
      `;

      newWindow.document.write(content);
      newWindow.document.close();
    })
    .catch((err) => {
      console.error("Error:", err);
    });

  // Helper function to escape HTML special chars to avoid injection issues
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Optional: Try to format response body if JSON, else show as-is
  function formatResponseBody(raw) {
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  }
}

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
        <input style = "width:200px;" placeholder = ${window.location.href} id="requestUrl">
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

  document.querySelector("#send-request").addEventListener("click", () => {
    console.log("request sent");
    makeRequest();
  });

  methodSelect.addEventListener("change", toggleBodyField);
  toggleBodyField(); // initialize on load
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "Create custom request") {
    toggleRequestBuilderUI();
  }
});
