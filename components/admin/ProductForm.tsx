"use client"

import { useMemo, useState } from "react"
import { LanguageTabs } from "./LanguageTabs"
import { CategorySelect } from "./CategorySelect"
import { ImageUploader } from "./ImageUploader"
import type { Category, Product } from "@/lib/store-types"

interface ProductFormProps {
  form: Partial<Product>
  formTitle: string
  onSubmit: (e: React.FormEvent) => Promise<void>
  onReset: () => void
  onFormChange: (form: Partial<Product>) => void
  onFileSelect: (file: File | null) => void
  previewUrl: string
  categories: Category[]
  products: Product[]
  error: string
  isSaving: boolean
  editingId: string | null
  onCategoryDeleted?: () => void
}

export function ProductForm({
  form,
  formTitle,
  onSubmit,
  onReset,
  onFormChange,
  onFileSelect,
  previewUrl,
  categories,
  products,
  error,
  isSaving,
  editingId,
  onCategoryDeleted,
}: ProductFormProps) {
  const [languageTab, setLanguageTab] = useState<"fr" | "ar">("fr")

  const categoryId = useMemo(() => form.categoryId || "", [form.categoryId])

  return (
    <form onSubmit={onSubmit} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-cormorant text-white">{formTitle}</h2>
        {editingId && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            + Nouveau produit
          </button>
        )}
      </div>

      {/* Image Upload */}
      <ImageUploader previewUrl={previewUrl} onFileSelect={onFileSelect} isLoading={isSaving} />

      {/* Language Tabs */}
      <LanguageTabs activeTab={languageTab} onTabChange={setLanguageTab} />

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {languageTab === "fr" ? "Nom du produit (FR)" : "اسم المنتج (AR)"}
          </label>
          <input
            type="text"
            value={languageTab === "fr" ? form.nameFr || "" : form.nameAr || ""}
            onChange={(e) =>
              onFormChange({
                ...form,
                [languageTab === "fr" ? "nameFr" : "nameAr"]: e.target.value,
              })
            }
            placeholder={languageTab === "fr" ? "Ex: Bague en or..." : "مثال: خاتم ذهب..."}
            className={`w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50 transition-colors ${languageTab === "ar" ? "text-right" : ""}`}
            disabled={isSaving}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {languageTab === "fr" ? "Description (FR)" : "الوصف (AR)"}
          </label>
          <textarea
            value={languageTab === "fr" ? form.descriptionFr || "" : form.descriptionAr || ""}
            onChange={(e) =>
              onFormChange({
                ...form,
                [languageTab === "fr" ? "descriptionFr" : "descriptionAr"]: e.target.value,
              })
            }
            placeholder={languageTab === "fr" ? "Décrivez le produit..." : "وصف المنتج..."}
            className={`w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50 transition-colors min-h-28 ${languageTab === "ar" ? "text-right" : ""}`}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Category, Price, Tag */}
      <div className="space-y-4">
        <CategorySelect
          categories={categories}
          products={products}
          selectedCategoryId={categoryId}
          onSelectCategory={(catId) => onFormChange({ ...form, categoryId: catId })}
          onCategoryDeleted={onCategoryDeleted}
          language={languageTab}
          isLoading={isSaving}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Prix (MAD)</label>
            <input
              type="number"
              value={form.price || 0}
              onChange={(e) => onFormChange({ ...form, price: Number(e.target.value) })}
              placeholder="0"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50 transition-colors"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Prix initial (opt.)</label>
            <input
              type="number"
              value={form.originalPrice || 0}
              onChange={(e) => onFormChange({ ...form, originalPrice: Number(e.target.value) || undefined })}
              placeholder="0"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50 transition-colors"
              disabled={isSaving}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Badge (opt.)</label>
          <input
            type="text"
            value={form.tag || ""}
            onChange={(e) => onFormChange({ ...form, tag: e.target.value })}
            placeholder="Ex: Nouveau, Promo..."
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50 transition-colors"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-2xl bg-gradient-to-r from-[#c9a84c] to-[#d9b85c] px-4 py-3 font-semibold text-black transition-all hover:shadow-lg hover:shadow-[#c9a84c]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full border-2 border-black/20 border-t-black h-4 w-4" />
            Enregistrement...
          </span>
        ) : (
          "Enregistrer le produit"
        )}
      </button>
    </form>
  )
}
