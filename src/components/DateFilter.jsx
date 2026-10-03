import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import RangeSlider from './RangeSlider'
import { YEAR_MAX, YEAR_MIN, YEAR_STEP } from '../lib/constants'
import { formatYear, formatYearRange } from '../lib/format'

export const PRESETS = [
  { label: 'Antiquity', range: [-3000, 500] },
  { label: 'Medieval', range: [500, 1400] },
  { label: 'Renaissance', range: [1400, 1600] },
  { label: '1600–1800', range: [1600, 1800] },
  { label: '19th century', range: [1800, 1900] },
  { label: 'Modern', range: [1900, YEAR_MAX] },
]

export function getPreset(range) {
  if (!range) return null
  return PRESETS.find((p) => p.range[0] === range[0] && p.range[1] === range[1]) ?? null
}

export function isAnyDate([from, to]) {
  return from <= YEAR_MIN && to >= YEAR_MAX
}

export default function DateFilter({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef(null)

  useEffect(() => setDraft(value), [value])

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const apply = (range) => {
    setDraft(range)
    onChange(range)
  }

  const activePreset = getPreset(value)

  return (
    <div className="date-filter" ref={ref}>
      <button
        type="button"
        className={`select date-filter__btn${isAnyDate(value) ? '' : ' is-set'}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {isAnyDate(value) ? 'Any date' : activePreset ? activePreset.label : formatYearRange(value)}
      </button>
      {open ? (
        <div className="date-filter__panel">
          <RangeSlider
            label="Date created"
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={YEAR_STEP}
            value={draft}
            format={formatYear}
            onChange={setDraft}
          />
          <div className="date-filter__presets">
            {PRESETS.map((p) => {
              const isSelected = draft[0] === p.range[0] && draft[1] === p.range[1]
              return (
                <button
                  key={p.label}
                  type="button"
                  className={`chip chip--btn${isSelected ? ' is-active' : ''}`}
                  onClick={() => apply(p.range)}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
          <div className="date-filter__foot">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => apply([YEAR_MIN, YEAR_MAX])}>
              <Icon name="reset" /> Reset
            </button>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => {
                onChange(draft)
                setOpen(false)
              }}
            >
              Apply
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
