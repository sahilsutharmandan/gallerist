import { useId } from 'react'

export default function RangeSlider({ min, max, step = 1, value, onChange, format = String, label }) {
  const id = useId()
  const [low, high] = value
  const pct = (v) => ((v - min) / (max - min)) * 100

  const handleLow = (e) => {
    const next = Number(e.target.value)
    onChange([Math.min(next, high - step), high])
  }

  const handleHigh = (e) => {
    const next = Number(e.target.value)
    onChange([low, Math.max(next, low + step)])
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
          onChange={handleLow}
          style={{ zIndex: low > max - (max - min) / 10 ? 3 : undefined }}
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
          onChange={handleHigh}
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
