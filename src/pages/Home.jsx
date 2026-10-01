import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { searchArtworks } from '../api/cma'
import { DEPARTMENTS, HERO } from '../lib/constants'
import { artistLine } from '../lib/format'
import { useLightbox } from '../store/lightbox'

const SUGGESTIONS = ['Monet', 'Hokusai', 'armor', 'Tiffany', 'Egyptian coffin', 'Rembrandt']

function Highlights() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const openLightbox = useLightbox((s) => s.open)
  const railRef = useRef(null)

  useEffect(() => {
    const ctrl = new AbortController()
    searchArtworks({ highlight: true, type: 'Painting', limit: 14, skip: 20 }, ctrl.signal)
      .then(({ items: list }) => {
        setItems(list)
        setStatus('ready')
      })
      .catch((err) => err.name !== 'AbortError' && setStatus('error'))
    return () => ctrl.abort()
  }, [])

  const scroll = (dir) => railRef.current?.scrollBy({ left: dir * railRef.current.clientWidth * 0.8, behavior: 'smooth' })

  if (status === 'error') return null

  return (
    <section className="home-section">
      <div className="container">
        <div className="related__head">
          <div>
            <p className="eyebrow">Collection highlights</p>
            <h2>Paintings worth the trip</h2>
          </div>
          <div className="rail-nav">
            <button type="button" className="icon-btn rail-nav__btn" onClick={() => scroll(-1)} aria-label="Scroll left">
              <Icon name="chevronLeft" />
            </button>
            <button type="button" className="icon-btn rail-nav__btn" onClick={() => scroll(1)} aria-label="Scroll right">
              <Icon name="chevronRight" />
            </button>
          </div>
        </div>
      </div>
      <div className="rail" ref={railRef}>
        {status === 'loading'
          ? Array.from({ length: 6 }, (_, i) => <div key={i} className="rail__item rail__item--skeleton skeleton" />)
          : items.map((art) => (
              <figure key={art.id} className="rail__item">
                <button type="button" className="rail__img" onClick={() => openLightbox(items, art.id)} aria-label={`View ${art.title} full screen`}>
                  <img src={art.image} alt="" loading="lazy" />
                </button>
                <figcaption>
                  <Link to={`/artwork/${art.id}`} className="rail__title clamp-1">
                    {art.title}
                  </Link>
                  <p className="clamp-1">{artistLine(art)}</p>
                </figcaption>
              </figure>
            ))}
      </div>
    </section>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const go = (q) => navigate(`/explore?q=${encodeURIComponent(q)}`)

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">Cleveland Museum of Art · Open Access</p>
            <h1>
              Wander the galleries <em>from anywhere.</em>
            </h1>
            <p className="hero__lede">
              Search more than 40,000 artworks across five thousand years. Zoom into brushstrokes, build your own
              collections and set two masterpieces side by side.
            </p>
            <form
              className="hero__search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                go(query)
              }}
            >
              <Icon name="search" />
              <input
                className="input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try “water lilies” or “samurai armor”"
                aria-label="Search the collection"
              />
              <button type="submit" className="btn btn--primary">
                Search
              </button>
            </form>
            <div className="hero__suggest">
              <span className="muted">Popular:</span>
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="chip chip--btn" onClick={() => go(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <figure className="hero__art">
            <Link to={`/artwork/${HERO.id}`} className="hero__frame">
              <img src={HERO.image} alt={HERO.title} />
            </Link>
            <figcaption>
              <span className="clamp-1">{HERO.title}</span>
              <span className="muted">{HERO.artist}, 1835</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="related__head">
            <div>
              <p className="eyebrow">Departments</p>
              <h2>Start with a gallery</h2>
            </div>
            <Link to="/explore" className="btn btn--outline btn--sm">
              Browse everything
            </Link>
          </div>
          <div className="dept-grid">
            {DEPARTMENTS.map((d) => (
              <Link key={d.name} to={`/explore?department=${encodeURIComponent(d.name)}`} className="dept-card">
                <img src={d.cover} alt="" loading="lazy" />
                <span className="dept-card__label">
                  {d.short}
                  <Icon name="chevronRight" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Highlights />

      <section className="home-section">
        <div className="container">
          <div className="home-cta">
            <div>
              <h2>Make it yours</h2>
              <p className="muted">
                Save favorites, group them into collections, and reorder them into your own exhibition.
              </p>
            </div>
            <div className="home-cta__actions">
              <Link to="/collections" className="btn btn--primary btn--lg">
                <Icon name="folder" /> My collections
              </Link>
              <Link to="/compare" className="btn btn--outline btn--lg">
                <Icon name="columns" /> Compare works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
