import { create } from 'zustand'
import { useExplore } from './explore'

export const useLightbox = create((set) => ({
  items: [],
  index: -1,

  open: (id, items = useExplore.getState().results) => {
    const index = items.findIndex((a) => a.id === id)
    set({ items, index: index < 0 ? 0 : index })
  },

  close: () => set({ index: -1 }),

  step: (dir) =>
    set((s) => {
      const n = s.items.length
      if (!n) return s
      return { index: (s.index + dir + n) % n }
    }),
}))
