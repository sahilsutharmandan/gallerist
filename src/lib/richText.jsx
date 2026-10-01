const TAG = /<\/?([a-z0-9]+)[^>]*>/gi

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

export function plainText(html = '') {
  return decode(String(html).replace(TAG, '')).trim()
}

export function RichText({ html, as: Tag = 'p', className }) {
  if (!html) return null
  const parts = []
  let italic = false
  let last = 0
  let key = 0
  const push = (text) => {
    if (!text) return
    const value = decode(text)
    parts.push(italic ? <em key={key++}>{value}</em> : value)
  }
  String(html).replace(TAG, (match, name, offset) => {
    push(html.slice(last, offset))
    last = offset + match.length
    const tag = name.toLowerCase()
    if (tag === 'em' || tag === 'i') italic = !match.startsWith('</')
    return match
  })
  push(html.slice(last))
  return <Tag className={className}>{parts}</Tag>
}
