export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function matchesQuery(haystack: Array<string | number | null | undefined>, query: string): boolean {
  const needle = normalizeSearch(query)
  if (!needle) return true
  const tokens = needle.split(' ').filter(Boolean)
  const blob = normalizeSearch(haystack.map((part) => part ?? '').join(' '))
  return tokens.every((token) => blob.includes(token))
}
