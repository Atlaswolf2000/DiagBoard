import { useSyncExternalStore } from 'react'
import { getLibraryRows, subscribeLibrary } from '@/store/libraryStore'

export function useLibrary() {
  return useSyncExternalStore(subscribeLibrary, getLibraryRows, getLibraryRows)
}
