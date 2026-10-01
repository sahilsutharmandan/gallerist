import { useEffect, useState } from 'react'
import { getArtwork, searchArtworks, toSummary } from '../api/cma'

const cache = new Map()

export function useArtwork(id) {
  const [state, setState] = useState(() =>
    cache.has(id) ? { data: cache.get(id), status: 'ready', error: null } : { data: null, status: 'loading', error: null },
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!id) return undefined
    if (cache.has(id)) {
      setState({ data: cache.get(id), status: 'ready', error: null })
      return undefined
    }
    const ctrl = new AbortController()
    setState({ data: null, status: 'loading', error: null })
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
  }, [id, attempt])

  return { ...state, summary: state.data ? toSummary(state.data) : null, retry: () => setAttempt((n) => n + 1) }
}

export function useRelated(department, excludeId, limit = 8) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!department) return undefined
    const ctrl = new AbortController()
    setStatus('loading')
    const skip = Number(String(excludeId).slice(-2)) % 40
    searchArtworks({ department, limit: limit + 1, skip }, ctrl.signal)
      .then(({ items: list }) => {
        setItems(list.filter((a) => a.id !== excludeId).slice(0, limit))
        setStatus('ready')
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('error')
      })
    return () => ctrl.abort()
  }, [department, excludeId, limit])

  return { items, status }
}
