import { useSyncExternalStore } from 'react'
import { getExpenses, subscribeExpenses } from '@/store/expensesStore'

export function useExpenses() {
  return useSyncExternalStore(subscribeExpenses, getExpenses, getExpenses)
}
