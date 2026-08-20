"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, ImagePlus, Star, Trash2 } from "lucide-react"

export interface ProductImageDraft {
  key: string
  imageUrl: string
  file?: File
}

interface ImageUploaderProps {
  images: ProductImageDraft[]
  onChange: (images: ProductImageDraft[]) => void
  isLoading?: boolean
}

const MAX_IMAGES = 10
const MAX_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function ImageUploader({ images, onChange, isLoading = false }: ImageUploaderProps) {
  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const validFiles = Array.from(fileList).filter((file) => ACCEPTED_TYPES.includes(file.type) && file.size <= MAX_BYTES)
    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) return
    onChange([...images, ...validFiles.slice(0, remaining).map((file) => ({
      key: crypto.randomUUID(),
      imageUrl: URL.createObjectURL(file),
      file,
    }))])
  }

  const remove = (key: string) => {
    const item = images.find((image) => image.key === key)
    if (item?.file) URL.revokeObjectURL(item.imageUrl)
    onChange(images.filter((image) => image.key !== key))
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <label className="block text-sm font-medium text-white">Images du produit</label>
        <span className="text-xs text-white/50">{images.length}/{MAX_IMAGES} · JPG, PNG, WEBP · 5 Mo max/image</span>
      </div>
      <label className={`flex min-h-30 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#c9a84c]/30 bg-black/25 p-5 text-center transition hover:border-[#c9a84c] ${isLoading || images.length >= MAX_IMAGES ? "pointer-events-none opacity-50" : ""}`}>
        <ImagePlus className="mb-2 h-6 w-6 text-[#c9a84c]" />
        <span className="text-sm text-white">Ajouter jusqu’à 10 images</span>
        <span className="mt-1 text-xs text-white/50">La première image est l’image principale.</span>
        <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={isLoading || images.length >= MAX_IMAGES} onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = "" }} />
      </label>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <div key={image.key} className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <Image src={image.imageUrl} alt={`Image produit ${index + 1}`} fill sizes="160px" className="object-cover" />
              {index === 0 && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#c9a84c] px-2 py-1 text-[10px] font-semibold text-black"><Star className="h-3 w-3 fill-current" />Principale</span>}
              <div className="absolute inset-x-2 bottom-2 flex justify-between opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0 || isLoading} aria-label="Déplacer à gauche" className="rounded-lg bg-black/75 p-1.5 text-white disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1 || isLoading} aria-label="Déplacer à droite" className="rounded-lg bg-black/75 p-1.5 text-white disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
                </div>
                <button type="button" onClick={() => remove(image.key)} disabled={isLoading} aria-label="Supprimer l’image" className="rounded-lg bg-rose-600/90 p-1.5 text-white"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
