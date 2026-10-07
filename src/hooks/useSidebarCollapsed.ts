import { useSyncExternalStore } from 'react'
import { isSidebarCollapsed, subscribeSidebar } from '@/store/uiStore'

export function useSidebarCollapsed(): boolean {
  return useSyncExternalStore(subscribeSidebar, isSidebarCollapsed, () => false)
}
