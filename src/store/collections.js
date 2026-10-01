import { create } from 'zustand'
import { storage } from '../lib/storage'
import { uid } from '../lib/format'

function snapshot(art) {
  const { id, title, artist, culture, date, yearStart, yearEnd, department, type, technique, license, image, imageLarge, width, height } = art
  return { id, title, artist, culture, date, yearStart, yearEnd, department, type, technique, license, image, imageLarge, width, height }
}

function touch(collection, patch) {
  return { ...collection, ...patch, updatedAt: Date.now() }
}

function mapCollection(collections, id, fn) {
  return collections.map((c) => (c.id === id ? fn(c) : c))
}

export const useCollections = create((set, get) => ({
  collections: storage.get('collections', []),
  favorites: storage.get('favorites', []),

  createCollection: (name, items = []) => {
    const now = Date.now()
    const collection = {
      id: uid(),
      name: name.trim(),
      description: '',
      items: items.map(snapshot),
      createdAt: now,
      updatedAt: now,
    }
    const { collections } = get()
    collections.push(collection)
    set({ collections })
    return collection
  },

  updateCollection: (id, patch) =>
    set((s) => ({ collections: mapCollection(s.collections, id, (c) => touch(c, patch)) })),

  deleteCollection: (id) => set((s) => ({ collections: s.collections.filter((c) => c.id !== id) })),

  toggleItem: (id, art) =>
    set((s) => ({
      collections: mapCollection(s.collections, id, (c) =>
        touch(c, {
          items: c.items.some((a) => a.id === art.id)
            ? c.items.filter((a) => a.id !== art.id)
            : [...c.items, snapshot(art)],
        }),
      ),
    })),

  removeItem: (id, artId) =>
    set((s) => ({
      collections: mapCollection(s.collections, id, (c) =>
        touch(c, { items: c.items.filter((a) => a.id !== artId) }),
      ),
    })),

  moveItem: (id, from, to) =>
    set((s) => ({
      collections: mapCollection(s.collections, id, (c) => {
        if (to < 0 || to >= c.items.length || from === to) return c
        const items = [...c.items]
        const [moved] = items.splice(from, 1)
        items.splice(to, 0, moved)
        return touch(c, { items })
      }),
    })),

  isFavorite: (artId) => get().favorites.some((a) => a.id === artId),

  toggleFavorite: (art) => {
    const exists = get().favorites.some((a) => a.id === art.id)
    set((s) => ({
      favorites: exists ? s.favorites.filter((a) => a.id !== art.id) : [snapshot(art), ...s.favorites],
    }))
    return !exists
  },
}))

useCollections.subscribe((state) => {
  storage.set('collections', state.collections)
  storage.set('favorites', state.favorites)
})
