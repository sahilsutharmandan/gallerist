const yearFormat = new Intl.NumberFormat('en-US', { useGrouping: false })

export function formatYear(year) {
  if (year === null || year === undefined || Number.isNaN(year)) return ''
  return yearFormat.format(year)
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

export function uid() {
  return Math.random().toString(36).slice(2, 9)
}
