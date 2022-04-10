chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({ file: 'add-shift-click-listeners.js' })
})
