import { useSyncExternalStore } from 'react'
import { getAccessUsers, subscribeAccess } from '@/store/accessStore'

export function useAccessUsers() {
  return useSyncExternalStore(subscribeAccess, getAccessUsers, getAccessUsers)
}
