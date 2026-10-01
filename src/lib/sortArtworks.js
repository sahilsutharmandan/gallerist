import { artistName } from './format'

const byText = (key) => (a, b) => (a[key] || '￿').localeCompare(b[key] || '￿')

const yearOf = (a) => a.yearStart ?? a.yearEnd

const COMPARATORS = {
  title: byText('title'),
  artist: (a, b) => (artistName(a.artist) || '￿').localeCompare(artistName(b.artist) || '￿'),
  oldest: (a, b) => (yearOf(a) ?? Infinity) - (yearOf(b) ?? Infinity),
  newest: (a, b) => (yearOf(b) ?? -Infinity) - (yearOf(a) ?? -Infinity),
}

export function visibleArtworks(results, { sort, publicDomain }) {
  let list = publicDomain ? results.filter((a) => a.license === 'CC0') : results
  const compare = COMPARATORS[sort]
  if (compare) list = [...list].sort(compare)
  return list
}
