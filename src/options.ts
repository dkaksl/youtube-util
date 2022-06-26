var clearStorageHandler = function () {
  chrome.storage.sync.clear()
}

var logStorageHandler = function () {
  chrome.storage.sync.get('managedItems', ({ managedItems }) => {
    console.log(`found managedItems in storage: ${managedItems}`)
  })
}

var createOptionsButton = (
  divId: string,
  buttonText: string,
  handler: EventListenerOrEventListenerObject
) => {
  const buttonDiv = document.getElementById(divId)
  const button = document.createElement('button')
  button.innerHTML = buttonText
  button.addEventListener('click', handler)
  buttonDiv?.appendChild(button)
}

var main = () => {
  createOptionsButton(
    'clearStorageButton',
    'Clear Storage',
    clearStorageHandler
  )
  createOptionsButton('logStorageButton', 'Log Storage', logStorageHandler)
}

main()
