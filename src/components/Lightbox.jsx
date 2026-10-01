import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { useLightbox } from '../store/lightbox'
import { lockScroll, unlockScroll } from '../lib/scrollLock'
import { artistLine } from '../lib/format'

const MIN_SCALE = 1
const MAX_SCALE = 4

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export default function Lightbox() {
  const items = useLightbox((s) => s.items)
  const index = useLightbox((s) => s.index)
  const close = useLightbox((s) => s.close)
  const step = useLightbox((s) => s.step)
  const art = index >= 0 ? items[index] : null
  const open = Boolean(art)

  const stageRef = useRef(null)
  const imgRef = useRef(null)
  const dragRef = useRef(null)
  const openerRef = useRef(null)
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 })
  const [hiRes, setHiRes] = useState(false)

  const bounded = useCallback((scale, x, y) => {
    const stage = stageRef.current
    const img = imgRef.current
    if (!stage || !img) return { scale, x: 0, y: 0 }
    const maxX = Math.max(0, (img.offsetWidth * scale - stage.clientWidth) / 2)
    const maxY = Math.max(0, (img.offsetHeight * scale - stage.clientHeight) / 2)
    return { scale, x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) }
  }, [])

  const zoomTo = useCallback(
    (next) =>
      setZoom((z) => {
        const scale = clamp(next(z.scale), MIN_SCALE, MAX_SCALE)
        const ratio = scale / z.scale
        return bounded(scale, z.x * ratio, z.y * ratio)
      }),
    [bounded],
  )

  const reset = useCallback(() => setZoom({ scale: 1, x: 0, y: 0 }), [])

  useEffect(() => {
    reset()
    setHiRes(false)
  }, [art?.id, reset])

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

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    const onWheel = (e) => {
      e.preventDefault()
      zoomTo((s) => s * Math.exp(-e.deltaY * 0.0015))
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [open, zoomTo])

  if (!art) return null

  const onPointerDown = (e) => {
    if (zoom.scale <= 1) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { px: e.clientX, py: e.clientY, x: zoom.x, y: zoom.y }
  }

  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    setZoom((z) => bounded(z.scale, d.x + e.clientX - d.px, d.y + e.clientY - d.py))
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

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
          <button type="button" className="lb-btn" onClick={reset} disabled={zoom.scale === 1} aria-label="Reset zoom">
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
        className={`lightbox__stage${zoom.scale > 1 ? ' is-zoomed' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => (zoom.scale > 1 ? reset() : zoomTo(() => 2))}
        onClick={(e) => e.target === e.currentTarget && zoom.scale === 1 && close()}
      >
        <img
          ref={imgRef}
          key={art.id}
          className="lightbox__img"
          src={hiRes ? art.imageLarge : art.image}
          alt={art.title}
          draggable="false"
          style={{ transform: `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.scale})` }}
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
