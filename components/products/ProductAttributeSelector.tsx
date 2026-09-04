"use client"

import type { ProductAttribute, ProductAttributeValue } from "@/lib/store-types"
import {
  getAttributeKey,
  getAttributeValueKey,
  getColorFromValue,
  isColorAttribute,
  isLightColorHex,
  normalizeAttributeValue,
} from "@/lib/products/attributes"

type Lang = "fr" | "ar"

interface ProductAttributeSelectorProps {
  /** UN SEUL attribut — jamais la liste complète (c'est ce qui empêche la répétition). */
  attribute: ProductAttribute
  /** Clé de la valeur actuellement sélectionnée pour cet attribut (getAttributeValueKey). */
  selectedValue?: string
  onSelect: (valueKey: string) => void
  language: Lang
}

/**
 * Affiche un attribut produit et ses valeurs, une seule fois chacun.
 *
 * Boucle unique attendue :
 *   attribute.values.map(...)
 * Ne fait JAMAIS `attributes.map(...)` — le composant n'a de toute façon
 * pas accès à la liste complète des attributs.
 *
 * - Couleur (isColorAttribute) -> cercles avec anneau doré + check au centre
 * - Autres (taille, pierre...) -> boutons pilule noir/doré
 *
 * Couleur déduite via getColorFromValue (lib existante) : aucun champ
 * colorHex n'est lu ni requis, aucune modification backend nécessaire.
 */
export default function ProductAttributeSelector({
  attribute,
  selectedValue,
  onSelect,
  language,
}: ProductAttributeSelectorProps) {
  const isColor = isColorAttribute(attribute)
  const attributeLabel = language === "ar" ? attribute.nameAr || attribute.name : attribute.name

  const valueLabel = (value: ProductAttributeValue) =>
    language === "ar" ? value.valueAr || value.value : value.value

  const selectedValueLabel = (() => {
    if (!selectedValue) return null
    const match = attribute.values.find(
      (rawValue) => getAttributeValueKey(normalizeAttributeValue(rawValue)) === selectedValue
    )
    return match ? valueLabel(normalizeAttributeValue(match)) : null
  })()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-white">{attributeLabel}</p>
        {selectedValueLabel && <span className="text-xs text-[#E8C97E]">{selectedValueLabel}</span>}
      </div>

      <div className={isColor ? "flex flex-wrap gap-4" : "flex flex-wrap gap-2"}>
        {attribute.values.map((rawValue) => {
          const value = normalizeAttributeValue(rawValue)
          const vKey = getAttributeValueKey(value)
          const selected = selectedValue === vKey
          const label = valueLabel(value)

          if (isColor) {
            const color = getColorFromValue(value.value)
            const light = isLightColorHex(color)

            return (
              <button
                key={vKey}
                type="button"
                onClick={() => onSelect(vKey)}
                aria-pressed={selected}
                aria-label={`${attributeLabel}: ${label}`}
                title={label}
                className="group flex min-w-[58px] flex-col items-center gap-2"
              >
                <span
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110 ${
                    selected
                      ? "ring-2 ring-[#C9A84C] ring-offset-2 ring-offset-[#0B0B0B]"
                      : "ring-1 ring-white/15"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {/* Bordure intérieure : garde les couleurs claires (blanc, argent) visibles sur fond sombre */}
                  <span className="absolute inset-1 rounded-full border border-white/20" aria-hidden="true" />

                  {selected && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={light ? "#111111" : "#FFFFFF"}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="relative z-10"
                      aria-hidden="true"
                    >
                      <path d="M5 12l4 4L19 7" />
                    </svg>
                  )}
                </span>

                <span
                  className={`max-w-[80px] text-center text-xs transition-colors ${
                    selected ? "font-medium text-[#E8C97E]" : "text-white/55 group-hover:text-white"
                  }`}
                >
                  {label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={vKey}
              type="button"
              onClick={() => onSelect(vKey)}
              aria-pressed={selected}
              aria-label={`${attributeLabel}: ${label}`}
              className={`min-h-11 min-w-11 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                selected
                  ? "border-[#C9A84C] bg-[#C9A84C]/15 text-[#E8C97E] shadow-[0_0_0_1px_rgba(201,168,76,0.25)]"
                  : "border-white/15 text-white/70 hover:border-[#C9A84C]/50 hover:text-[#E8C97E]"
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}