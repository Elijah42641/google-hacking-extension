let url = window.location.href;

fetch("http://localhost:6969/get-window-location-href", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url }),
})
  .then((res) => {
    console.log("Fetch response:", res);
    return res.json();
  })
  .then((data) => {
    console.log("Response from Python:", data, data.message);
    if (data.message) {
      console.log("alerting window");
      window.alert(data.message);
    }
  })
  .catch((err) => {
    console.error("Error sending to Python:", err);
  });
