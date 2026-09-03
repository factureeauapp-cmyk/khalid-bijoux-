type Lang = "fr" | "ar"

/**
 * Formatage centralisé des montants. Toujours dériver l'affichage depuis
 * un nombre réel (jamais de valeur codée en dur type "2825").
 */
export function formatCurrency(amount: number, language: Lang): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0
  const formatted = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(safeAmount)
  return language === "ar" ? `${formatted} درهم` : `${formatted} MAD`
}