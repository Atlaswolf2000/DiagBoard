const STORAGE_KEY = 'diagboard.ui.sidebarCollapsed'

const listeners = new Set<() => void>()

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

let collapsed = readStored()

function emit() {
  listeners.forEach((listener) => listener())
}

export function isSidebarCollapsed(): boolean {
  return collapsed
}

export function subscribeSidebar(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function toggleSidebar(): void {
  collapsed = !collapsed
  try {
    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
  } catch {
    /* ignore quota */
  }
  emit()
}

export function setSidebarCollapsed(next: boolean): void {
  collapsed = next
  try {
    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
  } catch {
    /* ignore quota */
  }
  emit()
}
