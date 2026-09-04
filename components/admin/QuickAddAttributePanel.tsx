"use client"

import { useMemo, useState } from "react"
import { Plus, Search, X } from "lucide-react"
import { ColorPreview } from "./ColorPreview"
import { isColorAttribute, normalizeAttributeValue } from "@/lib/products/attributes"
import type { ProductAttribute } from "@/lib/store-types"
import { cn } from "@/lib/utils"

export interface AttributePresetValue {
  value: string
  valueAr: string
}

export interface AttributePreset {
  id: string
  name: string
  nameAr: string
  unitLabel: {
    fr: { singular: string; plural: string }
    ar: { singular: string; plural: string }
  }
  values: AttributePresetValue[]
}

interface QuickAddAttributePanelProps {
  preset: AttributePreset
  /** Attribut déjà présent dans le produit portant le même nom, s'il existe. */
  existingAttribute?: ProductAttribute
  language: "fr" | "ar"
  disabled?: boolean
  onConfirm: (values: AttributePresetValue[]) => void
  onClose: () => void
}

const normalize = (input: string) => input.trim().toLowerCase()

function formatCount(n: number, unit: { singular: string; plural: string }, language: "fr" | "ar") {
  const label = n === 1 ? unit.singular : unit.plural
  return language === "ar" ? `${label} ${n}` : `${n} ${label}`
}

/**
 * Panneau de sélection multiple pour un preset donné.
 * - sélection multiple + "tout sélectionner"
 * - recherche si beaucoup de valeurs
 * - aperçu couleur (isColorAttribute décide, jamais preset.id === "color" en dur)
 * - détection des valeurs déjà présentes sur le produit (jamais de doublon)
 * - ajout d'une valeur personnalisée hors preset
 */
