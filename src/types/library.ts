export interface LibraryScanStep {
  part: string
  titleAr: string
  titleEn: string
  detailAr: string
  detailEn: string
  x: number
  y: number
}

export interface LibraryRow {
  id: string
  boardType: string
  model: string
  serialNumber: string
  deviceStatus: string
  inspectedAt: string
  deliveredAt: string | null
  boardImage: string
  scanReport: LibraryScanStep[]
}
