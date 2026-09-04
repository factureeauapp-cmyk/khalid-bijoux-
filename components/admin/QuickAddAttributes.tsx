"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Zap } from "lucide-react"
import { QuickAddAttributePanel, type AttributePreset, type AttributePresetValue } from "./QuickAddAttributePanel"
import { ColorPreview } from "./ColorPreview"
import { isColorAttribute } from "@/lib/products/attributes"

import type { ProductAttribute } from "@/lib/store-types"

import { cn } from "@/lib/utils"

// ============================================================================
// PRESETS — pure UX helper pour l'admin (jamais référencé par le storefront).
// Modifier cette liste ne change que ce qui est proposé en ajout rapide.
// ============================================================================

const ATTRIBUTE_PRESETS: AttributePreset[] = [
  {
    id: "size",
    name: "Taille",
    nameAr: "المقاس",
    unitLabel: { fr: { singular: "taille", plural: "tailles" }, ar: { singular: "مقاس", plural: "مقاسات" } },
    values: [
      { value: "5", valueAr: "5" },
      { value: "6", valueAr: "6" },
      { value: "7", valueAr: "7" },
      { value: "8", valueAr: "8" },
      { value: "9", valueAr: "9" },
      { value: "10", valueAr: "10" },
      { value: "11", valueAr: "11" },
      { value: "12", valueAr: "12" },
    ],
  },
  {
    id: "color",
    name: "Couleur",
    nameAr: "اللون",
    unitLabel: { fr: { singular: "couleur", plural: "couleurs" }, ar: { singular: "لون", plural: "ألوان" } },
   values: [
  { value: "Or jaune", valueAr: "ذهب أصفر" },
  { value: "Argent", valueAr: "فضي" },
  { value: "Or blanc", valueAr: "ذهب أبيض" },
  { value: "Or rose", valueAr: "ذهب وردي" },
  { value: "Noir", valueAr: "أسود" },
  { value: "Champagne", valueAr: "شامبانيا" },
  { value: "Bronze", valueAr: "برونزي" },
    ],
  },
  {
    id: "material",
    name: "Matière",
    nameAr: "المادة",
    unitLabel: { fr: { singular: "matière", plural: "matières" }, ar: { singular: "مادة", plural: "مواد" } },
    values: [
      { value: "Argent 925", valueAr: "فضة 925" },
      { value: "Acier inoxydable", valueAr: "ستانلس ستيل" },
      { value: "Plaqué or", valueAr: "مطلي بالذهب" },
      { value: "Or", valueAr: "ذهب" },
      { value: "Laiton", valueAr: "نحاس أصفر" },
    ],
  },
  {
    id: "stone",
    name: "Pierre",
    nameAr: "الحجر",
    unitLabel: { fr: { singular: "pierre", plural: "pierres" }, ar: { singular: "حجر", plural: "أحجار" } },
    values: [
      { value: "Diamant", valueAr: "الماس" },
      { value: "Zircon", valueAr: "زركون" },
      { value: "Cristal", valueAr: "كريستال" },
      { value: "Perle", valueAr: "لؤلؤة" },
      { value: "Rubis", valueAr: "ياقوت أحمر" },
      { value: "Saphir", valueAr: "ياقوت أزرق" },
      { value: "Émeraude", valueAr: "زمرد" },
      { value: "Sans pierre", valueAr: "بدون حجر" },
    ],
  },
  {
    id: "length",
    name: "Longueur",
    nameAr: "الطول",
    unitLabel: { fr: { singular: "longueur", plural: "longueurs" }, ar: { singular: "طول", plural: "أطوال" } },
    values: [
      { value: "40 cm", valueAr: "40 سم" },
      { value: "45 cm", valueAr: "45 سم" },
      { value: "50 cm", valueAr: "50 سم" },
      { value: "55 cm", valueAr: "55 سم" },
      { value: "60 cm", valueAr: "60 سم" },
    ],
  },
]

interface QuickAddAttributesProps {
  attributes: ProductAttribute[]
  onAdd: (name: string, nameAr: string, values: AttributePresetValue[]) => void
  disabled?: boolean
  language: "fr" | "ar"
}

/**
 * "⚡ Ajout rapide" — ligne de presets + panneau de sélection multiple.
 * Ne crée jamais un attribut vide au clic : ouvre d'abord un panneau de
 * sélection (QuickAddAttributePanel), la création/fusion se fait uniquement
 * à la confirmation (`onAdd`), qui gère elle-même la dé-duplication.
 */
export function QuickAddAttributes({ attributes, onAdd, disabled, language }: QuickAddAttributesProps) {
  const [openPresetId, setOpenPresetId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(null), 2500)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const togglePreset = (presetId: string) => {
    setOpenPresetId((current) => (current === presetId ? null : presetId))
  }

  const findExistingAttribute = (preset: AttributePreset) =>
    attributes.find((attribute) => attribute.name.trim().toLowerCase() === preset.name.toLowerCase())

  const handleConfirm = (preset: AttributePreset, values: AttributePresetValue[]) => {
    onAdd(preset.name, preset.nameAr, values)
    setOpenPresetId(null)

    const unit = language === "ar" ? preset.unitLabel.ar : preset.unitLabel.fr
    const label = values.length === 1 ? unit.singular : unit.plural
    setFeedback(
      language === "ar"
        ? `✓ تمت إضافة ${values.length} ${label}`
        : `✓ ${values.length} ${label} ajoutée${values.length > 1 ? "s" : ""}`
    )
  }

  const openPreset = ATTRIBUTE_PRESETS.find((preset) => preset.id === openPresetId)

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="mb-4 space-y-2.5 rounded-2xl border border-[#C9A84C]/15 bg-black/20 p-3.5">
      <div className="flex items-center gap-2 text-[#E8C97E]">
        <Zap size={15} />
        <p className="text-xs font-semibold uppercase tracking-wide">
          {language === "ar" ? "إضافة سريعة" : "Ajout rapide"}
        </p>
      </div>
      <p className="text-xs text-white/45">
        {language === "ar"
          ? "أضف الخيارات الأكثر استخدامًا ببضع نقرات."
          : "Ajoutez les options les plus utilisées en quelques clics."}
      </p>

      <div className="flex flex-wrap gap-2">
        {ATTRIBUTE_PRESETS.map((preset) => {
          const existing = findExistingAttribute(preset)
          const isOpen = openPresetId === preset.id
          const isColor = preset.id === "color"

          return (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => togglePreset(preset.id)}
              aria-pressed={isOpen}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-40",
                isOpen
                  ? "border-[#C9A84C] bg-[#C9A84C]/15 text-[#E8C97E]"
                  : "border-white/15 text-white/70 hover:border-[#C9A84C]/50 hover:text-[#E8C97E]"
              )}
            >
              {isColor && existing && <ColorPreview value={existing.values[0]?.value ?? preset.values[0].value} />}
              {language === "ar" ? preset.nameAr : preset.name}
              {existing && <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" aria-hidden="true" />}
              <ChevronDown size={12} className={cn("transition-transform", isOpen && "rotate-180")} />
            </button>
          )
        })}
      </div>

      {openPreset && (
        <QuickAddAttributePanel
          preset={openPreset}
          existingAttribute={findExistingAttribute(openPreset)}
          language={language}
          disabled={disabled}
          onConfirm={(values) => handleConfirm(openPreset, values)}
          onClose={() => setOpenPresetId(null)}
        />
      )}

      {feedback && (
        <p role="status" className="text-xs font-medium text-emerald-300">
          {feedback}
        </p>
      )}
    </div>
  )
}