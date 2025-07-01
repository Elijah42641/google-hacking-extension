chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "evaluate current url") {
    // window.alert the response from the url evaluator
    let url = window.location.href;

    fetch("http://localhost:6969/evaluate-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message) {
          console.log("alerting window");
          window.alert(data.message);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }
  return true;
});
