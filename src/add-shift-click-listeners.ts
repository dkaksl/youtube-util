var onShiftClick = (e: any) => {
  if (e.shiftKey) {
    const path = e.path
    if (Array.isArray(path)) {
      const dismissible = path.find(
        (element) => element.id === 'dismissible'
      ) as HTMLElement
      setDismissibleElementVisibility(dismissible, 1)
      const watchId = getWatchIdFromDismissibleElement(dismissible)
      console.log(`set item with watchid ${watchId} to hidden`)
      if (watchId) {
        storeManagedItem(watchId, 1)
      }
    }
    e.preventDefault()
  }
}

type Hidden = 0 | 1

interface ManagedItem {
  watchId: string
  hidden: Hidden
}

var parseItemString = (itemString: string) => {
  const parts = itemString.split(':')
  return { watchId: parts[0], hidden: parseInt(parts[1]) }
}

var getItemString = (watchId: string, hidden: Hidden) => {
  return `${watchId}:${hidden.toString()}`
}

var storeManagedItem = (watchId: string, hidden: Hidden) => {
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
      )
    })
  })
}

var setDismissibleElementVisibility = (
  element: HTMLElement,
  hidden: Hidden
) => {
  element.style.visibility = hidden === 1 ? 'hidden' : ''
}

var trimPrefixFromPath = (path: string) => {
  if (path.startsWith('/watch?v=')) {
    return path.split('/watch?v=')[1]
  } else if (path.startsWith('/shorts/')) {
    return path.split('/shorts/')[1]
  }
  return ''
}

var getWatchIdFromDismissibleElement = (element: HTMLElement) => {
  const path =
    element.children[0].children[0].getAttribute('href')?.split('&')[0] || ''
  return trimPrefixFromPath(path)
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
          items.push({ watchId, hidden: 0 })
        }
      }
    }
    chrome.storage.sync.set({
      managedItems: items.map((item) =>
        getItemString(item.watchId, item.hidden)
      )
    })
  })
}

main()
