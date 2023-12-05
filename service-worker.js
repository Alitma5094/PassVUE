let intervalId;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "enabled") {
    intervalId = setInterval(checkForNewPasses, 3000, false);
  } else if (request.action == "disabled") {
    clearInterval(intervalId);
  } else if (request.action == "refresh") {
    checkForNewPasses(true);
  }
});

async function checkForNewPasses(refresh) {
  chrome.tabs.query({ url: "https://*.edupoint.com/*" }, async function (tabs) {
    if (tabs.length > 0) {
      const response = await chrome.tabs.sendMessage(tabs[0].id, {
        action: "getPasses",
      });
      console.log(response);

      // Check for passes where a notification has been sent
      // let old_passes = await chrome.storage.local.get(["passes"]);
      // console.log(old_passes);
      // if (old_passes.passes) {
      //   if (old_passes.passes.length > 0) {
      //     old_passes = old_passes.passes.map((pass) => pass.HallPassID);
      //   } else {
      //     old_passes = [];
      //   }
      // } else {
      //   old_passes = [];
      // }

      response.data.forEach((newPass) => {
        // if (!old_passes.includes(newPass.HallPassID)) {
        // if (!refresh) {
        // chrome.notifications.create({
        //   type: "basic",
        //   iconUrl: "icon.png",
        //   title: `${newPass.StudentName} requested a pass`,
        //   message: `to ${newPass.Room} for ${newPass.minuets}`,
        //   priority: 0,
        // });
        // }
        // }
      });

      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: `John Doe requested a pass`,
        message: `to 1-Bathroom for 5 minutes`,
        priority: 0,
      });

      chrome.runtime.sendMessage({
        action: "updatePopup",
        data: response.data,
      });

      // await chrome.storage.local.set({ passes: response.data });
    } else {
      chrome.runtime.sendMessage({
        action: "disablePopup",
      });
    }
  });
}
