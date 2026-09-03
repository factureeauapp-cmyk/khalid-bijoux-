"use client"

import { useMemo, useState, type RefObject } from "react"
import { ChevronDown, Plus } from "lucide-react"
import { LanguageTabs } from "./LanguageTabs"
import { CategorySelect } from "./CategorySelect"
import { ImageUploader, type ProductImageDraft } from "./ImageUploader"
import { cn } from "@/lib/utils"
import type { Category, Product } from "@/lib/store-types"
import { normalizeAttributeValue, type ProductAttribute, type ProductAttributeValue } from "@/lib/products/attributes"

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

// ============================================================================
// ATTRIBUTE PRESETS — pure admin UX helper (never referenced by storefront
// logic). Editing/removing entries here only changes what's offered in the
// "quick add" picker; it does not hardcode anything into cart/checkout/etc.
// ============================================================================

interface AttributePreset {
  id: string
  name: string
  nameAr: string
  values: { value: string; valueAr: string }[]
}

const ATTRIBUTE_PRESETS: AttributePreset[] = [
  {
    id: "size",
    name: "Taille",
    nameAr: "المقاس",
    values: [
      { value: "6", valueAr: "6" },
      { value: "7", valueAr: "7" },
      { value: "8", valueAr: "8" },
      { value: "9", valueAr: "9" },
      { value: "10", valueAr: "10" },
    ],
  },
  {
    id: "color",
    name: "Couleur",
    nameAr: "اللون",
    values: [
      { value: "Argent", valueAr: "فضي" },
      { value: "Doré", valueAr: "ذهبي" },
      { value: "Rose", valueAr: "وردي" },
      { value: "Noir", valueAr: "أسود" },
      { value: "Blanc", valueAr: "أبيض" },
    ],
  },
  {
    id: "material",
    name: "Matière",
    nameAr: "المادة",
    values: [
      { value: "Argent 925", valueAr: "فضة 925" },
      { value: "Acier inoxydable", valueAr: "ستانلس ستيل" },
      { value: "Plaqué or", valueAr: "مطلي بالذهب" },
    ],
  },
  {
    id: "stone",
    name: "Pierre",
    nameAr: "الحجر",
    values: [
      { value: "Zircon", valueAr: "زركون" },
      { value: "Cristal", valueAr: "كريستال" },
      { value: "Sans pierre", valueAr: "بدون حجر" },
    ],
  },
  {
    id: "length",
    name: "Longueur",
    nameAr: "الطول",
    values: [
      { value: "40 cm", valueAr: "40 سم" },
      { value: "45 cm", valueAr: "45 سم" },
      { value: "50 cm", valueAr: "50 سم" },
    ],
  },
]

