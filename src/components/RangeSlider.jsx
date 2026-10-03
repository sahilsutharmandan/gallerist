import { useId } from 'react'
import { formatYearRange } from '../lib/format'

export default function RangeSlider({ min, max, step = 1, value, onChange, format = String, label }) {
  const id = useId()
  const low = Math.min(value[0], value[1])
  const high = Math.max(value[0], value[1])
  const pct = (v) => ((v - min) / (max - min)) * 100

  const handleChange = (index) => (e) => {
    const val = Number(e.target.value)
    if (index === 0) {
      onChange([Math.min(val, high), high])
    } else {
      onChange([low, Math.max(val, low)])
    }
  }

  const lowPct = Math.min(pct(low), pct(high))
  const highPct = Math.max(pct(low), pct(high))

  return (
    <div className="range">
      <div className="range__head">
        <span className="field-label" id={`${id}-label`}>
          {label}
        </span>
        <span className="range__value">
          {formatYearRange([low, high])}
        </span>
      </div>
      <div
        className="range__track"
        style={{ '--from': `${lowPct}%`, '--to': `${highPct}%` }}
      >
        <input
          type="range"
          className="range__input range__input--low"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={handleChange(0)}
          style={{ zIndex: low >= high - step ? (low > (min + max) / 2 ? 3 : 1) : (low > max - (max - min) / 10 ? 3 : undefined) }}
          aria-labelledby={`${id}-label`}
          aria-valuetext={format(low)}
        />
        <input
          type="range"
          className="range__input range__input--high"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={handleChange(1)}
          aria-labelledby={`${id}-label`}
          aria-valuetext={format(high)}
        />
      </div>
      <div className="range__scale" aria-hidden="true">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}
