"use client"

interface LanguageTabsProps {
  activeTab: "fr" | "ar"
  onTabChange: (tab: "fr" | "ar") => void
}

export function LanguageTabs({ activeTab, onTabChange }: LanguageTabsProps) {
  return (
    <div className="flex gap-2 rounded-2xl border border-white/10 bg-black/30 p-1">
      <button
        onClick={() => onTabChange("fr")}
        className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === "fr"
            ? "bg-[#c9a84c]/20 text-[#c9a84c]"
            : "text-white/60 hover:text-white"
        }`}
      >
        🇫🇷 Français
      </button>
      <button
        onClick={() => onTabChange("ar")}
        className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === "ar"
            ? "bg-[#c9a84c]/20 text-[#c9a84c]"
            : "text-white/60 hover:text-white"
        }`}
      >
        🇸🇦 العربية
      </button>
    </div>
  )
}
