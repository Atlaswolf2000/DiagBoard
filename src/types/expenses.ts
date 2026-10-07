export const EXPENSE_TYPES = ['قطعة غيار', 'شحن', 'أجور فني', 'مواد استهلاكية', 'أخرى'] as const

export type ExpenseType = (typeof EXPENSE_TYPES)[number]

export interface TicketExpense {
  id: string
  ticketNo: string
  type: ExpenseType
  amount: number
  note: string
  imageData: string
  createdAt: string
}
