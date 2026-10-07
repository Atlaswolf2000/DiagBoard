const LETTERS = 'abcdefghjkmnpqrstuvwxyz'
const DIGITS = '23456789'
const SYMBOLS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'

function pick(source: string, count: number): string {
  let out = ''
  const bytes = new Uint8Array(count)
  crypto.getRandomValues(bytes)
  for (const byte of bytes) out += source[byte % source.length]
  return out
}

export function generateUsername(displayName: string): string {
  const slug = displayName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^\u0600-\u06FFa-z0-9.]/g, '')
  const suffix = pick(DIGITS, 3)
  return slug ? `${slug}.${suffix}` : `user.${suffix}`
}

export function generatePassword(): string {
  return `${pick(LETTERS, 4)}${pick(DIGITS, 3)}${pick(SYMBOLS, 2)}`
}

export function createUserId(): string {
  return `usr-${Date.now().toString(36)}-${pick(DIGITS, 4)}`
}
