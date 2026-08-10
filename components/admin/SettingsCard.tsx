"use client"

import type { ReactNode } from "react"

interface SettingsCardProps {
  title: string
  description?: string
  children: ReactNode
}

/**
 * Bloc réutilisable pour chaque section de /admin/settings
 * (Profil, Mot de passe, Langue, Déconnexion). Purement présentationnel.
 */
export function SettingsCard({ title, description, children }: SettingsCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="font-cormorant text-xl text-white">{title}</h3>
      {description && <p className="mt-1 text-sm text-white/50">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}