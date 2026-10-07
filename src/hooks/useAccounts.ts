import { useSyncExternalStore } from 'react'
import { getAccountRows, subscribeAccounts } from '@/store/accountsStore'

export function useAccounts() {
  return useSyncExternalStore(subscribeAccounts, getAccountRows, getAccountRows)
}
