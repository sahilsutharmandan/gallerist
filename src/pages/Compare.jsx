import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { useArtwork } from '../hooks/useArtwork'
import { useCompare } from '../store/compare'
import { useCollections } from '../store/collections'
import { useLightbox } from '../store/lightbox'
import { artistLine } from '../lib/format'

function ComparePanel({ art, onRemove, onOpen }) {
  const { data } = useArtwork(art.id)
  return (
    <figure className="compare__panel">
      <button type="button" className="compare__frame" onClick={() => onOpen(art)} aria-label={`View ${art.title} full screen`}>
        <img src={art.image} alt={art.title} />
      </button>
      <figcaption className="compare__caption">
        <div className="compare__caption-head">
          <Link to={`/artwork/${art.id}`} className="compare__title">
            {art.title}
          </Link>
          <button type="button" className="icon-btn" onClick={() => onRemove(art.id)} aria-label="Remove from comparison">
            <Icon name="close" />
          </button>
        </div>
        <p className="compare__artist">{artistLine(art)}</p>
        <dl className="compare__facts">
          <div>
            <dt>Date</dt>
            <dd>{art.date || '—'}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{art.type || '—'}</dd>
          </div>
          <div>
            <dt>Medium</dt>
            <dd>{data?.technique || art.technique || '—'}</dd>
          </div>
          <div>
            <dt>Department</dt>
            <dd>{art.department || '—'}</dd>
          </div>
          <div>
            <dt>Dimensions</dt>
            <dd>{data ? data.measurements || '—' : '…'}</dd>
          </div>
        </dl>
      </figcaption>
    </figure>
  )
}

function SlotPicker({ index, exclude }) {
  const setSlot = useCompare((s) => s.setSlot)
  const favorites = useCollections((s) => s.favorites)
  const collections = useCollections((s) => s.collections)
  const [source, setSource] = useState('favorites')

  const options = useMemo(() => {
    const list = source === 'favorites' ? favorites : collections.find((c) => c.id === source)?.items ?? []
    return list.filter((a) => a.id !== exclude)
  }, [source, favorites, collections, exclude])

  return (
    <div className="compare__panel compare__picker">
      <div className="compare__frame compare__frame--empty">
        <Icon name="image" />
        <p>Choose an artwork</p>
      </div>
      <div className="compare__caption">
        <label className="field-label" htmlFor={`slot-${index}`}>
          Pick from
        </label>
        <select id={`slot-${index}`} className="select" value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="favorites">Favorites</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {options.length ? (
          <div className="picker-grid">
            {options.slice(0, 12).map((a) => (
              <button key={a.id} type="button" className="picker-grid__item" onClick={() => setSlot(index, a)} title={a.title}>
                <img src={a.image} alt={a.title} loading="lazy" />
              </button>
            ))}
          </div>
        ) : (
          <p className="muted compare__hint">
            Nothing here yet. Use “Compare” on any artwork page, or{' '}
            <Link to="/explore" className="link-btn">
              explore the collection
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  )
}

export default function Compare() {
  const slots = useCompare((s) => s.slots)
  const remove = useCompare((s) => s.remove)
  const swap = useCompare((s) => s.swap)
  const openLightbox = useLightbox((s) => s.open)
  const filled = slots.filter(Boolean)

  const open = (art) => openLightbox(art.id, filled)

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Side by side</p>
          <h1>Compare</h1>
          <p>Put two works next to each other to study scale, palette and technique.</p>
        </div>
      </div>

      <div className="compare-grid">
        {slots.map((art, i) => (
          <div key={art?.id ?? `empty-${i}`} className="compare__slot">
            {art ? (
              <ComparePanel art={art} onRemove={remove} onOpen={open} />
            ) : (
              <SlotPicker index={i} exclude={slots[1 - i]?.id} />
            )}
          </div>
        ))}
        <button type="button" className="compare__swap btn btn--outline btn--sm" onClick={swap} disabled={!filled.length}>
          <Icon name="swap" /> Swap
        </button>
      </div>
    </div>
  )
}
