chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === "display recon") {
    console.log("running recon");

    const data = msg.data;

    // 1. Fetch vulnerabilities from your Flask API
    let vulnResult = null;
    try {
      const response = await fetch(
        "http://localhost:6969/api/recon/vulnerabilities",
        {
          // adjust URL as needed
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      vulnResult = await response.json();
    } catch (e) {
      console.error("Error fetching vulnerabilities:", e);
      vulnResult = { error: "Failed to get vulnerability data." };
    }

    // 2. Highlight Important Keywords (existing)
    const highlightImportant = (str) => {
      if (typeof str !== "string") return str;
      return str.replace(
        /\b(ip(?: address)?|country|city|org|organization|asn|registrar|cname|ns|name server|dns|subdomains?|archive|snapshot|timestamp|url)\b/gi,
        '<span class="highlight">$1</span>'
      );
    };

    const escapeAndHighlight = (str) =>
      typeof str === "string"
        ? highlightImportant(
            str.replace(
              /[&<>"']/g,
              (tag) =>
                ({
                  "&": "&amp;",
                  "<": "&lt;",
                  ">": "&gt;",
                  '"': "&quot;",
                  "'": "&#39;",
                }[tag])
            )
          )
        : highlightImportant(JSON.stringify(str, null, 2));

    const buildSection = (title, content) =>
      content
        ? `
        <div class="section">
          <h2>${title}</h2>
          <pre>${escapeAndHighlight(content)}</pre>
        </div>`
        : "";

    const buildArchiveSection = (archive) => {
      if (!archive) return "";
      if (archive.available) {
        return `
          <div class="section">
            <h2>Archive.org Snapshot</h2>
            <p><strong>URL:</strong> <a href="${archive.url}" target="_blank" rel="noopener noreferrer">${archive.url}</a></p>
            <p><strong>Timestamp:</strong> ${archive.timestamp}</p>
          </div>
        `;
      } else {
        return `
          <div class="section">
            <h2>Archive.org Snapshot</h2>
            <p>No archived snapshots found.</p>
          </div>
        `;
      }
    };

    // 3. Build vulnerabilities section, highlight issues in red
    const buildVulnSection = (vulnData) => {
      if (!vulnData) return "";
      if (vulnData.error) {
        return `<div class="section" style="color: #f44336;"><h2>Vulnerabilities</h2><p>Error: ${vulnData.error}</p></div>`;
      }
      if (vulnData.issues && vulnData.issues.length > 0) {
        return `
          <div class="section" style="color: #f44336;">
            <h2>Vulnerabilities Detected</h2>
            <ul>
              ${vulnData.issues.map((issue) => `<li>${issue}</li>`).join("")}
            </ul>
          </div>
        `;
      }
      return `
        <div class="section" style="color: #4caf50;">
          <h2>Vulnerabilities</h2>
          <p>No significant vulnerabilities detected.</p>
        </div>
      `;
    };

    // 4. Compose the full HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Recon Results</title>
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Roboto, monospace, sans-serif;
              background: #121212;
              color: #e0e0e0;
              margin: 0;
              padding: 0;
              line-height: 1.5;
            }
            header {
              position: sticky;
              top: 0;
              background: #1f1f1f;
              padding: 16px 24px;
              font-size: 20px;
              font-weight: bold;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
              z-index: 1;
            }
            main {
              padding: 20px;
              max-width: 960px;
              margin: 0 auto;
            }
            .section {
              background: #1e1e1e;
              margin-bottom: 20px;
              padding: 16px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
              transition: transform 0.2s ease;
            }
            .section:hover {
              transform: scale(1.01);
            }
            h2 {
              margin-top: 0;
              color: #90caf9;
              border-bottom: 1px solid #333;
              padding-bottom: 4px;
              font-size: 18px;
            }
            pre {
              background: #111;
              padding: 12px;
              border-radius: 6px;
              overflow-x: auto;
              color: #d6d6d6;
              white-space: pre-wrap;
              word-break: break-word;
            }
            .highlight {
              background-color: #ff9800;
              color: #000;
              font-weight: bold;
              padding: 1px 4px;
              border-radius: 4px;
            }
            a {
              color: #90caf9;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <header>🕵️ Recon Results</header>
          <main>
            ${buildSection("Geolocation", data.geo)}
            ${buildSection("WHOIS", JSON.stringify(data.whois, null, 2))}
            ${buildSection("DNS Records", data.dns)}
            ${buildSection("Subdomains", data.subdomains?.join("\n"))}
            ${buildSection("HTTP Headers", data.headers)}
            ${buildArchiveSection(data.archive)}
            ${buildVulnSection(vulnResult)}
            ${buildSection("Error", data.error)}
          </main>
        </body>
      </html>
    `;

    const reconWin = window.open("", "_blank", "width=1000,height=800");
    if (reconWin) {
      reconWin.document.open();
      reconWin.document.write(htmlContent);
      reconWin.document.close();
    } else {
      alert("Popup blocked! Please allow popups for this site.");
    }
  }
});
