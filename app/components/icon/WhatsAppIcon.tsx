import type { SVGProps } from "react"

/**
 * Icône WhatsApp autonome en SVG (aucune dépendance supplémentaire).
 * `currentColor` par défaut afin de pouvoir hériter la couleur via
 * className, tout en gardant l'identité visuelle reconnaissable.
 */
export default function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.36.62 4.57 1.78 6.5L4 29l7.66-1.76a12.9 12.9 0 0 0 4.36.76h.01C22.63 28 28 22.6 28 15.98 28 9.36 22.63 3 16.02 3zm7.14 18.06c-.3.85-1.5 1.56-2.44 1.76-.65.14-1.5.25-4.36-.94-3.65-1.5-6-5.18-6.18-5.42-.18-.24-1.47-1.96-1.47-3.74 0-1.78.93-2.65 1.26-3.02.3-.32.66-.4.88-.4.22 0 .44.01.63.01.2.01.47-.08.74.56.3.7.98 2.42 1.06 2.6.09.18.15.4.03.64-.12.24-.18.4-.36.6-.18.2-.37.45-.53.6-.18.18-.36.37-.16.72.2.35.9 1.5 1.94 2.43 1.34 1.2 2.46 1.57 2.82 1.75.36.18.57.15.78-.09.22-.24.9-1.05 1.14-1.4.24-.36.48-.3.8-.18.32.12 2.03.96 2.38 1.14.35.18.58.27.66.42.09.16.09.9-.21 1.76z" />
    </svg>
  )
}