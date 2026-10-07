import { useSyncExternalStore } from 'react'
import { getBoardPhotos, subscribeBoardPhotos } from '@/store/boardPhotosStore'

export function useBoardPhotos(): string[] {
  return useSyncExternalStore(subscribeBoardPhotos, getBoardPhotos, getBoardPhotos)
}
