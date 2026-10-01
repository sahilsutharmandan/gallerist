import { useEffect, useRef } from 'react'
import Icon from './Icon'
import { lockScroll, unlockScroll } from '../lib/scrollLock'

export default function Modal({ title, onClose, children, footer, size = 'md' }) {
  const panelRef = useRef(null)

  useEffect(() => {
    lockScroll()
    const opener = document.activeElement
    panelRef.current?.querySelector('input, button:not(.modal__close)')?.focus({ preventScroll: true })
    return () => {
      unlockScroll()
      opener?.focus?.({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panelRef} className={`modal__panel modal__panel--${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal__head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn modal__close" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer ? <div className="modal__foot">{footer}</div> : null}
      </div>
    </div>
  )
}
