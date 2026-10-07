import { expenseTotalFor } from '@/store/expensesStore'
import type { AccountRow } from '@/types/accounts'

export function isCompletedWork(row: AccountRow): boolean {
  return row.status === 'أنجزت' || row.status === 'تم التسليم'
}

export function netProfit(totalAmount: number, expenses: number): number {
  return totalAmount - expenses
}

export function profitForRow(row: AccountRow): { expenses: number; profit: number; counted: boolean } {
  const expenses = expenseTotalFor(row.ticketNo)
  const counted = isCompletedWork(row)
  return { expenses, profit: counted ? netProfit(row.totalAmount, expenses) : 0, counted }
}

export function totalNetProfit(rows: AccountRow[]): number {
  return rows.reduce((sum, row) => sum + profitForRow(row).profit, 0)
}
