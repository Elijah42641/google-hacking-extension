function confirmUserHasPermissionToRunPayloads() {
  const userHasPermission = window.confirm(
    "Do you have permission to run these payloads?"
  );
  if (userHasPermission) {
    let payloadAmount = window.prompt(
      "Enter how many payloads to run from 1-10, enter 0 to cancel"
    );
    if (isNaN(payloadAmount)) {
      window.alert("Please enter a valid number");
    } else if (payloadAmount < 0) {
      window.alert("Please enter a valid number");
    } else if (payloadAmount > 10) {
      window.alert("Only enter values up to 10");
    } else if (payloadAmount === 0) {
      window.alert("Reflected XSS payloads were canceled");
    } else {
      window.alert("Payloads are being ran...");
    }
    return { payloadAmount: payloadAmount, hasPermission: true };
  } else {
    return { payloadAmount: 0, hasPermission: false };
  }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "confirmUserHasPermission") {
    let confirmPermission = confirmUserHasPermissionToRunPayloads();
    sendResponse({
      hasPermission: confirmPermission.hasPermission,
      payloadsToRun: confirmPermission.payloadAmount,
    });
  }
  return true;
});
