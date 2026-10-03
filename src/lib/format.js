export function formatYear(year) {
  if (year === null || year === undefined || Number.isNaN(year)) return ''
  if (year < 0) return `${Math.abs(year)} BCE`
  return `${year}`
}

export function formatYearRange([from, to]) {
  const min = Math.min(from, to)
  const max = Math.max(from, to)
  if (min < 0 && max < 0) {
    return `${Math.abs(min)} – ${Math.abs(max)} BCE`
  }
  if (min < 0 && max >= 0) {
    return `${Math.abs(min)} BCE – ${max} CE`
  }
  return `${min} – ${max}`
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
