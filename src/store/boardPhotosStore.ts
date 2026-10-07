const listeners = new Set<() => void>()

let urls: string[] = []

function emit() {
  listeners.forEach((listener) => listener())
}

export function getBoardPhotos(): string[] {
  return urls
}

export function subscribeBoardPhotos(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setBoardPhotos(next: string[]): void {
  urls = next
  emit()
}

export function removeBoardPhoto(index: number): void {
  urls = urls.filter((_, i) => i !== index)
  emit()
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
