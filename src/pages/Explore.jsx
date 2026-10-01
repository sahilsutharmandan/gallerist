import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterToolbar, { ActiveFilters } from '../components/FilterToolbar'
import MasonryGrid, { MasonrySkeleton } from '../components/MasonryGrid'
import CardActions from '../components/CardActions'
import { EmptyState, ErrorState } from '../components/PageState'
import { DEFAULT_FILTERS, useExplore } from '../store/explore'
import { toast } from '../store/ui'
import { useLightbox } from '../store/lightbox'
import { visibleArtworks } from '../lib/sortArtworks'
import { pluralize } from '../lib/format'

export default function Explore() {
  const [params, setParams] = useSearchParams()
  const filters = useExplore((s) => s.filters)
  const sort = useExplore((s) => s.sort)
  const results = useExplore((s) => s.results)
  const total = useExplore((s) => s.total)
  const status = useExplore((s) => s.status)
  const error = useExplore((s) => s.error)
  const loadingMore = useExplore((s) => s.loadingMore)
  const setFilters = useExplore((s) => s.setFilters)
  const setSort = useExplore((s) => s.setSort)
  const search = useExplore((s) => s.search)
  const loadMore = useExplore((s) => s.loadMore)
  const openLightbox = useLightbox((s) => s.open)

  useEffect(() => {
    const q = params.get('q')
    const department = params.get('department')
    const type = params.get('type')
    if (q === null && department === null && type === null) return
    setFilters({ ...DEFAULT_FILTERS, q: q ?? '', department: department ?? '', type: type ?? '' })
    setParams({}, { replace: true })
  }, [params, setFilters, setParams])

  const { q, department, type, range } = filters
  useEffect(() => {
    search()
  }, [q, department, type, range, search])

  const visible = useMemo(
    () => visibleArtworks(results, { sort, publicDomain: filters.publicDomain }),
    [results, sort, filters.publicDomain],
  )

  const handleFilters = useCallback((patch) => setFilters(patch), [setFilters])
  const handleReset = useCallback(() => setFilters({ ...DEFAULT_FILTERS }), [setFilters])

  const handleLoadMore = () => {
    loadMore().catch(() => toast('Couldn’t load more artworks. Try again.', { tone: 'danger' }))
  }

  return (
    <div className="explore">
      <div className="container explore__intro">
        <p className="eyebrow">The collection</p>
        <h1>Explore</h1>
        <p className="muted">
          Over 40,000 open access works, from ancient Egypt to the twentieth century.
        </p>
      </div>

      <FilterToolbar
        filters={filters}
        sort={sort}
        onFilters={handleFilters}
        onSort={setSort}
        onReset={handleReset}
      />

      <div className="container explore__results">
        <div className="explore__summary">
          <p className="muted">
            {status === 'ready'
              ? `${pluralize(total, 'work')} found${visible.length < results.length ? ` · ${visible.length} shown` : ''}`
              : status === 'loading'
                ? 'Searching the collection…'
                : ' '}
          </p>
          <ActiveFilters filters={filters} onFilters={handleFilters} onReset={handleReset} />
        </div>

        {status === 'error' ? <ErrorState message={error} onRetry={() => search({ force: true })} /> : null}
        {status === 'loading' && !results.length ? <MasonrySkeleton /> : null}
        {status !== 'error' && (status !== 'loading' || results.length) ? (
          visible.length ? (
            <div className={status === 'loading' ? 'is-refreshing' : undefined}>
              <MasonryGrid
                items={visible}
                onOpen={(art) => openLightbox(visible, art.id)}
                renderActions={(art) => <CardActions art={art} />}
              />
            </div>
          ) : status === 'ready' ? (
            <EmptyState icon="search" title="No artworks match">
              Try a broader search, or clear some filters.
            </EmptyState>
          ) : null
        ) : null}

        {status === 'ready' && results.length < total ? (
          <div className="explore__more">
            <p className="muted">
              Showing {results.length.toLocaleString()} of {total.toLocaleString()}
            </p>
            <button type="button" className="btn btn--outline btn--lg" onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? <span className="spinner spinner--sm" /> : null}
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
