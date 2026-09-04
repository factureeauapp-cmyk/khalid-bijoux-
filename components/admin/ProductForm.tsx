"use client"

import { useMemo, useState, type RefObject } from "react"
import { Plus } from "lucide-react"
import { LanguageTabs } from "./LanguageTabs"
import { CategorySelect } from "./CategorySelect"
import { ImageUploader, type ProductImageDraft } from "./ImageUploader"
import { QuickAddAttributes } from "./QuickAddAttributes"
import { AttributeCard } from "./AttributeCard"
import { cn } from "@/lib/utils"
import type { Category, Product } from "@/lib/store-types"

import type { ProductAttribute } from "@/lib/store-types"
import { normalizeAttributeValue } from "@/lib/products/attributes"

import { useAppContext } from "@/app/providers/AppContext"

interface ProductFormProps {
  form: Partial<Product>
  formTitle: string
  onSubmit: (e: React.FormEvent) => Promise<void>
  onReset: () => void
  onFormChange: (form: Partial<Product>) => void
  images: ProductImageDraft[]
  onImagesChange: (images: ProductImageDraft[]) => void
  categories: Category[]
  products: Product[]
  error: string
  isSaving: boolean
  editingId: string | null
  formRef?: RefObject<HTMLFormElement | null>
  firstInputRef?: RefObject<HTMLInputElement | null>
  highlightForm?: boolean
  onCategoryDeleted?: () => void
}

