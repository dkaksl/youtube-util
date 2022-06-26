var onShiftClick = (e: any) => {
  if (e.shiftKey) {
    const path = e.path
    if (Array.isArray(path)) {
      const dismissible = path.find(
        (element) => element.id === 'dismissible'
      ) as HTMLElement
      setDismissibleElementVisibility(dismissible, true)
      const watchId = getWatchIdFromDismissibleElement(dismissible)
      console.log(`set item with watchid ${watchId} to hidden`)
      if (watchId) {
        setManagedItem(watchId, true)
      }
    }
    e.preventDefault()
  }
}

interface ManagedItem {
  watchId: string
  hidden: boolean
}

var parseItemString = (itemString: string) => {
  const parts = itemString.split(':')
  return { watchId: parts[0], hidden: parts[1] === 'true' }
}

var getItemString = (watchId: string, hidden: boolean) => {
  return `${watchId}:${hidden.toString()}`
}

var setManagedItem = (watchId: string, hidden: boolean) => {
  console.log(`DEBUG: setting ${watchId} to hidden: ${hidden}`)
  chrome.storage.sync.get('managedItems', ({ managedItems }) => {
    const storedManagedItems: ManagedItem[] = managedItems
      .filter((item: any) => typeof item === 'string')
      .map((item: string) => parseItemString(item))
    const items = [...storedManagedItems]
    const existingManagedItem = items.find((item) => item.watchId === watchId)
    if (existingManagedItem) {
      existingManagedItem.hidden = hidden
    } else {
      items.push({ watchId, hidden })
    }
    chrome.storage.sync.set({
      managedItems: items.map((item) =>
        getItemString(item.watchId, item.hidden)
      ),
    })
  })
}

var setDismissibleElementVisibility = (
  element: HTMLElement,
  hidden: boolean
) => {
  element.style.visibility = hidden ? 'hidden' : ''
}

var getWatchIdFromDismissibleElement = (element: HTMLElement) => {
  return element.children[0].children[0].getAttribute('href')?.split('&')[0]
}

var main = () => {
  chrome.storage.sync.get('managedItems', ({ managedItems }) => {
    const storedManagedItems: ManagedItem[] =
      managedItems
        ?.filter((item: any) => typeof item === 'string')
        .map((item: string) => parseItemString(item)) || []
    const dismissibles = document.querySelectorAll(
      '[id=dismissible]'
    ) as NodeListOf<HTMLElement>
    const items = [...storedManagedItems]
    for (const element of Array.from(dismissibles).slice(1)) {
      const watchId = getWatchIdFromDismissibleElement(element)
      if (watchId) {
        if (element.onclick === null) {
          element.onclick = onShiftClick
        }
        const existingManagedItem = items.find(
          (item) => item.watchId === watchId
        )
        if (existingManagedItem) {
          setDismissibleElementVisibility(element, existingManagedItem.hidden)
        } else {
          items.push({ watchId, hidden: false })
        }
      }
    }
    chrome.storage.sync.set({
      managedItems: items.map((item) =>
        getItemString(item.watchId, item.hidden)
      ),
    })
  })
}

main()
