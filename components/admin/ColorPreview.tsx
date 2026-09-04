import { getColorFromValue, isLightColorHex } from "@/lib/products/attributes"
import { cn } from "@/lib/utils"

interface ColorPreviewProps {
  /** Nom de la valeur (ex: "Doré", "Argent") — la couleur est déduite, jamais stockée. */
  value: string
  size?: "sm" | "md"
  selected?: boolean
  className?: string
}

/**
 * Aperçu visuel uniquement. La couleur est calculée à la volée via
 * getColorFromValue() — jamais persistée, jamais de colorHex.
 */
export function ColorPreview({ value, size = "sm", selected, className }: ColorPreviewProps) {
  const hex = getColorFromValue(value)
  const light = isLightColorHex(hex)
  const dimension = size === "sm" ? "h-4 w-4" : "h-6 w-6"

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block shrink-0 rounded-full transition-shadow",
        dimension,
        // Bordure visible pour les couleurs claires (blanc, argent) sur fond sombre
        light ? "border border-white/40" : "border border-white/10",
        selected && "ring-2 ring-[#C9A84C] ring-offset-1 ring-offset-[#0B0B0B]",
        className
      )}
      style={{ backgroundColor: hex }}
    />
  )
}