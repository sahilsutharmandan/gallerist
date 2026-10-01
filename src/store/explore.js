import { create } from 'zustand'
import { searchArtworks } from '../api/cma'
import { YEAR_MAX, YEAR_MIN } from '../lib/constants'

export const PAGE_SIZE = 30

export const DEFAULT_FILTERS = {
  q: '',
  department: '',
  type: '',
  range: [YEAR_MIN, YEAR_MAX],
  publicDomain: false,
}

let requestId = 0
let lastKey = ''

function toParams(filters) {
  const [from, to] = filters.range
  return {
    q: filters.q,
    department: filters.department,
    type: filters.type,
    from: from > YEAR_MIN ? from : undefined,
    to: to < YEAR_MAX ? to : undefined,
  }
}

export const useExplore = create((set, get) => ({
  filters: { ...DEFAULT_FILTERS },
  sort: 'relevance',
  results: [],
  total: 0,
  status: 'idle',
  error: null,
  loadingMore: false,

  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
  setSort: (sort) => set({ sort }),

  search: async ({ force = false } = {}) => {
    const params = toParams(get().filters)
    const key = JSON.stringify(params)
    if (!force && key === lastKey && get().status === 'ready') return
    lastKey = key
    const id = ++requestId
    set({ status: 'loading', error: null })
    try {
      const { items, total } = await searchArtworks({ ...params, limit: PAGE_SIZE })
      if (id !== requestId) return
      set({ results: items, total, status: 'ready' })
    } catch (err) {
      if (id !== requestId) return
      lastKey = ''
      set({ status: 'error', error: err.message })
    }
  },

  loadMore: async () => {
    const { results, total, loadingMore, filters } = get()
    if (loadingMore || results.length >= total) return
    const id = requestId
    set({ loadingMore: true })
    try {
      const { items } = await searchArtworks({
        ...toParams(filters),
        skip: results.length,
        limit: PAGE_SIZE,
      })
      if (id !== requestId) return
      const seen = new Set(get().results.map((a) => a.id))
      set((s) => ({
        results: [...s.results, ...items.filter((a) => !seen.has(a.id))],
        loadingMore: false,
      }))
    } catch (err) {
      set({ loadingMore: false })
      throw err
    }
  },
}))
