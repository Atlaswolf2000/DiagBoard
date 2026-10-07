import { EXPENSE_TYPES, type ExpenseType, type TicketExpense } from '@/types/expenses'
import { nowIso } from '@/lib/ticketDate'

const STORAGE_KEY = 'diagboard.expenses.ledger'

const listeners = new Set<() => void>()

function isExpenseType(value: string): value is ExpenseType {
  return (EXPENSE_TYPES as readonly string[]).includes(value)
}

function readStored(): TicketExpense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return (JSON.parse(raw) as TicketExpense[]).filter((row) => isExpenseType(row.type))
  } catch {
    return []
  }
}

let rows: TicketExpense[] = readStored()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  listeners.forEach((listener) => listener())
}

export function getExpenses(): TicketExpense[] {
  return rows
}

export function subscribeExpenses(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function expensesFor(ticketNo: string): TicketExpense[] {
  return rows.filter((row) => row.ticketNo === ticketNo)
}

export function expenseTotalFor(ticketNo: string): number {
  return expensesFor(ticketNo).reduce((sum, row) => sum + row.amount, 0)
}

export function addTicketExpense(
  ticketNo: string,
  type: ExpenseType,
  amount: number,
  note: string,
  imageData: string,
): TicketExpense {
  const next: TicketExpense = {
    id: `EX-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`,
    ticketNo,
    type,
    amount,
    note,
    imageData,
    createdAt: nowIso(),
  }
  rows = [next, ...rows]
  persist()
  return next
}
