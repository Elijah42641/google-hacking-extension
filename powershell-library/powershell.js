function openPowershellLibrary() {
  const newTab = window.open("Hacking library");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hacking Library | Bug Bounty Toolkit</title>
  <style>
    :root {
      --primary: #2c3e50;
      --secondary: #3498db;
      --accent: #e74c3c;
      --dark: #1a252f;
      --light: #ecf0f1;
      --success: #2ecc71;
    }
    
    body {
      font-family: 'Fira Code', 'Consolas', monospace;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: var(--dark);
      color: var(--light);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    header {
      background: linear-gradient(135deg, var(--primary), var(--dark));
      padding: 20px 0;
      margin-bottom: 30px;
      border-bottom: 3px solid var(--accent);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    
    h1, h2, h3 {
      color: var(--secondary);
      margin-top: 1.5em;
    }
    
    h1 {
      font-size: 2.5rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    h2 {
      border-bottom: 2px solid var(--primary);
      padding-bottom: 8px;
      font-size: 1.8rem;
    }
    
    h3 {
      color: var(--success);
      font-size: 1.4rem;
    }
    
    a {
      color: var(--secondary);
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    a:hover {
      color: var(--accent);
      text-decoration: underline;
    }
    
    ul {
      padding-left: 20px;
      list-style-type: square;
    }
    
    li {
      margin-bottom: 8px;
    }
    
    code {
      font-family: 'Fira Code', monospace;
      background: rgba(0,0,0,0.3);
      padding: 2px 6px;
      border-radius: 3px;
      color: var(--success);
    }
    
    pre {
      background-color: #1e1e1e;
      color: #d4d4d4;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      border-left: 4px solid var(--accent);
      font-size: 0.9rem;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .note {
      background: rgba(52, 152, 219, 0.1);
      border-left: 4px solid var(--secondary);
      padding: 12px;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    
    .warning {
      background: rgba(231, 76, 60, 0.1);
      border-left: 4px solid var(--accent);
      padding: 12px;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    
    .success {
      background: rgba(46, 204, 113, 0.1);
      border-left: 4px solid var(--success);
      padding: 12px;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    
    .card {
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    }
    
    .card h3 {
      margin-top: 0;
      color: var(--secondary);
    }
    
    .keyword-list {
      columns: 3;
      column-gap: 20px;
    }
    
    @media (max-width: 768px) {
      .keyword-list {
        columns: 2;
      }
    }
    
    @media (max-width: 480px) {
      .keyword-list {
        columns: 1;
      }
    }
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="container">
      <h1>Hacking Library</h1>
      <p>Comprehensive Bug Bounty Toolkit & Methodology</p>
    </div>
  </header>
  
  <div class="container">
    <div class="note">
      <strong>Note:</strong> Always ensure you have proper authorization before testing any systems. This information is for educational purposes only.
    </div>
    
    <h2>Core Methodology</h2>
    
    <div class="grid">
      <div class="card">
        <h3>Race Conditions</h3>
        <ul>
          <li>Create two accounts with identical emails in different tabs</li>
          <li>Submit both forms simultaneously</li>
          <li>Report if multiple accounts are created when duplicates should be prevented</li>
        </ul>
      </div>
      
      <div class="card">
        <h3>Wildcard Domains</h3>
        <ul>
          <li>Test all applicable vulnerabilities on subdomains</li>
          <li>Thoroughly check CORS configurations in APIs</li>
          <li>Verify proper subdomain isolation</li>
        </ul>
      </div>
      
      <div class="card">
        <h3>Bug Bounty Resources</h3>
        <p>Comprehensive reference guide:</p>
        <a href="https://github.com/daffainfo/AllAboutBugBounty" target="_blank">AllAboutBugBounty GitHub</a>
      </div>
    </div>
    
    <h2>Source Code Analysis</h2>
    
    <h3>Key Indicators in Comments</h3>
    <div class="keyword-list">
      <ul>
        <li><code>// TODO</code></li>
        <li><code>// FIXME</code></li>
        <li><code>// HACK</code></li>
        <li><code>// NOTE</code></li>
        <li><code># insecure</code></li>
        <li><code># temporary</code></li>
        <li><code># debug only</code></li>
        <li><code># remove later</code></li>
        <li><code># hardcoded</code></li>
      </ul>
    </div>
    
    <h3>Security-Sensitive Keywords</h3>
    <div class="keyword-list">
      <ul>
        <li><code>admin</code></li>
        <li><code>is_admin</code></li>
        <li><code>role</code></li>
        <li><code>access</code></li>
        <li><code>superuser</code></li>
        <li><code>privilege</code></li>
        <li><code>permissions</code></li>
        <li><code>can_</code></li>
        <li><code>file_put_contents</code></li>
        <li><code>fopen</code></li>
        <li><code>readFile</code></li>
        <li><code>writeFile</code></li>
        <li><code>unlink</code></li>
        <li><code>delete</code></li>
        <li><code>path</code></li>
        <li><code>dir</code></li>
        <li><code>fs.</code> (Node.js)</li>
        <li><code>open()</code></li>
      </ul>
    </div>
    
    <h2>Initial Attack Vectors</h2>
    
    <h3>SQL Injection Payloads</h3>
    <pre>'or1=1
' AND 1=CONVERT(int,@@version)--
'; IF (1=1) WAITFOR DELAY '0:0:5'--
/*!50000SELECT*/ 1,2,3 FROM users--</pre>
    
    <div class="success">
      <strong>Automated Testing:</strong> <code>sqlmap -u "https://example.com/login?id=1" --risk=3 --level=5</code>
    </div>
    
    <h3>XSS Payloads</h3>
    <pre>&lt;script&gt;alert("XSS")&lt;/script&gt;
&lt;img src=x onerror=alert(document.domain)&gt;
&lt;svg/onload=alert(1)&gt;
"&gt;&lt;script&gt;alert(1)&lt;/script&gt;
"&lt;h1&gt;test&lt;/h1&gt;</pre>
    
    <h3>URL Manipulation</h3>
    <ul>
      <li>Modify access control parameters: <code>user1</code> → <code>hackeduser</code></li>
      <li>Test reflected XSS: <code>?search=&lt;script&gt;alert(1)&lt;/script&gt;</code></li>
      <li>Check for forced browsing to hidden resources</li>
    </ul>
    
    <div class="note">
      <strong>Pro Tip:</strong> When unsure about URL exploitation possibilities, consult AI tools like DeepSeek for targeted attack vectors.
    </div>
    
    <h2>Reconnaissance Techniques</h2>
    
    <div class="grid">
      <div class="card">
        <h3>Passive Recon</h3>
        <ul>
          <li><code>site:example.com ext:pdf "API documentation"</code></li>
          <li><code>intitle:"admin panel" site:example.com</code></li>
          <li><code>inurl:login site:example.com</code></li>
          <li><code>inurl:.git</code>, <code>inurl:.env</code>, <code>filetype:sql</code></li>
          <li><code>theHarvester -d domain.com -b google,netcraft</code></li>
        </ul>
      </div>
      
      <div class="card">
        <h3>Active Recon</h3>
        <ul>
          <li><code>dig example.com</code></li>
          <li><code>nmap -sV --top-ports 100 -Pn example.com</code></li>
          <li>Always verify scope/permissions first</li>
        </ul>
      </div>
    </div>
    
    <h3>Open Redirect Testing</h3>
    <p>Target endpoints like:</p>
    <pre>mysite.com/open?url=mysite.com/home</pre>
    <p>Common locations:</p>
    <ul>
      <li>Password reset pages</li>
      <li>Registration flows</li>
      <li>Authentication sequences</li>
      <li>Checkout processes</li>
    </ul>
    
    <div class="warning">
      <strong>Important:</strong> Always obtain permission before testing open redirect vulnerabilities.
    </div>
    
    <h3>Path Traversal</h3>
    <p>For complex manual testing, leverage AI tools to identify potential traversal vectors.</p>
    
    <h2>API Testing</h2>
    
    <h3>Discovery Techniques</h3>
    <pre>curl -s "http://web.archive.org/cdx/search/cdx?url=api.example.com/*&output=json" | jq -r '.[] | .[2]'
gh api -X GET search/code -f q="api.example.com OR /v1/user OR x-api-key org:companyname"</pre>
    
    <h3>Google Dorks for API Discovery</h3>
    <div class="keyword-list">
      <ul>
        <li><code>inurl:/api/v1/</code></li>
        <li><code>intitle:"Swagger UI"</code></li>
        <li><code>inurl:/openapi.json</code></li>
        <li><code>inurl:/oauth2/auth</code></li>
        <li><code>inurl:/auth/realms filetype:json</code></li>
        <li><code>inurl:/api/users ext:json</code></li>
        <li><code>intitle:"API keys"</code></li>
      </ul>
    </div>
    
    <div class="success">
      <strong>Bounty Tip:</strong> Public exposure of sensitive API information is often eligible for reporting.
    </div>
    
    <h2>Advanced Techniques</h2>
    
    <h3>Business Logic Vulnerabilities</h3>
    <ul>
      <li>Execute actions in unexpected sequences</li>
      <li>Test edge cases developers may have overlooked</li>
      <li>Attempt to bypass intended workflow restrictions</li>
    </ul>
    
    <h3>CSRF Testing</h3>
    <ul>
      <li>Verify if sessions tokens are being reused</li>
      <li>Check for lack of anti-CSRF tokens</li>
      <li>Test if cookies are improperly scoped</li>
    </ul>
    
    <div class="note">
      <strong>Remember:</strong> Always document your findings thoroughly and report responsibly.
    </div>
  </div>
</body>
</html>`;
  newTab.document.write(html);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "view hacking library") {
    openPowershellLibrary();
  }
});
