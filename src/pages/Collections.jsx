import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import MasonryGrid from '../components/MasonryGrid'
import CardActions from '../components/CardActions'
import { EmptyState } from '../components/PageState'
import { useCollections } from '../store/collections'
import { useLightbox } from '../store/lightbox'
import { toast } from '../store/ui'
import { pluralize, timeAgo } from '../lib/format'

function CollectionCover({ items }) {
  const thumbs = items.slice(0, 4)
  const extra = items.length - thumbs.length
  return (
    <div className={`collection-cover collection-cover--${items.length || 1}`}>
      {thumbs.length ? (
        thumbs.map((a) => <img key={a.id} src={a.image} alt="" loading="lazy" />)
      ) : (
        <span className="collection-cover__empty">
          <Icon name="image" />
        </span>
      )}
      {extra > 0 ? <span className="collection-cover__more">+{extra}</span> : null}
    </div>
  )
}

export default function Collections() {
  const collections = useCollections((s) => s.collections)
  const favorites = useCollections((s) => s.favorites)
  const createCollection = useCollections((s) => s.createCollection)
  const openLightbox = useLightbox((s) => s.open)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const c = createCollection(name)
    toast(`Created “${c.name}”`, { tone: 'success' })
    setName('')
    setCreating(false)
  }

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Your gallery</p>
          <h1>Collections</h1>
          <p>Group works you love into themed sets. Everything is saved in this browser.</p>
        </div>
        {!creating ? (
          <button type="button" className="btn btn--primary" onClick={() => setCreating(true)}>
            <Icon name="plus" /> New collection
          </button>
        ) : null}
      </div>

      {creating ? (
        <form className="create-card" onSubmit={handleCreate}>
          <label className="field-label" htmlFor="collection-name">
            Collection name
          </label>
          <div className="new-collection__row">
            <input
              id="collection-name"
              className="input"
              autoFocus
              value={name}
              maxLength={60}
              placeholder="e.g. Portraits in red"
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="btn btn--primary" disabled={!name.trim()}>
              Create
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setCreating(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {collections.length ? (
        <div className="collection-grid">
          {collections.map((c) => (
            <Link key={c.id} to={`/collections/${c.id}`} className="collection-card">
              <CollectionCover items={c.items} />
              <div className="collection-card__body">
                <h3 className="clamp-1">{c.name}</h3>
                <p>
                  {pluralize(c.items.length, 'work')} · Updated {timeAgo(c.updatedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon="folder" title="No collections yet">
          Use the + button on any artwork to start a collection.
        </EmptyState>
      )}

      <section className="favorites">
        <div className="related__head">
          <div>
            <p className="eyebrow">Quick picks</p>
            <h2>
              Favorites <span className="muted favorites__count">{favorites.length || ''}</span>
            </h2>
          </div>
        </div>
        {favorites.length ? (
          <MasonryGrid
            items={favorites}
            onOpen={(art) => openLightbox(favorites, art.id)}
            renderActions={(art) => <CardActions art={art} />}
          />
        ) : (
          <p className="muted">Tap the heart on an artwork to keep it here.</p>
        )}
      </section>
    </div>
  )
}
