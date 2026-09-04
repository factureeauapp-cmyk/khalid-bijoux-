import { Plus } from "lucide-react"
import { AttributeValueRow } from "./AttributeValueRow"
import { isColorAttribute, normalizeAttributeValue } from "@/lib/products/attributes"
import { cn } from "@/lib/utils"
import { ProductAttribute, ProductAttributeValue } from "@/lib/store-types"

interface AttributeCardProps {
  attribute: ProductAttribute
  index: number
  total: number
  labels: {
    name: string
    nameAr: string
    valueFr: string
    valueAr: string
    addValue: string
    remove: string
    moveUp: string
    moveDown: string
    placeholder: string
  }
  disabled?: boolean
  onChange: (patch: Partial<ProductAttribute>) => void
  onRemove: () => void
  onMove: (direction: -1 | 1) => void
}

/**
 * Carte indépendante pour UN attribut. Boucle unique sur
 * `attribute.values.map(...)` — jamais sur la liste complète des attributs
 * (voir le bug historique de répétition).
 */
export function AttributeCard({ attribute, index, total, labels, disabled, onChange, onRemove, onMove }: AttributeCardProps) {
  const isColor = isColorAttribute(attribute)
  const createValueId = () => crypto.randomUUID()

  const updateValue = (valueIndex: number, patch: Partial<ProductAttributeValue>) =>
    onChange({
      values: attribute.values.map((entry, currentIndex) =>
        currentIndex === valueIndex ? { ...normalizeAttributeValue(entry), ...patch } : normalizeAttributeValue(entry)
      ),
    })

  const removeValue = (valueIndex: number) =>
    onChange({ values: attribute.values.filter((_, currentIndex) => currentIndex !== valueIndex) })

  const addValue = () =>
    onChange({ values: [...attribute.values, { id: createValueId(), value: "", valueAr: "" }] })

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/15">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-medium text-white/80">
          {attribute.name || labels.placeholder}
        </p>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={disabled || index === 0}
            className="min-h-9 min-w-9 rounded-lg px-2 py-1 text-white/60 transition hover:bg-white/10 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C]/60"
            aria-label={labels.moveUp}
            title={labels.moveUp}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={disabled || index === total - 1}
            className="min-h-9 min-w-9 rounded-lg px-2 py-1 text-white/60 transition hover:bg-white/10 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C]/60"
            aria-label={labels.moveDown}
            title={labels.moveDown}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="min-h-9 min-w-9 rounded-lg px-2 py-1 text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
            aria-label={labels.remove}
            title={labels.remove}
          >
            ×
          </button>
        </div>
      </div>

      {/* Nom FR / AR */}
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={attribute.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder={labels.name}
          disabled={disabled}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition-colors focus:border-[#c9a84c]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C]/60"
        />
        <input
          value={attribute.nameAr ?? ""}
          onChange={(event) => onChange({ nameAr: event.target.value })}
          placeholder={labels.nameAr}
          dir="rtl"
          disabled={disabled}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition-colors focus:border-[#c9a84c]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C]/60"
        />
      </div>

      {/* Valeurs — boucle unique */}
      <div className={cn("mt-3 space-y-2", isColor && "space-y-2.5")}>
        {attribute.values.map((rawValue, valueIndex) => {
          const value = normalizeAttributeValue(rawValue)
          return (
            <AttributeValueRow
              key={`${attribute.id ?? index}-${valueIndex}`}
              value={value}
              isColor={isColor}
              labels={labels}
              disabled={disabled}
              onChange={(patch) => updateValue(valueIndex, patch)}
              onRemove={() => removeValue(valueIndex)}
            />
          )
        })}

        <button
          type="button"
          onClick={addValue}
          disabled={disabled}
          className="inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-[#E8C97E] transition hover:text-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C]/60"
        >
          <Plus size={14} /> {labels.addValue}
        </button>
      </div>
    </div>
  )
}