import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { ErrorState, Loading } from '../components/PageState'
import { useArtwork, useRelated } from '../hooks/useArtwork'
import { RichText, plainText } from '../lib/richText'
import { artistName } from '../lib/format'
import { toast, useUi } from '../store/ui'
import { useCollections } from '../store/collections'
import { useCompare } from '../store/compare'
import { useLightbox } from '../store/lightbox'

function Meta({ label, children }) {
  if (!children) return null
  return (
    <div className="meta-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function RelatedStrip({ department, items, status, onOpen }) {
  if (status !== 'loading' && !items.length) return null
  return (
    <section className="related">
      <div className="related__head">
        <div>
          <p className="eyebrow">Keep looking</p>
          <h2>More from {department}</h2>
        </div>
        <Link to={`/explore?department=${encodeURIComponent(department)}`} className="btn btn--outline btn--sm">
          View all
        </Link>
      </div>
      <div className="related__grid">
        {status === 'loading'
          ? Array.from({ length: 8 }, (_, i) => <div key={i} className="related__card skeleton" />)
          : items.map((art) => (
              <Link key={art.id} to={`/artwork/${art.id}`} className="related__card">
                <div className="related__thumb">
                  <img src={art.image} alt="" loading="lazy" />
                  <button
                    type="button"
                    className="art-card__action related__open"
                    onClick={(e) => {
                      e.preventDefault()
                      onOpen(art)
                    }}
                    aria-label={`View ${art.title} full screen`}
                  >
                    <Icon name="expand" />
                  </button>
                </div>
                <p className="related__title clamp-2">{art.title}</p>
                <p className="related__date">{art.date}</p>
              </Link>
            ))}
      </div>
    </section>
  )
}

export default function ArtworkDetail() {
  const { id } = useParams()
  const artworkId = Number(id)
  const { data, summary, status, error, retry } = useArtwork(artworkId)
  const related = useRelated(data?.department, artworkId)
  const openLightbox = useLightbox((s) => s.open)
  const favorite = useCollections((s) => s.favorites.some((a) => a.id === artworkId))
  const savedIn = useCollections((s) => s.collections.filter((c) => c.items.some((a) => a.id === artworkId)).length)
  const toggleFavorite = useCollections((s) => s.toggleFavorite)
  const openCollectionModal = useUi((s) => s.openCollectionModal)
  const inCompare = useCompare((s) => s.slots.some((a) => a?.id === artworkId))
  const addToCompare = useCompare((s) => s.add)
  const navigate = useNavigate()
  const [bioOpen, setBioOpen] = useState(false)

  if (status === 'loading') return <Loading label="Fetching artwork" />
  if (status === 'error') return <ErrorState message={error} onRetry={retry} />
  if (!data) return null

  const creator = data.creators?.[0]
  const culture = (data.culture ?? []).filter(Boolean).join('; ')
  const web = data.images?.web

  const gallery = [summary, ...related.items]
  const openViewer = (art) => openLightbox(gallery, art.id)

  const copyTombstone = async () => {
    try {
      await navigator.clipboard.writeText(data.tombstone)
      toast('Citation copied to clipboard', { tone: 'success' })
    } catch {
      toast('Couldn’t access the clipboard', { tone: 'danger' })
    }
  }

  return (
    <div className="detail">
      <div className="container detail__layout">
        <div className="detail__stage">
          <button
            type="button"
            className="detail__image"
            onClick={() => openViewer(summary)}
            aria-label="Open full screen"
          >
            <img
              src={web?.url}
              alt={data.title}
              width={web?.width}
              height={web?.height}
            />
            <span className="detail__zoom-hint">
              <Icon name="expand" /> Full screen
            </span>
          </button>
        </div>

        <div className="detail__info">
          <Link to={`/explore?department=${encodeURIComponent(data.department)}`} className="eyebrow">
            {data.department}
          </Link>
          <h1 className="detail__title">{data.title}</h1>
          {creator ? (
            <p className="detail__artist">
              <strong>{artistName(creator.description)}</strong>
              <span className="muted">{creator.description.replace(artistName(creator.description), '').trim()}</span>
            </p>
          ) : culture ? (
            <p className="detail__artist">
              <strong>{culture}</strong>
            </p>
          ) : null}
          <p className="detail__date">{data.creation_date}</p>

          <div className="detail__actions">
            <button
              type="button"
              className={`btn btn--primary${favorite ? ' is-active' : ''}`}
              onClick={() => {
                const added = toggleFavorite(summary)
                toast(added ? 'Added to favorites' : 'Removed from favorites', { tone: added ? 'success' : 'default' })
              }}
              aria-pressed={favorite}
            >
              <Icon name="heart" /> {favorite ? 'Favorited' : 'Favorite'}
            </button>
            <button type="button" className="btn btn--outline" onClick={() => openCollectionModal(summary)}>
              <Icon name="folder" /> {savedIn ? `In ${savedIn} collection${savedIn > 1 ? 's' : ''}` : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => {
                if (inCompare) return navigate('/compare')
                const count = addToCompare(summary)
                toast(count < 2 ? 'Added to compare — pick one more' : 'Ready to compare', { tone: 'success' })
                if (count >= 2) navigate('/compare')
              }}
            >
              <Icon name="columns" /> {inCompare ? 'Open compare' : 'Compare'}
            </button>
            {data.url ? (
              <a href={data.url} target="_blank" rel="noreferrer" className="btn btn--outline">
                <Icon name="external" /> Museum page
              </a>
            ) : null}
          </div>

          <dl className="meta">
            <Meta label="Date">{data.creation_date}</Meta>
            <Meta label="Culture">{culture}</Meta>
            <Meta label="Type">{data.type}</Meta>
            <Meta label="Medium">{data.technique}</Meta>
            <Meta label="Dimensions">{data.measurements}</Meta>
            <Meta label="Credit line">{data.creditline}</Meta>
            <Meta label="Accession no.">{data.accession_number}</Meta>
            <Meta label="On view">{data.current_location}</Meta>
            <Meta label="Rights">
              {data.share_license_status === 'CC0' ? 'Public domain (CC0)' : data.share_license_status}
            </Meta>
          </dl>
        </div>
      </div>

      <div className="container detail__text">
        {data.description ? (
          <section className="detail__section">
            <h2>About this work</h2>
            <RichText html={data.description} className="prose" />
          </section>
        ) : null}
        {data.did_you_know ? (
          <section className="detail__section detail__fact">
            <h3>Did you know?</h3>
            <RichText html={data.did_you_know} />
          </section>
        ) : null}
        {creator?.biography ? (
          <section className="detail__section">
            <h2>About the artist</h2>
            <p className={`prose${bioOpen ? '' : ' clamp-3'}`}>{plainText(creator.biography)}</p>
            <button type="button" className="link-btn" onClick={() => setBioOpen((o) => !o)}>
              {bioOpen ? 'Show less' : 'Read more'}
            </button>
          </section>
        ) : null}
        {data.tombstone ? (
          <section className="detail__section">
            <div className="detail__section-head">
              <h2>Tombstone</h2>
              <button type="button" className="btn btn--ghost btn--sm" onClick={copyTombstone}>
                Copy citation
              </button>
            </div>
            <blockquote className="tombstone">{data.tombstone}</blockquote>
          </section>
        ) : null}
      </div>

      <div className="container">
        <RelatedStrip
          department={data.department}
          items={related.items}
          status={related.status}
          onOpen={openViewer}
        />
      </div>
    </div>
  )
}
