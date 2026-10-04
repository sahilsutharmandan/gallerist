import { useEffect, useState } from 'react'
import { getArtwork, searchArtworks, toSummary } from '../api/cma'

const cache = new Map()
const relatedCache = new Map()

const LOADING = { data: null, status: 'loading', error: null }

export function useArtwork(id) {
  const [state, setState] = useState(() =>
    cache.has(id) ? { data: cache.get(id), status: 'ready', error: null } : LOADING,
  )

  useEffect(() => {
    if (!id) return undefined
    if (cache.has(id)) {
      setState({ data: cache.get(id), status: 'ready', error: null })
      return undefined
    }
    const ctrl = new AbortController()
    setState(LOADING)
    getArtwork(id, ctrl.signal)
      .then((data) => {
        cache.set(id, data)
        setState({ data, status: 'ready', error: null })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setState({ data: null, status: 'error', error: err.message })
      })
    return () => ctrl.abort()
  }, [id])

  return { ...state, summary: state.data ? toSummary(state.data) : null, retry: () => setState(LOADING) }
}

export function useRelated(department, excludeId, limit = 8) {
  const [items, setItems] = useState(() => relatedCache.get(department) ?? [])
  const [status, setStatus] = useState(() => (relatedCache.has(department) ? 'ready' : 'idle'))

  useEffect(() => {
    if (!department) return undefined
    if (relatedCache.has(department)) {
      setItems(relatedCache.get(department))
      setStatus('ready')
      return undefined
    }
    const ctrl = new AbortController()
    setStatus('loading')
    const skip = Number(String(excludeId).slice(-2)) % 40
    searchArtworks({ department, limit: limit + 1, skip }, ctrl.signal)
      .then(({ items: list }) => {
        const picked = list.filter((a) => a.id !== excludeId).slice(0, limit)
        relatedCache.set(department, picked)
        setItems(picked)
        setStatus('ready')
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('error')
      })
    return () => ctrl.abort()
  }, [department, excludeId, limit])

  return { items, status }
}
