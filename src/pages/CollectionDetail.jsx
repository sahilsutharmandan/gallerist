import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { EmptyState } from '../components/PageState'
import { useCollections } from '../store/collections'
import { useLightbox } from '../store/lightbox'
import { toast } from '../store/ui'
import { artistLine, pluralize, timeAgo } from '../lib/format'

export default function CollectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const collection = useCollections((s) => s.collections.find((c) => c.id === id))
  const updateCollection = useCollections((s) => s.updateCollection)
  const deleteCollection = useCollections((s) => s.deleteCollection)
  const removeItem = useCollections((s) => s.removeItem)
  const moveItem = useCollections((s) => s.moveItem)
  const openLightbox = useLightbox((s) => s.open)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ name: '', description: '' })
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)
  const updated = useMemo(() => timeAgo(collection.updatedAt), [collection.updatedAt])

  if (!collection) {
    return (
      <div className="container page">
        <EmptyState
          icon="folder"
          title="Collection not found"
          action={
            <Link to="/collections" className="btn btn--primary">
              Back to collections
            </Link>
          }
        >
          It may have been deleted.
        </EmptyState>
      </div>
    )
  }

  const { items } = collection

  const startEdit = () => {
    setDraft({ name: collection.name, description: collection.description })
    setEditing(true)
  }

  const saveEdit = (e) => {
    e.preventDefault()
    if (!draft.name.trim()) return
    updateCollection(collection.id, { name: draft.name.trim(), description: draft.description.trim() })
    setEditing(false)
    toast('Collection updated', { tone: 'success' })
  }

  const handleDelete = () => {
    if (!window.confirm(`Delete “${collection.name}”? This can’t be undone.`)) return
    deleteCollection(collection.id)
    toast(`Deleted “${collection.name}”`)
    navigate('/collections')
  }

  const handleRemove = (art) => {
    removeItem(collection.id, art.id)
    toast(`Removed “${art.title}”`)
  }

  const onDrop = (index) => {
    if (dragIndex !== null) moveItem(collection.id, dragIndex, index)
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="container page">
      <Link to="/collections" className="back-link">
        <Icon name="chevronLeft" /> All collections
      </Link>

      {editing ? (
        <form className="collection-edit" onSubmit={saveEdit}>
          <input
            className="input collection-edit__name"
            value={draft.name}
            maxLength={60}
            autoFocus
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            aria-label="Collection name"
          />
          <textarea
            className="input collection-edit__desc"
            rows={2}
            placeholder="Add a short description"
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            aria-label="Description"
          />
          <div className="collection-edit__actions">
            <button type="submit" className="btn btn--primary btn--sm">
              Save
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="page-head">
          <div>
            <p className="eyebrow">
              {pluralize(items.length, 'work')} · Updated {updated}
            </p>
            <h1>{collection.name}</h1>
            {collection.description ? <p>{collection.description}</p> : null}
          </div>
          <div className="page-head__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => openLightbox(items, items[0].id)}
              disabled={!items.length}
            >
              <Icon name="expand" /> View all
            </button>
            <button type="button" className="btn btn--outline" onClick={startEdit}>
              <Icon name="edit" /> Edit
            </button>
            <button type="button" className="btn btn--ghost btn--danger" onClick={handleDelete}>
              <Icon name="trash" /> Delete
            </button>
          </div>
        </div>
      )}

      {items.length ? (
        <ol className="collection-list">
          {items.map((art, index) => (
            <li
              key={art.id}
              className={`collection-row${dragIndex === index ? ' is-dragging' : ''}${
                overIndex === index && dragIndex !== index ? ' is-over' : ''
              }`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move'
                setDragIndex(index)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setOverIndex(index)
              }}
              onDragEnd={() => {
                setDragIndex(null)
                setOverIndex(null)
              }}
              onDrop={() => onDrop(index)}
            >
              <span className="collection-row__grip" aria-hidden="true">
                <Icon name="grip" />
              </span>
              <span className="collection-row__index">{index + 1}</span>
              <button
                type="button"
                className="collection-row__thumb"
                onClick={() => openLightbox(items, art.id)}
                aria-label={`View ${art.title} full screen`}
              >
                <img src={art.image} alt="" loading="lazy" />
              </button>
              <div className="collection-row__text">
                <Link to={`/artwork/${art.id}`} className="collection-row__title clamp-1">
                  {art.title}
                </Link>
                <p className="clamp-1">{artistLine(art)}</p>
                <p className="collection-row__date">{[art.date, art.type].filter(Boolean).join(' · ')}</p>
              </div>
              <div className="collection-row__actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => moveItem(collection.id, index, index - 1)}
                  disabled={index === 0}
                  aria-label="Move up"
                >
                  <Icon name="arrowUp" />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => moveItem(collection.id, index, index + 1)}
                  disabled={index === items.length - 1}
                  aria-label="Move down"
                >
                  <Icon name="arrowDown" />
                </button>
                <button type="button" className="icon-btn icon-btn--danger" onClick={() => handleRemove(art)} aria-label="Remove">
                  <Icon name="trash" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState
          icon="image"
          title="This collection is empty"
          action={
            <Link to="/explore" className="btn btn--primary">
              Find artworks
            </Link>
          }
        >
          Browse the collection and use the + button to add works here.
        </EmptyState>
      )}
    </div>
  )
}
