chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "check cookie security") {
    // message.cookies is the array of cookies
    // message.hostname is the domain

    try {
      // Send cookies to backend API for AI evaluation
      const response = await fetch("http://localhost:6969/evaluate-cookies", {
        // adjust URL as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cookies: message.cookies }),
      });

      if (!response.ok) throw new Error("Failed to evaluate cookies");

      const result = await response.json();
      // Assuming result is like { sensitiveCookies: ["cookieName1", "cookieName2", ...] }

      displayCookiesInNewTab(
        message.cookies,
        message.hostname,
        result.sensitiveCookies
      );
    } catch (error) {
      console.error("Error evaluating cookies:", error);
      // fallback to display without AI
      displayCookiesInNewTab(message.cookies, message.hostname, []);
    }
  }
});

function displayCookiesInNewTab(cookies, hostname, sensitiveCookieNames) {
  function escapeHtml(text) {
    if (!text) return "";
    return text
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const html = `
      <html>
        <head>
          <title>Cookies for ${escapeHtml(hostname)}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #f0f4f8;
              margin: 0;
              padding: 40px 20px;
              color: #2e3a59;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            h2 {
              font-weight: 700;
              font-size: 28px;
              margin-bottom: 12px;
              color: #1f2937;
              text-align: center;
            }
            .notice {
              background: #fff3cd;
              border: 1px solid #ffeeba;
              padding: 16px 24px;
              border-radius: 8px;
              max-width: 650px;
              margin-bottom: 30px;
              font-size: 1rem;
              color: #856404;
              box-shadow: 0 4px 8px rgb(255 236 179 / 0.6);
              text-align: center;
            }
            .explanation {
              font-size: 1rem;
              max-width: 650px;
              margin-bottom: 40px;
              color: #4b5563;
              text-align: center;
              line-height: 1.4;
            }
            .cookie {
              background: #ffffff;
              padding: 16px 20px;
              border-radius: 12px;
              margin-bottom: 16px;
              box-shadow: 0 2px 6px rgb(0 0 0 / 0.12);
              border-left: 8px solid #22c55e;
              color: #111827;
              width: 100%;
              max-width: 700px;
              word-break: break-word;
              transition: background-color 0.3s ease, border-color 0.3s ease;
            }
            .cookie.sensitive {
              background-color: #fee2e2;
              border-left-color: #ef4444;
              color: #991b1b;
              font-weight: 600;
            }
            .cookie small {
              display: block;
              margin-top: 8px;
              font-size: 0.85rem;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <h2>Cookies for ${escapeHtml(hostname)}</h2>

          <div class="notice">
            If you’re bug bounty hunting, try changing the value of the cookies highlighted in
            <span style="color:#991b1b; font-weight: 700;">red</span> to see if you can report
            them as vulnerable for authentication bypass.
          </div>

          <div class="explanation">
            Cookies highlighted in <span style="color:#991b1b; font-weight: 700;">red</span> are
            considered <strong>sensitive</strong> based on AI evaluation. They may contain authentication
            or session data and should be handled carefully.
          </div>

          ${
            cookies.length > 0
              ? cookies
                  .map((cookie) => {
                    const isSensitive = sensitiveCookieNames.includes(
                      cookie.name
                    );
                    return `
              <div class="cookie ${isSensitive ? "sensitive" : ""}">
                <strong>${escapeHtml(cookie.name)}</strong>: ${escapeHtml(
                      cookie.value
                    )}
                <small>
                  Domain: ${escapeHtml(cookie.domain)} |
                  Path: ${escapeHtml(cookie.path)} |
                  Secure: ${cookie.secure} |
                  HttpOnly: ${cookie.httpOnly}
                </small>
              </div>`;
                  })
                  .join("")
              : `<p style="font-size:1.1rem; color:#6b7280;">No cookies found for this domain.</p>`
          }
        </body>
      </html>
    `;

  const newTab = window.open("", "_blank");
  if (!newTab) {
    alert("Pop-up blocked! Please allow pop-ups for this site.");
    return;
  }

  newTab.document.write(html);
  newTab.document.close();
}
