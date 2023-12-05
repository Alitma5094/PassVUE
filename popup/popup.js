const passContainer = document.getElementById("hall_passes");
const switchInput = document.getElementById("switch");
const switchLabel = document.getElementById("switch-label");

switchInput.addEventListener("change", () => {
  chrome.storage.local.set({ enabled: switchInput.checked });
  if (switchInput.checked) {
    switchLabel.innerText = "Enabled";
    chrome.runtime.sendMessage({ action: "enabled" });
  } else {
    switchLabel.innerText = "Disabled";
    chrome.runtime.sendMessage({ action: "disabled" });
  }
});

// Run when popup opens
chrome.storage.local.get(["enabled"]).then((result) => {
  switchInput.checked = result.enabled;
  if (result.enabled) {
    switchLabel.innerText = "Enabled";
    chrome.runtime.sendMessage({ action: "refresh" });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updatePopup") {
    passContainer.innerHTML = "";
    request.data.forEach((pass) => {
      const pass_card = `
    <div class="pass">
        <div class="photo">
          <img src="#" alt="User Photo">
        </div>
        <div>
          <h2>${pass.StudentName}</h2>
          <p>Room: ${pass.Room}</p>
          <p>Duration: ${pass.IssueDateTime}</p>
          <p>Requested at ${pass.Minutes}</p>
          <span>
            <button class="btn btn-secondary">Approve</button>
            <button class="btn btn-secondary">Deny</button>
          </span>
        </div>
      </div>`;
      passContainer.insertAdjacentHTML("beforeend", pass_card);
    });
  } else if (request.action == "disablePopup") {
    passContainer.innerHTML =
      "<p>Open Synergy to enable hall pass checking</p>";
    switchInput.disabled = true;
  }
});

if (result.enabled) {
  switchLabel.innerText = "Enabled";
  chrome.runtime.sendMessage({ action: "refresh" });
}
