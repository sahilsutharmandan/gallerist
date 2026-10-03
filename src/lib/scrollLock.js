let locks = 0
let savedScroll = { x: 0, y: 0 }
let savedStyles = {}
const properties = ['position', 'top', 'left', 'right', 'overflow', 'paddingRight']

export function lockScroll() {
  locks += 1
  if (locks > 1) return
  const { body, documentElement } = document
  savedScroll = { x: window.scrollX, y: window.scrollY }
  savedStyles = Object.fromEntries(properties.map((key) => [key, body.style[key]]))
  const scrollbar = window.innerWidth - documentElement.clientWidth
  Object.assign(body.style, {
    position: 'fixed',
    top: `-${savedScroll.y}px`,
    left: '0',
    right: '0',
    overflow: 'hidden',
    paddingRight: scrollbar > 0 ? `${scrollbar}px` : savedStyles.paddingRight,
  })
}

export function unlockScroll() {
  if (locks === 0) return
  locks -= 1
  if (locks > 0) return
  Object.assign(document.body.style, savedStyles)
  window.scrollTo({ left: savedScroll.x, top: savedScroll.y, behavior: 'instant' })
}
