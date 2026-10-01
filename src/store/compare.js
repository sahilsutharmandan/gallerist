import { create } from 'zustand'
import { storage } from '../lib/storage'

const MAX = 2

export const useCompare = create((set, get) => ({
  slots: storage.get('compare', [null, null]),

  has: (id) => get().slots.some((a) => a?.id === id),

  add: (art) => {
    const slots = [...get().slots]
    if (slots.some((a) => a?.id === art.id)) return slots.filter(Boolean).length
    const empty = slots.findIndex((a) => !a)
    slots[empty === -1 ? MAX - 1 : empty] = art
    set({ slots })
    return slots.filter(Boolean).length
  },

  setSlot: (index, art) =>
    set((s) => {
      const slots = [...s.slots]
      slots[index] = art
      return { slots }
    }),

  remove: (id) => set((s) => ({ slots: s.slots.map((a) => (a?.id === id ? null : a)) })),

  swap: () => set((s) => ({ slots: [s.slots[1], s.slots[0]] })),
}))

useCompare.subscribe((state) => storage.set('compare', state.slots))
