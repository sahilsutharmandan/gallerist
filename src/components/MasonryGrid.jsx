import ArtworkCard from './ArtworkCard'

export default function MasonryGrid({ items, onOpen, renderActions }) {
  return (
    <div className="masonry">
      {items.map((art) => (
        <div key={art.id} className="masonry__item">
          <ArtworkCard art={art} onOpen={onOpen} actions={renderActions?.(art)} />
        </div>
      ))}
    </div>
  )
}

export function MasonrySkeleton({ count = 12 }) {
  const ratios = [1.3, 0.8, 1.1, 1.45, 0.9, 1.2, 0.75, 1.35]
  return (
    <div className="masonry" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="masonry__item">
          <div className="art-card art-card--skeleton">
            <div className="skeleton" style={{ aspectRatio: `1 / ${ratios[i % ratios.length]}` }} />
            <div className="art-card__body">
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line skeleton--short" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
