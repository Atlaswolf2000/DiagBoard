const MS_PER_DAY = 86_400_000

export function workshopDays(entryDate: string, exitDate: string | null, now = Date.now()): number {
  const start = new Date(entryDate).getTime()
  if (Number.isNaN(start)) return 0
  const end = exitDate ? new Date(exitDate).getTime() : now
  if (Number.isNaN(end) || end < start) return 0
  return Math.floor((end - start) / MS_PER_DAY)
}

export function remainingAmount(total: number, collected: number, newPrice = 0): number {
  const bill = newPrice > 0 ? newPrice : total
  return Math.max(0, bill - collected)
}

export function formatMoney(value: number): string {
  return `${new Intl.NumberFormat('ar-IQ').format(value)} د.ع`
}

export function formatShortDate(iso: string | null): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('ar-IQ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso))
}
