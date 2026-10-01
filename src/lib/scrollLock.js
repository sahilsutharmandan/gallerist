let saved = null

export function lockScroll() {
  if (saved) return
  const { body, documentElement } = document
  const scrollY = window.scrollY
  const scrollbar = window.innerWidth - documentElement.clientWidth
  saved = {
    scrollY,
    styles: {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    },
  }
  Object.assign(body.style, {
    position: 'fixed',
    top: `-${scrollY}px`,
    left: '0',
    right: '0',
    overflow: 'hidden',
    paddingRight: scrollbar > 0 ? `${scrollbar}px` : body.style.paddingRight,
  })
}

export function unlockScroll() {
  if (!saved) return
  const { scrollY, styles } = saved
  Object.assign(document.body.style, styles)
  window.scrollTo(0, scrollY)
  saved = null
}
