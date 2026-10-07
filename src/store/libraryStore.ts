import type { IntakeTicket } from '@/types/intake'
import type { LibraryRow } from '@/types/library'
import { nowIso } from '@/lib/ticketDate'
import { DEMO_REPAIR_STEPS } from '@/config/repairSteps'
import { loadBoardImage, saveBoardImage } from '@/lib/boardImageDb'

const STORAGE_KEY = 'diagboard.library.ledger'
const IMAGE_PREFIX = 'diagboard.library.image.'

const listeners = new Set<() => void>()
const imageCache = new Map<string, string>()

function imageKey(id: string): string {
  return `${IMAGE_PREFIX}${id}`
}

function readImage(id: string): string {
  if (imageCache.has(id)) return imageCache.get(id) ?? ''
  try {
    const stored = sessionStorage.getItem(imageKey(id)) || localStorage.getItem(imageKey(id)) || ''
    if (stored) imageCache.set(id, stored)
    return stored
  } catch {
    try {
      const stored = sessionStorage.getItem(imageKey(id)) ?? ''
      if (stored) imageCache.set(id, stored)
      return stored
    } catch {
      return ''
    }
  }
}

function imageKeys(): string[] {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (key?.startsWith(IMAGE_PREFIX)) keys.push(key)
  }
  return keys
}

function writeImage(id: string, image: string) {
  if (!image) return
  imageCache.set(id, image)
  void saveBoardImage(id, image)
  try {
    sessionStorage.setItem(imageKey(id), image)
  } catch {
    // keep the photo in memory if quota is full
  }
  try {
    localStorage.setItem(imageKey(id), image)
  } catch {
    for (const key of imageKeys()) {
      if (key === imageKey(id)) continue
      localStorage.removeItem(key)
      try {
        localStorage.setItem(imageKey(id), image)
        return
      } catch {
        continue
      }
    }
  }
}

function normalizeRow(row: LibraryRow): LibraryRow {
  return {
    ...row,
    boardImage: row.boardImage || readImage(row.id),
    scanReport: (row.scanReport?.length ? row.scanReport : DEMO_REPAIR_STEPS).map((step) => ({
      part: step.part,
      titleAr: step.titleAr,
      titleEn: step.titleEn,
      detailAr: step.detailAr,
      detailEn: step.detailEn,
      x: step.x ?? 50,
      y: step.y ?? 50,
    })),
  }
}

function readRawLedger(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
  } catch {
    try {
      return sessionStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  }
}

function writeRawLedger(payload: string): boolean {
  let saved = false
  try {
    localStorage.setItem(STORAGE_KEY, payload)
    saved = true
  } catch {
    for (const key of imageKeys()) {
      localStorage.removeItem(key)
      try {
        localStorage.setItem(STORAGE_KEY, payload)
        saved = true
        break
      } catch {
        continue
      }
    }
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, payload)
    saved = true
  } catch {
    // session copy is best-effort
  }
  return saved
}

function readStored(): LibraryRow[] {
  try {
    const raw = readRawLedger()
    return raw ? (JSON.parse(raw) as LibraryRow[]).map(normalizeRow) : []
  } catch {
    return []
  }
}

let rows: LibraryRow[] = readStored()

function emit() {
  listeners.forEach((listener) => listener())
}

function persistLedger(): boolean {
  const serializable = rows.map(({ boardImage: _image, ...rest }) => rest)
  return writeRawLedger(JSON.stringify(serializable))
}

function persist() {
  persistLedger()
  emit()
}

export function getLibraryRows(): LibraryRow[] {
  return rows
}

export function subscribeLibrary(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function upsertLibraryFromScan(ticket: IntakeTicket, boardImage = ''): LibraryRow {
  const existing = rows.find((row) => row.id === ticket.ticketNo)
  const image = boardImage || existing?.boardImage || readImage(ticket.ticketNo)
  const next: LibraryRow = {
    id: ticket.ticketNo,
    boardType: ticket.deviceType || '—',
    model: ticket.laptopBrand || ticket.deviceType || '—',
    serialNumber: ticket.serialNumber,
    deviceStatus: ticket.deviceStatus || '—',
    inspectedAt: nowIso(),
    deliveredAt: existing?.deliveredAt ?? null,
    boardImage: image,
    scanReport: DEMO_REPAIR_STEPS.map((step) => ({
      part: step.part,
      titleAr: step.titleAr,
      titleEn: step.titleEn,
      detailAr: step.detailAr,
      detailEn: step.detailEn,
      x: step.x,
      y: step.y,
    })),
  }
  const index = rows.findIndex((row) => row.id === ticket.ticketNo)
  rows = index >= 0 ? rows.map((row, i) => (i === index ? { ...next, deliveredAt: row.deliveredAt } : row)) : [next, ...rows]
  persist()
  writeImage(ticket.ticketNo, image)
  return next
}

export function markLibraryDelivered(ticketNo: string, deliveredAt: string | null): void {
  rows = rows.map((row) => (row.id === ticketNo ? { ...row, deliveredAt } : row))
  persist()
}

async function hydrateImages() {
  let changed = false
  const next = await Promise.all(
    rows.map(async (row) => {
      if (row.boardImage) return row
      const stored = await loadBoardImage(row.id).catch(() => '')
      if (!stored) return row
      imageCache.set(row.id, stored)
      changed = true
      return { ...row, boardImage: stored }
    }),
  )
  if (!changed) return
  rows = next
  emit()
}

void hydrateImages()
