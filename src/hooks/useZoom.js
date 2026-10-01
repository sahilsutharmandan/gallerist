import { useCallback, useEffect, useRef, useState } from 'react'

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export function useZoom({ min = 1, max = 4, enabled = true, resetKey } = {}) {
  const stageRef = useRef(null)
  const targetRef = useRef(null)
  const dragRef = useRef(null)
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 })

  const bounded = useCallback((scale, x, y) => {
    const el = targetRef.current
    if (!el) return { scale, x: 0, y: 0 }
    const maxX = el.offsetWidth * scale
    const maxY = el.offsetHeight * scale
    return { scale, x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) }
  }, [])

  const zoomTo = useCallback(
    (next) =>
      setZoom((z) => {
        const scale = clamp(next(z.scale), min, max)
        const ratio = scale / z.scale
        return bounded(scale, z.x * ratio, z.y * ratio)
      }),
    [bounded, min, max],
  )

  const reset = useCallback(() => setZoom({ scale: 1, x: 0, y: 0 }), [])

  useEffect(() => {
    reset()
  }, [resetKey, reset])

  useEffect(() => {
    const stage = stageRef.current
    if (!enabled || !stage) return undefined
    const onWheel = (e) => {
      e.preventDefault()
      zoomTo((s) => s * Math.exp(-e.deltaY * 0.0015))
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [enabled, zoomTo])

  const bind = {
    onPointerDown: (e) => {
      if (zoom.scale <= min) return
      e.currentTarget.setPointerCapture(e.pointerId)
      dragRef.current = { px: e.clientX, py: e.clientY, x: zoom.x, y: zoom.y }
    },
    onPointerMove: (e) => {
      const d = dragRef.current
      if (!d) return
      setZoom((z) => bounded(z.scale, d.x + e.clientX - d.px, d.y + e.clientY - d.py))
    },
    onPointerUp: () => {
      dragRef.current = null
    },
    onPointerCancel: () => {
      dragRef.current = null
    },
  }

  const style = {
    transform: `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.scale})`,
    transformOrigin: '0 0',
  }

  return { stageRef, targetRef, zoom, zoomTo, reset, bind, style, zoomed: zoom.scale > min }
}
