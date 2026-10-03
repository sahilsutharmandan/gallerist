import { create } from 'zustand'
import { useExplore } from './explore'
import { visibleArtworks } from '../lib/sortArtworks'

export const useLightbox = create((set) => ({
  items: [],
  index: -1,

  open: (id, items) => {
    const exploreState = useExplore.getState()
    const fallback = visibleArtworks(exploreState.results, {
      sort: exploreState.sort,
      publicDomain: exploreState.filters.publicDomain,
    })
    const list = items ?? fallback
    const index = list.findIndex((a) => a.id === id)
    set({ items: list, index: index < 0 ? 0 : index })
  },

  close: () => set({ index: -1 }),

  step: (dir) =>
    set((s) => {
      const n = s.items.length
      if (!n) return s
      return { index: (s.index + dir + n) % n }
    }),
}))
