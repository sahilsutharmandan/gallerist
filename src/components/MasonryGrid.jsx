import { useEffect, useState } from 'react'
import ArtworkCard from './ArtworkCard'

function useColumnCount() {
  const [cols, setCols] = useState(4)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w <= 860) setCols(2)
      else if (w <= 1180) setCols(3)
      else setCols(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return cols
}

export default function MasonryGrid({ items, onOpen, renderActions }) {
  const columnCount = useColumnCount()
  const columns = Array.from({ length: columnCount }, () => [])
  items.forEach((art, i) => {
    columns[i % columnCount].push(art)
  })

  return (
    <div className="masonry">
      {columns.map((col, cIdx) => (
        <div key={cIdx} className="masonry__col">
          {col.map((art) => (
            <div key={art.id} className="masonry__item">
              <ArtworkCard art={art} onOpen={onOpen} actions={renderActions?.(art)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function MasonrySkeleton({ count = 12 }) {
  const columnCount = useColumnCount()
  const ratios = [1.3, 0.8, 1.1, 1.45, 0.9, 1.2, 0.75, 1.35]
  const columns = Array.from({ length: columnCount }, () => [])
  for (let i = 0; i < count; i++) {
    columns[i % columnCount].push(i)
  }

  return (
    <div className="masonry" aria-hidden="true">
      {columns.map((col, cIdx) => (
        <div key={cIdx} className="masonry__col">
          {col.map((i) => (
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
      ))}
    </div>
  )
}
