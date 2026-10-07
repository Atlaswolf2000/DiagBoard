import type { PartnerId, PartnerPayout } from '@/types/payouts'
import { nowIso } from '@/lib/ticketDate'

const STORAGE_KEY = 'diagboard.payouts.ledger'

const listeners = new Set<() => void>()

function readStored(): PartnerPayout[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PartnerPayout[]) : []
  } catch {
    return []
  }
}

let rows: PartnerPayout[] = readStored()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  listeners.forEach((listener) => listener())
}

export function getPartnerPayouts(): PartnerPayout[] {
  return rows
}

export function subscribePayouts(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function withdrawnFor(partnerId: PartnerId): number {
  return rows.filter((row) => row.partnerId === partnerId).reduce((sum, row) => sum + row.amount, 0)
}

export function addPartnerPayout(partnerId: PartnerId, amount: number): PartnerPayout {
  const next: PartnerPayout = {
    id: `PO-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`,
    partnerId,
    amount,
    createdAt: nowIso(),
  }
  rows = [next, ...rows]
  persist()
  return next
}
