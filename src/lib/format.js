export function formatYear(year) {
  if (year === null || year === undefined || Number.isNaN(year)) return ''
  if (year < 0) return `${Math.abs(year)} BCE`
  return String(year)
}

export function formatYearRange([from, to]) {
  return `${formatYear(from)} – ${formatYear(to)}`
}

export function artistName(artist) {
  if (!artist) return ''
  return artist.replace(/\s*\(.*\)\s*$/, '').trim()
}

export function artistLine(art) {
  return art.artist || art.culture || 'Unknown maker'
}

export function compactNumber(n) {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(n)
}

export function pluralize(count, word, plural = `${word}s`) {
  return `${count.toLocaleString()} ${count === 1 ? word : plural}`
}

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const TIME_UNITS = [
  ['year', 365 * 86400000],
  ['month', 30 * 86400000],
  ['week', 7 * 86400000],
  ['day', 86400000],
  ['hour', 3600000],
  ['minute', 60000],
]

export function timeAgo(ts, now = Date.now()) {
  const elapsed = now - ts
  for (const [unit, ms] of TIME_UNITS) {
    if (elapsed >= ms) return relative.format(Math.floor(elapsed / ms), unit)
  }
  return 'just now'
}

export function uid() {
  return Math.random().toString(36).slice(2, 9)
}
