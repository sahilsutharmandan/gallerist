import { create } from 'zustand'
import { storage } from '../lib/storage'
import { uid } from '../lib/format'

function initialTheme() {
  const saved = storage.get('settings', {}).theme
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const timers = new Map()

export const useUi = create((set, get) => ({
  theme: initialTheme(),
  toasts: [],
  collectionTarget: null,

  toggleTheme: () => {
    const theme = get().theme === 'dark' ? 'light' : 'dark'
    storage.set('settings', { ...storage.get('settings', {}), theme })
    set({ theme })
  },

  toast: (message, { tone = 'default', duration = 3600 } = {}) => {
    const id = uid()
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }].slice(-4) }))
    timers.set(
      id,
      setTimeout(() => get().dismissToast(id), duration),
    )
    return id
  },

  dismissToast: (id) => {
    clearTimeout(timers.get(id))
    timers.delete(id)
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  },

  openCollectionModal: (artwork) => set({ collectionTarget: artwork }),
  closeCollectionModal: () => set({ collectionTarget: null }),
}))

export const toast = (...args) => useUi.getState().toast(...args)