export function QuickAddAttributePanel({
  preset,
  existingAttribute,
  language,
  disabled,
  onConfirm,
  onClose,
}: QuickAddAttributePanelProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const [customValues, setCustomValues] = useState<AttributePresetValue[]>([])
  const [search, setSearch] = useState("")
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customDraft, setCustomDraft] = useState<AttributePresetValue>({ value: "", valueAr: "" })

  const syntheticAttribute = useMemo(
    () => ({ name: preset.name, nameAr: preset.nameAr, values: preset.values.map((v) => ({ value: v.value, valueAr: v.valueAr })) }),
    [preset]
  )
  const isColor = isColorAttribute(syntheticAttribute)
  const showSearch = preset.values.length > 6

  const existingNormalized = useMemo(() => {
    if (!existingAttribute) return new Set<string>()
    return new Set(existingAttribute.values.map((value) => normalize(normalizeAttributeValue(value).value)))
  }, [existingAttribute])

  const filteredIndices = useMemo(() => {
    if (!showSearch || !search.trim()) return preset.values.map((_, index) => index)
    const query = normalize(search)
    return preset.values
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => normalize(value.value).includes(query) || normalize(value.valueAr).includes(query))
      .map(({ index }) => index)
  }, [preset.values, search, showSearch])

  const allFilteredChecked = filteredIndices.length > 0 && filteredIndices.every((index) => checked[index])

  const toggleValue = (index: number) => setChecked((prev) => ({ ...prev, [index]: !prev[index] }))

  const toggleAllFiltered = () => {
    setChecked((prev) => {
      const next = { ...prev }
      filteredIndices.forEach((index) => {
        next[index] = !allFilteredChecked
      })
      return next
    })
  }

  const selectedPresetValues = preset.values.filter((_, index) => checked[index])
  const allSelected = [...selectedPresetValues, ...customValues]
  const existingSelectedCount = allSelected.filter((value) => existingNormalized.has(normalize(value.value))).length
  const newCount = allSelected.length - existingSelectedCount
  const totalSelected = allSelected.length

  const unit = language === "ar" ? preset.unitLabel.ar : preset.unitLabel.fr

  const confirmLabel =
    totalSelected === 0
      ? language === "ar"
        ? "إضافة القيم المحددة"
        : "Ajouter les valeurs"
      : existingSelectedCount === 0
        ? language === "ar"
          ? `إضافة ${formatCount(totalSelected, unit, "ar")}`
          : `Ajouter ${formatCount(totalSelected, unit, "fr")}`
        : language === "ar"
          ? `إضافة ${newCount} جديدة`
          : `Ajouter ${newCount} nouvelle${newCount > 1 ? "s" : ""}`

  const helperText =
    existingSelectedCount > 0
      ? language === "ar"
        ? `${existingSelectedCount} موجودة مسبقًا · ${newCount} جديدة`
        : `${existingSelectedCount} déjà présente${existingSelectedCount > 1 ? "s" : ""} · ${newCount} nouvelle${newCount > 1 ? "s" : ""}`
      : null

  const selectionCounterText =
    totalSelected === 0
      ? language === "ar"
        ? "لا يوجد تحديد"
        : "Aucune sélection"
      : language === "ar"
        ? `${totalSelected} قيمة محددة`
        : `${totalSelected} valeur${totalSelected > 1 ? "s" : ""} sélectionnée${totalSelected > 1 ? "s" : ""}`

  const addCustomValue = () => {
    const value = customDraft.value.trim()
    if (!value) return
    const alreadySelected = allSelected.some((entry) => normalize(entry.value) === normalize(value))
    if (alreadySelected) {
      setCustomDraft({ value: "", valueAr: "" })
      return
    }
    setCustomValues((prev) => [...prev, { value, valueAr: customDraft.valueAr.trim() }])
    setCustomDraft({ value: "", valueAr: "" })
  }

  const removeCustomValue = (index: number) => setCustomValues((prev) => prev.filter((_, i) => i !== index))

  const handleConfirm = () => {
    if (newCount === 0) return
    onConfirm(allSelected)
  }

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-white">{language === "ar" ? preset.nameAr : preset.name}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label={language === "ar" ? "إغلاق" : "Fermer"}
          className="min-h-9 min-w-9 rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C]/60"
        >
          <X size={16} />
        </button>
      </div>

      {showSearch && (
        <div className="relative mb-3">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={language === "ar" ? "بحث عن قيمة..." : "Rechercher une valeur..."}
            className="w-full rounded-xl border border-white/10 bg-black/30 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-[#c9a84c]/50"
          />
        </div>
      )}

      {preset.values.length > 1 && (
        <button
          type="button"
          onClick={toggleAllFiltered}
          disabled={disabled || filteredIndices.length === 0}
          className="mb-3 text-xs font-medium text-[#E8C97E] transition hover:text-white disabled:opacity-40"
        >
          {allFilteredChecked
            ? language === "ar"
              ? "إلغاء تحديد الكل"
              : "Tout désélectionner"
            : language === "ar"
              ? "تحديد الكل"
              : "Tout sélectionner"}
        </button>
      )}

      <div className={cn("mb-3 flex flex-wrap gap-x-4 gap-y-2.5", isColor && "gap-x-5 gap-y-3")}>
        {filteredIndices.map((index) => {
          const presetValue = preset.values[index]
          const label = language === "ar" ? presetValue.valueAr || presetValue.value : presetValue.value
          const isChecked = Boolean(checked[index])
          const alreadyExists = existingNormalized.has(normalize(presetValue.value))

          return (
            <label
              key={`${preset.id}-${index}`}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-1.5 text-sm transition",
                alreadyExists ? "text-white/35" : "text-white/80 hover:text-white"
              )}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleValue(index)}
                disabled={disabled}
                className="h-4 w-4 rounded border-white/20 bg-black/30 accent-[#C9A84C]"
              />
              {isColor && <ColorPreview value={presetValue.value} selected={isChecked} />}
              <span>{label}</span>
              {alreadyExists && (
                <span className="text-[10px] uppercase tracking-wide text-white/30">
                  {language === "ar" ? "موجود" : "déjà présent"}
                </span>
              )}
            </label>
          )
        })}
      </div>

      {/* Valeur personnalisée */}
      {customValues.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {customValues.map((custom, index) => (
            <span
              key={`custom-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-2.5 py-1 text-xs text-[#E8C97E]"
            >
              {custom.value}
              {custom.valueAr && <span className="text-white/40">· {custom.valueAr}</span>}
              <button
                type="button"
                onClick={() => removeCustomValue(index)}
                aria-label={language === "ar" ? "إزالة" : "Retirer"}
                className="text-white/40 transition hover:text-rose-300"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {!showCustomForm ? (
        <button
          type="button"
          onClick={() => setShowCustomForm(true)}
          disabled={disabled}
          className="mb-3 inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-white/60 transition hover:text-[#E8C97E] disabled:opacity-40"
        >
          <Plus size={13} />
          {language === "ar"
            ? `إضافة ${unit.singular} مخصصة`
            : `Ajouter une ${unit.singular} personnalisée`}
        </button>
      ) : (
        <div className="mb-3 grid gap-2 rounded-lg border border-white/10 bg-black/20 p-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <input
            value={customDraft.value}
            onChange={(event) => setCustomDraft((prev) => ({ ...prev, value: event.target.value }))}
            placeholder={language === "ar" ? "الاسم (فرنسي)" : "Nom FR"}
            className="min-w-0 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]/50"
          />
          <input
            value={customDraft.valueAr}
            onChange={(event) => setCustomDraft((prev) => ({ ...prev, valueAr: event.target.value }))}
            placeholder={language === "ar" ? "الاسم (عربي)" : "Nom AR"}
            dir="rtl"
            className="min-w-0 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]/50"
          />
          <button
            type="button"
            onClick={addCustomValue}
            disabled={!customDraft.value.trim()}
            className="min-h-9 rounded-xl border border-[#C9A84C]/50 px-3 py-2 text-xs font-semibold text-[#E8C97E] transition hover:bg-[#C9A84C]/10 disabled:opacity-40"
          >
            {language === "ar" ? "إضافة" : "Ajouter"}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-white/50">{selectionCounterText}</p>
          {helperText && <p className="text-[11px] text-white/35">{helperText}</p>}
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={disabled || newCount === 0}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[#C9A84C]/50 bg-[#C9A84C]/10 px-4 py-2.5 text-xs font-semibold text-[#E8C97E] transition hover:bg-[#C9A84C]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={13} /> {confirmLabel}
        </button>
      </div>
    </div>
  )
}