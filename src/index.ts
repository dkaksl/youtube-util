const onShiftClick = (e) => {
  if (e.shiftKey) {
    alert('nice')
    e.preventDefault()
  }
}

const main = () => {
  const dismissibles = document.querySelectorAll(
    '[id=dismissible]'
  ) as NodeListOf<HTMLElement>
  for (const element of dismissibles) {
    // TODO: skip first element
    element.onclick = onShiftClick
  }
}

main()
