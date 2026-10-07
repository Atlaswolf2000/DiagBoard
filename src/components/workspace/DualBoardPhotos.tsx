import { useRef, type ChangeEvent } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { useT } from '@/hooks/usePrefs'
import { useBoardPhotos } from '@/hooks/useBoardPhotos'
import { fileToDataUrl, removeBoardPhoto, setBoardPhotos } from '@/store/boardPhotosStore'
import { compressDataUrl } from '@/lib/image'

const MAX_PHOTOS = 2

export function DualBoardPhotos() {
  const t = useT()
  const urls = useBoardPhotos()
  const inputRef = useRef<HTMLInputElement>(null)

  const pickFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/')).slice(0, MAX_PHOTOS)
    const raw = await Promise.all(files.map((file) => fileToDataUrl(file)))
    const next = await Promise.all(raw.map((url) => compressDataUrl(url)))
    setBoardPhotos(next)
    event.target.value = ''
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-lab-900 p-5 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{t('boardPhotos')}</h3>
          <p className="mt-1 text-xs text-slate-500">{t('boardPhotosHint')}</p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-lab-950 hover:bg-cyan-400"
        >
          <ImagePlus className="h-4 w-4" />
          {t('uploadTwo')}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={pickFiles}
        />
      </div>

      <div className="photo-pair mt-4">
        {[0, 1].map((index) => (
          <div key={index} className="photo-square">
            {urls[index] ? (
              <>
                <img src={urls[index]} alt={`${t('boardPhotos')} ${index + 1}`} />
                <button type="button" className="photo-clear" onClick={() => removeBoardPhoto(index)} aria-label={t('removePhoto')}>
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <span>
                {t('square')} {index + 1}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
