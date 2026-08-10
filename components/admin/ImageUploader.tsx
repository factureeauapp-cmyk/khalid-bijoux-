"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { useAppContext } from "@/app/providers/AppContext"

interface ImageUploaderProps {
  previewUrl: string
  onFileSelect: (file: File | null) => void
  isLoading?: boolean
}

export function ImageUploader({ previewUrl, onFileSelect, isLoading = false }: ImageUploaderProps) {
  const { language, t } = useAppContext() as any
  const adminT = t("admin")

  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && isValidImageFile(file)) {
      onFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isValidImageFile(file)) {
      onFileSelect(file)
    }
  }

  const isValidImageFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    const maxSize = 2 * 1024 * 1024
    return allowedTypes.includes(file.type) && file.size <= maxSize
  }

  const resetFileInput = () => {
    if (!isLoading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-3" dir={language === "ar" ? "rtl" : "ltr"}>
      <label className="block text-sm font-medium text-white">{adminT.imagePreview}</label>

      {/* Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={resetFileInput}
        className={`group relative h-56 cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all ${
          isDragging
            ? "border-[#c9a84c] bg-[#c9a84c]/10"
            : "border-[#c9a84c]/25 bg-black/30 hover:border-[#c9a84c]/50 hover:bg-black/40"
        }`}
      >
        <Image
          src={previewUrl || "/placeholder.svg"}
          alt={adminT.productImageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 500px"
          priority
        />

        {/* Overlay hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="text-center">
            <Upload className="mx-auto mb-2 h-8 w-8 text-[#c9a84c]" />
            <p className="text-sm text-white">{adminT.dragDropImage}</p>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9a84c]/30 border-t-[#c9a84c]" />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInput}
        disabled={isLoading}
      />

      {/* Info text */}
      <p className="text-xs text-white/50">{adminT.maxFileSize}</p>
    </div>
  )
}