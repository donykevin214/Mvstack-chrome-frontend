chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log("background:", msg);
    // if (msg.type === 'openAI') {
    //   chrome.runtime.sendMessage({type: 'openAI', command: msg.command, selection: msg.selection});
    // }
  });