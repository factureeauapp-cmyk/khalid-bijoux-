"use client"

import { useAppContext } from "@/app/providers/AppContext"

export interface StockHistoryEntry {
  id: string
  productName: string
  previousQuantity: number
  newQuantity: number
  timestamp: string
}

interface StockHistoryProps {
  entries: StockHistoryEntry[]
}

/**
 * Historique des modifications de stock.
 * ⚠️ Aucun endpoint d'historique n'existait dans le fichier fourni :
 * cet historique est donc tenu en mémoire côté client (state local de
 * stock/page.tsx), réinitialisé au rechargement de la page.
 * Si une API d'historique existe côté Spring Boot, il suffit de remplacer
 * la source de "entries" dans stock/page.tsx par un fetch — ce composant
 * n'a pas besoin de changer.
 */
export function StockHistory({ entries }: StockHistoryProps) {
  const { language, t } = useAppContext() as any
  const adminT = t("admin")

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="mb-4 font-cormorant text-xl text-white">{adminT.recentHistory}</h3>

      {entries.length === 0 ? (
        <p className="text-sm text-white/40">{adminT.noHistoryYet}</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between text-sm">
              <span className="text-white">{entry.productName}</span>
              <span className="text-white/50">
                {entry.previousQuantity} → <span className="text-[#c9a84c]">{entry.newQuantity}</span>
              </span>
              <span className="text-xs text-white/30">{entry.timestamp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}