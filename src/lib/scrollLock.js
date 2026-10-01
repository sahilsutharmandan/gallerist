let locks = 0

export function lockScroll() {
  locks += 1
  if (locks > 1) return
  const { body, documentElement } = document
  const scrollbar = window.innerWidth - documentElement.clientWidth
  Object.assign(body.style, {
    position: 'fixed',
    top: `-${window.scrollY}px`,
    left: '0',
    right: '0',
    overflow: 'hidden',
    paddingRight: scrollbar > 0 ? `${scrollbar}px` : '',
  })
}

export function unlockScroll() {
  if (locks === 0) return
  locks -= 1
  if (locks > 0) return
  const { body } = document
  body.style.position = ''
  body.style.top = ''
  body.style.left = ''
  body.style.right = ''
  body.style.overflow = ''
  body.style.paddingRight = ''
  window.scrollTo(0, -parseInt(body.style.top || '0', 10))
}
