import { memo, useState } from 'react'
import Modal from './Modal'
import Icon from './Icon'
import { useCollections } from '../store/collections'
import { toast, useUi } from '../store/ui'
import { artistLine, pluralize } from '../lib/format'

const CollectionChecklist = memo(function CollectionChecklist({ art }) {
  const collections = useCollections((s) => s.collections)
  const toggleItem = useCollections((s) => s.toggleItem)

  if (!collections.length) {
    return <p className="checklist__empty muted">You don’t have any collections yet. Create your first one below.</p>
  }

  return (
    <ul className="checklist">
      {collections.map((c) => {
        const checked = c.items.some((a) => a.id === art.id)
        return (
          <li key={c.id}>
            <label className={`checklist__row${checked ? ' is-checked' : ''}`}>
              <input type="checkbox" checked={checked} onChange={() => toggleItem(c.id, art)} />
              <span className="checklist__box" aria-hidden="true">
                <Icon name="check" strokeWidth={2.6} />
              </span>
              <span className="checklist__thumb">
                {c.items[0] ? <img src={c.items[0].image} alt="" /> : <Icon name="folder" />}
              </span>
              <span className="checklist__text">
                <span className="checklist__name">{c.name}</span>
                <span className="checklist__count">{pluralize(c.items.length, 'work')}</span>
              </span>
            </label>
          </li>
        )
      })}
    </ul>
  )
})

export default function AddToCollectionModal() {
  const art = useUi((s) => s.collectionTarget)
  const close = useUi((s) => s.closeCollectionModal)
  const createCollection = useCollections((s) => s.createCollection)
  const [name, setName] = useState('')

  if (!art) return null

  const handleCreate = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const created = createCollection(trimmed, [art])
    setName('')
    toast(`Created “${created.name}” and added this work`, { tone: 'success' })
  }

  return (
    <Modal
      title="Save to collection"
      onClose={close}
      footer={
        <button type="button" className="btn btn--primary" onClick={close}>
          Done
        </button>
      }
    >
      <div className="save-target">
        <img src={art.image} alt="" />
        <div>
          <p className="save-target__title clamp-2">{art.title}</p>
          <p className="save-target__sub clamp-1">{artistLine(art)}</p>
        </div>
      </div>

      <CollectionChecklist art={art} />

      <form className="new-collection" onSubmit={handleCreate}>
        <label className="field-label" htmlFor="new-collection-name">
          New collection
        </label>
        <div className="new-collection__row">
          <input
            id="new-collection-name"
            className="input"
            placeholder="e.g. Winter light"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn btn--outline" disabled={!name.trim()}>
            <Icon name="plus" /> Create
          </button>
        </div>
      </form>
    </Modal>
  )
}
