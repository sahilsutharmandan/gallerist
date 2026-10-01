const API_ROOT = import.meta.env.DEV
  ? '/cma'
  : 'https://openaccess-api.clevelandart.org/api'

const LIST_FIELDS = [
  'id',
  'accession_number',
  'title',
  'creation_date',
  'creation_date_earliest',
  'creation_date_latest',
  'creators',
  'culture',
  'department',
  'type',
  'technique',
  'images',
  'share_license_status',
].join(',')

function buildQuery(params) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    search.set(key, String(value))
  })
  return search.toString()
}

async function request(path, params = {}, signal) {
  const qs = buildQuery(params)
  const res = await fetch(`${API_ROOT}${path}${qs ? `?${qs}` : ''}`, { signal })
  if (!res.ok) {
    throw new Error(`The collection API responded with ${res.status}`)
  }
  return res.json()
}

export async function searchArtworks(
  { q, department, type, from, to, highlight, skip = 0, limit = 24 } = {},
  signal,
) {
  const json = await request(
    '/artworks/',
    {
      q: q?.trim(),
      department,
      type,
      created_after: from,
      created_before: to,
      highlight: highlight ? 1 : undefined,
      has_image: 1,
      skip,
      limit,
      fields: LIST_FIELDS,
    },
    signal,
  )
  return {
    total: json.info?.total ?? 0,
    items: (json.data ?? []).filter((a) => a.images?.web?.url).map(toSummary),
  }
}

export async function getArtwork(id, signal) {
  const json = await request(`/artworks/${id}`, {}, signal)
  if (!json.data) throw new Error('Artwork not found')
  return json.data
}

export function toSummary(a) {
  const web = a.images?.web ?? {}
  const creator = a.creators?.[0]
  return {
    id: a.id,
    accession: a.accession_number,
    title: a.title || 'Untitled',
    date: a.creation_date || '',
    yearStart: a.creation_date_earliest ?? null,
    yearEnd: a.creation_date_latest ?? null,
    artist: creator?.description || '',
    culture: Array.isArray(a.culture) ? a.culture.filter(Boolean).join('; ') : a.culture || '',
    department: a.department || '',
    type: a.type || '',
    technique: a.technique || '',
    license: a.share_license_status || '',
    image: web.url,
    imageLarge: a.images?.print?.url || web.url,
    width: Number(web.width) || 4,
    height: Number(web.height) || 5,
  }
}
