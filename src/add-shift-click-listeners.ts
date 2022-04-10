// var to prevent syntax errors in case the extension is loaded multiple times
var onShiftClick = (e: any) => {
  if (e.shiftKey) {
    console.log('event', e)
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
