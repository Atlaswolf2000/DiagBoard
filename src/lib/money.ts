export function parseAmount(value: string): number {
  const normalized = String(value).replace(/[^\d.]/g, '')
  const amount = Number(normalized)
  return Number.isFinite(amount) ? amount : 0
}
