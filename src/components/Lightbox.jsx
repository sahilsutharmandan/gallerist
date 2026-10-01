import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { useLightbox } from '../store/lightbox'
import { useZoom } from '../hooks/useZoom'
import { lockScroll, unlockScroll } from '../lib/scrollLock'
import { artistLine } from '../lib/format'

const MIN_SCALE = 1
const MAX_SCALE = 4

export default function Lightbox() {
  const items = useLightbox((s) => s.items)
  const index = useLightbox((s) => s.index)
  const close = useLightbox((s) => s.close)
  const step = useLightbox((s) => s.step)
  const art = index >= 0 ? items[index] : null
  const open = Boolean(art)

  const openerRef = useRef(null)
  const [hiRes, setHiRes] = useState(false)
  const { stageRef, targetRef, zoom, zoomTo, reset, bind, style, zoomed } = useZoom({
    min: MIN_SCALE,
    max: MAX_SCALE,
    enabled: open,
    resetKey: art?.id,
  })

  useEffect(() => {
    setHiRes(false)
  }, [art?.id])

  useEffect(() => {
    if (zoom.scale > 1.2) setHiRes(true)
  }, [zoom.scale])

  useEffect(() => {
    if (!open) return undefined
    openerRef.current = document.activeElement
    lockScroll()
    return () => {
      unlockScroll()
      openerRef.current?.focus?.({ preventScroll: true })
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === '+' || e.key === '=') zoomTo((s) => s * 1.5)
      else if (e.key === '-') zoomTo((s) => s / 1.5)
      else if (e.key === '0') reset()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, step, zoomTo, reset])

  if (!art) return null

  const many = items.length > 1

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={art.title}>
      <div className="lightbox__bar">
        <p className="lightbox__count">{many ? `${index + 1} / ${items.length}` : ' '}</p>
        <div className="lightbox__tools">
          <button type="button" className="lb-btn" onClick={() => zoomTo((s) => s / 1.5)} disabled={zoom.scale <= MIN_SCALE} aria-label="Zoom out">
            <Icon name="minus" />
          </button>
          <span className="lightbox__scale">{Math.round(zoom.scale * 100)}%</span>
          <button type="button" className="lb-btn" onClick={() => zoomTo((s) => s * 1.5)} disabled={zoom.scale >= MAX_SCALE} aria-label="Zoom in">
            <Icon name="plus" />
          </button>
          <button type="button" className="lb-btn" onClick={reset} disabled={!zoomed} aria-label="Reset zoom">
            <Icon name="reset" />
          </button>
          <span className="lightbox__divider" />
          <button type="button" className="lb-btn" onClick={close} aria-label="Close viewer">
            <Icon name="close" />
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className={`lightbox__stage${zoomed ? ' is-zoomed' : ''}`}
        {...bind}
        onDoubleClick={() => (zoomed ? reset() : zoomTo(() => 2))}
        onClick={(e) => e.target === e.currentTarget && !zoomed && close()}
      >
        <img
          ref={targetRef}
          key={art.id}
          className="lightbox__img"
          src={hiRes ? art.imageLarge : art.image}
          alt={art.title}
          draggable="false"
          style={style}
        />
      </div>

      {many ? (
        <>
          <button type="button" className="lb-arrow lb-arrow--prev" onClick={() => step(-1)} aria-label="Previous artwork">
            <Icon name="chevronLeft" />
          </button>
          <button type="button" className="lb-arrow lb-arrow--next" onClick={() => step(1)} aria-label="Next artwork">
            <Icon name="chevronRight" />
          </button>
        </>
      ) : null}

      <div className="lightbox__caption">
        <div>
          <p className="lightbox__title">{art.title}</p>
          <p className="lightbox__sub">{[artistLine(art), art.date].filter(Boolean).join(' · ')}</p>
        </div>
        <Link to={`/artwork/${art.id}`} className="btn btn--sm lightbox__link" onClick={close}>
          Details
        </Link>
      </div>
    </div>
  )
}
