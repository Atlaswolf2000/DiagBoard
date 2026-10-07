import { ACCOUNT_STATUSES, type AccountRow, type AccountStatus } from '@/types/accounts'
import type { IntakeTicket } from '@/types/intake'
import { parseAmount } from '@/lib/money'
import { nowIso } from '@/lib/ticketDate'
import { markLibraryDelivered } from '@/store/libraryStore'

function isAccountStatus(value: string): value is AccountStatus {
  return (ACCOUNT_STATUSES as readonly string[]).includes(value)
}

function migrateStatus(status: string): AccountStatus {
  if (isAccountStatus(status)) return status
  if (status === 'سلمت') return 'تم التسليم'
  return 'قيد الفحص'
}

const STORAGE_KEY = 'diagboard.accounts.ledger'

const listeners = new Set<() => void>()

function normalizeRow(row: AccountRow): AccountRow {
  return {
    ...row,
    newPrice: row.newPrice ?? 0,
    status: migrateStatus(row.status),
  }
}

function readStored(): AccountRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AccountRow[]).map(normalizeRow) : []
  } catch {
    return []
  }
}

let rows: AccountRow[] = readStored()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  listeners.forEach((listener) => listener())
}

export function getAccountRows(): AccountRow[] {
  return rows
}

export function subscribeAccounts(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function hasAccountTicket(ticketNo: string): boolean {
  return rows.some((row) => row.ticketNo === ticketNo)
}

export function postIntakeInvoice(ticket: IntakeTicket): boolean {
  const next: AccountRow = {
    id: ticket.ticketNo,
    ticketNo: ticket.ticketNo,
    customerName: ticket.customerName,
    totalAmount: parseAmount(ticket.repairFee),
    newPrice: 0,
    collectedAmount: parseAmount(ticket.depositPaid),
    entryDate: ticket.createdAt,
    exitDate: null,
    status: 'قيد الفحص',
    notes: ticket.notes,
  }

  const index = rows.findIndex((row) => row.ticketNo === ticket.ticketNo)
  if (index >= 0) {
    const existing = rows[index]
    rows = rows.map((row, i) =>
      i === index
        ? {
            ...next,
            newPrice: existing.newPrice ?? 0,
            collectedAmount: Math.max(existing.collectedAmount, next.collectedAmount),
            exitDate: existing.exitDate,
            status: migrateStatus(existing.status),
          }
        : row,
    )
    persist()
    return false
  }

  rows = [next, ...rows]
  persist()
  return true
}

export function updateAccountPrice(ticketNo: string, newPrice: number): void {
  rows = rows.map((row) => (row.ticketNo === ticketNo ? { ...row, newPrice } : row))
  persist()
}

export function updateAccountStatus(ticketNo: string, status: AccountStatus): void {
  const closed = status === 'تم التسليم' || status === 'تم الإرجاع'
  rows = rows.map((row) =>
    row.ticketNo === ticketNo
      ? {
          ...row,
          status,
          exitDate: closed ? row.exitDate ?? nowIso() : null,
        }
      : row,
  )
  persist()
  const current = rows.find((row) => row.ticketNo === ticketNo)
  markLibraryDelivered(ticketNo, status === 'تم التسليم' ? current?.exitDate ?? nowIso() : null)
}

function billedAmount(row: AccountRow): number {
  return row.newPrice > 0 ? row.newPrice : row.totalAmount
}

export function getAccountByTicket(ticketNo: string): AccountRow | undefined {
  return rows.find((row) => row.ticketNo === ticketNo)
}

export function collectRemaining(ticketNo: string): AccountRow | null {
  const row = rows.find((item) => item.ticketNo === ticketNo)
  if (!row) return null
  const billed = billedAmount(row)
  if (row.collectedAmount >= billed) return row
  const next = { ...row, collectedAmount: billed }
  rows = rows.map((item) => (item.ticketNo === ticketNo ? next : item))
  persist()
  return next
}
