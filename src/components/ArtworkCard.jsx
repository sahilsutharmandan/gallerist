import { Link } from 'react-router-dom'
import Icon from './Icon'
import { artistLine } from '../lib/format'

export default function ArtworkCard({ art, onOpen, actions }) {
  const maker = artistLine(art)
  const long = maker.length > 48

  return (
    <article className="art-card">
      <div className="art-card__media" style={{ aspectRatio: `${art.width} / ${art.height}` }}>
        <Link to={`/artwork/${art.id}`} className="art-card__img-link" tabIndex={-1} aria-hidden="true">
          <img src={art.image} alt="" loading="lazy" decoding="async" />
        </Link>
        <div className="art-card__actions">
          {actions}
          {onOpen ? (
            <button
              type="button"
              className="art-card__action"
              onClick={() => onOpen(art)}
              aria-label={`View ${art.title} full screen`}
            >
              <Icon name="expand" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="art-card__body">
        <h3 className="art-card__title clamp-2">
          <Link to={`/artwork/${art.id}`}>{art.title}</Link>
        </h3>
        <p className="art-card__maker clamp-2" tabIndex={long ? 0 : undefined}>
          {maker}
        </p>
        {long ? (
          <span className="art-card__tip" role="tooltip">
            {maker}
          </span>
        ) : null}
        <p className="art-card__meta">
          {[art.date, art.type].filter(Boolean).join(' · ')}
        </p>
      </div>
    </article>
  )
}