export function ProductForm({
  form,
  formTitle,
  onSubmit,
  onReset,
  onFormChange,
  images,
  onImagesChange,
  categories,
  products,
  error,
  isSaving,
  editingId,
  formRef,
  firstInputRef,
  highlightForm,
  onCategoryDeleted,
}: ProductFormProps) {
  const [languageTab, setLanguageTab] = useState<"fr" | "ar">("fr")
  const { t } = useAppContext()
  const admin = t("admin")

  const categoryId = useMemo(() => form.categoryId || "", [form.categoryId])
  const attributes = form.attributes ?? []
  const labels = {
    title: admin.productAttributes,
    addAttribute: admin.addProductAttribute,
    name: admin.attributeNameFr,
    nameAr: admin.attributeNameAr,
    valueFr: admin.attributeValueFr,
    valueAr: admin.attributeValueAr,
    addValue: admin.addProductAttributeValue,
    remove: admin.removeProductAttribute,
    moveUp: admin.moveProductAttributeUp,
    moveDown: admin.moveProductAttributeDown,
  }

  const updateAttributes = (next: ProductAttribute[]) => onFormChange({ ...form, attributes: next })
  const updateAttribute = (index: number, patch: Partial<ProductAttribute>) =>
    updateAttributes(attributes.map((attribute, currentIndex) => (currentIndex === index ? { ...attribute, ...patch } : attribute)))
  const createId = () => crypto.randomUUID()
  const addAttribute = () =>
    updateAttributes([...attributes, { id: createId(), name: "", nameAr: "", values: [{ id: createId(), value: "", valueAr: "" }] }])
  const removeAttribute = (index: number) => updateAttributes(attributes.filter((_, currentIndex) => currentIndex !== index))
  const moveAttribute = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= attributes.length) return
    const next = [...attributes]
    ;[next[index], next[target]] = [next[target], next[index]]
    updateAttributes(next)
  }

  // Ajoute (ou fusionne dans) un attribut depuis l'ajout rapide. Si un
  // attribut du même nom existe déjà, seules les valeurs manquantes sont
  // ajoutées (jamais de doublon, jamais d'écrasement des valeurs déjà
  // personnalisées).
  const handleQuickAdd = (name: string, nameAr: string, values: { value: string; valueAr: string }[]) => {
    const existingIndex = attributes.findIndex((attribute) => attribute.name.trim().toLowerCase() === name.toLowerCase())

    if (existingIndex === -1) {
      updateAttributes([
        ...attributes,
        {
          id: createId(),
          name,
          nameAr,
          values: values.map((value) => ({ id: createId(), value: value.value, valueAr: value.valueAr })),
        },
      ])
      return
    }

    const existing = attributes[existingIndex]
    const existingValues = new Set(existing.values.map((value) => normalizeAttributeValue(value).value.trim().toLowerCase()))
    const newValues = values
      .filter((value) => !existingValues.has(value.value.trim().toLowerCase()))
      .map((value) => ({ id: createId(), value: value.value, valueAr: value.valueAr }))

    if (newValues.length === 0) return

    updateAttribute(existingIndex, { values: [...existing.values, ...newValues] })
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className={cn(
        "rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur space-y-6 transition-shadow duration-300",
        highlightForm && "ring-2 ring-[#C9A84C]/60 shadow-[0_0_0_18px_rgba(201,168,76,0.12)]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-cormorant text-white">{formTitle}</h2>
        {editingId && (
          <button type="button" onClick={onReset} className="text-sm text-white/60 hover:text-white transition-colors">
            + {admin.newProduct}
          </button>
        )}
      </div>

      {/* Image Upload */}
      <ImageUploader images={images} onChange={onImagesChange} isLoading={isSaving} />

      {/* Language Tabs */}
      <LanguageTabs activeTab={languageTab} onTabChange={setLanguageTab} />

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {languageTab === "fr" ? admin.productNameFr : admin.productNameAr}
          </label>
          <input
            ref={firstInputRef}
            type="text"
            value={languageTab === "fr" ? form.nameFr || "" : form.nameAr || ""}
            onChange={(e) =>
              onFormChange({
                ...form,
                [languageTab === "fr" ? "nameFr" : "nameAr"]: e.target.value,
              })
            }
            placeholder={admin.productNamePlaceholder}
            className={`w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50 transition-colors ${
              languageTab === "ar" ? "text-right" : ""
            }`}
            disabled={isSaving}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {languageTab === "fr" ? admin.descriptionFr : admin.descriptionAr}
          </label>
          <textarea
            value={languageTab === "fr" ? form.descriptionFr || "" : form.descriptionAr || ""}
            onChange={(e) =>
              onFormChange({
                ...form,
                [languageTab === "fr" ? "descriptionFr" : "descriptionAr"]: e.target.value,
              })
            }
            placeholder={admin.descriptionPlaceholder}
            className={`w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50 transition-colors min-h-28 ${
              languageTab === "ar" ? "text-right" : ""
            }`}
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
            <label className="block text-sm font-medium text-white/80 mb-2">{admin.priceMad}</label>
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
            <label className="block text-sm font-medium text-white/80 mb-2">{admin.originalPrice}</label>
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

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">{admin.stockQuantity}</label>
            <input
              type="number"
              min="0"
              value={form.quantity ?? 0}
              onChange={(e) => onFormChange({ ...form, quantity: Number(e.target.value) })}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50 transition-colors"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">{admin.badge}</label>
            <input
              type="text"
              value={form.tag || ""}
              onChange={(e) => onFormChange({ ...form, tag: e.target.value })}
              placeholder={admin.badgePlaceholder}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50 transition-colors"
              disabled={isSaving}
            />
          </div>
        </div>
      </div>

      {/* Product attributes / options */}
      <section className="rounded-2xl border border-[#C9A84C]/20 bg-black/20 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-cormorant text-xl text-[#E8C97E]">{labels.title}</h3>
          <button
            type="button"
            onClick={addAttribute}
            disabled={isSaving}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-[#C9A84C]/50 px-3 py-2 text-xs font-semibold text-[#E8C97E] transition hover:bg-[#C9A84C]/10 disabled:opacity-50"
          >
            <Plus size={15} /> {labels.addAttribute}
          </button>
        </div>

        <QuickAddAttributes attributes={attributes} onAdd={handleQuickAdd} disabled={isSaving} language={languageTab} />

        <div className="space-y-4">
          {attributes.map((attribute, attributeIndex) => (
            <AttributeCard
              key={attribute.id ?? `${attribute.name}-${attributeIndex}`}
              attribute={attribute}
              index={attributeIndex}
              total={attributes.length}
              labels={{ ...labels, placeholder: labels.title }}
              disabled={isSaving}
              onChange={(patch) => updateAttribute(attributeIndex, patch)}
              onRemove={() => removeAttribute(attributeIndex)}
              onMove={(direction) => moveAttribute(attributeIndex, direction)}
            />
          ))}
        </div>
      </section>

      {/* Error Message */}
      {error && <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-2xl bg-linear-to-r from-[#c9a84c] to-[#d9b85c] px-4 py-3 font-semibold text-black transition-all hover:shadow-lg hover:shadow-[#c9a84c]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full border-2 border-black/20 border-t-black h-4 w-4" />
            {admin.saving}
          </span>
        ) : (
          admin.saveProduct
        )}
      </button>
    </form>
  )
}