import { useEffect, useState } from 'react'
import Icon from './Icon'
import DateFilter, { isAnyDate } from './DateFilter'
import { DEPARTMENTS, SORTS, TYPES } from '../lib/constants'
import { formatYearRange } from '../lib/format'
import { DEFAULT_FILTERS } from '../store/explore'

export default function FilterToolbar({ filters, sort, onFilters, onSort, onReset }) {
  const [query, setQuery] = useState(filters.q)
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => setQuery(filters.q), [filters.q])

  useEffect(() => {
    if (query === filters.q) return undefined
    const t = setTimeout(() => onFilters({ q: query }), 450)
    return () => clearTimeout(t)
  }, [query, filters.q, onFilters])

  const activeCount =
    (filters.department ? 1 : 0) +
    (filters.type ? 1 : 0) +
    (isAnyDate(filters.range) ? 0 : 1) +
    (filters.publicDomain ? 1 : 0)

  return (
    <div className="filter-bar">
      <div className="filter-bar__inner container">
        <form
          className="filter-bar__search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            onFilters({ q: query })
          }}
        >
          <Icon name="search" />
          <input
            className="input"
            type="search"
            placeholder="Search artists, titles, places…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the collection"
          />
        </form>

        <button
          type="button"
          className="btn btn--outline filter-bar__toggle"
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
        >
          <Icon name="filter" /> Filters
          {activeCount ? <span className="badge">{activeCount}</span> : null}
        </button>

        <div className={`filter-bar__controls${panelOpen ? ' is-open' : ''}`}>
          <select
            className="select"
            value={filters.department}
            onChange={(e) => onFilters({ department: e.target.value })}
            aria-label="Department"
          >
            <option value="">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.short}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={filters.type}
            onChange={(e) => onFilters({ type: e.target.value })}
            aria-label="Object type"
          >
            <option value="">All types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <DateFilter value={filters.range} onChange={(range) => onFilters({ range })} />
          <label className="switch">
            <input
              type="checkbox"
              checked={filters.publicDomain}
              onChange={(e) => onFilters({ publicDomain: e.target.checked })}
            />
            <span className="switch__track" aria-hidden="true" />
            <span>Public domain</span>
          </label>
          <select
            className="select filter-bar__sort"
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            aria-label="Sort"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export function ActiveFilters({ filters, onFilters, onReset }) {
  const chips = []
  if (filters.q) chips.push({ key: 'q', label: `“${filters.q}”`, clear: { q: '' } })
  if (filters.department) {
    chips.push({ key: 'department', label: filters.department, clear: { department: '' } })
  }
  if (filters.type) chips.push({ key: 'type', label: filters.type, clear: { type: '' } })
  if (!isAnyDate(filters.range)) {
    chips.push({ key: 'range', label: formatYearRange(filters.range), clear: { range: DEFAULT_FILTERS.range } })
  }
  if (filters.publicDomain) {
    chips.push({ key: 'pd', label: 'Public domain', clear: { publicDomain: false } })
  }
  if (!chips.length) return null
  return (
    <div className="active-filters">
      {chips.map((c) => (
        <span key={c.key} className="chip">
          {c.label}
          <button type="button" onClick={() => onFilters(c.clear)} aria-label={`Remove ${c.label}`}>
            ×
          </button>
        </span>
      ))}
      <button type="button" className="link-btn" onClick={onReset}>
        Clear all
      </button>
    </div>
  )
}