function QuickAddAttributes({
  attributes,
  onAdd,
  disabled,
  labels,
}: {
  attributes: ProductAttribute[]
  onAdd: (name: string, nameAr: string, values: { value: string; valueAr: string }[]) => void
  disabled?: boolean
  labels: { quickAdd: string; addSelection: string }
}) {
  const [openPresetId, setOpenPresetId] = useState<string | null>(null)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const togglePreset = (presetId: string) => {
    setOpenPresetId((current) => (current === presetId ? null : presetId))
    setChecked({})
  }

  const toggleValue = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const confirmAdd = (preset: AttributePreset) => {
    const selected = preset.values.filter((_, index) => checked[`${preset.id}-${index}`])
    if (selected.length === 0) return
    onAdd(preset.name, preset.nameAr, selected)
    setOpenPresetId(null)
    setChecked({})
  }

  return (
    <div className="mb-4 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-white/50">{labels.quickAdd}</p>
      <div className="flex flex-wrap gap-2">
        {ATTRIBUTE_PRESETS.map((preset) => {
          const alreadyUsed = attributes.some(
            (attribute) => attribute.name.trim().toLowerCase() === preset.name.toLowerCase()
          )
          return (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => togglePreset(preset.id)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-40",
                openPresetId === preset.id
                  ? "border-[#C9A84C] bg-[#C9A84C]/15 text-[#E8C97E]"
                  : "border-white/15 text-white/70 hover:border-[#C9A84C]/50 hover:text-[#E8C97E]"
              )}
            >
              {preset.name}
              {alreadyUsed && <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />}
              <ChevronDown size={12} className={cn("transition-transform", openPresetId === preset.id && "rotate-180")} />
            </button>
          )
        })}
      </div>

      {openPresetId && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
          {(() => {
            const preset = ATTRIBUTE_PRESETS.find((entry) => entry.id === openPresetId)
            if (!preset) return null
            return (
              <>
                <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2">
                  {preset.values.map((value, index) => {
                    const key = `${preset.id}-${index}`
                    return (
                      <label key={key} className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
                        <input
                          type="checkbox"
                          checked={Boolean(checked[key])}
                          onChange={() => toggleValue(key)}
                          className="h-4 w-4 rounded border-white/20 bg-black/30 accent-[#C9A84C]"
                        />
                        {value.value}
                      </label>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => confirmAdd(preset)}
                  disabled={disabled}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#C9A84C]/50 px-3 py-1.5 text-xs font-semibold text-[#E8C97E] transition hover:bg-[#C9A84C]/10 disabled:opacity-50"
                >
                  <Plus size={13} /> {labels.addSelection}
                </button>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
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
    // Fallback strings used if these keys aren't in the translations file yet.
    quickAdd: admin.quickAddAttributes ?? (languageTab === "ar" ? "إضافة سريعة" : "Ajout rapide"),
    addSelection: admin.addSelectedValues ?? (languageTab === "ar" ? "إضافة التحديد" : "Ajouter la sélection"),
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

  // Adds (or merges into) an attribute from the quick-add picker. If an
  // attribute with the same name already exists, only missing values are
  // appended (no duplicates, no overwrite of values already customized).
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#C9A84C]/50 px-3 py-2 text-xs font-semibold text-[#E8C97E] transition hover:bg-[#C9A84C]/10 disabled:opacity-50"
          >
            <Plus size={15} /> {labels.addAttribute}
          </button>
        </div>

        <QuickAddAttributes
          attributes={attributes}
          onAdd={handleQuickAdd}
          disabled={isSaving}
          labels={{ quickAdd: labels.quickAdd, addSelection: labels.addSelection }}
        />

        <div className="space-y-4">
          {attributes.map((attribute, attributeIndex) => (
            <div
              key={attribute.id ?? `${attribute.name}-${attributeIndex}`}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="min-w-0 truncate text-sm font-medium text-white/80">{attribute.name || labels.title}</p>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => moveAttribute(attributeIndex, -1)}
                    disabled={isSaving || attributeIndex === 0}
                    className="rounded-lg px-2 py-1 text-white/60 hover:bg-white/10 disabled:opacity-30"
                    title={labels.moveUp}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveAttribute(attributeIndex, 1)}
                    disabled={isSaving || attributeIndex === attributes.length - 1}
                    className="rounded-lg px-2 py-1 text-white/60 hover:bg-white/10 disabled:opacity-30"
                    title={labels.moveDown}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAttribute(attributeIndex)}
                    disabled={isSaving}
                    className="rounded-lg px-2 py-1 text-rose-300 hover:bg-rose-500/10 disabled:opacity-30"
                    title={labels.remove}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={attribute.name}
                  onChange={(event) => updateAttribute(attributeIndex, { name: event.target.value })}
                  placeholder={labels.name}
                  disabled={isSaving}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50"
                />
                <input
                  value={attribute.nameAr ?? ""}
                  onChange={(event) => updateAttribute(attributeIndex, { nameAr: event.target.value })}
                  placeholder={labels.nameAr}
                  dir="rtl"
                  disabled={isSaving}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50"
                />
              </div>

              <div className="mt-3 space-y-2">
                {attribute.values.map((rawValue, valueIndex) => {
                  const value = normalizeAttributeValue(rawValue)
                  const updateValue = (patch: Partial<ProductAttributeValue>) =>
                    updateAttribute(attributeIndex, {
                      values: attribute.values.map((entry, currentIndex) =>
                        currentIndex === valueIndex ? { ...normalizeAttributeValue(entry), ...patch } : normalizeAttributeValue(entry)
                      ),
                    })

                  return (
                    <div
                      key={`${attribute.id ?? attributeIndex}-${valueIndex}`}
                      className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                    >
                      <input
                        value={value.value}
                        onChange={(event) => updateValue({ value: event.target.value })}
                        placeholder={labels.valueFr}
                        disabled={isSaving}
                        className="min-w-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50"
                      />
                      <input
                        value={value.valueAr ?? ""}
                        onChange={(event) => updateValue({ valueAr: event.target.value })}
                        placeholder={labels.valueAr}
                        dir="rtl"
                        disabled={isSaving}
                        className="min-w-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateAttribute(attributeIndex, {
                            values: attribute.values.filter((_, currentIndex) => currentIndex !== valueIndex),
                          })
                        }
                        disabled={isSaving}
                        className="rounded-2xl border border-rose-400/20 px-4 py-3 text-rose-300 hover:bg-rose-500/10 disabled:opacity-30"
                        aria-label={labels.remove}
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
                <button
                  type="button"
                  onClick={() =>
                    updateAttribute(attributeIndex, {
                      values: [...attribute.values, { id: createId(), value: "", valueAr: "" }],
                    })
                  }
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E8C97E] hover:text-white disabled:opacity-50"
                >
                  <Plus size={14} /> {labels.addValue}
                </button>
              </div>
            </div>
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