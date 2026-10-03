import { useId } from 'react'

export default function RangeSlider({ min, max, step = 1, value, onChange, format = String, label }) {
  const id = useId()
  const [low, high] = value
  const pct = (v) => ((v - min) / (max - min)) * 100

  const handleChange = (index) => (e) => {
    const next = [...value]
    const year = Number(e.target.value)
    next[index] = index === 0 ? Math.min(year, high) : Math.max(year, low)
    onChange(next)
  }

  return (
    <div className="range">
      <div className="range__head">
        <span className="field-label" id={`${id}-label`}>
          {label}
        </span>
        <span className="range__value">
          {format(low)} – {format(high)}
        </span>
      </div>
      <div
        className="range__track"
        style={{ '--from': `${pct(low)}%`, '--to': `${pct(high)}%` }}
      >
        <input
          type="range"
          className="range__input range__input--low"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={handleChange(0)}
          style={{ zIndex: low > max - (max - min) / 10 ? 3 : undefined }}
          aria-label={`${label}: start year`}
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
          aria-label={`${label}: end year`}
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
