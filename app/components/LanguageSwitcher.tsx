"use client"

import { useTransition } from "react"
import { languages } from "@/lib/i18n"
import { useAppContext } from "@/app/providers/AppContext"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useAppContext()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
      {languages.map((entry) => (
        <button
          key={entry.code}
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => setLanguage(entry.code))}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            language === entry.code ? "bg-[#c9a84c] text-black" : "text-white/70 hover:text-white"
          } ${isPending ? "opacity-50" : ""}`}
        >
          {entry.code === "fr" ? "FR" : "AR"}
        </button>
      ))}
    </div>
  )
}
