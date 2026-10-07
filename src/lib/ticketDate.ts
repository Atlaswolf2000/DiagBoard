export function nowIso(): string {
  return new Date().toISOString()
}

export function formatTicketDate(iso: string): string {
  return new Intl.DateTimeFormat('ar-IQ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso))
}

export function formatTicketTime(iso: string): string {
  return new Intl.DateTimeFormat('ar-IQ', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function createTicketNo(date = new Date()): string {
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('')
  const time = [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    String(date.getSeconds()).padStart(2, '0'),
  ].join('')
  const rand = String(Math.floor(Math.random() * 9000) + 1000)
  return `DB-${stamp}-${time}-${rand}`
}
