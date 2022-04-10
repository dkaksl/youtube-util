// var to prevent syntax errors in case the extension is loaded multiple times
var onShiftClick = (e: any) => {
  if (e.shiftKey) {
    const path = e.path
    if (Array.isArray(path)) {
      const a = path.find(
        (element) => element.id === 'dismissible'
      ) as HTMLElement
      a.style.visibility = 'hidden'
    }
    e.preventDefault()
  }
}

const main = () => {
  const dismissibles = document.querySelectorAll(
    '[id=dismissible]'
  ) as NodeListOf<HTMLElement>
  for (const element of Array.from(dismissibles).slice(1)) {
    if (element.onclick === null) {
      element.onclick = onShiftClick
    }
  }
}

main()
