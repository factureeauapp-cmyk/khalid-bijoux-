import { ProductAttributeValue } from "@/lib/store-types";
import { ColorPreview } from "./ColorPreview"



interface AttributeValueRowProps {
  value: ProductAttributeValue
  isColor: boolean
  labels: { valueFr: string; valueAr: string; remove: string }
  disabled?: boolean
  onChange: (patch: Partial<ProductAttributeValue>) => void
  onRemove: () => void
}

/**
 * Une seule ligne = une seule valeur d'attribut (FR / AR / suppression),
 * avec aperçu couleur optionnel. Utilisé exclusivement à l'intérieur d'un
 * `attribute.values.map(...)` — jamais sur la liste complète des attributs.
 */
export function AttributeValueRow({ value, isColor, labels, disabled, onChange, onRemove }: AttributeValueRowProps) {
  return (
    <div
      className={
        isColor
          ? "grid grid-cols-1 items-center gap-2 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto]"
          : "grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
      }
    >
      {isColor && (
        <div className="flex items-center gap-2 sm:justify-center">
          <ColorPreview value={value.value} size="md" />
        </div>
      )}

      <input
        value={value.value}
        onChange={(event) => onChange({ value: event.target.value })}
        placeholder={labels.valueFr}
        disabled={disabled}
        className="min-w-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition-colors focus:border-[#c9a84c]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C]/60"
      />
      <input
        value={value.valueAr ?? ""}
        onChange={(event) => onChange({ valueAr: event.target.value })}
        placeholder={labels.valueAr}
        dir="rtl"
        disabled={disabled}
        className="min-w-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition-colors focus:border-[#c9a84c]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C]/60"
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="min-h-11 rounded-2xl border border-rose-400/20 px-4 py-3 text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
        aria-label={labels.remove}
      >
        ×
      </button>
    </div>
  )
}